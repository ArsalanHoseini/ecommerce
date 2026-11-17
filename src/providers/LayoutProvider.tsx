"use client";

import React, { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

interface LayoutProviderProps {
  children: ReactNode;
}

const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const pathname = usePathname();

  const [active, setActive] = useState<boolean>(false);

  const toggleActive = () => {
    setActive(!active);
  };

  const isAuthPage = [
    "/authentication/sign-in/",
    "/admin/rms/mobilepos/",
    "/authentication/sign-up/",
    "/authentication/forgot-password/",
    "/authentication/reset-password/",
    "/authentication/confirm-email/",
    "/authentication/lock-screen/",
    "/authentication/logout/",
    "/authentication/enter-phone/",
    "/coming-soon/",
    "/",
    "/front-pages/features/",
    "/front-pages/team/",
    "/front-pages/faq/",
    "/front-pages/contact/",
    "/authentication/stafflogin/",
  ].includes(pathname);

  return (
    <>
      <div
        className={`main-content-wrap transition-all ${active ? "active" : ""}`}
      >
        {!isAuthPage && (
          <>
            <SidebarMenu toggleActive={toggleActive} />

            <Header toggleActive={toggleActive} />
          </>
        )}

        <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
          {children}

          {!isAuthPage && <Footer />}
        </div>
      </div>
    </>
  );
};

export default LayoutProvider;




// "use client";

// import React, { useState, ReactNode } from "react";
// import { usePathname } from "next/navigation";
// import SidebarMenu from "@/components/Layout/SidebarMenu";
// import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";

// interface LayoutProviderProps {
//   children: ReactNode;
// }

// const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
//   const pathname = usePathname();

//   const [active, setActive] = useState<boolean>(false);

//   const toggleActive = () => {
//     setActive(!active);
//   };

//   // فقط مسیرهایی که با /admin/ شروع می‌شوند نمایش داده شوند
//   const isAdminPage = pathname.startsWith("/admin/");

//   return (
//     <div className={`main-content-wrap transition-all ${active ? "active" : ""}`}>
//       {isAdminPage && (
//         <>
//           <SidebarMenu toggleActive={toggleActive} />
//           <Header toggleActive={toggleActive} />
//         </>
//       )}

//       <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
//         {children}

//         {isAdminPage && <Footer />}
//       </div>
//     </div>
//   );
// };

// export default LayoutProvider;
