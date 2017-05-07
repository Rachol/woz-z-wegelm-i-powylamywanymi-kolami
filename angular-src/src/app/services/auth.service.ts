import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
    authToken: string;
    user: any;

  constructor(private http: Http) { }

    registerUser(user: UserRegistrationData) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3001/users/register', user, {headers: headers}).map(res => res.json());
    };

    authenticateUser(user: UserValidationData) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3001/users/authenticate', user, {headers: headers}).map(res => res.json());
    };

    storeUserData(token: string, user: any) {
        this.authToken = token;
        this.user = user;
        localStorage.setItem('id_token', token); // JWT automatically looks after id_token
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUserProfile() {
        const headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        return this.http.get('http://localhost:3001/users/profile', {headers: headers}).map(res => res.json());
    }

    isUsernameRegistered(username: string) {
        return this.http.get('http://localhost:3001/users/exists?username='+username).map(res => res.json());
    }

    loadToken() {
        const token = localStorage.getItem('id_token');
        this.authToken = token;
    }

    loggedIn() {
        return tokenNotExpired('id_token');
    }

    logoutUser() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    }
}

export interface UserValidationData {
    username: string;
    password: string;
}

export interface UserRegistrationData {
  name: string
  username: string;
  email: string;
  password: string;
}
