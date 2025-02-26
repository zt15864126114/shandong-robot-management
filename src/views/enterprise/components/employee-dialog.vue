<template>
  <el-dialog
    :title="employee ? '编辑员工' : '新增员工'"
    v-model="dialogVisible"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="工号" prop="employeeNo">
        <el-input v-model="form.employeeNo" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentId">
        <el-select v-model="form.departmentId" placeholder="请选择部门" style="width: 100%">
          <el-option
            v-for="dept in departmentList"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input v-model="form.position" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthDate">
        <el-date-picker
          v-model="form.birthDate"
          type="date"
          placeholder="选择出生日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="入职日期" prop="entryDate">
        <el-date-picker
          v-model="form.entryDate"
          type="date"
          placeholder="选择入职日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
          <el-option label="在职" value="active" />
          <el-option label="离职" value="inactive" />
          <el-option label="请假" value="leave" />
        </el-select>
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
import type { Employee, Department } from '@/types/enterprise';
import { employees } from '@/data/enterprise';

const props = defineProps<{
  modelValue: boolean;
  employee: Employee | null;
  departmentList: Department[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const dialogVisible = ref(false);
const form = ref<Partial<Employee>>({});

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
  if (val) {
    form.value = props.employee ? { ...props.employee } : {
      employeeNo: '',
      name: '',
      departmentId: undefined,
      position: '',
      phone: '',
      email: '',
      gender: 'male',
      birthDate: '',
      entryDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
  }
});

watch(() => dialogVisible.value, (val) => {
  emit('update:modelValue', val);
});

const handleSubmit = () => {
  if (props.employee) {
    // 编辑
    Object.assign(props.employee, form.value);
  } else {
    // 新增
    const newEmployee: Employee = {
      ...form.value as Employee,
      id: employees.length + 1
    };
    employees.push(newEmployee);
  }
  ElMessage.success(props.employee ? '修改成功' : '添加成功');
  dialogVisible.value = false;
  emit('success');
};
</script> 