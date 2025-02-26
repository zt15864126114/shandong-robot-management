<template>
  <div class="customer-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入客户名称/联系人/电话"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.level" placeholder="客户等级" clearable style="width: 120px">
              <el-option label="普通客户" value="normal" />
              <el-option label="VIP客户" value="vip" />
              <el-option label="重点客户" value="important" />
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增客户</el-button>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>总客户数</h3>
              <div class="number">{{ stats.total }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>本月新增</h3>
              <div class="number up">+{{ stats.newMonth }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>VIP客户</h3>
              <div class="number">{{ stats.vip }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>重点客户</h3>
              <div class="number">{{ stats.important }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="customerList" border style="width: 100%" height="100%">
          <el-table-column prop="name" label="客户名称" />
          <el-table-column prop="contact" label="联系人" width="120" />
          <el-table-column prop="phone" label="联系电话" width="120" />
          <el-table-column prop="level" label="客户等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getLevelType(row.level)">
                {{ getLevelText(row.level) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog
      v-model="dialogs.form"
      :title="formType === 'add' ? '新增客户' : '编辑客户'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="客户等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择客户等级" style="width: 100%">
            <el-option label="普通客户" value="normal" />
            <el-option label="VIP客户" value="vip" />
            <el-option label="重点客户" value="important" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.form = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogs.view"
      title="客户详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="客户名称">{{ currentRow.name }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ currentRow.contact }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentRow.phone }}</el-descriptions-item>
        <el-descriptions-item label="客户等级">{{ getLevelText(currentRow.level) }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ currentRow.address }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentRow.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogs.view = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  level: ''
});

// 客户列表
const customerList = ref([
  {
    id: 1,
    name: '山东临工工程机械有限公司',
    contact: '王志远',
    phone: '0539-8785688',
    level: 'vip',
    address: '山东省临沂市经济技术开发区临工路1号',
    createTime: '2025-02-20 10:30:00'
  },
  {
    id: 2,
    name: '青岛海尔生物医疗股份有限公司',
    contact: '李明华',
    phone: '0532-88939999',
    level: 'important',
    address: '山东省青岛市崂山区海尔路1号海尔工业园',
    createTime: '2025-02-20 09:15:00'
  },
  {
    id: 3,
    name: '山东新华医疗器械股份有限公司',
    contact: '张建国',
    phone: '0533-3587777',
    level: 'vip',
    address: '山东省淄博市高新区新华医疗科技园',
    createTime: '2025-02-20 08:45:00'
  },
  {
    id: 4,
    name: '山东港口烟台港集团有限公司',
    contact: '刘海涛',
    phone: '0535-6571234',
    level: 'normal',
    address: '山东省烟台市芝罘区港城东大街18号',
    createTime: '2025-02-20 14:20:00'
  },
  {
    id: 5,
    name: '山东时风(集团)有限责任公司',
    contact: '赵明',
    phone: '0635-3982888',
    level: 'important',
    address: '山东省高唐县时风路1号',
    createTime: '2025-02-20 11:30:00'
  },
  {
    id: 6,
    name: '浪潮电子信息产业股份有限公司',
    contact: '周伟',
    phone: '0531-85106666',
    level: 'vip',
    address: '山东省济南市高新区浪潮路1036号',
    createTime: '2025-02-20 15:45:00'
  },
  {
    id: 7,
    name: '山东魏桥创业集团有限公司',
    contact: '吴志强',
    phone: '0543-2276888',
    level: 'important',
    address: '山东省邹平市魏桥镇魏桥创业园',
    createTime: '2025-02-20 13:10:00'
  },
  {
    id: 8,
    name: '中通客车控股股份有限公司',
    contact: '郑宇',
    phone: '0635-8322332',
    level: 'vip',
    address: '山东省聊城市经济开发区黄河路261号',
    createTime: '2025-02-20 16:25:00'
  },
  {
    id: 9,
    name: '山东晨鸣纸业集团股份有限公司',
    contact: '孙立新',
    phone: '0536-2158008',
    level: 'important',
    address: '山东省寿光市圣城街595号',
    createTime: '2025-02-20 10:50:00'
  },
  {
    id: 10,
    name: '山东东宏管业股份有限公司',
    contact: '陈学军',
    phone: '0537-4928888',
    level: 'normal',
    address: '山东省曲阜市崇文大道6号',
    createTime: '2025-02-20 09:40:00'
  }
]);

// 总数
const total = ref(100);

// 统计数据
const stats = {
  total: 1526,
  newMonth: 85,
  vip: 386,
  important: 245
};

// 获取等级类型
const getLevelType = (level: string) => {
  const map: Record<string, string> = {
    normal: '',
    vip: 'success',
    important: 'warning'
  };
  return map[level] || '';
};

// 获取等级文本
const getLevelText = (level: string) => {
  const map: Record<string, string> = {
    normal: '普通客户',
    vip: 'VIP客户',
    important: '重点客户'
  };
  return map[level] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadCustomerList();
};

// 加载客户列表
const loadCustomerList = () => {
  // 这里应该调用API获取数据
  console.log('加载客户列表:', query.value);
};

// 对话框状态
const dialogs = reactive({
  form: false,
  view: false
});

// 表单类型
const formType = ref<'add' | 'edit'>('add');

// 当前行数据
const currentRow = ref({});

// 表单数据
const form = reactive({
  name: '',
  contact: '',
  phone: '',
  level: '',
  address: ''
});

// 表单规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  level: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();

// 新增客户
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    name: '',
    contact: '',
    phone: '',
    level: '',
    address: ''
  });
  dialogs.form = true;
};

// 编辑客户
const handleEdit = (row: any) => {
  formType.value = 'edit';
  Object.assign(form, {
    name: row.name,
    contact: row.contact,
    phone: row.phone,
    level: row.level,
    address: row.address
  });
  currentRow.value = row;
  dialogs.form = true;
};

// 查看客户
const handleView = (row: any) => {
  currentRow.value = row;
  dialogs.view = true;
};

// 删除客户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该客户吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除客户:', row);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadCustomerList();
};

// 页码改变
const handleCurrentChange = () => {
  loadCustomerList();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API保存数据
      const now = new Date();
      const createTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-');

      if (formType.value === 'add') {
        customerList.value.unshift({
          id: customerList.value.length + 1,
          ...form,
          createTime
        });
        ElMessage.success('添加成功');
      } else {
        Object.assign(currentRow.value, form);
        ElMessage.success('修改成功');
      }
      dialogs.form = false;
    }
  });
};
</script>

<style scoped lang="scss">
.customer-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

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

  .summary-cards {
    margin: 20px 0;

    .data-card {
      text-align: center;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #666;
      }
      
      .number {
        margin-top: 10px;
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;

        &.up {
          color: #67C23A;
        }
      }
    }
  }

  .table-container {
    margin: 20px 0;
    height: 500px;
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
}
</style> 