import React, { useEffect, useRef, useState } from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links"; // Updated import
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import { IoTicketSharp } from "react-icons/io5";
import Orders from "views/admin/tables/Orders/Orders";
import Messages from "views/Messages";
import Profession from "views/Profession";
import Recommendation from "views/Recommendation";
// import Messages from "views/admin/tables/Messages/Messages";
// import { TbMessageShare } from "react-icons/tb";
// import ContactMessages from "views/admin/tables/Messages/ContactMessages";
// import DevelopmentMessages from "views/admin/tables/Messages/DevelopmentMessages";
// import OutsourcingMessages from "views/admin/tables/Messages/OutsourcingMessages";
// import { TiMessages } from "react-icons/ti";
// import { FiMessageSquare } from "react-icons/fi";
// import { SiGooglemessages } from "react-icons/si";

const routes = [
  {
    name: "messages",
    layout: "/admin",
    icon: <IoTicketSharp className="h-6 w-6" />,
    path: "messages",
    component: <Messages />,
  },
    {
      name: "profession",
      layout: "/admin",
      icon: <IoTicketSharp className="h-6 w-6" />,
      path: "profession",
      component: <Profession />,
    },
      {
        name: "recommendation",
        layout: "/admin",
        icon: <IoTicketSharp className="h-6 w-6" />,
        path: "recommendation",
        component: <Recommendation />,
      },
  // {
  //   name: "Main Page Messages",
  //   layout: "/admin",
  //   icon: <TbMessageShare className="h-6 w-6" />,
  //   path: "Home",
  //   component: <Messages />,
  // },
  // {
  //   name: "Contact Messages",
  //   layout: "/admin",
  //   icon: <TiMessages className="h-6 w-6" />,
  //   path: "ContactMessages",
  //   component: <ContactMessages />,
  // },
  // {
  //   name: "Development Messages",
  //   layout: "/admin",
  //   icon: <FiMessageSquare className="h-6 w-6" />,
  //   path: "DevelopmentMessages",
  //   component: <DevelopmentMessages />,
  // },
  // {
  //   name: "Outsourcing Messages",
  //   layout: "/admin",
  //   icon: <SiGooglemessages className="h-6 w-6" />,
  //   path: "OutsourcingMessages",
  //   component: <OutsourcingMessages />,
  // },
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
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
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
