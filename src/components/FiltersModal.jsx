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
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className={`burger-icon ${isOpen ? "open" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </div>
          <div
            className="modal-content filters "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton burger */}

            <Filters searchQuery={searchQuery} />
          </div>
        </div>
      )}
    </>
  )
}

export default FiltersModal
