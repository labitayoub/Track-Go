# 📚 Track Go - Documentation Complète

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Installation et Configuration](#installation-et-configuration)
4. [Backend - API](#backend---api)
5. [Frontend - React](#frontend---react)
6. [Authentification et Autorisation](#authentification-et-autorisation)
7. [Gestion des Chauffeurs](#gestion-des-chauffeurs)
8. [Tests](#tests)
9. [Déploiement](#déploiement)

---

## Vue d'ensemble

**Track Go** est une application de gestion de transport avec :
- Système d'authentification JWT
- Gestion des rôles (admin / chauffeur)
- Interface React avec Material-UI
- API REST avec Express.js et MongoDB

### Stack Technique

| Couche | Technologies |
|--------|--------------|
| **Frontend** | React 18, TypeScript, Vite, Material-UI, Axios |
| **Backend** | Node.js, Express 5, TypeScript, MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **Validation** | Joi |
| **Tests** | Jest |

---

## Architecture du projet

```
Track Go/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration DB
│   │   ├── controllers/     # Logique des endpoints
│   │   ├── middlewares/     # Auth, validation
│   │   ├── models/          # Schémas Mongoose
│   │   ├── routes/          # Définition des routes
│   │   ├── services/        # Logique métier
│   │   ├── validators/      # Schémas Joi
│   │   ├── seeders/         # Données initiales
│   │   └── server.ts        # Point d'entrée
│   └── docs/
│       └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Pages (Login, Register, Dashboard)
│   │   ├── routes/          # Configuration des routes
│   │   ├── services/        # API calls (axios)
│   │   ├── types/           # Types TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
│
└── docs/
    └── DOCUMENTATION.md     # Ce fichier
```

---

## Installation et Configuration

### Prérequis

- Node.js v20.19+ ou v22.12+
- MongoDB (local ou Atlas)
- npm ou yarn

### Backend

```bash
cd backend
npm install
```

Créer `.env` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/track_go
JWT_SECRET=votre_secret_jwt_securise
JWT_EXPIRE=1d
NODE_ENV=development
```

Lancer :
```bash
npm run dev          # Développement avec nodemon
npm run build        # Compiler TypeScript
npm start            # Production
npm run seed         # Créer admin par défaut
npm test             # Lancer les tests
```

### Frontend

```bash
cd frontend
npm install
```

Créer `.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

Lancer :
```bash
npm run dev          # Développement
npm run build        # Build production
npm run preview      # Preview du build
```

---

## Backend - API

### Structure d'une route

```
Route → Middleware → Controller → Service → Model → MongoDB
```

### Endpoints disponibles

| Méthode | Endpoint | Description | Auth | Rôle |
|---------|----------|-------------|------|------|
| POST | `/api/user/register` | Inscription chauffeur | ❌ | - |
| POST | `/api/user/login` | Connexion | ❌ | - |
| GET | `/api/user/chauffeurs` | Liste des chauffeurs | ✅ | admin |
| PATCH | `/api/user/chauffeurs/:id/toggle` | Activer/Désactiver chauffeur | ✅ | admin |

### Exemple: Créer un nouveau endpoint

#### 1. Créer le Service (`services/exempleService.ts`)

```typescript
import ExempleModel from '../models/exempleModel';

export const getAll = async () => {
    return await ExempleModel.find();
};

export const create = async (data: any) => {
    const exemple = new ExempleModel(data);
    return await exemple.save();
};
```

#### 2. Créer le Controller (`controllers/exempleController.ts`)

```typescript
import { Request, Response } from 'express';
import * as exempleService from '../services/exempleService';

export const getAll = async (req: Request, res: Response) => {
    try {
        const items = await exempleService.getAll();
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
```

#### 3. Créer la Route (`routes/exempleRoute.ts`)

```typescript
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import * as exempleController from '../controllers/exempleController';

const router = Router();

router.get('/', authenticate, authorize('admin'), exempleController.getAll);

export default router;
```

#### 4. Enregistrer dans server.ts

```typescript
import exempleRoutes from './routes/exempleRoute';
app.use('/api/exemple', exempleRoutes);
```

### Validation avec Joi

Créer un validateur (`validators/exempleValidator.ts`):

```typescript
import Joi from 'joi';

export const createSchema = Joi.object({
    nom: Joi.string().min(2).max(50).required()
        .messages({
            'string.empty': 'Le nom est requis',
            'string.min': 'Le nom doit avoir au moins 2 caractères'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Email invalide'
        })
});
```

Utiliser dans le controller:

```typescript
import { createSchema } from '../validators/exempleValidator';

export const create = async (req: Request, res: Response) => {
    // Validation
    const { error } = createSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    // Suite du code...
};
```

---

## Frontend - React

### Structure des composants

```
App.tsx
├── ThemeProvider (MUI)
├── AuthProvider (Context)
└── Router
    └── AppRoutes
        ├── /login → Login.tsx
        ├── /register → Register.tsx
        ├── /dashboard → ProtectedRoute → Dashboard.tsx
        └── /* → NotFound.tsx
```

### AuthContext (`context/AuthContext.tsx`)

Le contexte gère l'état d'authentification global :

```typescript
interface AuthContextType {
    user: User | null;      // Utilisateur connecté
    token: string | null;   // JWT token
    loading: boolean;       // État de chargement
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}
```

**Utilisation dans un composant :**

```tsx
import { useAuth } from '../context/AuthContext';

const MonComposant = () => {
    const { user, logout, loading } = useAuth();
    
    if (loading) return <CircularProgress />;
    
    return (
        <div>
            <p>Bonjour {user?.nom}</p>
            <button onClick={logout}>Déconnexion</button>
        </div>
    );
};
```

### API Service (`services/api.ts`)

Configuration Axios centralisée :

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Intercepteur: Ajoute le token automatiquement
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur: Gère les erreurs 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

**Ajouter une nouvelle API :**

```typescript
// Dans api.ts
export const exempleAPI = {
    getAll: () => api.get('/exemple'),
    getById: (id: string) => api.get(`/exemple/${id}`),
    create: (data: any) => api.post('/exemple', data),
    update: (id: string, data: any) => api.put(`/exemple/${id}`, data),
    delete: (id: string) => api.delete(`/exemple/${id}`)
};
```

### ProtectedRoute (`components/ProtectedRoute.tsx`)

Protection des routes avec gestion des rôles :

```tsx
interface Props {
    children: ReactNode;
    allowedRoles?: string[];  // Rôles autorisés (optionnel)
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const { user, loading } = useAuth();
    
    if (loading) return <CircularProgress />;
    
    // Non connecté → Login
    if (!user) return <Navigate to="/login" />;
    
    // Rôle non autorisé → Dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }
    
    return <>{children}</>;
};
```

**Utilisation :**

```tsx
// Route pour tous les utilisateurs connectés
<Route path="/dashboard" element={
    <ProtectedRoute>
        <Dashboard />
    </ProtectedRoute>
} />

// Route admin seulement
<Route path="/admin" element={
    <ProtectedRoute allowedRoles={['admin']}>
        <AdminPanel />
    </ProtectedRoute>
} />
```

### Style avec Material-UI

On utilise le système `sx` de MUI (pas de CSS externe) :

```tsx
import { Box, Paper, Typography, Button } from '@mui/material';

const MonComposant = () => (
    <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5'  // ou 'background.default'
    }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Titre
            </Typography>
            <Button variant="contained" fullWidth>
                Action
            </Button>
        </Paper>
    </Box>
);
```

**Propriétés sx courantes :**

| Propriété | Équivalent CSS |
|-----------|----------------|
| `p: 2` | `padding: 16px` (2 * 8px) |
| `m: 1` | `margin: 8px` |
| `mb: 3` | `margin-bottom: 24px` |
| `py: 2` | `padding-top/bottom: 16px` |
| `gap: 2` | `gap: 16px` |
| `bgcolor` | `background-color` |

---

## Authentification et Autorisation

### Flux d'authentification

```
1. Utilisateur → POST /login (email, password)
2. Backend → Vérifie credentials, génère JWT
3. Frontend → Stocke token + user dans localStorage
4. Requêtes suivantes → Header: Authorization: Bearer <token>
5. Backend → Vérifie token via middleware authenticate
6. Backend → Vérifie rôle via middleware authorize
```

### Middleware Backend

```typescript
// middlewares/authMiddleware.ts

// Vérifie que l'utilisateur est connecté
export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token requis' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Compte inactif' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

// Vérifie le rôle de l'utilisateur
export const authorize = (...roles: string[]) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès refusé' });
        }
        next();
    };
};
```

### Stockage côté client

```typescript
// Après login réussi
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Au chargement de l'app (AuthContext)
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

// À la déconnexion
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## Gestion des Chauffeurs

### Inscription d'un chauffeur

1. Le chauffeur s'inscrit via `/register`
2. Son compte est créé avec `isActive: false`
3. Message: "En attente d'activation par un administrateur"

### Activation par l'admin

1. L'admin se connecte au Dashboard
2. Voit la liste des chauffeurs avec leur statut
3. Clique "Activer" ou "Désactiver"
4. API: `PATCH /api/user/chauffeurs/:id/toggle`

### Code Backend

```typescript
// controllers/userController.ts
export const toggleChauffeurStatus = async (req, res) => {
    const { id } = req.params;
    
    const chauffeur = await UserModel.findById(id);
    if (!chauffeur || chauffeur.role !== 'chauffeur') {
        return res.status(404).json({ message: 'Chauffeur non trouvé' });
    }
    
    chauffeur.isActive = !chauffeur.isActive;
    await chauffeur.save();
    
    res.json({ 
        message: `Chauffeur ${chauffeur.isActive ? 'activé' : 'désactivé'}`,
        chauffeur 
    });
};
```

### Code Frontend

```tsx
// pages/Dashboard.tsx
const toggleStatus = async (id: string) => {
    try {
        await adminAPI.toggleChauffeurStatus(id);
        loadChauffeurs(); // Recharger la liste
    } catch (error) {
        console.error('Erreur');
    }
};

// Bouton dans le tableau
<Button
    variant="contained"
    color={chauffeur.isActive ? 'warning' : 'success'}
    onClick={() => toggleStatus(chauffeur._id)}
>
    {chauffeur.isActive ? 'Désactiver' : 'Activer'}
</Button>
```

---

## Tests

### Configuration Jest

```javascript
// jest.config.cjs
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }]
    }
};
```

### Exemple de test

```typescript
// tests/user.test.ts
import { registerSchema, loginSchema } from '../validators/userValidator';

describe('User Validation', () => {
    describe('Register Schema', () => {
        it('should validate correct data', () => {
            const data = {
                nom: 'Test User',
                email: 'test@test.com',
                password: 'password123',
                telephone: '0612345678',
                role: 'chauffeur'
            };
            
            const { error } = registerSchema.validate(data);
            expect(error).toBeUndefined();
        });
        
        it('should reject invalid email', () => {
            const data = {
                nom: 'Test',
                email: 'invalid-email',
                password: 'pass123',
                telephone: '0612345678',
                role: 'chauffeur'
            };
            
            const { error } = registerSchema.validate(data);
            expect(error).toBeDefined();
        });
    });
});
```

### Lancer les tests

```bash
cd backend
npm test              # Tous les tests
npm test -- --watch   # Mode watch
npm test -- user      # Tests contenant "user"
```

---

## Déploiement

### Avec Docker

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/track_go
      - JWT_SECRET=production_secret
    depends_on:
      - mongo
      
  frontend:
    build: ./frontend
    ports:
      - "80:80"
      
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Variables d'environnement production

```env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/track_go
JWT_SECRET=production_secret_tres_long_et_securise
JWT_EXPIRE=1d
NODE_ENV=production

# Frontend
VITE_API_URL=https://api.trackgo.com/api
```

---

## Résumé des commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer en dev (backend ou frontend) |
| `npm run build` | Build production |
| `npm test` | Lancer les tests |
| `npm run seed` | Créer l'admin par défaut |

## Credentials Admin par défaut

| Champ | Valeur |
|-------|--------|
| Email | ayoub@trackgo.com |
| Password | password |
| Role | admin |

---

## Contact

Pour toute question sur le projet, consultez cette documentation ou les README spécifiques dans chaque dossier.
