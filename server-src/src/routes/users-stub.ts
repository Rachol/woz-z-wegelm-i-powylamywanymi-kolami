/**
 * Created by rafal on 15/04/2017.
 */
// Import needed class and export them, so the stub is self-contained.
import { IUserService, UserAuthenticateData, UserRegisterData, UserResponseAPI } from './users-common';
export { IUserService, UserAuthenticateData, UserRegisterData, UserResponseAPI } from './users-common';

export class UserServiceStub extends IUserService{
    postRegister(userData: UserRegisterData, res: UserResponseAPI): any {}
    postAuthenticate(userData: UserAuthenticateData, res: UserResponseAPI): any {}
    getProfile(res: UserResponseAPI): any {}
}
