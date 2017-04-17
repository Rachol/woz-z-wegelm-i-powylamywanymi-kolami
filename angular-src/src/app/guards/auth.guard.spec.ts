import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

class AuthServiceStub {
  loggedIn() {};
}

class RouterStub {
  navigate() {};
}

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {provide: AuthService, useClass: AuthServiceStub},
        {provide: Router, useClass: RouterStub}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should create service', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should return true if user logged in', inject([AuthGuard], (guard: AuthGuard) => {
    let onLoggedInSpyTrue = spyOn(TestBed.get(AuthService), 'loggedIn').and.returnValue(true);
    expect(guard.canActivate(null, null)).toBe(true);
  }));

  it('should return false if user not logged in', inject([AuthGuard], (guard: AuthGuard) => {
    let onLoggedInSpyTrue = spyOn(TestBed.get(AuthService), 'loggedIn').and.returnValue(false);
    expect(guard.canActivate(null, null)).toBe(false);
  }));

});
