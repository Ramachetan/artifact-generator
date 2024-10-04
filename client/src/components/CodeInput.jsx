// components/CodeInput.jsx
import React from 'react';
import { Play } from 'lucide-react';

const CodeInput = ({ code, onCodeChange, onSubmit }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="mb-8">
    <div className="relative">
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Paste your React code here..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
      />
      <button
        type="submit"
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out flex items-center justify-center w-full sm:w-auto"
      >
        <Play className="mr-2" size={20} />
        Render Code
      </button>
    </div>
  </form>
);

export default CodeInput;