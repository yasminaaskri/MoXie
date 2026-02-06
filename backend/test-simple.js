const fs = require('fs');
const path = require('path');

// Créer un fichier de test
const testFile = path.join(__dirname, 'test-document.txt');
fs.writeFileSync(testFile, 'Ceci est un document de test');

console.log('Fichier de test créé:', testFile);
console.log('Vous pouvez maintenant tester l\'upload avec ce fichier');

// Simuler une requête fetch
const FormData = require('form-data');
const form = new FormData();
form.append('file', fs.createReadStream(testFile), 'test-document.txt');
form.append('type', 'rapports');
form.append('uploadedBy', 'Test User');

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/documents/upload',
  method: 'POST',
  headers: form.getHeaders()
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    // Nettoyer
    fs.unlinkSync(testFile);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
  fs.unlinkSync(testFile);
});

form.pipe(req);
