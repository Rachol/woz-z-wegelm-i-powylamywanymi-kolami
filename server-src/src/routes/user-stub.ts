/**
 * Created by rafal on 15/04/2017.
 */
// Import needed class and export them, so the stub is self-contained.
import { IUserRoutes, UserAuthenticateData, UserRegisterData, UserResponseAPI } from './user-common';
export { IUserRoutes, UserAuthenticateData, UserRegisterData, UserResponseAPI } from './user-common';

export class UserRoutesStub extends IUserRoutes{
    postRegister(userData: UserRegisterData, res: UserResponseAPI): any {}
    postAuthenticate(userData: UserAuthenticateData, res: UserResponseAPI): any {}
    getProfile(res: UserResponseAPI): any {}
    getExists(params: {username: string}, res: UserResponseAPI): any {}
}
