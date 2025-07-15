import { useState, useEffect } from "react";
import { DraggableModal } from "./DraggableModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Save, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@shared/schema";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundTheme?: string;
}

export function NotesModal({ isOpen, onClose, backgroundTheme = "" }: NotesModalProps) {
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
    enabled: isOpen,
  });

  const saveNoteMutation = useMutation({
    mutationFn: async (noteContent: string) => {
      if (notes && notes.length > 0) {
        return await apiRequest("PUT", `/api/notes/${notes[0].id}`, {
          content: noteContent,
        });
      } else {
        return await apiRequest("POST", "/api/notes", {
          content: noteContent,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (notes && notes.length > 0) {
      setContent(notes[0].content);
    }
  }, [notes]);

  const handleSave = () => {
    saveNoteMutation.mutate(content);
  };

  const handleClear = () => {
    setContent("");
    saveNoteMutation.mutate("");
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Notes"
      icon={<StickyNote className="h-5 w-5 text-blue-400" />}
      initialPosition={{ x: 100, y: 200 }}
      backgroundTheme={backgroundTheme}
    >
      <div className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full h-64 bg-white/10 border-white/20 text-white placeholder-white/50 resize-none custom-scrollbar"
          disabled={isLoading}
        />
        
        <div className="flex justify-between">
          <Button
            onClick={handleSave}
            disabled={saveNoteMutation.isPending}
            className="neumorphic-btn text-white hover:text-blue-400"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          
          <Button
            onClick={handleClear}
            disabled={saveNoteMutation.isPending}
            className="neumorphic-btn text-white hover:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </DraggableModal>
  );
}
