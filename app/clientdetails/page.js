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
  }, [searchParams]); // Empty dependency array ensures it runs only once after initial render

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
      {" "}
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
