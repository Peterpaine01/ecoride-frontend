import React from "react"

const StarRating = ({ rating = 0 }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < rating
    return (
      <span key={index} className={isFilled ? "star filled" : "star"}>
        ★
      </span>
    )
  })

  return <div className="star-rating">{stars}</div>
}

export default StarRating
