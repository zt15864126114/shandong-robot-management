<template>
  <el-dialog
    :title="role ? '编辑角色' : '新增角色'"
    v-model="dialogVisible"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入角色编码" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入角色描述"
        />
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
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import type { Role } from '@/types/system';

const props = defineProps<{
  modelValue: boolean;
  role: Role | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const form = ref<Partial<Role>>({});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '只能包含大写字母和下划线', trigger: 'blur' }
  ]
};

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
  if (val) {
    form.value = props.role ? { ...props.role } : {
      name: '',
      code: '',
      description: ''
    };
  }
});

watch(() => dialogVisible.value, (val) => {
  emit('update:modelValue', val);
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 这里实现表单提交逻辑
      ElMessage.success('保存成功');
      dialogVisible.value = false;
      emit('success');
    }
  });
};
</script> 