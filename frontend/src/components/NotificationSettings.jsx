import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import notificationSound from '../utils/notificationSound';

const NotificationSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState(notificationSound.isEnabled());
  const [volume, setVolume] = useState(notificationSound.getVolume() * 100);

  useEffect(() => {
    // Sync state with utility
    setSoundEnabled(notificationSound.isEnabled());
    setVolume(notificationSound.getVolume() * 100);
  }, []);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    notificationSound.setEnabled(newState);
    
    // Play test sound when enabling
    if (newState) {
      notificationSound.play();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    notificationSound.setVolume(newVolume / 100);
  };

  const handleTestSound = () => {
    notificationSound.play();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {soundEnabled ? <Volume2 className="text-blue-600" /> : <VolumeX className="text-gray-400" />}
            Notification Sound
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Play sound when new notifications arrive
          </p>
        </div>
        
        <button
          onClick={handleToggleSound}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
            soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              soundEnabled ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {soundEnabled && (
        <div className="space-y-4 pl-8 border-l-2 border-blue-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume: {Math.round(volume)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <button
            onClick={handleTestSound}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Test Sound
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;