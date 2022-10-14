import { server as _server } from '@hapi/hapi'
import routes from './routes.js'

const initServer = async () => {
  const server = _server({
    port: 8080,
    host: 'localhost',
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
