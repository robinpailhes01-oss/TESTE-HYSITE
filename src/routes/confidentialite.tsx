import { Confidentialite } from '../pages/Legal'
import { pageMeta } from '../seo'

const PATH = '/confidentialite'

export function meta() {
  return pageMeta({
    title: 'Politique de confidentialité | Harmonie Yacht',
    description: 'Comment Harmonie Yacht collecte et protège vos données personnelles lors d’une réservation.',
    path: PATH,
  })
}

export default Confidentialite
