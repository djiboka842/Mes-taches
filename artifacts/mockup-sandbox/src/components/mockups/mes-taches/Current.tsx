import { useState, type FormEvent } from 'react';
import './_group.css';

type Task = {
  id: string;
  text: string;
  done: boolean;
};

const initialTasks: Task[] = [
  { id: 'task-1', text: 'Préparer les notes pour la réunion de lundi', done: false },
  { id: 'task-2', text: 'Envoyer le devis à Camille', done: true },
  { id: 'task-3', text: 'Faire une petite promenade après le déjeuner', done: false },
];

export function Current() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const remaining = tasks.filter((task) => !task.done).length;
  const count = remaining === 0
    ? 'Aucune tâche en attente'
    : `${remaining} ${remaining === 1 ? 'tâche' : 'tâches'} restante${remaining > 1 ? 's' : ''}`;

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setTasks((current) => [
      { id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`, text, done: false },
      ...current,
    ]);
    setNewTask('');
  }

  function toggleTask(taskId: string) {
    setTasks((current) => current.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task,
    ));
  }

  function deleteTask(taskId: string) {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  return (
    <div className="mes-taches-preview">
      <main className="app">
        <p className="eyebrow">Votre espace personnel</p>
        <h1>Mes tâches</h1>
        <p className="intro">Une chose à la fois. Vous avancez déjà.</p>

        <section className="panel" aria-label="Liste de tâches">
          <form onSubmit={addTask}>
            <input
              type="text"
              maxLength={200}
              placeholder="Que souhaitez-vous faire ?"
              aria-label="Nouvelle tâche"
              autoComplete="off"
              required
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
            />
            <button className="add-button" type="submit">Ajouter</button>
          </form>
          <div className="list-header">
            <h2>À faire</h2>
            <span className="count" aria-live="polite">{count}</span>
          </div>
          <ul aria-label="Vos tâches">
            {tasks.map((task) => (
              <li className={`task${task.done ? ' done' : ''}`} key={task.id}>
                <button
                  type="button"
                  className="check"
                  aria-label={task.done
                    ? `Marquer « ${task.text} » comme à faire`
                    : `Marquer « ${task.text} » comme terminée`}
                  aria-pressed={task.done}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done && (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m3 8 3.2 3.2L13 4.5" />
                    </svg>
                  )}
                </button>
                <span className="task-text">{task.text}</span>
                <button
                  type="button"
                  className="delete"
                  aria-label={`Supprimer « ${task.text} »`}
                  onClick={() => deleteTask(task.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" />
                  </svg>
                  <span className="delete-label">Supprimer</span>
                </button>
              </li>
            ))}
          </ul>
          {tasks.length === 0 && (
            <div className="empty">
              <span className="empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 4 4L19 6" />
                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
                </svg>
              </span>
              <p>Tout est prêt pour commencer.</p>
              <small>Ajoutez une tâche juste au-dessus.</small>
            </div>
          )}
          <div className="footer">
            <span className="save-note"><span className="save-dot" aria-hidden="true" />Enregistré sur cet appareil</span>
            <span>Vos tâches restent privées</span>
          </div>
        </section>
      </main>
    </div>
  );
}