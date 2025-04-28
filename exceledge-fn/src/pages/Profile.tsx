import React, { useState, useEffect, useRef } from "react";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
  getTransactionsByUSerId,
} from "../services/service";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { MainLayout } from "../components/layouts/MainLayout";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import exceledgeLogo from "../assets/exceledge1.png";
import { useTranslation } from "react-i18next";

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

interface Transaction {
  id: string;
  amount: number;
  createdAt: string;
  duration: number;
  method: string;
  remainingTime: number;
  service: string;
  status: string;
  userId: string;
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
  const { t } = useTranslation<string>();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateUserPayload>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("accessToken");
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
        const transactionsResponse: any = await getTransactionsByUSerId(
          decoded.id
        );

        setUser(response.data);
        setTransactions(transactionsResponse.data || []);
        setError(null);
      } catch (err) {
        // setError("Failed to load user profile");
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    loadUserProfile();
  }, [decoded?.id]);

  const handleDownloadPDF = () => {
    if (!invoiceRef.current || !selectedTransaction) {
      toast.error("No invoice selected or available");
      return;
    }

    const input = invoiceRef.current;
    toast.info("Generating PDF...", { autoClose: 2000 });

    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const pageHeight = 290;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`ExcelEdge_Invoice_${selectedTransaction.id.slice(0, 8)}.pdf`);
        toast.success("PDF downloaded successfully");
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
        toast.error("Failed to generate PDF");
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        toast.success("Avatar updated successfully");
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

    try {
      const updatedUser = await updateUserProfile(user.id, formData);
      setUser(updatedUser.data);
      setFormData({});
      setEditMode(false);
      toast.success(t("toast.profile"));
    } catch (err: any) {
      toast.error(err.response.data.message || "Failed to save profile");
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
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
      <div className="container mx-auto px-4 py-28">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Section */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
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
                  {editMode && (
                    <label className="">
                      {/* <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={isLoading}
                      />
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
                      </svg> */}
                    </label>
                  )}
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
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                        disabled={isLoading || !Object.keys(formData).length}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={
                        editMode ? formData.email ?? user.email : user.email
                      }
                      onChange={handleChange}
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                        !editMode ? "bg-gray-100" : ""
                      }`}
                      disabled={!editMode}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={
                        editMode ? formData.phone ?? user.phone : user.phone
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
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={
                        editMode ? formData.gender ?? user.gender : user.gender
                      }
                      onChange={handleChange}
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-300 focus:border-yellow-300 ${
                        !editMode ? "bg-gray-100" : ""
                      }`}
                      disabled={!editMode}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user.role}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
                    readOnly
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Transactions/Invoices Section */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>

              {transactions.filter(
                (transaction) => transaction.status === "COMPLETED"
              ).length === 0 ? (
                <p className="text-gray-500">No completed transactions found</p>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .filter((transaction) => transaction.status === "COMPLETED")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTransaction?.id === transaction.id
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {transaction.service.replace(/_/g, " ")}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                transaction.status === "FAILED"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {transaction.amount.toFixed(2)} RFW
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {transaction.status.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Invoice Preview */}
            {selectedTransaction && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Invoice</h2>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors"
                  >
                    Download PDF
                  </button>
                </div>

                <div
                  ref={invoiceRef}
                  className="invoice-container p-6 border border-gray-200 bg-white"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <img
                        src={exceledgeLogo}
                        alt="ExcelEdge Logo"
                        className="h-16 mb-2"
                      />
                      <p className="text-gray-500">42 KK 718 St, Kigali</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-semibold">INVOICE</h2>
                      <p className="text-gray-500">
                        #{selectedTransaction.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-gray-500">
                        {formatDate(selectedTransaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold mb-2">Bill To:</h3>
                      <p>
                        {user.firstName} {user.secondName}
                      </p>
                      <p>{user.email}</p>
                      <p>{user.phone}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold mb-2">Payment Method:</h3>
                      <p>{selectedTransaction.method}</p>
                      <p
                        className={`font-semibold ${
                          selectedTransaction.status === "FAILED"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        Status: {selectedTransaction.status}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 text-left border-b">
                            Description
                          </th>
                          <th className="py-2 px-4 text-right border-b">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 px-4 border-b">
                            {selectedTransaction.service.replace(/_/g, " ")}{" "}
                            Service
                            <div className="text-sm text-gray-700 mt-1">
                              Duration: {selectedTransaction.duration} month(s)
                              {selectedTransaction.remainingTime > 0 && (
                                <span>
                                  , Remaining:{" "}
                                  {selectedTransaction.remainingTime} day(s)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right border-b">
                            {selectedTransaction.amount.toFixed(2)}RWF
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="py-3 px-4 text-right font-semibold"
                            colSpan={2}
                          >
                            Total: {selectedTransaction.amount.toFixed(2)}FRW
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Thank you for your business. Please contact us at
                      support@exceledgecpa.com with any questions.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      This is an automated invoice. No signature required.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
