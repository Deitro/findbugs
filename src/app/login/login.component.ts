import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessage = '';
  redirectUrl = '';
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(){
    this.form = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });

    // logout the person when he opens the app for the first time
    this.authService.logout();
    this.redirectUrl = this.route.snapshot.queryParams.redirectUrl || '/';
  }

  login() {
    this.errorMessage = '';
    const val = this.form.value;

    if (val.Username && val.Password) {
      this.authService.login(val.Username, val.Password)
      .subscribe(() => {
        this.router.navigateByUrl('/');
      }, error => {
        this.errorMessage = error;
      });
    }
  }
}
