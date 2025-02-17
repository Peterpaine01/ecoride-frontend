# Ecoride Frontend

## Description

Ecoride est une plateforme de covoiturage éco-responsable permettant aux utilisateurs de proposer ou réserver des trajets. Ce frontend est construit avec React.js et consomme l'API backend pour interagir avec la base de données. Il offre une interface utilisateur simple et réactive pour les passagers et conducteurs.

## Stack Technique

- **React.js** + **Vite** pour la création de l'interface utilisateur.
- **Redux** pour la gestion de l'état global de l'application.
- **Axios** pour les requêtes HTTP vers l'API backend.
- **React Router** pour la gestion de la navigation entre les pages.
- **Styled-components** pour le style et la gestion des thèmes.
- **Yarn** pour la gestion des dépendances.

## Installation et Configuration

### Prérequis

- Node.js installé (version 16 ou supérieure recommandée).
- Accès au backend Ecoride.

### Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Peterpaine01/ecoride-frontend.git
   cd ecoride-frontend
   ```

2. Installer les dépendances :

   ```bash
    yarn install
   ```

3. Configurer les variables d’environnement

```ini
VITE_API_URL=url_api
```

4. Lancer le serveur

- En mode développement :

  ```bash
  yarn start
  ```

- En mode production :

  ```bash
  yarn build
  yarn serve
  ```

### Fonctionnalités Principales

- Page d’accueil : Liste des trajets disponibles pour les passagers, et possibilité de proposer un trajet pour les conducteurs.
- Inscription et connexion : Formulaires permettant aux utilisateurs de s’inscrire ou de se connecter.
- Profil utilisateur : Permet de voir et de mettre à jour les informations de l'utilisateur.
- Recherche de trajets : Filtrer les trajets selon la ille de départ, la ville de destination, la date et le nombre de passagers.
- Réservation de trajets : Les passagers peuvent réserver un trajet proposé par un conducteur.
- Évaluations : Les passagers peuvent laisser des avis sur leurs trajets après chaque réservation.
- Notifications : Recevoir des notifications de confirmation pour les réservations ou modifications de trajets.

### Structure du Projet

```bash
/ecoride-frontend
│── /src
│   ├── /assets        # Images, icônes, et autres ressources statiques
│   ├── /components    # Composants réutilisables (boutons, formulaires, etc.)
│   ├── /pages         # Pages principales de l'application (accueil, profil, etc.)
│   ├── /context       # Gestion de l'état global avec Redux
│   ├── /config        # Service pour interagir avec l'API backend (Axios)
│   ├── /sass          # Styles globaux et thèmes
│
└── .env               # Variables d’environnement
```

### API Endpoints

#### Authentification

- POST /login → Connexion utilisateur.
- GET /user/verify/:token → Vérifier le compte.

#### User

- POST /create-user → Créer un utilisateur.
- GET /user/:id → Détails d'un utilisateur.
- GET /users → Liste des utilisateur
- PUT /update-user/:id → Modifier un utilisateur

#### Rides

- POST /create-ride
- GET /ride/:id
- PUT /update-ride/:id
- GET /driver-rides
- GET /search-rides
- DELETE /delete-ride/:id

#### Bookings

- POST /create-booking/:id
- GET /booking/:id
- PUT /update-booking/:id
- GET /delete-booking/:id

#### Reviews

- POST /create-review/:id
- GET /reviews-driver/:id
- PUT /update-review/:id
- GET /reviews-summary/:id

#### Cars

- POST /create-car
- GET /car/:id
- GET /user-cars/:id
- PUT /update-car/:id
- DELETE /delete-car/:id

### Sécurité et Performances

- Composants réutilisables avec des hooks et des props pour une meilleure modularité.
- Lazy loading pour charger les composants au besoin et améliorer les performances.

### Licence

Ce projet est sous licence MIT. Vous êtes libre de l’utiliser et de le modifier selon vos besoins.
