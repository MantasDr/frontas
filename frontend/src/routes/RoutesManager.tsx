import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Feed from "../pages/Feed";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/auth/authProvider";
import About from "@/pages/About";
import Profile from "@/pages/Profile";
import LakeAdmin from "@/pages/LakeAdmin";
import FishAdmin from "@/pages/FishAdmin";
import RankAdmin from "@/pages/RankAdmin";
import AchievmentAdmin from "@/pages/AchievmentAdmin";


const RoutesManager = () => {
  const { isAuthenticated } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        /*{
          path: "/",
          element: (
            <>
              <Navbar />
              <Home />
            </>
          ),
        },
        {
          path: "/profile",
          element: (
            <>
              <Navbar />
              <Profile />
            </>
          ),
        },
        {
          path: "/about",
          element: (
            <>
              <Navbar />
              <About />
            </>
          ),
        },*/
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: (
        <>
          <Navbar />
          <Login />
        </>
      ),
    },
    {
      path: "/register",
      element:  (
        <>
          <Navbar />
          <Register />
        </>
      ),
    },
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Home />
        </>
      ),
    },
    {
      path: "/Feed",
      element: (
        <>
          <Navbar />
          <Feed/>
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <Navbar />
          <Profile />
        </>
      ),
    },
    {
      path: "/LakeAdmin",
      element: (
        <>
          <Navbar />
          <LakeAdmin />
        </>
      ),
    },
    {
      path: "/FishAdmin",
      element: (
        <>
          <Navbar />
          <FishAdmin />
        </>
      ),
    },
    {
      path: "/AchievmentAdmin",
      element: (
        <>
          <Navbar />
          <AchievmentAdmin />
        </>
      ),
    },
    {
      path: "/RankAdmin",
      element: (
        <>
          <Navbar />
          <RankAdmin />
        </>
      ),
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!isAuthenticated ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default RoutesManager;
