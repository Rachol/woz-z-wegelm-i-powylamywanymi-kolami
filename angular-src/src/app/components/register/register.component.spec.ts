///<reference path="register.component.ts"/>
/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { click, newEvent } from '../../../testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let component: RegisterComponent;
let fixture: ComponentFixture<RegisterComponent>;

class AuthServiceStub {
  registerUser() { };
}

class RouterStub {
  navigate() { };
}

class FlashMessagesServiceStub {
  show() { };
}

describe('RegisterComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        {provide: AuthService, useClass: AuthServiceStub},
        ValidateService,
        {provide: Router, useClass: RouterStub},
        {provide: FlashMessagesService, useClass: FlashMessagesServiceStub}
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  tests();
});

function tests() {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should try to register when register button pressed', () => {
    const onRegisterSubmitSpy = spyOn(component, 'onRegisterSubmit').and.callThrough();
    const registerButton = fixture.debugElement.query(By.css('#registerbutton')).nativeElement;
    click(registerButton);
    expect(onRegisterSubmitSpy.calls.any()).toBe(true, 'onRegisterSubmit() called');
  });

  it('should set user data from input field to the component\'s user variable', async(() => {
    const testName = 'Test name';
    const nameInput = fixture.debugElement.query(By.css('#name')).nativeElement;
    const testUserName = 'Test username';
    const usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;
    const testPassword = 'Test password';
    const passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
    const testEmail = 'Test email';
    const emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;

    fixture.whenStable().then(() => {
      nameInput.value = testName;
      usernameInput.value = testUserName;
      passwordInput.value = testPassword;
      emailInput.value = testEmail;

      nameInput.dispatchEvent(newEvent('input'));
      usernameInput.dispatchEvent(newEvent('input'));
      passwordInput.dispatchEvent(newEvent('input'));
      emailInput.dispatchEvent(newEvent('input'));

      expect(component.registerForm.value.name).toBe(testName);
      expect(component.registerForm.value.username).toBe(testUserName);
      expect(component.registerForm.value.password).toBe(testPassword);
      expect(component.registerForm.value.email).toBe(testEmail);
    });
  }));

  it('should navigate to login page after successful registration', () => {
    spyOn(fixture.debugElement.injector.get(AuthService), 'registerUser').and.callFake(() => {
      return new BehaviorSubject({success: true}).asObservable();
    });
    const onShowMessageSpy = spyOn(fixture.debugElement.injector.get(FlashMessagesService), 'show').and.callThrough();
    const routerSpy = spyOn(fixture.debugElement.injector.get(Router), 'navigate').and.callThrough();
    fillUserInfo('Test name', 'Test username', 'Test password', 'Test@email.com');
    component.onRegisterSubmit();
    expect(onShowMessageSpy.calls.mostRecent().args[0]).toBe('You are now registered and can log in',
      'User shall be registered');
    expect(routerSpy.calls.mostRecent().args[0][0]).toBe('/login', 'shall navigate to login page');
  });

  it('should navigate to register page after unsuccessful registration', () => {
    spyOn(fixture.debugElement.injector.get(AuthService), 'registerUser').and.callFake(() => {
      return new BehaviorSubject({success: false}).asObservable();
    });
    const onShowMessageSpy = spyOn(fixture.debugElement.injector.get(FlashMessagesService), 'show').and.callThrough();
    const routerSpy = spyOn(fixture.debugElement.injector.get(Router), 'navigate').and.callThrough();
    fillUserInfo('Test name', 'Test username', 'Test password', 'Test@email.com');
    component.onRegisterSubmit();
    expect(onShowMessageSpy.calls.mostRecent().args[0]).toBe('Something went wrong',
      'User shall be registered');
    expect(routerSpy.calls.mostRecent().args[0][0]).toBe('/register', 'shall navigate to register page');
  });

}

function fillUserInfo(name:string, username: string, password: string, email: string) {
  component.registerForm.setValue({
    name: name,
    username: username,
    password: password,
    email: email
  });
}
