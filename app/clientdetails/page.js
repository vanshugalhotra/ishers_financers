"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { useSearchParams } from "next/navigation";
import { fetchData, postData } from "@/utils/dbFuncs";
import { formatDate, raiseToast } from "@/utils/utilityFuncs";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/navigation";
import CustomLink from "@/components/Others/CustomLink";

import Modal from "@/components/Modal/Modal";
import { FaPlus, FaMinus } from "react-icons/fa";
const ClientDetails = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  const searchParams = useSearchParams();
  const [clientdetails, setClientdetails] = useState({});
  const [loandetails, setLoandetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedLoanID, setSelectedLoanID] = useState("");
  const [clientNotes, setClientNotes] = useState("");

  const router = useRouter();

  const clientID = searchParams.get("_id");

  useEffect(() => {
    const fetchClientDetails = async () => {
      startLoading();
      try {
        const api = `/api/client/getsingleclient?_id=${clientID}`;
        const client = await fetchData(api);
        setClientdetails(client.client); // Set state with fetched data
        setClientNotes(client.client.note);
      } catch (error) {
        console.error("Error fetching client details:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchClientDetails(); // Invoke the async function to fetch data
  }, [searchParams]);

  useEffect(() => {
    if (!clientdetails.loans) return; // Ensure loans exist before fetching details

    const fetchLoanDetails = async () => {
      try {
        const loanDetailsPromises = clientdetails.loans.map(async (loanId) => {
          const api = `/api/loan/getloandetails/?_id=${loanId}`;
          const loan = await fetchData(api);
          return loan;
        });

        const loanDetails = await Promise.all(loanDetailsPromises);
        setLoandetails(loanDetails);
      } catch (error) {
        console.error("Error fetching loan details:", error);
        // Handle error if needed
      }
    };

    fetchLoanDetails();
  }, [clientdetails.loans]);

  const clientFields = [
    {
      title: "Client Name",
      value: clientdetails.name,
    },
    {
      title: "Phone Number",
      value: clientdetails.phone,
    },
    {
      title: "Aadhar Number",
      value: clientdetails.aadharNumber,
    },
    {
      title: "Pan Number",
      value: clientdetails.panNumber,
    },
    {
      title: "ATM",
      value: clientdetails.atm,
    },
    {
      title: "Insurance",
      value: clientdetails.insurance,
    },
    {
      title: "Bank Name",
      value: clientdetails.bankName,
    },
    {
      title: "Bank Branch",
      value: clientdetails.bankBranch,
    },
    {
      title: "Bank Account",
      value: clientdetails.bankAccount,
    },
    {
      title: "Previous Salary",
      value: `₹${clientdetails.previousSalary}`,
    },
    {
      title: "Salary",
      value: `₹${clientdetails.salary}`,
    },
    {
      title: "Drive URL",
      value: clientdetails.driveURL ? clientdetails.driveURL : "",
      isLink: true,
    },
    {
      title: "Date Of Birth",
      value: formatDate(clientdetails.dob),
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
    ];
  }
  const handleButtonClick = (type, _id) => {
    setShowModal(true);
    setModalType(type);
    setSelectedLoanID(_id);
  };

  const onConfirm = async (amount, _id) => {
    startLoading();
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
      let ledgerEntryType = "";

      if (modalType === "green") {
        updatedAmount = currentLoan.amount + amountValue;
        ledgerEntryType = "increase"; // Set ledger type to "increase"
      } else if (modalType === "red") {
        updatedAmount = currentLoan.amount - amountValue;
        ledgerEntryType = "repayment"; // Set ledger type to "repayment"
      }

      // 3. Prepare ledger entry
      const newLedgerEntry = {
        date: new Date(),
        amount: amountValue,
        type: ledgerEntryType,
      };

      // 4. Prepare data for update (including the new ledger entry)
      const updateData = {
        _id: currentLoan._id,
        amount: updatedAmount,
        ledger: [...currentLoan.ledger, newLedgerEntry], // Add new ledger entry to existing ledger
      };

      // 5. Send update request to API
      const updateApi = `/api/loan/updateloan/?_id=${_id}`;
      const updateResponse = await postData("PATCH", updateData, updateApi);

      if (updateResponse.success) {
        // Handle success scenario
        raiseToast("success", "Loan updated successfully");
        router.refresh();
      } else {
        // Handle failure scenario
        raiseToast("error", "Failed to update loan");
      }
    } catch (error) {
      console.error("Error updating loan:", error);
      raiseToast("error", "Failed to update loan");
    } finally {
      stopLoading();
      router.refresh();
    }
  };

  const handleSaveNotes = async () => {
    try {
      const data = { _id: clientID, note: clientNotes };
      const api = "/api/client/updateclient";
      const response = await postData("PATCH", data, api);

      if (response.success) {
        raiseToast("success", "Notes saved successfully!");
      } else {
        raiseToast("error", "Error saving notes");
      }
    } catch (error) {
      console.error("Error saving client notes:", error);
      raiseToast("error", "Error saving notes");
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Client Details
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">
            Full Details of Client
          </p>
        </div>
      </div>
      <div className="my-8 brands-card rounded-lg border border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="product-details outline-none py-8 px-6 border-none flex md:flex-row flex-col">
          <div>
            <div className="top">
              <ul className="md:w-2/3 border-b">
                {clientFields.map(({ title, value, isLink }, index) => (
                  <li
                    className={`product-details-item ${
                      index % 2 === 1 ? "bg-gray-100" : ""
                    }`}
                    key={index}
                  >
                    <h4 className="product-details-title">{title}</h4>
                    <h6 className="product-details-value">
                      {isLink ? (
                        <CustomLink href={value}>{value}</CustomLink>
                      ) : (
                        value
                      )}
                    </h6>
                  </li>
                ))}
              </ul>
              <div className="notes-section mt-8 p-4 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Client Notes
                </h3>
                <textarea
                  className="w-full h-56 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write notes about the client here..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                ></textarea>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </button>
              </div>
            </div>

            <div className="px-4 my-10">
              <div className="text-2xl font-bold py-5 text-center text-gray-800 dark:text-gray-200">
                Client&#39;s Loans
              </div>

              <div className="relative overflow-x-auto">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="table-heading">
                          Sr No.
                        </th>
                        <th scope="col" className="table-heading">
                          Loan Number
                        </th>
                        <th scope="col" className="table-heading">
                          Amount
                        </th>
                        <th scope="col" className="table-heading">
                          Duration
                        </th>
                        <th scope="col" className="table-heading">
                          Interest
                        </th>
                        <th scope="col" className="table-heading">
                          Start Date
                        </th>
                        <th scope="col" className="table-heading">
                          Type
                        </th>
                        <th scope="col" className="table-heading">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loandetails.length > 0 &&
                        loandetails.map((loanWrapper, index) => {
                          const { loan } = loanWrapper;
                          const {
                            _id,
                            loanNo,
                            type,
                            amount,
                            interest,
                            startDate,
                            duration,
                          } = loan;
                          return (
                            <tr
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                              key={_id}
                            >
                              <td className="table-data text-gray-900 font-semibold">
                                {index + 1}.)
                              </td>
                              <td className="table-data">{loanNo}</td>
                              <td className="table-data">{`₹ ${amount}`}</td>
                              <td className="table-data">{duration}</td>
                              <td className="table-data">{interest}</td>
                              <td className="table-data">
                                {formatDate(startDate)}
                              </td>
                              <td className="table-data">{type}</td>
                              <td className="table-data">
                                <div className="flex space-x-2 w-full">
                                  <button
                                    className="flex-1 flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                                    onClick={() =>
                                      handleButtonClick("green", _id)
                                    }
                                  >
                                    <FaPlus className="mr-2" />
                                    Increase Loan
                                  </button>
                                  <button
                                    className="flex-1 flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                                    onClick={() =>
                                      handleButtonClick("red", _id)
                                    }
                                  >
                                    <FaMinus className="mr-2" />
                                    Pay Back
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
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

export default ClientDetails;
