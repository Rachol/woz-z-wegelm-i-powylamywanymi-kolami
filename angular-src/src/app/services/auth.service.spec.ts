/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Http } from '@angular/http';

let service: AuthService;

class HttpStub {
  get() { };
  post() { };
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

  it('should ...', () => {
    expect(service).toBeTruthy();
  });
});
