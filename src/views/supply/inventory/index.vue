<template>
  <div class="inventory-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入商品名称/编号"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">入库</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="inventoryList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="商品编号" width="120" />
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="category" label="类别" width="120" />
          <el-table-column prop="quantity" label="库存数量" width="120" />
          <el-table-column prop="unit" label="单位" width="80" />
          <el-table-column prop="warning" label="预警值" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.quantity, row.warning)">
                {{ getStatusText(row.quantity, row.warning) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleInbound(row)">入库</el-button>
              <el-button link type="warning" @click="handleOutbound(row)">出库</el-button>
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
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
      :title="formType === 'add' ? '新增商品' : '编辑商品'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入商品编号" />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择商品类别" style="width: 100%">
            <el-option label="机器人" value="机器人" />
            <el-option label="控制系统" value="控制系统" />
            <el-option label="核心部件" value="核心部件" />
            <el-option label="传感器" value="传感器" />
            <el-option label="电子件" value="电子件" />
            <el-option label="软件" value="软件" />
            <el-option label="配件" value="配件" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" placeholder="请选择单位" style="width: 100%">
            <el-option label="台" value="台" />
            <el-option label="个" value="个" />
            <el-option label="块" value="块" />
            <el-option label="套" value="套" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警值" prop="warning">
          <el-input-number v-model="form.warning" :min="0" style="width: 100%" />
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

    <el-dialog
      v-model="dialogs.inbound"
      title="入库"
      width="400px"
    >
      <el-form
        ref="inboundFormRef"
        :model="inboundForm"
        :rules="inboundRules"
        label-width="100px"
      >
        <el-form-item label="入库数量" prop="quantity">
          <el-input-number v-model="inboundForm.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="inboundForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.inbound = false">取消</el-button>
        <el-button type="primary" @click="handleInboundSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogs.outbound"
      title="出库"
      width="400px"
    >
      <el-form
        ref="outboundFormRef"
        :model="outboundForm"
        :rules="outboundRules"
        label-width="100px"
      >
        <el-form-item label="出库数量" prop="quantity">
          <el-input-number 
            v-model="outboundForm.quantity" 
            :min="1" 
            :max="currentRow.quantity"
            style="width: 100%" 
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="outboundForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.outbound = false">取消</el-button>
        <el-button type="primary" @click="handleOutboundSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: ''
});

// 库存列表
const inventoryList = ref([
  {
    id: 1,
    code: 'RB001',
    name: '工业机器人本体',
    category: '机器人',
    quantity: 15,
    unit: '台',
    warning: 10,
    remark: '六轴机器人'
  },
  {
    id: 2,
    code: 'CT001',
    name: '机器人控制柜',
    category: '控制系统',
    quantity: 25,
    unit: '台',
    warning: 15,
    remark: '标准控制柜'
  },
  {
    id: 3,
    code: 'DR001',
    name: '伺服驱动器',
    category: '核心部件',
    quantity: 86,
    unit: '个',
    warning: 50,
    remark: '高性能伺服'
  },
  {
    id: 4,
    code: 'MT001',
    name: '伺服电机',
    category: '核心部件',
    quantity: 120,
    unit: '个',
    warning: 80,
    remark: '机器人关节电机'
  },
  {
    id: 5,
    code: 'SC001',
    name: '视觉传感器',
    category: '传感器',
    quantity: 45,
    unit: '个',
    warning: 30,
    remark: '工业相机'
  },
  {
    id: 6,
    code: 'SC002',
    name: '力矩传感器',
    category: '传感器',
    quantity: 38,
    unit: '个',
    warning: 25,
    remark: '六维力传感器'
  },
  {
    id: 7,
    code: 'CB001',
    name: '控制板',
    category: '电子件',
    quantity: 95,
    unit: '块',
    warning: 60,
    remark: '主控板'
  },
  {
    id: 8,
    code: 'CB002',
    name: '接口板',
    category: '电子件',
    quantity: 150,
    unit: '块',
    warning: 100,
    remark: 'IO扩展板'
  },
  {
    id: 9,
    code: 'SW001',
    name: '控制软件',
    category: '软件',
    quantity: 30,
    unit: '套',
    warning: 20,
    remark: '机器人控制系统'
  },
  {
    id: 10,
    code: 'SP001',
    name: '备品备件包',
    category: '配件',
    quantity: 50,
    unit: '套',
    warning: 30,
    remark: '标准配件包'
  },
  {
    id: 11,
    code: 'RB002',
    name: '四轴机器人',
    category: '机器人',
    quantity: 12,
    unit: '台',
    warning: 8,
    remark: 'SCARA机器人'
  },
  {
    id: 12,
    code: 'RB003',
    name: '协作机器人',
    category: '机器人',
    quantity: 8,
    unit: '台',
    warning: 5,
    remark: '轻型协作机器人'
  },
  {
    id: 13,
    code: 'CT002',
    name: '示教器',
    category: '控制系统',
    quantity: 35,
    unit: '台',
    warning: 20,
    remark: '便携式示教器'
  },
  {
    id: 14,
    code: 'DR002',
    name: '通讯模块',
    category: '控制系统',
    quantity: 65,
    unit: '个',
    warning: 40,
    remark: '工业以太网模块'
  },
  {
    id: 15,
    code: 'MT002',
    name: '减速机',
    category: '核心部件',
    quantity: 95,
    unit: '个',
    warning: 60,
    remark: '谐波减速机'
  },
  {
    id: 16,
    code: 'SC003',
    name: '距离传感器',
    category: '传感器',
    quantity: 128,
    unit: '个',
    warning: 80,
    remark: '激光测距传感器'
  },
  {
    id: 17,
    code: 'SC004',
    name: '压力传感器',
    category: '传感器',
    quantity: 76,
    unit: '个',
    warning: 50,
    remark: '高精度压力传感器'
  },
  {
    id: 18,
    code: 'CB003',
    name: '安全控制板',
    category: '电子件',
    quantity: 42,
    unit: '块',
    warning: 30,
    remark: '安全防护控制板'
  },
  {
    id: 19,
    code: 'SW002',
    name: '离线编程软件',
    category: '软件',
    quantity: 15,
    unit: '套',
    warning: 10,
    remark: '机器人编程环境'
  },
  {
    id: 20,
    code: 'SW003',
    name: '视觉软件包',
    category: '软件',
    quantity: 20,
    unit: '套',
    warning: 15,
    remark: '机器视觉算法包'
  },
  {
    id: 21,
    code: 'SP002',
    name: '工具套件',
    category: '配件',
    quantity: 68,
    unit: '套',
    warning: 40,
    remark: '维护工具包'
  },
  {
    id: 22,
    code: 'SP003',
    name: '电缆组件',
    category: '配件',
    quantity: 156,
    unit: '套',
    warning: 100,
    remark: '标准电缆包'
  },
  {
    id: 23,
    code: 'SP004',
    name: '末端工具',
    category: '配件',
    quantity: 45,
    unit: '个',
    warning: 30,
    remark: '机器人夹具'
  },
  {
    id: 24,
    code: 'SP005',
    name: '安装底座',
    category: '配件',
    quantity: 25,
    unit: '套',
    warning: 15,
    remark: '机器人固定底座'
  }
]);

// 总数
const total = ref(100);

// 对话框状态
const dialogs = reactive({
  form: false,
  inbound: false,
  outbound: false
});

// 表单类型
const formType = ref<'add' | 'edit'>('add');

// 当前行数据
const currentRow = ref({});

// 表单数据
const form = reactive({
  code: '',
  name: '',
  category: '',
  quantity: 0,
  unit: '',
  warning: 0,
  remark: ''
});

// 入库表单
const inboundForm = reactive({
  quantity: 1,
  remark: ''
});

// 出库表单
const outboundForm = reactive({
  quantity: 1,
  remark: ''
});

// 表单规则
const rules = reactive<FormRules>({
  code: [{ required: true, message: '请输入商品编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品类别', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  warning: [{ required: true, message: '请输入预警值', trigger: 'blur' }]
});

// 入库表单规则
const inboundRules = reactive<FormRules>({
  quantity: [{ required: true, message: '请输入入库数量', trigger: 'blur' }]
});

// 出库表单规则
const outboundRules = reactive<FormRules>({
  quantity: [{ required: true, message: '请输入出库数量', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();
const inboundFormRef = ref<FormInstance>();
const outboundFormRef = ref<FormInstance>();

// 获取状态类型
const getStatusType = (quantity: number, warning: number) => {
  if (quantity <= 0) return 'danger';
  if (quantity <= warning) return 'warning';
  return 'success';
};

// 获取状态文本
const getStatusText = (quantity: number, warning: number) => {
  if (quantity <= 0) return '无库存';
  if (quantity <= warning) return '预警';
  return '正常';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadInventoryList();
};

// 加载库存列表
const loadInventoryList = () => {
  // 这里应该调用API获取数据
  console.log('加载库存列表:', query.value);
};

// 新增商品
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    code: '',
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    warning: 0,
    remark: ''
  });
  dialogs.form = true;
};

// 编辑商品
const handleEdit = (row: any) => {
  formType.value = 'edit';
  Object.assign(form, row);
  currentRow.value = row;
  dialogs.form = true;
};

// 入库
const handleInbound = (row: any) => {
  currentRow.value = row;
  inboundForm.quantity = 1;
  inboundForm.remark = '';
  dialogs.inbound = true;
};

// 出库
const handleOutbound = (row: any) => {
  currentRow.value = row;
  outboundForm.quantity = 1;
  outboundForm.remark = '';
  dialogs.outbound = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (formType.value === 'add') {
        inventoryList.value.unshift({
          id: inventoryList.value.length + 1,
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

// 提交入库
const handleInboundSubmit = async () => {
  if (!inboundFormRef.value) return;
  
  await inboundFormRef.value.validate((valid) => {
    if (valid) {
      currentRow.value.quantity += inboundForm.quantity;
      ElMessage.success('入库成功');
      dialogs.inbound = false;
    }
  });
};

// 提交出库
const handleOutboundSubmit = async () => {
  if (!outboundFormRef.value) return;
  
  await outboundFormRef.value.validate((valid) => {
    if (valid) {
      if (outboundForm.quantity > currentRow.value.quantity) {
        ElMessage.error('出库数量不能大于库存数量');
        return;
      }
      currentRow.value.quantity -= outboundForm.quantity;
      ElMessage.success('出库成功');
      dialogs.outbound = false;
    }
  });
};

// 分页大小改变
const handleSizeChange = () => {
  loadInventoryList();
};

// 页码改变
const handleCurrentChange = () => {
  loadInventoryList();
};
</script>

<style scoped lang="scss">
.inventory-container {
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
}
</style> 