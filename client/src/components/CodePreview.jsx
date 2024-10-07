import React from 'react';
import CodeViewer from './CodeViewer';
import { X} from 'lucide-react';

const CodePreview = ({ code, onClose, onCopy, isCopied }) => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Code Preview</h2>
      <div className="flex items-center space-x-2">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Close preview"
        >
          <X size={24} />
        </button>
      </div>
    </div>
    <div className="flex-1 overflow-auto p-4">
      <CodeViewer code={code} />
    </div>
  </div>
);

export default CodePreview;