"use client";
import React, { useState, useEffect } from "react";
import { fetchData } from "@/utils/dbFuncs"; // Adjust the import based on your project structure

const TotalAmountCard = () => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const api = "/api/loan/gettotalamount"; // Adjust the API endpoint as needed
        const result = await fetchData(api);
        if (result.success) {
          setTotalAmount(result.totalAmount);
        }
      } catch (error) {
        console.error("Error fetching total amount:", error);
      }
    };

    fetchTotalAmount();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Amount Lent</h2>
      <p className="text-4xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</p>
      <p className="text-gray-600 mt-2">This is the total amount of all loans you have lent.</p>
    </div>
  );
};

export default TotalAmountCard;
