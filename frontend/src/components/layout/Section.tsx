import type { HTMLAttributes, ReactNode } from 'react'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  background?: 'cream' | 'cream-light' | 'white' | 'brown' | 'brown-dark' | 'green-50' | 'none'
}

export default function Section({
  children,
  background = 'none',
  className = '',
  ...props
}: SectionProps) {
  const backgrounds = {
    cream: 'bg-brand-cream',
    'cream-light': 'bg-brand-beige',
    white: 'bg-white',
    brown: 'bg-[#292D08] text-white',
    'brown-dark': 'bg-brand-brown text-white',
    'green-50': 'bg-green-50',
    none: '',
  }

  return (
    <section
      className={`py-12 md:py-16 lg:py-20 ${backgrounds[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}
