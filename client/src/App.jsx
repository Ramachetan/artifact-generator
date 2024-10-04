import React, { useState, useEffect, useCallback } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodePreview from './components/CodePreview';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import asciiArt from './components/Author';

const App = () => {
  console.log(asciiArt);
  const [messages, setMessages] = useState([]);
  const [previewCode, setPreviewCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    resetChat();
  }, []);

  useEffect(() => {
    setShowPreview(!!previewCode);
  }, [previewCode]);

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

  const callApi = useCallback(async (userMessage, image) => {
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

      let streamedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamedResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { type: 'bot', content: streamedResponse };
          return newMessages;
        });
      }

      return streamedResponse;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return "Sorry, there was an error processing your request.";
    }
  }, []);

  const handleSendMessage = useCallback(async (userMessage) => {
    setMessages(prev => [
      ...prev, 
      { type: 'user', content: userMessage, image: selectedImage }, 
      { type: 'bot', content: '' }
    ]);
   
    setIsStreaming(true);
    const botResponse = await callApi(userMessage, selectedImage);
    setIsStreaming(false);
   
    const jsxCodeMatch = botResponse.match(/```jsx([\s\S]*?)```/);
    if (jsxCodeMatch) {
      setPreviewCode(jsxCodeMatch[1].trim());
    } else {
      setPreviewCode('');
    }

    setSelectedImage(null);
  }, [selectedImage, callApi]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(previewCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [previewCode]);

  const handleImageSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <ChatWindowContainer 
          showPreview={showPreview}
          messages={messages}
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
        />
        <CodePreviewContainer 
          showPreview={showPreview}
          previewCode={previewCode}
          onClose={() => setShowPreview(false)}
          onCopy={handleCopyCode}
          isCopied={isCopied}
        />
      </div>
      <PreviewButton 
        showPreview={showPreview}
        previewCode={previewCode}
        onClick={() => setShowPreview(true)}
      />
    </div>
  );
};

const ChatWindowContainer = ({ showPreview, ...props }) => (
  <motion.div 
    className="flex-1 overflow-hidden"
    animate={{ width: showPreview ? "50%" : "100%" }}
    transition={{ duration: 0.3 }}
  >
    <ChatWindow {...props} />
  </motion.div>
);

const CodePreviewContainer = ({ showPreview, previewCode, onClose, onCopy, isCopied }) => (
  <AnimatePresence>
    {showPreview && (
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "50%" }}
        exit={{ opacity: 0, width: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="h-full bg-white shadow-lg">
          <CodePreview code={previewCode} onClose={onClose} />
          <button
            onClick={onCopy}
            className="absolute top-4 right-4 bg-[#003478] text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200 z-10"
          >
            {isCopied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const PreviewButton = ({ showPreview, previewCode, onClick }) => (
  !showPreview && previewCode && (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 z-20"
    >
      <Code size={24} />
    </button>
  )
);

export default App;