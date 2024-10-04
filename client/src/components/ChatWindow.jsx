import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowUp, User, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SuggestedQuestions from './SuggestedQuestions';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Questions from "./Questions"

const ChatWindow = ({ messages, onSendMessage, onImageSelect, selectedImage }) => {
  const [input, setInput] = useState('');
  const [isInputCentered, setIsInputCentered] = useState(true);
  const messageSendRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messageSendRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setIsInputCentered(false);
      onSendMessage(input);
      setInput('');
      setTimeout(() => setIsInputCentered(true), 500);
      if (selectedImage) onImageSelect(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestionClick = (question) => {
    setInput(question);
  };

  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-6 space-y-8">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="max-w-[80%]">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.type === 'user' ? '/user-avatar.png' : '/Sparkles-avatar.png'} />
                    <AvatarFallback>{msg.type === 'user' ? <User size={16} /> : <Sparkles size={16} />}</AvatarFallback>
                  </Avatar>
                  <span className={`font-medium text-sm ${msg.type === 'user' ? 'text-blue-600' : 'text-purple-600'}`}>
                    {msg.type === 'user' ? 'You' : 'Gemini'}
                  </span>
                </div>
                <CardContent className={`p-4 rounded-lg ${msg.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {msg.image && (
                    <img src={URL.createObjectURL(msg.image)} alt="User uploaded" className="mb-3 rounded-md max-w-full h-auto" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  )}
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="mt-3 mb-3 rounded-md text-sm"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={`bg-gray-200 px-1 py-0.5 rounded text-sm ${className}`} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </CardContent>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <SuggestedQuestions
            questions={Questions}
            onQuestionClick={handleSuggestedQuestionClick}
          />
        )}
        <div ref={messageSendRef} />
      </ScrollArea>
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
          <div className="flex items-center bg-white rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow min-h-[44px] max-h-[120px] resize-none bg-transparent border-none focus:ring-0 py-2 px-3"
            />
            <label htmlFor="image-upload" className="cursor-pointer p-2">
              <ImageIcon className="text-gray-400 hover:text-blue-500 transition-colors duration-200" size={20} />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageSelect}
              />
            </label>
            <Button type="submit" size="sm" className="m-2 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200">
              <ArrowUp size={18} strokeWidth={4} />
            </Button>
          </div>
          {selectedImage && (
            <span className="text-xs text-gray-500 mt-1">{selectedImage.name}</span>
          )}
        </form>
      </div>
    </Card>
  );
};

export default ChatWindow;