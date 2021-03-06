import { roleEnum } from '@core/enums/role.enum';

export interface IUserValues {
  email: string;
  firstName: string;
  lastName: string;
  role: roleEnum;
}

export interface IUser {
  key: string;
  values: IUserValues;
}

export interface IUserRegisterData extends IUserValues {
  password: string;
}

export interface IBasicUser {
  email: string;
  uid: string;
  role: roleEnum;
}
