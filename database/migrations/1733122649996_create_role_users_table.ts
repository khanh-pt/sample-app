import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').notNullable().unsigned().references('roles.id').onDelete('CASCADE')
      table.integer('user_id').notNullable().unsigned().references('users.id').onDelete('CASCADE')

      table.unique(['role_id', 'user_id'])

      table.timestamp('created_at', { precision: 6 }).notNullable()
      table.timestamp('updated_at', { precision: 6 }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
