'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Folder, Image as ImageIcon, MoreVertical, UploadCloud, Plus, Home, 
  ChevronRight, X, Check, Trash2, Copy, Edit2, Eye, Type, ArrowLeft, Crop as CropIcon 
} from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// --- Types ---
type FileItem = {
  id: string;
  parentId: string | null;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  url?: string;
  itemsCount?: number;
  date: string;
  alt?: string;
};

type BreadcrumbItem = {
  id: string | null;
  name: string;
};

// ==========================================
// 1. HELPER FUNCTION: CROP WITH SCALING FIX
// ==========================================
async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/webp', 0.95);
  });
}

// ==========================================
// 2. MODAL COMPONENTS
// ==========================================

const CreateFolderModal = ({ isOpen, onClose, onCreate }: any) => {
  const [folderName, setFolderName] = useState('');
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName);
      setFolderName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Folder className="text-blue-500" size={20}/> پوشه جدید
        </h3>
        <input 
          autoFocus
          type="text" 
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="نام پوشه..."
          className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-6"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg">انصراف</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">ایجاد</button>
        </div>
      </div>
    </div>
  );
};

const RenameModal = ({ isOpen, onClose, onRename, item }: any) => {
  const [newName, setNewName] = useState(item?.name || '');
  useEffect(() => { setNewName(item?.name || '') }, [item]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Edit2 size={20}/> تغییر نام</h3>
        <input 
          autoFocus value={newName} onChange={(e) => setNewName(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 mb-6"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">لغو</button>
          <button onClick={() => {onRename(item.id, newName); onClose()}} className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg">ذخیره</button>
        </div>
      </div>
    </div>
  );
};

const EditAltModal = ({ isOpen, onClose, onSave, item }: any) => {
  const [newAlt, setNewAlt] = useState(item?.alt || '');
  useEffect(() => { setNewAlt(item?.alt || '') }, [item]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2"><Type size={20}/> ویرایش Alt</h3>
        <div className="flex gap-4 mb-4 items-start">
             <div className="w-20 h-20 rounded-lg overflow-hidden border shrink-0"><img src={item.url} className="w-full h-full object-cover" /></div>
             <textarea autoFocus value={newAlt} onChange={(e) => setNewAlt(e.target.value)} className="flex-1 h-20 p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">لغو</button>
          <button onClick={() => {onSave(item.id, newAlt); onClose()}} className="px-4 py-2 text-sm font-bold text-white bg-purple-600 rounded-lg">ذخیره</button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ isOpen, onClose, onDelete, item }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} /></div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">حذف آیتم</h3>
        <p className="text-sm text-gray-500 mb-6">آیا از حذف <span className="font-bold">"{item?.name}"</span> مطمئنید؟</p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm bg-gray-100 rounded-lg">خیر</button>
          <button onClick={() => { onDelete(item.id); onClose(); }} className="px-5 py-2 text-sm font-bold text-white bg-red-500 rounded-lg">بله، حذف کن</button>
        </div>
      </div>
    </div>
  );
};

const PreviewModal = ({ isOpen, onClose, item }: any) => {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white"><X size={32} /></button>
      <div className="flex flex-col items-center p-4" onClick={(e) => e.stopPropagation()}>
        <img src={item.url} alt={item.alt} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
        <p className="text-white font-bold text-lg mt-4">{item.name}</p>
      </div>
    </div>
  );
};

// --- CROP MODAL ---
const CropModal = ({ isOpen, onClose, imageSrc, onCropComplete }: any) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 80 }, 1, width, height), // استفاده از 1 برای مربع اولیه
      width,
      height
    );
    setCrop(crop);
  }, []);

  const handleApplyCrop = async () => {
    if (completedCrop && imgRef.current && completedCrop.width > 0 && completedCrop.height > 0) {
        const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
        if (croppedBlob) {
            onCropComplete(croppedBlob);
        }
    } else {
        onCropComplete(null); 
    }
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden m-4 flex flex-col h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><CropIcon size={20}/> برش تصویر</h3>
            <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
        </div>
        
        <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-4">
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)}>
                <img 
                    ref={imgRef} 
                    src={imageSrc} 
                    onLoad={onImageLoad} 
                    style={{ maxHeight: '70vh', width: 'auto', maxWidth: '100%' }} 
                    alt="Crop source" 
                />
            </ReactCrop>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">انصراف</button>
            <button onClick={handleApplyCrop} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <Check size={18} /> اعمال برش
            </button>
        </div>
      </div>
    </div>
  );
};

// --- UPLOAD MODAL ---
const UploadModal = ({ isOpen, onClose, onUpload, currentFolderId }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      const isImage = selected.type.startsWith('image/');

      if (isImage) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            setRawImageSrc(reader.result as string);
            setShowCropper(true);
          });
          reader.readAsDataURL(selected);
          setFile(selected);
      } else {
        setFile(selected);
        setPreviewUrl(null);
      }
    }
  };

  const handleCropFinished = (croppedBlob: Blob | null) => {
      if (croppedBlob && file) {
          const croppedFile = new File([croppedBlob], file.name, { type: 'image/webp' });
          setFile(croppedFile);
          setPreviewUrl(URL.createObjectURL(croppedFile));
      } else if (rawImageSrc && file) {
          setPreviewUrl(rawImageSrc);
      }
      setShowCropper(false);
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file, altText);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
      setFile(null); setPreviewUrl(null); setRawImageSrc(null); setAltText(''); setShowCropper(false);
  }
  
  const handleClose = () => {
      resetForm();
      onClose();
  }

  return (
    <>
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden m-4 flex flex-col md:flex-row">
        <div className="w-full md:w-5/12 bg-slate-50 p-6 flex flex-col items-center justify-center border-l border-gray-100 relative">
           {previewUrl ? (
             <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm border group">
               <img src={previewUrl} className="w-full h-full object-cover" />
               <button onClick={resetForm} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
               {file?.type.startsWith('image/') && (
                <button onClick={() => setShowCropper(true)} className="absolute bottom-2 right-2 bg-blue-600/90 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700" title="برش مجدد">
                    <CropIcon size={14}/>
                </button>
               )}
             </div>
           ) : (
             <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 cursor-pointer gap-3 hover:bg-blue-50/50 transition-colors">
               <UploadCloud size={24} /> <span className="text-xs font-bold">انتخاب فایل</span>
             </div>
           )}
           <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
        <div className="w-full md:w-7/12 p-6 flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">آپلود فایل</h3>
              <button onClick={handleClose}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
           </div>
           {file && (
                <div className="mb-4 p-2 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-center gap-2 truncate">
                    <Check size={14} /> فایل انتخاب شده: <span className="font-bold truncate">{file.name}</span>
                </div>
           )}
           <textarea value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full h-28 p-3 border rounded-xl text-sm outline-none resize-none mb-4 focus:ring-2 focus:ring-blue-500" placeholder="متن جایگزین (Alt)..." />
           <button onClick={handleSubmit} disabled={!file} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-lg shadow-blue-200 disabled:shadow-none">آپلود نهایی</button>
        </div>
      </div>
    </div>

    <CropModal 
        isOpen={showCropper} 
        onClose={() => setShowCropper(false)} 
        imageSrc={rawImageSrc} 
        onCropComplete={handleCropFinished}
    />
    </>
  );
};

// ==========================================
// 5. FILE CARD COMPONENT
// ==========================================

const FileCard = ({ item, onClick, onMenuAction }: { item: FileItem, onClick: () => void, onMenuAction: (action: string, item: FileItem) => void }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300">
      <div onClick={onClick} className="h-36 bg-gray-50/50 flex items-center justify-center relative cursor-pointer rounded-t-2xl overflow-hidden">
        {item.type === 'folder' ? (
          <div className="relative">
             <Folder size={64} className="text-yellow-400 fill-yellow-400/20 drop-shadow-sm transition-transform group-hover:scale-110 duration-300" />
             <span className="absolute -bottom-2 -right-2 bg-white border border-gray-100 text-[10px] px-1.5 rounded-full text-gray-500 shadow-sm">{item.itemsCount}</span>
          </div>
        ) : (
          <img src={item.url} alt={item.alt || item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        )}
      </div>

      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
         <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className={`p-1.5 rounded-full transition-all backdrop-blur-sm ${showMenu ? 'bg-white shadow-md' : 'bg-white/60 opacity-0 group-hover:opacity-100 hover:bg-white'}`}>
           <MoreVertical size={16} />
         </button>
         {showMenu && (
           <div className="absolute top-9 right-0 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden animate-in fade-in zoom-in-95">
             <button onClick={(e)=>{e.stopPropagation(); setShowMenu(false); onMenuAction('rename', item)}} className="w-full text-right px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"><Edit2 size={14} /> تغییر نام</button>
             {item.type === 'file' && <button onClick={(e)=>{e.stopPropagation(); setShowMenu(false); onMenuAction('editAlt', item)}} className="w-full text-right px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 text-purple-600"><Type size={14} /> تغییر Alt</button>}
             
             {/* NEW: دکمه برش تصویر */}
             {item.type === 'file' && <button onClick={(e)=>{e.stopPropagation(); setShowMenu(false); onMenuAction('crop', item)}} className="w-full text-right px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 text-orange-600"><CropIcon size={14} /> برش تصویر</button>}

             {item.type === 'file' && <button onClick={(e)=>{e.stopPropagation(); setShowMenu(false); onMenuAction('preview', item)}} className="w-full text-right px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 text-blue-600"><Eye size={14} /> نمایش</button>}
             <div className="h-px bg-gray-100 my-1"></div>
             <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onMenuAction('delete', item); }} className="w-full text-right px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> حذف</button>
           </div>
         )}
      </div>

      <div className="p-3 border-t border-gray-100">
        <h4 className="text-sm font-bold text-gray-700 truncate" title={item.name}>{item.name}</h4>
        <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
          <span>{item.type === 'folder' ? 'پوشه' : item.size}</span>
          <span>{item.date}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MAIN PAGE COMPONENT (MyDrive)
// ==========================================

export default function MyDrive() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: 'خانه' }
  ]);
  
  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  const [allFiles, setAllFiles] = useState<FileItem[]>([
  ]);

  const displayedFiles = allFiles.filter(item => item.parentId === currentFolderId);

  // NEW: اضافه شدن 'crop' به تایپ مودال
  const [modalState, setModalState] = useState<{
    type: 'create' | 'upload' | 'rename' | 'delete' | 'preview' | 'editAlt' | 'crop' | null;
    item?: FileItem | null;
  }>({ type: null, item: null });

  // --- Handlers ---

  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      parentId: currentFolderId,
      name: name,
      type: 'folder',
      itemsCount: 0,
      date: new Date().toLocaleDateString('fa-IR')
    };
    setAllFiles([newFolder, ...allFiles]);
    updateFolderCount(currentFolderId, 1);
  };

  const handleUploadFile = (file: File, alt: string) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      parentId: currentFolderId,
      name: file.name,
      type: 'file',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      url: URL.createObjectURL(file),
      date: new Date().toLocaleDateString('fa-IR'),
      alt: alt
    };
    setAllFiles([newFile, ...allFiles]);
    updateFolderCount(currentFolderId, 1);
  };

  const handleRename = (id: string, newName: string) => {
    setAllFiles(allFiles.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const handleEditAlt = (id: string, newAlt: string) => {
    setAllFiles(allFiles.map(f => f.id === id ? { ...f, alt: newAlt } : f));
  };

  // NEW: هندلر برای ذخیره تغییرات برش روی فایل‌های موجود
  const handleSaveCroppedImage = (croppedBlob: Blob | null) => {
    if (croppedBlob && modalState.item) {
        // ایجاد URL جدید از Blob برش‌خورده
        const newUrl = URL.createObjectURL(croppedBlob);
        
        // آپدیت کردن لیست فایل‌ها
        setAllFiles(prev => prev.map(f => 
            f.id === modalState.item!.id 
            ? { ...f, url: newUrl, size: 'Edited' } 
            : f
        ));
    }
  };

  const handleDelete = (id: string) => {
    const itemToDelete = allFiles.find(f => f.id === id);
    if (itemToDelete?.type === 'folder') {
       setAllFiles(allFiles.filter(f => f.id !== id && f.parentId !== id));
    } else {
       setAllFiles(allFiles.filter(f => f.id !== id));
    }
    updateFolderCount(currentFolderId, -1);
  };

  const updateFolderCount = (folderId: string | null, change: number) => {
    if (!folderId) return;
    setAllFiles(prev => prev.map(f => 
       f.id === folderId ? { ...f, itemsCount: (f.itemsCount || 0) + change } : f
    ));
  };

  // --- Navigation ---

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name }]);
    } else {
      setModalState({ type: 'preview', item });
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const goUp = () => {
    if (breadcrumbs.length > 1) {
      setBreadcrumbs(breadcrumbs.slice(0, breadcrumbs.length - 1));
    }
  };

  const handleMenuAction = (action: string, item: FileItem) => {
    setModalState({ type: action as any, item });
  };
  const closeModal = () => setModalState({ type: null, item: null });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-[85vh] flex flex-col trezo-card overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-hidden">
          {breadcrumbs.length > 1 && (
             <button onClick={goUp} className="p-2 hover:bg-gray-200 rounded-full transition-colors mr-2">
               <ArrowLeft size={18} className="text-gray-600"/>
             </button>
          )}

          <div className="flex items-center gap-1 text-sm overflow-x-auto scrollbar-hide">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1 shrink-0 animate-in fade-in slide-in-from-right-2">
                <button 
                  onClick={() => navigateToBreadcrumb(index)}
                  className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${index === breadcrumbs.length - 1 ? 'bg-white shadow-sm text-gray-800 font-bold border border-gray-100' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                >
                  {index === 0 && <Home size={14} />}
                  {crumb.name}
                </button>
                {index < breadcrumbs.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => setModalState({ type: 'create' })} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm active:scale-95">
            <Plus size={18} className="text-gray-500" /> <span>پوشه</span>
          </button>
          <button onClick={() => setModalState({ type: 'upload' })} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95">
            <UploadCloud size={18} /> <span>آپلود فایل</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 overflow-y-auto bg-white/50">
        {displayedFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 animate-in zoom-in duration-300">
            <div className="bg-gray-50 p-6 rounded-full mb-4"><Folder size={64} className="text-gray-200" /></div>
            <p className="font-medium text-gray-400">این پوشه خالی است</p>
            <button onClick={() => setModalState({ type: 'upload' })} className="mt-4 text-sm text-blue-500 hover:underline">آپلود در اینجا</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
            {displayedFiles.map((item) => (
              <FileCard key={item.id} item={item} onClick={() => handleItemClick(item)} onMenuAction={handleMenuAction} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateFolderModal isOpen={modalState.type === 'create'} onClose={closeModal} onCreate={handleCreateFolder} />
      <UploadModal isOpen={modalState.type === 'upload'} onClose={closeModal} onUpload={handleUploadFile} currentFolderId={currentFolderId} />
      <RenameModal isOpen={modalState.type === 'rename'} item={modalState.item} onClose={closeModal} onRename={handleRename} />
      <EditAltModal isOpen={modalState.type === 'editAlt'} item={modalState.item} onClose={closeModal} onSave={handleEditAlt} />
      <DeleteModal isOpen={modalState.type === 'delete'} item={modalState.item} onClose={closeModal} onDelete={handleDelete} />
      <PreviewModal isOpen={modalState.type === 'preview'} item={modalState.item} onClose={closeModal} />
      
      {/* NEW: مودال برش برای فایل‌های موجود */}
      <CropModal 
        isOpen={modalState.type === 'crop'} 
        imageSrc={modalState.item?.url} 
        onClose={closeModal} 
        onCropComplete={handleSaveCroppedImage} 
      />

    </div>
  );
}