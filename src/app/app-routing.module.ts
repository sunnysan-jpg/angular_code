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
import { AboutUsComponent } from './footer-about/about-us/about-us.component';
import { ContactDetailComponent } from './footer-about/contact-detail/contact-detail.component';
import { PrivacyPolicyComponent } from './footer-about/privacy-policy/privacy-policy.component';

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
  /// 
  {path: 'about-us',component: AboutUsComponent},
  {path: 'contact-us', component: ContactDetailComponent},
  {path: 'privacy-policy',component: PrivacyPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
