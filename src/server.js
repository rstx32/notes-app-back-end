import { server as _server } from '@hapi/hapi'
import notes from './api/notes/index.js'
import NotesService from './services/inMemory/NotesService.js'
import NotesValidator from './validator/notes/index.js'

;(async () => {
  const notesService = new NotesService()
  const server = _server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.NODE_PORT || 5000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  })

  await server.start()
  console.log(`server running at ${server.info.uri}`)
})()
