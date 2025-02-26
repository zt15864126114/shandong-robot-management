// 用户状态
export type UserStatus = 'active' | 'inactive' | 'locked';

// 用户信息
export interface User {
  id: number;
  username: string;
  realName: string;
  avatar?: string;
  email: string;
  phone: string;
  roles: Role[];
  status: UserStatus;
  createTime: string;
  updateTime: string;
}

// 角色信息
export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  permissions: string[];  // 权限ID列表
  createTime: string;
  updateTime: string;
}

// 分页参数
export interface PageQuery {
  page: number;
  pageSize: number;
  keyword?: string;
}

// 分页结果
export interface PageResult<T> {
  list: T[];
  total: number;
}

// 权限项
export interface PermissionNode {
  id: number;
  label: string;
  children?: PermissionNode[];
} 