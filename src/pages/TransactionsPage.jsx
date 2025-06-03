// Import necessary dependencies and components
import React, { useState } from 'react'; // React and useState hook
import Modal from '../components/Modal.jsx'; // Custom modal component
import AddTransaction from '../components/AddTransaction.jsx'; // Form to add a new transaction
import TransactionList from '../components/TransactionList.jsx'; // Component to display list of transactions

export default function TransactionsPage() {
  // State to control visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State used to trigger re-render of TransactionList when a new transaction is added
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <div className="p-8 min-h-screen max-w-7xl mx-auto bg-slate-800 backdrop-blur-md shadow-md">
      {/* Show the "+ Add Transaction" button only when modal is not open */}
      {!isModalOpen && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)} // Open modal on click
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow"
          >
            + Add Transaction
          </button>
        </div>
      )}

      {/* Modal containing the AddTransaction form, shown when modal is open */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}> {/* Pass a function to close modal */}
          <AddTransaction
            onTransactionAdded={() => {
              setRefreshFlag((f) => !f); // Toggle flag to refresh TransactionList
              setIsModalOpen(false);     // Close the modal after adding a transaction
            }}
          />
        </Modal>
      )}

      {/* Display the transaction list. Passing refreshFlag as key forces re-render on change */}
      <TransactionList key={refreshFlag} />
    </div>
  );
}
