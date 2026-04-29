import { useState } from 'react'
import styles from './TaskCard.module.css'

const TYPE_CONFIG = {
  push_profile: { label: 'Pousse profil', color: 'blue' },
  relance:      { label: 'Relance',        color: 'orange' },
  suivi:        { label: 'Suivi mission',  color: 'purple' },
  proposition:  { label: 'Proposition',   color: 'green' },
  autre:        { label: 'Autre',          color: 'gray' },
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TaskCard({ task, onToggleDone, onRegenerate }) {
  const [emailExpanded, setEmailExpanded] = useState(false)
  const [copying, setCopying] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [toggling, setToggling] = useState(false)

  const typeConfig = TYPE_CONFIG[task.type] || TYPE_CONFIG.autre

  async function handleCopy() {
    const text = `Objet : ${task.email.subject}\n\n${task.email.body}`
    try {
      await navigator.clipboard.writeText(text)
      setCopying(true)
      setTimeout(() => setCopying(false), 1800)
    } catch {
      // fallback
    }
  }

  async function handleRegenerate() {
    setRegenerating(true)
    await onRegenerate(task.id)
    setTimeout(() => setRegenerating(false), 1500)
  }

  async function handleToggle() {
    setToggling(true)
    await onToggleDone(task.id, task.done)
    setToggling(false)
  }

  return (
    <article className={`${styles.card} ${task.done ? styles.cardDone : ''}`}>
      <div className={styles.cardMain}>
        {/* Done toggle */}
        <button
          className={`${styles.toggleBtn} ${task.done ? styles.toggleBtnDone : ''} ${toggling ? styles.toggling : ''}`}
          onClick={handleToggle}
          aria-label={task.done ? 'Marquer comme à faire' : 'Marquer comme effectuée'}
          title={task.done ? 'Rouvrir' : 'Marquer effectuée'}
        >
          {task.done && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        <div className={styles.content}>
          {/* Top row: type badge + priority */}
          <div className={styles.topRow}>
            <span className={`${styles.typeBadge} ${styles[`type_${typeConfig.color}`]}`}>
              {typeConfig.label}
            </span>
            {task.priority === 'haute' && (
              <span className={styles.priorityHigh}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                </svg>
                Haute priorité
              </span>
            )}
            <span className={styles.date}>{formatDate(task.createdAt)}</span>
          </div>

          {/* Title */}
          <h3 className={`${styles.title} ${task.done ? styles.titleDone : ''}`}>
            {task.title}
          </h3>

          {/* Recipient */}
          <div className={styles.recipient}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className={styles.recipientName}>{task.recipient}</span>
            <span className={styles.recipientEmail}>&lt;{task.recipientEmail}&gt;</span>
          </div>

          {/* Context */}
          {task.context && (
            <p className={styles.context}>{task.context}</p>
          )}

          {/* Email preview toggle */}
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={() => setEmailExpanded(v => !v)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {emailExpanded ? 'Masquer l\'email' : 'Voir l\'email'}
              <svg
                className={`${styles.chevron} ${emailExpanded ? styles.chevronOpen : ''}`}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <button
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              onClick={handleCopy}
              disabled={copying}
            >
              {copying ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copié !
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copier l&apos;email
                </>
              )}
            </button>

            <button
              className={`${styles.actionBtn} ${styles.actionBtnTertiary} ${regenerating ? styles.regenerating : ''}`}
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              <svg
                className={regenerating ? styles.spinIcon : ''}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              {regenerating ? 'Génération…' : 'Régénérer'}
            </button>
          </div>
        </div>
      </div>

      {/* Email panel */}
      {emailExpanded && (
        <div className={styles.emailPanel}>
          <div className={styles.emailSubject}>
            <span className={styles.emailLabel}>Objet</span>
            <span>{task.email.subject}</span>
          </div>
          <div className={styles.emailBody}>
            <span className={styles.emailLabel}>Corps</span>
            <pre className={styles.emailText}>{task.email.body}</pre>
          </div>
        </div>
      )}
    </article>
  )
}
