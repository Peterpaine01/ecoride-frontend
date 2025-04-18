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
  const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: { lat, lon, format: "json" },
  })
  const address = res.data.address

  return {
    street: address.road || address.pedestrian || address.path || "",
    city: address.city || address.town || address.village || "",
    zip: address.postcode || "",
  }
}

export const calculateRoute = async (start, end) => {
  const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      coordinates: [start.slice().reverse(), end.slice().reverse()],
    },
    {
      headers: {
        Authorization: import.meta.env.VITE_API_KEY_OPENROUTE,
        "Content-Type": "application/json",
      },
    }
  )

  const route = response.data.features[0]
  const duration = route.properties.summary.duration / 60
  const routeCoords = route.geometry.coordinates.map(([lon, lat]) => [lat, lon])

  return {
    duration: duration.toFixed(1),
    routeCoords,
  }
}
