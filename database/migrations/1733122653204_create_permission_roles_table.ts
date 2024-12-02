import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permission_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('permission_id')
        .notNullable()
        .unsigned()
        .references('permissions.id')
        .onDelete('CASCADE')
      table.integer('role_id').notNullable().unsigned().references('roles.id').onDelete('CASCADE')

      table.unique(['permission_id', 'role_id'])

      table.timestamp('created_at', { useTz: false, precision: 6 }).notNullable()
      table.timestamp('updated_at', { useTz: false, precision: 6 }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
