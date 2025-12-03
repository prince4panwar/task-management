import React from "react";

function ImageUpload({
  register,
  fileName,
  setFileName,
  name = "image",
  errors,
  labelName = "Upload Image",
}) {
  return (
    <div className="mb-2">
      <label
        htmlFor="imageUpload"
        className={`block w-full text-blue-600 border border-blue-600 p-2 rounded cursor-pointer font-bold ${
          errors
            ? "border-red-900 focus:ring focus:ring-red-900 text-red-900"
            : "focus:ring focus:ring-blue-600"
        }`}
      >
        {labelName}
        {fileName && (
          <span
            className={`text-sm font-semibold ${
              errors ? "text-red-900" : "text-blue-600"
            }`}
          >
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
    </div>
  );
}

export default ImageUpload;
