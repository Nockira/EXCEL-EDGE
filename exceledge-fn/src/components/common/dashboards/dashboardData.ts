export const dashboardData = {
  // Dashboard/Home Data
  metrics: [
    {
      title: "Total Revenue",
      value: "2,450,000 RWF",
      icon: "FiDollarSign",
      color: "yellow",
      trend: "↑ 12% from last month",
    },
    {
      title: "Active Users",
      value: "1,243",
      icon: "FiUsers",
      color: "blue",
      trend: "↑ 8% from last month",
    },
    {
      title: "TIN Subscriptions",
      value: "856",
      icon: "FiFileText",
      color: "purple",
      trend: "↑ 15% from last month",
    },
    {
      title: "Pending Actions",
      value: "14",
      icon: "FiBell",
      color: "yellow",
      trend: "↓ 3 from yesterday",
    },
  ],

  revenueData: [
    { name: "Jan", revenue: 4000, transactions: 24 },
    { name: "Feb", revenue: 3000, transactions: 13 },
    { name: "Mar", revenue: 5000, transactions: 28 },
    { name: "Apr", revenue: 2780, transactions: 19 },
    { name: "May", revenue: 5890, transactions: 31 },
    { name: "Jun", revenue: 6390, transactions: 35 },
  ],

  serviceDistribution: [
    { name: "TIN Management", value: 65 },
    { name: "Google Location", value: 15 },
    { name: "Digital Library", value: 20 },
  ],

  // User Management Data
  users: {
    total: 1243,
    active: 892,
    inactive: 351,
    userList: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Business",
        status: "Active",
        lastActive: "2023-06-15T14:30:00Z",
        signupDate: "2023-01-10",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Individual",
        status: "Active",
        lastActive: "2023-06-14T09:15:00Z",
        signupDate: "2022-11-22",
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert@example.com",
        role: "Enterprise",
        status: "Inactive",
        lastActive: "2023-05-30T16:45:00Z",
        signupDate: "2023-03-05",
      },
      {
        id: 4,
        name: "Alice Williams",
        email: "alice@example.com",
        role: "Business",
        status: "Active",
        lastActive: "2023-06-15T11:20:00Z",
        signupDate: "2023-02-18",
      },
    ],
    roles: [
      { name: "Individual", count: 650 },
      { name: "Business", count: 420 },
      { name: "Enterprise", count: 173 },
    ],
  },

  // Payments Data
  payments: {
    totalRevenue: "4,850,000 RWF",
    pending: "1,200,000 RWF",
    completed: "3,650,000 RWF",
    transactions: [
      {
        id: 1,
        user: "John Doe",
        amount: "10,000 RWF",
        service: "TIN (0-10M)",
        status: "Completed",
        date: "2023-06-15",
        paymentMethod: "Mobile Money",
      },
      {
        id: 2,
        user: "Jane Smith",
        amount: "39,999 RWF",
        service: "Google Location",
        status: "Completed",
        date: "2023-06-14",
        paymentMethod: "Credit Card",
      },
      {
        id: 3,
        user: "Acme Corp",
        amount: "500,000 RWF",
        service: "TIN (100M+)",
        status: "Pending",
        date: "2023-06-14",
        paymentMethod: "Bank Transfer",
      },
      {
        id: 4,
        user: "Alice Williams",
        amount: "25,000 RWF",
        service: "Digital Library",
        status: "Failed",
        date: "2023-06-13",
        paymentMethod: "Mobile Money",
      },
    ],
    paymentMethods: [
      { name: "Mobile Money", count: 680, percentage: 65 },
      { name: "Credit Card", count: 250, percentage: 24 },
      { name: "Bank Transfer", count: 120, percentage: 11 },
    ],
  },

  // Announcements Data
  announcements: [
    {
      id: 1,
      title: "System Maintenance",
      content:
        "There will be scheduled maintenance on June 20th from 2:00 AM to 5:00 AM.",
      date: "2023-06-10",
      status: "Active",
      priority: "High",
    },
    {
      id: 2,
      title: "New Feature Release",
      content: "We've added bulk TIN registration for enterprise users.",
      date: "2023-06-05",
      status: "Active",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Payment Gateway Update",
      content:
        "MTN Mobile Money integration has been improved for faster processing.",
      date: "2023-05-28",
      status: "Expired",
      priority: "Low",
    },
  ],

  // Resources Data
  resources: {
    documents: [
      {
        id: 1,
        title: "TIN Registration Guide",
        type: "PDF",
        category: "TIN Services",
        downloads: 1245,
        lastUpdated: "2023-05-15",
      },
      {
        id: 2,
        title: "API Integration Manual",
        type: "PDF",
        category: "Developers",
        downloads: 567,
        lastUpdated: "2023-04-30",
      },
      {
        id: 3,
        title: "Service Pricing Sheet",
        type: "Excel",
        category: "General",
        downloads: 892,
        lastUpdated: "2023-06-01",
      },
    ],
    categories: ["TIN Services", "Developers", "General", "FAQs"],
  },

  // System Data
  system: {
    status: "Operational",
    lastMaintenance: "2023-06-01T03:00:00Z",
    uptime: "99.98%",
    services: [
      {
        name: "Authentication",
        status: "Operational",
        responseTime: "120ms",
      },
      {
        name: "Payment Gateway",
        status: "Operational",
        responseTime: "210ms",
      },
      {
        name: "Database",
        status: "Operational",
        responseTime: "45ms",
      },
      {
        name: "Email Service",
        status: "Degraded",
        responseTime: "520ms",
      },
    ],
    upcomingMaintenance: [
      {
        date: "2023-06-20",
        duration: "3 hours",
        description: "Database optimization and backup system upgrade",
      },
    ],
  },

  chartColors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
};
