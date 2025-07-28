// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {

//   constructor() { }
// }



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap,map } from 'rxjs/operators';
import { Cartitem } from '../models/carditem.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private cartItemsSubject = new BehaviorSubject<Cartitem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<Cartitem[]> {
    return this.http.get<Cartitem[]>(this.apiUrl).pipe(
      tap(items => this.cartItemsSubject.next(items))
    );
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(this.apiUrl, { product_id: productId, quantity }).pipe(
      tap(() => this.getCartItems().subscribe())
    );
  }

  updateCartItem(itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
      tap(() => this.getCartItems().subscribe())
    );
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`).pipe(
      tap(() => this.getCartItems().subscribe())
    );
  }


    clearCart(): Observable<void> {
      console.log("yrl",`${this.apiUrl}/clear`)
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(
      map(() => {
        this.cartItemsSubject.next([]);
      })
    );
  }
  getCartTotal(): number {
    const items = this.cartItemsSubject.value;
     const itemArray = Array.isArray(items) ? items : [items];
    return itemArray.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount(): number {
  const items = this.cartItemsSubject.value;

  // If it's a single object, wrap in array
  const itemArray = Array.isArray(items) ? items : [items];

  return itemArray.reduce((count, item) => count + (item.quantity || 0), 0);
  }
}