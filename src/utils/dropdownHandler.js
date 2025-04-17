export function setupDropdown() {
  const dropdowns = document.querySelectorAll(".dropdown-el")

  const handleDropdownClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.toggle("expanded")

    const targetFor = e.target.getAttribute("for")
    if (targetFor) {
      const input = document.getElementById(targetFor)
      if (input) input.checked = true
    }
  }

  const handleOutsideClick = () => {
    dropdowns.forEach((el) => el.classList.remove("expanded"))
  }

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", handleDropdownClick)
  })

  document.addEventListener("click", handleOutsideClick)

  return () => {
    dropdowns.forEach((dropdown) => {
      dropdown.removeEventListener("click", handleDropdownClick)
    })
    document.removeEventListener("click", handleOutsideClick)
  }
}
