<template>
  <el-dialog
    title="编辑企业信息"
    v-model="dialogVisible"
    width="600px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      
      <el-form-item label="法定代表人" prop="legalPerson">
        <el-input v-model="form.legalPerson" />
      </el-form-item>
      
      <el-form-item label="注册号" prop="registrationNumber">
        <el-input v-model="form.registrationNumber" />
      </el-form-item>
      
      <el-form-item label="注册资本" prop="registeredCapital">
        <el-input-number
          v-model="form.registeredCapital"
          :min="0"
          :precision="2"
          :step="100"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="成立日期" prop="foundingDate">
        <el-date-picker
          v-model="form.foundingDate"
          type="date"
          placeholder="选择成立日期"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      
      <el-form-item label="企业网站" prop="website">
        <el-input v-model="form.website" />
      </el-form-item>
      
      <el-form-item label="企业地址" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
      
      <el-form-item label="经营范围" prop="businessScope">
        <el-input
          v-model="form.businessScope"
          type="textarea"
          :rows="3"
          placeholder="请输入经营范围"
        />
      </el-form-item>
      
      <el-form-item label="企业状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="active">正常经营</el-radio>
          <el-radio label="inactive">已停业</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { EnterpriseInfo } from '@/types/enterprise';

const props = defineProps<{
  modelValue: boolean;
  info: EnterpriseInfo;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const dialogVisible = ref(false);
const form = ref<Partial<EnterpriseInfo>>({});

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  legalPerson: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
  registrationNumber: [{ required: true, message: '请输入注册号', trigger: 'blur' }],
  registeredCapital: [{ required: true, message: '请输入注册资本', trigger: 'blur' }],
  foundingDate: [{ required: true, message: '请选择成立日期', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入企业地址', trigger: 'blur' }],
  businessScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],
  status: [{ required: true, message: '请选择企业状态', trigger: 'change' }]
};

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
  if (val) {
    form.value = { ...props.info };
  }
});

watch(() => dialogVisible.value, (val) => {
  emit('update:modelValue', val);
});

const handleSubmit = () => {
  // 直接修改父组件的数据
  Object.assign(props.info, form.value);
  ElMessage.success('保存成功');
  dialogVisible.value = false;
  emit('success');
};
</script> 