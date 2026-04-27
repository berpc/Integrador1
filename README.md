# BookShelf – Buscador de Libros

Trabajo Integrador Módulo 1 – Aplicaciones Móviles 2026  
Desarrolladora: **Bernardita**

---

## ¿Qué hace la aplicación?

BookShelf es una aplicación web que permite:

- **Buscar** millones de libros gratuitos usando la API pública de Gutendex
- **Filtrar** resultados por tema, idioma y orden
- **Ver el detalle** de cada libro con su portada, autor, idioma y links de descarga gratuita
- **Guardar favoritos** en una lista de deseos persistente
- **Revisar el historial** de libros visitados
- Todo se guarda en el navegador (sin base de datos ni login)

---

## Tecnologías utilizadas

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| React | 18.3 | Biblioteca para construir la interfaz |
| React Router DOM | 6.28 | Navegación entre páginas sin recargar |
| Vite | 6.0 | Servidor de desarrollo y empaquetador |
| JavaScript (JSX) | ES2022 | Lenguaje principal |
| CSS (variables) | — | Estilos con tema oscuro |
| Gutendex API | — | Fuente de datos de libros |
| localStorage | — | Persistencia de favoritos e historial |

---

## Estructura de carpetas

```
LibrosWeb/
├── index.html              ← Punto de entrada HTML
├── package.json            ← Dependencias y scripts
├── src/
│   ├── main.jsx            ← Arranque de React
│   ├── App.jsx             ← Rutas de la aplicación
│   ├── index.css           ← Todos los estilos (tema oscuro)
│   ├── assets/
│   │   └── svg/
│   │       └── iconbook.svg  ← Ícono de la página de inicio
│   ├── context/
│   │   └── AppContext.jsx  ← Estado global (favoritos, historial, toast)
│   ├── services/
│   │   └── api.js          ← Comunicación con la API externa
│   ├── components/
│   │   ├── Layout.jsx      ← Estructura base (header + contenido + toast)
│   │   ├── Navbar.jsx      ← Barra de navegación
│   │   ├── BookCard.jsx    ← Tarjeta de libro reutilizable
│   │   └── Toast.jsx       ← Notificación flotante
│   └── pages/
│       ├── Home.jsx        ← Página de bienvenida
│       ├── Search.jsx      ← Buscador con filtros y paginación
│       ├── Detail.jsx      ← Detalle de un libro
│       ├── Wishlist.jsx    ← Lista de deseos
│       ├── History.jsx     ← Historial de libros visitados
│       └── Contact.jsx     ← Información de contacto
```

---

## Cómo ejecutar el proyecto

```bash
# 1. Entrar a la carpeta
cd LibrosWeb

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Luego abrir el navegador en `http://localhost:5173`

---

## Explicación de cada archivo

---

### `index.html`

Es el único archivo HTML del proyecto. El navegador lo carga primero.

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

- El `<div id="root">` es el contenedor vacío donde React inyecta toda la app.
- El `<script>` le dice al navegador que cargue `main.jsx` como módulo JavaScript.
- El archivo en sí es mínimo porque en React todo el contenido se genera desde JavaScript.

---

### `src/main.jsx`

Es el **punto de arranque de React**. Se ejecuta una sola vez al cargar la app.

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- `ReactDOM.createRoot` conecta React con el `<div id="root">` del HTML.
- `BrowserRouter` activa el sistema de rutas para navegar entre páginas.
- `React.StrictMode` activa advertencias extra durante el desarrollo para detectar errores.

---

### `src/App.jsx`

Define el **mapa de rutas** de la aplicación. Cada URL corresponde a un componente.

```jsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />         // /
  <Route path="search" element={<Search />} /> // /search
  <Route path="book/:id" element={<Detail />} /> // /book/123
  <Route path="wishlist" element={<Wishlist />} /> // /wishlist
  <Route path="history" element={<History />} /> // /history
  <Route path="contact" element={<Contact />} /> // /contact
</Route>
```

- `Layout` es el componente "padre" que envuelve todas las páginas (header + footer).
- `:id` es un parámetro dinámico — cada libro tiene su propio ID en la URL.
- `AppProvider` envuelve todo para que el estado global esté disponible en cualquier componente.

---

### `src/context/AppContext.jsx`

Es el **estado global** de la aplicación. Usa el patrón `Context API` de React para compartir datos entre todos los componentes sin tener que pasar props manualmente.

**¿Qué guarda?**

| Estado | Tipo | Descripción |
|---|---|---|
| `wishlist` | Array | Lista de libros favoritos |
| `history` | Array | Historial de libros visitados |
| `toast` | String o null | Mensaje de notificación temporal |

**¿Cómo persiste los datos?**

```jsx
// Al iniciar, lee de localStorage con manejo de errores
const [wishlist, setWishlist] = useState(() => {
  try { return JSON.parse(localStorage.getItem('bs_wishlist')) || [] }
  catch { return [] }
})

// Cada vez que cambia wishlist, guarda en localStorage
useEffect(() => {
  localStorage.setItem('bs_wishlist', JSON.stringify(wishlist))
}, [wishlist])
```

El `try/catch` protege contra datos corruptos en localStorage — si el JSON guardado no se puede parsear, arranca con un array vacío en lugar de romper la app.

Esto significa que si el usuario cierra el navegador y vuelve, sus favoritos e historial siguen guardados.

**Funciones disponibles para toda la app:**

| Función | Qué hace |
|---|---|
| `toggleWishlist(book)` | Agrega o quita un libro de favoritos |
| `addToHistory(book)` | Agrega un libro al historial (máximo 50) |
| `clearWishlist()` | Vacía todos los favoritos |
| `clearHistory()` | Vacía el historial |
| `isInWishlist(id)` | Devuelve `true` si el libro está en favoritos |
| `showToast(msg)` | Muestra una notificación por 2.5 segundos |

**`useCallback`** se usa en las funciones para evitar que se recreen en cada render, mejorando el rendimiento.

Para consumir el contexto en cualquier componente:
```jsx
const { wishlist, toggleWishlist } = useApp()
```

---

### `src/services/api.js`

Centraliza toda la **comunicación con la API externa** de Gutendex (`https://gutendex.com`). Así el resto de la app no necesita saber cómo funciona la API.

**`searchBooks(params)`**

Busca libros según los parámetros del formulario.

```js
const params = new URLSearchParams()
params.set('search', query)   // título o autor
params.set('topic', topic)    // tema
params.set('languages', lang) // idioma
params.set('sort', sort)      // orden
params.set('page', page)      // paginación
```

Construye la URL dinámicamente y hace un `fetch`. Si la respuesta no es exitosa lanza un error. Distingue errores de red (`TypeError`) de errores HTTP para mensajes más claros.

**`getBookDetail(id)`**

Obtiene el detalle completo de un libro por su ID:
```
GET https://gutendex.com/books/123
```

**`getCoverUrl(formats)`**

Extrae la URL de la portada del mapa de formatos que devuelve la API:
```js
getCoverUrl(book.formats) // → "https://...cover.jpg" o null
```
Centraliza la lógica de extracción de portada que usa tanto `normalizeBook` como cualquier otro consumidor.

**`normalizeBook(book)`**

La API devuelve datos crudos en un formato que no siempre es conveniente. Esta función los transforma a un objeto limpio y uniforme que usa toda la app:

```js
// Dato crudo de la API:
{ authors: [{ name: "Twain, Mark", birth_year: 1835 }], ... }

// Dato normalizado:
{ author: "Mark Twain", year: 1835, ... }
```

También invierte el formato "Apellido, Nombre" que usa Gutendex al formato "Nombre Apellido" más legible.

**`PAGE_SIZE`**

Constante exportada con valor `10` — Gutendex siempre devuelve 10 libros por página. Se usa en Search para calcular el total de páginas.

---

### `src/components/Layout.jsx`

Es la **estructura base** que envuelve todas las páginas. Siempre se muestra, independientemente de la ruta.

```jsx
<header className="header">    ← Encabezado con título y navegación
  <Navbar />
</header>
<main className="main">
  <Outlet />                   ← Aquí se renderiza la página actual
</main>
<Toast />                      ← Notificación flotante
```

`<Outlet />` es un componente de React Router que actúa como "hueco" — se reemplaza automáticamente con el componente de la ruta activa (Home, Search, etc.).

---

### `src/components/Navbar.jsx`

Barra de navegación con links a todas las secciones.

```jsx
<NavLink to="/wishlist">
  Favoritos <span className="badge">{wishlist.length}</span>
</NavLink>
```

- Usa `NavLink` en lugar de `<a>` para que React Router maneje la navegación sin recargar la página.
- Agrega automáticamente la clase `nav__btn--active` al link de la página actual.
- Muestra un badge con la cantidad de libros en favoritos, obtenido del contexto global.

---

### `src/components/BookCard.jsx`

Tarjeta reutilizable que muestra la información básica de un libro. Se usa en tres páginas distintas: Search, Wishlist e History.

**Props que recibe:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `book` | Object | requerido | Datos del libro normalizado |
| `showRemove` | Boolean | `false` | Si es `true` muestra botón "Quitar" (solo en Wishlist) |

**Comportamiento:**

- Al hacer click en la tarjeta navega a `/book/:id` y pasa el objeto `book` en el estado de la ruta para evitar una llamada extra a la API.
- El botón de favorito usa `e.stopPropagation()` para evitar que el click se propague a la tarjeta y navegue accidentalmente.
- Si el libro no tiene portada muestra un `<div>` con la clase `card__cover--placeholder` estilizado en CSS (sin imagen).
- Los botones de acción incluyen `aria-label` para accesibilidad.
- Usa `loading="lazy"` en las imágenes para mejorar el rendimiento.

---

### `src/components/Toast.jsx`

Notificación pequeña que aparece en la parte inferior de la pantalla.

```jsx
if (!toast) return null
return <div className="toast">{toast}</div>
```

- Lee el mensaje del contexto global.
- Si `toast` es `null` no renderiza nada (`return null`).
- La animación de entrada está definida en CSS con `@keyframes toastIn`.
- Se oculta automáticamente después de 2.5 segundos (controlado desde `AppContext`).

---

### `src/pages/Home.jsx`

Página de bienvenida con presentación de las funciones principales.

- Muestra el ícono SVG importado desde `assets/svg/iconbook.svg`.
- Tiene un botón "Comenzar a buscar" que redirige a `/search` usando `useNavigate`.
- Muestra tres tarjetas descriptivas de las funciones: búsqueda, favoritos e historial.

---

### `src/pages/Search.jsx`

Es la página principal de funcionalidad. Permite buscar libros con filtros avanzados.

**Estados que maneja:**

| Estado | Descripción |
|---|---|
| `query` | Texto del campo de búsqueda |
| `topic` | Filtro por tema |
| `languages` | Filtro por idioma |
| `sort` | Criterio de ordenamiento |
| `results` | Array de libros encontrados |
| `total` | Total de resultados (para calcular páginas) |
| `page` | Página actual |
| `loading` | Si hay una búsqueda en curso |
| `status` | Mensaje de estado ("Buscando...", errores, etc.) |

**Filtros de idioma disponibles:**

Español, Inglés, Francés, Alemán, Portugués, Italiano (además de "Todos los idiomas").

**Flujo de búsqueda:**

1. El usuario completa el formulario y hace submit.
2. `handleSubmit` previene el comportamiento por defecto del formulario y llama a `doSearch`.
3. `doSearch` llama a `searchBooks` de `api.js`, normaliza los resultados y los guarda en `results`.
4. Requiere al menos un valor en `query` o `topic` para ejecutar la búsqueda (validación previa).
5. Mientras carga, muestra 12 tarjetas "skeleton" animadas como placeholder.
6. Si hay más de una página, muestra botones de paginación. Al cambiar de página hace scroll al inicio automáticamente.

**`useCallback`** en `doSearch` evita que la función se recree en cada render.

---

### `src/pages/Detail.jsx`

Muestra el detalle completo de un libro al navegar a `/book/:id`.

**Optimización:** Si el usuario llegó desde la lista de búsqueda, el libro ya viene en `location.state` y se muestra inmediatamente. De todas formas, siempre hace la llamada a la API para tener datos completos y actualizar el historial.

```jsx
const [book, setBook] = useState(state?.book || null) // muestra datos previos si existen
```

**Al cargar la página:**
1. Obtiene el `id` de la URL con `useParams`.
2. Llama a `getBookDetail(id)` para obtener datos completos.
3. Normaliza el resultado con `normalizeBook`.
4. Llama a `addToHistory` para registrar la visita.

**Manejo de errores:**

Si la llamada a la API falla, muestra el mensaje "No se encontró el libro." con un botón "Volver" que llama a `navigate(-1)`.

**Links de descarga:**

Filtra los formatos del libro contra un objeto `FORMAT_LABELS` que define qué formatos mostrar (EPUB, PDF, HTML, TXT) con su ícono correspondiente.

---

### `src/pages/Wishlist.jsx`

Muestra los libros guardados como favoritos.

- Lee `wishlist` del contexto global.
- Si está vacía muestra un estado vacío con mensaje.
- Si tiene libros los muestra con `BookCard` pasando `showRemove={true}` para que aparezca el botón de quitar.
- El botón "Limpiar todo" llama a `clearWishlist()` del contexto.

---

### `src/pages/History.jsx`

Muestra el historial de libros cuyo detalle fue visitado. Funciona exactamente igual que Wishlist pero usa el estado `history` y `clearHistory`.

El historial se limita a los últimos **50 libros** (definido en `AppContext`) y no muestra duplicados — si visitás el mismo libro dos veces, solo guarda la visita más reciente.

---

### `src/pages/Contact.jsx`

Página de presentación de la desarrolladora con:
- Avatar con inicial del nombre.
- Email y link a GitHub.
- Mapa embed de OpenStreetMap mostrando Buenos Aires.

---

### `src/index.css`

Archivo de estilos global con **tema oscuro**. Usa variables CSS (Custom Properties) para mantener consistencia y facilitar cambios de paleta.

**Variables principales:**

```css
:root {
  --color-primary:    #6366f1;  /* Indigo - botones, links activos */
  --color-bg:         #0f172a;  /* Azul muy oscuro - fondo general */
  --color-surface:    #1e293b;  /* Azul oscuro - cards y superficies */
  --color-text:       #f1f5f9;  /* Casi blanco - texto principal */
  --color-text-muted: #94a3b8;  /* Gris claro - texto secundario */
  --color-border:     #334155;  /* Gris oscuro - bordes */
  --color-accent:     #f59e0b;  /* Amarillo - badges y favoritos */
  --color-danger:     #ef4444;  /* Rojo - botones de eliminar */
}
```

**Características destacadas:**

- Animación `fadeIn` en todas las páginas al navegar.
- Animación `shimmer` en los skeleton loaders durante la carga.
- Animación `toastIn` para la notificación flotante.
- Diseño **responsive** con `grid` y `auto-fill` para adaptarse a cualquier pantalla.
- BEM (Block Element Modifier) como convención de nombres CSS: `.card`, `.card__title`, `.card__action-btn--fav`.

---

## Conceptos de React utilizados

| Concepto | Dónde se usa | Para qué |
|---|---|---|
| `useState` | Search, Detail, AppContext | Guardar estado local o global |
| `useEffect` | AppContext, Detail | Ejecutar código al cambiar un valor |
| `useContext` / `createContext` | AppContext + todos los componentes | Estado global sin props |
| `useCallback` | AppContext, Search | Evitar recrear funciones en cada render |
| `useNavigate` | Home, Detail, BookCard | Navegar entre rutas por código |
| `useParams` | Detail | Leer el `:id` de la URL |
| `useLocation` | Detail | Leer el estado pasado en la navegación |
| `NavLink` | Navbar | Links con clase activa automática |
| `Outlet` | Layout | Renderizar la página hija de la ruta |
| `async/await` | api.js, Search, Detail | Llamadas asincrónicas a la API |

---

## API utilizada: Gutendex

Gutendex es una API REST gratuita y sin autenticación que expone los libros del proyecto Gutenberg (más de 70.000 libros de dominio público).

**Endpoints usados:**

```
GET https://gutendex.com/books/?search=twain&page=1
GET https://gutendex.com/books/1342
```

**Ejemplo de respuesta:**
```json
{
  "count": 4,
  "results": [
    {
      "id": 74,
      "title": "The Adventures of Tom Sawyer",
      "authors": [{ "name": "Twain, Mark", "birth_year": 1835 }],
      "languages": ["en"],
      "download_count": 18000,
      "formats": {
        "image/jpeg": "https://...",
        "application/epub+zip": "https://..."
      }
    }
  ]
}
```

---

## Flujo completo de la aplicación

```
Usuario abre la app
        │
        ▼
   index.html  →  main.jsx  →  App.jsx
                                   │
                             (define rutas)
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
           /search             /book/:id           /wishlist
              │                    │                     │
         Search.jsx           Detail.jsx           Wishlist.jsx
              │                    │                     │
         api.js               api.js             AppContext
       (searchBooks)        (getBookDetail)      (wishlist state)
              │                    │
        Gutendex API         Gutendex API
```

---

## Persistencia de datos

Los datos se guardan en `localStorage` del navegador bajo estas claves:

| Clave | Contenido |
|---|---|
| `bs_wishlist` | Array JSON de libros favoritos |
| `bs_history` | Array JSON del historial (máx. 50) |

Esto significa que los datos **sobreviven al cerrar el navegador** pero son locales a ese dispositivo — no se sincronizan entre dispositivos ni usuarios.
