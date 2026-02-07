// Google Translate TTS - FONCTIONNE TOUJOURS, GRATUIT, AUCUNE CLÉ API
class GoogleTTS {
  constructor() {
    this.audioQueue = [];
    this.isPlaying = false;
  }

  speak(text) {
    return new Promise((resolve) => {
      console.log('🔊 Google TTS:', text);
      
      // Créer l'URL Google Translate TTS
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=fr&client=tw-ob&q=${encodeURIComponent(text)}`;
      
      // Créer l'élément audio
      const audio = new Audio(url);
      
      audio.onloadeddata = () => {
        console.log('✅ Audio chargé');
      };
      
      audio.onplay = () => {
        console.log('✅ VOIX DÉMARRÉE (Google TTS)');
        this.isPlaying = true;
      };
      
      audio.onended = () => {
        console.log('✅ VOIX TERMINÉE (Google TTS)');
        this.isPlaying = false;
        resolve();
        this.processQueue();
      };
      
      audio.onerror = (error) => {
        console.error('❌ ERREUR Google TTS:', error);
        this.isPlaying = false;
        resolve();
        this.processQueue();
      };
      
      // Ajouter à la queue
      this.audioQueue.push({ audio, resolve });
      
      // Si pas en train de jouer, commencer
      if (!this.isPlaying) {
        this.processQueue();
      }
    });
  }

  processQueue() {
    if (this.audioQueue.length > 0 && !this.isPlaying) {
      const { audio } = this.audioQueue.shift();
      
      // Jouer l'audio
      audio.play().catch(error => {
        console.error('❌ Erreur play():', error);
        this.isPlaying = false;
        this.processQueue();
      });
    }
  }

  cancel() {
    console.log('🛑 Annulation Google TTS');
    this.audioQueue = [];
    this.isPlaying = false;
  }
}

const googleTTS = new GoogleTTS();
export default googleTTS;
