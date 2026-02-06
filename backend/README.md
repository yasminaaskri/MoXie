# Backend - Gestion Documentaire

## Installation

```cmd
cd backend
npm install
```

## Démarrage

### Mode production
```cmd
npm start
```

### Mode développement (avec auto-reload)
```cmd
npm run dev
```

Le serveur démarre sur http://localhost:5000

## API Endpoints

### Documents

- **GET** `/api/documents` - Récupérer tous les documents
  - Query params: `type`, `search`
  
- **GET** `/api/documents/:id` - Récupérer un document par ID

- **POST** `/api/documents/upload` - Upload un document
  - Body: FormData avec `file`, `type`, `uploadedBy`
  
- **GET** `/api/documents/:id/download` - Télécharger un document
  - Query params: `user`
  
- **GET** `/api/documents/:id/history` - Récupérer l'historique d'un document

- **DELETE** `/api/documents/:id` - Supprimer un document

- **GET** `/api/documents/stats` - Statistiques des documents

## Types de documents supportés

- rapports
- comptes_rendus
- documents_administratifs
- projets

## Formats de fichiers acceptés

- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- PowerPoint (.ppt, .pptx)

## Limite de taille

50 MB par fichier
