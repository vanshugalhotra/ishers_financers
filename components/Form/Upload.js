import React from "react";
import Image from "next/image";

const Upload = ({ name, setState }) => {
  function handleFileUpload(file) {
    setState(file);
  }

  return (
    <div>
      <label htmlFor="images" className="input-label">
        {name}
      </label>
      <div className="upload relative border rounded-md border-[#919eab52] my-4 flex items-center justify-center flex-col py-2 cursor-pointer  transition-all duration-100 ease-in hover:bg-gray-100">
        <input
          type="file"
          className="!w-full h-[100px] opacity-0 relative"
          id={name}
          name={name}
          onChange={(event) => {
            if (event.target.files) {
              const file = event.target.files[0];
              handleFileUpload(file);
            }
          }}
        />
        <label
          htmlFor="brandlogo"
          className="image-upload absolute top-0 rounded-md z-[100] cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center my-6">
            <Image
              alt="Upload"
              className="w-12 h-12"
              layout="fixed"
              width={48}
              height={48}
              objectFit="cover"
              src="/assets/Images/Icons/upload.svg"
            />
            <h4 className="text-gray-900 tracking-wider leading-loose text-sm font-medium">
              Upload File
            </h4>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Upload;
