/* Injecte un bloc JSON-LD dans la page. Rendu côté build (pré-rendu), donc
   présent tel quel dans le HTML statique envoyé aux robots. */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
