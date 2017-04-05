/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { RouterLinkStubDirective, RouterLinkActiveStubDirective, click } from '../../../testing';
import { Router, RouterLinkActive } from '@angular/router';

let component: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;

class AuthServiceStub {
    logoutUser() { };
    loggedIn() { };
}

class RouterStub {
    navigate() { };
}

class FlashMessagesServiceStub {
    show() { };
}

describe('NavbarComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            NavbarComponent,
            RouterLinkStubDirective,
            RouterLinkActiveStubDirective
        ],
        providers: [
            {provide: AuthService, useClass: AuthServiceStub},
            {provide: Router, useClass: RouterStub},
            {provide: FlashMessagesService, useClass: FlashMessagesServiceStub}
        ],
        schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
    });

    tests();
});

function tests() {
    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should contain link to the Home page', () => {
        fixture.detectChanges();
        const links = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective))
            .map(de => de.injector.get(RouterLinkStubDirective).params);
        expect(links).toContain('/', 'should contain link to home/main page');
    });

    it('should show login and register links if user not logged in', () => {
        const authService: AuthService = fixture.debugElement.injector.get(AuthService);
        const authServiceSpy = spyOn(authService, 'loggedIn').and.returnValue(false);
        fixture.detectChanges();
        const links = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective))
            .map(de => de.injector.get(RouterLinkStubDirective).params);
        expect(links).toContain('/login', 'should contain link to login page');
        expect(links).toContain('/register', 'should contain link to register page');
    });

    it('should not show login and register links if user logged in', () => {
        const authService: AuthService = fixture.debugElement.injector.get(AuthService);
        const authServiceSpy = spyOn(authService, 'loggedIn').and.returnValue(true);
        fixture.detectChanges();
        const links = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective))
            .map(de => de.injector.get(RouterLinkStubDirective).params);
        expect(links).not.toContain('/login', 'should not contain link to login page');
        expect(links).not.toContain('/register', 'should not contain link to register page');
    });

    it('should show dashboard, profile and logout links if user logged in', () => {
        const authService: AuthService = fixture.debugElement.injector.get(AuthService);
        const authServiceSpy = spyOn(authService, 'loggedIn').and.returnValue(true);
        fixture.detectChanges();
        const links = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective))
            .map(de => de.injector.get(RouterLinkStubDirective).params);
        const logoutLink = fixture.debugElement.query(By.css('#logoutlink'));
        expect(links).toContain('/dashboard', 'should contain link to dashboard page');
        expect(links).toContain('/profile', 'should contain link to profile page');
        expect(logoutLink).not.toBe(null, 'should contain logout');
    });

    it('should not show dashboard, profile and logout links if user not logged in', () => {
        const authService: AuthService = fixture.debugElement.injector.get(AuthService);
        const authServiceSpy = spyOn(authService, 'loggedIn').and.returnValue(false);
        fixture.detectChanges();
        const links = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective))
            .map(de => de.injector.get(RouterLinkStubDirective).params);
        const logoutLink = fixture.debugElement.query(By.css('#logoutlink'));
        expect(links).not.toContain('/dashboard', 'should not contain link to dashboard page');
        expect(links).not.toContain('/profile', 'should not contain link to profile page');
        expect(logoutLink).toBe(null, 'should not contain logout');
    });

    it('should try to logout when Logout link pressed', () => {
        const authService: AuthService = fixture.debugElement.injector.get(AuthService);
        const authServiceSpy = spyOn(authService, 'loggedIn').and.returnValue(true);
        const onLogoutClickSpy = spyOn(component, 'onLogoutClick').and.callThrough();
        fixture.detectChanges();
        const logoutLink = fixture.debugElement.query(By.css('#logoutlink')).nativeElement;
        click(logoutLink);
        expect(onLogoutClickSpy.calls.count()).toBe(1, 'onLogoutClickSpy() called');
    });

    it('should logout user using authService', () => {
        const authService: AuthService = fixture.debugElement.injector.get(AuthService);
        const authServiceSpy = spyOn(authService, 'logoutUser').and.callThrough();
        component.onLogoutClick();
        expect(authServiceSpy.calls.count()).toBe(1, 'logoutUser called');
    });

    it('should show message to the user when user is logged out', () => {
        const flashMessageService: FlashMessagesService = fixture.debugElement.injector.get(FlashMessagesService);
        const flashMessageServiceSpy = spyOn(flashMessageService, 'show').and.callThrough();
        component.onLogoutClick();
        expect(flashMessageServiceSpy.calls.mostRecent().args[0]).toBe('You are now logged out', 'Loggout message shown');
    });

    it('should navigate to login page after user is logged out', () => {
        const router: Router = fixture.debugElement.injector.get(Router);
        const routerSpy = spyOn(router, 'navigate').and.callThrough();
        component.onLogoutClick();
        expect(routerSpy.calls.mostRecent().args[0][0]).toBe('/login', 'Navigated to login page');
    });

}
