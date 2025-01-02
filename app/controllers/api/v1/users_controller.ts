import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { ResponseJson } from '#abilities/index'
import { updateValidator } from '#validators/user'

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['email', 'password'])

    const user = await User.create(data)

    return response.created({ message: 'User created successfully', user })
  }

  async update({ request, response, auth, i18n }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(updateValidator)
    await user.merge(data).save()

    ResponseJson({
      response,
      success: true,
      status: 200,
      message: i18n.t('users.update.success'),
    })
  }
}
