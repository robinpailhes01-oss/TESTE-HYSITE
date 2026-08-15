// Supabase Edge Function — reçoit les webhooks Stripe du site harmonie-yacht
// (checkout.session.completed) et écrit DIRECTEMENT dans les mêmes tables que
// le tableau de bord. Aucune logique de calendrier ou de compta à dupliquer
// ici : trg_bookings_sync_gcal et trg_bookings_to_revenues (triggers déjà en
// place sur public.bookings) s'en chargent automatiquement dès l'insertion.
//
// Contrat :
//   - Stripe appelle cette fonction en POST avec le header "stripe-signature".
//   - On ne traite que checkout.session.completed avec payment_status="paid".
//   - Le montant encaissé vient de session.amount_total (jamais recalculé ici :
//     il a déjà été fixé côté serveur par api/create-checkout-session.ts à
//     partir de src/pricing.ts — cette fonction fait confiance à Stripe, dont
//     la signature garantit que la session n'a pas été altérée en transit).
//   - Idempotence : stripe_session_id est UNIQUE sur bookings — un retry
//     Stripe du même événement ne crée pas de doublon (conflit → on renvoie
//     200 sans rien recréer, pour que Stripe arrête de réessayer).
//
// Secrets attendus (Supabase → Edge Functions → Secrets) :
//   STRIPE_SECRET_KEY          même clé que côté Vercel (sk_live_... / sk_test_...)
//   STRIPE_WEBHOOK_SECRET      signature du endpoint (whsec_...), donnée par Stripe
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   déjà présents (partagés par les autres fonctions)
//   RESEND_API_KEY, RESEND_FROM               déjà présents (partagés par booking-form-webhook)
//   OWNER_EMAIL                 (optionnel) pour une future alerte à Robin

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "Harmonie Yacht <reservations@harmonie-yacht.fr>";
const CONTACT_EMAIL = "harmonieyacht@gmail.com";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const BOOKING_TYPE_LABEL: Record<string, string> = {
  sortie_privative: "sortie en mer",
  nuit_prestige: "nuit Prestige",
  nuit_insolite: "nuit Insolite",
};

function formatDateFr(dateOnly: string): string {
  // dateOnly = "YYYY-MM-DD" — lu en UTC minuit, formaté en UTC pour ne
  // jamais glisser d'un jour selon le fuseau d'exécution.
  const d = new Date(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return dateOnly;
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function splitName(full: string): { first: string; last: string | null } {
  const parts = full.trim().split(/\s+/);
  return { first: parts[0] || full, last: parts.length > 1 ? parts.slice(1).join(" ") : null };
}

function confirmationEmailText(opts: {
  firstName: string;
  bookingTypeLabel: string;
  group: string;
  dateLabel: string;
  total: number;
  deposit: number;
  balance: number;
}): string {
  const { firstName, bookingTypeLabel, group, dateLabel, total, deposit, balance } = opts;
  const lines = [
    `Bonjour ${firstName},`,
    "",
    `Votre acompte est bien reçu — votre ${bookingTypeLabel} est réservée pour le ${dateLabel}.`,
    "",
    "Récapitulatif :",
    `- Prestation : ${bookingTypeLabel}`,
    `- Date souhaitée : ${dateLabel}`,
    `- Montant total : ${total} €`,
    `- Acompte réglé en ligne : ${deposit} €`,
    `- Solde restant : ${balance} € — à régler à bord (CB ou espèces) avant l'embarquement`,
    "",
    "Rendez-vous : Port de Carnon (Hérault), à côté de l'Hôtel Neptune. Le yacht Harmonie vous attend au ponton — nous revenons vers vous sous peu pour préciser l'heure exacte et le numéro de ponton.",
  ];

  if (group === "sortie") {
    lines.push(
      "",
      "À savoir : en cas de retard à l'embarquement, la sortie ne peut pas être décalée — le retard empiète directement sur la durée de votre créneau.",
    );
  } else {
    lines.push("", "Le petit-déjeuner sur plateau du lendemain est inclus, servi jusqu'à 10 h.");
  }

  lines.push(
    "",
    "En cas de météo défavorable, nous vous recontactons avant le départ pour convenir d'un report ou d'un remboursement.",
    "",
    `Une question d'ici là ? Répondez à cet email, ou écrivez-nous à ${CONTACT_EMAIL}.`,
    "",
    "À très vite,",
    "L'équipe Harmonie Yacht",
  );
  return lines.join("\n");
}

async function sendConfirmationEmail(to: string, subject: string, text: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[stripe-webhook] RESEND_API_KEY manquant — email de confirmation non envoyé.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, text }),
    });
    if (!res.ok) {
      console.error("[stripe-webhook] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[stripe-webhook] Resend fetch failed", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  if (!STRIPE_WEBHOOK_SECRET) return new Response("STRIPE_WEBHOOK_SECRET manquant", { status: 500 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("missing stripe-signature header", { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, STRIPE_WEBHOOK_SECRET, undefined, cryptoProvider);
  } catch (err) {
    console.error("[stripe-webhook] signature invalide", err);
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true, ignored: event.type }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return new Response(JSON.stringify({ received: true, unpaid: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const md = session.metadata ?? {};
  const bookingType = md.bookingType ?? "";
  const group = md.group ?? "";
  const formule = md.formule ?? BOOKING_TYPE_LABEL[bookingType] ?? "réservation";
  const nom = md.nom ?? "Client";
  const email = md.email || session.customer_details?.email || session.customer_email || "";
  const dateOnly = md.date ?? "";
  const startTime = md.startTime || null;
  const endTime = md.endTime || null;
  const montantTotal = Number(md.montantTotal ?? 0);
  const invites = md.invites ? Number.parseInt(md.invites, 10) : null;
  const message = md.message || null;
  const depositPaid = session.amount_total !== null ? session.amount_total / 100 : Number(md.acompte ?? 0);

  if (!["sortie_privative", "nuit_prestige", "nuit_insolite"].includes(bookingType)) {
    console.error("[stripe-webhook] booking_type inconnu dans les métadonnées", bookingType, session.id);
    return new Response(JSON.stringify({ received: true, error: "booking_type inconnu" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Client : on retrouve par email, sinon on crée.
  let customerId: string | null = null;
  if (email) {
    const { data: existing } = await supabase.from("customers").select("id").eq("email", email).maybeSingle();
    customerId = existing?.id ?? null;
  }
  if (!customerId) {
    const { first, last } = splitName(nom);
    const { data: created, error } = await supabase
      .from("customers")
      .insert({ first_name: first, last_name: last, email: email || null, acquisition_channel: "website" })
      .select("id")
      .single();
    if (error) {
      console.error("[stripe-webhook] création client échouée", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    customerId = created.id;
  }

  // Réservation — l'insertion déclenche automatiquement (triggers existants) :
  //  - trg_link_booking_to_lead   : rattache le lead correspondant (email/tél)
  //  - trg_bookings_sync_gcal     : crée l'événement Google Calendar
  //  - trg_bookings_to_revenues   : enregistre l'acompte encaissé en compta
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      customer_id: customerId,
      booking_type: bookingType,
      date: dateOnly || null,
      start_time: startTime,
      end_time: endTime,
      offer_name: formule,
      party_size: invites,
      total_amount: montantTotal,
      deposit_amount: depositPaid,
      deposit_paid: true,
      balance_due: montantTotal - depositPaid,
      payment_method: "stripe",
      status: "confirmed",
      source_channel: "website",
      notes: message,
      stripe_session_id: session.id,
    })
    .select("id, lead_id")
    .single();

  if (bookingError) {
    // Conflit sur stripe_session_id = retry Stripe d'un événement déjà traité.
    if (bookingError.code === "23505") {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    console.error("[stripe-webhook] création réservation échouée", bookingError);
    return new Response(JSON.stringify({ error: bookingError.message }), { status: 500 });
  }

  // Le lead correspondant (s'il existe) passe à "booked" — c'est le seul
  // mécanisme autorisé à poser ce statut (ni Léa ni le client, cf. agent-lea).
  if (booking.lead_id) {
    await supabase
      .from("leads")
      .update({ status: "booked", needs_human_intervention: false, updated_at: new Date().toISOString() })
      .eq("id", booking.lead_id);
  }

  const dateLabel = dateOnly ? formatDateFr(dateOnly) : "une date à confirmer";
  const { first } = splitName(nom);
  const subject = `Réservation confirmée — ${formule}`;
  const text = confirmationEmailText({
    firstName: first,
    bookingTypeLabel: formule,
    group,
    dateLabel,
    total: montantTotal,
    deposit: depositPaid,
    balance: montantTotal - depositPaid,
  });

  const emailSent = email ? await sendConfirmationEmail(email, subject, text) : false;
  if (emailSent && email) {
    await supabase.from("email_log").insert({
      lead_id: booking.lead_id ?? null,
      to_email: email,
      subject,
      source: "stripe-webhook",
    });
  }

  return new Response(
    JSON.stringify({ received: true, booking_id: booking.id, lead_linked: !!booking.lead_id, email_sent: emailSent }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
});
