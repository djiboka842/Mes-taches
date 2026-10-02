# Mes tâches

**Mes tâches** est une petite application web en français pour noter des tâches, suivre celles qui sont terminées et retrouver sa liste lors d’une prochaine visite.

## Fonctionnalités

- Ajouter une tâche (jusqu’à 200 caractères).
- Marquer une tâche comme terminée ou à faire.
- Afficher toutes les tâches, uniquement les tâches actives ou uniquement les tâches terminées.
- Supprimer une tâche ou effacer toutes les tâches terminées.
- Voir le nombre de tâches restantes.
- Choisir le mode clair ou sombre; le choix est conservé dans le navigateur.

## Données

Les tâches et le thème sont enregistrés dans le stockage local du navigateur (`localStorage`). Il n’y a actuellement ni compte utilisateur, ni base de données distante, ni synchronisation entre appareils. Les données restent donc propres au navigateur utilisé; effacer ses données de site peut supprimer la liste.

## Lancer l’application

Le dépôt utilise pnpm workspaces. Le code de l’application se trouve dans `artifacts/mes-taches`.

Prérequis : Node.js 24 et pnpm.

Depuis la racine du dépôt :

```sh
pnpm install
PORT=25348 BASE_PATH=/ pnpm --filter @workspace/mes-taches run dev
```

Les variables `PORT` et `BASE_PATH` sont requises par la configuration Vite. Replit les fournit dans l’environnement de l’application.

Pour générer la version de production :

```sh
PORT=25348 BASE_PATH=/ pnpm --filter @workspace/mes-taches run build
```

## Organisation du code

- `artifacts/mes-taches/index.html` — structure de la page.
- `artifacts/mes-taches/style.css` — présentation et thèmes clair/sombre.
- `artifacts/mes-taches/script.js` — gestion de la liste et stockage local.
- `artifacts/mes-taches/vite.config.ts` — serveur de développement et compilation.
- `SPECIFICATION.md` — spécification fonctionnelle courte.