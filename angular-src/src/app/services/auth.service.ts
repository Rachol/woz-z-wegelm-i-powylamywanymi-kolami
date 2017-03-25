import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    authToken: String;
    user: User;

  constructor(private http: Http) { }

    registerUser(user) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3001/users/register', user, {headers: headers}).map(res => res.json());
    };

    authenticateUser(user) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3001/users/authenticate', user, {headers: headers}).map(res => res.json());
    };

    storeUserData(token, user) {
        localStorage.setItem('id_token', token); // JWT automatically looks after id_token
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    }

    logoutUser() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    }
}

export interface User {
    username: String;
    password: String;
}
