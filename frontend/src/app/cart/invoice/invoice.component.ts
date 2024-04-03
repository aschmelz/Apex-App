import { Component, Input, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PDFDocument, PDFForm, rgb } from 'pdf-lib';
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
  subTotal = 0;
  cart: any = "";
  date = new Date();
  deliveryAddress: string = "";
  startingInvoiceNumber: number;
  tax = 0;
  total = 0;

  //constructor(private invoiceService: InvoiceService) {}
  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.getItems();
    this.totalPrice();
    this.generateInvoiceNumber();
  }
  
  getItems() {
    this.http.get(this.apiUrl + this.forCart + this.currentUserId, { headers: this.httpOptions }).subscribe((data: any) => {
      this.cart = data.cart;
    })
  }

  totalPrice() {
    this.subTotal = 0;
    this.http.get(this.apiUrl + this.forGetInvoice + this.currentUserId, { headers: this.httpOptions }).subscribe((data: any) => {
      for (let i = 0; i < this.cart.length; i++) {
        let prices = this.cart[i].price * this.cart[i].count;
        this.subTotal += prices;
      }

      this.tax = this.subTotal * 0.095;
      this.total = this.subTotal + this.tax;
    })
  }

  saveInvoice() {
    // If user does not input a delivery address (required by the model in backend)
    if (!this.deliveryAddress) {
      alert("Please enter an address: ");
      return;
    }

    this.http.post(this.apiUrl + this.forInvoice, {
      firstName: this.currentFirstName,
      lastName: this.currentLastName,
      email: this.currentEmail,
      companyName: this.currentCompanyName,
      companyAddress: this.currentCompanyAddress,
      phoneNumber: this.currentPhoneNumber,
      items: this.cart,
      deliveryAddress: this.deliveryAddress,
      invoiceNumber: this.startingInvoiceNumber
    }, { headers: this.httpOptions }).subscribe(() => {
      alert("Order Sent!");
      this.generateInvoiceNumber();
    })
  }
  
  generateInvoiceNumber() {
    this.http.get(this.apiUrl + this.forGetInvoice, { headers: this.httpOptions }).subscribe((data: any) => {
      if (data.lenght == 0) {
        this.startingInvoiceNumber = 1000;
      } else {
        this.startingInvoiceNumber = 1000 + data.length;
      }
    })
  }

  // ****************** PDF Generation ******************

  async generateAndFillPdf() {
    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    page.drawRectangle({
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
      color: rgb(0.051, 0.11, 0.239),
      borderColor: rgb(0.95, 0.95, 0.95)
    })

    const pdfFont = await pdfDoc.embedFont('Helvetica-Bold');
    const pdfFontColor = rgb(1, 1, 1);
    page.drawText('Invoice: ' + this.startingInvoiceNumber, {
      x: 50,
      y: page.getHeight() - 50,
      size: 24,
      font: pdfFont,
      color: pdfFontColor,
  });

    page.drawText('Cart: ', {
      x: 50,
      y: page.getHeight() - 210,
      size: 18,
      font: pdfFont,
      color: pdfFontColor,
    });

    const form = pdfDoc.getForm();

    // Fill content
    const firstNameField = form.createTextField("firstName");
    firstNameField.setText(this.currentFirstName + " " + this.currentLastName);
    firstNameField.addToPage(page, { x: 50, y: page.getHeight() - 100, width: 100, height: 20 });
    firstNameField.enableReadOnly();

    const currentEmailField = form.createTextField("email");
    currentEmailField.setText(this.currentEmail);
    currentEmailField.addToPage(page, { x: 280, y: page.getHeight() - 100, width: 250, height: 20 });
    currentEmailField.enableReadOnly();

    const currentCompanyField = form.createTextField("companyName");
    currentCompanyField.setText(this.currentCompanyName);
    currentCompanyField.addToPage(page, { x: 50, y: page.getHeight() - 130, width: 185, height: 20 });
    currentCompanyField.enableReadOnly();

    const currentCompanyAddressField = form.createTextField("companyAddress");
    currentCompanyAddressField.setText(this.currentCompanyAddress);
    currentCompanyAddressField.addToPage(page, { x: 280, y: page.getHeight() - 130, width: 250, height: 20 });
    currentCompanyAddressField.enableReadOnly();

    const currentPhoneNumberField = form.createTextField("phoneNumber");
    currentPhoneNumberField.setText(this.currentPhoneNumber);
    currentPhoneNumberField.addToPage(page, { x: 50, y: page.getHeight() - 160, width: 100, height: 20 });
    currentPhoneNumberField.enableReadOnly();

    const currentDeliveryAddressField = form.createTextField("deliveryAddress");
    currentDeliveryAddressField.setText("Delivery: " + this.deliveryAddress);
    currentDeliveryAddressField.addToPage(page, { x: 280, y: page.getHeight() - 160, width: 250, height: 17 });
    currentDeliveryAddressField.enableReadOnly();
  
    // Items from checkout to be displayed on invoice
    let yOffset = 240
    for (let i = 0; i < this.cart.length; i++) {
      const cartItem = form.createTextField(`cartItem-${i}`);
      cartItem.setText(this.cart[i].name);
      cartItem.addToPage(page, { x: 50, y: (page.getHeight() - yOffset), width: 275, height: 20 });
    
      const cartItemPrice = form.createTextField(`cart_item_price_${i}`);
      cartItemPrice.setText("$" + this.cart[i].price.toString()); // Convert the price to a string
      cartItemPrice.addToPage(page, { x: 380, y: (page.getHeight() - yOffset), width: 150, height: 20 });

      // Make invoice text read only
      cartItem.enableReadOnly()
      cartItemPrice.enableReadOnly();

      // Set next item in cart 40 units below previous
      yOffset += 40;
    }

    // Convert this.subTotal to US currency
    const subTotalAmount = this.subTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    // Create and set subtotal field
    const currentSubTotalField = form.createTextField("subTotal");
    currentSubTotalField.setText("Subtotal: " + subTotalAmount);
    currentSubTotalField.addToPage(page, { x: 380, y: page.getHeight() - yOffset, width: 150, height: 20 });
    currentSubTotalField.enableReadOnly();


    // Convert this.tax to US currency
    const taxAmount = this.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    // Create and set tax field
    const currentTaxField = form.createTextField("tax");
    currentTaxField.setText("Tax: " + taxAmount);
    currentTaxField.addToPage(page, { x: 380, y: page.getHeight() - yOffset - 40, width: 150, height: 20 });
    currentTaxField.enableReadOnly();

    // Calculate total
    const totalAmount = '$' + this.subTotal + this.tax;

    // Convert totalAmount to US currency
    const totalAmountFormatted = this.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    // Create and set total field
    const currentTotalField = form.createTextField("total");
    currentTotalField.setText("Total: " + totalAmountFormatted);
    currentTotalField.addToPage(page, { x: 380, y: page.getHeight() - yOffset - 80, width: 150, height: 20 });
    currentTotalField.enableReadOnly();

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Open Url to show copy and give option to download
    window.open(url);
  }
}
