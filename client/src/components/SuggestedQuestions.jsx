import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const SuggestedQuestions = ({ questions, onQuestionClick, darkMode }) => {
  // Animation variants for container and items
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {questions.map((item, index) => (
          <motion.div
            key={index}
            className={`relative bg-white border border-[#003478] border-2 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300 ${
              darkMode ? 'text-white' : 'text-[#003478]'
            }`}
            onClick={() => onQuestionClick(item.question)}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center">
                  {React.cloneElement(item.icon, {
                    className: 'w-8 h-8 text-[#003478]',
                  })}
                </div>
                <span className="text-lg font-medium">{item.description}</span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SuggestedQuestions;
