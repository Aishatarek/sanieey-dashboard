import React, { useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import avatar from "assets/img/avatars/avatar4.png";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = useState(0);
  let navigate = useNavigate();

  const LogOut = () => {
    localStorage.clear();
    navigate("/");
  }

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-end rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="relative mt-[3px] flex h-[61px] w-[155px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[165px] xl:gap-2">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        <Dropdown
          button={
            <IoPerson className="h-4 w-4 text-gray-600 dark:text-white rounded-full"
              src={avatar}
              alt="User Avatar"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey 
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20" />
              <div className="flex flex-col p-4">
                <a
                  href="#"
                  onClick={LogOut}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                >
                  Log Out
                </a>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
