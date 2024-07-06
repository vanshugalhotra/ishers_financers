"use client";

import React, { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import InputContainer from "@/components/Form/InputContainer";
import DobPicker from "@/components/Form/DobPicker";
import Image from "next/image";
import Upload from "@/components/Form/Upload";
import Link from "next/link";

const AddClient = () => {
  const { marginForSidebar } = useSidebar();

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loanNumber, setLoanNumber] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [loanNo, setLoanNo] = useState("");
  const [dob, setDob] = useState("");
  const [aadharImage, setAadharImage] = useState("");

  const handleDateChange = (date) => {
    setDob(date);
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Add Client
          </h2>
          <p className="text-xs text-gray-600 py-1 tracking-wide">
            Add New Client
          </p>
        </div>
      </div>
      <div className="my-8 brands-card rounded-lg border-2 py-2 pb-4 border-gray-200 border-opacity-70  shadow-sm">
        <div className="inputs grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          {/* Client Name*/}
          <div className="lg:col-span-2">
            <InputContainer
              label={"Client Name"}
              value={clientName}
              onChange={(event) => {
                setClientName(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Client Phone*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Client Phone"}
              value={clientPhone}
              onChange={(event) => {
                setClientPhone(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Loan Number*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Loan Number"}
              value={loanNumber}
              onChange={(event) => {
                setLoanNumber(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Aadhar Number*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Aadhar Card Number"}
              value={aadharNo}
              onChange={(event) => {
                setAadharNo(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* PAN Number*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"PAN Number"}
              value={panNumber}
              onChange={(event) => {
                setPanNumber(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/*Loan Number*/}
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
          {/*Date of Birth*/}
          <div className="lg:col-span-1">
            <div className="input-item">
              <label htmlFor="dob" className="input-label">
                Date Of Birth
              </label>
              <div className="relative border rounded-md border-[#919eab52] my-4 flex items-center justify-center flex-col py-2 cursor-pointer  transition-all duration-100 ease-in hover:bg-gray-100">
                <DobPicker selectedDate={dob} onChange={handleDateChange} />
              </div>
            </div>
          </div>
          {/* Aadhar Image */}
          <div className="input-item lg:col-span-1 md:col-span-1">
            <Upload name={"Aadhar Image"} />
          </div>
          {/* Pan Image */}
          <div className="input-item lg:col-span-1 md:col-span-1">
            <Upload name={"Pan Card Image"} />
          </div>
          {/* Cheque */}
          <div className="input-item lg:col-span-2 md:col-span-1">
            <Upload name={"Cheque or Passbook Image"} />
          </div>
          {/* Image */}
          <div className="input-item lg:col-span-2 md:col-span-1">
            <Upload name={"Client Image"} />
          </div>
          {/* Signature */}
          <div className="input-item lg:col-span-1 md:col-span-1">
            <Upload name={"Signature"} />
          </div>
        </div>
        <div className="control-buttons mx-4 my-4">
          <div className="primary-btn bg-orange-400 hover:bg-orange-500">
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

export default AddClient;
