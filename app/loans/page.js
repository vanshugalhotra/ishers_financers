"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

import Link from "next/link";
import { fetchData } from "@/utils/dbFuncs";
import { debounce } from "lodash";
import Image from "next/image";

import { IoAddOutline } from "react-icons/io5";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

const Loans = () => {
  const { marginForSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchInitialLoans = async () => {
      try {
        const api = "/api/loan/getloans";
        const intialLoans = await fetchData(api);
        setLoans(intialLoans); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching initial loans:", error);
        // Handle error if needed
      }
    };

    fetchInitialLoans(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures it runs only once after initial render

  // REACT STUFF
  useEffect(() => {
    const fetchResults = debounce(async () => {
      const api = `/api/loan/getloans?search=${searchQuery}`;
      const results = await fetchData(api);
      setLoans(results);
    }, 500); // Adjust the debounce delay as needed

    fetchResults();
  }, [searchQuery]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Records
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">Your Loans</p>
        </div>
        <Link className="right-btn icon-btn" href={"/addloan"}>
          <IoAddOutline className="w-6 h-6 text-white font-medium" />
          <span className="text-white font-medium px-2 text-lg">Add Loan</span>
        </Link>
      </div>
      <div className="my-8 rounded-lg border-2 border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="top-section py-6 px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="search-bar w-full border-gray-300">
            <CiSearch className="inline-flex text-gray-500 rounded-full cursor-pointer mx-2 up-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-bar-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
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
                  loans.map(({ _id, loanNo, amount, client }, index) => {
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
                            src={`/assets/images/CLIENT/${client.phone}/${client.image}`}
                          />
                        </th>
                        <td className="table-data">{client.name}</td>
                        <td className="table-data">{loanNo}</td>
                        <td className="table-data">{`₹ ${amount}`}</td>
                        <td className="table-data space-y-2">
                          <div className="action-icon" onClick={() => {}}>
                            <FaRegEye className="normal-icon" />
                          </div>
                          <div className="action-icon" onClick={() => {}}>
                            <AiOutlineEdit className="normal-icon mx-1" />
                          </div>
                          <div className="inline-block text-red-500 up-icon hover:text-red-700">
                            <FaRegTrashAlt
                              className="normal-icon"
                              onClick={() => {}}
                            />
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
    </section>
  );
};

export default Loans;
