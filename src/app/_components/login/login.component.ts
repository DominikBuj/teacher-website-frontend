import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../_services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = null;
  hidePassword = true;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    const currentUser = this.authService.user.value;
    if (!!currentUser) {
      this.snackBar.open(`Już zalogowano jako ${currentUser.username}`, 'Zamknij', {duration: 2000});
      this.router.navigateByUrl('');
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.getRawValue()).subscribe(() => {
      const returnUrl = this.route.snapshot.queryParams.returnUrl || '';
      this.router.navigateByUrl(returnUrl);
    });
  }
}
