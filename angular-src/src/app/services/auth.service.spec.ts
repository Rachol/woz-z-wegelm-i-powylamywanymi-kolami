/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import * as Users from '../../../../server-src/src/routes/user-stub'
import {UserRoutesStub} from "../../../../server-src/src/routes/user-stub";

let service: AuthService;

class HttpStub {
  get() { return new Observable<Response>() };
  post() { return new Observable<Response>() };
}

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: Http, useClass: HttpStub}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.get(AuthService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should provide correct parameters to POST when registering user', () => {
    const onPostSpy = spyOn(TestBed.get(Http), 'post').and.callThrough();
    let userData = {
      name: "name",
      username: "username",
      password: "password,",
      email: "email"
    };
    service.registerUser(userData);
    // make sure that the data sent is what is expected by the server API
    const serverStub = new Users.UserRoutesStub();
    serverStub.postRegister(userData, new Users.UserResponseAPI())

    const postRegisterParameters = onPostSpy.calls.mostRecent().args;

    expect(postRegisterParameters[0]).toContain('/register');
    expect(postRegisterParameters[1]).toBe(userData);
  });

  it('should provide correct parameters to POST when authenticating user', () => {
    const onPostSpy = spyOn(TestBed.get(Http), 'post').and.callThrough();
    let userData = {
      username: "username",
      password: "password,"
    };
    service.authenticateUser(userData);
    // make sure that the data sent is what is expected by the server API
    const serverStub = new Users.UserRoutesStub();
    serverStub.postAuthenticate(userData, new Users.UserResponseAPI())

    const postAuthenticateParameters = onPostSpy.calls.mostRecent().args;

    expect(postAuthenticateParameters[0]).toContain('/authenticate');
    expect(postAuthenticateParameters[1]).toBe(userData);
  });

  it('should provide correct parameters to GET when requesting user profile', () => {
    const onPostSpy = spyOn(TestBed.get(Http), 'get').and.callThrough();
    service.getUserProfile();
    // make sure that the data sent is what is expected by the server API
    const serverStub = new Users.UserRoutesStub();
    serverStub.getProfile(new Users.UserResponseAPI())

    const getProfileParameters = onPostSpy.calls.mostRecent().args;

    expect(getProfileParameters[0]).toContain('/profile');
    expect(getProfileParameters[1].headers).not.toBe(undefined, 'json data not provided, headers should be here');
  });

});
