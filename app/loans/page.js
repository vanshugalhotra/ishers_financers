"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { postData } from "@/utils/dbFuncs";
import { raiseToast } from "@/utils/utilityFuncs";

import Link from "next/link";
import { fetchData } from "@/utils/dbFuncs";
import { debounce } from "lodash";
import Image from "next/image";

import {
  IoIosAdd,
  IoIosSearch,
  IoIosBrush,
  IoIosEye,
  IoIosTrash,
} from "react-icons/io";

import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";

const Loans = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions
  const [searchQuery, setSearchQuery] = useState("");
  const [loans, setLoans] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLoanID, setSelectedLoanID] = useState(null);
  const [selectedClientID, setSelectedClientID] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchInitialLoans = async () => {
      startLoading();
      try {
        const api = "/api/loan/getloans";
        const intialLoans = await fetchData(api);
        setLoans(intialLoans); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching initial loans:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchInitialLoans(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures it runs only once after initial render

  const performSearch = async () => {
    startLoading();
    try {
      const api = `/api/loan/getloans?search=${searchQuery}`;
      const results = await fetchData(api);
      setLoans(results);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      stopLoading();
    }
  };

  const handleSearchClick = () => {
    performSearch();
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUpdate = async (
    _id,
    loanNo,
    amount,
    duration,
    interest,
    type,
    clientName,
    clientID,
    startDate
  ) => {
    const data = {
      _id,
      loanNo,
      amount,
      duration,
      interest,
      type,
      clientName,
      clientID,
      startDate,
    };
    const queryParams = Object.keys(data)
      .map((key) => {
        const encodedKey = `encoded_${encodeURIComponent(key)}`;
        const encodedValue = encodeURIComponent(data[key]);
        return `${encodedKey}=${encodedValue}`;
      })
      .join("&");

    const url = `/addloan?${queryParams}`;

    router.push(url);
  };

  const handleDelete = async (_id, clientID) => {
    setSelectedLoanID(_id);
    setShowDeleteModal(true);
    setSelectedClientID(clientID);
  };

  const confirmDelete = async () => {
    try {
      // Close the modal first
      setShowDeleteModal(false);

      // Remove the loan ID from the client's loans array
      const clientUpdateResult = await postData(
        "PATCH",
        {
          _id: selectedClientID,
          loanId: selectedLoanID,
        },
        `/api/client/updateclient`
      );

      if (clientUpdateResult.success) {
        // Now delete the loan
        const loanDeleteResult = await postData(
          "DELETE",
          {},
          `/api/loan/deleteloan?_id=${selectedLoanID}`
        );

        if (loanDeleteResult.success) {
          raiseToast("success", "Loan Deleted Successfully!!");
        } else {
          raiseToast("error", "Loan Deletion Failed!!");
        }
      } else {
        raiseToast("error", "Failed to update client loans array.");
      }
    } catch (error) {
      console.error("Error deleting loan:", error);
      raiseToast("error", error.message);
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Records
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">Your Loans</p>
        </div>
        <Link className="right-btn icon-btn" href={"/addloan"}>
          <IoIosAdd className="w-6 h-6 text-white font-medium" />
          <span className="text-white font-medium px-2 text-lg">Add Loan</span>
        </Link>
      </div>
      <div className="my-8 rounded-lg border-2 border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="top-section py-6 px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center w-full border-gray-300">
            <div className="relative w-full">
              <IoIosSearch className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="search-bar-input pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <button
              onClick={handleSearchClick}
              className="ml-2 mt-2 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div className="relative overflow-x-auto">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="table-heading">
                    Sr No.
                  </th>
                  <th scope="col" className="table-heading">
                    Image
                  </th>
                  <th scope="col" className="table-heading">
                    Client Name
                  </th>
                  <th scope="col" className="table-heading">
                    Loan Number
                  </th>
                  <th scope="col" className="table-heading">
                    Amount (₹)
                  </th>
                  <th scope="col" className="table-heading">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loans.length &&
                  loans.map(
                    (
                      {
                        _id,
                        loanNo,
                        amount,
                        client,
                        interest,
                        duration,
                        type,
                        startDate,
                        paid, // Ensure the paid field is available
                      },
                      index
                    ) => {
                      return (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          key={_id}
                        >
                          <td className="table-data text-gray-900 font-semibold">
                            <div className="flex items-center space-x-2">
                              <span>{index + 1}.)</span>
                              {!paid && (
                                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-red-600 bg-red-200">
                                  Unpaid
                                </span>
                              )}
                            </div>
                          </td>
                          <th
                            scope="row"
                            className="flex items-center table-data text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {client && (
                              <Image
                                alt="Upload"
                                className="w-16 h-16"
                                layout="fixed"
                                width={58}
                                height={58}
                                objectFit="cover"
                                src={client.image?.url || "/assets/images/default.png"}
                              />
                            )}
                          </th>
                          <td className="table-data">
                            {client ? client.name : ""}
                          </td>
                          <td className="table-data">{loanNo}</td>
                          <td className="table-data">{`₹ ${amount}`}</td>
                          <td className="table-data space-y-2">
                            <div
                              className="action-icon"
                              onClick={() => {
                                router.push(`/loandetails?_id=${_id}`);
                              }}
                            >
                              <IoIosEye className="normal-icon" />
                            </div>
                            <div
                              className="action-icon"
                              onClick={() => {
                                handleUpdate(
                                  _id,
                                  loanNo,
                                  amount,
                                  duration,
                                  interest,
                                  type,
                                  client.name,
                                  client._id,
                                  startDate
                                );
                              }}
                            >
                              <IoIosBrush className="normal-icon mx-1" />
                            </div>
                            <div className="inline-block text-red-500 up-icon hover:text-red-700">
                              <IoIosTrash
                                className="normal-icon"
                                onClick={() => {
                                  handleDelete(_id, client._id);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onConfirm={confirmDelete}
        message="This action will delete the loan and remove its reference from the client. This action cannot be undone."
      />
    </section>
  );
};

export default Loans;
