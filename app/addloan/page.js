"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";

import InputContainer from "@/components/Form/InputContainer";
import DobPicker from "@/components/Form/DobPicker";
import { Dropdown } from "@/components/Form/Dropdown";
import { fetchData } from "@/utils/dbFuncs";
import SuggestionInputWithID from "@/components/Form/SuggestionInput";
import { raiseToast } from "@/utils/utilityFuncs";
import { postData } from "@/utils/dbFuncs";
import { useRouter } from "next/navigation";

import { IoAddOutline } from "react-icons/io5";

const AddLoan = () => {
  const { marginForSidebar } = useSidebar();

  const [loanNo, setLoanNo] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [type, setType] = useState("Personal");
  const [showType, setShowType] = useState(false);
  const [client, setClient] = useState("");
  const [clientID, setClientID] = useState("");
  const [fetchedClients, setFetchedClients] = useState([]);

  const loanTypes = ["Personal", "Education", "Home"];

  const router = useRouter();

  const handleDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const toggleType = () => {
    setShowType(!showType);
  };

  useEffect(() => {
    const fetchInitialClients = async () => {
      try {
        const api = "/api/client/getclients";
        const clients = await fetchData(api);
        setFetchedClients(clients);
      } catch (error) {
        console.error("Error fetching initial clients:", error);
        // Handle error if needed
      }
    };

    fetchInitialClients(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures this runs once on mount

  const submit = async () => {
    try {
      if (!loanNo) {
        raiseToast("error", "Loan Number is required!!");
        return;
      }
      if (!clientID) {
        raiseToast("error", "Client Name is required!!");
        return;
      }
      if (!duration) {
        raiseToast("error", "Duration is required!!");
        return;
      }
      if (!amount) {
        raiseToast("error", "Amount is required!!");
        return;
      }
      if (!interest) {
        raiseToast("error", "Interest is required!!");
        return;
      }

      const data = {
        loanNo: loanNo,
        client: clientID,
        type: type,
        amount: amount,
        interest: interest,
        startDate: startDate,
        duration: duration,
      };

      let METHOD = "POST";
      let api = "/api/loan/addloan";

      const response = await postData(METHOD, data, api);
      if (response.success) {
        let message = "Loan Added Successfully!!";
        raiseToast("success", message);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        raiseToast("info", "Loan Already Exists!!");
      }
    } catch (error) {
      raiseToast("error", error.message);
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Add Loan
          </h2>
          <p className="text-xs text-gray-600 py-1 tracking-wide">
            Add New Loan
          </p>
        </div>
        <Link className="right-btn icon-btn" href={"/addclient"}>
          <IoAddOutline className="w-6 h-6 text-white font-medium" />
          <span className="text-white font-medium px-2 text-lg">
            Add Client
          </span>
        </Link>
      </div>
      <div className="my-8 brands-card rounded-lg border-2 py-2 pb-4 border-gray-200 border-opacity-70  shadow-sm">
        <div className="inputs grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          {/* Loan No*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Loan Number"}
              value={loanNo}
              onChange={(event) => {
                setLoanNo(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Type*/}
          <div className="lg:col-span-1">
            {/* Type */}
            <Dropdown
              label={"Type"}
              toggleDropDown={toggleType}
              value={type}
              isOpen={showType}
              options={loanTypes}
              setOption={setType}
            />
          </div>

          {/* Client */}
          <div className="lg:col-span-2">
            <SuggestionInputWithID
              label={"Client"}
              value={client}
              fullWidth={true}
              suggestions={fetchedClients}
              setId={setClientID}
            />
          </div>
          {/* Duration*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Duration (in Years)"}
              value={duration}
              onChange={(event) => {
                setDuration(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Amount*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Amount (₹)"}
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Interest*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Interest (% Per annum )"}
              value={interest}
              onChange={(event) => {
                setInterest(event.target.value);
              }}
              fullWidth={true}
            />
          </div>

          {/*Start Date*/}
          <div className="lg:col-span-1">
            <div className="input-item">
              <label htmlFor="dob" className="input-label">
                Start Date
              </label>
              <div className="relative border rounded-md border-[#919eab52] my-4 flex items-center justify-center flex-col py-2 cursor-pointer  transition-all duration-100 ease-in hover:bg-gray-100">
                <DobPicker
                  selectedDate={startDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="control-buttons mx-4 my-4">
          <div
            className="primary-btn bg-orange-400 hover:bg-orange-500"
            onClick={submit}
          >
            Submit
          </div>
          <Link
            href={"/"}
            className="primary-btn bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AddLoan;
