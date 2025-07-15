import { useState, useEffect } from "react";
import { DraggableModal } from "./DraggableModal";
import { Button } from "@/components/ui/button";
import { Quote, RefreshCw } from "lucide-react";
import { quotes } from "@/lib/quotes";

interface QuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundTheme?: string;
}

export function QuotesModal({ isOpen, onClose, backgroundTheme = "" }: QuotesModalProps) {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    if (isOpen) {
      getRandomQuote();
    }
  }, [isOpen]);

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Inspiration"
      icon={<Quote className="h-5 w-5 text-purple-400" />}
      initialPosition={{ x: window.innerWidth - 400, y: 150 }}
      backgroundTheme={backgroundTheme}
    >
      <div className="text-center space-y-6">
        <blockquote className="text-xl text-white font-medium italic">
          "{currentQuote.text}"
        </blockquote>
        
        <cite className="text-white/70 text-sm">
          — {currentQuote.author}
        </cite>
        
        <Button
          onClick={getRandomQuote}
          className="neumorphic-btn text-white hover:text-purple-400"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>
    </DraggableModal>
  );
}
