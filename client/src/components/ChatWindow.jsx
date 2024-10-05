import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowUp, User, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SuggestedQuestions from './SuggestedQuestions';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Questions from "./Questions"

const CodeBlock = ({ language, value }) => (
  <SyntaxHighlighter
    style={vscDarkPlus}
    language={language}
    PreTag="div"
    className="mt-3 mb-3 rounded-md text-sm overflow-x-auto max-w-full"
    customStyle={{
      maxWidth: '100%',
      width: '100%',
      overflowX: 'auto',
    }}
  >
    {value}
  </SyntaxHighlighter>
);

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} {...props} />
        ) : (
          <code className={`bg-gray-200 px-1 py-0.5 rounded text-sm ${className} break-words`} {...props}>
            {children}
          </code>
        );
      },
      p: ({ children }) => <p className="break-words whitespace-pre-wrap">{children}</p>,
      img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full h-auto" />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const MessageItem = ({ msg, index, messagesLength }) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    className="p-2 sm:p-4 bg-white rounded-md shadow-md w-full max-w-full overflow-hidden"
  >
    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
        <AvatarImage src={msg.type === 'user' ? '/user-avatar.png' : '/Sparkles-avatar.png'} />
        <AvatarFallback>{msg.type === 'user' ? <User size={12} /> : <Sparkles size={12} />}</AvatarFallback>
      </Avatar>
      <span className={`font-medium text-sm sm:text-base ${msg.type === 'user' ? 'text-[#003478]' : 'text-purple-600'}`}>
        {msg.type === 'user' ? 'You' : 'AI'}
      </span>
    </div>
    <div className="pl-8 sm:pl-11 text-sm sm:text-base w-full max-w-full overflow-hidden">
      {msg.image && (
        <img 
          src={URL.createObjectURL(msg.image)} 
          alt="User uploaded" 
          className="mb-3 rounded-md max-w-full h-auto" 
          style={{ maxWidth: '100%', maxHeight: '200px' }} 
        />
      )}
      <MarkdownRenderer content={msg.content} />
    </div>
    {index < messagesLength - 1 && <Separator className="my-4 sm:my-6" />}
  </motion.div>
);

const ChatWindow = ({ messages, onSendMessage, onImageSelect, selectedImage }) => {
  const [input, setInput] = useState('');
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
      onSendMessage(input);
      setInput('');
      if (selectedImage) onImageSelect(null);
    }
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