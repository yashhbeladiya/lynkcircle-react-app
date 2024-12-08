import React, { useState } from "react";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient, QueryKey } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { Avatar, Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { Edit, PhotoCamera } from "@mui/icons-material";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

type AuthUser = {
  _id: string;
  // Add other fields if needed
};

type EditedData = {
  bannerImg?: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  location?: string;
  bio?: string;
};

interface ConnectionStatus {
  data: {
    requestId: string;
    status: "connected" | "pending" | "received";
    // Add other fields as needed
  };
}
interface ErrorResponse {
  message: string;
}

const ProfileHeader = ({
  userData,
  isOwnProfile,
  onSave,
}: {
  userData: any;
  isOwnProfile: boolean;
  onSave: (e: any) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedData>({});
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<AuthUser>({ queryKey: ["authUser"] });

  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery<ConnectionStatus>({
    queryKey: ["connectionStatus", userData._id],
    // queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
    enabled: !isOwnProfile,
  });

  const isConnected = userData.connections.some((connection: any) => connection === authUser?._id);

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent");
      refetchConnectionStatus();
      // queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      refetchConnectionStatus();
      // queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      refetchConnectionStatus();
      // queryClient.invalidateQueries(["connectionRequests"] as QueryKey);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: removeConnection } = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
    onSuccess: () => {
      toast.success("Connection removed");
      refetchConnectionStatus();
      // queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || "An error occurred");
    },
  });

  const getConnectionStatus = () => {
    if (isConnected) return "connected";
    if (!isConnected) return "not_connected";
    return connectionStatus?.data?.status;
  };

  const renderConnectionButton = () => {
    const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
    switch (getConnectionStatus()) {
      case "connected":
        return (
          <div className='flex gap-2 justify-center'>
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className='mr-2' />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={20} className='mr-2' />
              Remove Connection
            </button>
          </div>
        );

      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className='mr-2' />
            Pending
          </button>
        );

      case "received":
        return (
          <div className='flex gap-2 justify-center'>
            <button
              // onClick={() => acceptRequest(connectionStatus?.data.requestId)}
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept
            </button>
            <button
              // onClick={() => rejectRequest(connectionStatus?.data.requestId)}
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => sendConnectionRequest(userData._id)}
            className='bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
          >
            <UserPlus size={20} className='mr-2' />
            Connect
          </button>
        );
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className='bg-white shadow rounded-lg mb-6'>
      <div
        className='relative h-48 rounded-t-lg bg-cover bg-center'
        style={{
          backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
        }}
      >
        {isEditing && (
          <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
            <Camera size={20} />
            <input
              type='file'
              className='hidden'
              name='bannerImg'
              onChange={handleImageChange}
              accept='image/*'
            />
          </label>
        )}
      </div>

      <div className='p-4'>
        <div className='relative -mt-20 mb-4'>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <span className={`h-3 w-3 rounded-full ${userData.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
            }
          >
            <Avatar
              alt={userData.name}
              src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
              sx={{ width: 128, height: 128, border: `4px solid ${userData.isWorker ? 'blue' : 'orange'}` }}
            />
          </Badge>

          {isEditing && (
            <label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
              <Camera size={20} />
              <input
                type='file'
                className='hidden'
                name='profilePicture'
                onChange={handleImageChange}
                accept='image/*'
              />
            </label>
          )}
        </div>

        <div className='text-center mb-4'>
          <h1 className='text-2xl font-bold mb-2'>{userData.name}</h1>
          <p className='text-gray-600'>{userData.headline}</p>
          <div className='flex justify-center items-center mt-2'>
            <MapPin size={16} className='text-gray-500 mr-1' />
            <span className='text-gray-600'>{userData.location}</span>
          </div>
        </div>

        {isOwnProfile ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            className='w-full'
          >
            Edit Profile
          </Button>
        ) : (
          <div className='flex justify-center'>{renderConnectionButton()}</div>
        )}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={editedData.firstName ?? userData.firstName}
            onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={editedData.lastName ?? userData.lastName}
            onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Headline"
            type="text"
            fullWidth
            value={editedData.headline ?? userData.headline}
            onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={editedData.location ?? userData.location}
            onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Bio"
            type="text"
            fullWidth
            value={editedData.bio ?? userData.bio}
            onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;
