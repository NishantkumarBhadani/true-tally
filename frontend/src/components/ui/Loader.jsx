import React from 'react'

function Loader({size="medium",className=""}) {

    const sizeClasses={
        small:"h-4 w-4 border-2",
        medium:"h-6 w-6 border-4",
        large:"h-10 w-10 border-4"
    }
  return (
    <div className='flex justify-center items-center'>
        <div className={`animate-spin rounded-full border-t-transparent border-b-transparent border-blue-600 ${sizeClasses[size]}${className}`}>
        </div>
    </div>
  )
}

export default Loader