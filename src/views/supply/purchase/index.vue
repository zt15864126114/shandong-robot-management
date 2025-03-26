<template>
  <div class="purchase-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入采购单号/商品名称"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.status" placeholder="采购状态" clearable style="width: 120px">
              <el-option label="待审核" value="pending" />
              <el-option label="已审核" value="approved" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
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
          <div class="right">
            <el-button type="primary" @click="handleAdd">新增采购</el-button>
          </div>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="purchaseList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="采购单号" min-width="180" />
          <el-table-column prop="supplier" label="供应商" min-width="200" />
          <el-table-column prop="amount" label="采购金额" min-width="120">
            <template #default="{ row }">
              ¥{{ row.amount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人" min-width="120" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <template v-if="row.status === 'pending'">
                  <a @click="handleEdit(row)">编辑</a>
                  <a @click="handleApprove(row)">审核</a>
                  <a class="danger" @click="handleCancel(row)">取消</a>
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else-if="row.status === 'approved'">
                  <a class="success" @click="handleComplete(row)">完成</a>
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

    <!-- 采购表单对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.type === 'add' ? '新增采购' : dialog.type === 'edit' ? '编辑采购' : '采购详情'"
      width="1000px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="dialog.type === 'view'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购单号" prop="code">
              <el-input v-model="form.code" placeholder="请输入采购单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-select v-model="form.supplier" placeholder="请选择供应商" style="width: 100%">
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="采购商品">
          <el-table :data="form.products" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="name" label="商品名称" min-width="200">
              <template #default="{ row, $index }">
                <el-select 
                  v-model="row.name" 
                  placeholder="请选择商品"
                  style="width: 100%"
                  :disabled="dialog.type === 'view'"
                >
                  <el-option
                    v-for="item in productOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="spec" label="规格型号" min-width="150">
              <template #default="{ row }">
                <el-input v-model="row.spec" placeholder="请输入规格型号" />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.quantity" :min="1" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :precision="2" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                {{ (row.quantity * row.price).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column v-if="dialog.type !== 'view'" label="操作" width="80">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleRemoveProduct($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="dialog.type !== 'view'" style="margin-top: 10px">
            <el-button type="primary" @click="handleAddProduct">添加商品</el-button>
          </div>
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
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button 
          v-if="dialog.type !== 'view'" 
          type="primary" 
          @click="handleSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="approveDialog.visible"
      title="采购审核"
      width="500px"
    >
      <el-form
        ref="approveFormRef"
        :model="approveForm"
        :rules="approveRules"
        label-width="100px"
      >
        <el-form-item label="审核意见" prop="remark">
          <el-input
            v-model="approveForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleApproveSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 查询条件
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
  dateRange: [] as string[]
});

// 采购列表
const purchaseList = ref([
  {
    id: 1,
    code: 'CG20250301001',
    supplier: '发那科（中国）有限公司',
    amount: 320000.00,
    status: 'completed',
    operator: '刘明阳',
    createTime: '2025-03-01 09:30:00',
    products: [
      { name: '发那科机器人 CR-7iA', spec: 'CR-7iA', quantity: 2, price: 160000.00 }
    ],
    remark: '机器人本体采购'
  },
  {
    id: 2,
    code: 'CG20250301002',
    supplier: '西门子（中国）有限公司',
    amount: 85000.00,
    status: 'approved',
    operator: '王建国',
    createTime: '2025-03-01 14:00:00',
    products: [
      { name: '西门子S7-1500 PLC', spec: 'S7-1500', quantity: 5, price: 17000.00 }
    ],
    remark: '自动化控制系统采购'
  },
  {
    id: 3,
    code: 'CG20250302001',
    supplier: '安川（中国）机器人有限公司',
    amount: 450000.00,
    status: 'pending',
    operator: '张志强',
    createTime: '2025-03-02 10:15:00',
    products: [
      { name: '安川机器人 GP8', spec: 'GP8', quantity: 5, price: 90000.00 }
    ],
    remark: '机器人本体采购'
  },
  {
    id: 4,
    code: 'CG20250302002',
    supplier: '欧姆龙自动化（中国）有限公司',
    amount: 25000.00,
    status: 'completed',
    operator: '陈海波',
    createTime: '2025-03-02 13:45:00',
    products: [
      { name: '欧姆龙光电传感器', spec: 'E3Z-T61', quantity: 100, price: 250.00 }
    ],
    remark: '传感器采购'
  },
  {
    id: 5,
    code: 'CG20250302003',
    supplier: '倍加福工业自动化（中国）有限公司',
    amount: 18000.00,
    status: 'cancelled',
    operator: '李伟东',
    createTime: '2025-03-02 16:30:00',
    products: [
      { name: '倍加福接近开关', spec: 'NBB4-12GM50-E0', quantity: 30, price: 600.00 }
    ],
    remark: '接近开关采购-已取消'
  },
  {
    id: 6,
    code: 'CG20250303001',
    supplier: '三菱电机自动化（中国）有限公司',
    amount: 95000.00,
    status: 'pending',
    operator: '刘明阳',
    createTime: '2025-03-03 09:15:00',
    products: [
      { name: '三菱伺服电机', spec: 'HG-KR43', quantity: 5, price: 19000.00 }
    ],
    remark: '伺服系统采购'
  },
  {
    id: 7,
    code: 'CG20250303002',
    supplier: '基恩士（中国）有限公司',
    amount: 280000.00,
    status: 'approved',
    operator: '王建国',
    createTime: '2025-03-03 11:30:00',
    products: [
      { name: '基恩士视觉系统', spec: 'CV-X150F', quantity: 2, price: 140000.00 }
    ],
    remark: '视觉检测系统采购'
  },
  {
    id: 8,
    code: 'CG20250303003',
    supplier: '图尔克（天津）传感器有限公司',
    amount: 42000.00,
    status: 'completed',
    operator: '张志强',
    createTime: '2025-03-03 14:45:00',
    products: [
      { name: '图尔克接近开关', spec: 'BI5-M18-AP6X', quantity: 60, price: 700.00 }
    ],
    remark: '接近开关批量采购'
  },
  {
    id: 9,
    code: 'CG20250304001',
    supplier: '魏德米勒电联接（上海）有限公司',
    amount: 15000.00,
    status: 'pending',
    operator: '陈海波',
    createTime: '2025-03-04 10:00:00',
    products: [
      { name: '魏德米勒端子', spec: 'WDU 2.5', quantity: 1000, price: 15.00 }
    ],
    remark: '接线端子采购'
  },
  {
    id: 10,
    code: 'CG20250304002',
    supplier: '库卡机器人（上海）有限公司',
    amount: 580000.00,
    status: 'approved',
    operator: '李伟东',
    createTime: '2025-03-04 13:20:00',
    products: [
      { name: '库卡机器人', spec: 'KR10 R1100', quantity: 2, price: 290000.00 }
    ],
    remark: '机器人本体采购'
  },
  {
    id: 11,
    code: 'CG20250304003',
    supplier: '欧姆龙自动化（中国）有限公司',
    amount: 68000.00,
    status: 'completed',
    operator: '刘明阳',
    createTime: '2025-03-04 15:40:00',
    products: [
      { name: '欧姆龙PLC', spec: 'NX1P2', quantity: 4, price: 17000.00 }
    ],
    remark: '控制系统采购'
  },
  {
    id: 12,
    code: 'CG20250305001',
    supplier: '邦纳工程国际有限公司',
    amount: 32000.00,
    status: 'pending',
    operator: '王建国',
    createTime: '2025-03-05 09:30:00',
    products: [
      { name: '邦纳光电传感器', spec: 'QS18VP6', quantity: 40, price: 800.00 }
    ],
    remark: '光电传感器采购'
  },
  {
    id: 13,
    code: 'CG20250305002',
    supplier: '力士乐（中国）有限公司',
    amount: 45000.00,
    status: 'approved',
    operator: '张志强',
    createTime: '2025-03-05 11:15:00',
    products: [
      { name: '力士乐气缸', spec: 'R480', quantity: 15, price: 3000.00 }
    ],
    remark: '气动元件采购'
  },
  {
    id: 14,
    code: 'CG20250305003',
    supplier: '施耐德电气（中国）有限公司',
    amount: 96000.00,
    status: 'pending',
    operator: '陈海波',
    createTime: '2025-03-05 14:00:00',
    products: [
      { name: '施耐德变频器', spec: 'ATV320', quantity: 8, price: 12000.00 }
    ],
    remark: '变频器采购'
  },
  {
    id: 15,
    code: 'CG20250305004',
    supplier: '雷尼绍（上海）贸易有限公司',
    amount: 180000.00,
    status: 'completed',
    operator: '李伟东',
    createTime: '2025-03-05 16:30:00',
    products: [
      { name: '雷尼绍测量系统', spec: 'RMP60', quantity: 2, price: 90000.00 }
    ],
    remark: '测量系统采购'
  }
]);

const total = ref(100);

// 对话框状态
const dialog = reactive({
  visible: false,
  type: 'add' as 'add' | 'edit' | 'view'
});

// 审核对话框
const approveDialog = reactive({
  visible: false,
  data: {} as any
});

// 表单数据
const form = reactive({
  code: '',
  supplier: '',
  products: [] as any[],
  remark: ''
});

// 审核表单
const approveForm = reactive({
  id: '',
  remark: ''
});

// 供应商选项
const supplierOptions = [
  { value: '发那科（中国）有限公司', label: '发那科（中国）有限公司' },
  { value: '西门子（中国）有限公司', label: '西门子（中国）有限公司' },
  { value: '安川（中国）机器人有限公司', label: '安川（中国）机器人有限公司' },
  { value: '欧姆龙自动化（中国）有限公司', label: '欧姆龙自动化（中国）有限公司' },
  { value: '倍加福工业自动化（中国）有限公司', label: '倍加福工业自动化（中国）有限公司' },
  { value: '三菱电机自动化（中国）有限公司', label: '三菱电机自动化（中国）有限公司' },
  { value: '基恩士（中国）有限公司', label: '基恩士（中国）有限公司' },
  { value: '图尔克（天津）传感器有限公司', label: '图尔克（天津）传感器有限公司' },
  { value: '魏德米勒电联接（上海）有限公司', label: '魏德米勒电联接（上海）有限公司' },
  { value: '库卡机器人（上海）有限公司', label: '库卡机器人（上海）有限公司' }
];

// 商品选项
const productOptions = [
  { value: '发那科机器人 CR-7iA', label: '发那科机器人 CR-7iA' },
  { value: '西门子S7-1500 PLC', label: '西门子S7-1500 PLC' },
  { value: '安川机器人 GP8', label: '安川机器人 GP8' },
  { value: '欧姆龙光电传感器', label: '欧姆龙光电传感器' },
  { value: '倍加福接近开关', label: '倍加福接近开关' },
  { value: '三菱伺服电机', label: '三菱伺服电机' },
  { value: '基恩士视觉系统', label: '基恩士视觉系统' },
  { value: '图尔克接近开关', label: '图尔克接近开关' },
  { value: '魏德米勒端子', label: '魏德米勒端子' },
  { value: '库卡机器人', label: '库卡机器人' }
];

// 表单规则
const rules = reactive<FormRules>({
  code: [{ required: true, message: '请输入采购单号', trigger: 'blur' }],
  supplier: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  products: [{ required: true, message: '请添加采购商品', trigger: 'change' }]
});

// 审核表单规则
const approveRules = reactive<FormRules>({
  remark: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();
const approveFormRef = ref<FormInstance>();

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    completed: 'primary',
    cancelled: 'info'
  };
  return map[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status] || status;
};

// 计算采购总金额
const calculateAmount = computed(() => {
  return form.products.reduce((total, item) => total + (item.quantity * item.price), 0);
});

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadData();
};

// 加载数据
const loadData = () => {
  // TODO: 调用API获取数据
  console.log('加载采购列表:', query.value);
};

// 新增采购
const handleAdd = () => {
  dialog.type = 'add';
  Object.assign(form, {
    code: '',
    supplier: '',
    products: [],
    remark: ''
  });
  dialog.visible = true;
};

// 编辑采购
const handleEdit = (row: any) => {
  dialog.type = 'edit';
  Object.assign(form, row);
  dialog.visible = true;
};

// 查看采购
const handleView = (row: any) => {
  dialog.type = 'view';
  Object.assign(form, row);
  dialog.visible = true;
};

// 审核采购
const handleApprove = (row: any) => {
  approveDialog.data = row;
  approveForm.id = row.id;
  approveForm.remark = '';
  approveDialog.visible = true;
};

// 完成采购
const handleComplete = (row: any) => {
  ElMessageBox.confirm('确认完成该采购单？', '提示', {
    type: 'warning'
  }).then(() => {
    const index = purchaseList.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      purchaseList.value[index].status = 'completed';
      ElMessage.success('操作成功');
    }
  });
};

// 取消采购
const handleCancel = (row: any) => {
  ElMessageBox.confirm('确认取消该采购单？', '提示', {
    type: 'warning'
  }).then(() => {
    const index = purchaseList.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      purchaseList.value[index].status = 'cancelled';
      ElMessage.success('操作成功');
    }
  });
};

// 添加商品
const handleAddProduct = () => {
  form.products.push({
    name: '',
    spec: '',
    quantity: 1,
    price: 0
  });
};

// 删除商品
const handleRemoveProduct = (index: number) => {
  form.products.splice(index, 1);
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialog.type === 'add') {
        purchaseList.value.unshift({
          id: purchaseList.value.length + 1,
          ...form,
          amount: calculateAmount.value,
          status: 'pending',
          operator: '当前用户',
          createTime: new Date().toLocaleString()
        });
        ElMessage.success('添加成功');
      } else {
        const index = purchaseList.value.findIndex(item => item.id === form.id);
        if (index !== -1) {
          Object.assign(purchaseList.value[index], {
            ...form,
            amount: calculateAmount.value
          });
          ElMessage.success('修改成功');
        }
      }
      dialog.visible = false;
    }
  });
};

// 提交审核
const handleApproveSubmit = async () => {
  if (!approveFormRef.value) return;
  
  await approveFormRef.value.validate((valid) => {
    if (valid) {
      const index = purchaseList.value.findIndex(item => item.id === approveForm.id);
      if (index !== -1) {
        purchaseList.value[index].status = 'approved';
        ElMessage.success('审核通过');
      }
      approveDialog.visible = false;
    }
  });
};

// 分页
const handleSizeChange = () => {
  loadData();
};

const handleCurrentChange = () => {
  loadData();
};
</script>

<style scoped lang="scss">
.purchase-container {
  padding: 20px;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;

  .el-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    
    .left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .right {
      display: flex;
      gap: 16px;
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
    margin: 20px 0;
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    flex-shrink: 0;
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