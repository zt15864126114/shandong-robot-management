// 企业基本信息接口
export interface EnterpriseInfo {
  id: number;
  name: string;
  legalPerson: string;
  registrationNumber: string;
  registeredCapital: number;
  foundingDate: string;
  address: string;
  contact: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  businessScope: string;
  status: 'active' | 'inactive';
}

// 部门信息接口
export interface Department {
  id: number;
  name: string;
  manager: string;
  parentId: number | null;
  description?: string;
  employeeCount: number;
  createTime: string;
  updateTime: string;
}

// 员工信息接口
export interface Employee {
  id: number;
  name: string;
  employeeNo: string;
  departmentId: number;
  position: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  entryDate: string;
  status: 'active' | 'inactive' | 'leave';
} 