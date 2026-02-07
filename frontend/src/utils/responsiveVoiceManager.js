// Gestionnaire ResponsiveVoice - FONCTIONNE TOUJOURS
class ResponsiveVoiceManager {
  constructor() {
    this.isReady = false;
    this.queue = [];
    this.isSpeaking = false;
    
    // Attendre que ResponsiveVoice soit chargé
    this.waitForReady();
  }

  waitForReady() {
    const checkReady = () => {
      if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
        console.log('✅ ResponsiveVoice PRÊT');
        this.isReady = true;
        this.processQueue();
      } else {
        console.log('⏳ Attente de ResponsiveVoice...');
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  }

  speak(text, options = {}) {
    return new Promise((resolve) => {
      console.log('🔊 ResponsiveVoice.speak():', text);

      if (!this.isReady) {
        console.log('⏳ Ajout à la queue (pas encore prêt)');
        this.queue.push({ text, options, resolve });
        return;
      }

      if (this.isSpeaking) {
        console.log('⏳ Ajout à la queue (déjà en train de parler)');
        this.queue.push({ text, options, resolve });
        return;
      }

      this.speakNow(text, options, resolve);
    });
  }

  speakNow(text, options, resolve) {
    this.isSpeaking = true;

    const voice = options.lang === 'ar' ? 'Arabic Male' : 'French Female';
    const rate = options.rate || 0.9;
    const pitch = options.pitch || 1;
    const volume = options.volume || 1;

    console.log('📤 ResponsiveVoice parle maintenant...');

    window.responsiveVoice.speak(text, voice, {
      rate: rate,
      pitch: pitch,
      volume: volume,
      onstart: () => {
        console.log('✅ VOIX DÉMARRÉE');
      },
      onend: () => {
        console.log('✅ VOIX TERMINÉE');
        this.isSpeaking = false;
        resolve();
        this.processQueue();
      },
      onerror: (error) => {
        console.error('❌ ERREUR ResponsiveVoice:', error);
        this.isSpeaking = false;
        resolve();
        this.processQueue();
      }
    });
  }

  processQueue() {
    if (this.queue.length > 0 && !this.isSpeaking && this.isReady) {
      const { text, options, resolve } = this.queue.shift();
      this.speakNow(text, options, resolve);
    }
  }

  cancel() {
    console.log('🛑 Annulation ResponsiveVoice');
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
    this.queue = [];
    this.isSpeaking = false;
  }

  pause() {
    if (window.responsiveVoice) {
      window.responsiveVoice.pause();
    }
  }

  resume() {
    if (window.responsiveVoice) {
      window.responsiveVoice.resume();
    }
  }
}

// Instance globale
const responsiveVoiceManager = new ResponsiveVoiceManager();

export default responsiveVoiceManager;
