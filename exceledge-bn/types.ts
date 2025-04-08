export interface IRegisterUser {
  id?: string;
  firstName: string;
  secondName?: string;
  email: string;
  phone?: string;
  role?: string;
  password: string;
  gender?: string;
  dob?: Date;
}
export interface ILogin {
  email?: string;
  phone?: string;
  password: string;
}
