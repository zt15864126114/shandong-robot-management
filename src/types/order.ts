// 订单状态
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// 订单信息
export interface Order {
  id: number;
  orderNo: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  createTime: string;
  updateTime: string;
  products: OrderProduct[];
  remark?: string;
}

// 订单商品
export interface OrderProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

// 订单查询参数
export interface OrderQuery {
  page: number;
  pageSize: number;
  keyword?: string;
  dateRange?: [Date, Date];
  status?: OrderStatus;
} 