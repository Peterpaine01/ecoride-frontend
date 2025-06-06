import axios from "axios"

export const getCoordinates = async (address) => {
  const fullAddress = `${address.street}, ${address.zip} ${address.city}`

  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: fullAddress,
      format: "json",
      limit: 1,
    },
  })
  if (res.data.length === 0) throw new Error("Adresse non trouvée")

  const { lat, lon } = res.data[0]
  return [parseFloat(lat), parseFloat(lon)]
}

export const reverseGeocode = async ([lat, lon]) => {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon, format: "json" },
    })

    const address = res.data.address

    return {
      street: address.road || "",
      zip: address.postcode || "",
      city: address.city || address.town || address.village || "",
      coords: [lat, lon],
    }
  } catch (error) {
    console.error("Erreur lors du reverse geocoding :", error)
    return null
  }
}

export const calculateRoute = async (start, end) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/directions`,
    {
      coordinates: [start.slice().reverse(), end.slice().reverse()],
    }
  )

  const route = response.data.features[0]
  let duration = route.properties.summary.duration / 60
  duration = isNaN(duration) ? 0 : parseFloat(duration.toFixed(1))
  const routeCoords = route.geometry.coordinates.map(([lon, lat]) => [lat, lon])

  return {
    duration,
    routeCoords,
  }
}
