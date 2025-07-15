import { DraggableModal } from "./DraggableModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette } from "lucide-react";
import { backgroundThemes } from "@/lib/backgroundThemes";

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onCustomBackgroundChange: (background: string | null) => void;
  backgroundTheme?: string;
}

export function BackgroundModal({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  onCustomBackgroundChange,
  backgroundTheme = ""
}: BackgroundModalProps) {
  const handleThemeSelect = (theme: string) => {
    onThemeChange(theme);
    onCustomBackgroundChange(null);
  };

  const handleCustomBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onCustomBackgroundChange(result);
        onThemeChange('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Background"
      icon={<Palette className="h-5 w-5 text-pink-400" />}
      initialPosition={{ x: window.innerWidth - 350, y: 250 }}
      backgroundTheme={backgroundTheme}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {backgroundThemes.map((theme) => (
            <Button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={`aspect-video p-0 overflow-hidden hover:scale-105 transition-transform duration-200 ${
                currentTheme === theme.id ? 'ring-2 ring-white' : ''
              }`}
              variant="outline"
              style={{
                background: theme.preview,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {theme.label && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className={`font-medium ${theme.textColor}`}>
                    {theme.label}
                  </span>
                </div>
              )}
            </Button>
          ))}
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <label className="block text-white mb-2">Custom Background</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleCustomBackground}
            className="bg-white/10 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30"
          />
        </div>
      </div>
    </DraggableModal>
  );
}
