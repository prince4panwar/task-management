import React from "react";

function ImageUpload({ register, fileName, setFileName, name = "image" }) {
  return (
    <>
      <label
        htmlFor="imageUpload"
        className="block w-full text-blue-600 border border-blue-600 p-2 rounded cursor-pointer font-bold"
      >
        Upload Profile Pic
        {fileName && (
          <span className="text-sm text-blue-600 font-semibold">
            {` : ${fileName}`}
          </span>
        )}
      </label>

      <input
        id="imageUpload"
        type="file"
        className="hidden"
        {...register(name, {
          onChange: (e) => {
            setFileName(e.target.files?.[0]?.name ?? "");
          },
        })}
      />
    </>
  );
}

export default ImageUpload;
