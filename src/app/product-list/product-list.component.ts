import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: '/product-list.component.html',
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
    console.log("this.prod",this.products)
  }

  loadProducts() {
    const filters = {
      search: this.searchTerm,
      category: this.selectedCategory
    };
    
this.productService.getProducts(filters).subscribe(products => {
  // Parse image_url for each product
  this.products = products.map(product => {
    return {
      ...product,
      image_url: JSON.parse(product.image_url)
    };
  });

  console.log("Parsed products:", this.products);
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