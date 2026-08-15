import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('sortie-en-mer-carnon', 'routes/sortie.tsx'),
  route('nuit-a-bord-yacht-carnon', 'routes/nuit.tsx'),
  route('evjf-evg-bateau-montpellier', 'routes/evjf.tsx'),
  route('demande-en-mariage-anniversaire-bateau', 'routes/demande-mariage.tsx'),
  route('seminaire-entreprise-bateau-herault', 'routes/seminaire.tsx'),
  route('tarifs', 'routes/tarifs.tsx'),
  route('faq', 'routes/faq.tsx'),
  route('galerie', 'routes/galerie.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('mentions-legales', 'routes/mentions-legales.tsx'),
  route('cgv', 'routes/cgv.tsx'),
  route('confidentialite', 'routes/confidentialite.tsx'),
  route('merci', 'routes/merci.tsx'),
] satisfies RouteConfig
