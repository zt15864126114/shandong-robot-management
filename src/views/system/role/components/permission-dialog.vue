<template>
  <el-dialog
    title="权限设置"
    v-model="dialogVisible"
    width="600px"
  >
    <el-form label-width="100px">
      <el-form-item label="角色名称">
        <span>{{ role?.name }}</span>
      </el-form-item>
      <el-form-item label="权限列表">
        <el-tree
          ref="treeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="selectedPermissions"
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
import type { ElTree } from 'element-plus';
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
const treeRef = ref<InstanceType<typeof ElTree>>();

// 权限树数据
const permissionTree = [
  {
    id: 1,
    label: '系统管理',
    children: [
      {
        id: 11,
        label: '用户管理',
        children: [
          { id: 111, label: '查看用户' },
          { id: 112, label: '新增用户' },
          { id: 113, label: '编辑用户' },
          { id: 114, label: '删除用户' }
        ]
      },
      {
        id: 12,
        label: '角色管理',
        children: [
          { id: 121, label: '查看角色' },
          { id: 122, label: '新增角色' },
          { id: 123, label: '编辑角色' },
          { id: 124, label: '删除角色' }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '企业管理',
    children: [
      {
        id: 21,
        label: '企业信息',
        children: [
          { id: 211, label: '查看企业' },
          { id: 212, label: '新增企业' },
          { id: 213, label: '编辑企业' },
          { id: 214, label: '删除企业' }
        ]
      },
      {
        id: 22,
        label: '企业认证',
        children: [
          { id: 221, label: '查看认证' },
          { id: 222, label: '审核认证' }
        ]
      }
    ]
  },
  {
    id: 3,
    label: '数据管理',
    children: [
      {
        id: 31,
        label: '数据统计',
        children: [
          { id: 311, label: '查看统计' },
          { id: 312, label: '导出数据' }
        ]
      },
      {
        id: 32,
        label: '日志管理',
        children: [
          { id: 321, label: '查看日志' },
          { id: 322, label: '导出日志' }
        ]
      }
    ]
  }
];

const defaultProps = {
  children: 'children',
  label: 'label'
};

// 已选择的权限
const selectedPermissions = ref<number[]>([]);

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
  if (val && props.role) {
    // 设置已选择的权限
    selectedPermissions.value = props.role.permissions.map(Number);
  }
});

watch(() => dialogVisible.value, (val) => {
  emit('update:modelValue', val);
});

const handleSubmit = () => {
  if (!treeRef.value) return;
  
  const checkedKeys = treeRef.value.getCheckedKeys();
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
  const allKeys = [...checkedKeys, ...halfCheckedKeys];
  
  // 这里实现权限保存逻辑
  console.log('选中的权限:', allKeys);
  ElMessage.success('保存成功');
  dialogVisible.value = false;
  emit('success');
};
</script> 