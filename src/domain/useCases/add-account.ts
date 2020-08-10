/* eslint-disable no-unused-vars */
import { AccountModel } from '../models/account'

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

export interface IAddAccount {
  add (account: AddAccountModel): AccountModel
}
