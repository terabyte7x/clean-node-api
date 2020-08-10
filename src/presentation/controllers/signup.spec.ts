/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { IEmailValidator } from '../protocols/IEmailValidator'
import { AddAccountModel, IAddAccount } from 'src/domain/useCases/add-account'
import { AccountModel } from 'src/domain/models/account'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
  addAccountStub: IAddAccount
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): IAddAccount => {
  class addAccountStub implements IAddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new addAccountStub()
}

const makeEmailValidatorWithError = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  // Stub, Spy, Double, Fake
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    addAccountStub,
    emailValidatorStub
  }
}

describe('Sign Up Controller', () => {
  test('Should return 400 if no nome is provided', () => {
    // SUT = System Under Test
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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

  test('Should return 400 if password confirmation fails', () => {
    // SUT = System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '_any_name',
        email: '_any_email',
        password: '_any_password',
        passwordConfirm: 'invalid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    // SUT = System Under Test
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: '_any_name',
        email: 'invalid_email@mail.com',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    // SUT = System Under Test
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: '_any_name',
        email: 'any_invalid_email@mail.com',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_invalid_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidatorWithError()

    const { addAccountStub } = makeSut()

    const sut = new SignUpController(emailValidatorStub, addAccountStub)

    const httpRequest = {
      body: {
        name: '_any_name',
        email: 'invalid_email@mail.com',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', () => {
    // SUT = System Under Test
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: '_any_name',
        email: 'any_valid_email@mail.com',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: '_any_name',
      email: 'any_valid_email@mail.com',
      password: '_any_password'
    })
  })
})
