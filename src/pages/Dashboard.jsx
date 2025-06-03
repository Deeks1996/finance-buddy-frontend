// Importing necessary libraries and components
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { useAuth } from '@clerk/clerk-react';
import moment from 'moment';
import { FaArrowDown, FaArrowUp, FaEquals } from 'react-icons/fa';
import RecentTransactions from '../components/RecentTransactions.jsx';
import StatsCard from '../components/StatsCard.jsx';

// Define color scheme for pie chart slices
const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#AA336A'];

// Custom label renderer for pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Hide label if too small
  if (percent < 0.03) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ pointerEvents: 'none' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border rounded shadow text-black">
        <p className="font-bold">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="p-2 bg-white border rounded shadow text-black">
        <p className="font-bold">{name}</p>
        <p>Amount: ₹{value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  // State for transaction data and active pie chart index
  const [transactions, setTransactions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const { getToken } = useAuth(); // Clerk token for authentication

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err.message);
    }
  };

  // Fetch on mount and every 10 seconds
  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  // Compute totals
  const income = transactions
    .filter((tx) => tx.type.toLowerCase() === 'income')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const expense = transactions
    .filter((tx) => tx.type.toLowerCase() === 'expense')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const balance = income - expense;

  // Prepare data for pie chart (expense by category)
  const categoryData = transactions
    .filter((tx) => tx.type.toLowerCase() === 'expense')
    .reduce((acc, curr) => {
      const key = curr.description || 'Uncategorized';
      acc[key] = (acc[key] || 0) + Math.abs(curr.amount);
      return acc;
    }, {});

  const pieData = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key],
  }));

  // Prepare data for bar chart (monthly trends)
  const monthlyMap = transactions.reduce((acc, tx) => {
    const month = moment(tx.date).format('MMM YYYY');
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    const type = tx.type.toLowerCase();
    if (type === 'income') acc[month].income += Math.abs(tx.amount);
    if (type === 'expense') acc[month].expense += Math.abs(tx.amount);
    return acc;
  }, {});

  const barData = Object.entries(monthlyMap).map(([month, values]) => ({
    month,
    ...values,
  }));

  // Stats card data
  const stats = [
    {
      title: 'Total Income',
      value: income,
      icon: <FaArrowUp size={24} className="text-green-600" />,
      cardClass: 'hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out cursor-pointer',
    },
    {
      title: 'Total Expense',
      value: expense,
      icon: <FaArrowDown size={24} className="text-red-600" />,
      cardClass: 'hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out cursor-pointer',
    },
    {
      title: 'Balance',
      value: balance,
      icon: <FaEquals size={24} className="text-blue-600" />,
      cardClass: 'hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out cursor-pointer',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white p-4 md:p-6 space-y-6 animate-fadeIn">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ title, value, icon, cardClass, iconClass }) => (
          <StatsCard
            key={title}
            title={title}
            value={value}
            icon={icon}
            cardClass={cardClass}
            iconClass={iconClass}
          />
        ))}
      </div>

      {/* Transactions and Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[400px] md:h-[900px]">
        {/* Recent Transactions */}
        <div className="bg-gray-800 rounded-lg shadow p-4 flex flex-col overflow-auto">
          <h3 className="text-lg font-semibold mb-3 text-white">Recent Transactions</h3>
          <RecentTransactions
            transactions={transactions}
            rowClassName="hover:bg-gray-700 cursor-pointer transition-colors duration-300"
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
             <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}  
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                isAnimationActive={true}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    cursor="pointer"
                    style={{
                      transition: 'transform 0.3s',
                      transform: index === activeIndex ? 'scale(1.1)' : 'scale(1)',
                      transformOrigin: 'center',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends Bar Chart */}
      <div className="bg-gray-800 p-4 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {/* Gradient fill for bars */}
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF8042" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend />

            {/* Income Bar */}
            <Bar
              dataKey="income"
              name="Income"
              fill="url(#colorIncome)"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              onMouseEnter={(e) => e.target.style.filter = 'drop-shadow(0 0 6px #00C49F)'}
              onMouseLeave={(e) => e.target.style.filter = 'none'}
            />

            {/* Expense Bar */}
            <Bar
              dataKey="expense"
              name="Expense"
              fill="url(#colorExpense)"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              onMouseEnter={(e) => e.target.style.filter = 'drop-shadow(0 0 6px #FF8042)'}
              onMouseLeave={(e) => e.target.style.filter = 'none'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
