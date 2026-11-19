-- Table des intentions de réservation, écrite par api/create-checkout.ts AVANT
-- le paiement SumUp, puis relue par la fonction sumup-webhook.
-- À coller dans Supabase → SQL Editor → Run. Sans danger si on la relance.

create table if not exists public.pending_checkouts (
  reference          uuid primary key,
  price_id           text not null,
  booking_type       text not null,
  price_group        text,
  formule            text,
  customer_name      text,
  customer_email     text,
  booking_date       date,
  start_time         time,
  end_time           time,
  party_size         integer,
  message            text,
  promo_code         text,
  total_amount       numeric(10,2) not null,
  deposit_amount     numeric(10,2) not null,
  sumup_checkout_id  text,
  status             text not null default 'pending',
  paid_at            timestamptz,
  created_at         timestamptz not null default now()
);

-- RLS sans aucune policy : seul le service_role (serveur) y accède.
alter table public.pending_checkouts enable row level security;
