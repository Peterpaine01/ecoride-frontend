import React, { useEffect } from "react"
import { toast } from "react-toastify"

const AddressForm = ({ address, onChange, label, onSubmit, errors }) => {
  const handleChange = (field, value) => {
    onChange({
      [field]: value,
    })
  }

  useEffect(() => {
    if (errors) {
      toast.error(errors)
    }
  }, [errors])

  return (
    <div className="address-form flex-column space-between gap-15 h-100 w-100">
      <h2>{label}</h2>
      <div className="flex-row align-start">
        <input
          type="text"
          placeholder="Rue"
          value={address?.street || ""}
          onChange={(e) => handleChange("street", e.target.value)}
          className="w-100"
        />
      </div>
      <div className="flex-row city align-start gap-15">
        <input
          type="text"
          className="zip"
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
