import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'] 
})
export class ProductDetailComponent implements OnInit {
  product!: Product & { images: string[]; selectedImage: string };

  quantity = 1;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(productId);
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe(product => {
      let images: string[] = [];
      if (product.image_url) {
        if (Array.isArray(product.image_url)) {
          images = product.image_url;
        } else {
          try { images = JSON.parse(product.image_url); } catch { images = []; }
        }
      }
      this.product = {
        ...product,
        images,
        selectedImage: images[0] || ''
      };
      this.loading = false;
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock_quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity).subscribe(
        () => {
          alert('Added to cart successfully!');
        },
        error => {
          console.error('Error adding to cart:', error);
          alert('Failed to add to cart. Please try again.');
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
