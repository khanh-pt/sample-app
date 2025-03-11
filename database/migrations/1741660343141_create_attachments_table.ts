import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attachments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('record_type').notNullable()
      table.integer('record_id').notNullable()
      table.integer('blob_id').notNullable()

      table.index('blob_id')
      table.unique(['record_id', 'record_type', 'name', 'blob_id'])

      table.timestamp('created_at', { precision: 6 }).notNullable()
      table.timestamp('updated_at', { precision: 6 }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
