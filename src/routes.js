import React from "react";

import { IoTicketSharp } from "react-icons/io5";
import Craftsmen from "views/Craftsmen";
import Home from "views/Home";
import Messages from "views/Messages";
import Notifications from "views/Notifications";
import Profession from "views/Profession";
import Recommendation from "views/Recommendation";
import Users from "views/Users";
import Verifications from "views/Verifications";

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

export default routes;
