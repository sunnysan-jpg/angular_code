export interface Cartitem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  created_at: Date;
  description: string;
  total: number
}