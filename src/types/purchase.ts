export interface PurchaseItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  id: number;
  code: string;
  supplier: string;
  amount: number;
  createTime: string;
  status: string;
  items: PurchaseItem[];
} 