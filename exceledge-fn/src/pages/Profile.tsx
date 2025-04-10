import React, { useState, useEffect, useRef } from "react";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
} from "../services/service";
import { jwtDecode } from "jwt-decode";
import { token } from "../components/common/navigator/MainHeader";
import { toast } from "react-toastify";
import { MainLayout } from "../components/layouts/MainLayout";

interface User {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserPayload {
  firstName?: string;
  secondName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateUserPayload>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const decoded: { id?: string } = token ? jwtDecode(token) : {};

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!decoded?.id) {
        setError("User not authenticated");
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const response = await fetchUserProfile(decoded.id);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load user profile");
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    loadUserProfile();
  }, [decoded?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // updating user profile
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const response = await uploadAvatar(user.id, file);
        setUser((prev) =>
          prev ? { ...prev, avatar: response.avatarUrl } : null
        );
      } catch (err) {
        console.error("Error uploading avatar:", err);
        toast.error("Failed to upload avatar");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !Object.keys(formData).length) {
      toast.error("No changes detected");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await updateUserProfile(user.id, formData);
      setUser(updatedUser.data);
      setFormData({});
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setAvatarPreview(null);
    setEditMode(false);
    setError(null);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col justify-center items-center max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-red-500">{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="mt-12 mb-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="flex flex-col items-center mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="flex flex-col items-center mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                  {user.firstName?.charAt(0).toUpperCase()}
                  {user.secondName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* 
          {editMode && (
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-yellow-300 text-black rounded-full p-2 hover:bg-yellow-300 transition"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
            </button>
          )} */}
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user.firstName} {user.secondName}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-end space-x-3 pt-4">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm  font-bold text-black bg-yellow-400 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                  disabled={isLoading || !Object.keys(formData).length}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
              >
                Edit Profile
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={
                  editMode
                    ? formData.firstName ?? user.firstName
                    : user.firstName
                }
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                  !editMode ? "bg-gray-100" : ""
                }`}
                disabled={!editMode}
              />
            </div>

            <div>
              <label
                htmlFor="secondName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="secondName"
                name="secondName"
                value={
                  editMode
                    ? formData.secondName ?? user.secondName
                    : user.secondName
                }
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                  !editMode ? "bg-gray-100" : ""
                }`}
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editMode ? formData.email ?? user.email : user.email}
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                  !editMode ? "bg-gray-100" : ""
                }`}
                disabled={!editMode}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={editMode ? formData.phone ?? user.phone : user.phone}
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                  !editMode ? "bg-gray-100" : ""
                }`}
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={
                  editMode
                    ? formData.dob ??
                      (user.dob
                        ? new Date(user.dob).toISOString().split("T")[0]
                        : "")
                    : user.dob
                    ? new Date(user.dob).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                  !editMode ? "bg-gray-100" : ""
                }`}
                disabled={!editMode}
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={editMode ? formData.gender ?? user.gender : user.gender}
                onChange={handleChange}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                  !editMode ? "bg-gray-100" : ""
                }`}
                disabled={!editMode}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={user.role}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
              readOnly
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
