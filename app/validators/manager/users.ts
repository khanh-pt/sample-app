import vine from '@vinejs/vine'

export const listUsersValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).withoutDecimals().optional(),
    perPage: vine.number().min(1).withoutDecimals().optional(),
    filter: vine
      .record(vine.string())
      .validateKeys((keys, field) => {
        const validColumns = ['email', 'first_name', 'last_name']
        const validOperations = ['cont', 'eq']
        let invalidKeys: string[] = []

        keys.forEach((key) => {
          let columns = key.split('_')
          const operation = columns.pop()
          columns = columns.join('_').split('_or_')

          const isInvalidOperation = !operation || !validOperations.includes(operation)
          const isInvalidColumn =
            !columns.length || columns.find((column) => !validColumns.includes(column))

          if (isInvalidOperation || isInvalidColumn) {
            invalidKeys.push(key)
          }
        })
        if (invalidKeys.length) {
          field.report('', 'filter.invalid_key', field, { invalidKeys: invalidKeys.join(', ') })
        }
      })
      .optional(),
  })
)
