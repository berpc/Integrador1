import { useState } from 'react'

export default function WishlistForm({ onConfirm, onCancel }) {
  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!priority || Number(priority) <= 0) e.priority = 'Ingresá un número mayor a cero'
    if (!category.trim()) e.category = 'La categoría es requerida'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    onConfirm({ priority: Number(priority), category: category.trim(), note: note.trim() })
  }

  return (
    <div className="modal" onClick={onCancel}>
      <form className="modal__form" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <h3 className="modal__title">Preferencias del libro</h3>

        <label className="modal__label">
          Prioridad
          <input
            className={`modal__input${errors.priority ? ' modal__input--error' : ''}`}
            type="number"
            placeholder="Ej: 1"
            value={priority}
            onChange={e => { setPriority(e.target.value); setErrors(p => ({ ...p, priority: '' })) }}
          />
          {errors.priority && <span className="modal__error">{errors.priority}</span>}
        </label>

        <label className="modal__label">
          Categoría
          <input
            className={`modal__input${errors.category ? ' modal__input--error' : ''}`}
            type="text"
            placeholder="Ej: Ciencia ficción"
            value={category}
            onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })) }}
          />
          {errors.category && <span className="modal__error">{errors.category}</span>}
        </label>

        <label className="modal__label">
          Nota personal <span className="modal__optional">(opcional)</span>
          <textarea
            className="modal__textarea"
            placeholder="Ej: Recomendado por un amigo"
            value={note}
            maxLength={200}
            onChange={e => setNote(e.target.value)}
          />
          <span className="modal__counter">{note.length}/200</span>
        </label>

        <div className="modal__actions">
          <button type="submit" className="btn btn--primary">Confirmar</button>
          <button type="button" className="btn btn--secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
