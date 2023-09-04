import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // ngModel variables
  email: string = "";
  password: string = "";
  private apiUrl = 'http://localhost:3000/users/register';
  constructor(private http: HttpClient) {}

  userRegister() {
    this.http.post(this.apiUrl, { email: this.email, password: this.password }).subscribe((data: any) =>{
      alert("Account Created! Email: " + this.email + " | Password: " + this.password);
    }, () => {
      alert("Please enter an email/password!");
    })
  }
}
