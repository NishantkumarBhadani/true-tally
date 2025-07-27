import React from 'react'

function Input({label,type="text", placeholder,value,onChange, name, className=""}) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input type={type} 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition'
        />

    </div>
  )
}

export default Input