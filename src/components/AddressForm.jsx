import React from "react"

const AddressForm = ({ address, onChange, label, onSubmit }) => {
  const handleChange = (field, value) => {
    onChange({
      [field]: value,
    })
  }

  return (
    <div className="address-form">
      <h2>{label}</h2>

      <input
        type="text"
        placeholder="Rue"
        value={address?.street || ""}
        onChange={(e) => handleChange("street", e.target.value)}
      />

      <input
        type="text"
        placeholder="Ville"
        value={address?.city || ""}
        onChange={(e) => handleChange("city", e.target.value)}
      />

      <input
        type="text"
        placeholder="Code postal"
        value={address?.zip || ""}
        onChange={(e) => handleChange("zip", e.target.value)}
      />

      {onSubmit && (
        <button className="btn-light" type="button" onClick={onSubmit}>
          Trouver
        </button>
      )}
    </div>
  )
}

export default AddressForm
