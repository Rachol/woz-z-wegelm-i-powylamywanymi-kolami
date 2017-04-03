/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../../services/auth.service-stub';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { RouterStub, FlashMessagesServiceStub } from '../../../testing';
import { newEvent, click } from '../../../testing';

let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let page: Page;

const authServiceStub = {
  isLoggedIn: true,
  user: { name: 'Test User'}
};

class Page {
    onLoginSubmitSpy: jasmine.Spy;
    navigateSpy: jasmine.Spy;

    usernameLabel: HTMLElement;
    usernameInput: HTMLInputElement;
    passwordLabel: HTMLElement;
    passwordInput: HTMLInputElement;

    loginButton: HTMLButtonElement;

    router: any; // Need to use any, otherwise I am not able to assign stubbed RouterStub to it.
    flashMessageService: any; // Need to use any, otherwise I am not able to assign stubbed FlashMessaheService to it.
    authService: any; // Need to use any, otherwise I am not able to assign stubbed AuthService to it.

    constructor() {
        this.router = fixture.debugElement.injector.get(Router); // get router from root injector
        this.flashMessageService = fixture.debugElement.injector.get(FlashMessagesService);
        this.authService = fixture.debugElement.injector.get(AuthService);
        this.onLoginSubmitSpy = spyOn(component, 'onLoginSubmit').and.callThrough();
        this.navigateSpy  = spyOn(this.router, 'navigate').and.callFake(() => {
            return true;
        });
    }

    addPageElements() {
      // have a hero so these elements are now in the DOM
        const labels = fixture.debugElement.queryAll(By.css('label'));
        const inputs = fixture.debugElement.queryAll(By.css('input'));

        this.usernameLabel  = labels[0].nativeElement;
        this.usernameInput  = inputs[0].nativeElement;

        this.passwordLabel  = labels[1].nativeElement;
        this.passwordInput  = inputs[1].nativeElement;

        this.loginButton      = fixture.debugElement.query(By.css('button')).nativeElement;
    }
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
        schemas: [
            NO_ERRORS_SCHEMA
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
        page = new Page();
        page.addPageElements();
        fixture.detectChanges();
    });
    tests();
});

function tests() {
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should ask for username', () => {
        expect(page.usernameLabel.textContent).toContain('Username:');
    });

    it('should ask for password', () => {
        expect(page.passwordLabel.textContent).toContain('Password:');
    });

    it('should try to login when Login button pressed', () => {
        page.loginButton.click();
        expect(page.onLoginSubmitSpy.calls.any()).toBe(true, 'auth.service.onLoginSubmit() called');
    });

    it('should not allow login if username is missing', async(() => {
        const testpassword = 'Test password';

        fixture.whenStable().then(() => {
            setCredentials('', 'Password');
            expect(component.password).toBe('Password');
            page.loginButton.click();
            expect(page.flashMessageService.msg).toBe('Please enter username',
                                                 'flash message shows \'Please enter username\'');
        });
    }));

    it('should not allow login if password is missing', async(() => {
        const testUserName = 'Test user';

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            setCredentials('Username', '');
            expect(component.username).toBe('Username');
            page.loginButton.click();
            expect(page.flashMessageService.msg).toBe('Please enter password',
                                                 'flash message shows \'Please enter password\'');
        });
    }));

    it('should try to login with both username and password provided', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            setCredentials('Username', 'Password');
            const authenticateUserSpy = spyOn(page.authService, 'authenticateUser').and.callThrough();
            page.loginButton.click();
            expect(authenticateUserSpy.calls.count()).toBe(1, 'Should call authenticateUser once');
        });
    }));

    it('should show error message if entered credentials are invalid and navigate to login page', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            setCredentials('Username', 'Password');
            page.authService.allowAuthenticateUser = false;
            const authenticateUserSpy = spyOn(page.authService, 'authenticateUser').and.callThrough();
            page.loginButton.click();
            expect(page.flashMessageService.msg).toBe(page.authService.wrongCredentialsMsg,
                                                 'flash message shows \'Please enter password\'');
            expect(page.navigateSpy.calls.first().args[0][0]).toBe('/login', 'router.navigate called');
        });
    }));

    it('should show success message if entered credentials are valid and navigate to dashboard page', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            setCredentials('Username', 'Password');
            page.authService.allowAuthenticateUser = true;
            const authenticateUserSpy = spyOn(page.authService, 'authenticateUser').and.callThrough();
            page.loginButton.click();
            expect(page.flashMessageService.msg).toBe('You are now logged in',
                                                 'flash message shows \'Please enter password\'');
            expect(page.navigateSpy.calls.first().args[0][0]).toBe('/dashboard', 'router.navigate called');
        });
    }));
}

function setCredentials(username: string, password: string) {
    page.usernameInput.value = username;
    page.usernameInput.dispatchEvent(newEvent('input'));
    page.passwordInput.value = password;
    page.passwordInput.dispatchEvent(newEvent('input'));
}
