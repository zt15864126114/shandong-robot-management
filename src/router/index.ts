import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import DefaultLayout from '@/layouts/default/index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('@/views/welcome/index.vue'),
        meta: {
          title: '欢迎'
        }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/overview/index.vue'),
        meta: {
          title: '数据大屏'
        }
      },
      {
        path: 'order',
        name: 'Order',
        redirect: '/order/list',
        meta: {
          title: '订单管理'
        },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/order/list/index.vue'),
            meta: {
              title: '订单列表'
            }
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('@/views/order/detail/index.vue'),
            meta: {
              title: '订单详情'
            }
          }
        ]
      },
      {
        path: 'supply',
        name: 'Supply',
        redirect: '/supply/supplier',
        meta: {
          title: '供应链管理'
        },
        children: [
          {
            path: 'supplier',
            name: 'Supplier',
            component: () => import('@/views/supply/supplier/index.vue'),
            meta: {
              title: '供应商管理'
            }
          },
          {
            path: 'inventory',
            name: 'Inventory',
            component: () => import('@/views/supply/inventory/index.vue'),
            meta: {
              title: '库存管理'
            }
          },
          {
            path: 'purchase',
            name: 'Purchase',
            component: () => import('@/views/supply/purchase/index.vue'),
            meta: {
              title: '采购管理'
            }
          },
          {
            path: 'logistics',
            name: 'Logistics',
            component: () => import('@/views/supply/logistics/index.vue'),
            meta: {
              title: '物流管理'
            }
          }
        ]
      },
      {
        path: 'finance',
        name: 'Finance',
        redirect: '/finance/income',
        meta: {
          title: '财务管理'
        },
        children: [
          {
            path: 'income',
            name: 'Income',
            component: () => import('@/views/finance/income/index.vue'),
            meta: {
              title: '收入管理'
            }
          },
          {
            path: 'expense',
            name: 'Expense',
            component: () => import('@/views/finance/expense/index.vue'),
            meta: {
              title: '支出管理'
            }
          },
          {
            path: 'statement',
            name: 'Statement',
            component: () => import('@/views/finance/statement/index.vue'),
            meta: {
              title: '财务报表'
            }
          },
          {
            path: 'invoice',
            name: 'Invoice',
            component: () => import('@/views/finance/invoice/index.vue'),
            meta: {
              title: '发票管理'
            }
          },
          {
            path: 'reimbursement',
            name: 'Reimbursement',
            component: () => import('@/views/finance/reimbursement/index.vue'),
            meta: {
              title: '报销管理'
            }
          },
          {
            path: 'payment',
            name: 'Payment',
            redirect: '/finance/payment/list',
            meta: {
              title: '支付管理'
            },
            children: [
              {
                path: 'list',
                name: 'PaymentList',
                component: () => import('@/views/finance/payment/index.vue'),
                meta: {
                  title: '支付记录'
                }
              },
              {
                path: 'config',
                name: 'PaymentConfig',
                component: () => import('@/views/finance/payment/config.vue'),
                meta: {
                  title: '支付配置'
                }
              }
            ]
          },
        ]
      },
      {
        path: 'customer',
        name: 'Customer',
        redirect: '/customer/list',
        meta: {
          title: '客户管理'
        },
        children: [
          {
            path: 'list',
            name: 'CustomerList',
            component: () => import('@/views/customer/list/index.vue'),
            meta: {
              title: '客户列表'
            }
          },
          {
            path: 'service',
            name: 'CustomerService',
            component: () => import('@/views/customer/service/index.vue'),
            meta: {
              title: '客户服务'
            }
          }
        ]
      },
      {
        path: 'marketing',
        name: 'Marketing',
        redirect: '/marketing/promotion',
        meta: {
          title: '营销管理'
        },
        children: [
          {
            path: 'promotion',
            name: 'Promotion',
            component: () => import('@/views/marketing/promotion/index.vue'),
            meta: {
              title: '营销推广'
            }
          }
        ]
      },
      {
        path: 'analysis',
        name: 'Analysis',
        redirect: '/analysis/business',
        meta: {
          title: '数据分析'
        },
        children: [
          {
            path: 'business',
            name: 'BusinessAnalysis',
            component: () => import('@/views/analysis/business/index.vue'),
            meta: {
              title: '经营分析'
            }
          },
          {
            path: 'market',
            name: 'MarketAnalysis',
            component: () => import('@/views/analysis/market/index.vue'),
            meta: {
              title: '市场分析'
            }
          }
        ]
      },
      {
        path: 'company',
        children: [
          {
            path: 'info',
            component: () => import('@/views/company/info/index.vue'),
            meta: {
              title: '企业信息'
            }
          },
          {
            path: 'department',
            component: () => import('@/views/company/department/index.vue'),
            meta: {
              title: '部门管理'
            }
          },
          {
            path: 'employee',
            component: () => import('@/views/company/employee/index.vue'),
            meta: {
              title: '员工管理'
            }
          }
        ]
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/products/index.vue'),
        meta: {
          title: '产品服务'
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
});

export default router; 