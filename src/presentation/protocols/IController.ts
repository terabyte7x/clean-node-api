/* eslint-disable no-unused-vars */
import { IHttpRequest, IHttpResponse } from '../protocols/IHttp'

export interface IController {
  handle (httpRequest: IHttpRequest):IHttpResponse
}
