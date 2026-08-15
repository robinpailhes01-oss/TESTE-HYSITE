import { MentionsLegales } from '../pages/Legal'
import { pageMeta } from '../seo'

const PATH = '/mentions-legales'

export function meta() {
  return pageMeta({
    title: 'Mentions légales | Harmonie Yacht',
    description: 'Mentions légales du site harmonie-yacht.fr, édité par Harmonie Group.',
    path: PATH,
  })
}

export default MentionsLegales
