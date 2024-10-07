import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import MarkdownRenderer from './MarkdownRenderer';




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
  

export default MessageItem;