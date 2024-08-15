"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

import Link from "next/link";
import { fetchData } from "@/utils/dbFuncs";
import { debounce } from "lodash";
import Image from "next/image";

import { useRouter } from "next/navigation";

import {
  IoIosAdd,
  IoIosSearch,
  IoIosBrush,
  IoIosEye,
  IoIosTrash,
} from "react-icons/io";

import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { raiseToast } from "@/utils/utilityFuncs";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";

const Clients = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClientID, setSelectedClientID] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchInitialClients = async () => {
      startLoading();
      try {
        const api = "/api/client/getclients";
        const initialClients = await fetchData(api);
        setClients(initialClients); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching initial clients:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchInitialClients(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures it runs only once after initial render

  const performSearch = async () => {
    startLoading();
    try {
      const api = `/api/client/getclients?search=${searchQuery}`;
      const results = await fetchData(api);
      setClients(results);
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
    name,
    phone,
    image,
    aadharNumber,
    panNumber,
    dob,
    signaturePhoto,
    atm,
    driveURL,
    insurance
  ) => {
    const data = {
      _id,
      name,
      phone,
      aadharNo: aadharNumber,
      panNumber,
      dob,
      clientImage: image.name,
      Signature: signaturePhoto.name,
      atm,
      driveURL,
      insurance,
    };
    const queryParams = Object.keys(data)
      .map((key) => {
        const encodedKey = `encoded_${encodeURIComponent(key)}`;
        const encodedValue = encodeURIComponent(data[key]);
        return `${encodedKey}=${encodedValue}`;
      })
      .join("&");

    const url = `/addclient?${queryParams}`;

    router.push(url);
  };

  const handleDelete = async (_id) => {
    setSelectedClientID(_id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Fetch client details to get the list of loans
      const clientResponse = await fetch(
        `/api/client/getsingleclient?_id=${selectedClientID}`
      );
      const clientResult = await clientResponse.json();

      if (clientResult.success) {
        const { loans } = clientResult.client;

        // Delete all associated loans
        for (const loanId of loans) {
          await fetch(`/api/loan/deleteloan?_id=${loanId}`, {
            method: "DELETE",
          });
        }

        // After deleting all loans, delete the client
        const clientDeleteResponse = await fetch(
          `/api/client/deleteclient?_id=${selectedClientID}`,
          {
            method: "DELETE",
          }
        );
        const clientDeleteResult = await clientDeleteResponse.json();

        if (clientDeleteResult.success) {
          raiseToast(
            "success",
            "Client and associated loans deleted successfully!"
          );
        } else {
          raiseToast("error", "Failed to delete the client.");
        }
      } else {
        raiseToast("error", "Failed to fetch client details.");
      }
    } catch (error) {
      console.error("Error deleting client and loans:", error);
      raiseToast(
        "error",
        "An error occurred while deleting the client and loans."
      );
    } finally {
      router.refresh();
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Clients List
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">
            Your Clients
          </p>
        </div>
        <Link className="right-btn icon-btn" href={"/addclient"}>
          <IoIosAdd className="w-6 h-6 text-white font-medium" />
          <span className="text-white font-medium px-2 text-lg">
            Add Client
          </span>
        </Link>
      </div>
      <div className="my-8 rounded-lg border-2 border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="top-section py-6 px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="search-bar w-full border-gray-300">
            <IoIosSearch className="inline-flex text-gray-500 rounded-full cursor-pointer mx-2 up-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-bar-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button
              onClick={handleSearchClick}
              className="search-button ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
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
                    Name
                  </th>
                  <th scope="col" className="table-heading">
                    Phone
                  </th>
                  <th scope="col" className="table-heading">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.length &&
                  clients.map(
                    (
                      {
                        _id,
                        name,
                        phone,
                        image,
                        aadharNumber,
                        panNumber,
                        dob,
                        signaturePhoto,
                        driveURL,
                        atm,
                        insurance,
                      },
                      index
                    ) => {
                      return (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          key={_id}
                        >
                          <td className="table-data text-gray-900 font-semibold">
                            {index + 1}.)
                          </td>
                          <th
                            scope="row"
                            className="flex items-center table-data text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <Image
                              alt="Upload"
                              className="w-16 h-16"
                              layout="fixed"
                              width={58}
                              height={58}
                              objectFit="cover"
                              src={image.url}
                            />
                          </th>
                          <td className="table-data">{name}</td>
                          <td className="table-data">{phone}</td>
                          <td className="table-data space-y-2">
                            <div
                              className="action-icon"
                              onClick={() => {
                                router.push(`/clientdetails?_id=${_id}`);
                              }}
                            >
                              <IoIosEye className="normal-icon" />
                            </div>
                            <div
                              className="action-icon"
                              onClick={() => {
                                handleUpdate(
                                  _id,
                                  name,
                                  phone,
                                  image,
                                  aadharNumber,
                                  panNumber,
                                  dob,
                                  signaturePhoto,
                                  atm,
                                  driveURL,
                                  insurance
                                );
                              }}
                            >
                              <IoIosBrush className="normal-icon mx-1" />
                            </div>
                            <div className="inline-block text-red-500 up-icon hover:text-red-700">
                              <IoIosTrash
                                className="normal-icon"
                                onClick={() => {
                                  handleDelete(_id);
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
        message="Deleting this client will also delete all associated loans. This action cannot be undone."
      />
    </section>
  );
};

export default Clients;
