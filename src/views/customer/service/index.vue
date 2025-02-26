<template>
  <div class="service-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入工单号/客户名称"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.status" placeholder="工单状态" clearable style="width: 120px">
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已关闭" value="closed" />
            </el-select>
            <el-select v-model="query.type" placeholder="服务类型" clearable style="width: 120px">
              <el-option label="咨询" value="consult" />
              <el-option label="投诉" value="complaint" />
              <el-option label="建议" value="suggestion" />
              <el-option label="其他" value="other" />
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增工单</el-button>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>待处理</h3>
              <div class="number warning">12</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>处理中</h3>
              <div class="number primary">24</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>已完成</h3>
              <div class="number success">89</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>已关闭</h3>
              <div class="number info">45</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="serviceList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="工单号" width="180" />
          <el-table-column prop="customer" label="客户名称" />
          <el-table-column prop="type" label="服务类型" width="100">
            <template #default="{ row }">
              {{ getTypeText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button 
                v-if="row.status !== 'completed' && row.status !== 'closed'"
                link 
                type="primary" 
                @click="handleProcess(row)"
              >
                处理
              </el-button>
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
              <el-button 
                v-if="row.status === 'pending'"
                link 
                type="danger" 
                @click="handleClose(row)"
              >
                关闭
              </el-button>
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
      :title="formType === 'add' ? '新增工单' : '处理工单'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="客户名称" prop="customer">
          <el-select 
            v-model="form.customer" 
            placeholder="请选择客户" 
            style="width: 100%"
            :disabled="formType === 'process'"
          >
            <el-option 
              v-for="item in customerOptions" 
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务类型" prop="type">
          <el-select 
            v-model="form.type" 
            placeholder="请选择服务类型" 
            style="width: 100%"
            :disabled="formType === 'process'"
          >
            <el-option label="咨询" value="consult" />
            <el-option label="投诉" value="complaint" />
            <el-option label="建议" value="suggestion" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单标题" prop="title">
          <el-input 
            v-model="form.title" 
            placeholder="请输入工单标题"
            :disabled="formType === 'process'"
          />
        </el-form-item>
        <el-form-item label="处理记录" prop="processNote">
          <el-input
            v-model="form.processNote"
            type="textarea"
            :rows="4"
            placeholder="请输入处理记录"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.form = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogs.view"
      title="工单详情"
      width="600px"
    >
      <el-descriptions v-if="currentRow" :column="2" border>
        <el-descriptions-item label="工单号">{{ currentRow.code }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentRow.customer }}</el-descriptions-item>
        <el-descriptions-item label="服务类型">{{ getTypeText(currentRow.type) }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ getStatusText(currentRow.status) }}</el-descriptions-item>
        <el-descriptions-item label="工单标题" :span="2">{{ currentRow.title }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentRow.createTime }}</el-descriptions-item>
        <el-descriptions-item label="处理记录" :span="2">
          <div v-if="currentRow.processNotes">
            <div v-for="(note, index) in currentRow.processNotes" :key="index" class="process-note">
              <div class="time">{{ note.time }}</div>
              <div class="content">{{ note.content }}</div>
            </div>
          </div>
          <div v-else>暂无处理记录</div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogs.view = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

interface ServiceTicket {
  code: string;
  customer: string;
  type: string;
  status: string;
  title: string;
  createTime: string;
  processNotes?: {
    time: string;
    content: string;
  }[];
}

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
  type: ''
});

// 服务列表
const serviceList = ref([
  {
    id: 1,
    code: 'GD202403200001',
    customer: '山东临工工程机械有限公司',
    type: 'complaint',
    status: 'pending',
    title: '机械臂响应延迟问题',
    createTime: '2025-02-20 09:30:00'
  },
  {
    id: 2,
    code: 'GD202403200002',
    customer: '青岛海尔生物医疗股份有限公司',
    type: 'consult',
    status: 'processing',
    title: '新产品技术咨询',
    createTime: '2025-02-20 10:15:00'
  },
  {
    id: 3,
    code: 'GD202403200003',
    customer: '山东新华医疗器械股份有限公司',
    type: 'suggestion',
    status: 'completed',
    title: '产品功能优化建议',
    createTime: '2025-02-20 11:20:00'
  },
  {
    id: 4,
    code: 'GD202403200004',
    customer: '浪潮电子信息产业股份有限公司',
    type: 'complaint',
    status: 'processing',
    title: '系统稳定性问题',
    createTime: '2025-02-20 13:45:00'
  },
  {
    id: 5,
    code: 'GD202403200005',
    customer: '中通客车控股股份有限公司',
    type: 'consult',
    status: 'pending',
    title: '产品升级咨询',
    createTime: '2025-02-20 14:30:00'
  },
  {
    id: 6,
    code: 'GD202403200006',
    customer: '山东魏桥创业集团有限公司',
    type: 'complaint',
    status: 'completed',
    title: '设备运行噪音问题',
    createTime: '2025-02-20 15:10:00',
    processNotes: [
      {
        time: '2025-02-20 15:10:00',
        content: '客户反馈设备运行时噪音较大'
      },
      {
        time: '2025-02-20 16:20:00',
        content: '技术人员现场检查，更换了减震部件'
      },
      {
        time: '2025-02-20 17:30:00',
        content: '问题已解决，客户确认验收'
      }
    ]
  },
  {
    id: 7,
    code: 'GD202403200007',
    customer: '山东晨鸣纸业集团股份有限公司',
    type: 'suggestion',
    status: 'processing',
    title: '自动化流程优化建议',
    createTime: '2025-02-20 15:45:00',
    processNotes: [
      {
        time: '2025-02-20 15:45:00',
        content: '客户建议优化生产线自动化流程'
      },
      {
        time: '2025-02-20 16:30:00',
        content: '技术团队评估可行性，制定优化方案'
      }
    ]
  },
  {
    id: 8,
    code: 'GD202403200008',
    customer: '山东东宏管业股份有限公司',
    type: 'consult',
    status: 'closed',
    title: '产品升级方案咨询',
    createTime: '2025-02-20 16:00:00',
    processNotes: [
      {
        time: '2025-02-20 16:00:00',
        content: '客户咨询现有设备升级方案'
      },
      {
        time: '2025-02-20 16:45:00',
        content: '因客户预算调整，暂时关闭工单'
      }
    ]
  },
  {
    id: 9,
    code: 'GD202403200009',
    customer: '山东临工工程机械有限公司',
    type: 'complaint',
    status: 'processing',
    title: '控制系统偶发性故障',
    createTime: '2025-02-20 16:15:00',
    processNotes: [
      {
        time: '2025-02-20 16:15:00',
        content: '客户反馈控制系统偶发性无响应'
      },
      {
        time: '2025-02-20 17:00:00',
        content: '远程诊断中，疑似软件版本问题'
      }
    ]
  },
  {
    id: 10,
    code: 'GD202403200010',
    customer: '青岛海尔生物医疗股份有限公司',
    type: 'suggestion',
    status: 'pending',
    title: '人机交互界面优化建议',
    createTime: '2025-02-20 16:30:00'
  },
  {
    id: 11,
    code: 'GD202403200011',
    customer: '浪潮电子信息产业股份有限公司',
    type: 'consult',
    status: 'completed',
    title: '系统集成方案咨询',
    createTime: '2025-02-20 16:45:00',
    processNotes: [
      {
        time: '2025-02-20 16:45:00',
        content: '客户咨询系统集成解决方案'
      },
      {
        time: '2025-02-20 17:15:00',
        content: '提供详细的技术方案和报价'
      },
      {
        time: '2025-02-20 17:45:00',
        content: '客户确认方案可行，工单结束'
      }
    ]
  },
  {
    id: 12,
    code: 'GD202403200012',
    customer: '中通客车控股股份有限公司',
    type: 'complaint',
    status: 'pending',
    title: '设备通信异常报警',
    createTime: '2025-02-20 17:00:00'
  }
]);

// 总数
const total = ref(100);

// 统计数据
const stats = {
  pending: 18,
  processing: 32,
  completed: 168,
  closed: 45
};

// 客户选项
const customerOptions = [
  { name: '山东临工工程机械有限公司' },
  { name: '青岛海尔生物医疗股份有限公司' },
  { name: '山东新华医疗器械股份有限公司' },
  { name: '浪潮电子信息产业股份有限公司' },
  { name: '中通客车控股股份有限公司' }
];

// 对话框状态
const dialogs = reactive({
  form: false,
  view: false
});

// 表单类型
const formType = ref<'add' | 'process'>('add');

// 当前行数据
const currentRow = ref<ServiceTicket | null>(null);

// 表单数据
const form = reactive({
  customer: '',
  type: '',
  title: '',
  processNote: ''
});

// 表单规则
const rules = reactive<FormRules>({
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  type: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
  processNote: [{ required: true, message: '请输入处理记录', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    consult: '咨询',
    complaint: '投诉',
    suggestion: '建议',
    other: '其他'
  };
  return map[type] || '未知';
};

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    closed: 'info'
  };
  return map[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    closed: '已关闭'
  };
  return map[status] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadServiceList();
};

// 加载服务列表
const loadServiceList = () => {
  // 这里应该调用API获取数据
  console.log('加载服务列表:', query.value);
};

// 新增工单
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    customer: '',
    type: '',
    title: '',
    processNote: ''
  });
  dialogs.form = true;
};

// 处理工单
const handleProcess = (row: any) => {
  formType.value = 'process';
  Object.assign(form, {
    customer: row.customer,
    type: row.type,
    title: row.title,
    processNote: ''
  });
  currentRow.value = row;
  dialogs.form = true;
};

// 查看工单
const handleView = (row: any) => {
  currentRow.value = row;
  dialogs.view = true;
};

// 关闭工单
const handleClose = (row: any) => {
  ElMessageBox.confirm(
    '确定要关闭该工单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('关闭工单:', row);
    ElMessage.success('关闭成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadServiceList();
};

// 页码改变
const handleCurrentChange = () => {
  loadServiceList();
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
        const code = `GD${createTime.replace(/[-: ]/g, '').slice(0, 12)}${String(serviceList.value.length + 1).padStart(4, '0')}`;
        serviceList.value.unshift({
          id: serviceList.value.length + 1,
          code,
          customer: form.customer,
          type: form.type,
          status: 'pending',
          title: form.title,
          createTime,
          processNotes: [{
            time: createTime,
            content: form.processNote
          }]
        });
        ElMessage.success('工单创建成功');
      } else {
        if (currentRow.value) {
          currentRow.value.status = 'processing';
          if (!currentRow.value.processNotes) {
            currentRow.value.processNotes = [];
          }
          currentRow.value.processNotes.push({
            time: createTime,
            content: form.processNote
          });
        }
        ElMessage.success('处理成功');
      }
      dialogs.form = false;
    }
  });
};
</script>

<style scoped lang="scss">
.service-container {
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

        &.warning {
          color: #E6A23C;
        }

        &.primary {
          color: #409EFF;
        }

        &.success {
          color: #67C23A;
        }

        &.info {
          color: #909399;
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

  .process-note {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #eee;
    
    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .time {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
    }

    .content {
      color: #666;
    }
  }
}
</style> 