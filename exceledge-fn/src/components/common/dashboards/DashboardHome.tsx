import { FiDollarSign, FiUsers, FiFileText, FiBell } from "react-icons/fi";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const DashboardHome = () => {
  const serviceDistribution = [
    { name: "TIN Management", value: 65 },
    { name: "Google Location", value: 15 },
    { name: "Digital Library", value: 20 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

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
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          {
            title: "Total Revenue",
            value: "2,450,000 RWF",
            icon: <FiDollarSign className="text-xl" />,
            color: "yellow",
          },
          {
            title: "Active Users",
            value: "1,243",
            icon: <FiUsers className="text-xl" />,
            color: "blue",
          },
          {
            title: "TIN Subscriptions",
            value: "856",
            icon: <FiFileText className="text-xl" />,
            color: "purple",
          },
          {
            title: "Pending Actions",
            value: "14",
            icon: <FiBell className="text-xl" />,
            color: "yellow",
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
                <p className="text-xl sm:text-2xl font-bold">{metric.value}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-yellow-300">
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
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
                  outerRadius={80}
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
        {/* Recent Transactions */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {txn.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          txn.status === "Completed"
                            ? "bg-green-100 text-green-500"
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
    </div>
  );
};
