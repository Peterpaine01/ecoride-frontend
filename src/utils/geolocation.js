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

// export const calculateRoute = async (start, end) => {
//   const client = new Openrouteservice({
//     apiKey: import.meta.env.VITE_API_KEY_OPENROUTE, // Assure-toi d'utiliser la bonne clé API
//   })

//   try {
//     // Inverser les coordonnées (long, lat) pour l'API OpenRouteService
//     const response = await client.directions({
//       coordinates: [start.reverse(), end.reverse()], // Inverser start et end
//       profile: "driving-car", // Tu peux changer selon le mode de transport
//       format: "geojson",
//     })

//     const route = response.features[0]
//     const duration = route.properties.summary.duration / 60 // Durée en minutes
//     const routeCoords = route.geometry.coordinates.map(([lon, lat]) => [
//       lat,
//       lon,
//     ])

//     return {
//       duration: duration.toFixed(1),
//       routeCoords,
//     }
//   } catch (error) {
//     console.error("Erreur lors du calcul de l'itinéraire :", error)
//     return null
//   }
// }
