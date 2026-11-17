"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

// دریافت آدرس API از متغیر محیطی طبق دستور شما
const API_URL = (process.env.NEXT_PUBLIC_GET_USERS_API_URL as string)

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContacted: string;
  company: string;
  leadScore: number;
  status: string;
  image: string;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // دریافت اطلاعات از API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log("Fetching from:", API_URL); // جهت دیباگ در کنسول

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // اگر API نیاز به توکن دارد اینجا اضافه کنید
            }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // نگاشت داده‌ها و مدیریت مقادیر خالی
        // فرض بر این است که data خود آرایه است. اگر داخل فیلدی مثل data.data بود تغییر دهید
        const userArray = Array.isArray(data) ? data : [];
        
        const mappedContacts: Contact[] = userArray.map((user: any) => ({
          id: user.id ? String(user.id) : `N/A-${Math.random()}`,
          name: user.name || "اطلاعات دریافت نشد",
          email: user.email || "اطلاعات دریافت نشد",
          phone: user.phone || "اطلاعات دریافت نشد",
          lastContacted: user.lastContacted || "اطلاعات دریافت نشد",
          company: user.company || "اطلاعات دریافت نشد",
          leadScore: user.leadScore || 0,
          status: user.status || "Deactive", // وضعیت پیش‌فرض
          image: user.image || "/images/users/user1.jpg", // عکس پیش‌فرض
        }));

        setContacts(mappedContacts);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // ارور را در کنسول نمایش می‌دهیم اما UI کرش نمی‌کند
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // --- صفحه‌بندی و فیلترها ---
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("All");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setCurrentPage(1);
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearchByName = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearchById = contact.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedOption === "All" || contact.status === selectedOption;
    return (matchesSearchByName || matchesSearchById) && matchesStatus;
  });

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // --- انتخاب چک‌باکس‌ها ---
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (id: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contactId) => contactId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(currentContacts.map((contact) => contact.id));
    }
    setSelectAll(!selectAll);
  };

  // --- مودال ارسال پیام ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageType, setMessageType] = useState<"sms" | "email">("sms");
  const [messageBody, setMessageBody] = useState("");

  const openModal = () => {
    if (selectedContacts.length > 0) setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessageBody("");
  };

  const handleSendMessage = () => {
    // جمع‌آوری اطلاعات گیرندگان
    const targets = contacts.filter(c => selectedContacts.includes(c.id));
    
    // ساخت آرایه مقصد (شماره یا ایمیل)
    const recipients = targets.map(user => messageType === 'sms' ? user.phone : user.email)
                              .filter(item => item !== "اطلاعات دریافت نشد");

    // ساخت پلود نهایی
    const apiPayload = {
        method: messageType, // 'sms' or 'email'
        recipients: recipients,
        message: messageBody,
        // برای تست اطلاعات کامل را هم لاگ میکنیم
        _debugInfo: targets 
    };

    console.log("--- Ready to Send to API ---");
    console.log(JSON.stringify(apiPayload, null, 2));
    
    alert("اطلاعات ارسال در کنسول لاگ شد (F12). منتظر پیاده‌سازی API ارسال.");
    closeModal();
  };

  return (
    <>
      {/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0c1427] w-full max-w-lg rounded-lg shadow-xl p-6 relative animate-fade-in-up">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-[#172036] pb-3">
              <h3 className="text-lg font-bold text-black dark:text-white">ارسال پیام گروهی</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <div className="mb-4">
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">گیرندگان ({selectedContacts.length}):</p>
               <div className="flex flex-wrap gap-2 max-h-[60px] overflow-y-auto bg-gray-50 dark:bg-[#15203c] p-2 rounded">
                 {contacts.filter(c => selectedContacts.includes(c.id)).map(c => (
                    <span key={c.id} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">{c.name}</span>
                 ))}
               </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">روش ارسال:</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="msgType" value="sms" checked={messageType === "sms"} onChange={() => setMessageType("sms")} className="mr-2"/>
                  <span className="text-black dark:text-white">پیامک</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="msgType" value="email" checked={messageType === "email"} onChange={() => setMessageType("email")} className="mr-2"/>
                  <span className="text-black dark:text-white">ایمیل</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">متن پیام:</label>
              <textarea 
                className="w-full p-3 border border-gray-200 dark:border-[#172036] rounded bg-transparent text-black dark:text-white focus:border-primary-500 outline-none h-32 resize-none"
                placeholder="متن پیام خود را وارد کنید..."
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#172036] dark:text-white">لغو</button>
              <button onClick={handleSendMessage} disabled={!messageBody.trim()} className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50">ارسال</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Card --- */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search contact here....."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
            {selectedContacts.length > 0 && (
                <button onClick={openModal} className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded text-sm hover:bg-primary-600 transition-all">
                    <i className="material-symbols-outlined text-[18px]">send</i>
                    ارسال به ({selectedContacts.length}) نفر
                </button>
            )}
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px] text-black dark:text-white">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["All", "Active", "Deactive"].map((option) => (
                  <MenuItem
                    key={option}
                    as="div"
                    className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                      selectedOption === option ? "font-semibold" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    <div className="form-check relative top-[2px]">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    شناسه
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    کاربر
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ایمیل
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    شماره تماس
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    آخرین سفارش
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                      تعداد سفارشات
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    وضعیت
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {loading ? (
                    <tr><td colSpan={8} className="text-center py-10">در حال دریافت اطلاعات...</td></tr>
                ) : currentContacts.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-10">هیچ کاربری یافت نشد. </td></tr>
                ) : (
                currentContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="form-check relative top-[2px]">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => handleCheckboxChange(contact.id)}
                        />
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[40px] rounded-full">
                          <Image
                            src={contact.image}
                            className="inline-block rounded-full object-cover"
                            alt="user-image"
                            width={40}
                            height={40}
                            // اضافه کردن unoptimized برای جلوگیری از ارور دامین عکس‌ها در Next.js
                            unoptimized={true}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {contact.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {contact.email}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.phone}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.lastContacted}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {contact.leadScore}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block ${
                          contact.status === "Active"
                            ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                            : "bg-orange-100 dark:bg-[#15203c] text-orange-600"
                        } rounded-sm font-medium text-xs`}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {currentContacts.length} of {contacts.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 space-x-1">
              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>

              {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
                <li className="inline-block" key={index}>
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;