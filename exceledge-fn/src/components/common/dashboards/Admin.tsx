import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiShield,
  FiFileText,
  FiBell,
  FiBook,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const AdminDashboard = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dummy data - replace with your actual data
  const revenueData = [
    { name: "Jan", revenue: 4000, transactions: 24 },
    { name: "Feb", revenue: 3000, transactions: 13 },
    { name: "Mar", revenue: 5000, transactions: 28 },
    { name: "Apr", revenue: 2780, transactions: 19 },
    { name: "May", revenue: 5890, transactions: 31 },
    { name: "Jun", revenue: 6390, transactions: 35 },
  ];

  const serviceDistribution = [
    { name: "TIN Management", value: 65 },
    { name: "Google Location", value: 15 },
    { name: "Digital Library", value: 20 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Business",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Individual",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "Enterprise",
      lastActive: "3 days ago",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      user: "John Doe",
      amount: "10,000 RWF",
      service: "TIN (0-10M)",
      status: "Completed",
      date: "2023-06-15",
    },
    {
      id: 2,
      user: "Jane Smith",
      amount: "39,999 RWF",
      service: "Google Location",
      status: "Completed",
      date: "2023-06-14",
    },
    {
      id: 3,
      user: "Acme Corp",
      amount: "500,000 RWF",
      service: "TIN (100M+)",
      status: "Pending",
      date: "2023-06-14",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } 
        lg:translate-x-0 transform fixed lg:static inset-y-0 left-0 z-40 w-64 bg-green-700 text-white transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-green-600 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-green-300 mb-4">
              Main Sections
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded bg-green-600"
                >
                  <FiHome className="text-lg" />
                  <span className="hidden sm:inline">Analytics Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-green-600"
                >
                  <FiUsers className="text-lg" />
                  <span className="hidden sm:inline">User Management</span>
                  <span className="sm:hidden">Users</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-green-600"
                >
                  <FiDollarSign className="text-lg" />
                  <span className="hidden sm:inline">Payments</span>
                  <span className="sm:hidden">Payments</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-green-600"
                >
                  <FiFileText className="text-lg" />
                  <span className="hidden sm:inline">Services</span>
                  <span className="sm:hidden">Services</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-green-300 mb-4">
              Content Management
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-green-600"
                >
                  <FiBell className="text-lg" />
                  <span className="hidden sm:inline">Announcements</span>
                  <span className="sm:hidden">Announce</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-green-600"
                >
                  <FiBook className="text-lg" />
                  <span className="hidden sm:inline">Resources</span>
                  <span className="sm:hidden">Resources</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-wider text-green-300 mb-4">
              System
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-green-600"
                >
                  <FiSettings className="text-lg" />
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Settings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-green-600"
                >
                  <FiShield className="text-lg" />
                  <span className="hidden sm:inline">Admin Controls</span>
                  <span className="sm:hidden">Admin</span>
                </a>
              </li>
              <li className="flex items-center space-x-2 p-2 rounded hover:bg-green-600">
                <FiHome className="text-lg text-red-700" />
                <span className="hidden sm:inline text-red-700">
                  <Link to="/">Back Home</Link>
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Analytics Dashboard
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FiBell className="text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  A
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {/* Key Metrics - Adjusted for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                title: "Total Revenue",
                value: "2,450,000 RWF",
                icon: <FiDollarSign className="text-xl" />,
                color: "green",
                trend: "↑ 12% from last month",
              },
              {
                title: "Active Users",
                value: "1,243",
                icon: <FiUsers className="text-xl" />,
                color: "blue",
                trend: "↑ 8% from last month",
              },
              {
                title: "TIN Subscriptions",
                value: "856",
                icon: <FiFileText className="text-xl" />,
                color: "purple",
                trend: "↑ 15% from last month",
              },
              {
                title: "Pending Actions",
                value: "14",
                icon: <FiBell className="text-xl" />,
                color: "yellow",
                trend: "↓ 3 from yesterday",
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {metric.title}
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold text-${metric.color}-600`}
                    >
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-full bg-${metric.color}-100 text-${metric.color}-600`}
                  >
                    {metric.icon}
                  </div>
                </div>
                <p className={`text-xs text-${metric.color}-600 mt-1 sm:mt-2`}>
                  {metric.trend}
                </p>
              </div>
            ))}
          </div>

          {/* Charts - Stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">
                Service Distribution
              </h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={windowWidth < 640 ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity - Stacked on mobile */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">
                Recent Transactions
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((txn) => (
                      <tr key={txn.id}>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {txn.user}
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                          {txn.amount}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {txn.service}
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              txn.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
