/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { newEvent, click } from '../../../testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;

function setCredentials(username: string, password: string) {
    component.username = username;
    component.password = password;
}

class AuthServiceStub {
    authenticateUser() {};
    storeUserData() {};
}

class RouterStub {
    navigate() {};
}

class FlashMessagesServiceStub {
    show() {};
}

describe('LoginComponent', () => {

  beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            LoginComponent
        ],
        providers: [
            {provide: AuthService, useClass: AuthServiceStub },
            {provide: Router, useClass: RouterStub },
            {provide: FlashMessagesService, useClass: FlashMessagesServiceStub }
        ],
        imports: [
            FormsModule
        ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    tests();
});

function tests() {
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should try to login when Login button pressed', () => {
        const onLoginSubmitSpy = spyOn(component, 'onLoginSubmit').and.callThrough();
        const loginButton = fixture.debugElement.query(By.css('#loginbutton')).nativeElement;
        loginButton.click();
        expect(onLoginSubmitSpy.calls.any()).toBe(true, 'onLoginSubmit() called');
    });

    it('should set username from input field to the component\'s username variable', async(() => {
        const testUserName = 'Test username';
        const usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;

        fixture.whenStable().then(() => {
            usernameInput.value = testUserName;
            usernameInput.dispatchEvent(newEvent('input'));
            expect(component.username).toBe(testUserName);
        });
    }));

    it('should set password from input field  to the component\'s password variable', async(() => {
        const testpassword = 'Test password';
        const passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;

        fixture.whenStable().then(() => {
            passwordInput.value = testpassword;
            passwordInput.dispatchEvent(newEvent('input'));
            expect(component.password).toBe(testpassword);
        });
    }));

    it('should not allow login if username is missing', () => {
        const flashMessageServiceSpy = spyOn(fixture.debugElement.injector.get(FlashMessagesService), 'show').and.callThrough();

        component.username = '';
        component.password = 'Test password';
        component.onLoginSubmit();

        expect(flashMessageServiceSpy.calls.mostRecent().args[0]).toBe('Please enter username');
    });

    it('should not allow login if password is missing', () => {
        const flashMessageServiceSpy = spyOn(fixture.debugElement.injector.get(FlashMessagesService), 'show').and.callThrough();

        component.username = 'Test username';
        component.password = '';
        component.onLoginSubmit();

        expect(flashMessageServiceSpy.calls.mostRecent().args[0]).toBe('Please enter password');
    });

    it('should try to login with both username and password provided', () => {
        const authService: AuthService = fixture.debugElement.injector.get(AuthService);
        const authServiceSpy = spyOn(authService, 'authenticateUser').and.callFake(() => {
            return new BehaviorSubject({data: {success: false}}).asObservable();
        });

        component.username = 'Test username';
        component.password = 'Test password';
        component.onLoginSubmit();

        expect(authServiceSpy.calls.count()).toBe(1, 'Should call authenticateUser once');
    });

    it('should show error message if entered credentials are invalid and navigate to login page', () => {
        const authServiceSpy = spyOn(fixture.debugElement.injector.get(AuthService), 'authenticateUser').and.callFake(() => {
            return new BehaviorSubject({data: {success: false}}).asObservable();
        });
        const flashMessageServiceSpy = spyOn(fixture.debugElement.injector.get(FlashMessagesService), 'show').and.callThrough();
        const routerSpy = spyOn(fixture.debugElement.injector.get(Router), 'navigate');

        component.username = 'Test username';
        component.password = 'Test password';
        component.onLoginSubmit();

        expect(flashMessageServiceSpy.calls.count()).toBe(1, 'Should show error message from authentication service');

        expect(routerSpy.calls.mostRecent().args[0][0]).toBe('/login', 'router.navigate called');
    });

    it('should show success message if entered credentials are valid and navigate to dashboard page', () => {
        const authServiceSpy = spyOn(fixture.debugElement.injector.get(AuthService), 'authenticateUser').and.callFake(() => {
            return new BehaviorSubject({success: true}).asObservable();
        });
        const flashMessageServiceSpy = spyOn(fixture.debugElement.injector.get(FlashMessagesService), 'show').and.callThrough();
        const routerSpy = spyOn(fixture.debugElement.injector.get(Router), 'navigate');

        component.username = 'Test username';
        component.password = 'Test password';
        component.onLoginSubmit();

        expect(flashMessageServiceSpy.calls.mostRecent().args[0]).toBe('You are now logged in',
                                                                       'Should show error message from authentication service');

        expect(routerSpy.calls.mostRecent().args[0][0]).toBe('/dashboard', 'router.navigate called');
    });
}
