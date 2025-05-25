import { Leaf } from "lucide-react"

const LeafLoader = ({ color, size }) => (
  <div className="leaf-loader">
    <Leaf className="oscillate" color={color} size={size} />
  </div>
)

export default LeafLoader
