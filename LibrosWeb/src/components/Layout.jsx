import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Toast from './Toast'
import iconBook from '../assets/jpg/logo.jpg'

export default function Layout() {
  return (
    <>
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <img src={iconBook} alt="logo" className="header__logo" />
            <h1 className="header__title">Buscador de Libros</h1>
          </div>
          <Navbar />
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__text">
            Buscador de Libros · Módulo 1 Aplicaciones Móviles 2026
          </p>
          <p className="footer__text footer__text--muted">
            Datos provistos por <a href="https://gutendex.com" target="_blank" rel="noopener noreferrer">Gutendex</a> · Proyecto Gutenberg
          </p>
        </div>
      </footer>
      <Toast />
    </>
  )
}
