import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ROUTES_PATH } from '@constants/routes.constants';
import { RoutesConst } from '@core/interfaces';
import { AuthenticationService } from '@modules/authentication';
import { AppFormControl, AppFormGroup } from '@shared/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly loginForm: AppFormGroup;
  readonly routes: RoutesConst;
  errorMessage: string;

  constructor(private router: Router, private cdRef: ChangeDetectorRef, private authService: AuthenticationService) {
    this.loginForm = new AppFormGroup({
      email: new AppFormControl('', [Validators.required, Validators.email]),
      password: new AppFormControl('', [Validators.required]),
    });
    this.errorMessage = '';
    this.routes = ROUTES_PATH;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  sendCredentials = (): void => {
    this.authService.signIn(this.email.value, this.password.value).subscribe(
      () => this.handleCredentialSuccess(),
      (error) => this.handleCredentialsError(error.message),
    );
  };

  handleCredentialSuccess(): void {
    this.authService.getTokenRemotely().subscribe(
      (user) => {
        user.getIdToken().then((token) => {
          this.authService.putTokenInSessionStorage(token);
          this.router.navigate([this.routes.users]);
        });
      },
      (error) => {
        this.handleCredentialsError(error.message);
      },
    );
  }

  handleCredentialsError(message) {
    this.errorMessage = message;
    this.cdRef.markForCheck();
  }
}
