<template>
  <div class="income-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入收入单号/来源"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.type" placeholder="收入类型" clearable style="width: 120px">
              <el-option label="订单收入" value="order" />
              <el-option label="其他收入" value="other" />
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
          <el-button type="primary" @click="handleAdd">新增收入</el-button>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>本月收入</h3>
              <div class="number">¥{{ stats.currentMonth.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>上月收入</h3>
              <div class="number">¥{{ stats.lastMonth.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>本年收入</h3>
              <div class="number">¥{{ stats.currentYear.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>同比增长</h3>
              <div class="number up">{{ stats.yearGrowth.toFixed(1) }}%</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="incomeList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="收入单号" width="180" />
          <el-table-column prop="type" label="收入类型" width="120">
            <template #default="{ row }">
              {{ getTypeText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="source" label="收入来源" />
          <el-table-column prop="amount" label="收入金额" width="120">
            <template #default="{ row }">
              <span :class="{ 'amount-up': true }">¥{{ row.amount.toFixed(2) }}</span>
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
                  <a class="success" @click="handleComplete(row)">确认收款</a>
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
      :title="formType === 'add' ? '新增收入' : '编辑收入'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="收入类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择收入类型" style="width: 100%">
            <el-option label="订单收入" value="order" />
            <el-option label="其他收入" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="收入来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入收入来源" />
        </el-form-item>
        <el-form-item label="收入金额" prop="amount">
          <el-input-number 
            v-model="form.amount" 
            :precision="2" 
            :step="1000"
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
      title="收入详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="收入单号">{{ viewData.code }}</el-descriptions-item>
        <el-descriptions-item label="收入类型">
          {{ getTypeText(viewData.type) }}
        </el-descriptions-item>
        <el-descriptions-item label="收入来源">{{ viewData.source }}</el-descriptions-item>
        <el-descriptions-item label="收入金额">
          <span class="amount-up">¥{{ viewData.amount?.toFixed(2) }}</span>
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

// 收入列表
const incomeList = ref([
  {
    id: 1,
    code: 'SR202503200001',
    type: 'order',
    source: '山东临工工程机械有限公司',
    amount: 586000.00,
    createTime: '2025-02-20 09:30:00',
    remark: '工业机器人系统采购',
    status: 'pending'
  },
  {
    id: 2,
    code: 'SR202503200002',
    type: 'order',
    source: '青岛海尔生物医疗股份有限公司',
    amount: 468000.00,
    createTime: '2025-02-20 10:15:00',
    remark: '医疗机器人定制开发',
    status: 'approved'
  },
  {
    id: 3,
    code: 'SR202503200003',
    type: 'order',
    source: '山东新华医疗器械股份有限公司',
    amount: 385000.00,
    createTime: '2025-02-20 11:20:00',
    remark: '手术辅助机器人系统',
    status: 'pending'
  },
  {
    id: 4,
    code: 'SR202503200004',
    type: 'other',
    source: '技术服务收入',
    amount: 156000.00,
    createTime: '2025-02-20 13:45:00',
    remark: '系统维护服务费',
    status: 'completed'
  },
  {
    id: 5,
    code: 'SR202503200005',
    type: 'order',
    source: '浪潮电子信息产业股份有限公司',
    amount: 658000.00,
    createTime: '2025-02-20 14:30:00',
    remark: '智能制造系统集成',
    status: 'pending'
  },
  {
    id: 6,
    code: 'SR202503200006',
    type: 'order',
    source: '中通客车控股股份有限公司',
    amount: 528000.00,
    createTime: '2025-02-20 15:10:00',
    remark: '自动化生产线升级'
  },
  {
    id: 7,
    code: 'SR202503200007',
    type: 'other',
    source: '配件销售收入',
    amount: 168000.00,
    createTime: '2025-02-20 15:45:00',
    remark: '机器人核心部件销售'
  },
  {
    id: 8,
    code: 'SR202503200008',
    type: 'order',
    source: '山东魏桥创业集团有限公司',
    amount: 785000.00,
    createTime: '2025-02-20 16:00:00',
    remark: '智能仓储系统项目'
  },
  {
    id: 9,
    code: 'SR202503200009',
    type: 'order',
    source: '山东晨鸣纸业集团股份有限公司',
    amount: 496000.00,
    createTime: '2025-02-20 16:30:00',
    remark: '自动化包装系统'
  },
  {
    id: 10,
    code: 'SR202503200010',
    type: 'other',
    source: '培训服务收入',
    amount: 128000.00,
    createTime: '2025-02-20 17:00:00',
    remark: '操作技术培训服务'
  }
]);

// 总数
const total = ref(100);

// 统计数据
const stats = {
  currentMonth: 4358000.00,
  lastMonth: 3685000.00,
  currentYear: 12568000.00,
  yearGrowth: 18.6
};

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    order: '订单收入',
    other: '其他收入'
  };
  return map[type] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  const { keyword, type, dateRange } = query.value;
  
  // 过滤数据
  const filteredData = incomeList.value.filter(item => {
    const matchKeyword = !keyword || 
      item.code.includes(keyword) || 
      item.source.includes(keyword);
    
    const matchType = !type || item.type === type;
    
    const matchDate = !dateRange || dateRange.length !== 2 || (
      new Date(item.createTime) >= new Date(dateRange[0]) &&
      new Date(item.createTime) <= new Date(dateRange[1])
    );
    
    return matchKeyword && matchType && matchDate;
  });
  
  // 更新总数
  total.value = filteredData.length;
  
  // 更新当前页数据
  const start = (query.value.page - 1) * query.value.pageSize;
  const end = start + query.value.pageSize;
  incomeList.value = filteredData.slice(start, end);
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
  source: '',
  amount: 0,
  remark: ''
});

// 表单规则
const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择收入类型', trigger: 'change' }],
  source: [{ required: true, message: '请输入收入来源', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入收入金额', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();

// 新增收入
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    type: '',
    source: '',
    amount: 0,
    remark: ''
  });
  dialogs.form = true;
};

// 编辑收入
const handleEdit = (row: any) => {
  formType.value = 'edit';
  Object.assign(form, {
    type: row.type,
    source: row.source,
    amount: row.amount,
    remark: row.remark
  });
  currentRow.value = row;
  dialogs.form = true;
};

// 查看收入
const handleView = (row: any) => {
  viewData.value = row;
  dialogs.view = true;
};

// 审核收入
const handleApprove = (row: any) => {
  ElMessageBox.confirm(
    '确定要审核通过该收入记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = 'approved';
    ElMessage.success('审核成功');
  }).catch(() => {});
};

// 确认收款
const handleComplete = (row: any) => {
  ElMessageBox.confirm(
    '确定要确认收款吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = 'completed';
    ElMessage.success('确认收款成功');
  }).catch(() => {});
};

// 修改删除收入函数
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该收入记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = incomeList.value.findIndex(item => item.id === row.id);
    if (index > -1) {
      incomeList.value.splice(index, 1);
      ElMessage.success('删除成功');
    }
  }).catch(() => {});
};

// 修改提交表单函数
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
        const code = `SR${createTime.replace(/[-: ]/g, '').slice(0, 12)}${String(incomeList.value.length + 1).padStart(4, '0')}`;
        incomeList.value.unshift({
          id: incomeList.value.length + 1,
          code,
          ...form,
          createTime,
          status: 'pending'
        });
        ElMessage.success('添加成功');
      } else {
        const index = incomeList.value.findIndex(item => item.id === currentRow.value.id);
        if (index > -1) {
          incomeList.value[index] = {
            ...incomeList.value[index],
            ...form,
            status: 'pending' // 编辑后状态重置为待处理
          };
          ElMessage.success('修改成功');
        }
      }
      dialogs.form = false;
    }
  });
};

// 修改分页函数
const handleSizeChange = (val: number) => {
  query.value.pageSize = val;
  handleSearch();
};

const handleCurrentChange = (val: number) => {
  query.value.page = val;
  handleSearch();
};

// 添加查看数据对象
const viewData = ref({});

// 初始化加载
handleSearch();
</script>

<style scoped lang="scss">
.income-container {
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

        &.up {
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

    .amount-up {
      color: #67C23A;
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