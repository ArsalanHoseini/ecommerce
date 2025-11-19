"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Editor,
  EditorProvider,
  ContentEditableEvent,
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

const CreateProductForm: React.FC = () => {
  // Text Editor
  const [value, setValue] = useState<string>("پیام خود را اینجا بنویسید...");

  function onChange(e: ContentEditableEvent) {
    setValue(e.target.value);
  }

  // Upload images
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <form>
        <div className="lg:grid lg:grid-cols-3 gap-[25px]">
          <div className="lg:col-span-2">
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">افزودن محصول</h5>
                </div>
              </div>

              <div className="trezo-card-content">
                <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      عنوان محصول
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثلاً Google Pixel 7 Pro"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      نوع محصول
                    </label>
                    <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                      <option value={0}>انتخاب کنید</option>
                      <option value={1}>محصول دیجیتال</option>
                      <option value={2}>محصول فیزیکی</option>
                    </select>
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      کد SKU
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثلاً ABC-12345"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      نام برند
                    </label>
                    <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                      <option value={0}>انتخاب کنید</option>
                      <option value={1}>Emburo</option>
                      <option value={2}>Fediz</option>
                      <option value={3}>Debilop</option>
                      <option value={4}>Canin</option>
                      <option value={5}>Trezo</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      توضیحات محصول
                    </label>
                    <EditorProvider>
                      <Editor
                        value={value}
                        onChange={onChange}
                        style={{ minHeight: "200px" }}
                        className="rsw-editor"
                      >
                        <Toolbar>
                          <BtnUndo />
                          <BtnRedo />
                          <Separator />
                          <BtnBold />
                          <BtnItalic />
                          <BtnUnderline />
                          <BtnStrikeThrough />
                          <Separator />
                          <BtnNumberedList />
                          <BtnBulletList />
                          <Separator />
                          <BtnLink />
                          <BtnClearFormatting />
                          <HtmlButton />
                          <Separator />
                          <BtnStyles />
                        </Toolbar>
                      </Editor>
                    </EditorProvider>
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      قیمت عادی
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثلاً $99"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      قیمت فروش
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثلاً $29"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      زمان‌بندی انتشار
                    </label>
                    <input
                      type="date"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      موجودی محصول
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثلاً 17"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      شناسه محصول
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثلاً #JAN-2345"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      تخفیف / پیشنهاد
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="مثلاً $20"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      تاریخ موجود بودن
                    </label>
                    <input
                      type="date"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div className="mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      تاریخ پایان
                    </label>
                    <input
                      type="date"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    />
                  </div>

                  <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                    <label className="mb-[10px] text-black dark:text-white font-medium block">
                      بارگذاری تصاویر محصول
                    </label>

                    <div id="fileUploader">
                      <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                        <div className="flex items-center justify-center">
                          <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                            <i className="ri-upload-2-line"></i>
                          </div>
                          <p className="leading-[1.5]">
                            <strong className="text-black dark:text-white">
                              برای آپلود کلیک کنید
                            </strong>
                            <br /> فایل خود را اینجا قرار دهید
                          </p>
                        </div>

                        <input
                          type="file"
                          id="fileInput"
                          multiple
                          accept="image/*"
                          className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                        />
                      </div>

                      {/* Image Previews */}
                      <div className="mt-[10px] flex flex-wrap gap-2">
                        {selectedImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative w-[50px] h-[50px]"
                          >
                            <Image
                              src={URL.createObjectURL(image)}
                              alt="product-preview"
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                              onClick={() => handleRemoveImage(index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">دسته‌بندی و برچسب‌ها</h5>
                </div>
              </div>

              <div className="trezo-card-content">
                <div className="mb-[20px] md:mb-[25px] last:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    دسته‌بندی
                  </label>
                  <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                    <option value={0}>انتخاب کنید</option>
                    <option value={1}>Watch</option>
                    <option value={2}>Mobile</option>
                    <option value={3}>Laptop</option>
                    <option value={4}>Headphone</option>
                    <option value={5}>Shoe</option>
                  </select>
                </div>

                <div className="mb-[20px] md:mb-[25px] last:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    فروشنده
                  </label>
                  <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                    <option value={0}>انتخاب کنید</option>
                    <option value={1}>Dennis Matthews</option>
                    <option value={2}>Susan Rader</option>
                    <option value={3}>Douglas Harvey</option>
                    <option value={4}>John Valdez</option>
                    <option value={5}>Kathryn Turner</option>
                  </select>
                </div>

                <div className="mb-[20px] md:mb-[25px] last:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    مجموعه
                  </label>
                  <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                    <option value={0}>انتخاب کنید</option>
                    <option value={1}>Collection 1</option>
                    <option value={2}>Collection 2</option>
                    <option value={3}>Collection 3</option>
                    <option value={4}>Collection 4</option>
                    <option value={5}>Collection 5</option>
                  </select>
                </div>

                <div className="mb-[20px] md:mb-[25px] last:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    برچسب‌ها
                  </label>
                  <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                    <option value={0}>انتخاب کنید</option>
                    <option value={1}>Electronics</option>
                    <option value={2}>Sports</option>
                    <option value={3}>Fashion</option>
                    <option value={4}>Jewellery</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">گزینه‌های دیگر</h5>
                </div>
              </div>

              <div className="trezo-card-content">
                <div className="mb-[20px] md:mb-[25px] last:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    عنوان
                  </label>
                  <input
                    type="text"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="مثلاً Google Pixel 7 Pro"
                  />
                </div>

                <div className="mb-[20px] md:mb-[25px] last:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    توضیحات
                  </label>
                  <textarea
                    className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="احساس خود را درباره محصول بنویسید..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="trezo-card mb-[25px]">
          <div className="trezo-card-content">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
            >
              لغو
            </button>

            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  add
                </i>
                ایجاد محصول
              </span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateProductForm;
