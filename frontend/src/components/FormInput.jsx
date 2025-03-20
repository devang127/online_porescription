import React from 'react';

const FormInput = ({ label, type, name, value, onChange, placeholder, required }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default FormInput;