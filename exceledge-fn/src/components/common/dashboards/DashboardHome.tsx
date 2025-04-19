import { useEffect, useState } from "react";
import { FiDollarSign, FiUsers, FiFileText, FiBell } from "react-icons/fi";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getAllTransactions, fetchAllUsers } from "../../../services/service";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface ITransaction {
  id: string;
  amount: number;
  service: string;
  status: "COMPLETED" | "PENDING" | "	FAILED";
  createdAt: string;
  user: {
    firstName: string;
    secondName: string;
  };
}

interface IUser {
  id: string;
  name: string;
  active: boolean;
}

export const DashboardHome = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState({
    transactions: false,
    users: false,
  });
  const [error, setError] = useState<{
    transactions: string | null;
    users: string | null;
  }>({
    transactions: null,
    users: null,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        setLoading((prev) => ({ ...prev, transactions: true }));
        const transactionsResponse = await getAllTransactions();
        setTransactions(transactionsResponse.data.transactions);
        setLoading((prev) => ({ ...prev, transactions: false }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          transactions: "Failed to fetch transactions",
        }));
        toast.error("Failed to load transactions");
        setLoading((prev) => ({ ...prev, transactions: false }));
      }

      try {
        // Fetch users
        setLoading((prev) => ({ ...prev, users: true }));
        const usersResponse = await fetchAllUsers();
        setUsers(usersResponse.data.users);
        setLoading((prev) => ({ ...prev, users: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, users: "Failed to fetch users" }));
        toast.error("Failed to load users");
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalRevenue = transactions
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFailed = transactions
    .filter((t) => t.status === "	FAILED")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === "PENDING")
    .reduce((sum, t) => sum + t.amount, 0);

  const activeUsersCount = users.length;
  const tinSubscriptionsCount = transactions.filter((t) =>
    t.service.toLowerCase().includes("tin")
  ).length;

  // Calculate service distribution
  const getServiceDistribution = () => {
    const serviceCounts: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.status === "COMPLETED") {
        const serviceName = t.service.split("(")[0].trim();
        serviceCounts[serviceName] =
          (serviceCounts[serviceName] || 0) + t.amount;
      }
    });

    const total = Object.values(serviceCounts).reduce(
      (sum, val) => sum + val,
      0
    );

    return Object.entries(serviceCounts).map(([name, value]) => ({
      name,
      value,
      percentage: (value / total) * 100,
    }));
  };

  const serviceDistribution = getServiceDistribution();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Format recent transactions
  const recentTransactions = transactions.slice(0, 5).map((t) => ({
    id: t.id,
    user: t.user.firstName + " " + t.user.secondName,
    amount: `${t.amount.toLocaleString()} RWF`,
    service: t.service,
    status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
    date: new Date(t.createdAt).toLocaleDateString(),
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          {
            title: "Total Revenue",
            value: `${totalRevenue.toLocaleString()} RWF`,
            icon: <FiDollarSign className="text-xl" />,
            color: "yellow",
            loading: loading.transactions,
          },
          {
            title: "Active Users",
            value: activeUsersCount.toLocaleString(),
            icon: <FiUsers className="text-xl" />,
            color: "blue",
            loading: loading.users,
          },
          {
            title: "TIN Subscriptions",
            value: tinSubscriptionsCount.toLocaleString(),
            icon: <FiFileText className="text-xl" />,
            color: "purple",
            loading: loading.transactions,
          },
          {
            title: "Pending Transactions",
            value: transactions.filter((t) => t.status === "PENDING").length,
            icon: <FiBell className="text-xl" />,
            color: "yellow",
            loading: loading.transactions,
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
                {metric.loading ? (
                  <BeatLoader size={10} color="#fdc901" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold">
                    {metric.value}
                  </p>
                )}
              </div>
              <div className={`p-2 sm:p-3 rounded-full bg-${metric.color}-100`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Service Distribution Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">
            Service Revenue Distribution
          </h3>
          {loading.transactions ? (
            <div className="h-64 sm:h-80 flex items-center justify-center">
              <BeatLoader size={15} color="#fdc901" />
            </div>
          ) : serviceDistribution.length === 0 ? (
            <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500">
              No completed transactions to display
            </div>
          ) : (
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) =>
                      `${name} ${percentage.toFixed(1)}%`
                    }
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()} RWF`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">
            Recent Transactions
          </h3>
          {loading.transactions ? (
            <div className="flex items-center justify-center h-64">
              <BeatLoader size={15} color="#fdc901" />
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((txn) => (
                    <tr key={txn.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                        {txn.user}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {txn.amount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {txn.service}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            txn.status === "COMPLETED"
                              ? "bg-green-100 text-green-500"
                              : txn.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-500"
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
          )}
        </div>
      </div>
    </div>
  );
};
