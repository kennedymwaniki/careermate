import { Outlet } from "react-router";
import SideBar from "../components/SideBar";

const DashBoard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 w-full lg:ml-0 overflow-x-hidden p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;
