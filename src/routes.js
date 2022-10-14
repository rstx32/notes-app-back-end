import {
  addNoteHandler,
  getNoteHandler,
  showNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
} from './handler.js'

const routes = [
  {
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler,
  },
  {
    method: 'GET',
    path: '/notes',
    handler: getNoteHandler,
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: showNoteHandler,
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: editNoteHandler,
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNoteHandler,
  },
]

export default routes
