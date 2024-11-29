import type { Response } from '@adonisjs/core/http'

type ResponseJsonType = {
  response: Response
  status: number
  success: boolean
  message: string
  meta?: any
  data?: any
  errors?: any
}
export const ResponseJson = ({
  response,
  status,
  success,
  message,
  meta,
  data,
  errors,
}: ResponseJsonType) => {
  response.status(status).send({
    success,
    message,
    meta,
    data,
    errors,
  })
}
