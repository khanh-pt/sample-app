import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, afterDelete, afterSave, column, manyToMany, scope } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Role from '#models/role'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import elasticsearchClient from '#services/elasticsearch'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string

  @column()
  declare last_name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Role, {
    pivotTable: 'role_users',
    pivotTimestamps: true,
  })
  declare roles: ManyToMany<typeof Role>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  static filter = scope((query, filter: Record<string, string>) => {
    Object.entries(filter).forEach(([key, value]) => {
      let columns = key.split('_')
      const operation = columns.pop()
      columns = columns.join('_').split('_or_')

      switch (operation) {
        case 'cont':
          columns.forEach((col) => {
            query.orWhere(col, 'ILIKE', `%${value}%`)
          })
          break
        case 'eq':
          columns.forEach((col) => {
            query.orWhere(col, value)
          })
          break
        default:
          break
      }
    })
  })

  @afterSave()
  public static async syncUser(user: User) {
    await elasticsearchClient.update({
      index: 'users',
      id: user.id.toString(),
      body: {
        doc: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      },
      doc_as_upsert: true,
    })
  }

  @afterDelete()
  public static async deleteUser(user: User) {
    await elasticsearchClient.delete({
      index: 'users',
      id: user.id.toString(),
    })
  }
}
