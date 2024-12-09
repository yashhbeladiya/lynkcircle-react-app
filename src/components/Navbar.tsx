import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Badge, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { FaHome, FaUsers, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiUserCommunityFill } from "react-icons/ri";
import { FaToolbox } from "react-icons/fa";
import { MdForum } from "react-icons/md";

interface AuthUser {
  username: string;
  // Add other properties as needed
}

const Navbar = () => {
  const { data: authUser } = useQuery<AuthUser>({
    queryKey: ["authUser"],
  });

  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => await axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => await axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotificationsCount = notifications?.data?.filter(
    (n: any) => !n.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  const iconColor = '#333366';

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    logout();
  };

  return (
    <AppBar
      position="sticky"
      className="bg-[#333366] shadow-md"
      style={{ height: "64px" }}
    >
      <Toolbar
        className="flex justify-between items-center h-full px-6"
        disableGutters
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/logolc2.png"
            alt="LynkCircles Logo"
          />
        </Link>

        {/* Navbar Links (visible on larger screens) */}
        <div className="hidden sm:flex space-x-4">
          {authUser ? (
            <>
              <Link to="/" className="text-neutral flex flex-col items-center">
                <IconButton>
                  <FaHome style={{ color: iconColor }} />
                </IconButton>
                <span className="text-xs hidden md:block">Home</span>
              </Link>
              <Link
                to="/network"
                className="text-neutral flex flex-col items-center relative"
              >
                <IconButton>
                  <Badge
                    badgeContent={unreadConnectionRequestsCount}
                    color="primary"
                  >
                    <FaUsers style={{ color: iconColor }} />
                  </Badge>
                </IconButton>
                <span className="text-xs hidden md:block">My Network</span>
              </Link>
              <Link
                to="/community"
                className="text-neutral flex flex-col items-center relative"
              >
                <IconButton>
                  <Badge
                    badgeContent={unreadConnectionRequestsCount}
                    color="primary"
                  >
                    <RiUserCommunityFill style={{color: iconColor}}/>
                  </Badge>
                </IconButton>
                <span className="text-xs hidden md:block">My Community</span>
              </Link>
              <Link
                to="/works"
                className="text-neutral flex flex-col items-center relative"
              >
                <IconButton>
                  <Badge
                    badgeContent={unreadConnectionRequestsCount}
                    color="primary"
                  >
                    <FaToolbox style={{color: iconColor}}/>
                  </Badge>
                </IconButton>
                <span className="text-xs hidden md:block">Work</span>
              </Link>
              <Link
                to="/notifications"
                className="text-neutral flex flex-col items-center relative"
              >
                <IconButton>
                  <Badge
                    badgeContent={unreadNotificationsCount}
                    color="primary"
                  >
                    <FaBell style={{ color: iconColor }} />
                  </Badge>
                </IconButton>
                <span className="text-xs hidden md:block">Notifications</span>
              </Link>
              <Link
                to={`/profile/${authUser.username}`}
                className="text-neutral flex flex-col items-center"
              >
                <IconButton>
                  <FaUser style={{ color: iconColor }} />
                </IconButton>
                <span className="text-xs hidden md:block">Me</span>
              </Link>
              <button
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                onClick={handleLogout}
              >
                <IconButton>
                  <FaSignOutAlt style={{ color: iconColor }} />
                </IconButton>
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button
                  variant="text"
                  className="text-white hover:text-white me-2"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#333366",
                    marginRight: "16px",
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#333366";
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="contained"
                  className="bg-[#333366] hover:bg-[#e3e0ed]"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    padding: "6px 16px",
                    backgroundColor: "#565695",
                    color: "white",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "#e3e0ed";
                    (e.currentTarget as HTMLElement).style.color = "#333366";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "#565695";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                >
                  Join now
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button (only visible on smaller screens) */}
        <div className="sm:hidden">
          <IconButton edge="end" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;