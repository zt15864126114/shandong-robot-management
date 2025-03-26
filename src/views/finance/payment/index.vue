<template>
  <div class="payment-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入订单号/交易号"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.paymentMethod" placeholder="支付方式" clearable style="width: 120px">
              <el-option label="支付宝" value="alipay" />
              <el-option label="微信支付" value="wechat" />
              <el-option label="银行卡" value="bank" />
            </el-select>
            <el-select v-model="query.status" placeholder="支付状态" clearable style="width: 120px">
              <el-option label="待支付" value="pending" />
              <el-option label="支付成功" value="success" />
              <el-option label="支付失败" value="failed" />
              <el-option label="已退款" value="refunded" />
            </el-select>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          </div>
          <div class="right">
            <el-button type="primary" @click="handleConfig">支付配置</el-button>
          </div>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>今日支付金额</h3>
              <div class="number primary">¥{{ stats.todayAmount }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>待支付订单</h3>
              <div class="number warning">{{ stats.pendingCount }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>本月支付金额</h3>
              <div class="number success">¥{{ stats.monthAmount }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>退款金额</h3>
              <div class="number info">¥{{ stats.refundAmount }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="paymentList" border style="width: 100%" height="100%" v-loading="loading">
          <el-table-column prop="orderNo" label="订单号" min-width="180" />
          <el-table-column prop="transactionNo" label="交易号" min-width="180" />
          <el-table-column prop="amount" label="支付金额" width="120">
            <template #default="{ row }">
              ¥{{ row.amount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="paymentMethod" label="支付方式" width="120">
            <template #default="{ row }">
              <el-tag :type="getPaymentMethodTag(row.paymentMethod)">
                {{ getPaymentMethodText(row.paymentMethod) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="支付状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="payTime" label="支付时间" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <a @click="handleView(row)">查看</a>
                <a v-if="row.status === 'pending'" @click="handleCancel(row)">取消</a>
                <a v-if="row.status === 'success'" @click="handleRefund(row)">退款</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogs.view"
      title="支付详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单号">{{ currentRow?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="交易号">{{ currentRow?.transactionNo }}</el-descriptions-item>
        <el-descriptions-item label="支付金额">¥{{ currentRow?.amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">
          <el-tag :type="getPaymentMethodTag(currentRow?.paymentMethod)">
            {{ getPaymentMethodText(currentRow?.paymentMethod) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付状态">
          <el-tag :type="getStatusType(currentRow?.status)">
            {{ getStatusText(currentRow?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ currentRow?.payTime }}</el-descriptions-item>
        <el-descriptions-item label="商品信息">{{ currentRow?.goodsInfo }}</el-descriptions-item>
        <el-descriptions-item label="买家信息">{{ currentRow?.buyerInfo }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow?.remark }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogs.view = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogs.refund"
      title="退款确认"
      width="500px"
    >
      <el-form
        ref="refundFormRef"
        :model="refundForm"
        :rules="refundRules"
        label-width="100px"
      >
        <el-form-item label="退款金额" prop="amount">
          <el-input-number 
            v-model="refundForm.amount" 
            :min="0" 
            :max="currentRow?.amount"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="退款原因" prop="reason">
          <el-input
            v-model="refundForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入退款原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.refund = false">取消</el-button>
        <el-button type="primary" @click="handleRefundSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  paymentMethod: '',
  status: ''
});

// 统计数据
const stats = ref({
  todayAmount: 28650.00,
  pendingCount: 15,
  monthAmount: 856420.00,
  refundAmount: 12580.00
});

// 支付列表
const paymentList = ref([
  {
    id: 1,
    orderNo: 'ORD202503010001',
    transactionNo: 'TRX202503010001',
    amount: 12800.00,
    paymentMethod: 'alipay',
    status: 'success',
    createTime: '2025-03-01 10:30:00',
    payTime: '2025-03-01 10:31:00',
    goodsInfo: '工业机器人 XR-2000',
    buyerInfo: '山东科技职业学院',
    remark: '正常支付'
  },
  {
    id: 2,
    orderNo: 'ORD202503010002',
    transactionNo: 'TRX202503010002',
    amount: 25600.00,
    paymentMethod: 'wechat',
    status: 'pending',
    createTime: '2025-03-01 14:20:00',
    payTime: '',
    goodsInfo: '智能生产线设备',
    buyerInfo: '济南智能制造有限公司',
    remark: '等待支付'
  },
  {
    id: 3,
    orderNo: 'ORD202503010003',
    transactionNo: 'TRX202503010003',
    amount: 15800.00,
    paymentMethod: 'bank',
    status: 'success',
    createTime: '2025-03-01 16:45:00',
    payTime: '2025-03-01 16:46:00',
    goodsInfo: '机器人配件套装',
    buyerInfo: '青岛医疗设备有限公司',
    remark: '正常支付'
  },
  {
    id: 4,
    orderNo: 'ORD202503010004',
    transactionNo: 'TRX202503010004',
    amount: 9800.00,
    paymentMethod: 'alipay',
    status: 'refunded',
    createTime: '2025-02-28 09:15:00',
    payTime: '2025-02-28 09:16:00',
    goodsInfo: '工业机器人 XR-1000',
    buyerInfo: '烟台自动化科技有限公司',
    remark: '客户要求退款'
  },
  {
    id: 5,
    orderNo: 'ORD202503010005',
    transactionNo: 'TRX202503010005',
    amount: 35600.00,
    paymentMethod: 'wechat',
    status: 'success',
    createTime: '2025-03-01 09:30:00',
    payTime: '2025-03-01 09:31:00',
    goodsInfo: '智能仓储系统',
    buyerInfo: '潍坊机器人研究院',
    remark: '正常支付'
  },
  {
    id: 6,
    orderNo: 'ORD202503010006',
    transactionNo: 'TRX202503010006',
    amount: 12800.00,
    paymentMethod: 'bank',
    status: 'failed',
    createTime: '2025-03-01 11:20:00',
    payTime: '',
    goodsInfo: '工业机器人 XR-3000',
    buyerInfo: '淄博智能装备有限公司',
    remark: '支付超时'
  },
  {
    id: 7,
    orderNo: 'ORD202503010007',
    transactionNo: 'TRX202503010007',
    amount: 8900.00,
    paymentMethod: 'alipay',
    status: 'success',
    createTime: '2025-03-01 15:40:00',
    payTime: '2025-03-01 15:41:00',
    goodsInfo: '机器人控制系统',
    buyerInfo: '临沂工业自动化有限公司',
    remark: '正常支付'
  },
  {
    id: 8,
    orderNo: 'ORD202503010008',
    transactionNo: 'TRX202503010008',
    amount: 15600.00,
    paymentMethod: 'wechat',
    status: 'pending',
    createTime: '2025-03-01 17:30:00',
    payTime: '',
    goodsInfo: '智能检测设备',
    buyerInfo: '济宁智能制造产业园',
    remark: '等待支付'
  },
  {
    id: 9,
    orderNo: 'ORD202503010009',
    transactionNo: 'TRX202503010009',
    amount: 23800.00,
    paymentMethod: 'bank',
    status: 'success',
    createTime: '2025-03-01 13:15:00',
    payTime: '2025-03-01 13:16:00',
    goodsInfo: '工业机器人 XR-4000',
    buyerInfo: '泰安自动化科技有限公司',
    remark: '正常支付'
  },
  {
    id: 10,
    orderNo: 'ORD202503010010',
    transactionNo: 'TRX202503010010',
    amount: 16800.00,
    paymentMethod: 'alipay',
    status: 'refunded',
    createTime: '2025-02-28 16:20:00',
    payTime: '2025-02-28 16:21:00',
    goodsInfo: '机器人维护服务',
    buyerInfo: '威海智能装备有限公司',
    remark: '服务未完成退款'
  }
]);

// 总数
const total = ref(100);

// 加载状态
const loading = ref(false);

// 对话框状态
const dialogs = reactive({
  view: false,
  refund: false
});

// 当前行数据
const currentRow = ref<any>(null);

// 退款表单
const refundForm = reactive({
  amount: 0,
  reason: ''
});

// 退款表单规则
const refundRules = reactive<FormRules>({
  amount: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入退款原因', trigger: 'blur' }]
});

const refundFormRef = ref<FormInstance>();

const router = useRouter();

// 获取支付方式标签
const getPaymentMethodTag = (method: string) => {
  const map: Record<string, string> = {
    alipay: 'success',
    wechat: 'primary',
    bank: 'warning'
  };
  return map[method] || 'info';
};

// 获取支付方式文本
const getPaymentMethodText = (method: string) => {
  const map: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行卡'
  };
  return map[method] || '未知';
};

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    success: 'success',
    failed: 'danger',
    refunded: 'info'
  };
  return map[status] || '';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待支付',
    success: '支付成功',
    failed: '支付失败',
    refunded: '已退款'
  };
  return map[status] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadPaymentList();
};

// 加载支付列表
const loadPaymentList = () => {
  loading.value = true;
  // 这里应该调用API获取数据
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// 查看支付详情
const handleView = (row: any) => {
  currentRow.value = row;
  dialogs.view = true;
};

// 取消支付
const handleCancel = (row: any) => {
  ElMessageBox.confirm(
    '确定要取消该支付订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('取消支付:', row);
    ElMessage.success('取消成功');
  }).catch(() => {});
};

// 申请退款
const handleRefund = (row: any) => {
  currentRow.value = row;
  refundForm.amount = row.amount;
  refundForm.reason = '';
  dialogs.refund = true;
};

// 提交退款
const handleRefundSubmit = async () => {
  if (!refundFormRef.value) return;
  
  await refundFormRef.value.validate((valid) => {
    if (valid) {
      console.log('退款信息:', refundForm);
      ElMessage.success('退款申请已提交');
      dialogs.refund = false;
    }
  });
};

// 分页大小改变
const handleSizeChange = () => {
  loadPaymentList();
};

// 页码改变
const handleCurrentChange = () => {
  loadPaymentList();
};

// 跳转到支付配置页面
const handleConfig = () => {
  router.push('/finance/payment/config');
};
</script>

<style scoped lang="scss">
.payment-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  .summary-cards {
    margin: 20px 0;

    .data-card {
      text-align: center;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #666;
      }
      
      .number {
        margin-top: 10px;
        font-size: 24px;
        font-weight: bold;

        &.primary {
          color: #409EFF;
        }

        &.warning {
          color: #E6A23C;
        }

        &.info {
          color: #909399;
        }

        &.success {
          color: #67C23A;
        }
      }
    }
  }

  .table-container {
    margin: 20px 0;
    height: 500px;
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .operation-buttons {
    display: flex;
    gap: 8px;
    
    a {
      color: var(--el-color-primary);
      cursor: pointer;
      
      &:hover {
        color: var(--el-color-primary-light-3);
      }
    }
  }
}
</style> 