import { useMap } from "react-leaflet"
import { useEffect } from "react"

const FitBoundsOnRoute = ({ departure, destination }) => {
  const map = useMap()

  useEffect(() => {
    if (departure && destination) {
      const bounds = [departure, destination]
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [departure, destination, map])

  return null
}

export default FitBoundsOnRoute
