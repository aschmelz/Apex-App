import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor() { }

  getInvoice(id: number) {
    // Get the invoice data from backend API
  }

  /*
  createInvoice(invoice: Invoice) {
    // Create the invoice in the backend API
  }

  updateInvoice(invoice: Invoice) {
    // Update the invoice in backend API
  }

  deteleInvoice(invoice: Invoice) {
    // Delete the invoice in the backend API
  }
  */
}
