import googleTTS from './googleTTS';

// Gestionnaire global - Utilise Google TTS (FONCTIONNE TOUJOURS)
class VoiceManager {
  speak(text, options = {}) {
    console.log('🔊 VoiceManager → Google TTS');
    return googleTTS.speak(text);
  }

  cancel() {
    googleTTS.cancel();
  }
}

const voiceManager = new VoiceManager();
export default voiceManager;
