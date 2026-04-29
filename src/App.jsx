import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import TaskSection from './components/TaskSection'
import styles from './App.module.css'

const POLL_INTERVAL = 5000

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      setTasks(data)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      try {
        const res = await fetch('/tasks.json')
        const data = await res.json()
        setTasks(data)
        setLastUpdated(new Date())
        setError(null)
      } catch {
        setError('Impossible de charger les tâches')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchTasks])

  const handleToggleDone = useCallback(async (taskId, currentDone) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, done: !currentDone } : t)
    )
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentDone }),
      })
    } catch {
      setTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, done: currentDone } : t)
      )
    }
  }, [])

  const handleRegenerate = useCallback(async (taskId) => {
    try {
      await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId }),
      })
      setTimeout(fetchTasks, 1000)
    } catch {
      // silent fail in demo mode
    }
  }, [fetchTasks])

  const todo = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

  return (
    <div className={styles.app}>
      <Header lastUpdated={lastUpdated} taskCount={todo.length} />
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Chargement des tâches…</span>
          </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <TaskSection
              title="À faire"
              tasks={todo}
              onToggleDone={handleToggleDone}
              onRegenerate={handleRegenerate}
              emptyMessage="Aucune tâche en attente"
            />
            <TaskSection
              title="Effectuées"
              tasks={done}
              onToggleDone={handleToggleDone}
              onRegenerate={handleRegenerate}
              isDone
              emptyMessage="Aucune tâche effectuée"
            />
          </>
        )}
      </main>
    </div>
  )
}
