import { Button } from "@/components/ui/button";
import { StickyNote, Quote, CheckSquare, Clock, Palette, Volume2, Timer, Settings } from "lucide-react";

interface FloatingBarProps {
  onNotesClick: () => void;
  onQuotesClick: () => void;
  onTasksClick: () => void;
  onViewToggle: () => void;
  onBackgroundClick: () => void;
  onAudioClick: () => void;
  onSettingsClick: () => void;
  isTimeView: boolean;
  backgroundTheme: string;
}

export function FloatingBar({
  onNotesClick,
  onQuotesClick,
  onTasksClick,
  onViewToggle,
  onBackgroundClick,
  onAudioClick,
  onSettingsClick,
  isTimeView,
  backgroundTheme
}: FloatingBarProps) {
  const isLightTheme = backgroundTheme === 'white-black';
  const barClass = isLightTheme ? 'floating-bar-light' : 'floating-bar';
  const btnClass = isLightTheme ? 'neumorphic-btn-light' : 'neumorphic-btn';
  const textColor = isLightTheme ? 'text-black/80' : 'text-white/80';
  const separatorColor = isLightTheme ? 'bg-black/30' : 'bg-white/30';
  
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${barClass} rounded-full px-6 py-3 flex items-center space-x-4`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotesClick}
          className={`${btnClass} p-3 ${textColor} hover:text-gray-600 transition-all duration-300`}
        >
          <StickyNote className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onQuotesClick}
          className={`${btnClass} p-3 ${textColor} hover:text-gray-600 transition-all duration-300`}
        >
          <Quote className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onTasksClick}
          className={`${btnClass} p-3 ${textColor} hover:text-gray-600 transition-all duration-300`}
        >
          <CheckSquare className="h-5 w-5" />
        </Button>
        
        <div className={`h-8 w-px ${separatorColor}`} />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onViewToggle}
          className={`${btnClass} p-3 ${textColor} hover:text-gray-600 transition-all duration-300`}
        >
          {isTimeView ? <Clock className="h-5 w-5" /> : <Timer className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackgroundClick}
          className={`${btnClass} p-3 ${textColor} hover:text-gray-600 transition-all duration-300`}
        >
          <Palette className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onAudioClick}
          className={`${btnClass} p-3 ${textColor} hover:text-gray-600 transition-all duration-300`}
        >
          <Volume2 className="h-5 w-5" />
        </Button>
        
        <div className={`h-8 w-px ${separatorColor}`} />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className={`${btnClass} p-3 ${textColor} hover:text-gray-600 transition-all duration-300`}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
