import { Component } from '@angular/core';
import { ValidateService, emailFormatValidator } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    formErrors = {
      'name': '',
      'username': '',
      'email': '',
      'password': ''
    }

    validationMessages = {
      'name': {
        'required': 'Name is required',
        'minlength': 'Name must be at least 4 characters long',
        'maxlength': 'Name cannot be more than 24 characters long'
      },
      'username': {
        'required': 'Username is required',
        'minlength': 'Name must be at least 4 characters long',
        'maxlength': 'Name cannot be more than 24 characters long'
      },
      'email': {
        'required': 'E-mail is required',
        'emailFormat': 'E-mail format must be valid'
      },
      'password': {
        'required': 'Password is required',
        'minlength': 'Password must be at least 4 characters long',
        'maxlength': 'Password cannot be more than 24 characters long'
      }
    }

  constructor(private authService: AuthService,
              private flashMessagesService: FlashMessagesService,
              private router: Router,
              private formBuilder: FormBuilder) {
      this.createForm();
  }

  createForm() {
      this.registerForm = this.formBuilder.group({
          name:     ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)] ],
          username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)] ],
          email:    ['', [Validators.required, emailFormatValidator()] ],
          password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)] ]
      });

      this.registerForm.valueChanges.subscribe((data) => this.onValueChanged(data));
      this.onValueChanged(null);
  }

  onValueChanged(data: any) {
      if (!this.registerForm) { return; }

      for(const field in this.formErrors){
          this.formErrors[field] = '';
          const control = this.registerForm.get(field);
          if( control && control.dirty && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                console.log(key)
                this.formErrors[field] += messages[key] + ' ';
              }
          }
      }
      console.log(this.formErrors)
  }

  onRegisterSubmit() {
      const user = {
          name: this.registerForm.value.name,
          email: this.registerForm.value.email,
          username: this.registerForm.value.username,
          password: this.registerForm.value.password
      };

      // Required Fields
      if (!ValidateService.validateRegister(user)) {
          this.flashMessagesService.show('Please fill in all fields...', {cssClass: 'alert-danger', timeout: 3000});
          return false;
      }

      if (!ValidateService.validateEmail(user.email)) {
          this.flashMessagesService.show('Please use a valid e-mail...', {cssClass: 'alert-danger', timeout: 3000});
          return false;
      }

      // Register User
      this.authService.registerUser(user).subscribe(data => {
          if (data.success) {
              this.flashMessagesService.show('You are now registered and can log in', {cssClass: 'alert-success', timeout: 3000});
              this.router.navigate(['/login']);
          } else {
              this.flashMessagesService.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
              this.router.navigate(['/register']);
          }
      });
  }

}
