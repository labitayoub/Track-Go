# 🚚 Track-Go - Documentation Technique

## Table des Matières

1. [Présentation du Projet](#1-présentation-du-projet)
2. [Architecture Technique](#2-architecture-technique)
3. [Installation et Configuration](#3-installation-et-configuration)
4. [Backend - API REST](#4-backend---api-rest)
5. [Frontend - Interface Utilisateur](#5-frontend---interface-utilisateur)
6. [Modèles de Données](#6-modèles-de-données)
7. [Authentification et Sécurité](#7-authentification-et-sécurité)
8. [Fonctionnalités Métier](#8-fonctionnalités-métier)
9. [Déploiement Docker](#9-déploiement-docker)
10. [Tests](#10-tests)
11. [Diagrammes UML](#11-diagrammes-uml)

---

## 1. Présentation du Projet

### 1.1 Description
**Track-Go** est une application web de gestion de flotte de transport permettant de gérer :
- Les camions et remorques
- Les chauffeurs
- Les trajets
- Les pneus et leur maintenance
- La maintenance des véhicules

### 1.2 Objectifs
- Centraliser la gestion de la flotte de véhicules
- Suivre les trajets et le kilométrage
- Gérer l'état des pneus avec visualisation graphique
- Contrôler la disponibilité des ressources (véhicules, chauffeurs)
- Planifier et suivre les maintenances

### 1.3 Utilisateurs Cibles
| Rôle | Description | Accès |
|------|-------------|-------|
| **Admin** | Gestionnaire de flotte | Accès complet à toutes les fonctionnalités |
| **Chauffeur** | Conducteur de véhicule | Consultation et gestion de ses trajets |

---

## 2. Architecture Technique

### 2.1 Stack Technologique

#### Backend
| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| Node.js | 18+ | Runtime JavaScript |
| Express.js | 5.2.1 | Framework web |
| TypeScript | 5.9.3 | Typage statique |
| MongoDB | 6.0 | Base de données NoSQL |
| Mongoose | 9.0.1 | ODM MongoDB |
| JWT | 9.0.3 | Authentification |
| Joi | 18.0.2 | Validation des données |
| bcryptjs | 3.0.3 | Hashage des mots de passe |

#### Frontend
| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| React | 19.2.1 | Bibliothèque UI |
| TypeScript | 5.9.3 | Typage statique |
| Vite | 6.4.1 | Build tool |
| Material-UI (MUI) | 7.3.6 | Composants UI |
| Axios | 1.13.2 | Client HTTP |
| React Router | 6.8.0 | Routage |
| TailwindCSS | 4.1.17 | Styles utilitaires |

#### Infrastructure
| Technologie | Utilisation |
|-------------|-------------|
| Docker | Conteneurisation |
| Docker Compose | Orchestration |
| Nginx | Serveur web frontend |

### 2.2 Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React 19 + TypeScript + MUI + Vite                     │   │
│  │  Port: 80 (Production) / 5173 (Dev)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Express.js + TypeScript                                │   │
│  │  Port: 5000 (Dev) / 5000 (Production)                   │   │
│  │                                                         │   │
│  │  ┌─────────┐ ┌─────────────┐ ┌──────────┐              │   │
│  │  │ Routes  │→│ Controllers │→│ Services │              │   │
│  │  └─────────┘ └─────────────┘ └──────────┘              │   │
│  │       │              │              │                   │   │
│  │  ┌─────────────┐ ┌──────────┐ ┌─────────┐              │   │
│  │  │ Middlewares │ │Validators│ │ Models  │              │   │
│  │  └─────────────┘ └──────────┘ └─────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MongoDB 6.0                                            │   │
│  │  Port: 27017                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Structure des Dossiers

```
Track-Go/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB)
│   │   ├── controllers/     # Contrôleurs REST
│   │   ├── middlewares/     # Middlewares (auth)
│   │   ├── models/          # Modèles Mongoose
│   │   ├── routes/          # Définition des routes
│   │   ├── services/        # Logique métier
│   │   ├── validators/      # Schémas de validation
│   │   ├── seeders/         # Données initiales
│   │   ├── tests/           # Tests unitaires
│   │   └── server.ts        # Point d'entrée
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/          # Ressources statiques
│   │   ├── components/      # Composants réutilisables
│   │   │   └── layout/      # Layout (Sidebar, Navbar)
│   │   ├── context/         # Contextes React
│   │   ├── pages/           # Pages de l'application
│   │   ├── routes/          # Configuration des routes
│   │   ├── services/        # Services API
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── conception UML/          # Diagrammes UML
├── docs/                    # Documentation
└── docker-compose.yml       # Orchestration Docker
```

---

## 3. Installation et Configuration

### 3.1 Prérequis
- Node.js 18+
- npm ou yarn
- MongoDB 6.0+ (ou Docker)
- Docker et Docker Compose (optionnel)

### 3.2 Installation Locale

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3.3 Variables d'Environnement

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackgo
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 3.4 Seed Initial (Admin)
```bash
cd backend
npm run seed
```
Crée un compte admin par défaut :
- Email: `admin@trackgo.com`
- Password: `admin123`

---

## 4. Backend - API REST

### 4.1 Endpoints

#### Authentification (`/api/user`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription chauffeur | Non |
| POST | `/login` | Connexion | Non |
| GET | `/chauffeurs` | Liste des chauffeurs | Admin |
| GET | `/chauffeurs/available` | Chauffeurs disponibles | Admin |
| PATCH | `/chauffeurs/:id/toggle` | Activer/Désactiver chauffeur | Admin |

#### Camions (`/api/camion`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des camions | Oui |
| GET | `/available` | Camions disponibles | Admin |
| GET | `/:id` | Détail d'un camion | Oui |
| POST | `/` | Créer un camion | Admin |
| PUT | `/:id` | Modifier un camion | Admin |
| DELETE | `/:id` | Supprimer un camion | Admin |

#### Remorques (`/api/remorque`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des remorques | Oui |
| GET | `/available` | Remorques disponibles | Admin |
| GET | `/:id` | Détail d'une remorque | Oui |
| POST | `/` | Créer une remorque | Admin |
| PUT | `/:id` | Modifier une remorque | Admin |
| DELETE | `/:id` | Supprimer une remorque | Admin |

#### Pneus (`/api/pneu`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des pneus | Oui |
| GET | `/:id` | Détail d'un pneu | Oui |
| GET | `/vehicule/:type/:id` | Pneus par véhicule | Oui |
| POST | `/` | Créer un pneu | Admin |
| PUT | `/:id` | Modifier un pneu | Admin |
| DELETE | `/:id` | Supprimer un pneu | Admin |

#### Trajets (`/api/trajet`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des trajets | Admin |
| GET | `/mes-trajets` | Mes trajets (chauffeur) | Chauffeur |
| GET | `/:id` | Détail d'un trajet | Oui |
| POST | `/` | Créer un trajet | Admin |
| PUT | `/:id` | Modifier un trajet | Oui |
| DELETE | `/:id` | Supprimer un trajet | Admin |

#### Maintenance (`/api/maintenance`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des maintenances | Oui |
| GET | `/:id` | Détail d'une maintenance | Oui |
| POST | `/` | Créer une maintenance | Admin |
| PUT | `/:id` | Modifier une maintenance | Admin |
| DELETE | `/:id` | Supprimer une maintenance | Admin |

### 4.2 Format des Réponses

#### Succès
```json
{
  "data": { ... },
  "message": "Opération réussie"
}
```

#### Erreur
```json
{
  "message": "Description de l'erreur",
  "errors": ["détail1", "détail2"]
}
```

### 4.3 Codes HTTP
| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Création réussie |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

---

## 5. Frontend - Interface Utilisateur

### 5.1 Pages

| Page | Route | Description | Accès |
|------|-------|-------------|-------|
| Login | `/login` | Connexion | Public |
| Register | `/register` | Inscription chauffeur | Public |
| Dashboard | `/dashboard` | Tableau de bord | Authentifié |
| Chauffeurs | `/chauffeurs` | Gestion des chauffeurs | Admin |
| Camions | `/camions` | Gestion des camions | Authentifié |
| Remorques | `/remorques` | Gestion des remorques | Authentifié |
| Trajets | `/trajets` | Gestion des trajets | Authentifié |
| Pneus | `/pneus` | Gestion des pneus (graphique) | Authentifié |
| Maintenance | `/maintenance` | Gestion des maintenances | Authentifié |

### 5.2 Composants Principaux

#### Layout
- **DashboardLayout** : Layout principal avec sidebar et navbar
- **Sidebar** : Navigation latérale avec menu
- **Navbar** : Barre supérieure avec infos utilisateur

#### Pages CRUD
Chaque page CRUD (Camions, Remorques, etc.) propose :
- Liste en tableau (desktop) ou cartes (mobile)
- Dialog d'ajout/modification
- Suppression avec confirmation
- Recherche et filtres

#### Visualisation Pneus
La page Pneus offre une **visualisation graphique** :
- Sélection du véhicule (camion ou remorque)
- Affichage graphique des positions de pneus
- Code couleur selon l'état (bon, usé, critique)
- Clic sur une position pour ajouter/modifier un pneu

### 5.3 Gestion de l'État

#### AuthContext
Gère l'authentification globale :
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

#### Services API
Centralisation des appels API avec Axios :
- Intercepteur pour ajouter le token JWT
- Redirection automatique sur 401 (non authentifié)

---

## 6. Modèles de Données

### 6.1 User (Utilisateur)
```typescript
interface IUser {
  _id: ObjectId;
  nom: string;
  email: string;           // Unique
  password: string;        // Hashé avec bcrypt
  role: 'admin' | 'chauffeur';
  telephone: string;
  isActive: boolean;       // Activation par admin
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.2 Camion
```typescript
interface ICamion {
  _id: ObjectId;
  immatriculation: string;  // Unique
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  statut: 'disponible' | 'en_mission' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.3 Remorque
```typescript
interface IRemorque {
  _id: ObjectId;
  immatriculation: string;  // Unique
  type: string;
  capacite: number;
  statut: 'disponible' | 'en_mission' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.4 Pneu
```typescript
interface IPneu {
  _id: ObjectId;
  vehiculeId: ObjectId;     // Réf vers Camion ou Remorque
  vehiculeType: 'camion' | 'remorque';
  position: string;         // Ex: "AV-G", "AR1-D", "E1-G1"
  marque: string;
  kmInstallation: number;
  kmLimite: number;
  statut: 'bon' | 'use' | 'a_changer';
  createdAt: Date;
  updatedAt: Date;
}
// Index unique: (vehiculeId, position)
```

#### Positions des Pneus
**Camion (6 positions)** :
```
    AV-G  [Cabine]  AV-D    ← Avant
         [Corps]
    AR1-G [Essieu] AR1-D    ← Arrière 1
    AR2-G [Essieu] AR2-D    ← Arrière 2
```

**Remorque 2 essieux (8 positions)** :
```
    E1-G1 E1-G2 [E1] E1-D1 E1-D2    ← Essieu 1
    E2-G1 E2-G2 [E2] E2-D1 E2-D2    ← Essieu 2
```

**Remorque 3 essieux (12 positions)** :
```
    E1-G1 E1-G2 [E1] E1-D1 E1-D2
    E2-G1 E2-G2 [E2] E2-D1 E2-D2
    E3-G1 E3-G2 [E3] E3-D1 E3-D2
```

### 6.5 Trajet
```typescript
interface ITrajet {
  _id: ObjectId;
  chauffeurId: ObjectId;    // Réf → User
  camionId: ObjectId;       // Réf → Camion
  remorqueId?: ObjectId;    // Réf → Remorque (optionnel)
  depart: string;
  arrivee: string;
  dateDepart: Date;
  dateArrivee?: Date;
  kilometrage: number;
  gasoil?: number;
  statut: 'a_faire' | 'en_cours' | 'termine';
  remarques?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.6 Maintenance
```typescript
interface IMaintenance {
  _id: ObjectId;
  camionId: ObjectId;       // Réf → Camion
  type: 'vidange' | 'pneus' | 'revision' | 'reparation';
  description: string;
  datePrevue: Date;
  dateRealisee?: Date;
  cout?: number;
  statut: 'planifiee' | 'terminee';
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.7 Diagramme Entité-Relation

```
┌──────────┐       ┌──────────┐       ┌───────────┐
│   User   │       │  Camion  │       │ Remorque  │
├──────────┤       ├──────────┤       ├───────────┤
│ _id      │       │ _id      │       │ _id       │
│ nom      │       │ immat    │       │ immat     │
│ email    │       │ marque   │       │ type      │
│ password │       │ modele   │       │ capacite  │
│ role     │       │ annee    │       │ statut    │
│ telephone│       │ km       │       └───────────┘
│ isActive │       │ statut   │             │
└──────────┘       └──────────┘             │
      │                 │                    │
      │                 │                    │
      ▼                 ▼                    ▼
┌─────────────────────────────────────────────────┐
│                    Trajet                       │
├─────────────────────────────────────────────────┤
│ chauffeurId → User                              │
│ camionId → Camion                               │
│ remorqueId → Remorque (optionnel)               │
│ depart, arrivee, kilometrage, statut...         │
└─────────────────────────────────────────────────┘

┌──────────┐                    ┌───────────────┐
│  Camion  │◄──────────────────│  Maintenance  │
│ Remorque │                    └───────────────┘
└──────────┘
      │
      ▼
┌──────────┐
│   Pneu   │
├──────────┤
│ vehiculeId → Camion/Remorque
│ vehiculeType
│ position (unique par véhicule)
│ marque, km, statut...
└──────────┘
```

---

## 7. Authentification et Sécurité

### 7.1 Flux d'Authentification

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Client  │         │ Backend │         │ MongoDB  │
└────┬────┘         └────┬────┘         └────┬─────┘
     │                   │                    │
     │  POST /login      │                    │
     │  {email, password}│                    │
     │──────────────────>│                    │
     │                   │  findOne(email)    │
     │                   │───────────────────>│
     │                   │    user            │
     │                   │<───────────────────│
     │                   │                    │
     │                   │ bcrypt.compare()   │
     │                   │ jwt.sign()         │
     │                   │                    │
     │  {token, user}    │                    │
     │<──────────────────│                    │
     │                   │                    │
     │  GET /api/camion  │                    │
     │  Authorization:   │                    │
     │  Bearer <token>   │                    │
     │──────────────────>│                    │
     │                   │ jwt.verify()       │
     │                   │ authenticate()     │
     │                   │                    │
     │  {camions}        │                    │
     │<──────────────────│                    │
```

### 7.2 Middlewares de Sécurité

#### authenticate
Vérifie la présence et la validité du token JWT.

#### authorize(role)
Vérifie que l'utilisateur a le rôle requis ('admin' ou 'chauffeur').

### 7.3 Hashage des Mots de Passe
- Algorithme : bcrypt
- Salt rounds : 10

### 7.4 Token JWT
- Durée de validité : 1 jour
- Payload : `{ id, role }`

---

## 8. Fonctionnalités Métier

### 8.1 Gestion des Ressources Disponibles

Lors de la création d'un trajet, seules les ressources **disponibles** sont proposées :

**Règle** : Un véhicule ou chauffeur est considéré comme "non disponible" s'il est assigné à un trajet avec statut `a_faire` ou `en_cours`.

```typescript
// Récupération des ressources en cours d'utilisation
const activeTrajets = await trajetModel.find({ 
  statut: { $in: ['a_faire', 'en_cours'] } 
});

// Filtrage des camions disponibles
const availableCamions = await camionModel.find({ 
  _id: { $nin: usedCamionIds },
  statut: { $ne: 'maintenance' }
});
```

### 8.2 Cycle de Vie d'un Trajet

```
┌─────────┐      Démarrer      ┌──────────┐      Terminer     ┌──────────┐
│ À faire │ ────────────────> │ En cours │ ────────────────> │ Terminé  │
└─────────┘                    └──────────┘                   └──────────┘
```

### 8.3 Gestion des Pneus

- **Visualisation graphique** de l'emplacement des pneus
- **Code couleur** :
  - 🟢 Vert : Bon état
  - 🟠 Orange : Usé
  - 🔴 Rouge : À changer
  - ⬜ Gris pointillé : Position vide
- **Une position = un seul pneu** (index unique)

### 8.4 Activation des Chauffeurs

1. Un chauffeur s'inscrit via `/register`
2. Son compte est créé avec `isActive: false`
3. L'admin active le compte via toggle
4. Le chauffeur peut maintenant se connecter

---

## 9. Déploiement Docker

### 9.1 Services

```yaml
services:
  mongodb:     # Base de données
  backend:     # API Express
  frontend:    # App React (Nginx)
```

### 9.2 Commandes

```bash
# Construire et démarrer
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Supprimer avec volumes
docker-compose down -v
```

### 9.3 Ports

| Service | Port Interne | Port Externe |
|---------|--------------|--------------|
| MongoDB | 27017 | 27017 |
| Backend | 5000 | 5000 |
| Frontend | 80 | 80 |

---

## 10. Tests

### 10.1 Tests Backend

```bash
cd backend
npm test              # Exécuter les tests
npm run test:watch    # Mode watch
npm run test:coverage # Couverture de code
```

### 10.2 Structure des Tests

```
backend/src/tests/
├── user.test.ts       # Tests utilisateurs
└── validation.test.ts # Tests de validation
```

---

## 11. Diagrammes UML

Les diagrammes UML sont disponibles dans le dossier `conception UML/` :
- `diagram_classe.drawio` : Diagramme de classes

---

## 📝 Changelog

### Version 1.0.0
- ✅ Authentification JWT (Admin/Chauffeur)
- ✅ CRUD Camions, Remorques, Pneus, Trajets, Maintenance
- ✅ Gestion des chauffeurs avec activation
- ✅ Filtrage des ressources disponibles pour les trajets
- ✅ Visualisation graphique des pneus
- ✅ Interface responsive (desktop/mobile)
- ✅ Déploiement Docker

---

## 👥 Auteur

**Ayoub Labit**

---

## 📄 Licence

ISC License
