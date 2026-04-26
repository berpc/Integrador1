import { useState, useCallback } from 'react'
import BookCard from '../components/BookCard'
import { searchBooks, normalizeBook, PAGE_SIZE } from '../services/api'

export default function Search() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('')
  const [languages, setLanguages] = useState('')
  const [sort, setSort] = useState('popular')
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async (q, tp, lang, srt, pg) => {
    if (!q.trim() && !tp.trim()) {
      setStatus('Ingresá un título, autor o tema para buscar.')
      return
    }
    setLoading(true)
    setStatus('Buscando…')
    try {
      const data = await searchBooks({ query: q, topic: tp, languages: lang, sort: srt, page: pg })
      const books = (data.results || []).map(normalizeBook).slice(0, PAGE_SIZE)
      setResults(books)
      setTotal(data.count || 0)
      setStatus(books.length === 0 ? 'Sin resultados.' : '')
    } catch {
      setStatus('Error al buscar. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    doSearch(query, topic, languages, sort, 1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    doSearch(query, topic, languages, sort, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <section className="view">
      <div className="search__card">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-form__group">
            <input
              className="search-form__input"
              type="search"
              placeholder="Título o autor…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="filters">
            <input
              className="search-form__input filters__input"
              type="text"
              placeholder="Tema (ej: fantasy, history…)"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
            <select className="filters__select" value={languages} onChange={e => setLanguages(e.target.value)}>
              <option value="">Todos los idiomas</option>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
              <option value="de">Alemán</option>
              <option value="pt">Portugués</option>
              <option value="it">Italiano</option>
            </select>
            <select className="filters__select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="popular">Más populares</option>
              <option value="ascending">ID ascendente</option>
              <option value="descending">ID descendente</option>
            </select>
          </div>
          <button className="search-form__btn" type="submit">Buscar</button>
        </form>
      </div>
      {status && <div className="status">{status}</div>}

      {loading ? (
        <div className="books-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="books-grid">
          {results.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ← Anterior
          </button>
          <span className="pagination__info">Página {page} de {totalPages}</span>
          <button
            className="pagination__btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  )
}
