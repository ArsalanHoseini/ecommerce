'use client';

import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Check, Folder } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export default function UploadModal({ isOpen, onClose, currentPath }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // ساخت پیش‌نمایش آنی بدون نیاز به سرور
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    // شبیه‌سازی آپلود
    console.log('Uploading:', {
        file: selectedFile.name,
        alt: altText,
        path: currentPath || 'root'
    });

    setTimeout(() => {
        setIsUploading(false);
        onClose();
        alert('فایل با موفقیت و با فرمت WebP ذخیره شد!');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden m-4">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">آپلود تصویر جدید</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          
          {/* Left: Dropzone / Preview */}
          <div className="flex-1">
            {!previewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-500 gap-3"
              >
                <div className="p-4 bg-white rounded-full shadow-sm">
                    <UploadCloud size={32} className="text-blue-500" />
                </div>
                <div className="text-center">
                    <span className="font-bold text-gray-700">کلیک کنید</span> یا فایل را اینجا رها کنید
                </div>
                <span className="text-xs text-gray-400">JPG, PNG, WEBP تا 5 مگابایت</span>
              </div>
            ) : (
              <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                <button 
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md hover:text-red-500 transition-colors"
                >
                    <X size={16} />
                </button>
              </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/*"
            />
          </div>

          {/* Right: Settings (Alt Text) */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مسیر ذخیره‌سازی</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <Folder size={16} />
                    <span>{currentPath ? `uploads/${currentPath}` : 'uploads (Root)'}</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    متن جایگزین (Alt Text) <span className="text-red-500">*</span>
                </label>
                <textarea 
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="توصیفی از تصویر بنویسید (برای سئو مهم است)..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">این متن به همراه تصویر به بکند ارسال می‌شود.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            انصراف
          </button>
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || !altText || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all"
          >
            {isUploading ? 'در حال آپلود...' : (
                <>
                    <Check size={18} />
                    <span>آپلود و ذخیره</span>
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}