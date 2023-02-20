import Fastify from 'fastify'
import { tasksRoutes } from './routes/tasks'
import fastifyMultipart from '@fastify/multipart'
export const app = Fastify({
  logger: true,
})

app.register(fastifyMultipart)
app.register(tasksRoutes, {
  prefix: '/tasks',
})
