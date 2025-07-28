// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-cart',
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.scss']
// })
// export class CartComponent {

// }


import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Cartitem } from '../models/carditem.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: Cartitem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe(
      items => {
        this.cartItems = items.map(item =>{
          return {
            ...item,
            image_url: JSON.parse(item.image_url),
            total : Number(item.price) * item.quantity
          }
        })
        console.log('cartsss',this.cartItems)
      },  
      error => console.error('Error loading cart:', error)
    );
  }

  updateQuantityFromEvent(item: Cartitem, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = Math.max(1, Number(inputElement.value));
    this.updateCart(item, newQuantity);
  }

  // Method for plus/minus buttons
  updateQuantityByNumber(item: Cartitem, quantity: number): void {
    const validQuantity = Math.max(1, quantity);
    this.updateCart(item, validQuantity);
  }

  // Common reusable method
  private updateCart(item: Cartitem, quantity: number): void {
    this.cartService.updateCartItem(item.id, quantity).subscribe(
      () => this.loadCart(),
      error => console.error('Error updating quantity:', error)
    );
  }

  removeItem(item: Cartitem): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeFromCart(item.id).subscribe(
        () => {
          this.loadCart();
        },
        error => console.error('Error removing item:', error)
      );
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => 
      sum + (item.price || 0) * item.quantity, 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getTotal(): number {
    return this.getSubtotal() + 5.00 + this.getTax(); // subtotal + shipping + tax
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
