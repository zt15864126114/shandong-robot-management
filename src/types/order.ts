// 订单状态
export type OrderStatus = 'unpaid' | 'unshipped' | 'shipped' | 'completed' | 'cancelled';

// 物流状态
export type LogisticsStatus = 'pending' | 'picked_up' | 'in_transit' | 'delivered';

// 售后状态
export type AfterSaleStatus = 'none' | 'applying' | 'processing' | 'completed' | 'rejected';

// 物流信息
export interface LogisticsInfo {
  status: LogisticsStatus;
  trackingNumber?: string;
  carrier?: string;
  pickupTime?: string;
  deliveryTime?: string;
  currentLocation?: string;
  trackingHistory: {
    time: string;
    location: string;
    status: string;
  }[];
}

// 售后信息
export interface AfterSaleInfo {
  status: AfterSaleStatus;
  type: 'repair' | 'return' | 'refund';
  reason: string;
  description: string;
  applyTime: string;
  processTime?: string;
  completeTime?: string;
  attachments?: string[];
  processRecords?: {
    time: string;
    operator: string;
    action: string;
    remark?: string;
  }[];
}

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
  logistics?: LogisticsInfo;
  afterSale?: AfterSaleInfo;
  customerContact: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  paymentInfo: {
    method: string;
    transactionId?: string;
    paidAmount: number;
    paidTime?: string;
  };
}

// 订单商品
export interface OrderProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  serialNumber?: string;
  warrantyPeriod?: string;
}

// 订单查询参数
export interface OrderQuery {
  page: number;
  pageSize: number;
  keyword?: string;
  type?: string;
  dateRange?: [Date, Date];
  status?: OrderStatus;
  logisticsStatus?: LogisticsStatus;
  afterSaleStatus?: AfterSaleStatus;
}

// 售后申请参数
export interface AfterSaleApplyParams {
  orderId: number;
  type: 'repair' | 'return' | 'refund';
  reason: string;
  description: string;
  attachments?: string[];
}

// 物流更新参数
export interface LogisticsUpdateParams {
  orderId: number;
  status: LogisticsStatus;
  trackingNumber?: string;
  carrier?: string;
  currentLocation?: string;
  remark?: string;
} 