# Spécification fonctionnelle — Mes tâches

## Objectif

Fournir une interface simple en français pour saisir des tâches personnelles, suivre leur avancement et retrouver sa liste dans le même navigateur.

## Utilisateur cible

Une personne qui souhaite noter rapidement ses tâches et distinguer ce qui reste à faire de ce qui est terminé.

## Fonctionnalités

1. **Ajouter une tâche** : accepter un texte non vide après suppression des espaces au début et à la fin; longueur maximale de 200 caractères. Une nouvelle tâche apparaît en haut de la liste.
2. **Modifier l’état** : passer une tâche de « à faire » à « terminée », et inversement.
3. **Filtrer la liste** : afficher toutes les tâches, les tâches actives ou les tâches terminées.
4. **Supprimer** : retirer une tâche individuellement ou effacer toutes les tâches terminées.
5. **Afficher l’avancement** : indiquer le nombre de tâches restantes et présenter un état vide adapté à la liste ou au filtre courant.
6. **Choisir un thème** : basculer entre les modes clair et sombre et conserver le choix dans le navigateur.

## Données et contraintes

- Une tâche comporte un identifiant, un texte et un état de complétion (`id`, `text`, `done`).
- Les tâches et le thème sont conservés dans `localStorage` sur l’appareil utilisé.
- L’application ne nécessite pas de compte et ne fournit pas actuellement de sauvegarde distante ni de synchronisation entre appareils.
- L’interface est en français et prend en charge les actions clavier prévues, notamment l’ajout avec Entrée et la suppression de la tâche sélectionnée avec Suppr.

## Critères d’acceptation

- Une tâche vide n’est pas ajoutée; un texte valide est conservé sans espaces superflus aux extrémités.
- L’ajout, le changement d’état et la suppression mettent à jour la liste et le compteur.
- Chaque filtre n’affiche que les tâches correspondant à son état.
- L’effacement des tâches terminées ne supprime pas les tâches actives.
- Après rechargement de la page, les tâches et le thème choisis sont restaurés dans le même navigateur.

## Hors périmètre actuel

Comptes utilisateurs, partage de listes, synchronisation en ligne, échéances, priorités, catégories et notifications.