# 🚀 Track-Go - Guide d'Installation

## Prérequis

### Outils Requis
| Outil | Version Minimale | Vérification |
|-------|------------------|--------------|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| MongoDB | 6.0 | `mongod --version` |
| Git | 2.x | `git --version` |
| Docker (optionnel) | 20.x | `docker --version` |

---

## Option 1 : Installation Locale

### 1. Cloner le projet
```bash
git clone https://github.com/labitayoub/Track-Go.git
cd Track-Go
```

### 2. Configuration Backend

#### 2.1 Installer les dépendances
```bash
cd backend
npm install
```

#### 2.2 Configurer l'environnement
```bash
# Créer le fichier .env
cp .env.example .env
```

Modifier `.env` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackgo
JWT_SECRET=votre-cle-secrete-super-longue-et-complexe
NODE_ENV=development
```

#### 2.3 Démarrer MongoDB
```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

#### 2.4 Créer l'admin initial
```bash
npm run seed
```

Credentials créés :
- **Email:** `admin@trackgo.com`
- **Password:** `admin123`

#### 2.5 Démarrer le serveur
```bash
npm run dev
```

Le backend sera disponible sur `http://localhost:5000`

### 3. Configuration Frontend

#### 3.1 Installer les dépendances
```bash
cd ../frontend
npm install
```

#### 3.2 Démarrer le serveur de développement
```bash
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`

---

## Option 2 : Installation avec Docker

### 1. Cloner le projet
```bash
git clone https://github.com/labitayoub/Track-Go.git
cd Track-Go
```

### 2. Lancer avec Docker Compose
```bash
docker-compose up -d --build
```

### 3. Vérifier les conteneurs
```bash
docker-compose ps
```

### 4. Accéder à l'application

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:3001/api |
| MongoDB | localhost:27017 |

### 5. Créer l'admin (première fois)
```bash
docker-compose exec backend npm run seed
```

### 6. Voir les logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 7. Arrêter les services
```bash
docker-compose down
```

### 8. Supprimer les données (reset)
```bash
docker-compose down -v
```

---

## Scripts Disponibles

### Backend
```bash
npm run dev        # Démarrage en mode développement (nodemon)
npm run build      # Compilation TypeScript
npm start          # Démarrage en production
npm run seed       # Créer l'admin initial
npm test           # Exécuter les tests
npm run test:watch # Tests en mode watch
npm run test:coverage # Couverture de code
```

### Frontend
```bash
npm run dev      # Serveur de développement Vite
npm run build    # Build de production
npm run lint     # Vérification ESLint
npm run preview  # Prévisualisation du build
```

---

## Variables d'Environnement

### Backend (.env)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur | `5000` |
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb://localhost:27017/trackgo` |
| `JWT_SECRET` | Clé secrète pour JWT | `your-super-secret-key-123` |
| `NODE_ENV` | Environnement | `development` / `production` |

### Docker Compose (docker-compose.yml)

Les variables sont déjà configurées dans le fichier pour l'environnement Docker.

---

## Structure des Branches

| Branche | Description |
|---------|-------------|
| `master` | Branche principale stable |
| `TG-Frontend-Layout` | Développement frontend |
| `feature/*` | Branches de fonctionnalités |

---

## Vérification de l'Installation

### 1. Tester le Backend
```bash
curl http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trackgo.com","password":"admin123"}'
```

Réponse attendue :
```json
{
  "message": "Login successful",
  "user": {...},
  "token": "eyJ..."
}
```

### 2. Tester le Frontend
Ouvrir `http://localhost:5173` (dev) ou `http://localhost` (Docker)

- Connexion avec `admin@trackgo.com` / `admin123`
- Accès au Dashboard

---

## Résolution des Problèmes

### MongoDB ne démarre pas
```bash
# Vérifier si le service est déjà en cours
sudo lsof -i :27017

# Ou sur Windows, dans PowerShell en admin
netstat -ano | findstr :27017
```

### Port déjà utilisé
```bash
# Changer le port dans .env
PORT=3001

# Ou tuer le processus existant
kill -9 <PID>
```

### Erreur de connexion MongoDB
- Vérifier que MongoDB est bien démarré
- Vérifier l'URI dans `.env`
- S'assurer qu'aucun firewall ne bloque le port 27017

### Token JWT invalide
- Supprimer le token du localStorage
- Se reconnecter

---

## Contact

Pour toute question : **Ayoub Labit**
