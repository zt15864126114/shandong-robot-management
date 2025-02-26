<template>
  <el-dialog
    title="分配角色"
    v-model="dialogVisible"
    width="500px"
  >
    <el-form label-width="100px">
      <el-form-item label="用户名">
        <span>{{ user?.username }}</span>
      </el-form-item>
      <el-form-item label="姓名">
        <span>{{ user?.realName }}</span>
      </el-form-item>
      <el-form-item label="角色">
        <el-checkbox-group v-model="selectedRoles">
          <el-checkbox
            v-for="role in roleList"
            :key="role.id"
            :label="role.id"
          >
            {{ role.name }}
          </el-checkbox>
        </el-checkbox-group>
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
import type { User, Role } from '@/types/system';

const props = defineProps<{
  modelValue: boolean;
  user: User | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const dialogVisible = ref(false);
const selectedRoles = ref<number[]>([]);

// 角色列表
const roleList = ref<Role[]>([
  {
    id: 1,
    name: '超级管理员',
    code: 'ADMIN',
    description: '系统最高权限',
    permissions: [],
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    name: '普通用户',
    code: 'USER',
    description: '普通用户权限',
    permissions: [],
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  }
]);

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
  if (val && props.user) {
    // 设置已选择的角色
    selectedRoles.value = props.user.roles.map(role => role.id);
  }
});

watch(() => dialogVisible.value, (val) => {
  emit('update:modelValue', val);
});

const handleSubmit = () => {
  // 这里实现角色分配的逻辑
  ElMessage.success('保存成功');
  dialogVisible.value = false;
  emit('success');
};
</script>

<style scoped>
.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style> 