# 📚 Track-Go - Documentation API

## Base URL
```
http://localhost:5000/api
```

## Headers Requis

### Authentification
```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 🔐 Authentification

### POST /user/register
Inscription d'un nouveau chauffeur.

**Body:**
```json
{
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "password": "password123",
  "telephone": "0612345678"
}
```

**Réponse 201:**
```json
{
  "message": "Chauffeur registered successfully. Waiting for admin activation.",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "role": "chauffeur",
    "telephone": "0612345678",
    "isActive": false
  }
}
```

**Erreurs:**
- `400` - Email déjà utilisé
- `400` - Validation échouée

---

### POST /user/login
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "admin@trackgo.com",
  "password": "admin123"
}
```

**Réponse 200:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Admin",
    "email": "admin@trackgo.com",
    "role": "admin",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs:**
- `400` - User not found
- `400` - Incorrect password
- `400` - Account not activated

---

### GET /user/chauffeurs
Liste de tous les chauffeurs. **[Admin Only]**

**Réponse 200:**
```json
{
  "chauffeurs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nom": "Jean Dupont",
      "email": "jean@example.com",
      "role": "chauffeur",
      "telephone": "0612345678",
      "isActive": true,
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  ]
}
```

---

### GET /user/chauffeurs/available
Chauffeurs disponibles (non assignés à un trajet actif). **[Admin Only]**

**Réponse 200:**
```json
{
  "chauffeurs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nom": "Jean Dupont",
      "email": "jean@example.com",
      "telephone": "0612345678",
      "isActive": true
    }
  ]
}
```

---

### PATCH /user/chauffeurs/:id/toggle
Activer/Désactiver un chauffeur. **[Admin Only]**

**Réponse 200:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Jean Dupont",
    "isActive": true
  },
  "message": "Chauffeur activé"
}
```

---

## 🚛 Camions

### GET /camion
Liste de tous les camions.

**Réponse 200:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "immatriculation": "AB-123-CD",
    "marque": "Renault",
    "modele": "T480",
    "annee": 2020,
    "kilometrage": 150000,
    "statut": "disponible",
    "createdAt": "2025-12-01T10:00:00.000Z"
  }
]
```

---

### GET /camion/available
Camions disponibles (non en trajet actif et pas en maintenance). **[Admin Only]**

**Réponse 200:** Même format que GET /camion

---

### GET /camion/:id
Détail d'un camion.

**Réponse 200:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "immatriculation": "AB-123-CD",
  "marque": "Renault",
  "modele": "T480",
  "annee": 2020,
  "kilometrage": 150000,
  "statut": "disponible"
}
```

**Erreurs:**
- `404` - Camion non trouvé

---

### POST /camion
Créer un nouveau camion. **[Admin Only]**

**Body:**
```json
{
  "immatriculation": "AB-123-CD",
  "marque": "Renault",
  "modele": "T480",
  "annee": 2020,
  "kilometrage": 0,
  "statut": "disponible"
}
```

**Réponse 201:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "immatriculation": "AB-123-CD",
  "marque": "Renault",
  "modele": "T480",
  "annee": 2020,
  "kilometrage": 0,
  "statut": "disponible",
  "createdAt": "2025-12-13T10:00:00.000Z"
}
```

**Erreurs:**
- `400` - Immatriculation déjà existante
- `400` - Validation échouée

---

### PUT /camion/:id
Modifier un camion. **[Admin Only]**

**Body:** (champs à modifier)
```json
{
  "kilometrage": 160000,
  "statut": "maintenance"
}
```

**Réponse 200:** Camion mis à jour

---

### DELETE /camion/:id
Supprimer un camion. **[Admin Only]**

**Réponse 200:**
```json
{
  "message": "Camion supprimé"
}
```

---

## 🚚 Remorques

### GET /remorque
Liste de toutes les remorques.

**Réponse 200:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "immatriculation": "RQ-456-EF",
    "type": "Frigorifique",
    "capacite": 25000,
    "statut": "disponible"
  }
]
```

---

### GET /remorque/available
Remorques disponibles. **[Admin Only]**

---

### POST /remorque
Créer une remorque. **[Admin Only]**

**Body:**
```json
{
  "immatriculation": "RQ-456-EF",
  "type": "Frigorifique",
  "capacite": 25000,
  "statut": "disponible"
}
```

---

### PUT /remorque/:id
Modifier une remorque. **[Admin Only]**

---

### DELETE /remorque/:id
Supprimer une remorque. **[Admin Only]**

---

## 🛞 Pneus

### GET /pneu
Liste de tous les pneus.

**Réponse 200:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "vehiculeId": "507f1f77bcf86cd799439022",
    "vehiculeType": "camion",
    "position": "AV-G",
    "marque": "Michelin",
    "kmInstallation": 50000,
    "kmLimite": 100000,
    "statut": "bon"
  }
]
```

---

### GET /pneu/vehicule/:vehiculeType/:vehiculeId
Pneus d'un véhicule spécifique.

**Exemple:** `GET /pneu/vehicule/camion/507f1f77bcf86cd799439022`

**Réponse 200:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "vehiculeId": "507f1f77bcf86cd799439022",
    "vehiculeType": "camion",
    "position": "AV-G",
    "marque": "Michelin",
    "statut": "bon"
  },
  {
    "position": "AV-D",
    "marque": "Michelin",
    "statut": "bon"
  }
]
```

---

### POST /pneu
Créer un pneu. **[Admin Only]**

**Body:**
```json
{
  "vehiculeId": "507f1f77bcf86cd799439022",
  "vehiculeType": "camion",
  "position": "AV-G",
  "marque": "Michelin",
  "kmInstallation": 50000,
  "kmLimite": 100000,
  "statut": "bon"
}
```

**Positions valides:**
- **Camion:** `AV-G`, `AV-D`, `AR1-G`, `AR1-D`, `AR2-G`, `AR2-D`
- **Remorque 2 essieux:** `E1-G1`, `E1-G2`, `E1-D1`, `E1-D2`, `E2-G1`, `E2-G2`, `E2-D1`, `E2-D2`
- **Remorque 3 essieux:** + `E3-G1`, `E3-G2`, `E3-D1`, `E3-D2`

**Erreurs:**
- `400` - Position déjà occupée sur ce véhicule

---

### PUT /pneu/:id
Modifier un pneu. **[Admin Only]**

**Body:**
```json
{
  "statut": "use",
  "kmLimite": 120000
}
```

---

### DELETE /pneu/:id
Supprimer un pneu. **[Admin Only]**

---

## 🛣️ Trajets

### GET /trajet
Liste de tous les trajets. **[Admin Only]**

**Réponse 200:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "chauffeurId": {
      "_id": "507f1f77bcf86cd799439022",
      "nom": "Jean Dupont"
    },
    "camionId": {
      "_id": "507f1f77bcf86cd799439033",
      "immatriculation": "AB-123-CD"
    },
    "remorqueId": {
      "_id": "507f1f77bcf86cd799439044",
      "immatriculation": "RQ-456-EF"
    },
    "depart": "Paris",
    "arrivee": "Lyon",
    "dateDepart": "2025-12-15T08:00:00.000Z",
    "dateArrivee": null,
    "kilometrage": 450,
    "gasoil": 120,
    "statut": "a_faire",
    "remarques": ""
  }
]
```

---

### GET /trajet/mes-trajets
Trajets du chauffeur connecté. **[Chauffeur]**

---

### POST /trajet
Créer un trajet. **[Admin Only]**

**Body:**
```json
{
  "chauffeurId": "507f1f77bcf86cd799439022",
  "camionId": "507f1f77bcf86cd799439033",
  "remorqueId": "507f1f77bcf86cd799439044",
  "depart": "Paris",
  "arrivee": "Lyon",
  "dateDepart": "2025-12-15T08:00:00.000Z",
  "kilometrage": 450,
  "statut": "a_faire"
}
```

**Statuts:**
- `a_faire` - Trajet planifié
- `en_cours` - Trajet en cours
- `termine` - Trajet terminé

---

### PUT /trajet/:id
Modifier un trajet.

**Cas d'utilisation:**
1. **Démarrer un trajet:** `{ "statut": "en_cours" }`
2. **Terminer un trajet:** `{ "statut": "termine", "dateArrivee": "2025-12-15T14:00:00.000Z" }`

---

### DELETE /trajet/:id
Supprimer un trajet. **[Admin Only]**

---

## 🔧 Maintenance

### GET /maintenance
Liste des maintenances.

**Réponse 200:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "camionId": {
      "_id": "507f1f77bcf86cd799439022",
      "immatriculation": "AB-123-CD"
    },
    "type": "vidange",
    "description": "Vidange moteur + filtres",
    "datePrevue": "2025-12-20T09:00:00.000Z",
    "dateRealisee": null,
    "cout": null,
    "statut": "planifiee"
  }
]
```

---

### POST /maintenance
Créer une maintenance. **[Admin Only]**

**Body:**
```json
{
  "camionId": "507f1f77bcf86cd799439022",
  "type": "vidange",
  "description": "Vidange moteur + filtres",
  "datePrevue": "2025-12-20T09:00:00.000Z",
  "statut": "planifiee"
}
```

**Types:**
- `vidange`
- `pneus`
- `revision`
- `reparation`

---

### PUT /maintenance/:id
Modifier/Terminer une maintenance. **[Admin Only]**

**Body:**
```json
{
  "dateRealisee": "2025-12-20T11:00:00.000Z",
  "cout": 350,
  "statut": "terminee"
}
```

---

### DELETE /maintenance/:id
Supprimer une maintenance. **[Admin Only]**

---

## 🔒 Codes d'Erreur

| Code | Signification | Exemple |
|------|---------------|---------|
| 200 | Succès | Requête OK |
| 201 | Créé | Ressource créée |
| 400 | Bad Request | Validation échouée |
| 401 | Unauthorized | Token manquant/invalide |
| 403 | Forbidden | Rôle insuffisant |
| 404 | Not Found | Ressource inexistante |
| 500 | Server Error | Erreur interne |

---

## 📋 Exemples cURL

### Login
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trackgo.com","password":"admin123"}'
```

### Créer un camion
```bash
curl -X POST http://localhost:5000/api/camion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "immatriculation": "AB-123-CD",
    "marque": "Renault",
    "modele": "T480",
    "annee": 2020
  }'
```

### Obtenir les camions disponibles
```bash
curl -X GET http://localhost:5000/api/camion/available \
  -H "Authorization: Bearer <token>"
```
