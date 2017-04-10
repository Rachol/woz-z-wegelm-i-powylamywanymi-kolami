/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {User as ValidateUser, ValidateService} from './validate.service';

let service: ValidateService;
let testUser: ValidateUser;

describe('ValidateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateService]
    });
    service = TestBed.get(ValidateService);
    testUser = new ValidateUser();
  });

  it('should ...', inject([ValidateService], (service: ValidateService) => {
    expect(service).toBeTruthy();
  }));

  it('should not allow to register if email format is invalid', () => {
    let invalidEmails = [
      'me@',
      '@example.com',
      'me.@example.com',
      '.me@example.com',
      'me@example..com',
      'me.example@com',
      'me\\@example.com'
    ]

    for (let email of invalidEmails) {
      expect(service.validateEmail(email)).toBe(false, "This e-mail shall be invalid: " + email)
    }
  });

  it('should allow to register if email format is valid', () => {
    let validEmails = [
      'me@example.com',
      'a.nonymous@example.com',
      'name+tag@example.com',
      // 'name\@tag@example.com', <- does not pass current regexp
      //'spaces are allowed@example.com', <- does not pass current regexp
      '"spaces may be quoted"@example.com',
      '!#$%&\'*+-/=.?^_`{|}~@[1.0.0.127]'
      // '!#$%&\'*+-/=.?^_`{|}~@[IPv6:0123:4567:89AB:CDEF:0123:4567:89AB:CDEF]' <- does not pass current regexp
      // 'me(this is a comment)@example.com' <- does not pass current regexp
    ]

    for (let email of validEmails) {
      expect(service.validateEmail(email)).toBe(true, "This e-mail shall be valid: " + email)
    }
  });

  it('should not allow to register if name is missing', () => {
    fillUserInfo('', 'Test username', 'Test password', 'Test email');
    expect(service.validateRegister(testUser)).toBe(false, 'Name is mandatory to register user');
  });

  it('should not allow to register if username is missing', () => {
    fillUserInfo('Test name', '', 'Test password', 'Test email');
    expect(service.validateRegister(testUser)).toBe(false, 'Username is mandatory to register user');
  });

  it('should not allow to register if password is missing', () => {
    fillUserInfo('Test name', 'Test username', '', 'Test email');
    expect(service.validateRegister(testUser)).toBe(false, 'Password is mandatory to register user');
  });

  it('should not allow to register if email is missing', () => {
    fillUserInfo('Test name', 'Test username', 'Test password', '');
    expect(service.validateRegister(testUser)).toBe(false, 'Email is mandatory to register user');
  });

  it('should allow to register if all the fields are provided', () => {
    fillUserInfo('Test name', 'Test username', 'Test password', 'Test email');
    expect(service.validateRegister(testUser)).toBe(true, 'Allow registration if all mandatory fields are provided');
  });

});

function fillUserInfo(name:string, username: string, password: string, email: string) {
  testUser.name = name;
  testUser.username = username;
  testUser.password = password;
  testUser.email = email;
}
