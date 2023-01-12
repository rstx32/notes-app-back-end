import { server as _server } from '@hapi/hapi'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

// notes
import notes from './api/notes/index.js'
import NotesService from './services/postgresql/NotesService.js'
import NotesValidator from './validator/notes/index.js'

// users
import users from './api/users/index.js'
import UsersService from './services/postgresql/UsersService.js'
import UsersValidator from './validator/users/index.js'

// error handling
import ClientError from './exceptions/ClientError.js'
;(async () => {
  const notesService = new NotesService()
  const usersService = new UsersService()

  const server = _server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  // notes
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ])

  // error handling
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        })
        newResponse.code(response.statusCode)
        return newResponse
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      })
      newResponse.code(500)
      console.error(response)
      return newResponse
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  await server.start()
  console.log(`server running at ${server.info.uri}`)
})()
