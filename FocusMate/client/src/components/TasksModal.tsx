import { useState } from "react";
import { DraggableModal } from "./DraggableModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundTheme?: string;
}

export function TasksModal({ isOpen, onClose, backgroundTheme = "" }: TasksModalProps) {
  const [newTaskText, setNewTaskText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: isOpen,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest("POST", "/api/tasks", {
        text,
        completed: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setNewTaskText("");
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return await apiRequest("PUT", `/api/tasks/${id}`, {
        completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTaskMutation.mutate(newTaskText.trim());
    }
  };

  const handleToggleTask = (id: number, completed: boolean) => {
    updateTaskMutation.mutate({ id, completed });
  };

  const handleDeleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tasks"
      icon={<CheckSquare className="h-5 w-5 text-green-400" />}
      initialPosition={{ x: window.innerWidth / 2 - 200, y: 100 }}
      backgroundTheme={backgroundTheme}
    >
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50"
            disabled={addTaskMutation.isPending}
          />
          <Button
            onClick={handleAddTask}
            disabled={addTaskMutation.isPending || !newTaskText.trim()}
            className="neumorphic-btn text-white hover:text-green-400"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="text-white/60 text-center py-4">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-white/60 text-center py-4">No tasks yet. Add one above!</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center p-3 bg-white/10 rounded-lg space-x-3"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => 
                    handleToggleTask(task.id, checked as boolean)
                  }
                  className="border-white/40"
                />
                <span
                  className={`flex-1 text-white ${
                    task.completed ? "line-through text-white/60" : ""
                  }`}
                >
                  {task.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </DraggableModal>
  );
}
