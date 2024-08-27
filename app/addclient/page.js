"use client";

import React, { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import InputContainer from "@/components/Form/InputContainer";
import DobPicker from "@/components/Form/DobPicker";
import Link from "next/link";
import { raiseToast } from "@/utils/utilityFuncs";
import { postData } from "@/utils/dbFuncs";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";
import BlobUpload from "@/components/Form/BlobUpload";

const AddClient = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientName, setClientName] = useState(
    searchParams.get("encoded_name") ?? ""
  );
  const [clientPhone, setClientPhone] = useState(
    searchParams.get("encoded_phone") ?? ""
  );
  const [aadharNo, setAadharNo] = useState(
    searchParams.get("encoded_aadharNo") ?? ""
  );
  const [panNumber, setPanNumber] = useState(
    searchParams.get("encoded_panNumber") ?? ""
  );
  const [dob, setDob] = useState(searchParams.get("encoded_dob") ?? new Date());
  const [driveURL, setDriveURL] = useState(
    searchParams.get("encoded_driveURL") ?? ""
  );

  const [clientImage, setClientImage] = useState(
    searchParams.get("encoded_clientImage") ?? ""
  );

  const [bankName, setBankName] = useState(
    searchParams.get("encoded_bankName") ?? ""
  );

  const [bankBranch, setBankBranch] = useState(
    searchParams.get("encoded_bankBranch") ?? ""
  );

  const [bankAccount, setBankAccount] = useState(
    searchParams.get("encoded_bankAccount") ?? ""
  );

  const [previousSalary, setPreviousSalary] = useState(
    searchParams.get("encoded_previousSalary") ?? 0
  );

  const [chequeBook, setChequeBook] = useState(
    searchParams.get("encoded_chequeBook") ?? false
  );

  const [salary, setSalary] = useState(searchParams.get("encoded_salary") ?? 0);

  const [atm, setAtm] = useState(searchParams.get("encoded_atm") ?? "");
  const [insurance, setInsurance] = useState(
    searchParams.get("encoded_insurance") ?? ""
  );

  const [_id, set_id] = useState(searchParams.get("encoded__id") ?? null);

  const handleDateChange = (date) => {
    setDob(date);
  };

  const submit = async () => {
    try {
      startLoading();
      if (!clientName) {
        raiseToast("error", "Client Name is required!!");

        return;
      }
      if (!clientPhone) {
        raiseToast("error", "Phone Number is required!!");

        return;
      }
      if (!aadharNo) {
        raiseToast("error", "Aadhar Number is required!!");

        return;
      }
      if (!panNumber) {
        raiseToast("error", "PAN Number is required!!");

        return;
      }

      const data = {
        name: clientName,
        phone: clientPhone,
        aadharNumber: aadharNo,
        panNumber: panNumber,
        dob: dob ? dob : null,
        atm: atm,
        driveURL: driveURL,
        bankName: bankName,
        bankBranch: bankBranch,
        bankAccount: bankAccount,
        previousSalary: previousSalary,
        salary: salary,
        chequeBook: chequeBook,
      };
      let METHOD = "POST";
      let api = "/api/client/addclient";

      if (_id) {
        // if it is an update request
        METHOD = "PATCH";
        api = "/api/client/updateclient";
        data._id = _id;
      }
      // Upload Client Image
      if (clientImage) {
        const response = await fetch(
          `/api/upload/uploadtoblob?filename=${clientImage.name}`,
          {
            method: "POST",
            body: clientImage,
          }
        );
        const blobData = await response.json();
        if (!blobData.url) {
          raiseToast("error", "Failed to upload Client Image");

          return;
        }
        if (!_id) {
          data.image = {
            name: clientImage.name,
            url: blobData.url,
          };
        }
      }
      // All uploads successful, proceed to save data in database
      const response = await postData(METHOD, data, api);
      if (response.success) {
        let message = _id
          ? "Client Updated Successfully!!"
          : "Client Added Successfully!!";
        raiseToast("success", message);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        raiseToast("info", "Client Already Exists!!");
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

          {/* ATM*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"ATM (Optional)"}
              value={atm}
              onChange={(event) => {
                setAtm(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Insurance*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Insurance (Optional)"}
              value={insurance}
              onChange={(event) => {
                setInsurance(event.target.value);
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

          {/* Drive URL*/}
          <div className="lg:col-span-4">
            <InputContainer
              label={"Drive URL"}
              value={driveURL}
              onChange={(event) => {
                setDriveURL(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Bank Name*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Bank Name (Optional)"}
              value={bankName}
              onChange={(event) => {
                setBankName(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Bank Branch*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Bank Branch (Optional)"}
              value={bankBranch}
              onChange={(event) => {
                setBankBranch(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Bank Account*/}
          <div className="lg:col-span-2">
            <InputContainer
              label={"Bank Account (Optional)"}
              value={bankAccount}
              onChange={(event) => {
                setBankAccount(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Previous Salary*/}
          <div className="lg:col-span-2">
            <InputContainer
              label={"Previous Salary (Optional)"}
              value={previousSalary}
              onChange={(event) => {
                setPreviousSalary(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Salary*/}
          <div className="lg:col-span-2 (Optional)">
            <InputContainer
              label={"Salary"}
              value={salary}
              onChange={(event) => {
                setSalary(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Image */}
          <div className="input-item lg:col-span-2 md:col-span-1">
            <BlobUpload
              name={"Client Image"}
              setState={setClientImage}
              imageVar={clientImage}
            />
          </div>
          <div className="input-item lg:col-span-1 md:col-span-1">
            <input
              type="checkbox"
              id="chequeBook"
              checked={chequeBook}
              onChange={(e) => setChequeBook(e.target.checked)}
              className="w-6 h-6 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-400 focus:ring-opacity-75"
            />
            <label
              htmlFor="paidCheckbox"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Cheque Book
            </label>
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

export default AddClient;
