// ==================== AI CONTENT GENERATION ====================

// Function to generate AI content (with or without OpenAI)
async function generateAIContentWithOpenAI(topic) {
  // Check if OpenAI API key is configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    return await generateWithOpenAI(topic);
  } else {
    // Fallback to local generation
    console.log('⚠️ OpenAI API key not configured, using local generation');
    return generateLocalContent(topic);
  }
}

// OpenAI generation (when API key is available)
async function generateWithOpenAI(topic) {
  const OpenAI = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

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
    const lines = generatedText.split('\n').filter(line => line.trim());
    let title = lines[0].replace(/^#+\s*/, '').trim();
    if (title.length > 100 || !title) {
      title = `Document sur ${topic}`;
    }

    return {
      title: title,
      content: generatedText
    };
  } catch (error) {
    console.error('❌ Erreur OpenAI:', error);
    console.log('⚠️ Fallback to local generation');
    return generateLocalContent(topic);
  }
}

// Local content generation (fallback when no API key)
function generateLocalContent(topic) {
  const title = `Document professionnel : ${topic}`;
  
  const content = `${title.toUpperCase()}

INTRODUCTION

Ce document présente une analyse complète et détaillée concernant ${topic}. L'objectif est de fournir une vue d'ensemble structurée et professionnelle sur ce sujet important.

CONTEXTE ET ENJEUX

${topic} représente un élément clé dans le contexte actuel. Il est essentiel de comprendre les différents aspects et implications de ce sujet pour pouvoir prendre des décisions éclairées.

Les principaux enjeux incluent :
- L'analyse approfondie des différents aspects
- La compréhension des impacts et conséquences
- L'identification des opportunités et défis
- La mise en place de stratégies adaptées

DÉVELOPPEMENT

Analyse détaillée :

1. Aspects fondamentaux
   ${topic} nécessite une approche méthodique et structurée. Il est important de considérer tous les éléments pertinents pour avoir une vision complète.

2. Implications pratiques
   Les applications concrètes de ${topic} touchent plusieurs domaines et nécessitent une attention particulière dans leur mise en œuvre.

3. Perspectives d'évolution
   L'évolution future de ${topic} dépendra de nombreux facteurs qu'il convient d'anticiper et de prendre en compte dès maintenant.

POINTS CLÉS ET RECOMMANDATIONS

Points essentiels à retenir :
• Importance d'une approche structurée et méthodique
• Nécessité d'une analyse approfondie des différents aspects
• Prise en compte des implications à court et long terme
• Adaptation continue aux évolutions du contexte

Recommandations principales :
• Mettre en place un suivi régulier et systématique
• Assurer une communication claire et transparente
• Développer les compétences et ressources nécessaires
• Évaluer régulièrement les résultats et ajuster si besoin

CONCLUSION

En conclusion, ${topic} représente un sujet d'importance majeure qui mérite une attention particulière. Une approche professionnelle, structurée et adaptée permettra d'optimiser les résultats et d'atteindre les objectifs fixés.

Il est recommandé de poursuivre l'analyse et le développement de ce sujet en tenant compte des éléments présentés dans ce document.

---
Document généré automatiquement par l'Assistant IA
Date : ${new Date().toLocaleDateString('fr-FR')}`;

  return {
    title: title,
    content: content
  };
}

module.exports = { generateAIContentWithOpenAI };
