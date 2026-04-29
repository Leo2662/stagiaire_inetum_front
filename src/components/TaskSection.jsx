import TaskCard from './TaskCard'
import styles from './TaskSection.module.css'

export default function TaskSection({ title, tasks, onToggleDone, onRegenerate, isDone, emptyMessage }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {title}
        </h2>
        <span className={`${styles.count} ${isDone ? styles.countDone : ''}`}>
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <div className={styles.list}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleDone={onToggleDone}
              onRegenerate={onRegenerate}
            />
          ))}
        </div>
      )}
    </section>
  )
}
