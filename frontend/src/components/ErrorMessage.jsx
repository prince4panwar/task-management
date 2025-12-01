import React from "react";

function ErrorMessage({ message }) {
  return message ? (
    <p className="text-red-900 pb-3 ps-1 text-xs font-bold">{message}</p>
  ) : null;
}

export default ErrorMessage;
