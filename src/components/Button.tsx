import React, { ReactNode } from 'react'

function Button({
    children, 
    className,
    type
}:{
    children: ReactNode,
    className: any
    type: HTMLButtonElement | any
}) {
  return (
    <button type={type} className={`bg-blue-600 text-gray-100 px-4 py-3 rounded-md font-semibold ${className}`}>{children}</button>
  )
}

export default Button