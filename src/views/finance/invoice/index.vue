<template>
  <div class="invoice-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入发票号码/抬头"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.type" placeholder="发票类型" clearable style="width: 120px">
              <el-option label="增值税专票" value="special" />
              <el-option label="增值税普票" value="normal" />
              <el-option label="电子发票" value="electronic" />
            </el-select>
            <el-select v-model="query.direction" placeholder="开票方向" clearable style="width: 120px">
              <el-option label="开出" value="out" />
              <el-option label="收到" value="in" />
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
          <el-button type="primary" @click="handleAdd">新增发票</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="invoiceList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="发票号码" width="180" />
          <el-table-column prop="type" label="发票类型" width="120">
            <template #default="{ row }">
              {{ getTypeText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="direction" label="开票方向" width="100">
            <template #default="{ row }">
              {{ getDirectionText(row.direction) }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="发票抬头" min-width="200" />
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="{ row }">
              <span :class="row.direction === 'in' ? 'amount-up' : 'amount-down'">
                ¥{{ row.amount.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="taxRate" label="税率" width="100">
            <template #default="{ row }">
              {{ row.taxRate }}%
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="开票日期" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <a @click="handleView(row)">查看</a>
                <a @click="handleDownload(row)">下载</a>
                <template v-if="!row.archived">
                  <a @click="handleEdit(row)">编辑</a>
                  <a class="danger" @click="handleDelete(row)">删除</a>
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

    <!-- 发票表单对话框 -->
    <el-dialog
      v-model="dialogs.form"
      :title="formType === 'add' ? '新增发票' : '编辑发票'"
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
            <el-form-item label="发票类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择发票类型" style="width: 100%">
                <el-option label="增值税专票" value="special" />
                <el-option label="增值税普票" value="normal" />
                <el-option label="电子发票" value="electronic" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票方向" prop="direction">
              <el-select v-model="form.direction" placeholder="请选择开票方向" style="width: 100%">
                <el-option label="开出" value="out" />
                <el-option label="收到" value="in" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="发票号码" prop="code">
          <el-input v-model="form.code" placeholder="请输入发票号码" />
        </el-form-item>

        <el-form-item label="发票抬头" prop="title">
          <el-input v-model="form.title" placeholder="请输入发票抬头" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="金额" prop="amount">
              <el-input-number 
                v-model="form.amount" 
                :precision="2" 
                :step="1000"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税率" prop="taxRate">
              <el-select v-model="form.taxRate" placeholder="请选择税率" style="width: 100%">
                <el-option label="13%" :value="13" />
                <el-option label="9%" :value="9" />
                <el-option label="6%" :value="6" />
                <el-option label="3%" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="开票日期" prop="createTime">
          <el-date-picker
            v-model="form.createTime"
            type="datetime"
            placeholder="选择开票日期"
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

        <el-form-item label="发票文件" prop="file">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :limit="1"
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

    <!-- 发票查看对话框 -->
    <el-dialog
      v-model="dialogs.view"
      title="发票详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="发票号码">{{ detail.code }}</el-descriptions-item>
        <el-descriptions-item label="发票类型">{{ getTypeText(detail.type) }}</el-descriptions-item>
        <el-descriptions-item label="开票方向">{{ getDirectionText(detail.direction) }}</el-descriptions-item>
        <el-descriptions-item label="发票抬头">{{ detail.title }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ detail.amount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="税率">{{ detail.taxRate }}%</el-descriptions-item>
        <el-descriptions-item label="开票日期">{{ detail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detail.remark }}</el-descriptions-item>
      </el-descriptions>
      <div class="preview-container" v-if="detail.fileUrl">
        <img :src="detail.fileUrl" alt="发票预览" style="max-width: 100%; margin-top: 20px;">
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
  direction: '',
  dateRange: []
});

// 发票列表
const invoiceList = ref([
  {
    id: 1,
    code: '044001900211',
    type: 'special',
    direction: 'in',
    title: '山东临工工程机械有限公司',
    amount: 586000.00,
    taxRate: 13,
    createTime: '2025-03-20 09:30:00',
    remark: '工业机器人采购',
    archived: false
  },
  {
    id: 2,
    code: '044001900212',
    type: 'electronic',
    direction: 'out',
    title: '青岛海尔生物医疗股份有限公司',
    amount: 468000.00,
    taxRate: 13,
    createTime: '2025-03-20 10:15:00',
    remark: '医疗机器人系统',
    archived: false
  },
  {
    id: 3,
    code: '044001900213',
    type: 'special',
    direction: 'in',
    title: '西门子（中国）有限公司',
    amount: 325000.00,
    taxRate: 13,
    createTime: '2025-03-19 14:20:00',
    remark: 'PLC控制系统采购',
    archived: false
  },
  {
    id: 4,
    code: '044001900214',
    type: 'normal',
    direction: 'out',
    title: '潍坊智能装备制造有限公司',
    amount: 156000.00,
    taxRate: 13,
    createTime: '2025-03-19 11:30:00',
    remark: '机器人配件销售',
    archived: false
  },
  {
    id: 5,
    code: '044001900215',
    type: 'electronic',
    direction: 'in',
    title: '发那科机器人（中国）有限公司',
    amount: 892000.00,
    taxRate: 13,
    createTime: '2025-03-18 16:45:00',
    remark: '工业机器人整机采购',
    archived: false
  },
  {
    id: 6,
    code: '044001900216',
    type: 'special',
    direction: 'out',
    title: '济南二机床集团有限公司',
    amount: 235000.00,
    taxRate: 13,
    createTime: '2025-03-18 09:20:00',
    remark: '机器人系统集成服务',
    archived: false
  },
  {
    id: 7,
    code: '044001900217',
    type: 'normal',
    direction: 'in',
    title: '安川电机（中国）有限公司',
    amount: 445000.00,
    taxRate: 13,
    createTime: '2025-03-17 15:30:00',
    remark: '伺服电机采购',
    archived: false
  },
  {
    id: 8,
    code: '044001900218',
    type: 'electronic',
    direction: 'out',
    title: '山东重工集团有限公司',
    amount: 678000.00,
    taxRate: 13,
    createTime: '2025-03-17 10:45:00',
    remark: '智能制造解决方案',
    archived: false
  },
  {
    id: 9,
    code: '044001900219',
    type: 'special',
    direction: 'in',
    title: '基恩士（中国）有限公司',
    amount: 168000.00,
    taxRate: 13,
    createTime: '2025-03-16 14:15:00',
    remark: '视觉系统采购',
    archived: false
  },
  {
    id: 10,
    code: '044001900220',
    type: 'normal',
    direction: 'out',
    title: '青岛软控机电工程有限公司',
    amount: 389000.00,
    taxRate: 13,
    createTime: '2025-03-16 11:20:00',
    remark: '机器人应用方案',
    archived: false
  },
  {
    id: 11,
    code: '044001900221',
    type: 'electronic',
    direction: 'in',
    title: 'ABB（中国）有限公司',
    amount: 756000.00,
    taxRate: 13,
    createTime: '2025-03-15 16:30:00',
    remark: '机器人控制系统',
    archived: false
  },
  {
    id: 12,
    code: '044001900222',
    type: 'special',
    direction: 'out',
    title: '山东科技职业学院',
    amount: 245000.00,
    taxRate: 6,
    createTime: '2025-03-15 09:45:00',
    remark: '教学实训设备',
    archived: false
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
  direction: '',
  code: '',
  title: '',
  amount: 0,
  taxRate: 13,
  createTime: '',
  remark: '',
  file: null
});

// 表单规则
const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择发票类型', trigger: 'change' }],
  direction: [{ required: true, message: '请选择开票方向', trigger: 'change' }],
  code: [{ required: true, message: '请输入发票号码', trigger: 'blur' }],
  title: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  taxRate: [{ required: true, message: '请选择税率', trigger: 'change' }],
  createTime: [{ required: true, message: '请选择开票日期', trigger: 'change' }]
});

const formRef = ref<FormInstance>();

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    special: '增值税专票',
    normal: '增值税普票',
    electronic: '电子发票'
  };
  return map[type] || '未知';
};

// 获取方向文本
const getDirectionText = (direction: string) => {
  const map: Record<string, string> = {
    in: '收到',
    out: '开出'
  };
  return map[direction] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadData();
};

// 加载数据
const loadData = () => {
  // TODO: 调用API获取数据
  console.log('加载发票列表:', query.value);
};

// 新增
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    type: '',
    direction: '',
    code: '',
    title: '',
    amount: 0,
    taxRate: 13,
    createTime: '',
    remark: '',
    file: null
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

// 下载
const handleDownload = (row: any) => {
  // TODO: 实现下载逻辑
  ElMessage.success('开始下载');
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该发票记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除发票:', row);
    ElMessage.success('删除成功');
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
        invoiceList.value.unshift({
          id: invoiceList.value.length + 1,
          ...form,
          archived: false
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
.invoice-container {
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

    .amount-up {
      color: #67C23A;
    }

    .amount-down {
      color: #F56C6C;
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
}
</style> 