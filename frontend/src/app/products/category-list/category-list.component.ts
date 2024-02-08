import { Component, ViewChild, OnInit } from '@angular/core';    // Must import OnInit to have before page load
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {                                    // Need to have "implements OnInit" to load before page load
  // To connect to express
  private apiUrl = 'http://localhost:3000/';
  private apiCartUrl = 'http://localhost:3000/users/cart/';

  apiResponse: any = "";                                                                    // Store data from database in variable apiResponse
  searchTerm: string = "";
  displayedColumns = ["Name", "Price", "Brand", "Edit/Delete"];                  // Array for the names of the table columns
  checkboxes = ["Amir", "Schmelz"];
  dataSource: MatTableDataSource<any>;

  // JWT variables
  token = localStorage.getItem("jwt");
  currentUserRole: any = localStorage.getItem("role");
  currentUserName: any = localStorage.getItem("firstName");
  currentUserId: any = localStorage.getItem("_id");
  httpOptions = new HttpHeaders().set("Authorization", "bearer " + this.token);             // Headers options for authorization middleware
  visible: boolean = true;
  loggedVisible: boolean = true;
  tileNames: string[] = ["Fittings", "Pipe", "Chemicals", "Hangers", "Faucets", "Toilets & Urinals", "Water Heaters", "Garbage Disposals", "Venting"];
  
  // For paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient) {};

  // Load Products from MongoDB on page load
  ngOnInit() {
    this.ifVisible();
    this.http.get(this.apiUrl, { headers: this.httpOptions }).subscribe((data:any) => {      
      //console.log(this.httpOptions);
      this.apiResponse = data;
      this.dataSource = new MatTableDataSource(this.apiResponse);
      this.dataSource.paginator = this.paginator;

      // Hide edit/delete column unless role == "admin"
      //console.log(this.currentUserRole);
      if (this.currentUserRole == "admin") {
        this.displayedColumns;
      } else {
        this.displayedColumns = ["Name", "Price", "Brand"];
      }
    });
  }


  // Hide add items form
  ifVisible () {
    if (this.currentUserRole == "admin") {
      //console.log(this.currentUserRole);
      this.visible = true;
    } else {
      this.visible = false;
      //console.log(this.currentUserRole);
    }
  }

  // POST on 'Add Item' click
  addItem(itemName: any, priceCost: any, brand: any)  {
    if (!itemName) {
      alert("Input item name!");
    } if (!priceCost) {
      alert("Input price!");
    } else if (this.currentUserRole == "admin") {
      this.http.post(this.apiUrl, { name: itemName, price: priceCost, brand: brand }, { headers: this.httpOptions }).subscribe((data: any) => {
        this.apiResponse.push(data);
        this.dataSource = new MatTableDataSource(this.apiResponse);
        this.dataSource.paginator = this.paginator;
      });        
      alert("Name: " + itemName + ". Price: " + priceCost);
    }
  }

  filterByCheck(product: string, checked: boolean) {
    if (checked) {
      this.filterItems(product);
    } else {
      this.ngOnInit();
    }
  }

  filterItems(product: string) {                      // Filter object items from search input
    const filterObj = {
      name: product
    }
    //console.log(product);
    this.http.get(this.apiUrl + 'searchTerm?filter=' + JSON.stringify(filterObj)).subscribe((data: any) => {
      //console.log(data);
      this.dataSource = data;
    });
  }

  deleteProduct(product: any) {                       // Function to Delete a product
    if (this.currentUserRole == "admin") {
      this.http.delete(this.apiUrl + product, { headers: this.httpOptions }).subscribe(result => {
        this.ngOnInit();                                // call ngOnInit() to show deletion w/o reloading page
      });
    }
  }

  editProduct(productId: string) {                    // Function to edit a product's details
    let newName = prompt("Enter value for NAME:");    // Receive name/price changes from user through a window prompt
    let newPrice = prompt("Enter value for PRICE:");

    while (!newName) {                                // Valdiation for input to edit name/price
      newName = prompt("Enter value for NAME:");
    }
    while (!newPrice) {
      newPrice = prompt("Enter value for PRICE:");
    }
    
    if (this.currentUserRole == "admin") {
      // the obj inside put() is to change the name/price of the object in mongo, to the new one from the user's input
      this.http.put(this.apiUrl + productId, { name: newName, price: newPrice }, { headers: this.httpOptions }).subscribe(() => {
        this.ngOnInit();                                // call ngOnInit() to show deletion w/o reloading page
    })
    }
  }
}