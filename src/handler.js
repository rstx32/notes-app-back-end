import { nanoid } from 'nanoid'
import notes from './notes.js'

const addNoteHandler = (request, h) => {
  const { title, tag, body } = request.payload
  const id = nanoid(16)
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  const newNote = {
    title,
    tag,
    body,
    id,
    createdAt,
    updatedAt,
  }

  notes.push(newNote)

  const isSuccess = notes.filter((note) => note.id === id).length > 0

  if (isSuccess) {
    return h
      .response({
        status: 'success',
        message: 'notes added',
        data: {
          noteId: id,
        },
      })
      .code(201)
  } else {
    return h
      .response({
        status: 'failed',
        message: 'notes failed to add',
      })
      .code(500)
  }
}

const getNoteHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
})

const showNoteHandler = (request, h) => {
  const { id } = request.params
  const note = notes.filter((note) => note.id === id)[0]

  if (note !== undefined) {
    return h
      .response({
        status: 'success',
        data: {
          note,
        },
      })
      .code(201)
  } else {
    return h
      .response({
        status: 'failed',
        message: 'note not found',
      })
      .code(404)
  }
}

const editNoteHandler = (request, h) => {
  const { id } = request.params
  const { title, tag, body } = request.payload
  const updatedAt = new Date().toISOString()

  const index = notes.findIndex((note) => note.id === id)

  if (index !== 1) {
    notes[index] = {
      ...notes[index],
      title,
      tag,
      body,
      updatedAt,
    }

    return h
      .response({
        status: 'success',
        message: 'success updating note',
      })
      .code(200)
  } else {
    return h
      .response({
        status: 'failed',
        message: 'failed to update note, note not found',
      })
      .code(404)
  }
}

const deleteNoteHandler = (request, h) => {
  const { id } = request.params
  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes.splice(index, 1)
    return h
      .response({
        status: 'success',
        message: 'note deleted',
      })
      .code(200)
  } else {
    return h
      .response({
        status: 'failed',
        message: 'failed to delete note, note not found',
      })
      .code(404)
  }
}

export {
  addNoteHandler,
  getNoteHandler,
  showNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
}
