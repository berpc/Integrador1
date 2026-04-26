import BookCard from '../components/BookCard'
import { useApp } from '../context/AppContext'

export default function History() {
  const { history, clearHistory } = useApp()

  return (
    <section className="view">
      <div className="fav-header">
        <h2 className="fav-header__title">Historial</h2>
        {history.length > 0 && (
          <button className="btn btn--danger" onClick={clearHistory}>
            Limpiar historial
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"></div>
          <p className="empty-state__text">Todavía no visitaste ningún libro.</p>
        </div>
      ) : (
        <div className="books-grid">
          {history.map(book => <BookCard key={book.id} book={book} showSave={false} />)}
        </div>
      )}
    </section>
  )
}
