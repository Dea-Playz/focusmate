import { ReactNode, useRef, useEffect } from "react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
  backgroundTheme?: string;
}

export function DraggableModal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  className = "",
  initialPosition = { x: 100, y: 100 },
  backgroundTheme = ""
}: DraggableModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { position, isDragging, handleMouseDown } = useDragAndDrop(initialPosition);
  const isLightTheme = backgroundTheme === 'white-black';
  const textColor = isLightTheme ? 'text-black' : 'text-white';
  const borderColor = isLightTheme ? 'border-black/30' : 'border-white/30';

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.style.left = `${position.x}px`;
      modalRef.current.style.top = `${position.y}px`;
    }
  }, [position, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className={`fixed z-50 glass-effect rounded-xl shadow-2xl min-w-[300px] max-w-[90vw] min-h-[200px] max-h-[80vh] ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div 
        className={`p-4 border-b ${borderColor} cursor-move`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${textColor} flex items-center`}>
            <span className="mr-2">{icon}</span>
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`${textColor}/70 hover:${textColor} transition-colors duration-200 hover:bg-${isLightTheme ? 'black' : 'white'}/20`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
