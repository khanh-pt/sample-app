import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

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
}
