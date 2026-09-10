import { BUSINESS_PHONE } from './seo'

/* Le lien court WhatsApp Business : ouvre la conversation, sans message. */
export const WHATSAPP_URL = 'https://wa.me/message/KNP3A2CTCZDBK1'

/* Le même numéro, avec un message déjà écrit : le client n'a qu'à appuyer
   sur envoyer. Le lien court ne sait pas porter de texte, on passe donc par
   le numéro. */
export function whatsappLink(text: string) {
  const digits = BUSINESS_PHONE.replace(/[^0-9]/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
