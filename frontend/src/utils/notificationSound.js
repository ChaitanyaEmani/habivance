// utils/notificationSound.js

class NotificationSound {
  constructor() {
    // Use a faster-loading, smaller sound file
    this.soundUrl = '/sounds/notify.mp3';
    // Alternative faster sounds:
    // 'https://cdn.freesound.org/previews/397/397353_7193358-lq.mp3' // Quick ping
    // '/sounds/notify.mp3' // Bell ding
    
    this.audio = null;
    this.enabled = true;
    this.volume = 0.7; // 70% volume for better audibility
    
    // Preload audio for instant playback
    this.preloadAudio();
    
    // Load sound preference from localStorage
    this.loadPreferences();
  }

  preloadAudio() {
    try {
      this.audio = new Audio(this.soundUrl);
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';
      this.audio.load();
      console.log('🔊 Notification sound preloaded');
    } catch (error) {
      console.error('Failed to preload notification sound:', error);
    }
  }

  loadPreferences() {
    const savedEnabled = localStorage.getItem('notificationSoundEnabled');
    const savedVolume = localStorage.getItem('notificationSoundVolume');
    
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }
    
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
      if (this.audio) {
        this.audio.volume = this.volume;
      }
    }
  }

  savePreferences() {
    localStorage.setItem('notificationSoundEnabled', this.enabled);
    localStorage.setItem('notificationSoundVolume', this.volume);
  }

  async play() {
    if (!this.enabled) {
      console.log('🔇 Notification sound is disabled');
      return;
    }

    try {
      // Use preloaded audio for instant playback
      if (this.audio) {
        this.audio.currentTime = 0; // Reset to start
        this.audio.volume = this.volume;
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('🔔 Notification sound played');
        }
      } else {
        // Fallback: create new audio if preload failed
        const newAudio = new Audio(this.soundUrl);
        newAudio.volume = this.volume;
        await newAudio.play();
      }
    } catch (error) {
      // If play fails, try recreating the audio element
      console.error('Error playing notification sound:', error);
      try {
        this.audio = new Audio(this.soundUrl);
        this.audio.volume = this.volume;
        await this.audio.play();
      } catch (retryError) {
        console.error('Retry failed:', retryError);
      }
    }
  }

  setVolume(volume) {
    // Ensure volume is between 0 and 1
    this.volume = Math.max(0, Math.min(1, volume));
    this.savePreferences();
    
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this.savePreferences();
  }

  isEnabled() {
    return this.enabled;
  }

  getVolume() {
    return this.volume;
  }

  // Play different sounds based on priority
  async playByPriority(priority) {
    if (!this.enabled) return;

    const sounds = {
      high: '/sounds/notify.mp3', // Urgent bell
      medium: '/sounds/notify.mp3', // Soft ping
      low: '/sounds/notify.mp3' // Soft ping
    };

    const soundUrl = sounds[priority] || sounds.medium;
    
    try {
      const audio = new Audio(soundUrl);
      audio.volume = this.volume;
      await audio.play();
    } catch (error) {
      console.error('Error playing priority sound:', error);
    }
  }
}

// Export singleton instance
export default new NotificationSound();