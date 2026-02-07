// ==================== OPENAI INTEGRATION (OPTIONAL) ====================
// Uncomment and use this if you have an OpenAI API key

/*
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAIContentWithOpenAI(topic) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant professionnel qui génère des documents en français. Crée un contenu structuré, professionnel et détaillé."
        },
        {
          role: "user",
          content: `Génère un document professionnel complet sur le sujet suivant : "${topic}". 
          Le document doit inclure :
          - Une introduction claire
          - Un développement structuré avec plusieurs sections
          - Des points clés et recommandations
          - Une conclusion
          
          Format le texte de manière professionnelle avec des titres de sections en MAJUSCULES.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const generatedText = completion.choices[0].message.content;
    
    // Extract title (first line or generate from topic)
    const lines = generatedText.split('\n');
    let title = lines[0].replace(/^#+\s*/, '').trim();
    if (title.length > 100 || !title) {
      title = `Document sur ${topic}`;
    }

    return {
      title: title,
      content: generatedText
    };

  } catch (error) {
    console.error('Erreur OpenAI:', error);
    throw error;
  }
}

module.exports = { generateAIContentWithOpenAI };
*/

// To use OpenAI:
// 1. Install: npm install openai
// 2. Add OPENAI_API_KEY to your .env file
// 3. Uncomment the code above
// 4. In server.js, replace the generateAIContent call with:
//    const { generateAIContentWithOpenAI } = require('./ai-openai-integration');
//    const generatedContent = await generateAIContentWithOpenAI(topic);
