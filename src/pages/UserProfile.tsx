import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import toast from "react-hot-toast";

interface UserProfile {
  username: string;
  // Add other user profile fields here
}

interface AuthUser {
  username: string;
  // Add other auth user fields here
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading: isAuthUserLoading } = useQuery<AuthUser>({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/user").then(res => res.data),
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery<UserProfile>({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`).then(res => res.data),
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData: Partial<UserProfile>) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
    },
  });

  if (isAuthUserLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser?.username === userProfile?.username;
  const userData = isOwnProfile ? authUser : userProfile;

  const handleSave = (updatedData: Partial<UserProfile>) => {
    updateProfile(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
    </div>
  );
};

export default ProfilePage;