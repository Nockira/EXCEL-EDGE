import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { token } from "../components/common/navigator/MainHeader";

interface ExtendedJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const API_URL = process.env.REACT_APP_API_URL;
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Configure axios instance with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
export const getCurrentUser = () => {
  if (!token) throw new Error("Token is null");
  try {
    const decoded = jwtDecode<ExtendedJwtPayload>(token);
    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, userData: any) => {
  try {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
export const updateUsersDetails = async (userId: string, userData: any) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser?.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admin users can update user details");
    }

    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      throw new Error("You do not have permission to perform this action");
    }
    throw error;
  }
};

export const uploadAvatar = async (userId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

// Transactions services

export const getAllTransactions = async () => {
  try {
    const transactions = await api.get("/transactions");
    return transactions;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const initiatePayment = async (data: any) => {
  try {
    const response = await api.post(`transactions/cashin`, {
      amount: data.amount,
      number: data.number,
      duration: data.duration,
      service: data.service,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};
