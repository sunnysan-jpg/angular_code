// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.scss']
// })
// export class CheckoutComponent {

// }
declare var Razorpay: any;


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cartitem } from '../models/carditem.model';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';

interface PaymentDetails {
  method: 'card' | 'upi';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface OrderData {
  total_amount: number;
  shipping_address: string;
  payment: PaymentDetails;
  items: OrderItem[];
}

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
    private paymentService: PaymentService,
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


onSubmit(): void {
  if (!this.checkoutForm.valid) return;

  this.loading = true;

  const formData = this.checkoutForm.value;
  const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
  const paymentMethod = formData.paymentMethod;
  const amountInPaise = Math.round(this.getTotal() * 100); // Razorpay needs amount in paise

  // Prepare common orderData (but submit only after successful payment)
  const orderData: OrderData = {
  total_amount: this.getTotal(),
  shipping_address: shippingAddress,
  payment: {} as PaymentDetails, // ✅ Type cast empty object
  items: this.cartItems.map(item => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }))
};


  // Step 1: UPI Payment (Razorpay Popup)
  if (paymentMethod === 'upi') {
    this.paymentService.createRazorpayOrder({ amount: amountInPaise }).subscribe((res: any) => {
      console.log("sunn",res)
      const options = {
        key: 'rzp_test_0O3CVYn3hWnPd1', // 🛑 Use your Razorpay test key
        amount: res.amount,
        currency: 'INR',
        name: 'Mushroom Store',
        description: 'Order Payment',
        order_id: res.id,
        handler: (response: any) => {
          // Razorpay sends payment ID after success
          orderData.payment = {
            method: 'upi',
            upiId: formData.upiId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          };

          // Step 2: Submit Order to Backend
          this.submitOrder(orderData);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: '03sunnyyadav@gmail.com', // Optional: Replace if available
          contact: '+91 7039683801'
        },
        method: {
          upi: true
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', (res: any) => {
        this.loading = false;
        alert('Payment failed: ' + res.error.description);
      });
    });

    return; // ⛔ Don't continue execution below
  }

  // Card Payment logic
  if (paymentMethod === 'card') {
    orderData.payment = {
      method: 'card',
      cardNumber: formData.cardNumber,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv
    };

    this.submitOrder(orderData); // Directly place order
  }
}

// ✅ Separate method to submit order after payment success
submitOrder(orderData: any): void {
  this.orderService.createOrder(orderData).subscribe(
    order => {
      this.cartService.clearCart().subscribe(() => {
        this.router.navigate(['/orders'], {
          queryParams: { message: 'Order placed successfully!' }
        });
        this.loading = false;
      });
    },
    error => {
      console.error('Order Error:', error);
      alert('Failed to place order. Please try again.');
      this.loading = false;
    }
  );
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


  

// onSubmitPayment() {
//   if (this.checkoutForm.invalid) return;

//   const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;
//   const amount = this.getTotal(); // get amount from cart

//   if (paymentMethod === 'upi') {
//     this.http.post('/api/payment/create-order', { amount }).subscribe((res: any) => {
//       const options = {
//         key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
//         amount: res.order.amount,
//         currency: res.order.currency,
//         name: 'Mushroom Store',
//         description: 'Order Payment',
//         order_id: res.order.id,
//         handler: (response: any) => {
//           alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);
//         },
//         prefill: {
//           email: 'test@example.com',
//           contact: '9999999999',
//         },
//         method: {
//           upi: true,
//         },
//         theme: {
//           color: '#3399cc',
//         }
//       };

//       const rzp = new Razorpay(options);
//       rzp.open();
//     });
//   }
// }


  
}

