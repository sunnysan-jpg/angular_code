import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <main class="main-content">
    <app-spinner></app-spinner>
      <router-outlet></router-outlet>
    </main>
      <app-footer></app-footer>
      <app-chat-bot></app-chat-bot>

  `,
  styles: [`
    .main-content {
      padding-top: 7px;
      min-height: calc(100vh - 80px);
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Load cart items if user is authenticated
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.cartService.getCartItems().subscribe();
      }
    });
  }
}