# 📱 Track Go - Documentation Frontend

## Vue d'ensemble

Le frontend est une application React avec TypeScript, Vite et Material-UI.

---

## 📁 Structure des fichiers

```
frontend/src/
├── components/
│   └── ProtectedRoute.tsx    # Protection des routes
├── context/
│   └── AuthContext.tsx       # État global d'authentification
├── pages/
│   ├── Login.tsx             # Page de connexion
│   ├── Register.tsx          # Page d'inscription
│   ├── Dashboard.tsx         # Tableau de bord
│   └── NotFound.tsx          # Page 404
├── routes/
│   └── AppRoutes.tsx         # Configuration des routes
├── services/
│   └── api.ts                # Configuration Axios
├── types/
│   └── auth.ts               # Types TypeScript
├── App.tsx                   # Composant racine
├── main.tsx                  # Point d'entrée
└── index.css                 # Styles globaux
```

---

## 🔐 Système d'authentification

### AuthContext.tsx

Le contexte fournit l'état d'authentification à toute l'application.

```tsx
// Types
interface User {
    _id: string;
    nom: string;
    email: string;
    role: 'admin' | 'chauffeur';
    isActive: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}
```

### Comment ça fonctionne

1. **Initialisation** : Au chargement, vérifie localStorage pour token/user
2. **Login** : Appelle l'API, stocke token+user dans localStorage et state
3. **Register** : Crée le compte, redirige vers login
4. **Logout** : Vide localStorage et state, redirige vers login

### Utilisation

```tsx
import { useAuth } from '../context/AuthContext';

const MonComposant = () => {
    const { user, logout, loading } = useAuth();
    
    if (loading) return <CircularProgress />;
    
    return (
        <div>
            <p>Connecté en tant que: {user?.nom}</p>
            <p>Rôle: {user?.role}</p>
            <Button onClick={logout}>Déconnexion</Button>
        </div>
    );
};
```

---

## 🛡️ Protection des routes

### ProtectedRoute.tsx

Composant wrapper pour protéger les routes.

```tsx
interface Props {
    children: ReactNode;
    allowedRoles?: string[];  // Optionnel: limiter à certains rôles
}
```

### Exemples d'utilisation

```tsx
// Route accessible à tous les utilisateurs connectés
<Route path="/dashboard" element={
    <ProtectedRoute>
        <Dashboard />
    </ProtectedRoute>
} />

// Route admin uniquement
<Route path="/admin/users" element={
    <ProtectedRoute allowedRoles={['admin']}>
        <UserManagement />
    </ProtectedRoute>
} />

// Route chauffeur uniquement
<Route path="/mes-trajets" element={
    <ProtectedRoute allowedRoles={['chauffeur']}>
        <MesTrajets />
    </ProtectedRoute>
} />

// Route admin OU chauffeur
<Route path="/profile" element={
    <ProtectedRoute allowedRoles={['admin', 'chauffeur']}>
        <Profile />
    </ProtectedRoute>
} />
```

### Comportement

| Situation | Action |
|-----------|--------|
| Chargement en cours | Affiche spinner |
| Non connecté | Redirige vers `/login` |
| Rôle non autorisé | Redirige vers `/dashboard` |
| Connecté + autorisé | Affiche le composant enfant |

---

## 🌐 Service API (Axios)

### Configuration

```typescript
// services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});
```

### Intercepteurs

**Request Interceptor** - Ajoute le token automatiquement :
```typescript
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**Response Interceptor** - Gère les erreurs 401 :
```typescript
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### APIs disponibles

```typescript
// Authentification
export const authAPI = {
    login: (email: string, password: string) => 
        api.post('/user/login', { email, password }),
    register: (data: RegisterData) => 
        api.post('/user/register', data)
};

// Administration
export const adminAPI = {
    getChauffeurs: () => 
        api.get('/user/chauffeurs'),
    toggleChauffeurStatus: (id: string) => 
        api.patch(`/user/chauffeurs/${id}/toggle`)
};
```

### Ajouter une nouvelle API

```typescript
// Exemple: API pour les trajets
export const trajetAPI = {
    getAll: () => api.get('/trajets'),
    getById: (id: string) => api.get(`/trajets/${id}`),
    create: (data: TrajetData) => api.post('/trajets', data),
    update: (id: string, data: TrajetData) => api.put(`/trajets/${id}`, data),
    delete: (id: string) => api.delete(`/trajets/${id}`)
};
```

---

## 🎨 Style avec Material-UI

### Thème global

```tsx
// App.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },    // Bleu
        secondary: { main: '#dc004e' },   // Rose
        success: { main: '#2e7d32' },     // Vert
        error: { main: '#d32f2f' },       // Rouge
        warning: { main: '#ed6c02' }      // Orange
    },
    typography: {
        fontFamily: '"Roboto", sans-serif'
    }
});

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* ... */}
    </ThemeProvider>
);
```

### Système sx

Le prop `sx` permet le styling inline avec les valeurs du thème :

```tsx
<Box sx={{
    // Espacement (unité = 8px)
    p: 2,           // padding: 16px
    m: 1,           // margin: 8px
    mb: 3,          // margin-bottom: 24px
    py: 2,          // padding-top/bottom: 16px
    
    // Layout
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,         // gap: 16px
    
    // Dimensions
    width: '100%',
    maxWidth: 400,
    minHeight: '100vh',
    
    // Couleurs
    bgcolor: '#f5f5f5',           // Couleur directe
    bgcolor: 'primary.main',       // Couleur du thème
    color: 'text.secondary',       // Couleur texte secondaire
    
    // Bordures
    borderRadius: 1,               // 8px
    border: '1px solid #ddd'
}}>
```

### Composants MUI utilisés

| Composant | Usage |
|-----------|-------|
| `Box` | Container flexible (div) |
| `Paper` | Card avec ombre |
| `Typography` | Texte avec variants |
| `TextField` | Champs de formulaire |
| `Button` | Boutons |
| `Alert` | Messages d'erreur/succès |
| `CircularProgress` | Spinner de chargement |
| `AppBar` / `Toolbar` | Barre de navigation |
| `Table` / `TableRow` | Tableaux |
| `Chip` | Badges (statuts, rôles) |
| `List` / `ListItem` | Listes |

---

## 📄 Pages

### Login.tsx

**Fonction** : Formulaire de connexion

**État local** :
```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
```

**Soumission** :
```tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        await login(email, password);
        // Redirection automatique via AuthContext
    } catch (err: any) {
        setError(err.message || 'Erreur de connexion');
    }
};
```

### Register.tsx

**Fonction** : Inscription des chauffeurs

**Particularités** :
- Le rôle est fixé à `chauffeur` (pas modifiable)
- Validation locale (mots de passe identiques, longueur)
- Message d'attente d'activation admin

### Dashboard.tsx

**Fonction** : Tableau de bord selon le rôle

**Contenu Admin** :
- Liste des chauffeurs avec statut
- Boutons activer/désactiver

**Contenu Chauffeur** :
- Menu trajets
- Menu véhicule

**Chargement des données** :
```tsx
useEffect(() => {
    if (user?.role === 'admin') {
        loadChauffeurs();
    }
}, [user]);

const loadChauffeurs = async () => {
    setLoading(true);
    try {
        const res = await adminAPI.getChauffeurs();
        setChauffeurs(res.data.chauffeurs);
    } catch (error) {
        console.error('Erreur');
    }
    setLoading(false);
};
```

---

## 📝 Créer une nouvelle page

### Étape 1: Créer le fichier

```tsx
// pages/MaPage.tsx
import { Box, Typography, Paper } from '@mui/material';

const MaPage = () => {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Ma Page</Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
                Contenu...
            </Paper>
        </Box>
    );
};

export default MaPage;
```

### Étape 2: Ajouter la route

```tsx
// routes/AppRoutes.tsx
import MaPage from '../pages/MaPage';

// Dans le Switch
<Route path="/ma-page" element={
    <ProtectedRoute allowedRoles={['admin']}>
        <MaPage />
    </ProtectedRoute>
} />
```

### Étape 3: Ajouter navigation (optionnel)

```tsx
// Dans Dashboard ou autre
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<Button onClick={() => navigate('/ma-page')}>
    Aller à Ma Page
</Button>
```

---

## 🔧 Types TypeScript

### auth.ts

```typescript
export interface User {
    _id: string;
    nom: string;
    email: string;
    telephone: string;
    role: 'admin' | 'chauffeur';
    isActive: boolean;
    createdAt: string;
}

export interface RegisterData {
    nom: string;
    email: string;
    password: string;
    telephone: string;
    role: 'chauffeur';
}

export interface LoginResponse {
    token: string;
    user: User;
}
```

### Ajouter de nouveaux types

```typescript
// types/trajet.ts
export interface Trajet {
    _id: string;
    depart: string;
    arrivee: string;
    dateDepart: Date;
    chauffeurId: string;
    statut: 'planifie' | 'en_cours' | 'termine';
}
```

---

## 🚀 Commandes

```bash
npm run dev      # Développement (http://localhost:5173)
npm run build    # Build production
npm run preview  # Preview du build
npm run lint     # Vérifier le code
```

---

## 📌 Bonnes pratiques

1. **Toujours utiliser TypeScript** - Types pour props, états, API responses
2. **Utiliser sx au lieu de CSS** - Cohérence avec MUI
3. **Gérer les erreurs** - try/catch + messages utilisateur
4. **États de chargement** - Afficher des spinners
5. **Séparer la logique** - Composants, hooks, services
