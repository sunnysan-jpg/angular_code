import { OrderItem } from "./order-item.model";

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  created_at: Date;
  items: OrderItem[];
}