import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('Sign Up Controller', () => {
  test('Should return 400 if no nome is provided', () => {
    // SUT = System Under Test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        // name: '_any_name',
        email: '_any_email',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    // SUT = System Under Test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: '_any_name',
        // email: '_any_email',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    // SUT = System Under Test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: '_any_name',
        email: '_any_email',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    // SUT = System Under Test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: '_any_name',
        email: '_any_email',
        password: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
})
