import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms'

export class User{
  name: string;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class ValidateService {

    constructor() { }

    static validateRegister(user: User) {
        if (!user.name || !user.username || !user.email || !user.password) {
            return false;
        } else {
            return true;
        }
    }

    static validateEmail(email: string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}

/** A hero's name can't match the given regular expression */
export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: string} => {
    const email = control.value;
    return ValidateService.validateEmail(email) ? null :  {emailFormat: 'e-mail address invalid'} ;
  };
}

