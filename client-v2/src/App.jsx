import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatMessage = ({ message, isAi }) => (
  <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
    <div className={`max-w-[70%] p-3 rounded-lg ${isAi ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  </div>
);

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isAi: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `content=${encodeURIComponent(input)}`
      });

      const reader = response.body.getReader();
      let aiMessageText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        aiMessageText += chunk;
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: aiMessageText, isAi: true }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">AI Chatbot</h1>
      <ScrollArea className="flex-grow mb-4 p-4 bg-gray-50 rounded-lg" ref={scrollAreaRef}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isAi={msg.isAi} />
        ))}
        {isStreaming && <div className="text-gray-500 italic">AI is typing...</div>}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message here..."
          className="flex-grow"
        />
        <Button onClick={sendMessage} disabled={isStreaming}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotUI;