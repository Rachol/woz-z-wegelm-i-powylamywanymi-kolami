/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../services/auth.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let component: ProfileComponent;
let fixture: ComponentFixture<ProfileComponent>;

const testUserData = {
    user: {
        name: 'Name',
        username: 'Username',
        email: 'email'}
};

class AuthServiceStub {
    getUserProfile() {
        return new BehaviorSubject(testUserData).asObservable();
    };
}

describe('ProfileComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ProfileComponent ],
            providers: [
                {provide: AuthService, useClass: AuthServiceStub}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        // this is used by ngOnInit function, so needs to provided for every test
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should populate user from authentication service', () => {
        expect(component.user).toBe(testUserData.user);
    });
});
