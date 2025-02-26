<template>
  <div class="enterprise-container">
    <el-loading v-if="loading" />
    
    <el-tabs v-model="activeTab">
      <!-- 企业基本信息 -->
      <el-tab-pane label="企业基本信息" name="basic">
        <el-card v-loading="loading">
          <template #header>
            <div class="card-header">
              <span>企业基本信息</span>
              <el-button type="primary" @click="handleEditInfo">编辑信息</el-button>
            </div>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="企业名称">{{ enterpriseInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="法定代表人">{{ enterpriseInfo.legalPerson }}</el-descriptions-item>
            <el-descriptions-item label="注册号">{{ enterpriseInfo.registrationNumber }}</el-descriptions-item>
            <el-descriptions-item label="注册资本">{{ enterpriseInfo.registeredCapital }}万元</el-descriptions-item>
            <el-descriptions-item label="成立日期">{{ enterpriseInfo.foundingDate }}</el-descriptions-item>
            <el-descriptions-item label="企业状态">
              <el-tag :type="enterpriseInfo.status === 'active' ? 'success' : 'danger'">
                {{ enterpriseInfo.status === 'active' ? '正常经营' : '已停业' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ enterpriseInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="电子邮箱">{{ enterpriseInfo.email }}</el-descriptions-item>
            <el-descriptions-item label="企业地址" :span="2">{{ enterpriseInfo.address }}</el-descriptions-item>
            <el-descriptions-item label="经营范围" :span="2">{{ enterpriseInfo.businessScope }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-tab-pane>

      <!-- 部门管理 -->
      <el-tab-pane label="部门管理" name="department">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>部门列表</span>
              <el-button type="primary" @click="handleAddDepartment">新增部门</el-button>
            </div>
          </template>
          
          <el-table :data="departmentList" border style="width: 100%">
            <el-table-column prop="name" label="部门名称" />
            <el-table-column prop="manager" label="负责人" />
            <el-table-column prop="employeeCount" label="人数" width="80" />
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditDepartment(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteDepartment(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 员工管理 -->
      <el-tab-pane label="员工管理" name="employee">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="left">
                <el-select
                  v-model="employeeQuery.departmentId"
                  placeholder="选择部门"
                  clearable
                  @change="loadEmployeeList"
                >
                  <el-option
                    v-for="dept in departmentList"
                    :key="dept.id"
                    :label="dept.name"
                    :value="dept.id"
                  />
                </el-select>
                <el-input
                  v-model="employeeQuery.keyword"
                  placeholder="搜索姓名/工号"
                  style="width: 200px; margin-left: 10px;"
                  clearable
                  @clear="loadEmployeeList"
                  @keyup.enter="loadEmployeeList"
                >
                  <template #append>
                    <el-button :icon="Search" @click="loadEmployeeList" />
                  </template>
                </el-input>
              </div>
              <el-button type="primary" @click="handleAddEmployee">新增员工</el-button>
            </div>
          </template>
          
          <el-table :data="employeeList" border style="width: 100%">
            <el-table-column prop="employeeNo" label="工号" width="100" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column label="部门" width="120">
              <template #default="{ row }">
                {{ departmentList.find(d => d.id === row.departmentId)?.name }}
              </template>
            </el-table-column>
            <el-table-column prop="position" label="职位" width="120" />
            <el-table-column prop="phone" label="手机号" width="120" />
            <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getEmployeeStatusType(row.status)">
                  {{ getEmployeeStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditEmployee(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteEmployee(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="employeeQuery.page"
              v-model:page-size="employeeQuery.pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              @size-change="loadEmployeeList"
              @current-change="loadEmployeeList"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 各种弹窗组件 -->
    <enterprise-info-dialog
      v-model="dialogs.info"
      :info="enterpriseInfo"
      @success="loadEnterpriseInfo"
    />
    
    <department-dialog
      v-model="dialogs.department"
      :department="currentDepartment"
      @success="loadDepartmentList"
    />
    
    <employee-dialog
      v-model="dialogs.employee"
      :employee="currentEmployee"
      :department-list="departmentList"
      @success="loadEmployeeList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import type { EnterpriseInfo, Department, Employee } from '@/types/enterprise';
import { enterpriseInfo as staticEnterpriseInfo, departments as staticDepartments, employees as staticEmployees } from '@/data/enterprise';
import EnterpriseInfoDialog from './components/enterprise-info-dialog.vue'
import DepartmentDialog from './components/department-dialog.vue'
import EmployeeDialog from './components/employee-dialog.vue'

// 标签页控制
const activeTab = ref('basic');

// 企业信息
const enterpriseInfo = ref<EnterpriseInfo>(staticEnterpriseInfo);
const loading = ref(false);

// 部门列表
const departmentList = ref<Department[]>(staticDepartments);

// 员工列表
const employeeList = ref<Employee[]>([]);
const total = ref(0);
const employeeQuery = ref({
  page: 1,
  pageSize: 10,
  departmentId: undefined,
  keyword: ''
});

// 加载员工列表
const loadEmployeeList = () => {
  let filteredList = [...staticEmployees];
  
  if (employeeQuery.value.departmentId) {
    filteredList = filteredList.filter(item => 
      item.departmentId === employeeQuery.value.departmentId
    );
  }
  
  if (employeeQuery.value.keyword) {
    const keyword = employeeQuery.value.keyword.toLowerCase();
    filteredList = filteredList.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.employeeNo.toLowerCase().includes(keyword)
    );
  }
  
  total.value = filteredList.length;
  const start = (employeeQuery.value.page - 1) * employeeQuery.value.pageSize;
  const end = start + employeeQuery.value.pageSize;
  employeeList.value = filteredList.slice(start, end);
};

// 弹窗控制
const dialogs = ref({
  info: false,
  department: false,
  employee: false
});

const currentDepartment = ref<Department | null>(null);
const currentEmployee = ref<Employee | null>(null);

// 企业信息操作
const handleEditInfo = () => {
  dialogs.value.info = true;
};

// 部门操作
const handleAddDepartment = () => {
  currentDepartment.value = null;
  dialogs.value.department = true;
};

const handleEditDepartment = (row: Department) => {
  currentDepartment.value = { ...row };
  dialogs.value.department = true;
};

const handleDeleteDepartment = (row: Department) => {
  ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
    type: 'warning'
  }).then(() => {
    const index = departmentList.value.findIndex(item => item.id === row.id);
    if (index > -1) {
      departmentList.value.splice(index, 1);
      ElMessage.success('删除成功');
    }
  });
};

// 员工操作
const handleAddEmployee = () => {
  currentEmployee.value = null;
  dialogs.value.employee = true;
};

const handleEditEmployee = (row: Employee) => {
  currentEmployee.value = { ...row };
  dialogs.value.employee = true;
};

const handleDeleteEmployee = (row: Employee) => {
  ElMessageBox.confirm('确定要删除该员工吗？', '提示', {
    type: 'warning'
  }).then(() => {
    const index = employeeList.value.findIndex(item => item.id === row.id);
    if (index > -1) {
      employeeList.value.splice(index, 1);
      ElMessage.success('删除成功');
      loadEmployeeList();
    }
  });
};

// 员工状态显示
const getEmployeeStatusType = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    inactive: 'danger',
    leave: 'info'
  };
  return map[status] || 'info';
};

const getEmployeeStatusText = (status: string) => {
  const map: Record<string, string> = {
    active: '在职',
    inactive: '离职',
    leave: '请假'
  };
  return map[status] || '未知';
};

// 初始化
onMounted(() => {
  loadEmployeeList();
});
</script>

<style scoped lang="scss">
.enterprise-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .left {
      display: flex;
      align-items: center;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 