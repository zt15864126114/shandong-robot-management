<template>
  <div class="expense-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入支出单号/用途"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.type" placeholder="支出类型" clearable style="width: 120px">
              <el-option label="采购支出" value="purchase" />
              <el-option label="工资支出" value="salary" />
              <el-option label="其他支出" value="other" />
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
          <el-button type="primary" @click="handleAdd">新增支出</el-button>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>本月支出</h3>
              <div class="number down">¥{{ stats.currentMonth.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>上月支出</h3>
              <div class="number down">¥{{ stats.lastMonth.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>本年支出</h3>
              <div class="number down">¥{{ stats.currentYear.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>同比增长</h3>
              <div class="number down">+{{ stats.yearGrowth.toFixed(1) }}%</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="expenseList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="支出单号" width="180" />
          <el-table-column prop="type" label="支出类型" width="120">
            <template #default="{ row }">
              {{ getTypeText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="purpose" label="支出用途" />
          <el-table-column prop="amount" label="支出金额" width="120">
            <template #default="{ row }">
              <span class="amount-down">¥{{ row.amount.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <template v-if="row.status === 'pending'">
                  <a @click="handleEdit(row)">编辑</a>
                  <a @click="handleApprove(row)">审核</a>
                  <a class="danger" @click="handleDelete(row)">删除</a>
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else-if="row.status === 'approved'">
                  <a class="success" @click="handleComplete(row)">确认付款</a>
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else>
                  <a @click="handleView(row)">查看</a>
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

    <el-dialog
      v-model="dialogs.form"
      :title="formType === 'add' ? '新增支出' : '编辑支出'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="支出类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择支出类型" style="width: 100%">
            <el-option label="采购支出" value="purchase" />
            <el-option label="工资支出" value="salary" />
            <el-option label="其他支出" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="支出用途" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入支出用途" />
        </el-form-item>
        <el-form-item label="支出金额" prop="amount">
          <el-input-number 
            v-model="form.amount" 
            :precision="2" 
            :step="100"
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.form = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="dialogs.view"
      title="支出详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="支出单号">{{ viewData.code }}</el-descriptions-item>
        <el-descriptions-item label="支出类型">
          {{ getTypeText(viewData.type) }}
        </el-descriptions-item>
        <el-descriptions-item label="支出用途">{{ viewData.purpose }}</el-descriptions-item>
        <el-descriptions-item label="支出金额">
          <span class="amount-down">¥{{ viewData.amount?.toFixed(2) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="viewData.status === 'pending' ? 'warning' : viewData.status === 'approved' ? 'primary' : 'success'">
            {{ viewData.status === 'pending' ? '待处理' : viewData.status === 'approved' ? '已审核' : '已完成' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ viewData.remark }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogs.view = false">关闭</el-button>
        </span>
      </template>
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
  dateRange: []
});

// 支出列表
const expenseList = ref([
  {
    id: 1,
    code: 'ZC202503200001',
    type: 'purchase',
    purpose: '采购工业机器人核心部件',
    amount: 285600.00,
    createTime: '2025-02-20 09:30:00',
    remark: '用于新产品研发',
    status: 'pending'
  },
  {
    id: 2,
    code: 'ZC202503200002',
    type: 'salary',
    purpose: '研发部门工资',
    amount: 458900.00,
    createTime: '2025-02-20 10:15:00',
    remark: '3月份工资',
    status: 'approved'
  },
  {
    id: 3,
    code: 'ZC202503200003',
    type: 'purchase',
    purpose: '采购传感器模块',
    amount: 156800.00,
    createTime: '2025-02-20 11:20:00',
    remark: '智能控制系统升级',
    status: 'pending'
  },
  {
    id: 4,
    code: 'ZC202503200004',
    type: 'other',
    purpose: '办公设备更新',
    amount: 89500.00,
    createTime: '2025-02-20 13:45:00',
    remark: '更新研发部门设备',
    status: 'completed'
  },
  {
    id: 5,
    code: 'ZC202503200005',
    type: 'purchase',
    purpose: '原材料采购',
    amount: 235600.00,
    createTime: '2025-02-20 14:30:00',
    remark: '生产线原材料补充',
    status: 'pending'
  },
  {
    id: 6,
    code: 'ZC202503200006',
    type: 'other',
    purpose: '研发实验室装修',
    amount: 168000.00,
    createTime: '2025-02-20 15:10:00',
    remark: '新建机器人测试实验室'
  },
  {
    id: 7,
    code: 'ZC202503200007',
    type: 'purchase',
    purpose: '采购测试设备',
    amount: 198500.00,
    createTime: '2025-02-20 15:45:00',
    remark: '质量检测设备更新'
  },
  {
    id: 8,
    code: 'ZC202503200008',
    type: 'salary',
    purpose: '生产部门工资',
    amount: 386500.00,
    createTime: '2025-02-20 16:00:00',
    remark: '3月份工资'
  },
  {
    id: 9,
    code: 'ZC202503200009',
    type: 'purchase',
    purpose: '采购机器人控制系统',
    amount: 326800.00,
    createTime: '2025-02-20 16:15:00',
    remark: '新一代控制系统升级'
  },
  {
    id: 10,
    code: 'ZC202503200010',
    type: 'other',
    purpose: '员工培训费用',
    amount: 85600.00,
    createTime: '2025-02-20 16:30:00',
    remark: '技术人员专业培训'
  },
  {
    id: 11,
    code: 'ZC202503200011',
    type: 'purchase',
    purpose: '采购伺服电机',
    amount: 178500.00,
    createTime: '2025-02-20 16:45:00',
    remark: '机器人关节驱动系统'
  },
  {
    id: 12,
    code: 'ZC202503200012',
    type: 'salary',
    purpose: '管理部门工资',
    amount: 265000.00,
    createTime: '2025-02-20 17:00:00',
    remark: '3月份工资'
  },
  {
    id: 13,
    code: 'ZC202503200013',
    type: 'other',
    purpose: '软件系统授权',
    amount: 156000.00,
    createTime: '2025-02-20 17:15:00',
    remark: '工业软件年度授权'
  },
  {
    id: 14,
    code: 'ZC202503200014',
    type: 'purchase',
    purpose: '采购工业相机',
    amount: 145800.00,
    createTime: '2025-02-20 17:30:00',
    remark: '机器视觉系统升级'
  }
]);

// 总数
const total = ref(100);

// 统计数据
const stats = {
  currentMonth: 3137500.00,
  lastMonth: 2235600.00,
  currentYear: 8956000.00,
  yearGrowth: 15.8
};

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    purchase: '采购支出',
    salary: '工资支出',
    other: '其他支出'
  };
  return map[type] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadExpenseList();
};

// 加载支出列表
const loadExpenseList = () => {
  // 这里应该调用API获取数据
  console.log('加载支出列表:', query.value);
};

// 对话框状态
const dialogs = reactive({
  form: false,
  view: false
});

// 表单类型
const formType = ref<'add' | 'edit'>('add');

// 当前行数据
const currentRow = ref({});

// 表单数据
const form = reactive({
  type: '',
  purpose: '',
  amount: 0,
  remark: ''
});

// 表单规则
const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择支出类型', trigger: 'change' }],
  purpose: [{ required: true, message: '请输入支出用途', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入支出金额', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();

// 新增支出
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    type: '',
    purpose: '',
    amount: 0,
    remark: ''
  });
  dialogs.form = true;
};

// 编辑支出
const handleEdit = (row: any) => {
  formType.value = 'edit';
  Object.assign(form, {
    type: row.type,
    purpose: row.purpose,
    amount: row.amount,
    remark: row.remark
  });
  currentRow.value = row;
  dialogs.form = true;
};

// 删除支出
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该支出记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除支出:', row);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadExpenseList();
};

// 页码改变
const handleCurrentChange = () => {
  loadExpenseList();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      const now = new Date();
      const createTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-');

      if (formType.value === 'add') {
        const code = `ZC${createTime.replace(/[-: ]/g, '').slice(0, 12)}${String(expenseList.value.length + 1).padStart(4, '0')}`;
        expenseList.value.unshift({
          id: expenseList.value.length + 1,
          code,
          ...form,
          createTime,
          status: 'pending'
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

// 添加查看数据对象
const viewData = ref({});

// 添加查看方法
const handleView = (row: any) => {
  viewData.value = row;
  dialogs.view = true;
};
</script>

<style scoped lang="scss">
.expense-container {
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
        color: #409EFF;

        &.down {
          color: #F56C6C;
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

    .amount-down {
      color: #F56C6C;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
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
}
</style> 