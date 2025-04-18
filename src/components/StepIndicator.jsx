import React from "react"

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex-row justify-between align-center indicator-wrapper">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep - 1
        const isCompleted = index < currentStep - 1
        // console.log("current >", currentStep, "index >", index)

        return (
          <div
            key={index}
            className={`step-indicator flex-row align-center relative ${
              index < totalSteps - 1 && "w-100"
            } `}
          >
            <div
              className={`flex-row align-center justify-center steps transition-all
                ${
                  isCompleted ? "bg-green" : isActive ? "bg-yellow" : "bg-gray"
                }`}
            >
              {index + 1}
            </div>

            {/* Connecting line */}
            {index < totalSteps - 1 && (
              <div className="absolute line bg-gray">
                <div
                  className={`line absolute transition-all duration-300 ${
                    isCompleted ? "bg-green w-100" : "bg-gray w-0"
                  }`}
                ></div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator
