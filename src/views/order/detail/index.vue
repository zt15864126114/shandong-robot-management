<template>
  <div class="order-detail-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单详情</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ order?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ order?.customerName }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getOrderStatusType(order?.status)">
            {{ getOrderStatusText(order?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ order?.amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ order?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ order?.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ order?.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <div class="products-table">
        <div class="table-title">商品明细</div>
        <el-table :data="order?.products" border>
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价" width="120">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="120" />
          <el-table-column prop="total" label="小计" width="120">
            <template #default="{ row }">
              ¥{{ row.total.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Order, OrderStatus } from '@/types/order';

const route = useRoute();
const router = useRouter();
const order = ref<Order>();

// 获取订单状态样式
const getOrderStatusType = (status?: OrderStatus) => {
  if (!status) return '';
  const map: Record<OrderStatus, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'info'
  };
  return map[status];
};

// 获取订单状态文本
const getOrderStatusText = (status?: OrderStatus) => {
  if (!status) return '';
  const map: Record<OrderStatus, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status];
};

// 返回列表页
const handleBack = () => {
  router.back();
};

// 加载订单详情
const loadOrderDetail = () => {
  const id = Number(route.params.id);
  // 这里应该调用API获取订单详情
  // 暂时使用模拟数据
  order.value = {
    id,
    orderNo: `ORD${String(id).padStart(6, '0')}`,
    customerName: '测试客户',
    amount: 599.97,
    status: 'processing',
    createTime: '2025-02-26 18:51:19',
    updateTime: '2025-02-26 18:51:19',
    products: [
      {
        id: 1,
        name: '商品A',
        price: 99.99,
        quantity: 2,
        total: 199.98
      },
      {
        id: 2,
        name: '商品B',
        price: 399.99,
        quantity: 1,
        total: 399.99
      }
    ],
    remark: '这是一个测试订单'
  };
};

onMounted(() => {
  loadOrderDetail();
});
</script>

<style scoped lang="scss">
.order-detail-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .products-table {
    margin-top: 20px;

    .table-title {
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style> 