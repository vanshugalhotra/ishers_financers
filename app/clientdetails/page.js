"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { useSearchParams } from "next/navigation";
import { fetchData, postData } from "@/utils/dbFuncs";
import { formatDate, raiseToast } from "@/utils/utilityFuncs";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";

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

  useEffect(() => {
    const fetchClientDetails = async () => {
      startLoading();
      try {
        const api = `/api/client/getsingleclient?_id=${searchParams.get(
          "_id"
        )}`;
        const client = await fetchData(api);
        setClientdetails(client.client); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching client details:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchClientDetails(); // Invoke the async function to fetch data
  }, [searchParams, startLoading, stopLoading]);

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
    } finally {
      stopLoading();
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
            <ul className="md:w-2/3 border-b">
              {clientFields.map(({ title, value }, index) => (
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
