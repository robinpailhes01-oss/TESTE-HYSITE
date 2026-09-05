// Supabase Edge Function — reçoit le callback SumUp du site harmonie-yacht et
// écrit DIRECTEMENT dans les mêmes tables que le tableau de bord. Aucune
// logique de calendrier ou de compta à dupliquer ici : trg_bookings_sync_gcal
// et trg_bookings_to_revenues (triggers déjà en place sur public.bookings)
// s'en chargent automatiquement dès l'insertion.
//
// Contrat :
//   - SumUp appelle cette fonction en POST sur l'URL passée en return_url à la
//     création du checkout, avec notre référence en query string (?ref=...).
//   - Le corps envoyé par SumUp n'est jamais cru sur parole : on relit le
//     checkout via l'API SumUp avec notre clé secrète, et on n'enregistre la
//     réservation que si son statut est PAID et son montant égal au montant dû
//     en ligne calculé côté serveur (api/create-checkout.ts, à partir de
//     src/pricing.ts). Cette vérification remplace la signature de Stripe.
//   - Idempotence : bookings.payment_ref est UNIQUE — un rejeu du même
//     callback ne crée pas de doublon (conflit → 200 sans rien recréer).
//
// Secrets attendus (Supabase → Edge Functions → Secrets) :
//   SUMUP_API_KEY                             clé secrète SumUp (sup_sk_...), la même que côté Vercel
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   déjà présents (partagés par les autres fonctions)
//   RESEND_API_KEY, RESEND_FROM               déjà présents (partagés par booking-form-webhook)
//
// Déployée avec verify_jwt = false : SumUp ne peut pas présenter de JWT
// Supabase. L'authentification de l'appel se fait par la re-vérification du
// paiement auprès de SumUp, pas par un en-tête.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUMUP_API_KEY = Deno.env.get("SUMUP_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "Harmonie Yacht <reservations@harmonie-yacht.fr>";
const CONTACT_EMAIL = "harmonieyacht@gmail.com";
const SUMUP_CHECKOUTS_URL = "https://api.sumup.com/v0.1/checkouts";

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
  // Les nuits à quai sont réglées en totalité en ligne : il n'y a pas de solde
  // à annoncer, et le mot « acompte » n'aurait aucun sens.
  const payFull = balance <= 0;
  const lines = [
    `Bonjour ${firstName},`,
    "",
    `Votre ${payFull ? "paiement" : "acompte"} est bien reçu — votre ${bookingTypeLabel} est réservée pour le ${dateLabel}.`,
    "",
    "Récapitulatif :",
    `- Prestation : ${bookingTypeLabel}`,
    `- Date souhaitée : ${dateLabel}`,
    `- Montant total : ${total} €`,
    payFull
      ? `- Réglé en ligne : ${deposit} € — rien à régler à bord`
      : `- Acompte réglé en ligne : ${deposit} €`,
    ...(payFull ? [] : [`- Solde restant : ${balance} € — à régler à bord (CB ou espèces) avant l'embarquement`]),
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
    console.warn("[sumup-webhook] RESEND_API_KEY manquant — email de confirmation non envoyé.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, text }),
    });
    if (!res.ok) {
      console.error("[sumup-webhook] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[sumup-webhook] Resend fetch failed", e);
    return false;
  }
}

const ok = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });

type SumUpCheckout = { id?: string; status?: string; amount?: number; checkout_reference?: string };

/* Relit le checkout chez SumUp. C'est cette lecture, et elle seule, qui fait
   foi : le corps du callback pourrait venir de n'importe qui. */
async function fetchCheckout(reference: string, checkoutId: string | null): Promise<SumUpCheckout | null> {
  const url = checkoutId
    ? `${SUMUP_CHECKOUTS_URL}/${encodeURIComponent(checkoutId)}`
    : `${SUMUP_CHECKOUTS_URL}?checkout_reference=${encodeURIComponent(reference)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${SUMUP_API_KEY}` } });
  if (!res.ok) {
    console.error("[sumup-webhook] lecture du checkout impossible", res.status, await res.text());
    return null;
  }
  const payload = (await res.json()) as SumUpCheckout | SumUpCheckout[];
  return Array.isArray(payload) ? payload[0] ?? null : payload;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  if (!SUMUP_API_KEY) return new Response("SUMUP_API_KEY manquant", { status: 500 });

  const url = new URL(req.url);
  let reference = url.searchParams.get("ref") ?? "";

  // Le format exact du corps envoyé par SumUp n'est pas contractuel : on
  // l'accepte s'il apporte la référence, sans jamais en dépendre.
  if (!reference) {
    try {
      const body = (await req.json()) as Record<string, unknown>;
      const candidate = body.checkout_reference ?? body.reference ?? "";
      if (typeof candidate === "string") reference = candidate;
    } catch {
      // corps vide ou non JSON — on continue, la référence viendra de l'URL.
    }
  }

  if (!reference) {
    console.error("[sumup-webhook] callback sans référence");
    return ok({ received: true, ignored: "no reference" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: pending, error: pendingError } = await supabase
    .from("pending_checkouts")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (pendingError || !pending) {
    console.error("[sumup-webhook] intention de réservation introuvable", reference, pendingError);
    return ok({ received: true, ignored: "unknown reference" });
  }

  if (pending.status === "paid") {
    return ok({ received: true, already_handled: true });
  }

  const checkout = await fetchCheckout(reference, pending.sumup_checkout_id);
  if (!checkout) return new Response("checkout illisible", { status: 502 });

  if (checkout.status !== "PAID") {
    await supabase
      .from("pending_checkouts")
      .update({ status: String(checkout.status ?? "unknown").toLowerCase() })
      .eq("reference", reference);
    return ok({ received: true, unpaid: true, status: checkout.status });
  }

  const amountExpected = Number(pending.deposit_amount);
  const amountPaid = Number(checkout.amount ?? 0);
  if (Math.abs(amountPaid - amountExpected) > 0.01) {
    console.error("[sumup-webhook] montant encaissé différent du montant attendu", {
      reference,
      amountPaid,
      amountExpected,
    });
    return ok({ received: true, error: "montant inattendu" });
  }

  const bookingType = pending.booking_type ?? "";
  if (!["sortie_privative", "nuit_prestige", "nuit_insolite"].includes(bookingType)) {
    console.error("[sumup-webhook] booking_type inconnu", bookingType, reference);
    return ok({ received: true, error: "booking_type inconnu" });
  }

  const nom = pending.customer_name ?? "Client";
  const email = pending.customer_email ?? "";
  const formule = pending.formule ?? BOOKING_TYPE_LABEL[bookingType] ?? "réservation";
  const group = pending.price_group ?? "";
  const dateOnly = pending.booking_date ?? "";
  const montantTotal = Number(pending.total_amount ?? 0);
  const paymentRef = checkout.id ?? pending.sumup_checkout_id ?? reference;

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
      console.error("[sumup-webhook] création client échouée", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    customerId = created.id;
  }

  // Réservation — l'insertion déclenche automatiquement (triggers existants) :
  //  - trg_link_booking_to_lead   : rattache le lead correspondant (email/tél)
  //  - trg_bookings_sync_gcal     : crée l'événement Google Calendar
  //  - trg_bookings_to_revenues   : enregistre l'encaissement en compta
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      customer_id: customerId,
      booking_type: bookingType,
      date: dateOnly || null,
      start_time: pending.start_time,
      end_time: pending.end_time,
      offer_name: formule,
      party_size: pending.party_size,
      total_amount: montantTotal,
      deposit_amount: amountPaid,
      deposit_paid: true,
      balance_due: montantTotal - amountPaid,
      payment_method: "sumup",
      status: "confirmed",
      source_channel: "website",
      notes: pending.message,
      payment_ref: paymentRef,
    })
    .select("id, lead_id")
    .single();

  if (bookingError) {
    // Conflit sur payment_ref = rejeu d'un callback déjà traité.
    if (bookingError.code === "23505") {
      await supabase
        .from("pending_checkouts")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("reference", reference);
      return ok({ received: true, already_handled: true });
    }
    console.error("[sumup-webhook] création réservation échouée", bookingError);
    return new Response(JSON.stringify({ error: bookingError.message }), { status: 500 });
  }

  await supabase
    .from("pending_checkouts")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("reference", reference);

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
    deposit: amountPaid,
    balance: montantTotal - amountPaid,
  });

  const emailSent = email ? await sendConfirmationEmail(email, subject, text) : false;
  if (emailSent && email) {
    await supabase.from("email_log").insert({
      lead_id: booking.lead_id ?? null,
      to_email: email,
      subject,
      source: "sumup-webhook",
    });
  }

  return ok({ received: true, booking_id: booking.id, lead_linked: !!booking.lead_id, email_sent: emailSent });
});
