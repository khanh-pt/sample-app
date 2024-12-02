import vine from '@vinejs/vine'

export const password = vine.string().minLength(8)

export const registerValidator = vine.compile(
  vine.object({
    first_name: vine.string(),
    last_name: vine.string(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const existedUser = await db.from('users').select('id').where('email', value).first()

        return !existedUser
      }),
    password,
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password,
  })
)
