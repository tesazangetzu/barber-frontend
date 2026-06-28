import React from "react";

export function FormGroup({ label, error, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-semibold mb-2">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
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
        className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-100 disabled:text-gray-500 disabled:bg-gray-100 ${
          error ? "border-red-500" : "border-gray-300"
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
        className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-100 disabled:text-gray-500 disabled:bg-gray-100 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
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
        className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical disabled:opacity-100 disabled:text-gray-500 disabled:bg-gray-100 ${
          error ? "border-red-500" : "border-gray-300"
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
        className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-100 disabled:text-gray-500 disabled:bg-gray-100 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
    </FormGroup>
  );
}
