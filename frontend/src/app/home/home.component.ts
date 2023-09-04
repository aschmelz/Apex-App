import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {  
  private apiUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

  token = localStorage.getItem("jwt");
  httpOptions = new HttpHeaders().set("authorization", "bearer " + this.token);
  currentUserRole: any = localStorage.getItem("role");

  
}
