import { CGV } from '../pages/Legal'
import { pageMeta } from '../seo'

const PATH = '/cgv'

export function meta() {
  return pageMeta({
    title: 'Conditions générales de vente | Harmonie Yacht',
    description: 'Conditions de réservation, acompte et politique d’annulation pour les sorties en mer et nuits à bord chez Harmonie Yacht.',
    path: PATH,
  })
}

export default CGV
