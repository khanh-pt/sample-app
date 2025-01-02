import vine from '@vinejs/vine'

export const updateValidator = vine.compile(
  vine.object({
    first_name: vine.string().optional(),
    last_name: vine.string().optional(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const existedUser = await db.from('users').select('id').where('email', value).first()

        return !existedUser
      })
      .optional(),
  })
)
