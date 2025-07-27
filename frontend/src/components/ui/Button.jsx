import React from 'react'

function Button({text ="Click me",onClick, type="button", className=""}) {
  return (
    <button
    type={type}
    onClick={onClick}
    className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 active:scale-95 transition duration-200 text-base sm:text-base ${className} `}
    >
    {text}
    </button>
  )
}

export default Button