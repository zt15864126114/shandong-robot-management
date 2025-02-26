// 订单状态
export type OrderStatus = 'unpaid' | 'unshipped' | 'shipped' | 'completed' | 'cancelled';

// 订单信息
export interface Order {
  id: number;
  orderNo: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  createTime: string;
  updateTime: string;
  productType: string;
  productModel: string;
  payTime: string | null;
  shipTime: string | null;
  completeTime: string | null;
  deliveryTime: string;
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
  type?: string;
  dateRange?: [Date, Date];
  status?: OrderStatus;
} 