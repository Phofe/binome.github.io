# TaskFlow — Gestionnaire de tâches React

Application de démonstration construite avec React pour gérer une liste de tâches dans le navigateur.

## Fonctionnalités

- Ajouter et modifier des tâches.
- Ajouter une description et choisir une priorité.
- Marquer une tâche comme terminée.
- Rechercher des tâches et filtrer par état.
- Afficher des compteurs (total, à faire, terminées).
- Supprimer une tâche ou effacer les tâches terminées.
- Sauvegarder automatiquement les tâches avec `localStorage`.

## Lancer l'application

Ouvrez simplement `index.html` dans un navigateur récent. React et ReactDOM sont chargés depuis un CDN, donc une connexion Internet est nécessaire au premier chargement.

## Technologies

- React 18
- JavaScript
- HTML et CSS
- localStorage

## Structure

- `index.html` : application autonome, sans étape de compilation.

## Limites

Les données sont enregistrées uniquement dans le navigateur courant. Elles ne sont pas synchronisées entre appareils et ne sont pas sauvegardées sur un serveur. Il s'agit d'un prototype de portfolio, pas d'un outil collaboratif de production.
