import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ease } from '../motion'

type Result = {
  paid: boolean
  deposit: number | null
  formule: string | null
  montantTotal: string | null
  nom: string | null
  date: string | null
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  /* iso est un YYYY-MM-DD sans heure, lu en UTC minuit — on formate en UTC
     pour ne jamais la décaler d'un jour selon le fuseau du visiteur. */
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/* Page de retour après paiement Stripe — on ne fait jamais confiance à
   l'URL seule : le statut est revérifié côté serveur via /api/verify-session. */
export default function Confirmation() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [state, setState] = useState<'loading' | 'ok' | 'unpaid' | 'error'>(
    sessionId ? 'loading' : 'error',
  )
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data: Result & { error?: string }) => {
        if (cancelled) return
        if (data.error) return setState('error')
        setResult(data)
        setState(data.paid ? 'ok' : 'unpaid')
      })
      .catch(() => !cancelled && setState('error'))
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const dateLabel = result?.date ? formatDate(result.date) : null
  const balance =
    result?.montantTotal && result.deposit !== null
      ? Number(result.montantTotal) - result.deposit
      : null

  return (
    <main className="section on-ocean-deep on-ocean confirm">
      <div className="container confirm__card">
        {state === 'loading' ? (
          <p className="confirm__loading">Vérification du paiement…</p>
        ) : null}

        {state === 'ok' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}
          >
            <svg width="52" height="52" viewBox="0 0 44 44" fill="none" aria-hidden="true" className="confirm__icon">
              <circle cx="22" cy="22" r="21" stroke="currentColor" strokeOpacity="0.4" />
              <path d="M14 22.5l5.5 5.5L30 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="kicker">Réservation confirmée</p>
            <h1 className="mixed confirm__title">
              Votre acompte est <span className="it">bien reçu</span>
            </h1>
            <p className="confirm__text">
              Merci{result?.nom ? `, ${result.nom}` : ''} — votre place est bloquée. Nous revenons
              vers vous sous 24&nbsp;heures pour finaliser les derniers détails.
            </p>

            {result?.formule ? (
              <div className="confirm__recap">
                <div className="confirm__row">
                  <span>Prestation</span>
                  <span>{result.formule}</span>
                </div>
                {dateLabel ? (
                  <div className="confirm__row">
                    <span>Date souhaitée</span>
                    <span>{dateLabel}</span>
                  </div>
                ) : null}
                <div className="confirm__row">
                  <span>Acompte réglé</span>
                  <span>{result.deposit} €</span>
                </div>
                {balance !== null ? (
                  <div className="confirm__row">
                    <span>Solde à l’embarquement</span>
                    <span>{balance} €</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="confirm__actions">
              <Link to="/" className="btn btn--ghost-light">
                Retour à l’accueil
              </Link>
              <a href="mailto:harmonieyacht@gmail.com" className="btn btn--light">
                Nous écrire
              </a>
            </div>
          </motion.div>
        ) : null}

        {state === 'unpaid' ? (
          <div className="confirm__failed">
            <p className="kicker">Paiement non confirmé</p>
            <h1 className="mixed confirm__title">
              Quelque chose s’est <span className="it">interrompu</span>
            </h1>
            <p className="confirm__text">
              Nous n’avons pas encore reçu la confirmation de votre paiement. Si vous pensez qu’il
              s’agit d’une erreur, écrivez-nous directement.
            </p>
            <div className="confirm__actions">
              <Link to="/" className="btn btn--ghost-light">
                Retour à l’accueil
              </Link>
              <a href="mailto:harmonieyacht@gmail.com" className="btn btn--light">
                Nous écrire
              </a>
            </div>
          </div>
        ) : null}

        {state === 'error' ? (
          <div className="confirm__failed">
            <p className="kicker">Réservation</p>
            <h1 className="mixed confirm__title">
              Rien à <span className="it">confirmer ici</span>
            </h1>
            <p className="confirm__text">
              Cette page s’affiche après un paiement de réservation. Si vous cherchiez à réserver,
              c’est par ici.
            </p>
            <div className="confirm__actions">
              <Link to="/" className="btn btn--light">
                Retour à l’accueil
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
