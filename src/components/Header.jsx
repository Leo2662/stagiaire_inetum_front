import styles from './Header.module.css'

function formatTime(date) {
  if (!date) return null
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function Header({ lastUpdated, taskCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>BizPilot</h1>
            <p className={styles.subtitle}>Gestionnaire de tâches · Ingénieur d&apos;affaires ESN</p>
          </div>
        </div>
        <div className={styles.meta}>
          {taskCount > 0 && (
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              {taskCount} tâche{taskCount > 1 ? 's' : ''} en attente
            </div>
          )}
          {lastUpdated && (
            <div className={styles.sync}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Sync {formatTime(lastUpdated)}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
