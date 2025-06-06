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
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";

import { IoAddOutline } from "react-icons/io5";

const AddLoan = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  const searchParams = useSearchParams();

  const [loanNo, setLoanNo] = useState(
    searchParams.get("encoded_loanNo") ?? ""
  );
  const [startDate, setStartDate] = useState(
    searchParams.get("encoded_startDate") ?? new Date()
  );
  const [duration, setDuration] = useState(
    searchParams.get("encoded_duration") ?? ""
  );
  const [amount, setAmount] = useState(
    searchParams.get("encoded_amount") ?? ""
  );
  const [interest, setInterest] = useState(
    searchParams.get("encoded_interest") ?? ""
  );
  const [type, setType] = useState(
    searchParams.get("encoded_type") ?? "Personal"
  );
  const [showType, setShowType] = useState(false);
  const [client, setClient] = useState(
    searchParams.get("encoded_clientName") ?? ""
  );
  const [clientID, setClientID] = useState(
    searchParams.get("encoded_clientID") ?? ""
  );
  const [fetchedClients, setFetchedClients] = useState([]);
  const [_id, set_id] = useState(searchParams.get("encoded__id") ?? null);

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
    startLoading();
    try {
      if (
        isNaN(Number(duration)) ||
        isNaN(Number(amount)) ||
        isNaN(Number(interest))
      ) {
        raiseToast("error", "Invalid numeric value!");
        return;
      }

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

      // Prepare loan data
      const data = {
        loanNo: loanNo,
        client: clientID,
        type: type,
        amount: amount,
        interest: interest,
        startDate: startDate,
        duration: duration,
      };

      // Add a ledger entry of type "increase" only when creating a new loan
      if (!_id) {
        data.ledger = [
          {
            date: new Date(),
            amount: amount,
            type: "increase",
          },
        ];
      }

      // Determine the method and API endpoint
      const METHOD = _id ? "PATCH" : "POST";
      const api = _id ? "/api/loan/updateloan" : "/api/loan/addloan";

      // Send request
      const response = await postData(METHOD, data, api);

      // Handle response
      if (response.success) {
        const message = _id
          ? "Loan Updated Successfully!!"
          : "Loan Added Successfully!!";
        raiseToast("success", message);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        raiseToast("info", "Loan Already Exists!!");
      }
    } catch (error) {
      raiseToast("error", error.message);
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
