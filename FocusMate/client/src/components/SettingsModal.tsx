import React, { useState, useEffect } from "react";
import { DraggableModal } from "./DraggableModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UserSettings } from "@shared/schema";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundTheme?: string;
}

export function SettingsModal({ isOpen, onClose, backgroundTheme = "" }: SettingsModalProps) {
  const [pomodoroTime, setPomodoroTime] = useState([25]);
  const [audioVolume, setAudioVolume] = useState([50]);
  const [audioUrl, setAudioUrl] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [autoStart, setAutoStart] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
    enabled: isOpen,
  });

  useEffect(() => {
    if (settings) {
      setPomodoroTime([settings.pomodoroTime || 25]);
      setAudioVolume([settings.audioVolume || 50]);
      setAudioUrl(settings.audioUrl || "");
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      return await apiRequest("PUT", "/api/settings", newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate({
      pomodoroTime: pomodoroTime[0],
      audioVolume: audioVolume[0],
      audioUrl: audioUrl || null,
    });
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      icon={<Settings className="h-5 w-5 text-cyan-400" />}
      initialPosition={{ x: window.innerWidth / 2 - 200, y: 50 }}
      className="w-96"
      backgroundTheme={backgroundTheme}
    >
      <div className="space-y-6">
        {/* Pomodoro Timer Settings */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Pomodoro Duration</Label>
          <div className="space-y-2">
            <Slider
              value={pomodoroTime}
              onValueChange={setPomodoroTime}
              max={60}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="text-white/70 text-sm text-center">
              {pomodoroTime[0]} minutes
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Audio Volume</Label>
          <div className="space-y-2">
            <Slider
              value={audioVolume}
              onValueChange={setAudioVolume}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-white/70 text-sm text-center">
              {audioVolume[0]}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white font-medium">Default Audio URL</Label>
          <Input
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
          />
        </div>

        {/* Notification Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white font-medium">Notifications</Label>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="text-white/60 text-sm">
            Get notified when Pomodoro sessions end
          </div>
        </div>

        {/* Auto-start Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white font-medium">Auto-start breaks</Label>
            <Switch
              checked={autoStart}
              onCheckedChange={setAutoStart}
            />
          </div>
          <div className="text-white/60 text-sm">
            Automatically start break timers
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-white/20">
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="neumorphic-btn w-full text-white hover:text-cyan-400"
          >
            <Save className="mr-2 h-4 w-4" />
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </DraggableModal>
  );
}