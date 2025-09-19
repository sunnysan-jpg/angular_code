import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

// Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// Components
import { AppComponent } from './app.component';

// import { ProductListComponent } from './components/product-list/product-list.component';
// import { ProductDetailComponent } from './components/product-detail/product-detail.component';
// import { CartComponent } from './components/cart/cart.component';
// import { CheckoutComponent } from './components/checkout/checkout.component';
// import { LoginComponent } from './components/auth/login/login.component';
// import { RegisterComponent } from './components/auth/register/register.component';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { OrdersComponent } from './components/orders/orders.component';

// Services
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// Routes
// import { routes } from './app.routes';
import { HeaderComponent } from './header/header.component';



import { AppRoutingModule } from './app-routing.module'; 
import { ProductListComponent } from './product-list/product-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { GoogleauthsuccessComponent } from './googleauthsuccess/googleauthsuccess.component';
import { LoaderInterceptor } from './interceptor/loader.interceptor';
import { SpinnerComponent } from './spinner/spinner.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AboutUsComponent } from './footer-about/about-us/about-us.component';
import { PrivacyPolicyComponent } from './footer-about/privacy-policy/privacy-policy.component';
import { ContactDetailComponent } from './footer-about/contact-detail/contact-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductListComponent,
    LoginComponent,
    FooterComponent,
    // ProductDetailComponent,
    // CartComponent,
    // CheckoutComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderhistoryComponent,
    GoogleauthsuccessComponent,
    SpinnerComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    ContactDetailComponent,
    // RegisterComponent,
    // AdminDashboardComponent,
    // OrdersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,  
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatGridListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
        {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
      {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
  },
    AuthService,
    ProductService,
    CartService,
    OrderService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }