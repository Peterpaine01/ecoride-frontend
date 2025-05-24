export const displayDuration = (duration) => {
  if (duration === "NaN") {
    return "0 min"
  }
  const roundDuration = Math.round(duration)

  if (roundDuration >= 60) {
    const hours = Math.floor(roundDuration / 60)
    const minutes = roundDuration % 60
    return `${hours}h${minutes > 0 ? `${minutes}` : ""}`
  } else {
    return `${roundDuration} min`
  }
}

export const handleDateChange = (date) => {
  const selectedDate = new Date(date)
  selectedDate.setHours(0, 0, 0, 0)
  setFormData({ ...formData, departureDate: selectedDate.toISOString() })
}

export const formatTimeToFrench = (isoDate) => {
  const date = new Date(isoDate)

  const options = { hour: "2-digit", minute: "2-digit" }
  return date.toLocaleTimeString("fr-FR", options)
}
