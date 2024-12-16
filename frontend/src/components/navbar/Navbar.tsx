import { useContext, useState, useEffect } from "react";
import { handleLogout } from "@/auth/logout";
import { Link, useLocation } from "react-router-dom";
import CreateCaughtFishModal from "../createCaughtFishModal";
import { useDarkMode } from "@/context/DarkModeContext";
import { LakesContext } from "@/context/LakesContext";
import { useAuth } from "@/auth/authProvider"; // Import useAuth for authentication state
import axios from "axios";

const NavigationMenu = ({ children, className }) => {
  return <div className={`NavigationMenu ${className}`}>{children}</div>;
};

const NavigationMenuList = ({ children, className }) => {
  return <div className={`NavigationMenuList ${className}`}>{children}</div>;
};

const NavigationMenuItem = ({ children, className }) => {
  return <div className={`NavigationMenuItem ${className}`}>{children}</div>;
};

const Logo = () => {
  return (
    <div className="flex items-center">
      <img src="../../../public/logo.png" width={150} alt="Logo" />
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const { isAuthenticated } = useAuth(); // Use authentication state

  const lakeContext = useContext(LakesContext);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const Modal = ({ isOpen }) => {
    if (!isOpen) return null;
    return <CreateCaughtFishModal handleCloseModal={handleCloseModal} />;
  };

  // Define navigation items based on authentication state
  const navItemsLeft = isAuthenticated
    ? [
        { path: "/", label: "Pradžia" },
        { path: "/Feed", label: "Feed" },
        { path: "/LakeAdmin", label: "Ežerų sąrašas" },
        { path: "/FishAdmin", label: "Žuvų sąrašas" },
        { path: "/AchievmentAdmin", label: "Pasiekimų sąrašas" },
        { path: "/RankAdmin", label: "Rangų sąrašas" },
      ]
    : [{ path: "/", label: "Pradžia" }];

  const navItemsRight = isAuthenticated
    ? [
        {
          path: "/Profile",
          label: <span className="inline-block align-middle"> Profilis </span>,
        },
      ]
    : [
        {
          path: "/Register",
          label: <span className="inline-block align-middle"> Registruotis </span>,
        },
        {
          path: "/Login",
          label: <span className="inline-block align-middle"> Prisijungti </span>,
        },
      ];

  return (
    <div>
      <NavigationMenu className="h-16 bg-slate-100">
        <NavigationMenuList className="flex justify-between items-center h-full px-4">
          <div className="flex space-x-4 align-items">
            <Logo />
            {navItemsLeft.map((item) => (
              <NavigationMenuItem className="my-auto" key={item.path}>
                <Link
                  to={item.path}
                  className={`py-4 px-2 text-black-800 font-bold hover:text-blue-500 focus:outline-none relative`}
                >
                  <span
                    className={`${
                      location.pathname === item.path
                        ? "absolute bottom-2 left-0 w-full border-b-2 border-blue-500"
                        : ""
                    }`}
                  ></span>
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
            <button
              className="px-2 text-black-800 font-bold hover:text-blue-500 focus:outline-none"
              onClick={handleToggleDarkMode}
            >
              {darkMode ? "Patamsinti žemėlapį" : "Pašviesinti žemėlapį"}
            </button>
          </div>
          <div className="flex space-x-4 ml-auto">
            {navItemsRight.map((item) => (
              <NavigationMenuItem className="" key={item.path}>
                <Link
                  to={item.path}
                  className={`py-4 px-2 text-black-800 font-bold hover:text-blue-500 focus:outline-none relative`}
                >
                  <span
                    className={`${
                      location.pathname === item.path
                        ? "absolute bottom-2 left-0 w-full border-b-2 border-blue-500"
                        : ""
                    }`}
                  ></span>
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
            {isAuthenticated && (
              <button
                className="mx-4 text-red-600 font-bold hover:text-blue-500 focus:outline-none"
                onClick={handleLogout}
              >
                Atsijungti
              </button>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}></Modal>
    </div>
  );
};

export default Navbar;
