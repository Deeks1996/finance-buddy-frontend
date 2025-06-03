import { useEffect, useState } from 'react'; 
import { useAuth } from '@clerk/clerk-react'; // For authentication token fetching
import moment from 'moment'; // For date formatting
import { toast, Toaster } from 'react-hot-toast'; // For toast notifications

const TransactionList = () => {
  // State to hold all fetched transactions
  const [transactions, setTransactions] = useState([]);
  // State to hold filtered transactions based on user filters
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  // Loading state for fetch operation
  const [loading, setLoading] = useState(true);
  // Clerk auth hook to get the token for authenticated API requests
  const { getToken } = useAuth();

  // Filter states for user inputs
  const [filterType, setFilterType] = useState(''); // Filter by transaction type
  const [filterDescription, setFilterDescription] = useState(''); // Filter by description text
  const [filterDateFrom, setFilterDateFrom] = useState(''); // Filter by start date
  const [filterDateTo, setFilterDateTo] = useState(''); // Filter by end date

  // Function to fetch all transactions from backend API
  const fetchTransactions = async () => {
    setLoading(true); // Show loading state while fetching
    try {
      const token = await getToken(); // Get auth token for secure API request
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
      });

      if (!res.ok) throw new Error(`Failed with status ${res.status}`); // Handle non-OK response

      const data = await res.json(); // Parse JSON response
      if (Array.isArray(data)) {
        // Set transactions and initialize filtered transactions to full list
        setTransactions(data);
        setFilteredTransactions(data);
      } else {
        // Handle unexpected response format by clearing data
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
      // On error, clear transaction lists to avoid stale data display
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false); // Stop loading spinner in any case
    }
  };

  // Fetch transactions once on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Effect to filter transactions whenever filters or transactions change
  useEffect(() => {
    let filtered = [...transactions]; // Start with all transactions

    // Filter by type if selected
    if (filterType) {
      filtered = filtered.filter(
        (tx) => tx.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Filter by description text if provided (case-insensitive)
    if (filterDescription) {
      filtered = filtered.filter((tx) =>
        (tx.description || '').toLowerCase().includes(filterDescription.toLowerCase())
      );
    }

    // Filter by date range - from date
    if (filterDateFrom) {
      filtered = filtered.filter((tx) => new Date(tx.date) >= new Date(filterDateFrom));
    }

    // Filter by date range - to date
    if (filterDateTo) {
      filtered = filtered.filter((tx) => new Date(tx.date) <= new Date(filterDateTo));
    }

    // Update filtered transactions state with the filtered list
    setFilteredTransactions(filtered);
  }, [filterType, filterDescription, filterDateFrom, filterDateTo, transactions]);

  // Function to delete a transaction by ID
  const handleDelete = async (id) => {
    try {
      const token = await getToken(); // Get auth token
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`, {
        method: 'DELETE', // DELETE method to remove transaction
        headers: { Authorization: `Bearer ${token}` }, // Pass auth token
      });

      if (res.ok) {
        // Remove deleted transaction from state to update UI
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        toast.success('Deleted successfully!'); // Show success toast
      } else {
        toast.error('Failed to delete transaction'); // Show error toast on failure
      }
    } catch (error) {
      toast.error('Error deleting transaction'); // Show error toast on exception
      console.error(error);
    }
  };

  // Helper function to assign badge color classes based on transaction type
  const typeBadgeClasses = (type) => {
    switch (type.toLowerCase()) {
      case 'income':
        return 'bg-green-100 text-green-800'; // Green badge for income
      case 'expense':
        return 'bg-red-100 text-red-800'; // Red badge for expense
      case 'transfer':
        return 'bg-blue-100 text-blue-800'; // Blue badge for transfer
      default:
        return 'bg-gray-100 text-gray-800'; // Default gray badge
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-700 rounded shadow ">
      {/* Toaster container to show toast notifications */}
      <Toaster position='top-center'/>

      <h2 className="text-2xl font-semibold mb-4 sm:mb-6 text-gray-100">Transactions</h2>

      {/* Filters UI */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        {/* Filter by transaction type */}
        <div className="sm:w-40">
          <label htmlFor="filterType" className="block text-sm font-medium text-gray-200 mb-1">
            Filter by Type
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Filter by description input */}
        <div className="flex-1 min-w-[180px]">
          <label htmlFor="filterDescription" className="block text-sm font-medium text-gray-200 mb-1">
            Filter by Description
          </label>
          <input
            type="text"
            id="filterDescription"
            value={filterDescription}
            onChange={(e) => setFilterDescription(e.target.value)}
            placeholder="Search description..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter by date from */}
        <div className="sm:w-40">
          <label htmlFor="filterDateFrom" className="block text-sm font-medium text-gray-200 mb-1">
            Date From
          </label>
          <input
            type="date"
            id="filterDateFrom"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter by date to */}
        <div className="sm:w-40">
          <label htmlFor="filterDateTo" className="block text-sm font-medium text-gray-200 mb-1">
            Date To
          </label>
          <input
            type="date"
            id="filterDateTo"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table wrapper with horizontal scroll on smaller screens */}
      <div className="overflow-x-auto">
        {loading ? (
          // Show loading message when fetching
          <p className="text-gray-300">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          // Show message if no transactions match filters
          <p className="text-gray-300">No transactions found.</p>
        ) : (
          // Transactions table
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-blue-900">
              <tr>
                {/* Table headers */}
                <th className="py-3 px-4 sm:px-6 border-b border-gray-300 text-left text-sm font-semibold text-white">
                  Description
                </th>
                <th className="py-3 px-4 sm:px-6 border-b border-gray-300 text-left text-sm font-semibold text-white">
                  Amount
                </th>
                <th className="py-3 px-4 sm:px-6 border-b border-gray-300 text-left text-sm font-semibold text-white">
                  Date
                </th>
                <th className="py-3 px-4 sm:px-6 border-b border-gray-300 text-left text-sm font-semibold text-white">
                  Type
                </th>
                <th className="py-3 px-4 sm:px-6 border-b border-gray-300 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="hover:bg-gray-600 transition-colors duration-200 cursor-pointer bg-slate-900"
                >
                  {/* Description column */}
                  <td className="py-3 px-4 sm:px-6 border-b border-gray-300 whitespace-normal max-w-xs break-words text-gray-200">
                    {tx.description || '-'}
                  </td>

                  {/* Amount column with color and sign based on type */}
                  <td
                    className={`py-3 px-4 sm:px-6 border-b border-gray-300 font-semibold ${
                      tx.type.toLowerCase() === 'expense'
                        ? 'text-red-600'
                        : tx.type.toLowerCase() === 'income'
                        ? 'text-green-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {/* Show '-' for expense and '+' for income */}
                    {tx.type.toLowerCase() === 'expense'
                      ? '-'
                      : tx.type.toLowerCase() === 'income'
                      ? '+'
                      : ''}
                    {
                      // Format amount as Indian Rupees currency with 2 decimals
                      new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 2,
                      }).format(Math.abs(tx.amount))
                    }
                  </td>

                  {/* Date column formatted */}
                  <td className="py-3 px-4 sm:px-6 border-b border-gray-300 text-gray-300">
                    {moment(tx.date).format('MMM D, YYYY')}
                  </td>

                  {/* Type column with colored badge */}
                  <td className="py-3 px-4 sm:px-6 border-b border-gray-300">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeBadgeClasses(
                        tx.type
                      )}`}
                    >
                      {/* Capitalize first letter */}
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>

                  {/* Actions column with Delete button */}
                  <td className="py-3 px-4 sm:px-6 border-b border-gray-300 text-center">
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="text-red-600 hover:text-red-800 font-semibold transition"
                      aria-label={`Delete transaction ${tx.description}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
