'use client';

import React from 'react';

interface SimpleNumpadProps {
  onInput: (key: string) => void;
  onBackspace: () => void;
  onClose: () => void;
  title: string;
}

const SimpleNumpad: React.FC<SimpleNumpadProps> = ({ onInput, onBackspace, onClose, title }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-center p-4 border-b">
        <span className="font-bold text-lg">{title}</span>
        <button onClick={onClose} className="bg-red-50 text-red-500 px-4 py-1 rounded-lg text-sm font-bold">بستن</button>
      </div>
      <div className="grid grid-cols-3 gap-2 p-4 pb-8">
        {keys.map(key => (
          <button
            key={key}
            onClick={() => {
              if (key === '⌫') onBackspace();
              else if (key === 'C') onInput('clear');
              else onInput(key);
            }}
            className={`h-16 text-2xl font-bold rounded-xl active:scale-95 transition-transform shadow-sm border border-b-4 ${
              key === '⌫' ? 'bg-red-100 text-red-600 border-red-200' :
              key === 'C' ? 'bg-orange-100 text-orange-600 border-orange-200' :
              'bg-gray-50 text-gray-800 border-gray-200 active:bg-blue-50'
            }`}
          >
            {key}
          </button>
        ))}
        <button onClick={onClose} className="col-span-3 h-14 bg-green-600 text-white text-xl font-bold rounded-xl mt-2 shadow-lg active:scale-[0.98]">
          تایید
        </button>
      </div>
    </div>
  );
};

export default SimpleNumpad;