import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#AA336A'];

// Custom label inside the ring
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.03) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Tooltip customization
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white p-2 rounded shadow-md text-sm text-gray-800 border border-gray-200">
        <p className="font-semibold">{name}</p>
        <p>Amount: ₹{value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const ExpensesPieChart = ({ pieData }) => (
  <div className="chart-card w-full max-w-md mx-auto">
    <h3 className="chart-title text-lg font-semibold mb-4 text-center animate-fadeUp">
      Expenses by Category
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}     // <-- Ring (Doughnut) effect
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
          isAnimationActive
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ExpensesPieChart;
