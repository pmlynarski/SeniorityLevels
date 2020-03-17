import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { ROUTES_PATH } from '@constants/routes.constants';
import { RoutesConst } from '@core/interfaces';
import { AuthenticationService } from '@modules/authentication';
import { equalityValidator } from '@shared/equality.validator';
import { AppFormControl, AppFormGroup } from '@shared/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  registerForm: AppFormGroup;
  message: string;
  routes: RoutesConst;

  constructor(private authService: AuthenticationService, private chRef: ChangeDetectorRef, private router: Router) {
    this.registerForm = new AppFormGroup({
      email: new AppFormControl('', [Validators.required, Validators.email]),
      firstName: new AppFormControl('', [Validators.required]),
      lastName: new AppFormControl('', [Validators.required]),
      password: new AppFormControl('', Validators.required),
      repeatPassword: new AppFormControl('', [Validators.required, equalityValidator('password')]),
    });
    this.message = '';
    this.routes = ROUTES_PATH;
  }

  get email() {
    return this.registerForm.get('email') as AppFormControl;
  }

  get firstName() {
    return this.registerForm.get('firstName') as AppFormControl;
  }

  get lastName() {
    return this.registerForm.get('lastName') as AppFormControl;
  }

  get password() {
    return this.registerForm.get('password') as AppFormControl;
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword') as AppFormControl;
  }

  get formData() {
    return {
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
    };
  }

  sendCredentials = (): void => {
    this.registerForm.disable();
    this.authService.registerUser(this.email.value, this.password.value).subscribe(
      (user) => {
        this.authService.provideAdditionalUserData(this.formData, user.user.uid).subscribe(
          () => {
            this.registerForm.enable();
            this.router.navigate([this.routes.users]);
          },
          (error) => {
            this.registerForm.enable();
            throwError(error);
          },
        );
      },
      ({ message }) => {
        this.registerForm.enable();
        this.message = message;
        this.chRef.markForCheck();
      },
    );
  };
}
