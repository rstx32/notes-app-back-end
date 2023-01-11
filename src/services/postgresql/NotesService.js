import pg from 'pg'
const { Pool } = pg
import InvariantError from '../../exceptions/InvariantError.js'
import NotFoundError from '../../exceptions/NotFoundError.js'
import mapDBToModel from '../../utils/index.js'
import { nanoid } from 'nanoid'

class NotesService {
  constructor() {
    this._pool = new Pool()
  }

  async addNote({ title, body, tags }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO notes VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getNotes() {
    const query = 'SELECT * FROM notes'
    const result = await this._pool.query(query)
    return result.rows.map(mapDBToModel)
  }

  async getNoteById(id) {
    const query = `SELECT * FROM notes WHERE id='${id}'`
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan')
    }
    return result.rows.map(mapDBToModel)[0]
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE notes SET title=$1, body=$2, tags=$3, updated_at=$4 WHERE id=$5 RETURNING *',
      values: [title, body, tags, updatedAt, id],
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
    }

    return result.rows[0]
  }

  async deleteNoteById(id) {
    const query = `DELETE FROM NOTES WHERE id='${id}' RETURNING id`
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
    }
  }
}

export default NotesService
