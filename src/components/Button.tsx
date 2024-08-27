"use client";
import React, { FC, HtmlHTMLAttributes, ReactNode } from 'react'
import {redirect} from "next/navigation"

export interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement>{
  children?: ReactNode;
  className: string;
}

const Button: FC<ButtonProps> = ({ className = '', children ,...props }) => {
  return (
    <button {...props} className={`bg-blue-600 text-gray-100 px-4 py-3 rounded-md font-semibold ${className}`}>
      {children}
    </button>
  );
};

export default Button