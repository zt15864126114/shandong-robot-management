<template>
  <el-dialog
    :title="department ? '编辑部门' : '新增部门'"
    v-model="dialogVisible"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      
      <el-form-item label="负责人" prop="manager">
        <el-input v-model="form.manager" placeholder="请输入负责人姓名" />
      </el-form-item>
      
      <el-form-item label="上级部门" prop="parentId">
        <el-select v-model="form.parentId" placeholder="请选择上级部门" clearable style="width: 100%">
          <el-option label="无" :value="null" />
          <el-option
            v-for="dept in departmentList"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
            :disabled="dept.id === department?.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入部门描述"
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
import { ElMessage } from 'element-plus';
import type { Department } from '@/types/enterprise';
import { departments } from '@/data/enterprise';

const props = defineProps<{
  modelValue: boolean;
  department: Department | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const dialogVisible = ref(false);
const form = ref<Partial<Department>>({});

// 部门列表（用于选择上级部门）
const departmentList = ref<Department[]>([]);

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
  if (val) {
    form.value = props.department ? { ...props.department } : {
      name: '',
      manager: '',
      description: ''
    };
  }
});

watch(() => dialogVisible.value, (val) => {
  emit('update:modelValue', val);
});

const handleSubmit = () => {
  if (props.department) {
    // 编辑
    Object.assign(props.department, form.value);
  } else {
    // 新增
    const newDepartment: Department = {
      ...form.value as Department,
      id: departments.length + 1,
      employeeCount: 0,
      createTime: new Date().toISOString().split('T')[0],
      updateTime: new Date().toISOString().split('T')[0],
      parentId: null
    };
    departments.push(newDepartment);
  }
  ElMessage.success(props.department ? '修改成功' : '添加成功');
  dialogVisible.value = false;
  emit('success');
};
</script> 