import autoBind from 'auto-bind'

class NotesHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
    autoBind(this)
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload)
    const { title = 'untitled', body, tags } = request.payload
    const { id: credentialid } = request.auth.credentials
    const noteId = await this._service.addNote({
      title,
      body,
      tags,
      owner: credentialid,
    })

    return h
      .response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      })
      .code(201)
  }

  async getNotesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    const notes = await this._service.getNotes(credentialId)

    return {
      status: 'success',
      data: {
        notes,
      },
    }
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params
    const note = await this._service.getNoteById(id)
    const { id: credentialId } = request.auth.credentials
    await this._service.verifyNoteOwner(id, credentialId)

    return {
      status: 'success',
      data: {
        note,
      },
    }
  }

  async putNoteByIdHandler(request, h) {
    this._validator.validateNotePayload(request.payload)
    const { title, body, tags } = request.payload
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyNoteOwner(id, credentialId)
    await this._service.editNoteById(id, { title, body, tags })

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    }
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyNoteOwner(id, credentialId)
    await this._service.deleteNoteById(id)

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    }
  }
}

export default NotesHandler
