import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { wishlist } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef(null)
  const toggleRef = useRef(null)

  const cls = ({ isActive }) => 'nav__btn' + (isActive ? ' nav__btn--active' : '')
  const close = () => setIsOpen(false)

  // Cierra el menú al hacer clic fuera del nav o del botón hamburguesa
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cierra el menú si la pantalla se agranda a desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <button
        ref={toggleRef}
        className="nav__toggle"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <nav ref={navRef} className={`nav${isOpen ? ' nav--open' : ''}`}>
        <NavLink to="/" end className={cls} onClick={close}>Inicio</NavLink>
        <NavLink to="/search" className={cls} onClick={close}>Buscar</NavLink>
        <NavLink to="/wishlist" className={cls} onClick={close}>
          Favoritos <span className="badge">{wishlist.length}</span>
        </NavLink>
        <NavLink to="/history" className={cls} onClick={close}>Historial</NavLink>
        <NavLink to="/contact" className={cls} onClick={close}>Contacto</NavLink>
      </nav>
    </>
  )
}
