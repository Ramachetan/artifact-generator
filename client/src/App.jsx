import React, { useState, useEffect, useRef } from 'react';
import { Code, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodePreview from './components/CodePreview';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [previewCode, setPreviewCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const streamedResponseRef = useRef('');

  useEffect(() => {
    setShowPreview(!!previewCode);
  }, [previewCode]);

  const callApi = async (userMessage, image) => {
    try {
      const formData = new FormData();
      formData.append('content', userMessage);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setIsStreaming(true);
      streamedResponseRef.current = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamedResponseRef.current += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { type: 'bot', content: streamedResponseRef.current };
          return newMessages;
        });
      }

      setIsStreaming(false);
      return streamedResponseRef.current;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return "Sorry, there was an error processing your request.";
    }
  };

  const resetChat = async () => {
    try {
      await fetch('http://localhost:8000/api/reset-chat', { method: 'POST' });
      setMessages([]);
      setPreviewCode('');
      setShowPreview(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error resetting chat:", error);
    }
  };

  useEffect(() => {
    resetChat();
  }, []);

  const handleSendMessage = async (userMessage) => {
    setMessages(prev => [
      ...prev, 
      { type: 'user', content: userMessage, image: selectedImage }, 
      { type: 'bot', content: '' }
    ]);
   
    const botResponse = await callApi(userMessage, selectedImage);
   
    const jsxCodeMatch = botResponse.match(/```jsx([\s\S]*?)```/);
    if (jsxCodeMatch) {
      setPreviewCode(jsxCodeMatch[1].trim());
    } else {
      setPreviewCode('');
    }

    setSelectedImage(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(previewCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden p-4">
        <div className={`transition-all duration-300 ${showPreview ? 'w-1/2 pr-2' : 'w-full'}`}>
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isStreaming={isStreaming}
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            showPreview={showPreview}
          />
        </div>
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-1/2 h-full overflow-hidden pl-2"
            >
              <div className="h-full relative overflow-hidden bg-white rounded-lg shadow-lg">
                <CodePreview code={previewCode} />
                <button
                  onClick={handleCopyCode}
                  className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200 z-10"
                >
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!showPreview && previewCode && (
        <button
          onClick={() => setShowPreview(true)}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 z-20"
        >
          <Code size={24} />
        </button>
      )}
    </div>
  );
};

export default App;