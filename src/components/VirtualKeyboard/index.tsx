'use client';

import React, { useState } from 'react';
import { ChevronDown, Delete } from 'lucide-react';

interface SimpleKeyboardProps {
  onInput: (key: string) => void;
  onBackspace: () => void;
  onClose: () => void;
}

const SimpleKeyboard: React.FC<SimpleKeyboardProps> = ({ onInput, onBackspace, onClose }) => {
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  
  const rows = lang === 'fa' ? [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ'],
    ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
    ['ظ', 'ط', 'ز', 'ر', 'ذ', 'د', 'پ', 'و', '.', '،']
  ] : [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '.', ',']
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-gray-100 rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-center p-2 px-4 border-b bg-white rounded-t-3xl">
        <span className="font-bold text-sm text-gray-500">کیبورد</span>
        <button onClick={onClose} className="p-2"><ChevronDown /></button>
      </div>
      <div className="p-2 pb-6 select-none">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 mb-2">
            {row.map(char => (
              <button
                key={char}
                onClick={() => onInput(char)}
                className="flex-1 min-w-[30px] h-12 bg-white rounded-lg shadow-sm border-b-2 border-gray-200 font-bold text-lg active:bg-blue-100 active:scale-95 transition-transform"
              >
                {char}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-2 px-1">
          <button onClick={() => setLang(l => l === 'fa' ? 'en' : 'fa')} className="w-16 h-12 bg-gray-300 rounded-lg font-bold text-sm">
            {lang === 'fa' ? 'EN' : 'FA'}
          </button>
          <button onClick={() => onInput(' ')} className="flex-grow h-12 bg-white rounded-lg shadow-sm border-b-2 border-gray-200 text-sm font-bold">
            Space
          </button>
          <button onClick={onBackspace} className="w-16 h-12 bg-red-100 text-red-500 rounded-lg flex items-center justify-center">
            <Delete size={20} />
          </button>
          <button onClick={onClose} className="w-20 h-12 bg-blue-600 text-white rounded-lg font-bold">
            تایید
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleKeyboard;