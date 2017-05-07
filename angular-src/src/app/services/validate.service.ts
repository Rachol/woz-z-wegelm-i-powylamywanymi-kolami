import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms'
import { AuthService } from './auth.service'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map';

export class User{
  name: string;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class ValidateService {

    private static authService = null;

    constructor(authService: AuthService) {
      if (ValidateService.authService == null) {
        ValidateService.authService = authService;
      }
    }

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

    static isUsernameRegisteredValidator(control: AbstractControl) : Observable<ValidatorFn> {
      return new Observable((obs: any) => {
        control
        .valueChanges
        .debounceTime(400)
        .flatMap(value => ValidateService.authService.isUsernameRegistered(value))
        .subscribe(
          data => {
            obs.next(data['exists'] ? {userRegistered: 'username is registered'} : null );
            obs.complete();
          },
          error => {
            console.log(error);
            obs.next(null);
            obs.complete();
            }
        )
      })
    }

    static emailFormatValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: string} => {
            const email = control.value;
            return ValidateService.validateEmail(email) ? null :  {emailFormat: 'e-mail address invalid'};
        };
    }
}
