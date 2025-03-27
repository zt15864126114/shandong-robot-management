# 完整的物流管理页面代码
<template>
  <div class="logistics-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入物流单号/收货人"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.status" placeholder="物流状态" clearable style="width: 120px">
              <el-option label="待发货" value="pending" />
              <el-option label="运输中" value="transit" />
              <el-option label="已送达" value="delivered" />
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
            <el-button type="primary" @click="handleAdd">新增物流</el-button>
          </div>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="logisticsList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="物流单号" min-width="180" />
          <el-table-column prop="orderCode" label="关联订单" min-width="180" />
          <el-table-column prop="receiver" label="收货人" min-width="120" />
          <el-table-column prop="receiverPhone" label="联系电话" min-width="120" />
          <el-table-column prop="address" label="收货地址" min-width="200" />
          <el-table-column prop="carrier" label="承运商" min-width="150" />
          <el-table-column prop="status" label="状态" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <template v-if="row.status === 'pending'">
                  <a @click="handleShip(row)">发货</a>
                  <a @click="handleEdit(row)">编辑</a>
                  <a class="danger" @click="handleCancel(row)">取消</a>
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else-if="row.status === 'transit'">
                  <a class="success" @click="handleDeliver(row)">送达</a>
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else-if="row.status === 'delivered'">
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else-if="row.status === 'cancelled'">
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

    <!-- 物流表单对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.type === 'add' ? '新增物流' : dialog.type === 'edit' ? '编辑物流' : '物流详情'"
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
            <el-form-item label="物流单号" prop="code">
              <el-input v-model="form.code" placeholder="请输入物流单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联订单" prop="orderCode">
              <el-select v-model="form.orderCode" placeholder="请选择关联订单" style="width: 100%">
                <el-option
                  v-for="item in orderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收货人" prop="receiver">
              <el-input v-model="form.receiver" placeholder="请输入收货人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="receiverPhone">
              <el-input v-model="form.receiverPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="收货地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            :rows="2"
            placeholder="请输入收货地址"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="承运商" prop="carrier">
              <el-select v-model="form.carrier" placeholder="请选择承运商" style="width: 100%">
                <el-option
                  v-for="item in carrierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输方式" prop="transportType">
              <el-select v-model="form.transportType" placeholder="请选择运输方式" style="width: 100%">
                <el-option label="公路运输" value="road" />
                <el-option label="铁路运输" value="rail" />
                <el-option label="航空运输" value="air" />
                <el-option label="海运" value="sea" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="货物信息">
          <el-table :data="form.goods" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="name" label="商品名称" min-width="200">
              <template #default="{ row }">
                <el-input v-model="row.name" placeholder="请输入商品名称" />
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
            <el-table-column prop="unit" label="单位" width="100">
              <template #default="{ row }">
                <el-input v-model="row.unit" placeholder="单位" />
              </template>
            </el-table-column>
            <el-table-column v-if="dialog.type !== 'view'" label="操作" width="80">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleRemoveGoods($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="dialog.type !== 'view'" style="margin-top: 10px">
            <el-button type="primary" @click="handleAddGoods">添加商品</el-button>
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

    <!-- 发货对话框 -->
    <el-dialog
      v-model="shipDialog.visible"
      title="物流发货"
      width="500px"
    >
      <el-form
        ref="shipFormRef"
        :model="shipForm"
        :rules="shipRules"
        label-width="100px"
      >
        <el-form-item label="发货时间" prop="shipTime">
          <el-date-picker
            v-model="shipForm.shipTime"
            type="datetime"
            placeholder="选择发货时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="发货备注" prop="remark">
          <el-input
            v-model="shipForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入发货备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleShipSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
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

// 物流列表
const logisticsList = ref([
  {
    id: 1,
    code: 'WL20250301001',
    orderCode: 'CG20250301001',
    receiver: '张明',
    receiverPhone: '15864123669',
    address: '山东省济南市高新区科技园区88号',
    carrier: '顺丰速运',
    status: 'delivered',
    createTime: '2025-03-01 09:30:00',
    goods: [
      { name: '发那科机器人 CR-7iA', spec: 'CR-7iA', quantity: 2, unit: '台' }
    ],
    remark: '机器人本体运输'
  },
  {
    id: 2,
    code: 'WL20250301002',
    orderCode: 'CG20250301002',
    receiver: '李强',
    receiverPhone: '15897564114',
    address: '山东省青岛市崂山区海尔路1号',
    carrier: '德邦物流',
    status: 'transit',
    createTime: '2025-03-01 14:00:00',
    goods: [
      { name: '西门子S7-1500 PLC', spec: 'S7-1500', quantity: 5, unit: '台' }
    ],
    remark: '控制系统运输'
  },
  {
    id: 3,
    code: 'WL20250302001',
    orderCode: 'CG20250302001',
    receiver: '王华',
    receiverPhone: '13791713598',
    address: '山东省烟台市开发区长江路88号',
    carrier: '中通快递',
    status: 'pending',
    createTime: '2025-03-02 10:15:00',
    goods: [
      { name: '安川机器人 GP8', spec: 'GP8', quantity: 5, unit: '台' }
    ],
    remark: '机器人本体运输'
  },
  {
    id: 4,
    code: 'WL20250302002',
    orderCode: 'CG20250302002',
    receiver: '赵静',
    receiverPhone: '13798423654',
    address: '山东省潍坊市奎文区东风街1号',
    carrier: '圆通速递',
    status: 'delivered',
    createTime: '2025-03-02 13:45:00',
    goods: [
      { name: '欧姆龙光电传感器', spec: 'E3Z-T61', quantity: 100, unit: '个' }
    ],
    remark: '传感器运输'
  },
  {
    id: 5,
    code: 'WL20250302003',
    orderCode: 'CG20250302003',
    receiver: '刘伟',
    receiverPhone: '13598752164',
    address: '山东省淄博市张店区人民路1号',
    carrier: '韵达快递',
    status: 'cancelled',
    createTime: '2025-03-02 16:30:00',
    goods: [
      { name: '倍加福接近开关', spec: 'NBB4-12GM50-E0', quantity: 30, unit: '个' }
    ],
    remark: '接近开关运输-已取消'
  },
  {
    id: 6,
    code: 'WL20250303001',
    orderCode: 'CG20250303001',
    receiver: '陈明',
    receiverPhone: '15684564265',
    address: '山东省威海市环翠区文化路1号',
    carrier: '顺丰速运',
    status: 'pending',
    createTime: '2025-03-03 09:15:00',
    goods: [
      { name: '三菱伺服电机', spec: 'HG-KR43', quantity: 5, unit: '台' }
    ],
    remark: '伺服系统运输'
  },
  {
    id: 7,
    code: 'WL20250303002',
    orderCode: 'CG20250303002',
    receiver: '杨华',
    receiverPhone: '13300133584',
    address: '山东省临沂市兰山区解放路1号',
    carrier: '德邦物流',
    status: 'transit',
    createTime: '2025-03-03 11:30:00',
    goods: [
      { name: '基恩士视觉系统', spec: 'CV-X150F', quantity: 2, unit: '套' }
    ],
    remark: '视觉系统运输'
  },
  {
    id: 8,
    code: 'WL20250303003',
    orderCode: 'CG20250303003',
    receiver: '周强',
    receiverPhone: '13200135971',
    address: '山东省泰安市泰山区泰山路1号',
    carrier: '中通快递',
    status: 'delivered',
    createTime: '2025-03-03 14:45:00',
    goods: [
      { name: '图尔克接近开关', spec: 'BI5-M18-AP6X', quantity: 60, unit: '个' }
    ],
    remark: '接近开关运输'
  },
  {
    id: 9,
    code: 'WL20250304001',
    orderCode: 'CG20250304001',
    receiver: '吴静',
    receiverPhone: '13100131000',
    address: '山东省济宁市任城区建设路1号',
    carrier: '圆通速递',
    status: 'pending',
    createTime: '2025-03-04 10:00:00',
    goods: [
      { name: '魏德米勒端子', spec: 'WDU 2.5', quantity: 1000, unit: '个' }
    ],
    remark: '接线端子运输'
  },
  {
    id: 10,
    code: 'WL20250304002',
    orderCode: 'CG20250304002',
    receiver: '郑伟',
    receiverPhone: '15864265998',
    address: '山东省东营市东营区黄河路1号',
    carrier: '韵达快递',
    status: 'transit',
    createTime: '2025-03-04 13:20:00',
    goods: [
      { name: '库卡机器人', spec: 'KR10 R1100', quantity: 2, unit: '台' }
    ],
    remark: '机器人本体运输'
  }
]);

const total = ref(100);

// 对话框状态
const dialog = reactive({
  visible: false,
  type: 'add' as 'add' | 'edit' | 'view'
});

// 发货对话框
const shipDialog = reactive({
  visible: false,
  data: {} as any
});

// 表单数据
const form = reactive({
  code: '',
  orderCode: '',
  receiver: '',
  receiverPhone: '',
  address: '',
  carrier: '',
  transportType: '',
  goods: [] as any[],
  remark: ''
});

// 发货表单
const shipForm = reactive({
  id: '',
  shipTime: '',
  remark: ''
});

// 订单选项
const orderOptions = [
  { value: 'CG20250301001', label: 'CG20250301001 - 发那科机器人采购' },
  { value: 'CG20250301002', label: 'CG20250301002 - 西门子PLC采购' },
  { value: 'CG20250302001', label: 'CG20250302001 - 安川机器人采购' },
  { value: 'CG20250302002', label: 'CG20250302002 - 欧姆龙传感器采购' },
  { value: 'CG20250302003', label: 'CG20250302003 - 倍加福接近开关采购' }
];

// 承运商选项
const carrierOptions = [
  { value: '顺丰速运', label: '顺丰速运' },
  { value: '德邦物流', label: '德邦物流' },
  { value: '中通快递', label: '中通快递' },
  { value: '圆通速递', label: '圆通速递' },
  { value: '韵达快递', label: '韵达快递' }
];

// 表单规则
const rules = reactive<FormRules>({
  code: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
  orderCode: [{ required: true, message: '请选择关联订单', trigger: 'change' }],
  receiver: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
  receiverPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
  carrier: [{ required: true, message: '请选择承运商', trigger: 'change' }],
  transportType: [{ required: true, message: '请选择运输方式', trigger: 'change' }],
  goods: [{ required: true, message: '请添加货物信息', trigger: 'change' }]
});

// 发货表单规则
const shipRules = reactive<FormRules>({
  shipTime: [{ required: true, message: '请选择发货时间', trigger: 'change' }]
});

const formRef = ref<FormInstance>();
const shipFormRef = ref<FormInstance>();

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    transit: 'primary',
    delivered: 'success',
    cancelled: 'info'
  };
  return map[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待发货',
    transit: '运输中',
    delivered: '已送达',
    cancelled: '已取消'
  };
  return map[status] || status;
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadData();
};

// 加载数据
const loadData = () => {
  // TODO: 调用API获取数据
  console.log('加载物流列表:', query.value);
};

// 新增物流
const handleAdd = () => {
  dialog.type = 'add';
  Object.assign(form, {
    code: '',
    orderCode: '',
    receiver: '',
    receiverPhone: '',
    address: '',
    carrier: '',
    transportType: '',
    goods: [],
    remark: ''
  });
  dialog.visible = true;
};

// 编辑物流
const handleEdit = (row: any) => {
  dialog.type = 'edit';
  Object.assign(form, row);
  dialog.visible = true;
};

// 查看物流
const handleView = (row: any) => {
  dialog.type = 'view';
  Object.assign(form, row);
  dialog.visible = true;
};

// 发货
const handleShip = (row: any) => {
  shipDialog.data = row;
  shipForm.id = row.id;
  shipForm.shipTime = '';
  shipForm.remark = '';
  shipDialog.visible = true;
};

// 送达
const handleDeliver = (row: any) => {
  ElMessageBox.confirm('确认货物已送达？', '提示', {
    type: 'warning'
  }).then(() => {
    const index = logisticsList.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      logisticsList.value[index].status = 'delivered';
      ElMessage.success('操作成功');
    }
  });
};

// 取消物流
const handleCancel = (row: any) => {
  ElMessageBox.confirm('确认取消该物流单？', '提示', {
    type: 'warning'
  }).then(() => {
    const index = logisticsList.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      logisticsList.value[index].status = 'cancelled';
      ElMessage.success('操作成功');
    }
  });
};

// 添加货物
const handleAddGoods = () => {
  form.goods.push({
    name: '',
    spec: '',
    quantity: 1,
    unit: ''
  });
};

// 删除货物
const handleRemoveGoods = (index: number) => {
  form.goods.splice(index, 1);
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialog.type === 'add') {
        logisticsList.value.unshift({
          id: logisticsList.value.length + 1,
          ...form,
          status: 'pending',
          createTime: new Date().toLocaleString()
        });
        ElMessage.success('添加成功');
      } else {
        const index = logisticsList.value.findIndex(item => item.id === form.id);
        if (index !== -1) {
          Object.assign(logisticsList.value[index], form);
          ElMessage.success('修改成功');
        }
      }
      dialog.visible = false;
    }
  });
};

// 提交发货
const handleShipSubmit = async () => {
  if (!shipFormRef.value) return;
  
  await shipFormRef.value.validate((valid) => {
    if (valid) {
      const index = logisticsList.value.findIndex(item => item.id === shipForm.id);
      if (index !== -1) {
        logisticsList.value[index].status = 'transit';
        ElMessage.success('发货成功');
      }
      shipDialog.visible = false;
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
.logistics-container {
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