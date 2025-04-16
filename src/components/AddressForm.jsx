import React from "react"

const AddressForm = ({ address, onChange, label, onSubmit, errors }) => {
  const handleChange = (field, value) => {
    onChange({
      [field]: value,
    })
  }

  return (
    <div className="address-form flex-column space-between gap-15 h-100">
      <h2>{label}</h2>
      {errors && (
        <p className="error-msg text-center" role="alert">
          {errors}
        </p>
      )}
      <div className="flex-row align-left">
        <input
          type="text"
          placeholder="Rue"
          value={address?.street || ""}
          onChange={(e) => handleChange("street", e.target.value)}
          className="w-100"
        />
      </div>
      <div className="flex-row align-left gap-15">
        <input
          type="text"
          placeholder="Code postal"
          value={address?.zip || ""}
          onChange={(e) => handleChange("zip", e.target.value)}
        />
        <input
          type="text"
          placeholder="Ville"
          value={address?.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
          className="w-100"
        />
      </div>

      {onSubmit && (
        <button
          className="btn-light mt-20 fit-content align-self-center"
          type="button"
          onClick={onSubmit}
        >
          Trouver
        </button>
      )}
    </div>
  )
}

export default AddressForm
