import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
      table.text('description')

      table.timestamp('created_at', { precision: 6 }).notNullable()
      table.timestamp('updated_at', { precision: 6 }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
