import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';



const SuggestedQuestions = ({ questions, onQuestionClick, darkMode }) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Suggested Questions</h2>
      <div className="grid grid-cols-2 gap-4">
        {questions.map((item, index) => (
          <motion.div
            key={index}
            className="bg-amber-50 rounded-lg p-4 cursor-pointer hover:bg-amber-100 transition-colors duration-200 shadow-sm"
            onClick={() => onQuestionClick(item.question)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <span className="text-amber-900 font-medium">{item.description}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-600" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;