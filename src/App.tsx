import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { createBrowserRouter, RouterProvider } from "react-router";

import Resumes from "./pages/Resumes";
import MainDashboardPage from "./pages/MainDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Registration />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashBoard />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <MainDashboardPage />,
        },
        {
          path: "home",
          element: <MainDashboardPage />,
        },
        {
          path: "jobs",
          element: <div>Jobs Page - Coming Soon</div>,
        },
        {
          path: "resumes",
          element: <Resumes />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
