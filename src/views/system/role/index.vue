<template>
  <div class="role-container">
    <el-card class="role-card">
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入角色名称/编码"
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
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="roleList" border style="width: 100%" height="100%">
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="code" label="角色编码" />
          <el-table-column prop="description" label="描述" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="success" link @click="handlePermission(row)">权限设置</el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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

    <!-- 添加对话框组件 -->
    <role-dialog
      v-model="dialogs.role"
      :role="currentRole"
      @success="handleSuccess"
    />
    
    <permission-dialog
      v-model="dialogs.permission"
      :role="currentRole"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import type { Role, PageQuery } from '@/types/system';
import RoleDialog from './components/role-dialog.vue';
import PermissionDialog from './components/permission-dialog.vue';

// 查询参数
const query = ref<PageQuery>({
  page: 1,
  pageSize: 10,
  keyword: ''
});

// 角色列表数据
const roleList = ref<Role[]>([
  {
    id: 1,
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '系统最高权限，可以操作系统所有功能',
    permissions: ['111', '112', '113', '114', '121', '122', '123', '124'],
    createTime: '2025-01-01 00:00:00',
    updateTime: '2025-01-01 00:00:00'
  },
  {
    id: 2,
    name: '系统管理员',
    code: 'SYSTEM_ADMIN',
    description: '系统管理员，可以管理系统基础配置',
    permissions: ['111', '112', '113', '121', '122', '123'],
    createTime: '2025-01-01 00:00:00',
    updateTime: '2025-01-01 00:00:00'
  },
  {
    id: 3,
    name: '运营管理员',
    code: 'OPERATION_ADMIN',
    description: '运营管理员，负责日常运营管理',
    permissions: ['111', '112', '121', '122'],
    createTime: '2025-01-01 00:00:00',
    updateTime: '2025-01-01 00:00:00'
  },
  {
    id: 4,
    name: '普通用户',
    code: 'NORMAL_USER',
    description: '普通用户，只有基本的查看权限',
    permissions: ['111', '121'],
    createTime: '2025-01-01 00:00:00',
    updateTime: '2025-01-01 00:00:00'
  },
  {
    id: 5,
    name: '访客',
    code: 'VISITOR',
    description: '访客用户，只能查看公开信息',
    permissions: ['111'],
    createTime: '2025-01-01 00:00:00',
    updateTime: '2025-01-01 00:00:00'
  }
]);
const total = ref(5);

// 对话框控制
const dialogs = ref({
  role: false,
  permission: false
});

// 当前编辑的角色
const currentRole = ref<Role | null>(null);

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadRoleList();
};

// 加载角色列表
const loadRoleList = () => {
  // 这里实现加载角色列表的逻辑
};

// 新增角色
const handleAdd = () => {
  currentRole.value = null;
  dialogs.value.role = true;
};

// 编辑角色
const handleEdit = (row: Role) => {
  currentRole.value = { ...row };
  dialogs.value.role = true;
};

// 权限设置
const handlePermission = (row: Role) => {
  currentRole.value = { ...row };
  dialogs.value.permission = true;
};

// 删除角色
const handleDelete = (row: Role) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    type: 'warning'
  }).then(() => {
    // 这里实现删除逻辑
    ElMessage.success('删除成功');
    loadRoleList();
  });
};

// 分页大小改变
const handleSizeChange = () => {
  loadRoleList();
};

// 页码改变
const handleCurrentChange = () => {
  loadRoleList();
};

// 操作成功回调
const handleSuccess = () => {
  loadRoleList();
};

// 初始化
loadRoleList();
</script>

<style scoped lang="scss">
.role-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  
  .role-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }
  }

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
    flex: 1;
    margin: 20px 0;
    overflow: hidden;

    :deep(.el-table) {
      height: 100% !important;

      .el-table__body-wrapper {
        height: calc(100% - 40px) !important;
        overflow-y: auto;
      }
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
  }
}
</style> 