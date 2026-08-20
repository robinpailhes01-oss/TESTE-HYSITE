import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router'

const CONTACT_EMAIL = 'harmonieyacht@gmail.com'
const COMPANY_ADDRESS = '61 rue du Rouet, 13008 Marseille, France'

function LegalShell({ kicker, title, children }: { kicker: string; title: ReactNode; children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="page">
      <section className="legal-hero on-ocean-deep on-ocean">
        <div className="container">
          <Link to="/" className="page-hero__back">
            ← Retour à l’accueil
          </Link>
          <p className="kicker" style={{ marginTop: 18 }}>
            {kicker}
          </p>
          <h1 className="mixed legal-hero__title">{title}</h1>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container legal-body">{children}</div>
      </section>
    </main>
  )
}

export function MentionsLegales() {
  return (
    <LegalShell kicker="Informations légales" title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site harmonie-yacht.fr est édité par <strong>Harmonie Group</strong>, société par
        actions simplifiée (SAS) dont le siège social est situé au {COMPANY_ADDRESS}.
      </p>
      <ul>
        <li>SIREN : 991 738 733</li>
        <li>SIRET (siège social) : 991 738 733 00013</li>
        <li>N° de TVA intracommunautaire : FR07991738733</li>
        <li>Capital social : <em>à compléter</em></li>
        <li>RCS Marseille</li>
        <li>
          Directrice de la publication : Ludivine Cadot-Francioli
        </li>
        <li>
          Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
        États-Unis. Les données de réservation sont hébergées par Supabase Inc.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus présents sur ce site (textes, photographies, logo) est la
        propriété d’Harmonie Group ou de ses partenaires, sauf mention contraire, et ne peut
        être reproduit sans autorisation préalable.
      </p>

      <h2>Le bateau</h2>
      <p>
        Harmonie (Atlantis 42), yacht privé exploité par Harmonie Group, port d’attache : Port
        de Carnon, Hérault, France.
      </p>
    </LegalShell>
  )
}

export function CGV() {
  return (
    <LegalShell kicker="Conditions générales de vente" title="Conditions générales de vente">
      <p className="legal-intro">
        Les présentes conditions s’appliquent à toute réservation effectuée sur
        harmonie-yacht.fr auprès d’Harmonie Group ({COMPANY_ADDRESS}), pour la location
        privée du yacht Harmonie avec ou sans skipper.
      </p>

      <h2>1. Réservation et acompte</h2>
      <p>
        Toute réservation est confirmée après le règlement en ligne, par carte bancaire via
        Stripe (en lien avec notre prestataire technique Nexos Digital LLC), d’un acompte de
        30&nbsp;% du montant total de la prestation choisie. Le solde
        restant est réglé directement (carte ou espèces) avant l’embarquement.
      </p>

      <h2>2. Politique d’annulation et de remboursement</h2>
      <p>Trois situations sont possibles :</p>
      <ul>
        <li>
          <strong>Annulation à l’initiative d’Harmonie Yacht</strong> (indisponibilité du
          bateau, du capitaine, ou tout autre motif qui nous est imputable) : l’acompte est
          intégralement remboursé.
        </li>
        <li>
          <strong>Conditions météorologiques dangereuses</strong> (vent fort, mer agitée, forte
          houle) rendant la sortie impossible en toute sécurité — décision prise par le
          capitaine le jour même : au choix du client, remboursement intégral de l’acompte ou
          report de la date sans frais.
        </li>
        <li>
          <strong>Annulation à l’initiative du client</strong> : l’acompte n’est pas
          remboursable. L’équipe reste à disposition pour étudier un report de date, accordé
          selon les disponibilités du calendrier.
        </li>
      </ul>

      <h2>3. Droit de rétractation</h2>
      <p>
        Conformément à l’article L221-28 12° du Code de la consommation, le droit de
        rétractation de 14 jours ne s’applique pas aux prestations de services de loisirs
        devant être fournies à une date ou à une période déterminée — c’est le cas des sorties
        en mer et des nuits à quai réservées sur ce site.
      </p>

      <h2>4. Déroulement de la prestation</h2>
      <p>
        Le capitaine reste seul décisionnaire, le jour de la sortie, quant à la sécurité de la
        navigation. Un retard du client à l’embarquement réduit d’autant la durée de la
        prestation, celle-ci ne pouvant être décalée que si aucune autre sortie n’est prévue
        ensuite (à confirmer avec le capitaine sur place).
      </p>

      <h2>5. Responsabilité</h2>
      <p>
        Le nombre de passagers ne peut excéder la capacité légale du bateau. Les consignes de
        sécurité communiquées à bord doivent être respectées par l’ensemble des passagers.
      </p>

      <h2>6. Contact</h2>
      <p>
        Pour toute question relative à une réservation : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  )
}

export function Confidentialite() {
  return (
    <LegalShell kicker="Vie privée" title="Politique de confidentialité">
      <h2>Responsable du traitement</h2>
      <p>
        Harmonie Group ({COMPANY_ADDRESS}) est responsable du traitement des données
        personnelles collectées sur harmonie-yacht.fr.
      </p>

      <h2>Données collectées</h2>
      <p>Lors d’une réservation, nous collectons : nom, adresse email, nombre d’invités, date
        souhaitée, et le contenu du message éventuellement laissé dans le formulaire. Les
        informations de paiement (carte bancaire) sont saisies directement sur les pages
        sécurisées de Stripe et ne transitent jamais par nos serveurs.</p>

      <h2>Finalités</h2>
      <ul>
        <li>Gestion et confirmation des réservations</li>
        <li>Communication avant, pendant et après la prestation (par email et, le cas échéant, WhatsApp)</li>
        <li>Réponses aux demandes envoyées via le site</li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        Les données sont traitées par Harmonie Group et par ses prestataires techniques :
        Stripe (paiement), Supabase (hébergement des réservations), et notre outil d’envoi
        d’emails. Aucune donnée n’est vendue à des tiers.
      </p>

      <h2>Conservation</h2>
      <p>
        Les données liées à une réservation sont conservées le temps nécessaire à sa gestion
        et aux obligations comptables applicables.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
        d’un droit d’accès, de rectification et de suppression de vos données. Pour l’exercer,
        écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  )
}
