import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService) {
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      login: [''],
      password: [''],
    });

  }

  onSubmit() {
    console.log('submit changes')
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.controls.login.value, this.loginForm.controls.password.value)
        .subscribe((data) => {
          console.log(data);
        },
          (error) => {
            console.log("we got error");
            console.log(error);
          }
        )
    }
  }

  /*test() {
    this.loginService.test().subscribe((data) => {
      console.log("work");
      console.log(data);
    },
      (error) => {
        console.log("we got error");
        console.log(error);
      }
    )
  }*/


}
