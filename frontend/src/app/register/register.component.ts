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
  firstName: string = "";
  lastName: string = "";
  companyName: string = "";
  companyAddress: string = "";
  phoneNumber: string = "";

  
  private apiUrl = 'http://localhost:3000/users/register';
  constructor(private http: HttpClient) {}

  userRegister() {
    this.http.post(this.apiUrl, { email: this.email, password: this.password, firstName: this.firstName, lastName: this.lastName, companyName: this.companyName, companyAddress: this.companyAddress, phoneNumber: this.phoneNumber }).subscribe((data: any) => {
      alert("Account Created! Email: " + this.email + " | Password: " + this.password);
      //console.log(data);
    }, () => {
      alert("Please fill out the information!");
    })
  }
}
