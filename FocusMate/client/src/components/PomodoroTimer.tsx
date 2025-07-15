import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface PomodoroTimerProps {
  textColor: string;
}

export function PomodoroTimer({ textColor }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Focus Time");
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setStatus("Time's Up!");
            return 0;
          }
          return prev - 1;
        });
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
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = 25 * 60;
    return ((totalTime - timeLeft) / totalTime) * 628; // 628 is the circle circumference
  };

  const handleStart = () => {
    setIsRunning(true);
    setStatus("Focus Time - Running");
  };

  const handlePause = () => {
    setIsRunning(false);
    setStatus("Focus Time - Paused");
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setStatus("Focus Time");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="8" 
            fill="none"
          />
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            stroke="#10B981" 
            strokeWidth="8" 
            fill="none"
            strokeLinecap="round"
            strokeDasharray="628"
            strokeDashoffset={628 - getProgress()}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-4xl font-medium ${textColor}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`text-sm ${textColor}/80 mt-2`}>
              {status}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mt-8">
        {!isRunning ? (
          <Button 
            onClick={handleStart}
            className="neumorphic-btn px-6 py-3 text-white hover:text-green-400 transition-all duration-300"
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
        ) : (
          <Button 
            onClick={handlePause}
            className="neumorphic-btn px-6 py-3 text-white hover:text-yellow-400 transition-all duration-300"
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}
        
        <Button 
          onClick={handleReset}
          className="neumorphic-btn px-6 py-3 text-white hover:text-red-400 transition-all duration-300"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
