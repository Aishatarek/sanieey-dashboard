import React from "react";

// Admin Imports
// Icon Imports
// import {
//   MdHome,
//   MdBarChart,
// } from "react-icons/md";
import Orders from "views/admin/tables/Orders/Orders";
// import Messages from "views/admin/tables/Messages/Messages";
// import TicketSystem from "views/admin/tables/ticket/TicketSystem";
// import AddProduct from "views/admin/tables/Products/AddProduct";
import { IoTicketSharp } from "react-icons/io5";
import Messages from "views/Messages";
import Profession from "views/Profession";
import Recommendation from "views/Recommendation";
// import { TbMessageStar } from "react-icons/tb";
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
  // }
];
export default routes;
