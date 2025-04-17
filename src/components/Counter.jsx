import React, { useEffect, useState, useRef } from "react"
import { Plus, Minus } from "react-feather"

const Counter = ({ name, onChange, value, minValue, maxValue }) => {
  const incrementCounter = () => {
    if (value < maxValue) {
      onChange({ target: { name, value: value + 1 } })
    }
  }

  const decrementCounter = () => {
    if (value > minValue) {
      onChange({ target: { name, value: value - 1 } })
    }
  }
  return (
    <div className="counter flex-row align-center">
      <button
        type="button"
        onClick={decrementCounter}
        disabled={value <= minValue}
      >
        <Minus color="red" />
      </button>
      <p>{value}</p>

      <button
        type="button"
        onClick={incrementCounter}
        disabled={value >= maxValue}
      >
        <Plus />
      </button>
    </div>
  )
}

export default Counter
