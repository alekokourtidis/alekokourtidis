'use client'
import { useEffect } from 'react'

export default function CardGlow() {
  useEffect(() => {
    function handleMouse(e) {
      const cards = document.querySelectorAll('.product-card, .blog-grid-card')
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
      })
    }
    document.addEventListener('mousemove', handleMouse)
    return () => document.removeEventListener('mousemove', handleMouse)
  }, [])
  return null
}
