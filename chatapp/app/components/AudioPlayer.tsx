import { MessageType } from '@/types/message';
import { useState, useRef } from 'react';

const formatTime = (seconds: number): string => {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer = ({ msg, userId }: { msg: MessageType; userId?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

const togglePlay = () => {
  if (!audioRef.current) return;
  if (audioRef.current.paused) {
    audioRef.current.play();
  } else {
    audioRef.current.pause();
  }
};


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
  if (audioRef.current) {
    const dur = audioRef.current.duration;
    setDuration(!isNaN(dur) ? dur : 0);
  }
};


const progress = duration && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full mt-2 max-w-[280px] sm:max-w-[320px]">
      <div className={`flex items-center space-x-2 p-2 sm:p-3 rounded-xl ${
        msg.user_id === userId 
          ? "bg-green-100 dark:bg-green-900" 
          : "bg-gray-100 dark:bg-gray-700"
      }`}>
        
        <button 
          onClick={togglePlay}
          className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5 mb-1">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {formatTime(currentTime)}
            </span>
              <p className=''>-</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={msg.file_url || undefined} 
          className="hidden"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </div>
    </div>
  );
};