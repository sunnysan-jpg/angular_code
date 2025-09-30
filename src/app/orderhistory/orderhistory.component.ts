import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as QRCode from 'qrcode';

interface OrderHistory {
  id: string;
  created_at: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];  
  total_amount: number;
  shipping_address: string;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredDate?: Date;
  product_name: string,
  shippingCharge?: number;
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


    // Invoice configuration
  invoiceLogoPath = 'https://res.cloudinary.com/dkbc3dfyf/image/upload/v1752938746/samples/cloudinary-icon.png'; // path to logo in src/assets
  gstPercent = 18;         
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
  this.orders = this.filteredOrders
  console.log("Transformed Orders:", this.filteredOrders);
});

  }

filterOrders() {
  this.filteredOrders = this.orders.filter(order => {
    const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
    
    const matchesDate = !this.dateFilter || this.isWithinDateRange(order.created_at, parseInt(this.dateFilter));
    
    const matchesSearch = !this.searchTerm || 
      order.id.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) || // ✅ fixed here
      order.items.some(item => 
        item.product_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    
    return matchesStatus && matchesDate && matchesSearch;
  });
}


  isWithinDateRange(orderDate: Date, days: number): boolean {
    const ordereDates = new Date(orderDate)
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - ordereDates.getTime());
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
    return this.orders.filter(order => order.status !== 'cancelled').reduce((total, order) => total +Number(order.total_amount), 0);
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

  // downloadInvoice(order: OrderHistory) {
  //   // Generate and download invoice
  //   console.log('Downloading invoice for order:', order.id);
  // }

    // ---------- Invoice helpers ----------
  private formatCurrency(n: number): string {
    return '₹' + Number(n ?? 0).toFixed(2);
  }

  private calcSubtotal(order: OrderHistory): number {
    if (!order || !order.items) return 0;
    return order.items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);
  }


   private async fetchImageDataUrl(url: string): Promise<string | null> {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn('Failed to fetch image:', e);
      return null;
    }
  }





async downloadInvoice(order: OrderHistory) {
  if (!order) return;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const startY = 40;

  // 1️⃣ Generate QR code for the order
  const orderUrl = `Thank you Visit again`;
  let qrDataUrl: string | null = null;
  try {
    qrDataUrl = await QRCode.toDataURL(orderUrl, { margin: 1, width: 160 });
  } catch (e) {
    console.warn('QR generation failed', e);
    qrDataUrl = null;
  }  

  // 2️⃣ Load logo
  const logoDataUrl = await this.fetchImageDataUrl(this.invoiceLogoPath);
  const logoWidth = 70;
  const logoHeight = 70;
  if (logoDataUrl) {
    try { doc.addImage(logoDataUrl, 'PNG', margin, startY, logoWidth, logoHeight); }
    catch (e) { console.warn('addImage logo failed', e); }
  }

  // 3️⃣ Place QR top-right
  const qrSize = 80;
  if (qrDataUrl) {
    try { doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - qrSize, startY, qrSize, qrSize); }
    catch (e) { console.warn('addImage QR failed', e); }
  }

  // 4️⃣ Header text
  const headerX = margin + (logoDataUrl ? logoWidth + 10 : 0);
  doc.setFontSize(18);
  doc.setTextColor('#b86a2c');
  doc.text('Mushroom Store', headerX, startY + 22);

  doc.setFontSize(10);
  doc.setTextColor('#333');
  doc.text('Invoice', pageWidth - margin, startY + 22, { align: 'right' });

  // 5️⃣ Order meta
  let y = startY + (logoDataUrl ? logoHeight : 40) + 12;
  doc.setFontSize(10);
  doc.text(`Order ID: ${order.id}`, margin, y);
  doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
  y += 18;
  doc.text(`Payment: ${order.paymentMethod || '—'}`, margin, y);
  doc.text(`Status: ${this.getStatusText(order.status)}`, pageWidth - margin, y, { align: 'right' });
  y += 22;

  // 6️⃣ Shipping info
  doc.setFontSize(11);
  doc.text('Ship To:', margin, y);
  const shipping = order.shipping_address || '—';
  doc.setFontSize(10);
  const shippingLines = doc.splitTextToSize(shipping, pageWidth - margin * 2 - 100);
  doc.text(shippingLines, margin + 60, y);
  y += shippingLines.length * 12 + 8;

  // 7️⃣ Items table using autoTable
  const tableColumns = ['Item', 'Qty', 'Price', 'Subtotal'];
  const tableBody = (order.items || []).map(i => {
    const name = String(i.product_name || i.productName || 'Item');
    const qty = Number(i.quantity) || 0;
    const price = Number(i.price) || 0;
    const subtotal = price * qty;
    // ensure plain strings for PDF (no locale formatting)
    return [
      name,
      String(qty),
      Number(price).toFixed(2),
      Number(subtotal).toFixed(2)
    ];
  });

  autoTable(doc, {
    head: [tableColumns],
    body: tableBody,
    startY: y,
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [184, 106, 44], textColor: 255 },
    margin: { left: margin, right: margin },
    theme: 'grid',
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : y + 100;

  // 8️⃣ Amounts summary
  const subtotal = this.calcSubtotal(order);
  const gstAmount = +(subtotal * (this.gstPercent / 100));
  const shippingCharge = (order.shippingCharge || 0);
  const total = +(subtotal + gstAmount + shippingCharge);

  const summaryX = pageWidth - margin - 220;
  doc.setFontSize(11);
  doc.setTextColor('#333');
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', summaryX, finalY + 18);
  doc.text(Number(subtotal).toFixed(2), summaryX + 150, finalY + 18, { align: 'right' });

  doc.text(`GST (${this.gstPercent}%):`, summaryX, finalY + 36);
  doc.text(Number(gstAmount).toFixed(2), summaryX + 150, finalY + 36, { align: 'right' });

  if (shippingCharge) {
   doc.text('Shipping:', summaryX, finalY + 54);
    doc.text(Number(shippingCharge).toFixed(2), summaryX + 150, finalY + 54, { align: 'right' });
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', summaryX, finalY + 80);
  doc.text(Number(total).toFixed(2), summaryX + 150, finalY + 80, { align: 'right' });

  // 9️⃣ Footer QR
  if (qrDataUrl) {
    try {
      const footerQrSize = 60;
      const footerY = doc.internal.pageSize.getHeight() - 120;
      doc.addImage(qrDataUrl, 'PNG', margin, footerY, footerQrSize, footerQrSize);
      doc.setFontSize(9);
      doc.text('Scan to view order', margin + footerQrSize + 8, footerY + footerQrSize / 2 + 4);
    } catch (e) { /* ignore */ }
  }

  // 10️⃣ Footer note
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#666');
  const footer = 'Thank you for ordering from Mushroom Store. For support, visit /contact or email 03sunnyyadav@gmail.com';
  doc.text(doc.splitTextToSize(footer, pageWidth - margin * 2), margin, doc.internal.pageSize.getHeight() - 60);

  // 11️⃣ Save PDF
  const filename = `Invoice-${order.id || 'order'}-${(new Date()).toISOString().slice(0,10)}.pdf`;
  // doc.save(filename);
  await this.savePdfCrossPlatform(doc, filename);
  
}


private isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

private async savePdfCrossPlatform(doc: any, filename: string) {
  try {
    // create blob from jsPDF
    const blob: Blob = doc.output('blob');

    // small safety: if blob is very large, consider streaming or server-side generation
    const url = URL.createObjectURL(blob);

    if (this.isIOS()) {
      // iOS: download attribute ignored — open in new tab/window
      window.open(url, '_blank');
      // revoke after a delay
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    } else {
      // Desktop & Android: use anchor download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      // append to DOM to make it work on some browsers
      document.body.appendChild(link);
      link.click();
      link.remove();
      // revoke after short delay
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    }
  } catch (err) {
    console.warn('savePdfCrossPlatform failed, falling back to doc.save()', err);
    try {
      // final fallback
      doc.save(filename);
    } catch (e) {
      console.error('All PDF save attempts failed', e);
      alert('Unable to download invoice on this device/browser. Try opening in desktop or update your browser.');
    }
  }
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

