<template>
  <div class="logistics-tracking">
    <div class="tracking-header">
      <h3>物流跟踪</h3>
      <el-tag :type="getStatusType(logistics?.status)">
        {{ getStatusText(logistics?.status) }}
      </el-tag>
    </div>

    <div class="tracking-info" v-if="logistics">
      <div class="info-item">
        <span class="label">运单号：</span>
        <span class="value">{{ logistics.trackingNumber || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">承运商：</span>
        <span class="value">{{ logistics.carrier || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">当前位置：</span>
        <span class="value">{{ logistics.currentLocation || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">取件时间：</span>
        <span class="value">{{ logistics.pickupTime || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">预计送达：</span>
        <span class="value">{{ logistics.deliveryTime || '-' }}</span>
      </div>
    </div>

    <div class="tracking-timeline">
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in logistics?.trackingHistory"
          :key="index"
          :type="getTimelineItemType(index)"
          :timestamp="record.time"
        >
          <div class="timeline-content">
            <div class="location">{{ record.location }}</div>
            <div class="status">{{ record.status }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <div class="tracking-actions" v-if="order?.status === 'unshipped'">
      <el-button type="primary" @click="handleUpdateLogistics">
        更新物流信息
      </el-button>
    </div>

    <!-- 物流信息更新对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="更新物流信息"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="物流状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择物流状态">
            <el-option label="待取件" value="pending" />
            <el-option label="已取件" value="picked_up" />
            <el-option label="运输中" value="in_transit" />
            <el-option label="已送达" value="delivered" />
          </el-select>
        </el-form-item>
        <el-form-item label="运单号" prop="trackingNumber">
          <el-input v-model="form.trackingNumber" placeholder="请输入运单号" />
        </el-form-item>
        <el-form-item label="承运商" prop="carrier">
          <el-select v-model="form.carrier" placeholder="请选择承运商">
            <el-option label="顺丰速运" value="顺丰速运" />
            <el-option label="德邦物流" value="德邦物流" />
            <el-option label="中通快递" value="中通快递" />
            <el-option label="圆通速递" value="圆通速递" />
            <el-option label="韵达快递" value="韵达快递" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前位置" prop="currentLocation">
          <el-input v-model="form.currentLocation" placeholder="请输入当前位置" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import type { LogisticsStatus, Order, LogisticsUpdateParams } from '@/types/order';

const props = defineProps<{
  order?: Order;
}>();

const emit = defineEmits(['success']);

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = ref<LogisticsUpdateParams>({
  orderId: props.order?.id || 0,
  status: 'pending',
  trackingNumber: '',
  carrier: '',
  currentLocation: '',
  remark: ''
});

const rules = {
  status: [{ required: true, message: '请选择物流状态', trigger: 'change' }],
  trackingNumber: [{ required: true, message: '请输入运单号', trigger: 'blur' }],
  carrier: [{ required: true, message: '请选择承运商', trigger: 'change' }],
  currentLocation: [{ required: true, message: '请输入当前位置', trigger: 'blur' }]
};

const logistics = computed(() => props.order?.logistics);

// 获取物流状态样式
const getStatusType = (status?: LogisticsStatus) => {
  if (!status) return '';
  const map: Record<LogisticsStatus, string> = {
    pending: 'info',
    picked_up: 'primary',
    in_transit: 'warning',
    delivered: 'success'
  };
  return map[status];
};

// 获取物流状态文本
const getStatusText = (status?: LogisticsStatus) => {
  if (!status) return '';
  const map: Record<LogisticsStatus, string> = {
    pending: '待取件',
    picked_up: '已取件',
    in_transit: '运输中',
    delivered: '已送达'
  };
  return map[status];
};

// 获取时间线项目样式
const getTimelineItemType = (index: number) => {
  if (index === 0) return 'primary';
  if (index === logistics.value?.trackingHistory.length! - 1) return 'success';
  return 'info';
};

// 更新物流信息
const handleUpdateLogistics = () => {
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // TODO: 调用API更新物流信息
      setTimeout(() => {
        loading.value = false;
        ElMessage.success('物流信息更新成功');
        dialogVisible.value = false;
        emit('success');
      }, 1000);
    }
  });
};
</script>

<style scoped lang="scss">
.logistics-tracking {
  padding: 20px;

  .tracking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .tracking-info {
    background-color: #f5f7fa;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 20px;

    .info-item {
      display: flex;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 80px;
        color: #666;
      }

      .value {
        flex: 1;
        color: #333;
      }
    }
  }

  .tracking-timeline {
    margin-bottom: 20px;

    .timeline-content {
      .location {
        font-weight: bold;
        margin-bottom: 4px;
      }

      .status {
        color: #666;
        font-size: 14px;
      }
    }
  }

  .tracking-actions {
    text-align: center;
    margin-top: 20px;
  }
}
</style> 