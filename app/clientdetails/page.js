"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { useSearchParams } from "next/navigation";
import { fetchData } from "@/utils/dbFuncs";
import { formatDate } from "@/utils/utilityFuncs";

const ClientDetails = () => {
  const { marginForSidebar } = useSidebar();

  const searchParams = useSearchParams();
  const [clientdetails, setClientdetails] = useState({});
  const [loandetails, setLoandetails] = useState([]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const api = `/api/client/getsingleclient?_id=${searchParams.get(
          "_id"
        )}`;
        const client = await fetchData(api);
        setClientdetails(client.client); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching client details:", error);
        // Handle error if needed
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
      title: "Date Of Birth",
      value: formatDate(clientdetails.dob),
    },
  ];

  const clientImages = [
    {
      title: "Client Image",
      src: clientdetails.image,
    },
    {
      title: "Client Signature",
      src: clientdetails.signaturePhoto,
    },
    {
      title: "Aadhar Image",
      src: clientdetails.aadharPhoto,
    },
    {
      title: "PAN Image",
      src: clientdetails.panPhoto,
    },
    {
      title: "Cheque or Passbook Photo",
      src: clientdetails.chequeOrPassbookPhoto,
    },
  ];

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
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
                              <td className="table-data space-x-2 space-y-2"></td>
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
                  src={`/assets/images/CLIENT/${clientdetails.phone}/${image.src}`}
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
    </section>
  );
};

export default ClientDetails;
