import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'crypto'
import { z } from 'zod'
export async function tasksRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const tasks = await knex('tasks').select('*')
    return { tasks }
  })

  app.post('/', async (request, reply) => {
    const getTaskBodySchema = z.object({
      title: z.string(),
      description: z.string(),
    })

    const { title, description } = getTaskBodySchema.parse(request.body)

    await knex('tasks').insert({
      id: crypto.randomUUID(),
      title,
      description,
    })

    return reply.status(201).send()
  })

  app.get('/:id', async (request, reply) => {
    const getTaskParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTaskParamsSchema.parse(request.params)

    const task = await knex('tasks').where('id', id).first()

    if (!task) {
      return reply.status(404).send({ message: `Task not found with ID ${id}` })
    }

    return { task }
  })

  app.put('/:id', async (request, reply) => {
    const getTaskParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTaskParamsSchema.parse(request.params)

    const getTaskBodySchema = z.object({
      title: z.string(),
      description: z.string(),
    })

    const { title, description } = getTaskBodySchema.parse(request.body)

    const task = await knex('tasks').where('id', id).first()

    if (!task) {
      return reply.status(404).send({ message: `Task not found with ID ${id}` })
    }

    await knex('tasks').where('id', id).update({
      title,
      description,
      updated_at: knex.fn.now(),
    })

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getTaskParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTaskParamsSchema.parse(request.params)

    await knex('tasks').where('id', id).first().delete()

    return reply.status(204).send()
  })

  app.patch('/:id/complete', async (request, reply) => {
    const getTaskParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTaskParamsSchema.parse(request.params)

    const task = await knex('tasks').where('id', id).first()

    if (!task) {
      return reply.status(404).send({ message: `Task not found with ID ${id}` })
    }

    await knex('tasks').where('id', id).update({
      completed_at: knex.fn.now(),
    })

    return reply.status(204).send()
  })
}
