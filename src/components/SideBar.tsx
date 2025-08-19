import { Briefcase, FileText, Home, User, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../utils/authStore";
import { useState } from "react";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      path: "/dashboard/home",
      icon: Home,
    },
    {
      name: "Jobs",
      path: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Resumes",
      path: "/dashboard/resumes",
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 bg-opacity-50 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-16" : "lg:w-48"}
        fixed lg:relative z-50 lg:z-auto
        w-64 bg-white min-h-screen p-4 border-r border-gray-200 
        flex flex-col transition-all duration-300 ease-in-out
      `}
      >
        <button
          onClick={toggleSidebar}
          className="hidden lg:block absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu
            size={16}
            className={`transform transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="space-y-1 flex-1 mt-8 lg:mt-0">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center ${
                  isCollapsed ? "justify-center px-2" : "space-x-3 px-4"
                } py-3 rounded-lg transition-colors duration-200 group ${
                  isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                title={isCollapsed ? item.name : ""}
              >
                <IconComponent
                  size={20}
                  className={`${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 group-hover:text-blue-600"
                  } transition-colors duration-200 flex-shrink-0`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isCollapsed ? "justify-center px-2" : "space-x-3 px-4"
            } py-3 rounded-lg transition-colors duration-200 group w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut
              size={20}
              className="text-gray-700 group-hover:text-red-600 transition-colors duration-200 flex-shrink-0"
            />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
