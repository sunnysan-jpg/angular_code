import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { IdleService } from './services/idle.service';

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
    private cartService: CartService,
    private idle: IdleService
  ) {}

  ngOnInit() {
    // 🔹 Try to restore session from localStorage
    const restored = this.authService.autoLogin();

    if (restored) {
      console.log('✅ Session restored, starting idle watcher...');
      this.idle.startWatching();  // idle logout after 30 mins
    } else {
      console.log('❌ No active session found');
    }

    // 🔹 Auto-load cart if user is authenticated
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.cartService.getCartItems().subscribe({
          error: (err) => console.error('Cart load failed:', err)
        });
      }
    });
  }
}
