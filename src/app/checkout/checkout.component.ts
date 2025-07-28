// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.scss']
// })
// export class CheckoutComponent {

// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cartitem } from '../models/carditem.model';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: Cartitem[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
this.checkoutForm = this.fb.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  address: ['', Validators.required],
  city: ['', Validators.required],
  state: ['', Validators.required],
  zipCode: ['', Validators.required],

  // New fields
  paymentMethod: ['card', Validators.required],  // default is card

  // Card fields
  cardNumber: [''],
  expiryDate: [''],
  cvv: [''],

  // UPI field
  upiId: ['']
});

  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe(
      items => {
        this.cartItems = items;
        if (items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error => console.error('Error loading cart:', error)
    );
  }

  // onSubmit(): void {
  //   if (this.checkoutForm.valid) {
  //     this.loading = true;
      
  //     const formData = this.checkoutForm.value;
  //     const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      
  //     const orderData = {
  //       total_amount: this.getTotal(),
  //       shipping_address: shippingAddress,
  //       items: this.cartItems.map(item => ({
  //         product_id: item.product_id,
  //         quantity: item.quantity,
  //         price: item.price
  //       }))
  //     };
      
  //     this.orderService.createOrder(orderData).subscribe(
  //       order => {
  //         this.cartService.clearCart().subscribe(
  //           () => {
  //             this.router.navigate(['/orders'], { 
  //               queryParams: { message: 'Order placed successfully!' } 
  //             });
  //           }
  //         );
  //       },
  //       error => {
  //         console.error('Error creating order:', error);
  //         alert('Failed to place order. Please try again.');
  //         this.loading = false;
  //       }
  //     );
  //   }
  // }


  onSubmit(): void {
  if (this.checkoutForm.valid) {
    this.loading = true;
    const formData = this.checkoutForm.value;
    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

    const paymentMethod = formData.paymentMethod;
    let paymentDetails: any;

    if (paymentMethod === 'card') {
      paymentDetails = {
        method: 'card',
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      };
    } else {
      paymentDetails = {
        method: 'upi',
        upiId: formData.upiId
      };
    }

    const orderData = {
      total_amount: this.getTotal(),
      shipping_address: shippingAddress,
      payment: paymentDetails,
      items: this.cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    // Submit order
    this.orderService.createOrder(orderData).subscribe(
      order => {
        this.cartService.clearCart().subscribe(() => {
          this.router.navigate(['/orders'], {
            queryParams: { message: 'Order placed successfully!' }
          });
        });
      },
      error => {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
        this.loading = false;
      }
    );
  }
}


  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => 
      sum + (item.price || 0) * item.quantity, 0);
    
  }

  getTax(): number {
    return this.getSubtotal() * 0.08;
  }

  getTotal(): number {
    return this.getSubtotal() + 5.00 + this.getTax();
  }

  
}

