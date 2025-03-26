<template>
  <div class="after-sale">
    <div class="after-sale-header">
      <h3>售后服务</h3>
      <el-button 
        type="primary" 
        @click="handleApply"
        v-if="!order?.afterSale"
      >
        申请售后
      </el-button>
    </div>

    <div v-if="order?.afterSale" class="after-sale-info">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="售后状态">
          <el-tag :type="getStatusType(order.afterSale.status)">
            {{ getStatusText(order.afterSale.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="售后类型">
          {{ getTypeText(order.afterSale.type) }}
        </el-descriptions-item>
        <el-descriptions-item label="申请原因" :span="2">
          {{ order.afterSale.reason }}
        </el-descriptions-item>
        <el-descriptions-item label="问题描述" :span="2">
          {{ order.afterSale.description }}
        </el-descriptions-item>
        <el-descriptions-item label="申请时间">
          {{ order.afterSale.applyTime }}
        </el-descriptions-item>
        <el-descriptions-item label="处理时间">
          {{ order.afterSale.processTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="完成时间">
          {{ order.afterSale.completeTime || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="process-records" v-if="order.afterSale.processRecords?.length">
        <h4>处理记录</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in order.afterSale.processRecords"
            :key="index"
            :type="getTimelineItemType(index)"
            :timestamp="record.time"
          >
            <div class="timeline-content">
              <div class="operator">{{ record.operator }}</div>
              <div class="action">{{ record.action }}</div>
              <div class="remark" v-if="record.remark">{{ record.remark }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>

      <div class="attachments" v-if="order.afterSale.attachments?.length">
        <h4>附件</h4>
        <div class="attachment-list">
          <el-link
            v-for="(file, index) in order.afterSale.attachments"
            :key="index"
            type="primary"
            :href="file"
            target="_blank"
          >
            附件 {{ index + 1 }}
          </el-link>
        </div>
      </div>
    </div>

    <!-- 售后申请对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="申请售后"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="售后类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择售后类型">
            <el-option label="维修" value="repair" />
            <el-option label="退货" value="return" />
            <el-option label="退款" value="refund" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请原因" prop="reason">
          <el-input
            v-model="form.reason"
            type="textarea"
            :rows="3"
            placeholder="请描述申请原因"
          />
        </el-form-item>
        <el-form-item label="问题描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述问题"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="/api/upload"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
            :file-list="fileList"
            multiple
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            提 交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import type { Order, AfterSaleStatus, AfterSaleApplyParams } from '@/types/order';

const props = defineProps<{
  order?: Order;
}>();

const emit = defineEmits(['success']);

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const loading = ref(false);
const fileList = ref<any[]>([]);

const form = ref<AfterSaleApplyParams>({
  orderId: props.order?.id || 0,
  type: 'repair',
  reason: '',
  description: '',
  attachments: []
});

const rules = {
  type: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
  reason: [{ required: true, message: '请输入申请原因', trigger: 'blur' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }]
};

// 获取售后状态样式
const getStatusType = (status?: AfterSaleStatus) => {
  if (!status) return '';
  const map: Record<AfterSaleStatus, string> = {
    none: 'info',
    applying: 'warning',
    processing: 'primary',
    completed: 'success',
    rejected: 'danger'
  };
  return map[status];
};

// 获取售后状态文本
const getStatusText = (status?: AfterSaleStatus) => {
  if (!status) return '';
  const map: Record<AfterSaleStatus, string> = {
    none: '无售后',
    applying: '申请中',
    processing: '处理中',
    completed: '已完成',
    rejected: '已拒绝'
  };
  return map[status];
};

// 获取售后类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    repair: '维修',
    return: '退货',
    refund: '退款'
  };
  return map[type] || type;
};

// 获取时间线项目样式
const getTimelineItemType = (index: number) => {
  if (index === 0) return 'primary';
  if (index === props.order?.afterSale?.processRecords?.length! - 1) return 'success';
  return 'info';
};

// 申请售后
const handleApply = () => {
  dialogVisible.value = true;
};

// 上传成功
const handleUploadSuccess = (response: any) => {
  form.value.attachments?.push(response.url);
};

// 移除文件
const handleUploadRemove = (file: any) => {
  const index = form.value.attachments?.indexOf(file.url);
  if (index !== -1) {
    form.value.attachments?.splice(index!, 1);
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // TODO: 调用API提交售后申请
      setTimeout(() => {
        loading.value = false;
        ElMessage.success('申请提交成功');
        dialogVisible.value = false;
        emit('success');
      }, 1000);
    }
  });
};

const logisticsList = ref([
  {
    time: '2024-02-20 14:30',
    location: '济宁市汶上县中都街道中都广场',
    status: '已签收',
    operator: '张师傅',
    phone: '13953712345',
    remark: '客户本人签收'
  },
  {
    time: '2024-02-20 09:15',
    location: '济宁市汶上县中都街道中都广场',
    status: '派送中',
    operator: '张师傅',
    phone: '13953712345',
    remark: '正在派送，预计10:30送达'
  },
  {
    time: '2024-02-20 08:30',
    location: '济宁市汶上县中都街道中都广场',
    status: '已到达',
    operator: '张师傅',
    phone: '13953712345',
    remark: '已到达中都广场配送点'
  },
  {
    time: '2024-02-19 16:45',
    location: '济宁市汶上县中都街道中都广场',
    status: '运输中',
    operator: '李师傅',
    phone: '13953767890',
    remark: '从汶上县中都街道中都广场发出'
  },
  {
    time: '2024-02-19 14:20',
    location: '济宁市汶上县中都街道中都广场',
    status: '已发货',
    operator: '王师傅',
    phone: '13953723456',
    remark: '已打包完成，准备发货'
  }
]);
</script>

<style scoped lang="scss">
.after-sale {
  padding: 20px;

  .after-sale-header {
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

  .after-sale-info {
    .process-records {
      margin-top: 20px;

      h4 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: bold;
      }

      .timeline-content {
        .operator {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .action {
          color: #666;
          margin-bottom: 4px;
        }

        .remark {
          color: #999;
          font-size: 14px;
        }
      }
    }

    .attachments {
      margin-top: 20px;

      h4 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: bold;
      }

      .attachment-list {
        display: flex;
        gap: 16px;
      }
    }
  }
}
</style> 