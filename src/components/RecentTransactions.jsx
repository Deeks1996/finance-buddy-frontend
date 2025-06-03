import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

function groupTransactionsByDay(transactions) {
  return transactions.reduce((groups, tx) => {
    // Format the date to a readable day string in Indian locale and timezone
    const day = new Date(tx.date).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',    // Indian timezone for consistency
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!groups[day]) groups[day] = [];

    groups[day].push(tx);

    return groups;
  }, {}); // Start with empty object
}

// Main component that displays recent transactions grouped by day

export default function RecentTransactions({ transactions }) {
  // Group transactions by day using the helper function
  const groupedTransactions = groupTransactionsByDay(transactions);

  return (
    <section className="mx-auto">
      {/* Check if there are any transactions */}
      {Object.keys(groupedTransactions).length === 0 ? (
        // Show message if no transactions available
        <p className="text-gray-400">No transactions available.</p>
      ) : (
        // Iterate over each day and its transactions
        Object.entries(groupedTransactions).map(([day, txs]) => (
          <div
            key={day}
            className="mb-8 bg-gray-900 p-3 rounded-2xl border"
          >
            {/* Day heading */}
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              {day}
            </h3>

            {/* List of transactions for the day */}
            <ul className="space-y-3">
              {txs.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between items-center p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition"
                >
                  {/* Left: formatted time of transaction */}
                  <div>
                    <p className="text-sm text-gray-300">
                      {new Date(tx.date).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',  // Ensure consistent timezone
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,               // 12-hour format with AM/PM
                      })}
                    </p>
                  </div>

                  {/* Right: amount with icon indicating income or expense */}
                  <div
                    className={`flex items-center font-bold ${
                      tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {/* Up arrow for income, down arrow for expense */}
                    {tx.type === 'income' ? (
                      <FaArrowUp className="mr-1" />
                    ) : (
                      <FaArrowDown className="mr-1" />
                    )}
                    {/* Display amount with 2 decimal places */}
                    ${tx.amount.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
