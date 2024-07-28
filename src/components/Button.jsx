import React from "react";

function Button({ text, onClick, disabled, variant }) {
  const baseStyle =
    "font-mainfont py-2 px-4 rounded-lg shadow-md transition duration-300 w-full my-1";
  const primaryStyle = "bg-purple-600 text-white hover:bg-purple-700";
  const googleStyle =
    "bg-white text-black border border-gray-300 hover:bg-gray-100 mb-2";

  const styles = variant === "google" ? googleStyle : primaryStyle;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {text}
    </button>
  );
}

export default Button;
