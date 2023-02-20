// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    tasks: {
      id: string
      title: string
      description: string
      completed_at?: string
      created_at: string
      updated_at: string
    }
  }
}
