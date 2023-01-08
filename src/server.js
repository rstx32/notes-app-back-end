import { server as _server } from '@hapi/hapi'
import notes from './api/notes/index.js'
import NotesService from './services/postgresql/NotesService.js'
import NotesValidator from './validator/notes/index.js'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

;(async () => {
  const notesService = new NotesService()
  const server = _server({
    host: process.env.HOST,
    port: process.env.PORT,
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
