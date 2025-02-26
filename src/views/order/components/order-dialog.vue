<template>
  <el-dialog
    :title="order ? '编辑订单' : '新增订单'"
    v-model="visible"
    width="700px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="order-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customer">
            <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%">
              <el-option
                v-for="customer in customers"
                :key="customer"
                :label="customer"
                :value="customer"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品类型" prop="productType">
            <el-select 
              v-model="form.productType" 
              placeholder="请选择产品类型"
              style="width: 100%"
              @change="handleProductTypeChange"
            >
              <el-option
                v-for="product in products"
                :key="product.type"
                :label="product.type"
                :value="product.type"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品型号" prop="productModel">
            <el-select 
              v-model="form.productModel" 
              placeholder="请选择产品型号"
              style="width: 100%"
              @change="handleModelChange"
            >
              <el-option
                v-for="model in availableModels"
                :key="model"
                :label="model"
                :value="model"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单金额" prop="amount">
            <el-input-number 
              v-model="form.amount"
              :min="0"
              :precision="2"
              :step="10000"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="待付款" value="unpaid" />
              <el-option label="待发货" value="unshipped" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交付日期" prop="deliveryTime">
            <el-date-picker
              v-model="form.deliveryTime"
              type="date"
              placeholder="选择交付日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: Boolean,
  order: {
    type: Object,
    default: undefined
  }
});

const emit = defineEmits(['update:modelValue', 'success']);

// 客户列表
const customers = [
  '山东重工',
  '青岛港',
  '济南医院',
  '潍柴动力',
  '浪潮集团',
  '海尔集团',
  '中国重汽',
  '山东钢铁',
  '齐鲁制药',
  '东营石化'
];

// 产品列表
const products = [
  {
    type: '工业机器人',
    models: ['AR-150', 'AR-200', 'AR-300', 'AR-500']
  },
  {
    type: '服务机器人',
    models: ['SR-100', 'SR-200', 'SR-300']
  },
  {
    type: '特种机器人',
    models: ['SP-150', 'SP-200', 'SP-300']
  },
  {
    type: '协作机器人',
    models: ['CR-50', 'CR-100', 'CR-150']
  }
];

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const formRef = ref<FormInstance>();
const loading = ref(false);

interface OrderForm {
  customer: string;
  productType: string;
  productModel: string;
  amount: number;
  status: string;
  deliveryTime: string;
  remark: string;
}

const form = ref<OrderForm>({
  customer: '',
  productType: '',
  productModel: '',
  amount: 0,
  status: 'pending',
  deliveryTime: '',
  remark: ''
});

// 可选的产品型号
const availableModels = computed(() => {
  const product = products.find(p => p.type === form.value.productType);
  return product ? product.models : [];
});

// 表单校验规则
const rules = {
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  productType: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
  productModel: [{ required: true, message: '请选择产品型号', trigger: 'change' }],
  amount: [{ required: true, message: '请输入订单金额', trigger: 'blur' }],
  status: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
  deliveryTime: [{ required: true, message: '请选择交付日期', trigger: 'change' }]
};

// 监听编辑数据变化
watch(() => props.order, (newVal) => {
  if (newVal) {
    form.value = { ...form.value, ...newVal as OrderForm };
  }
}, { immediate: true });

// 产品类型改变时清空型号
const handleProductTypeChange = () => {
  form.value.productModel = '';
  form.value.amount = 0;
};

// 型号改变时自动计算金额
const handleModelChange = () => {
  if (form.value.productModel) {
    const basePrice = parseInt(form.value.productModel.split('-')[1]) * 10000;
    form.value.amount = basePrice;
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 这里应该调用API保存数据
      setTimeout(() => {
        loading.value = false;
        ElMessage.success('保存成功');
        visible.value = false;
        emit('success');
      }, 1000);
    }
  });
};
</script>

<style scoped lang="scss">
.order-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 20px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style> 