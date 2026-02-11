// ==================== IMPORTS ====================
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const { generateAIContentWithOpenAI } = require("./ai-openai-integration");
require("dotenv").config();

// ==================== APP INIT ====================
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== DATABASE ====================
mongoose
  .connect(process.env.URL_MONGO)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==================== MODELS ====================
const Document = require("./models/Document");

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// ==================== MULTER CONFIG ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ==================== BASIC ROUTE ====================
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ==================== DOCUMENT ROUTES ====================

// Get all documents
app.get("/api/documents", async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = {};

    if (type && type !== "tous") query.type = type;
    if (search) query.name = { $regex: search, $options: "i" };

    const documents = await Document.find(query).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get document by ID
app.get("/api/documents/:id", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document non trouvé" });
  res.json(doc);
});

// Upload document
app.post("/api/documents/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier fourni" });

  const newDocument = new Document({
    name: req.file.originalname,
    filename: req.file.filename,
    type: req.body.type || "rapports",
    size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
    uploadDate: new Date().toISOString().split("T")[0],
    uploadedBy: req.body.uploadedBy || "Utilisateur",
    path: req.file.path,
  });

  await newDocument.save();
  res.status(201).json(newDocument);
});

// Download document
app.get("/api/documents/:id/download", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document non trouvé" });
  res.download(doc.path, doc.name);
});

// Delete document
app.delete("/api/documents/:id", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document non trouvé" });

  if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);
  await Document.findByIdAndDelete(req.params.id);

  res.json({ message: "Document supprimé avec succès" });
});

// ==================== AI PDF GENERATION ====================

// Generate AI content
app.post("/api/ai/generate-content", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Sujet requis" });

    console.log('🎯 Génération de contenu pour:', topic);
    const generatedContent = await generateAIContentWithOpenAI(topic);
    
    res.json(generatedContent);
  } catch (error) {
    console.error('❌ Erreur génération contenu:', error);
    res.status(500).json({ error: "Erreur lors de la génération du contenu" });
  }
});

// Generate PDF from content
app.post("/api/ai/generate-pdf", async (req, res) => {
  const { title, content, uploadedBy } = req.body;
  if (!content) return res.status(400).json({ error: "Contenu requis" });

  const doc = new PDFDocument();
  const filename = `AI-${Date.now()}-${title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
  const filepath = path.join("uploads", filename);

  const writeStream = fs.createWriteStream(filepath);
  doc.pipe(writeStream);

  doc.fontSize(24).text(title || "Document IA", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(content, { align: "justify" });
  doc.end();

  writeStream.on("finish", async () => {
    const stats = fs.statSync(filepath);
    const newDocument = new Document({
      name: `${title}.pdf`,
      filename,
      type: "documents_administratifs",
      size: `${(stats.size / 1024).toFixed(2)} KB`,
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy: uploadedBy || "Assistant IA",
      path: filepath,
    });

    await newDocument.save();
    res.json({ message: "PDF créé", id: newDocument._id });
  });
});

// ==================== EVENT ROUTES ====================
app.use("/calendar", require("./routes/event"));

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
