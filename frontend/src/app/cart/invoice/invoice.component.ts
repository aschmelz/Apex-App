import { Component, Input, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PDFDocument } from 'pdf-lib';
import { InvoiceService } from 'src/app/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {
  // Connect to Express
  private apiUrl = 'http://localhost:3000';
  private forCart = '/users/cart/';
  private forInvoice = '/invoice/createInvoice';
  private forGetInvoice = '/invoice/getInvoices/';

  // Items from local storage
  currentUserId: any = localStorage.getItem("_id");
  currentFirstName: any = localStorage.getItem("firstName");
  currentLastName: any = localStorage.getItem("lastName");
  currentEmail: any = localStorage.getItem("email");
  currentCompanyName: any = localStorage.getItem("companyName");
  currentCompanyAddress: any = localStorage.getItem("companyAddress");
  currentPhoneNumber: any = localStorage.getItem("phoneNumber");
  token = localStorage.getItem("jwt");

  httpOptions = new HttpHeaders().set("Authorization", "bearer " + this.token);    // Headers options for authorization middleware
  total = 0;
  cart: any = "";
  date = new Date();
  deliveryAddress: string = "";
  invoiceNumber: number;

  //constructor(private invoiceService: InvoiceService) {}
  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.getItems();
    this.totalPrice();
    //this.generateInvoiceNumber();
  }
  
  getItems() {
    this.http.get(this.apiUrl + this.forCart + this.currentUserId, { headers: this.httpOptions }).subscribe((data: any) => {
      this.cart = data.cart;
    })
  }

  totalPrice() {
    this.total = 0;
    this.http.get(this.apiUrl + this.forGetInvoice + this.currentUserId, { headers: this.httpOptions }).subscribe((data: any) => {
      //console.log(data);
      for (let i = 0; i < this.cart.length; i++) {
        let prices = this.cart[i].price * this.cart[i].count;
        this.total += prices;
      }
    })
  }

  saveInvoice() {
    // If user does not input a delivery address (required by the model in backend)
    if (!this.deliveryAddress) {
      alert("Please enter an address: ");
      return;
    }

    this.invoiceNumber = +(this.generateInvoiceNumber());

    this.http.post(this.apiUrl + this.forInvoice, {
      firstName: this.currentFirstName,
      lastName: this.currentLastName,
      email: this.currentEmail,
      companyName: this.currentCompanyName,
      companyAddress: this.currentCompanyAddress,
      phoneNumber: this.currentPhoneNumber,
      items: this.cart,
      deliveryAddress: this.deliveryAddress,
      invoiceNumber: this.invoiceNumber
    }, { headers: this.httpOptions }).subscribe(() => {
      alert("Order Sent!");
      this.generateInvoiceNumber();
    })
  }
  
  generateInvoiceNumber() {
    this.http.get(this.apiUrl + this.forGetInvoice, { headers: this.httpOptions }).subscribe((data: any) => {

      if (data === null) {
        this.invoiceNumber = 1000;
        console.log("Invoice was null ----- " + this.invoiceNumber);
        this.invoiceNumber++;
      } else if (this.invoiceNumber == data) {
        this.invoiceNumber++;
        console.log("Duplicated and fixed! ----- " + this.invoiceNumber)
      }

    })
    //return this.invoiceNumber++;
  }

  // ****************** PDF Generation ******************
  async generateAndFillPdf() {
    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const form = pdfDoc.getForm();

    // Fill content
    const firstNameField = form.createTextField("firstName");
    firstNameField.setText(this.currentFirstName);
    firstNameField.addToPage(page, { x: 15, y: 815, width: 100, height: 20 });

    const lastNameField = form.createTextField("lastName");
    lastNameField.setText(this.currentLastName);
    lastNameField.addToPage(page, { x: 130, y: 815, width: 100, height: 20 });

    const currentEmailField = form.createTextField("email");
    currentEmailField.setText(this.currentEmail);
    currentEmailField.addToPage(page, { x: 245, y: 815, width: 200, height: 20 });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Open Url to show copy and give option to download
    window.open(url);
  }
}
