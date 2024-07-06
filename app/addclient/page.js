"use client";

import React, { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import InputContainer from "@/components/Form/InputContainer";
import DobPicker from "@/components/Form/DobPicker";
import Image from "next/image";
import Upload from "@/components/Form/Upload";
import Link from "next/link";
import { raiseToast, uploadFileToServer } from "@/utils/utilityFuncs";
import { postData } from "@/utils/dbFuncs";
import { useRouter } from "next/navigation";

const AddClient = () => {
  const { marginForSidebar } = useSidebar();

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [dob, setDob] = useState("");
  const [aadharImage, setAadharImage] = useState("");
  const [panImage, setPanImage] = useState("");
  const [Signature, setSignature] = useState("");
  const [clientImage, setClientImage] = useState("");
  const [chequeImage, setChequeImage] = useState("");

  const FILE_TYPE = "CLIENT";

  const router = useRouter();

  const handleDateChange = (date) => {
    setDob(date);
  };

  const submit = async () => {
    try {
      if (!clientName) {
        raiseToast("error", "Client Name is required!!");
        return;
      }
      if (!clientPhone) {
        raiseToast("error", "Phone Number is required!!");
        return;
      }
      if (!Signature) {
        raiseToast("error", "Signature Photo is required!!");
        return;
      }
      if (!aadharNo) {
        raiseToast("error", "Aadhar Number is required!!");
        return;
      }
      if (!aadharImage) {
        raiseToast("error", "Aadhar Image is required!!");
        return;
      }
      if (!panNumber) {
        raiseToast("error", "PAN Number is required!!");
        return;
      }
      if (!panImage) {
        raiseToast("error", "PAN Photo is required!!");
        return;
      }
      if (!chequeImage) {
        raiseToast("error", "Cheque or Passbook Image is required!!");
        return;
      }

      const data = {
        name: clientName,
        phone: clientPhone,
        signaturePhoto: Signature.name,
        aadharNumber: aadharNo,
        aadharPhoto: aadharImage.name,
        panNumber: panNumber,
        panPhoto: panImage.name,
        chequeOrPassbookPhoto: chequeImage.name,
        dob: dob ? dob : null,
        image: clientImage.name,
      };

      let METHOD = "POST";
      let api = "/api/client/addclient";

      // Upload Aadhar Image
      const aadharUploadResponse = await uploadFileToServer(
        aadharImage,
        FILE_TYPE,
        clientPhone
      );
      if (!aadharUploadResponse.success) {
        raiseToast("error", aadharUploadResponse.message);
        return; // Stop further processing on error
      }

      // Upload PAN Image
      const panUploadResponse = await uploadFileToServer(
        panImage,
        FILE_TYPE,
        clientPhone
      );
      if (!panUploadResponse.success) {
        raiseToast("error", panUploadResponse.message);
        return; // Stop further processing on error
      }

      // Upload Signature Image
      const signatureUploadResponse = await uploadFileToServer(
        Signature,
        FILE_TYPE,
        clientPhone
      );
      if (!signatureUploadResponse.success) {
        raiseToast("error", signatureUploadResponse.message);
        return; // Stop further processing on error
      }

      // Upload Client Image
      const clientImageUploadResponse = await uploadFileToServer(
        clientImage,
        FILE_TYPE,
        clientPhone
      );
      if (!clientImageUploadResponse.success) {
        raiseToast("error", clientImageUploadResponse.message);
        return; // Stop further processing on error
      }

      // Upload Cheque Image
      const chequeUploadResponse = await uploadFileToServer(
        chequeImage,
        FILE_TYPE,
        clientPhone
      );
      if (!chequeUploadResponse.success) {
        raiseToast("error", chequeUploadResponse.message);
        return; // Stop further processing on error
      }

      // All uploads successful, proceed to save data in database
      const response = await postData(METHOD, data, api);
      if (response.success) {
        let message = "Client Added Successfully!!";
        raiseToast("success", message);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        raiseToast("info", "Client Already Exists!!");
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

          {/* Aadhar Number*/}
          <div className="lg:col-span-2">
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
            <Upload name={"Aadhar Image"} setState={setAadharImage} />
          </div>
          {/* Pan Image */}
          <div className="input-item lg:col-span-1 md:col-span-1">
            <Upload name={"Pan Card Image"} setState={setPanImage} />
          </div>
          {/* Cheque */}
          <div className="input-item lg:col-span-2 md:col-span-1">
            <Upload
              name={"Cheque or Passbook Image"}
              setState={setChequeImage}
            />
          </div>
          {/* Image */}
          <div className="input-item lg:col-span-2 md:col-span-1">
            <Upload name={"Client Image"} setState={setClientImage} />
          </div>
          {/* Signature */}
          <div className="input-item lg:col-span-1 md:col-span-1">
            <Upload name={"Signature"} setState={setSignature} />
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
