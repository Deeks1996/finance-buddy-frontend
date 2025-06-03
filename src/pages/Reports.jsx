import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Toaster, toast } from 'react-hot-toast';
import { utils, writeFile } from 'xlsx'; // For CSV download
import jsPDF from 'jspdf'; // For PDF generation
import autoTable from 'jspdf-autotable'; // For table layout in PDF
import moment from 'moment'; // For date formatting

const Reports = () => {
  const [transactions, setTransactions] = useState([]); // Stores all transactions
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const itemsPerPage = 10; // Number of items per page
  const { getToken } = useAuth(); // Get auth token from Clerk

  // Fetch transaction data from backend
  const fetchTransactions = async () => {
    try {
      const token = await getToken(); // Get token from Clerk
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const data = await res.json();
      setTransactions(data); // Set fetched transactions
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
      toast.error('Failed to load reports'); // Show error toast
    }
  };

  // Call fetch on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Download data as CSV file
  const downloadCSV = () => {
    const csvData = transactions.map(tx => ({
      UserID: tx.userId || 'N/A',
      Type: tx.type,
      Amount: tx.amount,
      Description: tx.description || '-',
      Date: moment(tx.date).format('YYYY-MM-DD'),
    }));

    const ws = utils.json_to_sheet(csvData); // Convert to worksheet
    const wb = utils.book_new(); // Create workbook
    utils.book_append_sheet(wb, ws, 'Transactions');
    writeFile(wb, 'transactions_report.csv'); // Save CSV file
  };

  // Download data as PDF file
  const downloadPDF = () => {
    const doc = new jsPDF();
    const userId = transactions.length > 0 ? transactions[0].userId || 'N/A' : 'N/A';

    // Add header text
    doc.setFontSize(16);
    doc.text('Finance Buddy – Transaction Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`User ID: ${userId}`, 14, 30);

    // Add table using autoTable
    autoTable(doc, {
      startY: 40,
      head: [['Type', 'Amount', 'Description', 'Date']],
      body: transactions.map(tx => [
        tx.type || '-',
        typeof tx.amount === 'number'
          ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)
          : '₹0.00',
        tx.description || '-',
        tx.date ? moment(tx.date).format('DD-MM-YYYY') : '-',
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] }, // Bootstrap blue
    });

    doc.save('transactions_report.pdf'); // Save PDF file
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Change page
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 bg-gray-800 shadow text-white min-h-screen">
      {/* Toast Notification Container */}
      <Toaster position="top-center" />

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Transaction Reports</h2>

      {/* Download buttons */}
      <div className="flex gap-4 mb-6">
        <button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
          Download CSV
        </button>
        <button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          Download PDF
        </button>
      </div>

      {/* No Data Found Message */}
      {transactions.length === 0 ? (
        <p className="text-center text-gray-300">No reports found.</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-white">
              <thead className="bg-blue-900">
                <tr>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((tx) => (
                  <tr key={tx._id} className="bg-slate-900">
                    <td className="px-4 py-2 border capitalize">{tx.type}</td>
                    <td className="px-4 py-2 border">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(tx.amount)}
                    </td>
                    <td className="px-4 py-2 border">{tx.description || '-'}</td>
                    <td className="px-4 py-2 border">{moment(tx.date).format('DD-MM-YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => goToPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
