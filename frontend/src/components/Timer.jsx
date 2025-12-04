// Timer.jsx - Place this in your components folder

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Timer = ({ habitId, onComplete }) => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  // Fetch timer status on mount
  useEffect(() => {
    fetchTimerStatus();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [habitId]);

  // Update timer every second when running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const fetchTimerStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/timer/status/${habitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { isRunning: running, elapsedTime } = res.data.data;
      setIsRunning(running);
      setIsPaused(!running && elapsedTime > 0);
      setTime(elapsedTime * 60); // Convert minutes to seconds
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage);
      console.error('Error fetching timer status:', error);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/timer/start`,
        { habitId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setIsRunning(true);
      setIsPaused(false);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage);
      console.error('Error starting timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/timer/pause`,
        { habitId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setIsRunning(false);
      setIsPaused(true);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage);
      console.error('Error pausing timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/timer/stop`,
        { habitId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setIsRunning(false);
      setIsPaused(false);
      setTime(0);

      // Call the onComplete callback to update the parent component
      if (onComplete) {
        onComplete(res.data.data);
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage);
      console.error('Error stopping timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      {/* Timer Display */}
      <div className="relative">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
          <div className="w-56 h-56 rounded-full bg-white flex items-center justify-center">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-2 text-blue-600" />
              <p className="text-5xl font-bold text-gray-800 font-mono">
                {formatTime(time)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {isRunning ? 'Running...' : isPaused ? 'Paused' : 'Ready'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Play className="w-6 h-6" />
            {isPaused ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Pause className="w-6 h-6" />
            Pause
          </button>
        )}

        <button
          onClick={handleStop}
          disabled={loading || time === 0}
          className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Square className="w-6 h-6" />
          Complete
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-600 max-w-md">
        <p className="text-sm">
          Click <strong>Start</strong> to begin your exercise session. You can{' '}
          <strong>Pause</strong> anytime and <strong>Complete</strong> when
          you're done!
        </p>
      </div>
    </div>
  );
};

export default Timer;