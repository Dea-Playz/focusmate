import { useState, useRef, useEffect } from "react";
import { DraggableModal } from "./DraggableModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Volume2, Play, Pause, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundTheme?: string;
}

export function AudioModal({ isOpen, onClose, backgroundTheme = "" }: AudioModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [volume, setVolume] = useState([50]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  const playerRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handlePlay = () => {
    if (!youtubeUrl) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      toast({
        title: "Error",
        description: "Invalid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    if (isPaused && currentVideoId === videoId) {
      // Resume current video
      const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&start=0`;
      setEmbedUrl(embed);
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // Start new video
      const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0`;
      setEmbedUrl(embed);
      setCurrentVideoId(videoId);
      setIsPlaying(true);
      setIsPaused(false);
    }
    
    toast({
      title: "Playing",
      description: "YouTube audio started",
    });
  };

  const handlePause = () => {
    setEmbedUrl("");
    setIsPlaying(false);
    setIsPaused(true);
    toast({
      title: "Paused",
      description: "Audio paused",
    });
  };

  const handleStop = () => {
    setEmbedUrl("");
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentVideoId("");
    toast({
      title: "Stopped",
      description: "Audio stopped",
    });
  };

  useEffect(() => {
    if (playerRef.current && embedUrl) {
      // Create virtual audio element for better volume control
      if (audioRef.current) {
        audioRef.current.volume = volume[0] / 100;
      }
    }
  }, [volume, embedUrl]);

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Audio"
      icon={<Volume2 className="h-5 w-5 text-red-400" />}
      initialPosition={{ x: 200, y: 300 }}
      backgroundTheme={backgroundTheme}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">YouTube URL</label>
          <Input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">Volume: {volume[0]}%</label>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-between space-x-2">
          <Button
            onClick={handlePlay}
            disabled={isPlaying}
            className="neumorphic-btn text-white hover:text-green-400"
          >
            <Play className="mr-2 h-4 w-4" />
            Play
          </Button>
          
          <Button
            onClick={handlePause}
            disabled={!isPlaying}
            className="neumorphic-btn text-white hover:text-yellow-400"
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
          
          <Button
            onClick={handleStop}
            disabled={!isPlaying}
            className="neumorphic-btn text-white hover:text-red-400"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </div>
        
        {embedUrl && (
          <div className="mt-4">
            <iframe
              ref={playerRef}
              width="0"
              height="0"
              src={embedUrl}
              title="YouTube audio player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ 
                opacity: 0, 
                position: 'absolute', 
                pointerEvents: 'none',
                left: '-9999px'
              }}
            />
            <audio
              ref={audioRef}
              style={{ display: 'none' }}
              volume={volume[0] / 100}
            />
            <div className="text-white/60 text-sm text-center">
              Audio playing in background - Volume: {volume[0]}%
            </div>
          </div>
        )}
      </div>
    </DraggableModal>
  );
}
