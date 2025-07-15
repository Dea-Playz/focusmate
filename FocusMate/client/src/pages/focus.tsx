import { useState, useEffect } from "react";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { FloatingBar } from "@/components/FloatingBar";
import { NotesModal } from "@/components/NotesModal";
import { QuotesModal } from "@/components/QuotesModal";
import { TasksModal } from "@/components/TasksModal";
import { BackgroundModal } from "@/components/BackgroundModal";
import { AudioModal } from "@/components/AudioModal";
import { SettingsModal } from "@/components/SettingsModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function FocusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTimeView, setIsTimeView] = useState(true);
  const [backgroundTheme, setBackgroundTheme] = useLocalStorage("backgroundTheme", "background-theme-1");
  const [customBackground, setCustomBackground] = useLocalStorage("customBackground", null);
  
  // Modal states
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBackgroundClass = () => {
    if (customBackground) {
      return '';
    }
    return backgroundTheme;
  };

  const getTextColor = () => {
    if (backgroundTheme === 'white-black') {
      return 'text-black';
    } else if (backgroundTheme === 'black-white') {
      return 'text-white';
    }
    return 'text-white';
  };

  const getTimeColor = () => {
    if (backgroundTheme === 'white-black') {
      return 'text-black';
    } else if (backgroundTheme === 'black-white') {
      return 'text-white';
    }
    return 'text-white drop-shadow-lg';
  };

  return (
    <div 
      className={`min-h-screen overflow-hidden select-none transition-all duration-300 ${getBackgroundClass()}`}
      style={customBackground ? { 
        backgroundImage: `url(${customBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="h-screen flex items-center justify-center relative">
        <div className="text-center">
          {/* Simple Time View */}
          <div className={`transition-all duration-500 ease-in-out ${isTimeView ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'}`}>
            <div className={`text-8xl md:text-9xl time-display ${getTimeColor()}`}>
              {formatTime(currentTime)}
            </div>
            <div className={`text-xl md:text-2xl font-medium ${getTextColor()}/80 mt-4`}>
              {formatDate(currentTime)}
            </div>
          </div>
          
          {/* Pomodoro Timer View */}
          <div className={`transition-all duration-500 ease-in-out ${!isTimeView ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'}`}>
            <PomodoroTimer textColor={getTextColor()} />
          </div>
        </div>
      </div>

      <FloatingBar
        onNotesClick={() => setIsNotesOpen(true)}
        onQuotesClick={() => setIsQuotesOpen(true)}
        onTasksClick={() => setIsTasksOpen(true)}
        onViewToggle={() => setIsTimeView(!isTimeView)}
        onBackgroundClick={() => setIsBackgroundOpen(true)}
        onAudioClick={() => setIsAudioOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        isTimeView={isTimeView}
        backgroundTheme={backgroundTheme}
      />

      <NotesModal 
        isOpen={isNotesOpen} 
        onClose={() => setIsNotesOpen(false)}
        backgroundTheme={backgroundTheme}
      />
      
      <QuotesModal 
        isOpen={isQuotesOpen} 
        onClose={() => setIsQuotesOpen(false)}
        backgroundTheme={backgroundTheme}
      />
      
      <TasksModal 
        isOpen={isTasksOpen} 
        onClose={() => setIsTasksOpen(false)}
        backgroundTheme={backgroundTheme}
      />
      
      <BackgroundModal 
        isOpen={isBackgroundOpen} 
        onClose={() => setIsBackgroundOpen(false)}
        currentTheme={backgroundTheme}
        onThemeChange={setBackgroundTheme}
        onCustomBackgroundChange={setCustomBackground}
        backgroundTheme={backgroundTheme}
      />
      
      <AudioModal 
        isOpen={isAudioOpen} 
        onClose={() => setIsAudioOpen(false)}
        backgroundTheme={backgroundTheme}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        backgroundTheme={backgroundTheme}
      />
    </div>
  );
}
