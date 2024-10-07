import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, Image as ImageIcon} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import SuggestedQuestions from './SuggestedQuestions';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Questions from "./Questions"
import SettingsModal from "./SettingsModal"
import MessageItem from "./MessageItem"

const ChatWindow = ({ messages, onSendMessage, onImageSelect, selectedImage }) => {
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState({
    max_output_tokens: 8192,
    temperature: 0.2,
    top_p: 0.9
  });
  const messageSendRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (chatContainerRef.current && scrollAreaRef.current) {
        const containerHeight = chatContainerRef.current.offsetHeight;
        const inputHeight = textareaRef.current ? textareaRef.current.offsetHeight : 0;
        const scrollAreaHeight = containerHeight - inputHeight - 32; // 32px for padding
        scrollAreaRef.current.style.height = `${scrollAreaHeight}px`;
      }
    });

    if (chatContainerRef.current) {
      resizeObserver.observe(chatContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input, settings);
      setInput('');
      if (selectedImage) onImageSelect(null);
    }
  };

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestionClick = useCallback((question) => {
    setInput(question);
  }, []);

  return (
    <div ref={chatContainerRef} className="flex flex-col h-full bg-white">
      <div ref={scrollAreaRef} className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <MessageItem key={index} msg={msg} index={index} messagesLength={messages.length} />
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <SuggestedQuestions
            questions={Questions}
            onQuestionClick={handleSuggestedQuestionClick}
          />
        )}
        <div ref={messageSendRef} />
      </div>
      <div className="p-2 sm:p-4 bg-white flex items-center justify-between">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
          <div className="flex items-center bg-white rounded-md border border-gray-300">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow min-h-[44px] max-h-[120px] resize-none bg-transparent border-none focus:ring-0 py-2 px-3 text-sm sm:text-base"
            />
            <SettingsModal settings={settings} onSettingsChange={handleSettingsChange} />
            <label htmlFor="image-upload" className="cursor-pointer p-2">
              <ImageIcon className="text-[#003478] hover:text-blue-600 transition-colors duration-200" size={22} />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageSelect}
              />
            </label>
            <Button type="submit" size="sm" className="m-1 sm:m-2 bg-[#003478] text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200">
              <ArrowUp size={16} strokeWidth={4} />
            </Button>
          </div>
          {selectedImage && (
            <span className="text-xs text-gray-500 mt-1">{selectedImage.name}</span>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;