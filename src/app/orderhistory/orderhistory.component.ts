// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-orderhistory',
//   templateUrl: './orderhistory.component.html',
//   styleUrls: ['./orderhistory.component.scss']
// })
// export class OrderhistoryComponent {

// }



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';

interface OrderHistory {
  id: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total_amount: number;
  shipping_address: string;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredDate?: Date;
  product_name: string,
}

interface OrderItem {
  id: string;
  productName: string;
  mushroomType: string;
  quantity: number;
  price: number;
  image: string;
  weight: string;
  product_name: string;
  imageUrls: string;
}

@Component({
  selector: 'app-order-history',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.scss']
})
export class OrderhistoryComponent implements OnInit {
  orders: OrderHistory[] = [];
  filteredOrders: any = [];
  selectedOrder: OrderHistory | null = null;
  
  statusFilter: string = '';
  dateFilter: string = '';
  searchTerm: string = '';
  constructor(private orderSerive: OrderService){}
  ngOnInit() {
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    // Mock data - replace with actual API call
    // this.orders = [
    //   // {
    //   //   id: 'ORD001',
    //   //   orderDate: new Date('2024-01-15'),
    //   //   status: 'delivered',
    //   //   items: [
    //   //     {
    //   //       id: '1',
    //   //       productName: 'Fresh Oyster Mushrooms',
    //   //       mushroomType: 'Oyster',
    //   //       quantity: 2,
    //   //       price: 150,
    //   //       image: '/api/placeholder/80/80',
    //   //       weight: '250g'
    //   //     },
    //   //     {
    //   //       id: '2',
    //   //       productName: 'Shiitake Mushrooms',
    //   //       mushroomType: 'Shiitake',
    //   //       quantity: 1,
    //   //       price: 200,
    //   //       image: '/api/placeholder/80/80',
    //   //       weight: '200g'
    //   //     }
    //   //   ],
    //   //   totalAmount: 500,
    //   //   shippingAddress: '123 Main Street, Mumbai, MH 400001',
    //   //   paymentMethod: 'Credit Card',
    //   //   trackingNumber: 'TRK123456789',
    //   //   deliveredDate: new Date('2024-01-20')
    //   // },
    //   // {
    //   //   id: 'ORD002',
    //   //   orderDate: new Date('2024-01-25'),
    //   //   status: 'shipped',
    //   //   items: [
    //   //     {
    //   //       id: '3',
    //   //       productName: 'Button Mushrooms',
    //   //       mushroomType: 'Button',
    //   //       quantity: 3,
    //   //       price: 100,
    //   //       image: '/api/placeholder/80/80',
    //   //       weight: '500g'
    //   //     }
    //   //   ],
    //   //   totalAmount: 300,
    //   //   shippingAddress: '456 Oak Avenue, Delhi, DL 110001',
    //   //   paymentMethod: 'UPI',
    //   //   trackingNumber: 'TRK987654321',
    //   //   estimatedDelivery: new Date('2024-01-30')
    //   // },
    //   // {
    //   //   id: 'ORD003',
    //   //   orderDate: new Date('2024-02-01'),
    //   //   status: 'processing',
    //   //   items: [
    //   //     {
    //   //       id: '4',
    //   //       productName: 'Portobello Mushrooms',
    //   //       mushroomType: 'Portobello',
    //   //       quantity: 1,
    //   //       price: 180,
    //   //       image: '/api/placeholder/80/80',
    //   //       weight: '300g'
    //   //     }
    //   //   ],
    //   //   totalAmount: 180,
    //   //   shippingAddress: '789 Pine Road, Bangalore, KA 560001',
    //   //   paymentMethod: 'Cash on Delivery',
    //   //   estimatedDelivery: new Date('2024-02-05')
    //   // }
    // ];
    
    // this.filteredOrders = [...this.orders];

// cart-orders.component.ts or wherever you're processing
this.orderSerive.getOrders().subscribe(orderResponse => {
  this.filteredOrders = orderResponse.map(order => {
    return {
      ...order,
      items: order.items.map(item => {
        return {
          ...item,
          imageUrls: JSON.parse(item.image_url)  // Convert string to array
        };
      })
    };
  });

  console.log("Transformed Orders:", this.filteredOrders);
});

  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      
      const matchesDate = !this.dateFilter || this.isWithinDateRange(order.orderDate, parseInt(this.dateFilter));
      
      const matchesSearch = !this.searchTerm || 
        order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.mushroomType.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      
      return matchesStatus && matchesDate && matchesSearch;
    });
  }

  isWithinDateRange(orderDate: Date, days: number): boolean {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getTotalSpent(): number {
    return this.orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.
total_amount, 0);
  }

  viewOrderDetails(filteredOrders: OrderHistory) {
    this.selectedOrder = filteredOrders;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  trackOrder(order: OrderHistory) {
    // Navigate to tracking page or show tracking info
    console.log('Tracking order:', order.trackingNumber);
  }

  reorderItems(order: OrderHistory) {
    // Add items to cart and navigate to cart
    console.log('Reordering items:', order.items);
  }

  cancelOrder(order: OrderHistory) {
    if (confirm('Are you sure you want to cancel this order?')) {
      order.status = 'cancelled';
      console.log('Order cancelled:', order.id);
    }
  }

  downloadInvoice(order: OrderHistory) {
    // Generate and download invoice
    console.log('Downloading invoice for order:', order.id);
  }

  goToShop() {
    // Navigate to shop page
    console.log('Navigate to shop');
  }

  isStatusActive(status: string): boolean {
    if (!this.selectedOrder) return false;
    
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(this.selectedOrder.status);
    const checkIndex = statusOrder.indexOf(status);
    
    return checkIndex <= currentIndex;
  }
}

