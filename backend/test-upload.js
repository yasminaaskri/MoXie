// Script de test pour vérifier l'upload
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testUpload() {
  // Créer un fichier de test
  const testContent = 'Test document content';
  fs.writeFileSync('test.txt', testContent);
  
  const form = new FormData();
  form.append('file', fs.createReadStream('test.txt'));
  form.append('type', 'rapports');
  form.append('uploadedBy', 'Test User');
  
  try {
    const response = await fetch('http://localhost:5000/api/documents/upload', {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Result:', result);
    
    // Nettoyer
    fs.unlinkSync('test.txt');
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpload();
