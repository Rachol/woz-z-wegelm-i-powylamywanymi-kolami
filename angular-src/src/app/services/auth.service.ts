import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { environment } from '../../environments/environment'

@Injectable()
export class AuthService {
  authToken: string;
  user: any;

  constructor(private http: Http) {
  }

  registerUser(user: UserRegistrationData) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(environment.serverUrl + '/users/register', user, {headers: headers}).map(res => res.json());
  };

  authenticateUser(user: UserValidationData) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(environment.serverUrl + '/users/authenticate', user, {headers: headers}).map(res => res.json());
  };

  updateUser(data: UpdateUserData) {
    const headers = new Headers();
    console.log("Updating user with: ", data);
    headers.append('Content-Type', 'application/json');
    return this.http.post(environment.serverUrl + '/users/update', data, {headers: headers}).map(res => res.json());
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
    headers.append('Content-Type', 'application/json');
    return this.http.get(environment.serverUrl + '/users/profile', {headers: headers}).map(res => res.json());
  }

  getToken() {
    return this.authToken;
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

export interface UpdateUserData {
  username: string;
  scripts: [{
    name: string,
    uploadDate: number,
    wins: number,
    games: number
  }]
}

