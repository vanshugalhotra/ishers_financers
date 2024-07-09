"use client";

import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const Modal = ({
  showModal,
  setShowModal,
  onConfirm,
  type,
  selectedLoanID,
}) => {
  const [amount, setAmount] = React.useState("");

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Enter Amount (₹)</h2>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          {type === "green" && (
            <button
              className="flex-1 flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              onClick={() => {
                onConfirm(amount, selectedLoanID);
                setAmount("");
              }}
            >
              <FaPlus className="mr-2" />
              Increase Loan
            </button>
          )}
          {type === "red" && (
            <button
              className="flex-1 flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              onClick={() => {
                onConfirm(amount, selectedLoanID);
                setAmount("");
              }}
            >
              <FaMinus className="mr-2" />
              Pay Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
