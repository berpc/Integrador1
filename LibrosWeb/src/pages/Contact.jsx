export default function Contact() {
  return (
    <section className="view contact">
      <h2 className="fav-header__title contact__heading">Contacto</h2>

      <div className="contact__card">
        <div className="contact__avatar">B</div>
        <div className="contact__info">
          <p className="contact__name">Bernardita</p>
          <p className="contact__role">Desarrolladora · Módulo 1 Aplicaciones Moviles</p>
          <ul className="contact__list">
            <li> <a href="mailto:">penayoebernardita@gmail.com</a></li>
           
            
          </ul>
        </div>
      </div>

      <div className="contact__map">
        <p className="contact__map-label"> Catedral de La Plata, Buenos Aires</p>
        <iframe
          title="Ubicación Catedral de La Plata"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-57.9686%2C-34.9315%2C-57.9386%2C-34.9115&layer=mapnik&marker=-34.9215%2C-57.9536"
          width="100%"
          height="300"
          style={{ border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'block' }}
          loading="lazy"
        />
        <p>
  <a 
    href="https://www.openstreetmap.org/?mlat=-34.9215&mlon=-57.9536#map=15/-34.9215/-57.9536" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    Ver en mapa completo
  </a>
</p>
      </div>
    </section>
  )
}


