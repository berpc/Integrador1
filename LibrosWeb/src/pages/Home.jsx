import { useNavigate } from 'react-router-dom'
import fondoImg from '../assets/jpg/fondo.jpg'

export default function Home() {
  const navigate = useNavigate()

  return (
    <section className="home view">
      <div className="home__hero" style={{ backgroundImage: `url(${fondoImg})` }}>
        <span className="home__icon"></span>
        <h2 className="home__title">Bienvenido a Buscador de Libros</h2>
        <p className="home__subtitle">
          Te acompañamos en la búsqueda de tu libro del día, guardá tus favoritos y llevá un registro de lo que exploraste.
        </p>
        <button className="search-form__btn" onClick={() => navigate('/search')}>
          Comenzar tu busqueda
        </button>
      </div>

     {/* <div className="home__features">
        <div className="feature-card">
          <span className="feature-card__icon"></span>
          <h3>Búsqueda avanzada</h3>
          <p>Filtrá por título, autor o ISBN y ordená los resultados a tu gusto.</p>
        </div>
        <div className="feature-card">
          <span className="feature-card__icon"></span>
          <h3>Lista de deseos</h3>
          <p>Guardá los libros que querés leer y accedé a ellos en cualquier momento.</p>
        </div>
        <div className="feature-card">
          <span className="feature-card__icon"></span>
          <h3>Historial</h3>
          <p>Revisá automáticamente todos los libros cuyo detalle visitaste.</p>
        </div>
      </div>*/}
    </section>
  )
}
