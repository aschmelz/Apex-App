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
<<<<<<< HEAD
=======
      //console.log(data);
>>>>>>> origin/main
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
<<<<<<< HEAD
    firstNameField.enableReadOnly();
=======
>>>>>>> origin/main

    const lastNameField = form.createTextField("lastName");
    lastNameField.setText(this.currentLastName);
    lastNameField.addToPage(page, { x: 130, y: 815, width: 100, height: 20 });
<<<<<<< HEAD
    lastNameField.enableReadOnly();
=======
>>>>>>> origin/main

    const currentEmailField = form.createTextField("email");
    currentEmailField.setText(this.currentEmail);
    currentEmailField.addToPage(page, { x: 245, y: 815, width: 200, height: 20 });
<<<<<<< HEAD
    currentEmailField.enableReadOnly();

    const currentCompanyField = form.createTextField("companyName");
    currentCompanyField.setText(this.currentCompanyName);
    currentCompanyField.addToPage(page, { x: 15, y: 775, width: 215, height: 20 });
    currentCompanyField.enableReadOnly();

    const currentCompanyAddressField = form.createTextField("companyAddress");
    currentCompanyAddressField.setText(this.currentCompanyAddress);
    currentCompanyAddressField.addToPage(page, { x: 245, y: 775, width: 200, height: 20 });
    currentCompanyAddressField.enableReadOnly();

    const currentPhoneNumberField = form.createTextField("phoneNumber");
    currentPhoneNumberField.setText(this.currentPhoneNumber);
    currentPhoneNumberField.addToPage(page, { x: 460, y: 775, width: 100, height: 20 });
    currentPhoneNumberField.enableReadOnly();

    const currentDeliveryAddressField = form.createTextField("deliveryAddress");
    currentDeliveryAddressField.setText(this.deliveryAddress);
    currentDeliveryAddressField.addToPage(page, { x: 15, y: 750, width: 450, height: 17 });
    currentDeliveryAddressField.enableReadOnly();

    // Items from checkout to be displayed on invoice
    for (let i = 0; i < this.cart.length; i++) {
      const cartItem = form.createTextField(`cartItem-${i}`);
      cartItem.setText(this.cart[i].name);
      cartItem.addToPage(page, { x: 15, y: 725 - i * 40, width: 300, height: 20 });
    
      const cartItemPrice = form.createTextField(`cart_item_price_${i}`);
      cartItemPrice.setText("$" + this.cart[i].price.toString()); // Convert the price to a string
      cartItemPrice.addToPage(page, { x: 400, y: 725 - i * 40, width: 100, height: 20 });

      // Make invoice text read only
      cartItem.enableReadOnly()
      cartItemPrice.enableReadOnly();
    }
    
=======

>>>>>>> origin/main
    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Open Url to show copy and give option to download
    window.open(url);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
