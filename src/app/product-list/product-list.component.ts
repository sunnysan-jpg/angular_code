import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategory = '';
  isAuthenticated = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  parseImageUrl(image_url: any): string[] {
    if (!image_url) return [];
    if (Array.isArray(image_url)) return image_url;
    try { return JSON.parse(image_url); } catch { return []; }
  }

  loadProducts() {
    const filters = {
      search: this.searchTerm,
      category: this.selectedCategory
    };

    this.productService.getProducts(filters).subscribe(products => {
      this.products = products.map(product => ({
        ...product,
        image_url: this.parseImageUrl(product.image_url)
      }));
    });

    
  }

  loadCategories() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSearch() {
    this.loadProducts();
  }

  onCategoryChange() {
    this.loadProducts();
  }

  scrollToProducts() {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  addToCart(product: Product) {
    if (!this.isAuthenticated) {
      this.snackBar.open('Please login to add items to cart', 'Close', { duration: 3000 });
      return;
    }

    this.cartService.addToCart(product.id, 1).subscribe(
      () => {
        this.snackBar.open('Product added to cart!', 'Close', { duration: 3000 });
      },
      error => {
        this.snackBar.open('Error adding product to cart', 'Close', { duration: 3000 });
      }
    );
  }
}