// eslint-disable-next-line no-unused-vars
import { IHttpResponse } from '../protocols/IHttp'
import { ServerError } from '../errors/server-error'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
