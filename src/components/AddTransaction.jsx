import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

export default function AddTransaction({ onTransactionAdded }) {
  // Get the auth token function from Clerk hook
  const { getToken } = useAuth();

  // State variables for transaction fields and UI state
  const [type, setType] = useState('income'); // income or expense
  const [amount, setAmount] = useState(''); // transaction amount as string input
  const [description, setDescription] = useState(''); // optional description text
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // default to today in yyyy-mm-dd format
  const [loading, setLoading] = useState(false); // tracks loading state for submit button
  const [error, setError] = useState(''); // error message to show on failure

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submit behavior
    setLoading(true); // show loading state
    setError(''); // clear previous errors

    try {
      if (!getToken) throw new Error('getToken function not available yet');

      // Get auth token for authorization header
      const token = await getToken();

      if (!token) throw new Error('No token received');

      // Get current date/time in Asia/Kolkata timezone formatted as ISO string
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      // Format parts of the date/time
      const parts = formatter.formatToParts(now);
      const dateParts = {};
      parts.forEach(({ type, value }) => {
        dateParts[type] = value;
      });

      // Construct date string in ISO format: yyyy-mm-ddThh:mm:ss
      const dateTimeString = `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
      const dateTime = new Date(dateTimeString);

      // Convert to ISO string for backend
      const dateToSend = dateTime.toISOString();

      // POST request to backend API to add transaction
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in header for auth
        },
        body: JSON.stringify({
          type,
          amount: Number(amount), // convert amount string to number
          description,
          date: dateToSend,
        }),
      });

      // If response not ok, throw error with message from response if available
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add transaction');
      }

      // Get the new transaction data from response
      const newTransaction = await res.json();

      // Notify parent component about the new transaction
      onTransactionAdded(newTransaction);

      // Reset form inputs to default values
      setAmount('');
      setDescription('');
      setType('income');
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      // If any error occurs, set error message to display
      setError(err.message);
    } finally {
      // Turn off loading state after try/catch
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Add Transaction</h3>

      {/* Transaction Type Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            type === 'income'
              ? 'border-green-400 focus:ring-green-500'
              : 'border-red-400 focus:ring-red-500'
          }`}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0.01"
          step="0.01"
          placeholder="0.00"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g. Salary, Groceries, etc."
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading} // disable button while loading
        className={`w-full py-2 rounded-md text-white font-semibold ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors duration-200`}
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </form>
  );
}
