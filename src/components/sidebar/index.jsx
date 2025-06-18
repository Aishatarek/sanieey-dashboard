import React, { useEffect, useRef, useState } from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links"; // Updated import
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import { IoTicketSharp } from "react-icons/io5";
import Messages from "views/Messages";
import Profession from "views/Profession";
import Recommendation from "views/Recommendation";
import Users from "views/Users";
import Craftsmen from "views/Craftsmen";
import Verifications from "views/Verifications";
import Notifications from "views/Notifications";
import Home from "views/Home";


const routes = [
  {
    name: "الرئيسية",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "home",
    component: <Home />,
  },
  {
    name: "الرسائل",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "messages",
    component: <Messages />,
  },
  {
    name: "المهن",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "profession",
    component: <Profession />,
  },
  {
    name: "التوصيات",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "recommendation",
    component: <Recommendation />,
  },
  {
    name: "المستخدمون",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "users",
    component: <Users />,
  },
  {
    name: "الحرفيون",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "craftsmen",
    component: <Craftsmen />,
  },
  {
    name: "التحققات",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "verifications",
    component: <Verifications />,
  },
  {
    name: "إرسال إشعار",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "send-notification",
    component: <Notifications />,
  },
];


const Sidebar = ({ open, onClose }) => {
  const sidebarRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileView && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isMobileView]);

  return (
<div
  ref={sidebarRef}
  dir="rtl"
  className={`sm:none duration-175 ease-in-out linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 font-cairo ${
    open ? "translate-x-0" : "translate-x-96"
  }`}
>
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
           <span className="font-medium">صنايعى</span>
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} onClose={onClose} isMobileView={isMobileView} />
      </ul>

      {/* Free Horizon Card */}
      <div className="flex justify-center">
        <SidebarCard />
      </div>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
