import React from "react";

function Input({ label, type, placeholder, setState }) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={type} className="font-mainfont mb-2 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className="font-mainfont p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
      />
    </div>
  );
}

export default Input;
