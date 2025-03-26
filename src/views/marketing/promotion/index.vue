<template>
  <div class="promotion-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入活动名称/优惠券名称"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.type" placeholder="活动类型" clearable style="width: 120px">
              <el-option label="优惠券" value="coupon" />
              <el-option label="满减活动" value="discount" />
              <el-option label="限时特价" value="flash_sale" />
              <el-option label="组合优惠" value="combo" />
            </el-select>
            <el-select v-model="query.status" placeholder="活动状态" clearable style="width: 120px">
              <el-option label="未开始" value="pending" />
              <el-option label="进行中" value="active" />
              <el-option label="已结束" value="ended" />
            </el-select>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增活动</el-button>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>进行中活动</h3>
              <div class="number primary">{{ stats.active }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>未开始活动</h3>
              <div class="number warning">{{ stats.pending }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>已结束活动</h3>
              <div class="number info">{{ stats.ended }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>总参与人数</h3>
              <div class="number success">{{ stats.totalParticipants }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="promotionList" border style="width: 100%" height="100%" v-loading="loading">
          <el-table-column prop="name" label="活动名称" min-width="150" />
          <el-table-column prop="type" label="活动类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeTag(row.type)">{{ getTypeText(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180" />
          <el-table-column prop="endTime" label="结束时间" width="180" />
          <el-table-column prop="participants" label="参与人数" width="100" />
          <el-table-column prop="conversion" label="转化率" width="100">
            <template #default="{ row }">
              {{ row.conversion }}%
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <a @click="handleEdit(row)">编辑</a>
                <a @click="handleView(row)">查看</a>
                <a class="danger" @click="handleDelete(row)">删除</a>
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
      :title="formType === 'add' ? '新增活动' : '编辑活动'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择活动类型" style="width: 100%">
            <el-option label="优惠券" value="coupon" />
            <el-option label="满减活动" value="discount" />
            <el-option label="限时特价" value="flash_sale" />
            <el-option label="组合优惠" value="combo" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="活动规则" prop="rules">
          <el-input
            v-model="form.rules"
            type="textarea"
            :rows="4"
            placeholder="请输入活动规则"
          />
        </el-form-item>
        <el-form-item label="活动预算" prop="budget">
          <el-input-number v-model="form.budget" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="目标人群" prop="target">
          <el-select v-model="form.target" placeholder="请选择目标人群" style="width: 100%" multiple>
            <el-option label="新客户" value="new" />
            <el-option label="老客户" value="regular" />
            <el-option label="VIP客户" value="vip" />
            <el-option label="所有客户" value="all" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动说明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入活动说明"
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
      title="活动详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="活动名称">{{ currentRow?.name }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">
          <el-tag :type="getTypeTag(currentRow?.type)">{{ getTypeText(currentRow?.type) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动状态">
          <el-tag :type="getStatusType(currentRow?.status)">{{ getStatusText(currentRow?.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentRow?.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentRow?.endTime }}</el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ currentRow?.participants }}</el-descriptions-item>
        <el-descriptions-item label="转化率">{{ currentRow?.conversion }}%</el-descriptions-item>
        <el-descriptions-item label="活动规则">{{ currentRow?.rules }}</el-descriptions-item>
        <el-descriptions-item label="活动预算">{{ currentRow?.budget }}</el-descriptions-item>
        <el-descriptions-item label="目标人群">
          <el-tag
            v-for="target in currentRow?.target"
            :key="target"
            class="mx-1"
            style="margin-right: 4px"
          >
            {{ getTargetText(target) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动说明">{{ currentRow?.description }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogs.view = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Search, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  type: '',
  status: ''
});

// 活动列表
const promotionList = ref([
  {
    id: 1,
    name: '新客户专享优惠券',
    type: 'coupon',
    status: 'active',
    startTime: '2025-03-01 00:00:00',
    endTime: '2025-03-31 23:59:59',
    participants: 856,
    conversion: 35,
    rules: '新客户注册即可领取100元优惠券',
    budget: 10000,
    target: ['new'],
    description: '针对新注册客户推出的专属优惠活动'
  },
  {
    id: 2,
    name: '春季满减特惠',
    type: 'discount',
    status: 'active',
    startTime: '2025-03-15 00:00:00',
    endTime: '2025-04-15 23:59:59',
    participants: 1250,
    conversion: 42,
    rules: '满1000减100，满2000减300',
    budget: 50000,
    target: ['all'],
    description: '春季促销活动，多买多优惠'
  },
  {
    id: 3,
    name: '限时秒杀活动',
    type: 'flash_sale',
    status: 'pending',
    startTime: '2025-04-01 10:00:00',
    endTime: '2025-04-01 22:00:00',
    participants: 0,
    conversion: 0,
    rules: '指定商品限时5折起',
    budget: 30000,
    target: ['all'],
    description: '限时特价活动，先到先得'
  },
  {
    id: 4,
    name: 'VIP会员专享礼包',
    type: 'combo',
    status: 'active',
    startTime: '2025-03-10 00:00:00',
    endTime: '2025-04-10 23:59:59',
    participants: 328,
    conversion: 58,
    rules: 'VIP会员购买指定商品享受8折优惠，并赠送精美礼品',
    budget: 25000,
    target: ['vip'],
    description: '回馈VIP会员的专属优惠活动'
  },
  {
    id: 5,
    name: '老客户感恩回馈',
    type: 'coupon',
    status: 'active',
    startTime: '2025-03-20 00:00:00',
    endTime: '2025-04-20 23:59:59',
    participants: 642,
    conversion: 45,
    rules: '老客户可领取200元无门槛优惠券',
    budget: 40000,
    target: ['regular'],
    description: '感谢老客户长期支持的回馈活动'
  },
  {
    id: 6,
    name: '机器人新品首发',
    type: 'flash_sale',
    status: 'pending',
    startTime: '2025-04-15 09:00:00',
    endTime: '2025-04-15 21:00:00',
    participants: 0,
    conversion: 0,
    rules: '新品首发限时8折，前100名购买送配件',
    budget: 45000,
    target: ['all'],
    description: '新品首发特惠活动'
  },
  {
    id: 7,
    name: '企业采购特惠',
    type: 'discount',
    status: 'active',
    startTime: '2025-03-05 00:00:00',
    endTime: '2025-04-05 23:59:59',
    participants: 156,
    conversion: 65,
    rules: '企业采购满50000减5000，满100000减12000',
    budget: 80000,
    target: ['all'],
    description: '针对企业客户的批量采购优惠'
  },
  {
    id: 8,
    name: '春季新品组合优惠',
    type: 'combo',
    status: 'active',
    startTime: '2025-03-25 00:00:00',
    endTime: '2025-04-25 23:59:59',
    participants: 428,
    conversion: 48,
    rules: '购买指定机器人+配件组合享受7折优惠',
    budget: 35000,
    target: ['all'],
    description: '新品组合促销活动'
  },
  {
    id: 9,
    name: '新客户首单特惠',
    type: 'coupon',
    status: 'ended',
    startTime: '2025-02-01 00:00:00',
    endTime: '2025-02-28 23:59:59',
    participants: 1250,
    conversion: 38,
    rules: '新客户首单享受9折优惠，并赠送100元优惠券',
    budget: 28000,
    target: ['new'],
    description: '新客户首单优惠活动'
  },
  {
    id: 10,
    name: '机器人升级服务',
    type: 'discount',
    status: 'active',
    startTime: '2025-03-30 00:00:00',
    endTime: '2025-04-30 23:59:59',
    participants: 286,
    conversion: 52,
    rules: '老款机器人升级服务享受8折优惠',
    budget: 22000,
    target: ['regular'],
    description: '机器人升级服务优惠活动'
  }
]);

// 更新统计数据
const stats = {
  active: 7,
  pending: 2,
  ended: 1,
  totalParticipants: 4210
};

// 更新总数
const total = ref(10);

// 加载状态
const loading = ref(false);

// 对话框状态
const dialogs = reactive({
  form: false,
  view: false
});

// 表单类型
const formType = ref<'add' | 'edit'>('add');

// 当前行数据
const currentRow = ref<any>(null);

// 表单数据
const form = reactive({
  name: '',
  type: '',
  time: [],
  rules: '',
  budget: 0,
  target: [],
  description: ''
});

// 表单规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  rules: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
  budget: [{ required: true, message: '请输入活动预算', trigger: 'blur' }],
  target: [{ required: true, message: '请选择目标人群', trigger: 'change' }]
});

// 动态表单规则
const getDynamicRules = () => {
  const baseRules = {
    name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
    time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
    target: [{ required: true, message: '请选择目标人群', trigger: 'change' }]
  };

  switch (form.type) {
    case 'coupon':
      return {
        ...baseRules,
        rules: [{ required: true, message: '请输入优惠券规则', trigger: 'blur' }],
        budget: [{ required: true, message: '请输入优惠券预算', trigger: 'blur' }]
      };
    case 'discount':
      return {
        ...baseRules,
        rules: [{ required: true, message: '请输入满减规则', trigger: 'blur' }],
        budget: [{ required: true, message: '请输入满减预算', trigger: 'blur' }]
      };
    case 'flash_sale':
      return {
        ...baseRules,
        rules: [{ required: true, message: '请输入特价规则', trigger: 'blur' }],
        budget: [{ required: true, message: '请输入特价预算', trigger: 'blur' }]
      };
    case 'combo':
      return {
        ...baseRules,
        rules: [{ required: true, message: '请输入组合优惠规则', trigger: 'blur' }],
        budget: [{ required: true, message: '请输入组合优惠预算', trigger: 'blur' }]
      };
    default:
      return baseRules;
  }
};

// 监听活动类型变化
watch(() => form.type, () => {
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  Object.assign(rules, getDynamicRules());
});

const formRef = ref<FormInstance>();

// 获取类型标签
const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    coupon: 'success',
    discount: 'warning',
    flash_sale: 'danger',
    combo: 'primary'
  };
  return map[type] || 'info';
};

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    coupon: '优惠券',
    discount: '满减活动',
    flash_sale: '限时特价',
    combo: '组合优惠'
  };
  return map[type] || '未知';
};

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    active: 'success',
    ended: ''
  };
  return map[status] || '';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '未开始',
    active: '进行中',
    ended: '已结束'
  };
  return map[status] || '未知';
};

// 获取目标人群文本
const getTargetText = (target: string) => {
  const map: Record<string, string> = {
    new: '新客户',
    regular: '老客户',
    vip: 'VIP客户',
    all: '所有客户'
  };
  return map[target] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadPromotionList();
};

// 加载活动列表
const loadPromotionList = () => {
  loading.value = true;
  // 这里应该调用API获取数据
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// 新增活动
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    name: '',
    type: '',
    time: [],
    rules: '',
    budget: 0,
    target: [],
    description: ''
  });
  Object.assign(rules, getDynamicRules());
  dialogs.form = true;
};

// 编辑活动
const handleEdit = (row: any) => {
  formType.value = 'edit';
  Object.assign(form, {
    name: row.name,
    type: row.type,
    time: [row.startTime, row.endTime],
    rules: row.rules,
    budget: row.budget,
    target: row.target,
    description: row.description
  });
  Object.assign(rules, getDynamicRules());
  currentRow.value = row;
  dialogs.form = true;
};

// 查看活动
const handleView = (row: any) => {
  currentRow.value = row;
  dialogs.view = true;
};

// 删除活动
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该活动吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除活动:', row);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadPromotionList();
};

// 页码改变
const handleCurrentChange = () => {
  loadPromotionList();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API保存数据
      const [startTime, endTime] = form.time;
      const now = new Date();
      const status = now < new Date(startTime) ? 'pending' : 
                    now > new Date(endTime) ? 'ended' : 'active';

      if (formType.value === 'add') {
        promotionList.value.unshift({
          id: promotionList.value.length + 1,
          name: form.name,
          type: form.type,
          status,
          startTime,
          endTime,
          participants: 0,
          conversion: 0,
          rules: form.rules,
          budget: form.budget,
          target: form.target,
          description: form.description
        });
        ElMessage.success('添加成功');
      } else {
        if (currentRow.value) {
          Object.assign(currentRow.value, {
            name: form.name,
            type: form.type,
            status,
            startTime,
            endTime,
            rules: form.rules,
            budget: form.budget,
            target: form.target,
            description: form.description
          });
          ElMessage.success('修改成功');
        }
      }
      dialogs.form = false;
    }
  });
};
</script>

<style scoped lang="scss">
.promotion-container {
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
      
      &.danger {
        color: var(--el-color-danger);
        
        &:hover {
          color: var(--el-color-danger-light-3);
        }
      }
    }
  }
}
</style> 