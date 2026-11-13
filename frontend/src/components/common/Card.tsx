import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export default function Card({ 
  children, 
  hover = false, 
  className = '', 
  ...props 
}: CardProps) {
  const hoverEffect = hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
  
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-brand-brown-200 p-6 ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
