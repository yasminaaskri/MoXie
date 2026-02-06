const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');
const Document = require('./models/Document');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuration du stockage avec multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    console.log('Fichier reçu:', file.originalname, 'Type:', file.mimetype);
    
    // Accepter tous les fichiers pour le moment (vous pouvez restreindre plus tard)
    console.log('Fichier accepté');
    return cb(null, true);
    
    /* Pour restreindre plus tard, décommentez ceci:
    const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i;
    const extname = allowedExtensions.test(file.originalname);
    
    if (extname) {
      console.log('Fichier accepté');
      return cb(null, true);
    } else {
      console.log('Fichier rejeté - extension non autorisée');
      return cb(new Error('Type de fichier non autorisé. Formats acceptés: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX'));
    }
    */
  }
});

// Routes

// Récupérer tous les documents
app.get('/api/documents', async (req, res) => {
  try {
    const { type, search } = req.query;
    
    let query = {};
    
    if (type && type !== 'tous') {
      query.type = type;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const documents = await Document.find(query).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un document par ID (pour consultation)
app.get('/api/documents/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    // Ajouter une entrée d'historique pour la consultation
    doc.history.push({
      action: 'Consultation',
      date: new Date().toISOString().split('T')[0],
      user: req.query.user || 'Utilisateur'
    });
    
    await doc.save();
    res.json(doc);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload d'un document
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload reçu:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.log('Aucun fichier dans la requête');
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }
    
    const newDocument = new Document({
      name: req.file.originalname,
      filename: req.file.filename,
      type: req.body.type || 'rapports',
      size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: req.body.uploadedBy || 'Utilisateur',
      path: req.file.path,
      history: [
        {
          action: 'Création',
          date: new Date().toISOString().split('T')[0],
          user: req.body.uploadedBy || 'Utilisateur'
        }
      ]
    });
    
    await newDocument.save();
    console.log('Document ajouté à MongoDB:', newDocument);
    
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: error.message });
  }
});

// Télécharger un document
app.get('/api/documents/:id/download', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    // Ajouter une entrée d'historique pour le téléchargement
    doc.history.push({
      action: 'Téléchargement',
      date: new Date().toISOString().split('T')[0],
      user: req.query.user || 'Utilisateur'
    });
    
    await doc.save();
    res.download(doc.path, doc.name);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer l'historique d'un document
app.get('/api/documents/:id/history', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    res.json(doc.history);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    // Supprimer le fichier physique
    if (fs.existsSync(doc.path)) {
      fs.unlinkSync(doc.path);
    }
    
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Statistiques
app.get('/api/documents/stats', async (req, res) => {
  try {
    const total = await Document.countDocuments();
    const rapports = await Document.countDocuments({ type: 'rapports' });
    const comptes_rendus = await Document.countDocuments({ type: 'comptes_rendus' });
    const documents_administratifs = await Document.countDocuments({ type: 'documents_administratifs' });
    const projets = await Document.countDocuments({ type: 'projets' });
    
    const stats = {
      total,
      byType: {
        rapports,
        comptes_rendus,
        documents_administratifs,
        projets
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
