import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthServiceStub {
    authToken: string;
    user: User;
    allowRegisterUser = true;
    allowAuthenticateUser = true;
    userLoggedIn = false;
    wrongCredentialsMsg = 'Wrong password';

    registerUser(user) {
        return {
            success: this.allowRegisterUser,
            msg: this.allowRegisterUser ? 'User registered' : 'Failed to register user'
        };
    };

    authenticateUser(user) {
        let retVal = {};
        if (this.allowAuthenticateUser) {
            retVal = {
                success: true,
                token: 'JWT Token',
                user: {
                    id: 'test_id',
                    name: 'test_name',
                    username: 'test_username',
                    email: 'test_email'
                }
            };
        } else {
            retVal =  {
                success: false,
                msg: this.wrongCredentialsMsg
            };
        }

        const subject = new BehaviorSubject(retVal);
        return subject.asObservable();
    };

    storeUserData(token, user) {
        this.authToken = token;
        this.user = user;
        this.userLoggedIn = true;
    }

    getUserProfile() {
        this.loadToken();
        return this.user;
    }

    loadToken() {
        this.authToken = 'JWT Token';
    }

    loggedIn() {
        return this.userLoggedIn;
    }

    logoutUser() {
        this.authToken = null;
        this.user = null;
    }
}

export interface User {
    username: string;
    password: string;
}
