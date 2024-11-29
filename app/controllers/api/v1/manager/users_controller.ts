import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { ResponseJson } from '#abilities/index'
import { listUsersValidator } from '#validators/manager/users'

export default class UsersController {
  async index({ request, response, i18n }: HttpContext) {
    // check quyền
    const { page = 1, perPage = 10, filter = {} } = await request.validateUsing(listUsersValidator)

    const result = await User.query()
      .withScopes((scopes) => scopes.filter(filter))
      .paginate(page, perPage)

    return ResponseJson({
      response,
      success: true,
      message: i18n.t('users.index.success'),
      status: 200,
      ...result.toJSON(),
    })
  }
}
