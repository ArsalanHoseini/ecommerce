"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import dynamic from 'next/dynamic';
import type { DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from '@hello-pangea/dnd';

// ----------------------------------------------------
// 💡 Dynamic Import (Required for D&D in Next.js/SSR)
// ----------------------------------------------------
const DragDropContext = dynamic(
  () => import('@hello-pangea/dnd').then((mod) => mod.DragDropContext),
  { ssr: false }
);
const Droppable = dynamic(
  () => import('@hello-pangea/dnd').then((mod) => mod.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import('@hello-pangea/dnd').then((mod) => mod.Draggable),
  { ssr: false }
);

// ----------------------------------------------------
// 💡 Types
// ----------------------------------------------------

interface Category {
  id: number;
  image: string;
  name: string;
  totalProducts: number;
  slug: string;
  description: string;
  status: "Active" | "Deactive";
  parentId: number | null;
  order: number;
  children: Category[];
}

interface NewCategoryForm {
  name: string;
  slug: string;
  description: string;
  status: "Active" | "Deactive";
  parentId: number | null;
  imageFile: File | null;
}

interface ParentOption {
  id: number | null;
  name: string;
  depth: number;
}

// ----------------------------------------------------
// 💡 Helper Functions (Logic)
// ----------------------------------------------------

// تابع کمکی برای پیدا کردن لیست فرزندان یک والد در درخت
const findList = (list: Category[], parentId: number | null): Category[] | null => {
  if (parentId === null) return list;
  for (const item of list) {
    if (item.id === parentId) return item.children;
    if (item.children && item.children.length > 0) {
      const found = findList(item.children, parentId);
      if (found) return found;
    }
  }
  return null;
};

// تابع کمکی برای افزودن آیتم جدید به درخت
const addToTree = (list: Category[], newItem: Category): Category[] => {
    if (newItem.parentId === null) {
        return [...list, newItem];
    }
    return list.map(item => {
        if (item.id === newItem.parentId) {
            return { ...item, children: [...item.children, newItem] };
        }
        if (item.children.length > 0) {
            return { ...item, children: addToTree(item.children, newItem) };
        }
        return item;
    });
};

// تابع کمکی برای حذف آیتم از درخت
const recursiveDelete = (list: Category[], idToDelete: number): Category[] => {
  return list
    .filter(category => category.id !== idToDelete)
    .map(category => ({
      ...category,
      children: recursiveDelete(category.children, idToDelete)
    }));
};

// تابع کمکی برای جابجایی آیتم در درخت (Drag & Drop Logic)
const moveItemInTree = (
  list: Category[],
  sourceParentId: number | null,
  destinationParentId: number | null,
  movedItemId: number,
  destinationIndex: number
): Category[] => {
  const newList = JSON.parse(JSON.stringify(list)) as Category[];
  
  // 1. حذف از مبدا
  const sourceList = findList(newList, sourceParentId);
  if (!sourceList) return list;
  const itemIndexInSource = sourceList.findIndex(item => item.id === movedItemId);
  if (itemIndexInSource === -1) return list;
  const [movedItem] = sourceList.splice(itemIndexInSource, 1);
  
  // 2. افزودن به مقصد
  const destinationList = findList(newList, destinationParentId);
  if (!destinationList) return list;
  movedItem.parentId = destinationParentId;
  destinationList.splice(destinationIndex, 0, movedItem);
  
  // 3. مرتب سازی مجدد (اختیاری اما توصیه شده)
  destinationList.forEach((item, index) => { item.order = index; });
  
  return newList;
};

// تابع کمکی برای مسطح کردن لیست جهت استفاده در دراپ‌داون والد
const flattenCategories = (categories: Category[], depth: number = 0, list: ParentOption[] = []): ParentOption[] => {
  for (const category of categories) {
    list.push({ id: category.id, name: `${'— '.repeat(depth)}${category.name}`, depth: depth });
    if (category.children && category.children.length > 0) {
      flattenCategories(category.children, depth + 1, list);
    }
  }
  return list;
};

// ----------------------------------------------------
// 💡 Components (CategoryItem & CategoryList)
// ----------------------------------------------------

interface CategoryListBaseProps {
  categories: Category[];
  parentId: number | null;
  onDragEnd: (result: DropResult) => Promise<void>;
  onDelete: (id: number) => void;
  level?: number; 
}

interface CategoryItemProps extends Omit<CategoryListBaseProps, 'categories' | 'parentId'> {
  category: Category;
  index: number;
  CategoryListComponent: React.FC<CategoryListBaseProps>;
}

const CategoryItem: React.FC<CategoryItemProps> = React.memo(({ category, index, onDragEnd, onDelete, CategoryListComponent, level = 0 }) => {
  return (
    <Draggable draggableId={String(category.id)} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ 
            ...provided.draggableProps.style,
            // تنظیمات درگ
            opacity: snapshot.isDragging ? 0.9 : 1,
            zIndex: snapshot.isDragging ? 9999 : 'auto',
          }}
          className={`
            mb-2 rounded-md transition-all duration-200 relative
            ${snapshot.isDragging ? 'shadow-2xl scale-[1.01] ring-2 ring-primary-500 bg-white dark:bg-[#0c1427]' : ''}
          `}
        >
          {/* محتوای هدر آیتم (همیشه نمایش داده می‌شود) */}
          <div className="flex items-center bg-white dark:bg-[#0c1427] p-[10px] md:p-[12px] border border-gray-100 dark:border-[#172036] rounded-md hover:border-gray-300 dark:hover:border-gray-600 transition-colors z-10 relative">
            
            <div 
              {...provided.dragHandleProps} 
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-primary-500 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="برای جابجایی بکشید"
            >
              <i className="material-symbols-outlined !text-[22px]">drag_indicator</i>
            </div>
            
            <div className="mx-3 relative w-[32px] h-[32px]">
               <Image alt={category.name} src={category.image} className="rounded-full object-cover" fill sizes="32px" />
            </div>

            <div className="flex-grow flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-bold text-sm text-gray-800 dark:text-gray-100">{category.name}</span>
              <span className="text-gray-400 text-xs font-mono bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">/{category.slug}</span>
            </div>

            <div className="flex items-center gap-2">
               <span className={`text-[10px] px-2 py-0.5 rounded-full border ${category.status === 'Active' ? 'border-green-200 text-green-600 bg-green-50' : 'border-red-200 text-red-600 bg-red-50'}`}>
                 {category.status === 'Active' ? 'فعال' : 'غیرفعال'}
               </span>
              <button onClick={() => onDelete(category.id)} className="text-gray-400 hover:text-red-500 p-1 transition-colors"><i className="material-symbols-outlined !text-[18px]">delete</i></button>
            </div>
          </div>

          {/* فرزندان (مخفی شدن در حالت درگ برای جلوگیری از پرش) */}
          {!snapshot.isDragging && (
             <div className="ltr:pl-4 rtl:pr-4 pt-2">
               {/* ایجاد خط راهنمای بصری و فاصله از کناره */}
               <div className="ltr:pl-4 rtl:pr-4 border-l-2 rtl:border-l-0 rtl:border-r-2 border-dashed border-gray-200 dark:border-gray-700">
                 <CategoryListComponent 
                   categories={category.children} 
                   parentId={category.id} 
                   onDragEnd={onDragEnd} 
                   onDelete={onDelete} 
                   level={level + 1}
                 />
               </div>
             </div>
          )}
        </div>
      )}
    </Draggable>
  );
});
CategoryItem.displayName = 'CategoryItem';

const CategoryList: React.FC<CategoryListBaseProps> = React.memo(({ categories, parentId, onDragEnd, onDelete, level = 0 }) => {
  const droppableId = `list-${parentId === null ? 'root' : parentId}`; 

  return (
    <Droppable droppableId={droppableId} type="CATEGORY">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            transition-all duration-200 rounded-md pb-4 
            ${snapshot.isDraggingOver ? 'bg-primary-50/50 dark:bg-primary-900/10 ring-1 ring-dashed ring-primary-300 min-h-[60px]' : 'min-h-[10px]'}
          `}
        >
          {categories.map((category, index) => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              index={index} 
              onDragEnd={onDragEnd} 
              onDelete={onDelete} 
              CategoryListComponent={CategoryList} 
              level={level}
            />
          ))}
          {provided.placeholder}
          
          {categories.length === 0 && snapshot.isDraggingOver && (
             <div className="h-[30px] border border-dashed border-primary-300 rounded flex items-center justify-center text-[10px] text-primary-400">
                اینجا رها کنید
             </div>
          )}
        </div>
      )}
    </Droppable>
  );
});
CategoryList.displayName = 'CategoryList';

// ----------------------------------------------------
// 💡 Mock Data
// ----------------------------------------------------
const categoriesData: Category[] = [
  { id: 10, image: "/images/products/product1.jpg", name: "الکترونیک", totalProducts: 54, slug: "electronic", description: "توضیحات", status: "Active", parentId: null, order: 0, children: [
    { id: 11, image: "/images/products/product2.jpg", name: "موبایل", totalProducts: 13, slug: "mobile", description: "توضیحات", status: "Active", parentId: 10, order: 0, children: [
      { id: 13, image: "/images/products/product3.jpg", name: "سامسونگ", totalProducts: 42, slug: "samsung", description: "توضیحات", status: "Active", parentId: 11, order: 0, children: [] }
    ]},
    { id: 12, image: "/images/products/product4.jpg", name: "لپ‌تاپ", totalProducts: 34, slug: "laptop", description: "توضیحات", status: "Deactive", parentId: 10, order: 1, children: [] },
  ]},
  { id: 20, image: "/images/products/product5.jpg", name: "پوشاک", totalProducts: 19, slug: "apparel", description: "توضیحات", status: "Active", parentId: null, order: 1, children: [
    { id: 21, image: "/images/products/product6.jpg", name: "زنانه", totalProducts: 45, slug: "womens", description: "توضیحات", status: "Active", parentId: 20, order: 0, children: [] },
  ]},
];

// ----------------------------------------------------
// 💡 Main Component: CategoriesTable
// ----------------------------------------------------

const CategoriesTable: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonOutput, setJsonOutput] = useState(''); 
  const [categories, setCategories] = useState<Category[]>(categoriesData);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const [newCategory, setNewCategory] = useState<NewCategoryForm>({
      name: "", slug: "", description: "", status: "Active", parentId: null, imageFile: null,
  });

  // --- Handlers ---

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      let updatedValue: string | number | null = value;
      if (name === "parentId") updatedValue = value === "null" ? null : parseInt(value);
      if (name === 'name') {
          setNewCategory(prev => ({ ...prev, name: value, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
      } else {
          setNewCategory(prev => ({ ...prev, [name]: updatedValue }));
      }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
          setNewCategory(prev => ({ ...prev, imageFile: event.target.files![0] }));
      } else {
          setNewCategory(prev => ({ ...prev, imageFile: null }));
      }
  }, []);

  // هندلر ثبت دسته جدید (فقط به استیت اضافه می‌کند)
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCategory.name) return;

      const newItem: Category = {
          id: Date.now(),
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
          status: newCategory.status,
          parentId: newCategory.parentId,
          order: 99,
          image: newCategory.imageFile ? URL.createObjectURL(newCategory.imageFile) : "/images/products/product1.jpg",
          totalProducts: 0,
          children: []
      };

      setCategories(prev => addToTree(prev, newItem));
      setOpen(false);
      setNewCategory({ name: "", slug: "", description: "", status: "Active", parentId: null, imageFile: null });
  };

  // هندلر ثبت نهایی تغییرات ساختار (نمایش JSON)
  const handleSaveStructureChanges = () => {
    const jsonString = JSON.stringify(categories, ['id', 'name', 'slug', 'parentId', 'order', 'children'], 2);
    setJsonOutput(jsonString);
    setJsonModalOpen(true);
  };

  const handleDelete = useCallback((id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) return;
    setCategories(prev => recursiveDelete(prev, id));
  }, []);

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;
    
    const movedItemId = parseInt(draggableId);
    const extractParentId = (did: string) => (did.replace('list-', '') === 'root' ? null : parseInt(did.replace('list-', '')));

    const sourceParentId = extractParentId(source.droppableId);
    const destinationParentId = extractParentId(destination.droppableId);
    
    if (sourceParentId === movedItemId || destinationParentId === movedItemId) return;

    const newCategories = moveItemInTree(categories, sourceParentId, destinationParentId, movedItemId, destination.index);
    setCategories(newCategories); 
  }, [categories]);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        
        {/* Header */}
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="trezo-card-title">
            <h5 className="mb-0 text-lg font-bold">مدیریت دسته‌بندی‌ها</h5>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <input type="text" placeholder="جستجو..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-50 border border-gray-100 h-[36px] text-xs rounded-md w-[200px] px-3 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c]" />
            <button type="button" className="inline-flex items-center gap-2 transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white text-sm" onClick={() => setOpen(true)}>
              <i className="material-symbols-outlined !text-[18px]">add</i> افزودن دسته
            </button>
            <button type="button" className="inline-flex items-center gap-2 transition-all rounded-md font-medium px-[13px] py-[6px] text-white bg-green-600 border border-green-600 hover:bg-green-700 text-sm shadow-sm" onClick={handleSaveStructureChanges}>
              <i className="material-symbols-outlined !text-[18px]">save</i> ثبت تغییرات ساختار
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="flex items-center text-gray-400 font-medium text-xs px-[10px] pb-2 border-b border-gray-100 dark:border-[#172036] mb-4">
             <span className="ml-2 material-symbols-outlined !text-[16px]">info</span>
             برای جابجایی دسته‌ها، آیکون <i className="material-symbols-outlined !text-[16px] px-1">drag_indicator</i> را بگیرید و بکشید.
          </div>

          <div className="trezo-category-tree min-h-[200px]">
            <DragDropContext onDragEnd={onDragEnd}>
              <CategoryList categories={categories} parentId={null} onDragEnd={onDragEnd} onDelete={handleDelete} />
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* مودال افزودن دسته */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel transition className="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#0c1427] text-right shadow-xl transition-all duration-300 sm:w-full sm:max-w-[600px]">
              <div className="p-6 border-b border-gray-100 dark:border-[#172036] flex justify-between items-center">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">افزودن دسته‌بندی جدید</h3>
                 <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="material-symbols-outlined">close</i></button>
              </div>
              <div className="p-6">
                 <form onSubmit={handleAddCategorySubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">نام دسته</label>
                        <input type="text" name="name" value={newCategory.name} onChange={handleChange} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-[#15203c] dark:border-gray-600 dark:text-white" />
                      </div>
                       <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">وضعیت</label>
                        <select name="status" value={newCategory.status} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-[#15203c] dark:border-gray-600 dark:text-white">
                          <option value="Active">فعال</option>
                          <option value="Deactive">غیرفعال</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">دسته‌بندی والد</label>
                        <select name="parentId" value={newCategory.parentId === null ? "null" : newCategory.parentId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-[#15203c] dark:border-gray-600 dark:text-white">
                          <option value="null">--- دسته اصلی (بدون والد) ---</option>
                          {flattenCategories(categories).map(option => (
                            <option key={option.id} value={option.id as number}>{option.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                         <div className="relative">
                             <i className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</i>
                             <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                             {newCategory.imageFile && <p className="text-sm text-green-500 mt-2">{newCategory.imageFile.name}</p>}
                           </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">لغو</button>
                      <button type="submit" className="text-white bg-primary-600 hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600">افزودن</button>
                    </div>
                 </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* مودال JSON */}
      <Dialog open={jsonModalOpen} onClose={setJsonModalOpen} className="relative z-50">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0" />
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel transition className="relative transform overflow-hidden rounded-xl bg-gray-900 text-white shadow-2xl transition-all duration-300 sm:w-full sm:max-w-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-mono font-bold text-green-400">ساختار نهایی (JSON)</h3>
                <button onClick={() => setJsonModalOpen(false)} className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="p-0 relative group">
                <button onClick={() => { navigator.clipboard.writeText(jsonOutput); alert('کپی شد!'); }} className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-xs px-3 py-1 rounded border border-gray-600 transition-opacity opacity-0 group-hover:opacity-100">کپی JSON</button>
                <pre className="p-6 overflow-auto max-h-[60vh] text-sm font-mono text-gray-300 bg-[#0d1117]" dir="ltr">{jsonOutput}</pre>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CategoriesTable;