<template>
  <div class="reimbursement-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入报销单号/申请人"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.type" placeholder="报销类型" clearable style="width: 120px">
              <el-option label="差旅费" value="travel" />
              <el-option label="办公用品" value="office" />
              <el-option label="业务招待" value="entertainment" />
              <el-option label="其他" value="other" />
            </el-select>
            <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px">
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
              <el-option label="已支付" value="paid" />
            </el-select>
            <el-date-picker
              v-model="query.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增报销</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="reimbursementList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="报销单号" width="180" />
          <el-table-column prop="type" label="报销类型" width="120">
            <template #default="{ row }">
              {{ getTypeText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="applicant" label="申请人" width="120" />
          <el-table-column prop="department" label="部门" width="120" />
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="{ row }">
              <span class="amount">¥{{ row.amount.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <a @click="handleView(row)">查看</a>
                <template v-if="row.status === 'pending'">
                  <a @click="handleEdit(row)">编辑</a>
                  <a class="danger" @click="handleDelete(row)">删除</a>
                </template>
                <template v-if="row.status === 'pending' && isAdmin">
                  <a class="success" @click="handleApprove(row)">通过</a>
                  <a class="danger" @click="handleReject(row)">驳回</a>
                </template>
                <template v-if="row.status === 'approved' && isFinance">
                  <a class="success" @click="handlePay(row)">支付</a>
                </template>
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

    <!-- 报销表单对话框 -->
    <el-dialog
      v-model="dialogs.form"
      :title="formType === 'add' ? '新增报销' : '编辑报销'"
      width="700px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报销类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择报销类型" style="width: 100%">
                <el-option label="差旅费" value="travel" />
                <el-option label="办公用品" value="office" />
                <el-option label="业务招待" value="entertainment" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额" prop="amount">
              <el-input-number 
                v-model="form.amount" 
                :precision="2" 
                :step="100"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="报销说明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入报销说明"
          />
        </el-form-item>

        <el-form-item label="附件" prop="attachments">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :limit="5"
            multiple
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                支持jpg/png/pdf格式，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.form = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 报销查看对话框 -->
    <el-dialog
      v-model="dialogs.view"
      title="报销详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="报销单号">{{ detail.code }}</el-descriptions-item>
        <el-descriptions-item label="报销类型">{{ getTypeText(detail.type) }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ detail.applicant }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detail.department }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ detail.amount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detail.status)">
            {{ getStatusText(detail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="报销说明">{{ detail.description }}</el-descriptions-item>
      </el-descriptions>
      <div class="attachments-container" v-if="detail.attachments?.length">
        <h4>附件列表</h4>
        <el-table :data="detail.attachments" border style="width: 100%">
          <el-table-column prop="name" label="文件名" />
          <el-table-column prop="size" label="大小" width="120" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <a @click="handleDownloadAttachment(row)">下载</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  type: '',
  status: '',
  dateRange: []
});

// 报销列表
const reimbursementList = ref([
  {
    id: 1,
    code: 'BX20250320001',
    type: 'travel',
    applicant: '刘明阳',
    department: '销售部',
    amount: 2860.00,
    status: 'pending',
    createTime: '2025-03-20 09:30:00',
    description: '青岛客户拜访差旅费',
    attachments: [
      { name: '机票.pdf', size: '2.5MB' },
      { name: '住宿发票.jpg', size: '1.2MB' }
    ]
  },
  {
    id: 2,
    code: 'BX20250320002',
    type: 'entertainment',
    applicant: '王建国',
    department: '市场部',
    amount: 1280.00,
    status: 'approved',
    createTime: '2025-03-20 10:15:00',
    description: '客户接待餐费',
    attachments: [
      { name: '餐饮发票.jpg', size: '0.8MB' }
    ]
  },
  {
    id: 3,
    code: 'BX20250320003',
    type: 'office',
    applicant: '张志强',
    department: '技术部',
    amount: 560.00,
    status: 'rejected',
    createTime: '2025-03-19 14:20:00',
    description: '办公用品采购',
    attachments: [
      { name: '办公用品发票.jpg', size: '0.5MB' }
    ]
  },
  {
    id: 4,
    code: 'BX20250320004',
    type: 'travel',
    applicant: '陈海波',
    department: '销售部',
    amount: 3420.00,
    status: 'paid',
    createTime: '2025-03-19 11:30:00',
    description: '北京展会差旅费',
    attachments: [
      { name: '机票.pdf', size: '2.8MB' },
      { name: '住宿发票.jpg', size: '1.5MB' },
      { name: '展会门票.pdf', size: '1.0MB' }
    ]
  },
  {
    id: 5,
    code: 'BX20250320005',
    type: 'entertainment',
    applicant: '李伟东',
    department: '市场部',
    amount: 2560.00,
    status: 'pending',
    createTime: '2025-03-18 16:45:00',
    description: '客户答谢晚宴',
    attachments: [
      { name: '餐饮发票.jpg', size: '1.2MB' }
    ]
  },
  {
    id: 6,
    code: 'BX20250320006',
    type: 'office',
    applicant: '赵明',
    department: '行政部',
    amount: 890.00,
    status: 'approved',
    createTime: '2025-03-18 09:20:00',
    description: '办公设备维修费',
    attachments: [
      { name: '维修发票.jpg', size: '0.6MB' }
    ]
  },
  {
    id: 7,
    code: 'BX20250320007',
    type: 'travel',
    applicant: '刘明阳',
    department: '销售部',
    amount: 1890.00,
    status: 'pending',
    createTime: '2025-03-17 15:30:00',
    description: '济南客户拜访差旅费',
    attachments: [
      { name: '高铁票.pdf', size: '1.8MB' },
      { name: '住宿发票.jpg', size: '0.9MB' }
    ]
  },
  {
    id: 8,
    code: 'BX20250320008',
    type: 'other',
    applicant: '王建国',
    department: '市场部',
    amount: 680.00,
    status: 'rejected',
    createTime: '2025-03-17 10:45:00',
    description: '快递费',
    attachments: [
      { name: '快递发票.jpg', size: '0.4MB' }
    ]
  },
  {
    id: 9,
    code: 'BX20250320009',
    type: 'entertainment',
    applicant: '张志强',
    department: '技术部',
    amount: 1560.00,
    status: 'approved',
    createTime: '2025-03-16 14:15:00',
    description: '团队建设活动',
    attachments: [
      { name: '活动发票.jpg', size: '1.1MB' }
    ]
  },
  {
    id: 10,
    code: 'BX20250320010',
    type: 'office',
    applicant: '陈海波',
    department: '销售部',
    amount: 420.00,
    status: 'paid',
    createTime: '2025-03-16 11:20:00',
    description: '办公用品采购',
    attachments: [
      { name: '办公用品发票.jpg', size: '0.7MB' }
    ]
  },
  {
    id: 11,
    code: 'BX20250320011',
    type: 'travel',
    applicant: '李伟东',
    department: '市场部',
    amount: 3240.00,
    status: 'pending',
    createTime: '2025-03-15 16:30:00',
    description: '上海展会差旅费',
    attachments: [
      { name: '机票.pdf', size: '2.2MB' },
      { name: '住宿发票.jpg', size: '1.3MB' },
      { name: '展会门票.pdf', size: '0.9MB' }
    ]
  },
  {
    id: 12,
    code: 'BX20250320012',
    type: 'entertainment',
    applicant: '赵明',
    department: '行政部',
    amount: 980.00,
    status: 'approved',
    createTime: '2025-03-15 09:45:00',
    description: '部门聚餐',
    attachments: [
      { name: '餐饮发票.jpg', size: '0.6MB' }
    ]
  }
]);

// 总数
const total = ref(100);

// 对话框状态
const dialogs = reactive({
  form: false,
  view: false
});

// 表单类型
const formType = ref<'add' | 'edit'>('add');

// 当前行数据
const currentRow = ref({});

// 详情数据
const detail = ref({});

// 表单数据
const form = reactive({
  type: '',
  amount: 0,
  description: '',
  attachments: []
});

// 表单规则
const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择报销类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  description: [{ required: true, message: '请输入报销说明', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();

// 模拟用户角色
const isAdmin = ref(true);
const isFinance = ref(true);

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    travel: '差旅费',
    office: '办公用品',
    entertainment: '业务招待',
    other: '其他'
  };
  return map[type] || '未知';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回',
    paid: '已支付'
  };
  return map[status] || '未知';
};

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    paid: 'success'
  };
  return map[status] || 'info';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadData();
};

// 加载数据
const loadData = () => {
  // TODO: 调用API获取数据
  console.log('加载报销列表:', query.value);
};

// 新增
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    type: '',
    amount: 0,
    description: '',
    attachments: []
  });
  dialogs.form = true;
};

// 编辑
const handleEdit = (row: any) => {
  formType.value = 'edit';
  Object.assign(form, row);
  currentRow.value = row;
  dialogs.form = true;
};

// 查看
const handleView = (row: any) => {
  detail.value = row;
  dialogs.view = true;
};

// 下载附件
const handleDownloadAttachment = (attachment: any) => {
  // TODO: 实现下载逻辑
  ElMessage.success('开始下载附件');
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该报销记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除报销:', row);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 通过
const handleApprove = (row: any) => {
  ElMessageBox.confirm(
    '确定要通过该报销申请吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = 'approved';
    ElMessage.success('已通过');
  }).catch(() => {});
};

// 驳回
const handleReject = (row: any) => {
  ElMessageBox.confirm(
    '确定要驳回该报销申请吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = 'rejected';
    ElMessage.success('已驳回');
  }).catch(() => {});
};

// 支付
const handlePay = (row: any) => {
  ElMessageBox.confirm(
    '确定要支付该报销款项吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = 'paid';
    ElMessage.success('支付成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadData();
};

// 页码改变
const handleCurrentChange = () => {
  loadData();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (formType.value === 'add') {
        reimbursementList.value.unshift({
          id: reimbursementList.value.length + 1,
          code: `BX${new Date().toISOString().slice(0,10).replace(/-/g,'')}${String(reimbursementList.value.length + 1).padStart(3, '0')}`,
          applicant: '刘明阳',
          department: '销售部',
          status: 'pending',
          createTime: new Date().toLocaleString(),
          ...form
        });
        ElMessage.success('添加成功');
      } else {
        Object.assign(currentRow.value, form);
        ElMessage.success('修改成功');
      }
      dialogs.form = false;
    }
  });
};
</script>

<style scoped lang="scss">
.reimbursement-container {
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
  }

  .table-container {
    margin: 20px 0;
    height: calc(100vh - 280px);
    
    :deep(.el-table) {
      height: 100%;
    }

    .amount {
      color: var(--el-color-primary);
      font-weight: bold;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  :deep(.operation-buttons) {
    display: flex;
    gap: 8px;
    
    a {
      color: var(--el-color-primary);
      cursor: pointer;
      
      &:hover {
        color: var(--el-color-primary-light-3);
      }
      
      &.danger {
        color: var(--el-color-danger);
        
        &:hover {
          color: var(--el-color-danger-light-3);
        }
      }
      
      &.success {
        color: var(--el-color-success);
        
        &:hover {
          color: var(--el-color-success-light-3);
        }
      }
    }
  }

  .attachments-container {
    margin-top: 20px;
    
    h4 {
      margin-bottom: 16px;
    }
  }
}
</style> 