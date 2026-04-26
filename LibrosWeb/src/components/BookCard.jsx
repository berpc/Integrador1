import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import WishlistForm from './WishlistForm'

export default function BookCard({ book, showRemove = false, showSave = true }) {
  const navigate = useNavigate()
  const { toggleWishlist, isInWishlist, showToast } = useApp()
  const inWishlist = isInWishlist(book.id)
  const [showForm, setShowForm] = useState(false)

  function handleSaveClick(e) {
    e.stopPropagation()
    if (inWishlist) {
      showToast('Ya está en tu lista de favoritos')
    } else {
      setShowForm(true)
    }
  }

  function handleConfirm(preferences) {
    toggleWishlist(book, preferences)
    setShowForm(false)
  }

  return (
    <>
      <article className="card" onClick={() => navigate(`/book/${book.id}`, { state: { book } })}>
        {book.coverUrl
          ? <img className="card__cover" src={book.coverUrl} alt={book.title} loading="lazy" />
          : <div className="card__cover card__cover--placeholder"></div>
        }
        <div className="card__body">
          <p className="card__title">{book.title}</p>
          <p className="card__author">{book.author}</p>
          {book.year && <p className="card__year">{book.year}</p>}
          {showRemove && book.preferences && (
            <div className="card__prefs">
              <span className="badge--category">{book.preferences.category}</span>
              <span className="card__priority">Prioridad: {book.preferences.priority}</span>
              {book.preferences.note && <p className="card__note">{book.preferences.note}</p>}
            </div>
          )}
        </div>
        <div className="card__actions">
          {showSave && (
            <button
              className={`card__action-btn card__action-btn--fav${inWishlist ? ' active' : ''}`}
              onClick={handleSaveClick}
              aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {inWishlist ? ' Guardado' : ' Guardar'}
            </button>
          )}

          {showRemove && (
            <button
              className="card__action-btn card__action-btn--rm"
              onClick={e => { e.stopPropagation(); toggleWishlist(book) }}
              aria-label="Eliminar"
            >
              Quitar
            </button>
          )}
        </div>
      </article>

      {showForm && (
        <WishlistForm
          onConfirm={handleConfirm}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  )
}
