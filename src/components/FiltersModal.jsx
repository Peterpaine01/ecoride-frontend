import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"

import Filters from "./Filters"

import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"

const FiltersModal = ({ searchQuery }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="btn-round flex-column align-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <TuneOutlinedIcon sx={{ color: "#023560", fontSize: 22 }} />
        <small>Filtrer</small>
      </button>

      {isOpen && (
        <div
          className="modal-overlay-filters "
          onClick={() => setIsOpen(false)}
        >
          <div
            className="modal-content-filters filters "
            onClick={(e) => e.stopPropagation()}
          >
            <Filters
              searchQuery={searchQuery}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default FiltersModal
