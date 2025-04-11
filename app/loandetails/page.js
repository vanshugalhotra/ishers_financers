"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchData, postData } from "@/utils/dbFuncs";
import { raiseToast, formatDate } from "@/utils/utilityFuncs";
import Image from "next/image";
import { FaPlus, FaMinus, FaRegUser } from "react-icons/fa";
import Modal from "@/components/Modal/Modal";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";

const LoanDetails = () => {
  const searchParams = useSearchParams();
  const [loandetails, setLoandetails] = useState({});
  const [clientdetails, setClientdetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedLoanID, setSelectedLoanID] = useState("");

  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions
  const router = useRouter();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      startLoading();
      try {
        const loanID = searchParams.get("_id");
        if (!loanID) {
          raiseToast("error", "Loan not found!");
          router.push("/loans"); // fallback route
          return;
        }

        const api = `/api/loan/getloandetails?_id=${loanID}`;
        const loan = await fetchData(api);
        setLoandetails(loan.loan);
      } catch (error) {
        console.error("Error fetching client details:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchLoanDetails(); // Invoke the async function to fetch data
  }, [searchParams]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientId = loandetails.client;
        const api = `/api/client/getsingleclient?_id=${clientId}`;
        const response = await fetchData(api);
        if (!response.success) {
          return;
        }
        setClientdetails(response.client);
      } catch (error) {
        console.error("Error fetching client detail:", error);
        raiseToast("error", "Failed to fetch client detail");
        return;
      }
    };

    fetchClientDetails();
  }, [loandetails.client]);

  const loanFields = [
    {
      title: "Client Name",
      value: clientdetails.name,
    },
    {
      title: "Loan Number",
      value: loandetails.loanNo,
    },
    {
      title: "Duration (Years)",
      value: `${loandetails.duration} Years`,
    },
    {
      title: "Interest (% P.A)",
      value: `${loandetails.interest} %`,
    },
    {
      title: "Amount (₹)",
      value: `₹ ${loandetails.amount}`,
    },
    {
      title: "Type",
      value: loandetails.type,
    },
    {
      title: "Start Date",
      value: formatDate(loandetails.startDate),
    },
  ];

  let clientImages = [];

  if (clientdetails.image) {
    clientImages = [
      {
        title: "Client Image",
        src: clientdetails.image.url,
      },
    ];
  }

  const handleButtonClick = (type, _id) => {
    setShowModal(true);
    setModalType(type);
    setSelectedLoanID(loandetails._id);
  };

  const onConfirm = async (amount, _id) => {
    try {
      setShowModal(false); // Close the modal first

      // Convert amount to a number (assuming amount is a string)
      const amountValue = parseFloat(amount);

      if (isNaN(amountValue) || amountValue <= 0) {
        raiseToast("error", "Please enter a valid positive number for amount.");
        return;
      }

      // 1. Fetch current loan details
      const fetchApi = `/api/loan/getloandetails/?_id=${_id}`;
      const response = await fetchData(fetchApi);
      const currentLoan = response.loan;

      // 2. Calculate updated amount based on type
      let updatedAmount = 0;
      let transactionType = "";
      if (modalType === "green") {
        updatedAmount = currentLoan.amount + amountValue;
        transactionType = "increase";
      } else if (modalType === "red") {
        updatedAmount = currentLoan.amount - amountValue;
        transactionType = "repayment";
      }

      // 3. Prepare data for update
      const ledgerEntry = {
        amount: amountValue,
        type: transactionType,
      };

      const updateData = {
        _id: currentLoan._id,
        amount: updatedAmount,
        $push: { ledger: ledgerEntry },
      };

      // 4. Send update request to API
      const updateApi = `/api/loan/updateloan/?_id=${_id}`;
      const updateResponse = await postData("PATCH", updateData, updateApi);

      if (updateResponse.success) {
        raiseToast("success", "Loan updated successfully");
      } else {
        raiseToast("error", "Failed to update loan");
      }
    } catch (error) {
      console.error("Error updating loan:", error);
      raiseToast("error", "Failed to update loan");
    } finally {
      router.refresh();
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Amount", "Type"];
    const rows = loandetails.ledger.map((entry) => [
      formatDate(entry.date), // Assuming formatDate formats the date
      entry.amount,
      entry.type,
    ]);

    // Convert array to CSV string
    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ledger.csv");
    document.body.appendChild(link); // Required for Firefox

    link.click(); // Trigger download

    document.body.removeChild(link); // Cleanup
  };

  const savePaid = async () => {
    try {
      // Make the API call to save the 'paid' status
      const updateData = {
        _id: loandetails._id,
        paid: loandetails.paid,
      };
      const updateApi = `/api/loan/updateloan/?_id=${loandetails._id}`;
      const updateResponse = await postData("PATCH", updateData, updateApi);

      if (updateResponse.success) {
        raiseToast("success", "Paid status updated successfully");
      } else {
        raiseToast("error", "Failed to update paid status");
      }
    } catch (error) {
      console.error("Error updating paid status:", error);
      raiseToast("error", "Failed to update paid status");
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Loan Details
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">
            Full Details of Loan
          </p>
        </div>
      </div>
      <div className="my-8 brands-card rounded-lg border border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="product-details outline-none py-8 px-6 border-none flex md:flex-row flex-col">
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loanFields.map(({ title, value }, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                  <h4 className="text-sm font-medium text-gray-600">{title}</h4>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="actions my-10 mx-4 lg:px-10 lg:my-20 lg:mx-20">
              <div className="flex space-x-2 flex-col md:flex-row space-y-3 md:space-y-0">
                <button
                  className="flex-1 flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  onClick={() => handleButtonClick("green")}
                >
                  <FaPlus className="mr-2" />
                  Increase Loan
                </button>
                <button
                  className="flex-1 flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                  onClick={() => handleButtonClick("red")}
                >
                  <FaMinus className="mr-2" />
                  Pay Back
                </button>
                <button
                  className="flex-1 flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  onClick={() => {
                    router.push(`/clientdetails?_id=${loandetails.client}`);
                  }}
                >
                  <FaRegUser className="mr-2" />
                  View Client Details
                </button>
              </div>
              <div className="flex items-center justify-center my-7">
                <input
                  type="checkbox"
                  id="paidCheckbox"
                  checked={loandetails.paid} // Set the initial state based on loandetails.paid
                  onChange={(e) =>
                    setLoandetails({ ...loandetails, paid: e.target.checked })
                  }
                  className="w-6 h-6 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-400 focus:ring-opacity-75"
                />
                <label
                  htmlFor="paidCheckbox"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Installment Paid
                </label>
                <button
                  className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  onClick={savePaid}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="ledger-section mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Ledger</h3>
                <button
                  onClick={exportToCSV}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Export
                </button>
              </div>

              {loandetails.ledger && loandetails.ledger.length > 0 ? (
                <table className="w-full mt-4 border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-4 text-left text-sm text-gray-600">
                        Date
                      </th>
                      <th className="py-2 px-4 text-left text-sm text-gray-600">
                        Amount
                      </th>
                      <th className="py-2 px-4 text-left text-sm text-gray-600">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loandetails.ledger.map((entry, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 ${
                          entry.type === "repayment"
                            ? "bg-green-100" // Green background for repayment
                            : "bg-red-100" // Red background for increase
                        }`}
                      >
                        <td className="py-2 px-4 text-sm">
                          {formatDate(entry.date)}
                        </td>
                        <td className="py-2 px-4 text-sm">₹ {entry.amount}</td>
                        <td className="py-2 px-4 text-sm capitalize">
                          {entry.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-600 mt-2">
                  No ledger entries available.
                </p>
              )}
            </div>
          </div>

          <div className="product-image-container relative md:w-1/3 mx-4 flex flex-col justify-start rounded-lg border border-gray-200 border-opacity-70 shadow-sm cursor-pointer max-h-screen overflow-y-auto">
            {clientImages.map((image, index) => (
              <div key={index} className="product-image mx-2 my-4">
                <h3 className="text-center mb-2">{image.title}</h3>
                <Image
                  src={image.src}
                  alt={`${image.title}`}
                  width={400}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        type={modalType}
        onConfirm={onConfirm}
        selectedLoanID={selectedLoanID}
      />
    </section>
  );
};

export default LoanDetails;
