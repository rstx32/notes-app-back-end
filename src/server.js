import { server as _server } from '@hapi/hapi'
import routes from './routes.js'

const initServer = async () => {
  const server = _server({
    port: 8080,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.route(routes)

  await server.start()
  console.log(`application running at ${server.info.uri}`)
}

initServer()
