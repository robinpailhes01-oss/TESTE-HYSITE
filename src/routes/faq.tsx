import { Link } from 'react-router'
import JsonLd from '../components/JsonLd'
import { BUSINESS_PHONE_DISPLAY, pageMeta, breadcrumbSchema, faqSchema } from '../seo'

const PATH = '/faq'

export function meta() {
  return pageMeta({
    title: 'FAQ — location de yacht à Carnon | Harmonie Yacht',
    description:
      'Permis, capacité, météo, annulation, ce qu’il faut apporter : toutes les réponses sur la location du yacht Harmonie à Carnon, avec ou sans skipper.',
    path: PATH,
  })
}

const FAQ = [
  {
    question: 'Faut-il un permis pour louer le yacht sans capitaine ?',
    answer:
      'Oui : un permis bateau détenu depuis au moins 5 ans et 50 heures de navigation justifiables sur un bateau de ce type. Sans ces conditions, la sortie se fait avec notre capitaine.',
  },
  {
    question: 'Combien de personnes peuvent monter à bord ?',
    answer:
      'Jusqu’à 10 personnes pour une sortie en mer (capacité légale du yacht, confortable à 7), et jusqu’à 2 personnes pour une nuit à bord.',
  },
  {
    question: 'Que se passe-t-il en cas de météo dangereuse le jour de la sortie ?',
    answer:
      'La décision revient au capitaine, le jour même. Au-delà de 70 cm de houle ou en cas de conditions jugées dangereuses, la sortie est reportée ou remboursée intégralement, au choix du client.',
  },
  {
    question: 'Peut-on annuler une réservation ?',
    answer:
      'Si l’annulation vient d’Harmonie Yacht ou d’une météo dangereuse, la somme réglée est intégralement remboursée. Si l’annulation vient du client, elle n’est pas remboursée : elle est conservée sous forme d’avoir du même montant, valable douze mois sur une prochaine sortie ou nuit à bord, selon les disponibilités.',
  },
  {
    question: 'Comment se passe le paiement ?',
    answer:
      'Pour une sortie en mer, un acompte de 30 % est réglé en ligne par carte bancaire à la réservation ; le solde se règle directement à bord, par carte ou en espèces, avant l’embarquement. Les nuits à bord se règlent en totalité en ligne à la réservation : il n’y a rien à payer à bord. Le montant exact s’affiche toujours avant le paiement.',
  },
  {
    question: 'Y a-t-il des toilettes à bord ?',
    answer:
      'Pas actuellement — les sanitaires de la capitainerie sont accessibles à 20 mètres du ponton.',
  },
  {
    question: 'Peut-on venir avec des enfants ou un animal de compagnie ?',
    answer:
      'Oui aux deux : il n’y a pas d’âge minimum officiel pour les enfants (des gilets adaptés sont disponibles à bord), et les animaux sont acceptés.',
  },
  {
    question: 'Que faut-il apporter ?',
    answer:
      'Maillot de bain, serviette, crème solaire, casquette ou lunettes de soleil, et vos propres boissons/nourriture — non incluses dans la formule (sauf le matériel BBQ, fourni sur les sorties de 3 h et plus).',
  },
  {
    question: 'Où se trouve le point de rendez-vous et y a-t-il un parking ?',
    answer:
      'Le yacht est amarré au port de Carnon (Hérault), à côté de l’Hôtel Neptune, à 15 minutes de Montpellier. Il n’y a pas de parking dédié : prévoyez une place dans Carnon.',
  },
  {
    question: 'Quels sont les spots de navigation habituels ?',
    answer:
      'Selon la durée choisie : le Petit et le Grand Travers, La Grande-Motte, ou la plage de la Maguelone, décidés avec le capitaine selon la météo et vos envies.',
  },
  {
    question: 'Comment vous contacter rapidement ?',
    answer: `Par WhatsApp (réponse en moins de 5 minutes), par téléphone au ${BUSINESS_PHONE_DISPLAY}, ou par email à harmonieyacht@gmail.com.`,
  },
]

export default function FaqRoute() {
  return (
    <main className="page">
      <section className="legal-hero on-ocean-deep on-ocean">
        <div className="container">
          <Link to="/" className="page-hero__back">
            ← Retour à l’accueil
          </Link>
          <p className="kicker" style={{ marginTop: 18 }}>Foire aux questions</p>
          <h1 className="mixed legal-hero__title">Tout savoir avant de réserver</h1>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container legal-body" style={{ maxWidth: 720 }}>
          {FAQ.map((f) => (
            <div key={f.question}>
              <h2>{f.question}</h2>
              <p>{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'FAQ', path: PATH }])} />
      <JsonLd data={faqSchema(FAQ)} />
    </main>
  )
}
