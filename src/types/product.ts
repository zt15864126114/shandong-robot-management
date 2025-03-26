export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductPrice {
  basePrice: number;
  currency: string;
  unit: string;
  discount?: {
    percentage: number;
    validUntil: string;
  };
}

export interface ProductService {
  name: string;
  description: string;
  price: number;
  duration: string;
}

export interface Product {
  id: number;
  name: string;
  category: 'industrial' | 'service';
  description: string;
  image: string;
  tag?: string;
  features: string[];
  specifications: ProductSpec[];
  price: ProductPrice;
  services: ProductService[];
  technicalDetails: {
    [key: string]: string;
  };
  applications: string[];
  certifications: string[];
  warranty: {
    period: string;
    terms: string[];
  };
  maintenance: {
    schedule: string;
    requirements: string[];
  };
  support: {
    type: string;
    description: string;
    contact: string;
  };
} 