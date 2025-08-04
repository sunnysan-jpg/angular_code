import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

    private apiUrl = 'https://ecommerce-mushroom.onrender.com/api/payment';
  
  
    constructor(private http: HttpClient,private router:Router) {
      
    }
  
    createRazorpayOrder(data: { amount: number }) {
  return this.http.post(`${this.apiUrl}/create`, data);
}

  verifyPayment(data: any) {
    return this.http.post(`${this.apiUrl}/verify-payment`, data);
  }


}
