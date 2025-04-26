import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
interface ExtendedJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const API_URL = process.env.REACT_APP_API_URL;
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
      return Promise.reject(error);
    }
    // if (error.response?.status === 400) {
    //   window.location.href = "/";
    //   return Promise.reject(error);
    // }

    return Promise.reject(error);
  }
);

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode<ExtendedJwtPayload>(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("accessToken");
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const isAdmin = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode<ExtendedJwtPayload>(token);
    return decoded.role === "ADMIN";
  } catch (error) {
    return false;
  }
};
export const preventAuthAccess = (): void => {
  if (isAuthenticated()) {
    window.location.href = "/";
  }
};

export const requireAdmin = (): void => {
  if (!isAdmin()) {
    window.location.href = "/";
  }
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

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

export const deleteUser = async (userId: string) => {
  try {
    if (!isAdmin()) {
      throw new Error(
        "Unauthorized: Only admin users can delete announcements"
      );
    }
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
    if (!isAdmin()) {
      throw new Error(
        "Unauthorized: Only admin users can delete announcements"
      );
    }
    const transactions = await api.get("/transactions");
    return transactions;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const getTransactionsByUSerId = async (id: string) => {
  try {
    const response = await api.get(`/transactions/users/${id}`);
    return response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching transaction:", error);
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

export const fetchAnnouncement = async () => {
  try {
    const response = await api.get(`/announcements`);
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

//Announcement services
export const createAnnouncement = async (data: any) => {
  try {
    if (!isAdmin()) {
      throw new Error(
        "Unauthorized: Only admin users can delete announcements"
      );
    }
    const response = await api.post(`/announcements`, {
      title: data.title,
      content: data.content,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const updateAnnouncement = async (
  id: string,
  data: { content: string; title: string }
) => {
  try {
    const response = await api.patch(
      `/announcements/${id}`,
      {
        title: data.title,
        content: data.content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    if (!isAdmin()) {
      throw new Error(
        "Unauthorized: Only admin users can delete announcements"
      );
    }
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user user profile:", error);
    throw error;
  }
};

export const getAllBooks = async () => {
  try {
    const response = await api.get(`/books`);
    return response.data.books;
  } catch (error) {
    console.error("Error deleting user user profile:", error);
    throw error;
  }
};
export const getBookById = async (id: string) => {
  try {
    const response = await api.get(`/books/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (
      error.response?.data?.message ===
      "Subscription required for BOOKS service"
    ) {
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching book:", error);
      throw new Error("Failed to load book details");
    }
  }
};

export const uploadBook = async (data: FormData) => {
  try {
    const response = await api.post("/books", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user user profile:", error);
    throw error;
  }
};

export const updateBook = async (id: string, data: FormData) => {
  try {
    const response = await api.patch(`/books/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user user profile:", error);
    throw error;
  }
};

// Define the ContactData interface
interface ContactData {
  name: string;
  email: string;
  message: string;
}

export const sendRequest = async (data: ContactData) => {
  try {
    const response = await api.post(`/contact-request`, data);
    return response.data;
  } catch (error) {
    console.error("Error deleting user user profile:", error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    return response;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}`, {
      isRead: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
