import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { InvoiceComponent } from './cart/invoice/invoice.component';
import { CategoryListComponent } from './products/category-list/category-list.component';

const routes: Routes = [
  {
    path: "products",
    component: ProductsComponent
  },
  {
    path: "aboutus",
    component: AboutUsComponent
  },
  {
    path: "",                           // "" implies /
    component: HomeComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "cart",
    component: CartComponent
  },
  {
    path: "invoice",
    component: InvoiceComponent
  },
  {
    path: "products/:title_name",
    component: CategoryListComponent
  }
];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }