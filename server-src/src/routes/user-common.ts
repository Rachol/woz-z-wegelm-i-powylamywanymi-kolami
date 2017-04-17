/**
 * Created by rafal on 16/04/2017.
 */
export interface UserRegisterData {
    name: string;
    email: string;
    username: string;
    password: string;
}

export interface UserAuthenticateData {
    username: string;
    password: string;
}

export class UserResponseAPI {
    json(parameter: object) {}
};

export abstract class IUserRoutes {
    abstract postRegister(userData: UserRegisterData, res: UserResponseAPI): any;
    abstract postAuthenticate(userData: UserAuthenticateData, res: UserResponseAPI): any;
    abstract getProfile(res: UserResponseAPI): any;
}