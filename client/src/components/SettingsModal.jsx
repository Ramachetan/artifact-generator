import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_MODEL = "gemini-1.5-flash-002";

const SettingsModal = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(() => ({
    ...settings,
    model_name: settings.model_name || DEFAULT_MODEL
  }));
  const [prompt, setPrompt] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!settings.model_name) {
      onSettingsChange('model_name', DEFAULT_MODEL);
    }
    fetchPrompt();
  }, []);

  const fetchPrompt = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-prompt');
      const data = await response.json();
      setPrompt(data.prompt);
    } catch (error) {
      console.error('Error fetching prompt:', error);
    }
  };

  const handleLocalChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onSettingsChange(key, value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/edit-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: prompt }),
      });
      
      if (response.ok) {
        setFeedbackMessage('Settings and prompt saved successfully!');
      } else {
        throw new Error('Failed to save prompt');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      setFeedbackMessage('Error saving prompt. Please try again.');
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setOpen(false);
    }, 1500);
  };

  useEffect(() => {
    if (!open) {
      setShowFeedback(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="text-[#003478] hover:text-blue-600 transition-colors duration-200" size={22} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#003478]">Chat Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="model" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="model">Model Settings</TabsTrigger>
            <TabsTrigger value="prompt">System Prompt</TabsTrigger>
          </TabsList>
          <TabsContent value="model">
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="model_name" className="text-sm font-medium text-gray-700">Model Name</Label>
                <Select
                  value={localSettings.model_name}
                  onValueChange={(value) => handleLocalChange('model_name', value)}
                  defaultValue={DEFAULT_MODEL}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash-002">gemini-1.5-flash-002</SelectItem>
                    <SelectItem value="gemini-1.5-flash-001">gemini-1.5-flash-001</SelectItem>
                    <SelectItem value="gemini-1.5-pro-002">gemini-1.5-pro-002</SelectItem>
                    <SelectItem value="gemini-1.5-pro-001">gemini-1.5-pro-001</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_tokens" className="text-sm font-medium text-gray-700">Max Tokens: {localSettings.max_output_tokens}</Label>
                <Slider
                  id="max_tokens"
                  min={100}
                  max={8192}
                  step={100}
                  value={[localSettings.max_output_tokens]}
                  onValueChange={(value) => handleLocalChange('max_output_tokens', value[0])}
                  className="slider-custom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">Temperature: {localSettings.temperature.toFixed(1)}</Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[localSettings.temperature]}
                  onValueChange={(value) => handleLocalChange('temperature', value[0])}
                  className="slider-custom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="top_p" className="text-sm font-medium text-gray-700">Top P: {localSettings.top_p.toFixed(2)}</Label>
                <Slider
                  id="top_p"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[localSettings.top_p]}
                  onValueChange={(value) => handleLocalChange('top_p', value[0])}
                  className="slider-custom"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="prompt">
            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-sm font-medium text-gray-700">System Prompt</Label>
              <Textarea
                id="system-prompt"
                placeholder="Enter the system prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-[300px] resize-none"
              />
            </div>
          </TabsContent>
        </Tabs>
        {showFeedback && (
          <Alert className="mt-4 bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <AlertDescription>{feedbackMessage}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button onClick={handleSave} className="bg-[#003478] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;