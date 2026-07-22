import React from "react";

export function FormGroup({ label, error, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-300 font-semibold mb-2">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function TextInput({
  label,
  error,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  ...props
}) {
  return (
    <FormGroup label={label} error={error}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg text-white bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#d4af37] disabled:opacity-100 disabled:text-gray-500 disabled:bg-[#0a0f1a] ${
          error ? "border-red-500" : "border-[#2a2a2a]"
        }`}
        {...props}
      />
    </FormGroup>
  );
}

export function SelectInput({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  required = false,
  ...props
}) {
  return (
    <FormGroup label={label} error={error}>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg text-white bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#d4af37] disabled:opacity-100 disabled:text-gray-500 disabled:bg-[#0a0f1a] ${
          error ? "border-red-500" : "border-[#2a2a2a]"
        }`}
        {...props}
      >
        <option value="" className="bg-[#1e1e1e]">{placeholder}</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1e1e1e]">
            {opt.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
}

export function TextArea({
  label,
  error,
  placeholder,
  value,
  onChange,
  required = false,
  rows = 4,
  ...props
}) {
  return (
    <FormGroup label={label} error={error}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`w-full px-4 py-2 border rounded-lg text-white bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#d4af37] resize-vertical disabled:opacity-100 disabled:text-gray-500 disabled:bg-[#0a0f1a] ${
          error ? "border-red-500" : "border-[#2a2a2a]"
        }`}
        {...props}
      />
    </FormGroup>
  );
}

export function NumberInput({
  label,
  error,
  placeholder,
  value,
  onChange,
  required = false,
  step = "1",
  min = "0",
  ...props
}) {
  return (
    <FormGroup label={label} error={error}>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        step={step}
        min={min}
        className={`w-full px-4 py-2 border rounded-lg text-white bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#d4af37] disabled:opacity-100 disabled:text-gray-500 disabled:bg-[#0a0f1a] ${
          error ? "border-red-500" : "border-[#2a2a2a]"
        }`}
        {...props}
      />
    </FormGroup>
  );
}
