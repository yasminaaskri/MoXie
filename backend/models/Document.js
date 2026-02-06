const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['rapports', 'comptes_rendus', 'documents_administratifs', 'projets'],
    required: true
  },
  size: {
    type: String,
    required: true
  },
  uploadDate: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  history: [historySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
