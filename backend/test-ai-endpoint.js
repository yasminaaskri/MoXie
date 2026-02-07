// Test script for AI endpoint
const fetch = require('node-fetch');

async function testAIEndpoint() {
  try {
    console.log('🧪 Test de l\'endpoint AI...');
    
    const response = await fetch('http://localhost:5000/api/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        topic: 'Rapport sur les ventes de février' 
      }),
    });

    console.log('📡 Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Succès!');
      console.log('📄 Titre:', data.title);
      console.log('📝 Contenu (premiers 200 caractères):', data.content.substring(0, 200) + '...');
    } else {
      const error = await response.text();
      console.error('❌ Erreur:', error);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('💡 Assurez-vous que le serveur est démarré avec: npm start');
  }
}

testAIEndpoint();
