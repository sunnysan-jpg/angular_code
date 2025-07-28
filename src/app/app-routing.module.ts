import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthGuard } from './guards/auth.guard';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { GoogleauthsuccessComponent } from './googleauthsuccess/googleauthsuccess.component';

const routes: Routes = [
   { path: 'google-auth-success', component: GoogleauthsuccessComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  {path: '',component: ProductListComponent},
  {path: 'cart',component: CartComponent},
  {path: 'checkout',component: CheckoutComponent,canActivate: [AuthGuard]},
  {path: 'orders',component: OrderhistoryComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
