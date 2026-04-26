import BookCard from '../components/BookCard'
import { useApp } from '../context/AppContext'

export default function Wishlist() {
  const { wishlist, clearWishlist } = useApp()

  return (
    <section className="view">
      <div className="fav-header">
        <h2 className="fav-header__title">Lista de deseos</h2>
        {wishlist.length > 0 && (
          <button className="btn btn--danger" onClick={clearWishlist}>
            Limpiar todo
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"></div>
          <p className="empty-state__text">Tu lista de deseos está vacía.</p>
        </div>
      ) : (
        <div className="books-grid">
          {wishlist.map(book => <BookCard key={book.id} book={book} showRemove />)}
        </div>
      )}
    </section>
  )
}
