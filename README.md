# MyNurseShift

Application de gestion des plannings pour le personnel infirmier.

## Structure du Projet

Le projet est divisé en trois parties principales :

- `mynurseshift-api/` : Backend API GraphQL avec Node.js, TypeGraphQL et Prisma
- `mynurseshift-back-office/` : Interface d'administration pour les cadres de santé
- `mynurseshift-webapp/` : Application web pour les infirmiers

## Prérequis

- Node.js >= 16
- PostgreSQL >= 13
- npm ou yarn

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/mynurseshift.git
cd mynurseshift
```

2. Installer les dépendances pour chaque projet :
```bash
# API
cd mynurseshift-api
npm install

# Back Office
cd ../mynurseshift-back-office
npm install

# WebApp
cd ../mynurseshift-webapp
npm install
```

3. Configurer les variables d'environnement :
   - Copier `.env.example` vers `.env` dans chaque dossier
   - Remplir les variables nécessaires

4. Initialiser la base de données :
```bash
cd mynurseshift-api
npx prisma migrate dev
```

## Démarrage

1. Démarrer l'API :
```bash
cd mynurseshift-api
npm run dev
```

2. Démarrer le Back Office :
```bash
cd mynurseshift-back-office
npm run dev
```

3. Démarrer la WebApp :
```bash
cd mynurseshift-webapp
npm run dev
```

## Fonctionnalités

- Authentification et gestion des utilisateurs
- Gestion des services et pôles
- Validation des comptes utilisateurs
- Notifications par email
- Dashboard avec statistiques

## Technologies Utilisées

### Backend (API)
- Node.js
- TypeScript
- TypeGraphQL
- Prisma ORM
- PostgreSQL
- Apollo Server
- Express
- Nodemailer

### Frontend (Back Office & WebApp)
- React
- TypeScript
- Vite
- Apollo Client
- Ant Design
- Styled Components

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

[MIT License](LICENSE)
