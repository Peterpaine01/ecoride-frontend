import { createContext, useContext, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

const PreviousLocationContext = createContext(null)

export const PreviousLocationProvider = ({ children }) => {
  const location = useLocation()
  const prevLocation = useRef(null)

  useEffect(() => {
    prevLocation.current = location
  }, [location])

  return (
    <PreviousLocationContext.Provider value={prevLocation.current}>
      {children}
    </PreviousLocationContext.Provider>
  )
}

export const usePreviousLocation = () => useContext(PreviousLocationContext)
