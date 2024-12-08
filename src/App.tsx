import React from "react";
import "./App.css";
import { Navigate } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router";
import Layout from "./Layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import toast, { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";
import CompleteProfile from "./pages/auth/CompleteProfile";
import Home from "./pages/Home";
import NotificationsPage from "./pages/NotificationsPage";
import PostPage from "./pages/PostPage";
import Network from "./pages/Network";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF", // White color for primary color
    },
    secondary: {
      main: "#333366", // Soft purple for secondary color
    },
  },
});

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        console.log("res :", res);
        return res.data;
      } catch (error: any) {
        console.log("error :", error);

        if (error.response && error.response.status === 401) {
          // Unauthorized
          console.log("User is not logged in");
          return null;
        }
        toast.error(error?.response?.data?.message || "Something went wrong");
        return null;
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={authUser ? <Home /> : <Navigate to={"/signin"} />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
            />
            <Route
              path="/signin"
              element={!authUser ? <SignIn /> : <Navigate to={"/"} />}
            />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route
              path="/notifications"
              element={
                authUser ? <NotificationsPage /> : <Navigate to={"/login"} />
              }
            />
            <Route
              path="/feed/:postId"
              element={authUser ? <PostPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/network"
              element={authUser ? <Network /> : <Navigate to={"/login"} />}
            />
          </Routes>
          <Toaster />
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
