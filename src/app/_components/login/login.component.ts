import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../_services/auth.service';
import {LoginForm} from '../../_models/login-form.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: LoginForm;
  hidePassword = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = new LoginForm(undefined, undefined);
  }

  ngOnInit(): void {
    const user = this.authService.user.value;
    if (user) {
      console.log(`already logged in as ${user.username}`);
      this.router.navigateByUrl('');
    }
  }

  onSubmit(): void {
    this.authService.login(this.loginForm).subscribe(_ => {
      const returnUrl = this.route.snapshot.queryParams.returnUrl || '';
      this.router.navigateByUrl(returnUrl);
    });
  }
}
