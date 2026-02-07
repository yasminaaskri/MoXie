const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
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

// Extraire le texte d'un document pour la synthèse vocale
app.get('/api/documents/:id/text', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    // Vérifier que le fichier existe
    if (!fs.existsSync(doc.path)) {
      return res.status(404).json({ error: 'Fichier physique non trouvé' });
    }

    const fileExtension = path.extname(doc.name).toLowerCase();

    // Extraire le texte selon le type de fichier
    if (fileExtension === '.pdf') {
      try {
        const dataBuffer = fs.readFileSync(doc.path);
        const pdfData = await pdfParse(dataBuffer);
        
        res.json({ 
          text: pdfData.text,
          pages: pdfData.numpages,
          info: pdfData.info
        });
      } catch (pdfError) {
        console.error('Erreur extraction PDF:', pdfError);
        res.status(500).json({ 
          error: 'Erreur lors de l\'extraction du texte du PDF',
          fallback: `Document PDF: ${doc.name}. Ce document contient ${doc.size} de données. L'extraction automatique du texte n'est pas disponible pour ce fichier.`
        });
      }
    } else if (['.txt', '.md'].includes(fileExtension)) {
      // Fichiers texte simples
      const text = fs.readFileSync(doc.path, 'utf-8');
      res.json({ text });
    } else {
      // Pour les autres types (Word, Excel, etc.)
      res.json({ 
        text: `Document ${doc.name}. Type: ${doc.type}. Taille: ${doc.size}. Déposé le ${doc.uploadDate} par ${doc.uploadedBy}. L'extraction automatique du texte n'est pas encore disponible pour ce type de fichier. Veuillez ouvrir le document pour consulter son contenu.`
      });
    }
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});

// ==================== AI PDF GENERATION ENDPOINT ====================
const PDFDocument = require('pdfkit');

app.post('/api/ai/generate-pdf', async (req, res) => {
  try {
    const { title, content, uploadedBy } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Le contenu est requis' });
    }

    // Create PDF
    const doc = new PDFDocument();
    const filename = `AI-${Date.now()}-${title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    const filepath = path.join('uploads', filename);

    // Pipe PDF to file
    const writeStream = fs.createWriteStream(filepath);
    doc.pipe(writeStream);

    // Add content to PDF
    doc.fontSize(24).text(title || 'Document sans titre', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(content, { align: 'justify' });
    doc.end();

    // Wait for PDF to be written
    writeStream.on('finish', async () => {
      // Get file stats
      const stats = fs.statSync(filepath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);

      // Save to database
      const newDocument = new Document({
        name: `${title}.pdf`,
        filename: filename,
        type: 'documents_administratifs',
        size: `${fileSizeInKB} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: uploadedBy || 'Assistant IA',
        path: filepath
      });

      await newDocument.save();

      res.json({
        message: 'PDF créé avec succès',
        name: newDocument.name,
        _id: newDocument._id
      });
    });

    writeStream.on('error', (error) => {
      console.error('Erreur lors de l\'écriture du PDF:', error);
      res.status(500).json({ error: 'Erreur lors de la création du PDF' });
    });

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la génération du PDF' });
  }
});

// ==================== AI CONTENT GENERATION ENDPOINT ====================
app.post('/api/ai/generate-content', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Le sujet est requis' });
    }

    // Simulate AI content generation (you can replace this with OpenAI API)
    const generatedContent = generateAIContent(topic);

    res.json({
      title: generatedContent.title,
      content: generatedContent.content
    });

  } catch (error) {
    console.error('Erreur lors de la génération du contenu:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la génération du contenu' });
  }
});

// AI Content Generator Function (Simulated - Replace with OpenAI API)
function generateAIContent(topic) {
  // Extract key information from topic
  const topicLower = topic.toLowerCase();
  
  // Generate title
  let title = topic.charAt(0).toUpperCase() + topic.slice(1);
  if (!title.includes('rapport') && !title.includes('document') && !title.includes('guide')) {
    title = `Document sur ${title}`;
  }

  // Generate comprehensive content based on topic
  let content = '';

  // Introduction
  content += `INTRODUCTION\n\n`;
  content += `Ce document présente une analyse détaillée concernant ${topic}. `;
  content += `L'objectif est de fournir une vue d'ensemble complète et des recommandations pratiques.\n\n`;

  // Main content based on keywords
  if (topicLower.includes('rapport') || topicLower.includes('vente') || topicLower.includes('résultat')) {
    content += `ANALYSE DES RÉSULTATS\n\n`;
    content += `Les données recueillies montrent une évolution significative dans le domaine concerné. `;
    content += `Plusieurs facteurs clés ont été identifiés comme ayant un impact majeur sur les performances.\n\n`;
    
    content += `POINTS CLÉS\n\n`;
    content += `1. Amélioration continue des processus\n`;
    content += `2. Optimisation des ressources disponibles\n`;
    content += `3. Renforcement de la collaboration entre équipes\n`;
    content += `4. Mise en place de nouvelles stratégies efficaces\n\n`;
  } 
  else if (topicLower.includes('lettre') || topicLower.includes('motivation') || topicLower.includes('candidature')) {
    content += `Madame, Monsieur,\n\n`;
    content += `Je me permets de vous adresser ma candidature pour le poste mentionné. `;
    content += `Fort d'une expérience significative dans le domaine, je suis convaincu de pouvoir apporter `;
    content += `une contribution positive à votre organisation.\n\n`;
    
    content += `Mes compétences incluent :\n`;
    content += `- Excellente capacité d'adaptation et d'apprentissage\n`;
    content += `- Esprit d'équipe et sens de la communication\n`;
    content += `- Rigueur et organisation dans le travail\n`;
    content += `- Motivation et engagement professionnel\n\n`;
    
    content += `Je reste à votre disposition pour un entretien afin de discuter plus en détail de ma candidature.\n\n`;
    content += `Cordialement,`;
  }
  else if (topicLower.includes('guide') || topicLower.includes('manuel') || topicLower.includes('tutoriel')) {
    content += `OBJECTIF DU GUIDE\n\n`;
    content += `Ce guide a pour but de fournir des instructions claires et pratiques concernant ${topic}. `;
    content += `Il s'adresse à tous les utilisateurs souhaitant approfondir leurs connaissances.\n\n`;
    
    content += `ÉTAPES PRINCIPALES\n\n`;
    content += `1. Préparation et planification\n`;
    content += `   - Identifier les besoins spécifiques\n`;
    content += `   - Rassembler les ressources nécessaires\n\n`;
    
    content += `2. Mise en œuvre\n`;
    content += `   - Suivre les procédures établies\n`;
    content += `   - Documenter chaque étape\n\n`;
    
    content += `3. Évaluation et amélioration\n`;
    content += `   - Mesurer les résultats obtenus\n`;
    content += `   - Identifier les axes d'amélioration\n\n`;
  }
  else {
    // Generic content
    content += `CONTEXTE\n\n`;
    content += `Dans le cadre de ${topic}, il est essentiel de comprendre les enjeux et les opportunités qui se présentent. `;
    content += `Cette analyse vise à fournir une perspective claire et actionnable.\n\n`;
    
    content += `DÉVELOPPEMENT\n\n`;
    content += `Les aspects suivants méritent une attention particulière :\n\n`;
    content += `• Analyse approfondie de la situation actuelle\n`;
    content += `• Identification des défis et opportunités\n`;
    content += `• Proposition de solutions adaptées\n`;
    content += `• Plan d'action concret et réalisable\n\n`;
    
    content += `RECOMMANDATIONS\n\n`;
    content += `Pour optimiser les résultats, il est recommandé de :\n`;
    content += `- Maintenir une communication claire et régulière\n`;
    content += `- Suivre les indicateurs de performance\n`;
    content += `- Adapter les stratégies selon les besoins\n`;
    content += `- Favoriser l'innovation et l'amélioration continue\n\n`;
  }

  // Conclusion
  content += `CONCLUSION\n\n`;
  content += `En conclusion, ${topic} représente un domaine important nécessitant une attention particulière. `;
  content += `Les recommandations présentées dans ce document visent à faciliter la prise de décision `;
  content += `et à optimiser les résultats. Une mise en œuvre rigoureuse de ces suggestions permettra `;
  content += `d'atteindre les objectifs fixés de manière efficace et durable.\n\n`;
  
  content += `Document généré automatiquement par l'Assistant IA TILI\n`;
  content += `Date : ${new Date().toLocaleDateString('fr-FR')}`;

  return {
    title: title,
    content: content
  };
}
