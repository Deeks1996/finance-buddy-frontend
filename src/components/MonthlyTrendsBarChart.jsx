import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer,
} from 'recharts';

// Custom tooltip component for the bar chart
// Shows the month label and a list of bars with their names and formatted values
const CustomBarTooltip = ({ active, payload, label }) => {
  // Render tooltip only when active and there is data to show
  if (active && payload && payload.length) {
    return (
      <div className="tooltip tooltip-bar">
        {/* Display the label, e.g. the month */}
        <p className="tooltip-title">{label}</p>
        {/* Map over all data entries in the tooltip and display their name and value */}
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {/* Format value as Indian currency */}
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null; // Return nothing if tooltip inactive or no data
};

// Main Bar Chart component
// Receives barData: array of objects representing monthly income and expenses
const MonthlyTrendsBarChart = ({ barData }) => (
  <div className="chart-card">
    <h3 className="chart-title animate-fadeUp">Monthly Trends</h3>
    {/* Responsive container to make chart adapt to container size */}
    <ResponsiveContainer width="100%" height={300}>
      {/* BarChart component with margins to provide spacing */}
      <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
        {/* Define gradients for bars to have smooth color fades */}
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            {/* Gradient starts with strong color, fades to transparent */}
            <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF8042" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Background grid with dashed lines */}
        <CartesianGrid strokeDasharray="3 3" />

        {/* X axis showing months */}
        <XAxis dataKey="month" />

        {/* Y axis automatically scaling */}
        <YAxis />

        {/* Tooltip on hover with custom content */}
        <Tooltip content={<CustomBarTooltip />} />

        {/* Legend showing bar labels and colors */}
        <Legend />

        {/* Bar for Income data */}
        <Bar
          dataKey="income"         // Key in barData for income values
          name="Income"            // Display name in legend and tooltip
          fill="url(#colorIncome)" // Fill with gradient defined earlier
          radius={[6, 6, 0, 0]}    // Rounded top corners for bars
          className="bar-income"   // CSS class for additional styling
          isAnimationActive        // Enable animation
          animationDuration={1200} // Animation duration in milliseconds
          animationEasing="ease-out" // Animation easing function
        />

        {/* Bar for Expense data, similarly styled */}
        <Bar
          dataKey="expense"
          name="Expense"
          fill="url(#colorExpense)"
          radius={[6, 6, 0, 0]}
          className="bar-expense"
          isAnimationActive
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default MonthlyTrendsBarChart;
