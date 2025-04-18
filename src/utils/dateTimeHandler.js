export const displayDuration = (duration) => {
  if (duration === "NaN") {
    return "0 min"
  }
  const roundDuration = Math.round(duration)

  if (roundDuration >= 60) {
    const hours = Math.floor(roundDuration / 60)
    const minutes = roundDuration % 60
    return `${hours}h${minutes > 0 ? ` ${minutes} min` : ""}`
  } else {
    return `${roundDuration} min`
  }
}
