const formatDateToFrench = (isoDate) => {
  if (!isoDate) return ""
  const date = new Date(isoDate)
  return date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const RideSummary = ({ formData }) => {
  const {
    departureDate,
    departureAddress,
    destinationAddress,
    duration,
    availableSeats,
    creditsPerPassenger,
    description,
    vehicleId,
  } = formData

  return (
    <div className="p-4 border rounded-xl shadow bg-white space-y-3">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🛣️ Résumé du trajet
      </h2>

      <div>
        <strong>📅 Date de départ :</strong> {formatDateToFrench(departureDate)}
      </div>

      <div>
        <strong>📍 Adresse de départ :</strong>
        <br />
        {departureAddress.street}, {departureAddress.zip}{" "}
        {departureAddress.city}
      </div>

      <div>
        <strong>🎯 Adresse de destination :</strong>
        <br />
        {destinationAddress.street}, {destinationAddress.zip}{" "}
        {destinationAddress.city}
      </div>

      <div>
        <strong>⏱️ Durée estimée :</strong> {duration || "Non précisée"}
      </div>

      <div>
        <strong>👥 Places disponibles :</strong> {availableSeats}
      </div>

      <div>
        <strong>💳 Crédits par passager :</strong> {creditsPerPassenger}
      </div>

      <div>
        <strong>📝 Description :</strong>
        <br />
        {description || "Aucune description fournie"}
      </div>

      <div>
        <strong>🚗 Véhicule :</strong> {vehicleId || "Non sélectionné"}
      </div>
    </div>
  )
}

export default RideSummary
