import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { getBookDetail, normalizeBook } from '../services/api'

const FORMAT_LABELS = {
  'application/epub+zip':   { label: 'EPUB', icon: '📗' },
  'text/html':              { label: 'HTML', icon: '🌐' },
  'application/pdf':        { label: 'PDF',  icon: '📄' },
  'text/plain; charset=us-ascii': { label: 'TXT', icon: '📝' },
}

export default function Detail() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { toggleWishlist, isInWishlist, addToHistory } = useApp()

  const [book, setBook] = useState(state?.book || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const data = await getBookDetail(id)
        const normalized = normalizeBook(data)
        setBook(normalized)
        addToHistory(normalized)
      } catch (err) {
        setBook(null)
        setLoading(false)
        console.error(err)
        return
      }
      setLoading(false)
    }
    init()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="status">Cargando…</div>
  if (!book) return (
    <section className="view">
      <button className="nav__btn detail__back" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <div className="status">No se encontró el libro.</div>
    </section>
  )

  const inWishlist = isInWishlist(book.id)

  const downloadLinks = Object.entries(book.formats)
    .filter(([mime]) => FORMAT_LABELS[mime])
    .map(([mime, url]) => ({ ...FORMAT_LABELS[mime], url }))

  return (
    <section className="view">
      <button className="nav__btn detail__back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detail">
        {book.coverUrl
          ? <img className="detail__cover" src={book.coverUrl} alt={book.title} />
          : <div className="detail__cover detail__cover--placeholder"></div>
        }
        <div className="detail__info">
          <h2 className="detail__title">{book.title}</h2>
          <p className="detail__author">{book.author}</p>
          <p className="detail__meta">
            {[
              book.year && `Nacimiento autor: ${book.year}`,
              book.languages.length && `Idioma: ${book.languages.join(', ')}`,
              book.downloads && `${book.downloads.toLocaleString()} descargas`,
            ].filter(Boolean).join(' · ')}
          </p>

          {book.subjects.length > 0 && (
            <div className="detail__tags">
              {book.subjects.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          )}

          <div className="detail__actions">
            <button
              className={`detail__fav-btn${inWishlist ? ' active' : ''}`}
              onClick={() => toggleWishlist(book)}
            >
              {inWishlist ? 'En favoritos' : '☆ Agregar a favoritos'}
            </button>
          </div>

          {downloadLinks.length > 0 && (
            <div className="detail__downloads">
              <p className="detail__downloads-label">Leer gratis:</p>
              <div className="detail__download-links">
                {downloadLinks.map(({ label, icon, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
