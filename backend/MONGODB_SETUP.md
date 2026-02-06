# Configuration MongoDB

## Installation de MongoDB sur Windows

### Option 1: MongoDB Community Server (Local)

1. **Télécharger MongoDB**
   - Allez sur https://www.mongodb.com/try/download/community
   - Téléchargez la version Windows
   - Installez avec les options par défaut

2. **Démarrer MongoDB**
   ```cmd
   net start MongoDB
   ```

3. **Vérifier que MongoDB fonctionne**
   ```cmd
   mongosh
   ```

### Option 2: MongoDB Atlas (Cloud - Gratuit)

1. **Créer un compte**
   - Allez sur https://www.mongodb.com/cloud/atlas/register
   - Créez un compte gratuit

2. **Créer un cluster**
   - Choisissez le plan gratuit (M0)
   - Sélectionnez une région proche

3. **Configurer l'accès**
   - Créez un utilisateur de base de données
   - Ajoutez votre IP à la whitelist (ou 0.0.0.0/0 pour tout autoriser)

4. **Obtenir la chaîne de connexion**
   - Cliquez sur "Connect"
   - Choisissez "Connect your application"
   - Copiez la chaîne de connexion

5. **Mettre à jour le fichier .env**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tili_documents
   ```

## Démarrage du serveur

```cmd
cd backend
npm install
node server.js
```

## Vérification

Le serveur devrait afficher:
```
MongoDB connecté: localhost (ou votre cluster Atlas)
Serveur backend démarré sur le port 5000
```

## Commandes utiles MongoDB

### Voir toutes les bases de données
```
mongosh
show dbs
```

### Utiliser la base de données
```
use tili_documents
```

### Voir les collections
```
show collections
```

### Voir tous les documents
```
db.documents.find()
```

### Supprimer tous les documents
```
db.documents.deleteMany({})
```
