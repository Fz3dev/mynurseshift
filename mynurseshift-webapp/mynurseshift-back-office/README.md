# MyNurseShift - Back Office

Interface d'administration pour la gestion des pôles et services de MyNurseShift.

## Fonctionnalités

- Gestion des pôles médicaux
  - Liste, création, modification et suppression
  - Statut actif/inactif
  - Code et description

- Gestion des services
  - Liste, création, modification et suppression
  - Association avec les pôles
  - Capacité et statut

## Technologies

- React + TypeScript
- Refine.dev pour le framework d'administration
- Ant Design pour l'interface utilisateur
- React Router pour la navigation

## Installation

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev
```

## Configuration

L'API est configurée pour pointer vers `http://localhost:3000` par défaut. Vous pouvez modifier cette URL dans `src/App.tsx`.
