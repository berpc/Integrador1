import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bs_wishlist')) || [] }
    catch { return [] }
  })

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bs_history')) || [] }
    catch { return [] }
  })

  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('bs_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('bs_history', JSON.stringify(history))
  }, [history])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const toggleWishlist = useCallback((book, preferences = null) => {
    setWishlist(prev => {
      const exists = prev.find(b => b.id === book.id)
      if (exists) {
        showToast('Eliminado de favoritos')
        return prev.filter(b => b.id !== book.id)
      }
      showToast('Agregado a favoritos ⭐')
      return [{ ...book, preferences }, ...prev]
    })
  }, [showToast])

  const addToHistory = useCallback((book) => {
    setHistory(prev => {
      const filtered = prev.filter(b => b.id !== book.id)
      return [book, ...filtered].slice(0, 50)
    })
  }, [])
  

  const clearWishlist = () => setWishlist([])
  const clearHistory = () => setHistory([])
  const isInWishlist = (id) => wishlist.some(b => b.id === id)

  return (
    <AppContext.Provider value={{
      wishlist, history, toast,
      toggleWishlist, addToHistory,
      clearWishlist, clearHistory,
      isInWishlist, showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

