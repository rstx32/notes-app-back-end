import { nanoid } from 'nanoid'

class NotesService {
  constructor() {
    this._notes = []
  }

  addNote({ title, body, tags }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
      title,
      tags,
      body,
      id,
      createdAt,
      updatedAt,
    }

    this._notes.push(newNote)

    const isSuccess = this._notes.filter((note) => note.id === id).length > 0
    if (!isSuccess) {
      throw new Error('Failed to add notes!')
    }

    return id
  }

  getNotes() {
    return this._notes
  }

  getNoteById(id) {
    const found = this._notes.find((note) => note.id === id)
    if (!found) {
      throw new Error('Notes unavailable!')
    }

    return found
  }

  getNoteIndex(id) {
    return this._notes.findIndex((note) => note.id === id)
  }

  editNoteById(id, { title, body, tags }) {
    const index = this.getNoteIndex(id)
    if (index === -1) {
      throw new Error('failed to update note, id not found!')
    }

    const updatedAt = new Date().toISOString()

    this._notes[index] = {
      ...this._notes[index],
      title,
      body,
      tags,
      updatedAt,
    }
  }

  deleteNoteById(id) {
    const index = this.getNoteIndex(id)
    if (index === -1) {
      throw new Error('failed to delete note, id not found!')
    }

    this._notes.splice(index, 1)
  }
}

export default NotesService
