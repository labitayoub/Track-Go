# Track Go - Documentation Backend

## 📋 Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Authentification](#authentification)
- [API Endpoints](#api-endpoints)
- [Validation](#validation)
- [Tests](#tests)

---

## Installation

```bash
cd backend
npm install
```

## Configuration

Créer un fichier `.env` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/track_go
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=1d
NODE_ENV=development
```

## Lancer le serveur

```bash
npm run dev     # Mode développement
npm run build   # Build production
npm start       # Mode production
```

---

## Authentification

### Système de rôles

| Rôle | Description |
|------|-------------|
| `admin` | Accès complet (gestion flotte, chauffeurs, rapports) |
| `chauffeur` | Accès limité (trajets, véhicule assigné) |

### Middleware

```typescript
import { authenticate, authorize } from './middlewares/authMiddleware';

// Route protégée (tous les utilisateurs connectés)
router.get('/profile', authenticate, getProfile);

// Route admin seulement
router.get('/users', authenticate, authorize('admin'), getUsers);

// Route chauffeur seulement
router.get('/trajets', authenticate, authorize('chauffeur'), getTrajets);

// Plusieurs rôles autorisés
router.get('/dashboard', authenticate, authorize('admin', 'chauffeur'), getDashboard);
```

---

## API Endpoints

### Auth

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/user/register` | Inscription chauffeur | ❌ |
| POST | `/api/user/login` | Connexion | ❌ |

### Register

```http
POST /api/user/register
Content-Type: application/json

{
    "nom": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "telephone": "0612345678",
    "role": "chauffeur"
}
```

**Réponse succès (201):**
```json
{
    "message": "Chauffeur registered successfully. Waiting for admin activation.",
    "user": {
        "_id": "...",
        "nom": "John Doe",
        "email": "john@example.com",
        "role": "chauffeur",
        "telephone": "0612345678",
        "isActive": false
    }
}
```

### Login

```http
POST /api/user/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

**Réponse succès (200):**
```json
{
    "message": "Login successful",
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Validation

### Joi Schemas

Les validations sont gérées avec **Joi** dans `src/validators/userValidator.ts`.

#### Register Schema

| Champ | Type | Règles |
|-------|------|--------|
| `nom` | string | min: 2, max: 50, requis |
| `email` | string | format email, requis |
| `password` | string | min: 6, requis |
| `role` | string | 'admin' ou 'chauffeur', requis |
| `telephone` | string | 10 chiffres, requis |

#### Login Schema

| Champ | Type | Règles |
|-------|------|--------|
| `email` | string | format email, requis |
| `password` | string | requis |

### Exemple d'erreur validation

```json
{
    "message": "Le mot de passe doit contenir au moins 6 caractères"
}
```

---

## Tests

### Lancer les tests

```bash
npm test              # Tous les tests
npm run test:watch    # Mode watch
npm run test:coverage # Avec couverture
```

### Structure des tests

```
src/tests/
├── user.test.ts        # Tests utilisateur
└── validation.test.ts  # Tests validation Joi
```

### Résultats attendus

```
 PASS  src/tests/user.test.ts
 PASS  src/tests/validation.test.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

---

## Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   └── userController.ts
│   ├── middlewares/
│   │   └── authMiddleware.ts
│   ├── models/
│   │   └── userModel.ts
│   ├── routes/
│   │   └── userRoute.ts
│   ├── services/
│   │   └── userService.ts
│   ├── validators/
│   │   └── userValidator.ts
│   ├── tests/
│   │   ├── user.test.ts
│   │   └── validation.test.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Erreur de validation / Données invalides |
| 401 | Non authentifié / Token invalide |
| 403 | Accès interdit (rôle insuffisant) |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |
