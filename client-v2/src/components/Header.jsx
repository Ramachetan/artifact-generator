import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => (
  <header className="bg-white border-b border-gray-200">
    <div className="w-full px-6 sm:px-8 lg:px-12">
      <div className="flex items-center h-20">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-2 rounded-lg shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-indigo-900">HeadStart UI</h1>
            <p className="text-md font-medium text-gray-500">Gen AI-Powered Interface Design</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;