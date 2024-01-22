import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';     // Use ActivatedRoute for handling query parameters (here is for :_id parameter)

@Component({
  selector: 'app-item-specs',
  templateUrl: './item-specs.component.html',
  styleUrls: ['./item-specs.component.css']
})
export class ItemSpecsComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/';

  apiResponse: any = "";
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {};

  ngOnInit() {
    // Use activatedRoute to extract product ID from route parameters
    const productId = this.activatedRoute.snapshot.params['id'];
    const completeUrl = `${this.apiUrl}${productId}`; // Construct complete URL with product ID

    this.http.get(completeUrl).subscribe((data: any) => {
      console.log(data);
      this.apiResponse = data;
    });
  }
}