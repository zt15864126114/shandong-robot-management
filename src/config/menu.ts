import {
  Document,
  ShoppingCart,
  Money,
  User,
  DataLine,
  Monitor,
  OfficeBuilding
} from '@element-plus/icons-vue';

export const menuConfig = [
  {
    title: '数据大屏',
    icon: Monitor,
    path: 'dashboard'
  },
  {
    title: '订单管理',
    icon: Document,
    path: 'order',
    children: [
      {
        title: '订单列表',
        path: 'list'
      }
    ]
  },
  {
    title: '供应链管理',
    icon: ShoppingCart,
    path: 'supply',
    children: [
      {
        title: '供应商管理',
        path: 'supplier'
      },
      {
        title: '库存管理',
        path: 'inventory'
      },
      {
        title: '采购管理',
        path: 'purchase'
      }
    ]
  },
  {
    title: '财务管理',
    icon: Money,
    path: 'finance',
    children: [
      {
        title: '收入管理',
        path: 'income'
      },
      {
        title: '支出管理',
        path: 'expense'
      },
      {
        title: '财务报表',
        path: 'statement'
      }
    ]
  },
  {
    title: '客户管理',
    icon: User,
    path: 'customer',
    children: [
      {
        title: '客户列表',
        path: 'list'
      },
      {
        title: '客户服务',
        path: 'service'
      }
    ]
  },
  {
    title: '数据分析',
    icon: DataLine,
    path: 'analysis',
    children: [
      {
        title: '经营分析',
        path: 'business'
      },
      {
        title: '市场分析',
        path: 'market'
      }
    ]
  },
  {
    title: '企业管理',
    icon: OfficeBuilding,
    path: 'company',
    children: [
      {
        title: '企业信息',
        path: 'info'
      },
      {
        title: '部门管理',
        path: 'department'
      },
      {
        title: '员工管理',
        path: 'employee'
      }
    ]
  }
]; 