import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Wishlist from './pages/Wishlist'
import History from './pages/History'
import Contact from './pages/Contact'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="book/:id" element={<Detail />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="history" element={<History />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}
