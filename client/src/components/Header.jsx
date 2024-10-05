import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = ({ onLogout }) => (
  <header className="bg-white border-b border-gray-200">
    <div className="w-full px-6 sm:px-8 lg:px-12">
      <div className="flex items-center h-20 justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-[#003478] text-white p-2 rounded-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#003478] mb-0">HeadStart UI</h1>
            <p className="text-md font-medium text-gray-500 mt-0">Gen AI-Powered Interface Design</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-[#003478] font-semibold hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);

export default Header;
