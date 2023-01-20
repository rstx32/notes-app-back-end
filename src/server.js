import { server as _server } from '@hapi/hapi'
import Jwt from '@hapi/jwt'
import Inert from '@hapi/inert'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// notes
import notes from './api/notes/index.js'
import NotesService from './services/postgresql/NotesService.js'
import NotesValidator from './validator/notes/index.js'

// users
import users from './api/users/index.js'
import UsersService from './services/postgresql/UsersService.js'
import UsersValidator from './validator/users/index.js'

// authentications
import authentications from './api/authentications/index.js'
import AuthenticationsService from './services/postgresql/AuthenticationsService.js'
import TokenManager from './tokenize/TokenManager.js'
import AuthenticationsValidator from './validator/authentications/index.js'

// collaborations
import collaborations from './api/collaborations/index.js'
import CollaborationsService from './services/postgresql/CollaborationsService.js'
import CollaborationsValidator from './validator/collaborations/index.js'

// exports
import _exports from './api/exports/index.js'
import ProducerService from './services/rabbitmq/ProducerService.js'
import ExportsValidator from './validator/exports/index.js'

// uploads
import uploads from './api/uploads/index.js'
import StorageService from './services/storage/StorageService.js'
import UploadsValidator from './validator/uploads/index.js'

// cache
import CacheService from './services/redis/CacheService.js'

// error handling
import ClientError from './exceptions/ClientError.js'
;(async () => {
  const cacheService = new CacheService()
  const collaborationsService = new CollaborationsService(cacheService)
  const notesService = new NotesService(collaborationsService, cacheService)
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const storageService = new StorageService(
    path.resolve(__dirname, 'api/uploads/file/images')
  )

  const server = _server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert
    }
  ])

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
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
