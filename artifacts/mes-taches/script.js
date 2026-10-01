(() => {
  const STORAGE_KEY = 'mes-taches-v1';
  const form = document.querySelector('#task-form');
  const input = document.querySelector('#task-input');
  const list = document.querySelector('#task-list');
  const count = document.querySelector('#task-count');
  const empty = document.querySelector('#empty-state');
  const emptyTitle = document.querySelector('#empty-title');
  const emptySubtitle = document.querySelector('#empty-subtitle');
  let tasks = loadTasks();

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved)
        ? saved.filter(task => task && typeof task.id === 'string' && typeof task.text === 'string' && typeof task.done === 'boolean')
        : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // L'application reste utilisable même si le stockage du navigateur est indisponible.
    }
  }

  function render() {
    list.replaceChildren();
    const remaining = tasks.filter(task => !task.done).length;
    count.textContent = remaining === 0
      ? 'Aucune tâche en attente'
      : `${remaining} ${remaining === 1 ? 'tâche' : 'tâches'} restante${remaining > 1 ? 's' : ''}`;
    empty.hidden = tasks.length > 0;
    if (tasks.length === 0) {
      emptyTitle.textContent = 'Tout est prêt pour commencer.';
      emptySubtitle.textContent = 'Ajoutez une tâche juste au-dessus.';
    }

    for (const task of tasks) {
      const item = document.createElement('li');
      item.className = `task${task.done ? ' done' : ''}`;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'check';
      toggle.setAttribute('aria-label', task.done ? `Marquer « ${task.text} » comme à faire` : `Marquer « ${task.text} » comme terminée`);
      toggle.setAttribute('aria-pressed', String(task.done));
      if (task.done) {
        toggle.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5"/></svg>';
      }
      toggle.addEventListener('click', () => {
        task.done = !task.done;
        saveTasks();
        render();
      });

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete';
      remove.setAttribute('aria-label', `Supprimer « ${task.text} »`);
      remove.dataset.action = 'delete';
      remove.dataset.taskId = task.id;
      remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></svg><span class="delete-label">Supprimer</span>';

      item.append(toggle, text, remove);
      list.append(item);
    }
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action="delete"]');
    if (!button || !list.contains(button)) return;

    const taskId = button.dataset.taskId;
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    render();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.unshift({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      done: false
    });
    saveTasks();
    render();
    form.reset();
    input.focus();
  });

  render();
})();