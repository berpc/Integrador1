const BASE = 'https://gutendex.com'

export async function searchBooks({ query = '', topic = '', languages = '', sort = 'popular', page = 1 }) {
  const params = new URLSearchParams()
  if (query)     params.set('search', query)
  if (topic)     params.set('topic', topic)
  if (languages) params.set('languages', languages)
  if (sort)      params.set('sort', sort)
  params.set('page', page)

  try {
    const res = await fetch(`${BASE}/books/?${params}`)
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    return res.json()
  } catch (err) {
    if (err.name === 'TypeError') throw new Error('Error de red: sin conexión')
    throw err
  }
}

export async function getBookDetail(id) {
  try {
    const res = await fetch(`${BASE}/books/${id}`)
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    return res.json()
  } catch (err) {
    if (err.name === 'TypeError') throw new Error('Error de red: sin conexión')
    throw err
  }
}

export function getCoverUrl(formats = {}) {
  return formats['image/jpeg'] || null
}

export function normalizeBook(book) {
  const rawName = book.authors?.[0]?.name || ''
  const author = rawName.includes(',')
    ? rawName.split(', ').reverse().join(' ')
    : rawName || 'Autor desconocido'

  return {
    id: book.id,
    title: book.title || 'Sin título',
    author,
    year: book.authors?.[0]?.birth_year || '',
    coverUrl: getCoverUrl(book.formats),
    subjects: book.subjects?.slice(0, 5) || [],
    languages: book.languages || [],
    downloads: book.download_count || 0,
    formats: book.formats || {},
  }
}

export const PAGE_SIZE = 10 // Gutendex fixed page size
