import { Component, ViewChild, OnInit } from '@angular/core';    // Must import OnInit to have before page load
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // To connect to express
  private apiUrl = 'http://localhost:3000/users/cart/';
  currentUserId: any = localStorage.getItem("_id");

  apiResponse: any = "";                                                           // Store data from database in variable apiResponse
  displayedColumns = ["Name", "Price", "Brand", "Quantity"];                             // Array for the names of the table columns
  dataSource: MatTableDataSource<any>;
  token = localStorage.getItem("jwt");
  httpOptions = new HttpHeaders().set("Authorization", "bearer " + this.token);    // Headers options for authorization middleware
  cart: any = [];
  total: any = 0;

  // For paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.getProducts();
    this.totalPrice();
  }

  getProducts() { 
    this.http.get(this.apiUrl + this.currentUserId, { headers: this.httpOptions }).subscribe((data: any) => {
      this.apiResponse = data.cart;
      this.cart = data.cart;
      this.dataSource = new MatTableDataSource(this.apiResponse);
      this.dataSource.paginator = this.paginator;
      //console.log(data);
    })
  }

  addProduct(product: any) {    
    for (let i = 0; i < this.cart.length; i++) {
      if (product.name == this.cart[i]['name']) {
        //console.log(this.cart[i]['count']);
        this.cart[i]['count'] = this.cart[i]['count'] + 1;
        this.updateCart(this.cart);
        return;
      }
    }
    product['count'] = 1;
    this.cart.push(product);
    this.updateCart(this.cart);
  }

  // Come back to this!!!!
  removeProduct(product: any) {
    for (let i = 0; i < this.cart.length; i++) {
      if (product.name == this.cart[i]['name']) {
        //console.log(this.cart[i]['count']);
        this.cart[i]['count'] = this.cart[i]['count'] - 1;
        if (this.cart[i]['count'] == 0) {
          this.cart.splice(i, 1);
        }
        this.updateCart(this.cart);
        return;
      }
    }
  }

  updateCart(cart: any) {
    this.http.post(this.apiUrl + this.currentUserId, cart, { headers: this.httpOptions }).subscribe(() => {
      this.dataSource = new MatTableDataSource(this.cart);
      this.dataSource.paginator = this.paginator;
    })
  }

  totalPrice() {
    this.http.get(this.apiUrl + this.currentUserId, { headers: this.httpOptions }).subscribe((data: any) => {
      let pricesArray = [];
      for (let i = 0; i < data.cart.length; i++) {
        let prices = data.cart[i].price * data.cart[i].count;
        pricesArray.push(prices);
      };

      for (let i = 0; i < pricesArray.length; i++) {
        //console.log(pricesArray[i]);
        this.total += pricesArray[i];
      };
    })
    return this.total;
  }
}