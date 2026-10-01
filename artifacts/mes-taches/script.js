(() => {
  const STORAGE_KEY = 'mes-taches-v1';
  const THEME_STORAGE_KEY = 'mes-taches-theme-v1';
  const form = document.querySelector('#task-form');
  const input = document.querySelector('#task-input');
  const list = document.querySelector('#task-list');
  const count = document.querySelector('#task-count');
  const clearCompleted = document.querySelector('#clear-completed');
  const filterGroup = document.querySelector('#task-filters');
  const themeToggle = document.querySelector('#theme-toggle');
  const themeColor = document.querySelector('#theme-color');
  const empty = document.querySelector('#empty-state');
  const emptyTitle = document.querySelector('#empty-title');
  const emptySubtitle = document.querySelector('#empty-subtitle');
  let activeFilter = 'all';
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

  function getVisibleTasks() {
    if (activeFilter === 'active') return tasks.filter(task => !task.done);
    if (activeFilter === 'completed') return tasks.filter(task => task.done);
    return tasks;
  }

  function updateTheme(isDark, persist = false) {
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeColor.content = isDark ? '#1b1e1a' : '#f3edde';
    if (!persist) return;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Le thème reste actif jusqu'à la fermeture de la page si le stockage est indisponible.
    }
  }

  function focusVisibleTask(index) {
    const buttons = list.querySelectorAll('.check');
    const target = buttons[Math.min(index, buttons.length - 1)];
    if (target) {
      target.focus();
      return;
    }
    filterGroup.querySelector(`[data-filter="${activeFilter}"]`)?.focus();
  }

  function removeTask(taskId, restoreFocus = false) {
    const visibleIndex = getVisibleTasks().findIndex(task => task.id === taskId);
    if (visibleIndex < 0) return;

    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    render();
    if (restoreFocus) {
      const deleteButtons = list.querySelectorAll('.delete');
      const nextButton = deleteButtons[Math.min(visibleIndex, deleteButtons.length - 1)];
      (nextButton || input).focus();
    }
  }

  function render() {
    list.replaceChildren();
    const remaining = tasks.filter(task => !task.done).length;
    const completed = tasks.length - remaining;
    const visibleTasks = getVisibleTasks();

    count.textContent = remaining === 0
      ? 'Tout est fait'
      : `${remaining} ${remaining === 1 ? 'tâche' : 'tâches'} à faire`;
    clearCompleted.disabled = completed === 0;
    clearCompleted.hidden = completed === 0;
    clearCompleted.setAttribute(
      'aria-label',
      `Effacer les ${completed} ${completed === 1 ? 'tâche terminée' : 'tâches terminées'}`,
    );
    for (const button of filterGroup.querySelectorAll('[data-filter]')) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter));
    }

    list.hidden = visibleTasks.length === 0;
    empty.hidden = visibleTasks.length > 0;
    if (visibleTasks.length === 0 && tasks.length === 0) {
      emptyTitle.textContent = 'Tout est prêt pour commencer.';
      emptySubtitle.textContent = 'Ajoutez une tâche juste au-dessus.';
    } else if (visibleTasks.length === 0 && activeFilter === 'active') {
      emptyTitle.textContent = 'Aucune tâche active.';
      emptySubtitle.textContent = 'Toutes vos tâches sont terminées.';
    } else if (visibleTasks.length === 0 && activeFilter === 'completed') {
      emptyTitle.textContent = 'Aucune tâche terminée.';
      emptySubtitle.textContent = 'Les tâches terminées apparaîtront ici.';
    }

    for (const task of visibleTasks) {
      const item = document.createElement('li');
      item.className = `task${task.done ? ' done' : ''}`;
      item.dataset.taskId = task.id;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'check';
      toggle.setAttribute('aria-label', task.done ? `Marquer « ${task.text} » comme à faire` : `Marquer « ${task.text} » comme terminée`);
      toggle.setAttribute('aria-pressed', String(task.done));
      if (task.done) {
        toggle.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5"/></svg>';
      }
      toggle.addEventListener('click', () => {
        const visibleIndex = getVisibleTasks().findIndex(visibleTask => visibleTask.id === task.id);
        task.done = !task.done;
        saveTasks();
        render();
        focusVisibleTask(visibleIndex);
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
    removeTask(button.dataset.taskId, true);
  });

  clearCompleted.addEventListener('click', () => {
    if (clearCompleted.disabled) return;
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    render();
    filterGroup.querySelector(`[data-filter="${activeFilter}"]`)?.focus();
  });

  filterGroup.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button || !filterGroup.contains(button)) return;
    activeFilter = button.dataset.filter;
    render();
  });

  themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    updateTheme(isDark, true);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Delete' || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target.matches?.('input, textarea, select, [contenteditable="true"]')) return;
    const item = target.closest?.('.task');
    if (!item || !list.contains(item)) return;
    const button = item.querySelector('.delete[data-task-id]');
    if (!button) return;
    event.preventDefault();
    removeTask(button.dataset.taskId, true);
  });

  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.isComposing) return;
    event.preventDefault();
    form.requestSubmit();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    activeFilter = 'all';
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

  updateTheme(document.body.classList.contains('dark-mode'));
  render();
})();