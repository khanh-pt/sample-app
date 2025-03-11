import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blobs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key').notNullable()
      table.string('filename').notNullable()
      table.string('content_type')
      table.text('metadata')
      table.string('service_name').notNullable()
      table.integer('byte_size').notNullable()
      table.string('checksum').notNullable()

      table.unique('key')

      table.timestamp('created_at', { precision: 6 }).notNullable()
      table.timestamp('updated_at', { precision: 6 }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
