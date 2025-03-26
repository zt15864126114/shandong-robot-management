<template>
  <el-dialog
    title="订单详情"
    v-model="visible"
    width="900px"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="basic">
        <el-descriptions v-if="order" :column="2" border>
          <el-descriptions-item label="订单编号">{{ order?.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(order?.status)">
              {{ getStatusText(order?.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户名称">{{ order?.customer }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ formatNumber(order?.amount) }}</el-descriptions-item>
          <el-descriptions-item label="产品类型">{{ order?.productType }}</el-descriptions-item>
          <el-descriptions-item label="产品型号">{{ order?.productModel }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ order?.createTime }}</el-descriptions-item>
          <el-descriptions-item label="交付时间">{{ order?.deliveryTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ order?.remark || '暂无备注' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="timeline-section">
          <h3>订单进度</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in orderTimeline"
              :key="index"
              :type="activity.type"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>

      <el-tab-pane label="物流跟踪" name="logistics">
        <logistics-tracking :order="order" @success="handleSuccess" />
      </el-tab-pane>

      <el-tab-pane label="售后服务" name="afterSale">
        <after-sale :order="order" @success="handleSuccess" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
        <el-button 
          type="primary" 
          v-if="order?.status === 'unpaid'"
          @click="handlePay"
        >
          确认付款
        </el-button>
        <el-button 
          type="success" 
          v-if="order?.status === 'unshipped'"
          @click="handleShip"
        >
          确认发货
        </el-button>
        <el-button 
          type="success" 
          v-if="order?.status === 'shipped'"
          @click="handleComplete"
        >
          确认完成
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Order, OrderStatus } from '@/types/order';
import LogisticsTracking from './logistics-tracking.vue';
import AfterSale from './after-sale.vue';

const props = defineProps<{
  modelValue: boolean;
  order?: Order;
}>();

const emit = defineEmits(['update:modelValue', 'success']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const activeTab = ref('basic');

// 获取订单状态样式
const getStatusType = (status?: OrderStatus) => {
  if (!status) return '';
  const map: Record<OrderStatus, string> = {
    unpaid: 'warning',
    unshipped: 'primary',
    shipped: 'success',
    completed: 'success',
    cancelled: 'info'
  };
  return map[status];
};

// 获取订单状态文本
const getStatusText = (status?: OrderStatus) => {
  if (!status) return '';
  const map: Record<OrderStatus, string> = {
    unpaid: '待付款',
    unshipped: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status];
};

// 格式化数字
const formatNumber = (num?: number) => {
  if (!num) return '0.00';
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 订单时间线
const orderTimeline = computed(() => {
  if (!props.order) return [];
  
  const timeline = [
    {
      content: '订单创建',
      timestamp: props.order.createTime,
      type: 'primary'
    }
  ];

  if (props.order.status === 'cancelled') {
    timeline.push({
      content: '订单取消',
      timestamp: props.order.updateTime,
      type: 'danger'
    });
  } else {
    if (props.order.status !== 'unpaid') {
      timeline.push({
        content: '付款完成',
        timestamp: props.order.payTime || '-',
        type: 'success'
      });
    }
    if (['shipped', 'completed'].includes(props.order.status)) {
      timeline.push({
        content: '商品发货',
        timestamp: props.order.shipTime || '-',
        type: 'success'
      });
    }
    if (props.order.status === 'completed') {
      timeline.push({
        content: '订单完成',
        timestamp: props.order.completeTime || '-',
        type: 'success'
      });
    }
  }

  return timeline;
});

// 确认付款
const handlePay = () => {
  ElMessageBox.confirm(
    '确认该订单已完成付款？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('确认付款成功');
    emit('success');
    visible.value = false;
  });
};

// 确认发货
const handleShip = () => {
  ElMessageBox.confirm(
    '确认发货该订单？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('确认发货成功');
    emit('success');
    visible.value = false;
  });
};

// 确认完成
const handleComplete = () => {
  ElMessageBox.confirm(
    '确认完成该订单？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('订单已完成');
    emit('success');
    visible.value = false;
  });
};

// 操作成功回调
const handleSuccess = () => {
  emit('success');
};
</script>

<style scoped lang="scss">
.timeline-section {
  margin-top: 30px;
  
  h3 {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: bold;
  }
}

:deep(.el-descriptions) {
  margin: 20px 0;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}
</style> 