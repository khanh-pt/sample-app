import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import { ResponseJson } from '#abilities/index'

export default class AuthController {
  async register({ request, response, i18n }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)

    ResponseJson({
      response,
      success: true,
      status: 200,
      message: i18n.t('auth.register.success'),
      data: await User.accessTokens.create(user),
    })
  }

  async login({ request, response, i18n }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    ResponseJson({
      response,
      success: true,
      status: 200,
      message: i18n.t('auth.login.success'),
      data: await User.accessTokens.create(user),
    })
  }

  async logout({ response, auth, i18n }: HttpContext) {
    const user = auth.user!

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    ResponseJson({
      response,
      success: true,
      status: 200,
      message: i18n.t('auth.logout.success'),
    })
  }

  async me({ response, auth, i18n }: HttpContext) {
    ResponseJson({
      response,
      success: true,
      status: 200,
      message: i18n.t('auth.me.success'),
      data: auth.user,
    })
  }
}
