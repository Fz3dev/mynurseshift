# MyNurseShift - Application de Gestion de Planning Infirmier

Application SaaS moderne pour la gestion des plannings d'équipes infirmières, conçue pour remplacer les plannings papier traditionnels.

## Fonctionnalités Principales

- Génération automatique des plannings respectant les règles métier
- Gestion des rôles (administrateurs et infirmiers)
- Système d'échange de créneaux
- Interface responsive et intuitive
- Notifications par email et push
- Rapports et statistiques
- Synchronisation avec iCloud Calendar et Google Agenda

## Technologies Utilisées

- Frontend : React avec TypeScript
- UI : Tailwind CSS et shadcn/ui
- État : Zustand et React Query
- Backend : Firebase (Auth, Firestore, Functions)
- Notifications : Firebase Cloud Messaging

## Prérequis

- Node.js 18+
- npm ou yarn
- Compte Firebase

## Installation

1. Cloner le repository :
```bash
git clone [url-du-repo]
cd mynurseshift
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier .env avec les variables d'environnement nécessaires.

4. Lancer le serveur de développement :
```bash
npm run dev
```

## Structure du Projet

```
src/
  ├── components/     # Composants React réutilisables
  ├── pages/         # Pages de l'application
  ├── hooks/         # Hooks personnalisés
  ├── services/      # Services (Firebase, API)
  ├── store/         # État global (Zustand)
  ├── types/         # Types TypeScript
  ├── utils/         # Fonctions utilitaires
  └── config/        # Configuration de l'application
```

## Règles Métier Principales

- Maximum 48h de travail par semaine glissante
- Un weekend travaillé sur deux
- Roulement sur 12 semaines
- Pas d'enchaînement soir puis matin
- Gestion des temps partiels (80%)

## Contribution

Les contributions sont les bienvenues ! Consultez notre guide de contribution pour plus de détails.

## Licence

Ce projet est sous licence MIT.
