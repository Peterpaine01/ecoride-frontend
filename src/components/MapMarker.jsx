import { Marker, Popup, useMap } from "react-leaflet"
import { useEffect } from "react"
import L from "leaflet"

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const MapMarker = ({ position, label }) => {
  // console.log("position", position)

  if (!position || position.length === 0) {
    return null
  }

  const map = useMap()
  const icon = label === "Départ" ? greenIcon : redIcon

  useEffect(() => {
    if (position) map.setView(position, map.getZoom())
  }, [position, map])

  return (
    <Marker position={position} icon={icon}>
      <Popup>{label}</Popup>
    </Marker>
  )
}
export default MapMarker
