// Supabase Edge Function — test à usage unique de l'email de confirmation.
//
// Envoie à l'adresse du propriétaire l'email exact qu'un client reçoit après
// avoir payé, en réutilisant le même Resend et le même modèle que
// sumup-webhook. Sert à vérifier la chaîne d'envoi sans encaisser un paiement
// réel.
//
// Deux garde-fous, parce que la clé anon du site est publique :
//   - le destinataire est figé (impossible d'envoyer ailleurs) ;
//   - un seul envoi : la fonction s'auto-désactive en relisant email_log.
//
// Une fois le test fait, cette fonction ne sert plus à rien et peut être
// supprimée depuis le tableau de bord Supabase.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "Harmonie Yacht <reservations@harmonie-yacht.fr>";
const OWNER_EMAIL = "harmonieyacht@gmail.com";
const SELFTEST_SOURCE = "sumup-selftest";

function formatDateFr(dateOnly: string): string {
  const d = new Date(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return dateOnly;
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/* Copie conforme du modèle de sumup-webhook — si ce dernier change, ce test
   n'a plus de valeur et doit être supprimé plutôt que maintenu. */
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
    `Une question d'ici là ? Répondez à cet email, ou écrivez-nous à ${OWNER_EMAIL}.`,
    "",
    "À très vite,",
    "L'équipe Harmonie Yacht",
  );
  return lines.join("\n");
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  if (!RESEND_API_KEY) return json({ error: "RESEND_API_KEY manquant" }, 500);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: already } = await supabase
    .from("email_log")
    .select("id, sent_at")
    .eq("source", SELFTEST_SOURCE)
    .limit(1)
    .maybeSingle();

  if (already) {
    return json({ ok: false, reason: "test déjà effectué", sent_at: already.sent_at });
  }

  // Une nuit à quai : réglée en totalité, aucun solde à bord.
  const dateLabel = formatDateFr("2026-09-20");
  const text = confirmationEmailText({
    firstName: "Robin",
    bookingTypeLabel: "Nuit à quai — petit-déjeuner",
    group: "nuit",
    dateLabel,
    total: 250,
    deposit: 250,
    balance: 0,
  });
  const subject = "[Test] Réservation confirmée — Nuit à quai — petit-déjeuner";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM, to: [OWNER_EMAIL], subject, text }),
  });

  const detail = await res.text();
  if (!res.ok) {
    console.error("[sumup-selftest] Resend error", res.status, detail);
    return json({ ok: false, resend_status: res.status, detail }, 502);
  }

  await supabase.from("email_log").insert({ to_email: OWNER_EMAIL, subject, source: SELFTEST_SOURCE });

  return json({ ok: true, to: OWNER_EMAIL, subject, from: RESEND_FROM, preview: text });
});
