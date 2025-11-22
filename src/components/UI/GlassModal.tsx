// components/UI/GlassModal.tsx
'use client';
import React, { useRef, useEffect } from 'react';

interface GlassModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const GlassModal: React.FC<GlassModalProps> = ({ onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 
                 // افکت شیشه‌ای بر روی پس‌زمینه
                 backdrop-blur-sm backdrop-saturate-150 bg-black/40 dark:bg-black/60
                 transition-opacity duration-300"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-md mx-auto transform overflow-hidden rounded-[25px] 
                   transition-all duration-300 scale-100 opacity-100"
      >
        {children}
      </div>
    </div>
  );
};

export default GlassModal;