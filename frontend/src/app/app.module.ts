import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';    // Must to connect to node project
import { FormsModule } from '@angular/forms';               // For ng capabilities
import { AppRoutingModule } from './app-routing.module';


// Material UI
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';

// Components
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CdkTableModule } from '@angular/cdk/table';
import { CartComponent } from './cart/cart.component';
import { InvoiceComponent } from './cart/invoice/invoice.component';
import { ItemSpecsComponent } from './products/item-specs/item-specs.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    HomeComponent,
    AboutUsComponent,
    RegisterComponent,
    LoginComponent,
    CartComponent,
    InvoiceComponent,
    ItemSpecsComponent
  ],
  imports: [
    BrowserModule,
    CdkTableModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,             // Necessary for 2-way binding (ngModel\
    MatCheckboxModule,
    MatTableModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
