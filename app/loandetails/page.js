"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchData, postData } from "@/utils/dbFuncs";
import { raiseToast, formatDate } from "@/utils/utilityFuncs";
import Image from "next/image";
import { FaPlus, FaMinus, FaRegUser } from "react-icons/fa";
import Modal from "@/components/Modal/Modal";

const LoanDetails = () => {
  const searchParams = useSearchParams();
  const [loandetails, setLoandetails] = useState({});
  const [clientdetails, setClientdetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedLoanID, setSelectedLoanID] = useState("");

  const { marginForSidebar } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const api = `/api/loan/getloandetails?_id=${searchParams.get("_id")}`;
        const loan = await fetchData(api);
        setLoandetails(loan.loan);
      } catch (error) {
        console.error("Error fetching client details:", error);
        // Handle error if needed
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
      {
        title: "Client Signature",
        src: clientdetails.signaturePhoto.url,
      },
      {
        title: "Aadhar Image",
        src: clientdetails.aadharPhoto.url,
      },
      {
        title: "PAN Image",
        src: clientdetails.panPhoto.url,
      },
      {
        title: "Cheque or Passbook Photo",
        src: clientdetails.chequeOrPassbookPhoto.url,
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
        // Handle invalid amount input
        raiseToast("error", "Please enter a valid positive number for amount.");
        return;
      }

      // 1. Fetch current loan details
      const fetchApi = `/api/loan/getloandetails/?_id=${_id}`;
      const response = await fetchData(fetchApi);
      const currentLoan = response.loan;

      // 2. Calculate updated amount based on type
      let updatedAmount = 0;
      if (modalType === "green") {
        updatedAmount = currentLoan.amount + amountValue;
      } else if (modalType === "red") {
        updatedAmount = currentLoan.amount - amountValue;
      }

      // 3. Prepare data for update
      const updateData = {
        _id: currentLoan._id,
        amount: updatedAmount,
      };

      // 4. Send update request to API
      const updateApi = `/api/loan/updateloan/?_id=${_id}`;
      const updateResponse = await postData("PATCH", updateData, updateApi);

      if (updateResponse.success) {
        // Handle success scenario
        raiseToast("success", "Loan updated successfully");
        // Optionally, update local state or reload data if necessary
      } else {
        // Handle failure scenario
        raiseToast("error", "Failed to update loan");
      }
    } catch (error) {
      console.error("Error updating loan:", error);
      raiseToast("error", "Failed to update loan");
      // Handle error scenario
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
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
            <ul className="w-full border-b">
              {loanFields.map(({ title, value }, index) => (
                <li
                  className={`product-details-item ${
                    index % 2 === 1 ? "bg-gray-100" : ""
                  }`}
                  key={index}
                >
                  <h4 className="product-details-title">{title}</h4>
                  <h6 className="product-details-value">{value}</h6>
                </li>
              ))}
            </ul>
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
