<template>
  <div class="supplier-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入供应商名称/联系人"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px">
              <el-option label="正常" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增供应商</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="supplierList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="供应商编码" width="120" />
          <el-table-column prop="name" label="供应商名称" min-width="200" />
          <el-table-column prop="contact" label="联系人" width="120" />
          <el-table-column prop="phone" label="联系电话" width="150" />
          <el-table-column prop="email" label="电子邮箱" width="200" />
          <el-table-column prop="address" label="地址" min-width="300" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <a @click="handleEdit(row)">编辑</a>
                <a @click="handleView(row)">查看</a>
                <a class="danger" @click="handleDelete(row)">删除</a>
              </div>
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

    <!-- 供应商表单对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.type === 'add' ? '新增供应商' : dialog.type === 'edit' ? '编辑供应商' : '供应商详情'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="dialog.type === 'view'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入供应商编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="正常" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            :rows="3"
            placeholder="请输入地址"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button 
          v-if="dialog.type !== 'view'" 
          type="primary" 
          @click="handleSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 查询条件
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: ''
});

// 供应商列表
const supplierList = ref([
  {
    id: 1,
    code: 'GYS001',
    name: '发那科（中国）有限公司',
    contact: '王明华',
    phone: '021-50580888',
    email: 'zhangsan@fanuc.com',
    address: '上海市浦东新区张江高科技园区',
    status: 'active',
    remark: '主要供应商'
  },
  {
    id: 2,
    code: 'GYS002',
    name: '安川（中国）机器人有限公司',
    contact: '李志强',
    phone: '0510-85217888',
    email: 'lisi@yaskawa.com',
    address: '上海市松江区松江工业区',
    status: 'active',
    remark: '战略合作伙伴'
  },
  {
    id: 3,
    code: 'GYS003',
    name: '库卡机器人（上海）有限公司',
    contact: '张伟',
    phone: '021-20509888',
    email: 'wangwu@kuka.com',
    address: '上海市松江区申港路1号',
    status: 'active',
    remark: '核心供应商'
  },
  {
    id: 4,
    code: 'GYS004',
    name: '西门子（中国）有限公司',
    contact: '刘建国',
    phone: '010-64765888',
    email: 'zhaoliu@siemens.com',
    address: '北京市朝阳区望京中环南路7号',
    status: 'active',
    remark: '重要合作伙伴'
  },
  {
    id: 5,
    code: 'GYS005',
    name: '基恩士（中国）有限公司',
    contact: '陈建华',
    phone: '021-54961001',
    email: 'qianqi@keyence.com',
    address: '上海市闵行区申长路988号',
    status: 'inactive',
    remark: '传感器供应商'
  },
  {
    id: 6,
    code: 'GYS006',
    name: 'ATI工业自动化',
    contact: '赵德明',
    phone: '0512-87861888',
    email: 'sunba@ati.com',
    address: '江苏省苏州市工业园区星汉街5号',
    status: 'active',
    remark: '末端执行器供应商'
  },
  {
    id: 7,
    code: 'GYS007',
    name: '欧姆龙（中国）有限公司',
    contact: '孙志远',
    phone: '021-50509988',
    email: 'zhoujiu@omron.com',
    address: '上海市浦东新区金桥路1398号',
    status: 'active',
    remark: '传感器供应商'
  },
  {
    id: 8,
    code: 'GYS008',
    name: '倍加福工业自动化（中国）有限公司',
    contact: '吴国强',
    phone: '010-58549988',
    email: 'wushi@pepperl-fuchs.com',
    address: '北京市朝阳区酒仙桥路10号',
    status: 'active',
    remark: '传感器供应商'
  },
  {
    id: 9,
    code: 'GYS009',
    name: '施耐德电气（中国）有限公司',
    contact: '郑光明',
    phone: '010-84346688',
    email: 'zheng11@schneider.com',
    address: '北京市朝阳区望京东路6号',
    status: 'active',
    remark: '电气元件供应商'
  },
  {
    id: 10,
    code: 'GYS010',
    name: '图尔克（天津）传感器有限公司',
    contact: '钱学明',
    phone: '022-83988188',
    email: 'wang12@turck.com',
    address: '天津市西青经济开发区兴华四支路18号',
    status: 'inactive',
    remark: '传感器供应商'
  },
  {
    id: 11,
    code: 'GYS011',
    name: '邦纳工程国际有限公司',
    contact: '周德胜',
    phone: '021-54430123',
    email: 'li13@banner.com',
    address: '上海市闵行区虹中路263号',
    status: 'active',
    remark: '传感器供应商'
  },
  {
    id: 12,
    code: 'GYS012',
    name: '菲尼克斯（中国）投资有限公司',
    contact: '胡志强',
    phone: '025-85800888',
    email: 'zhang14@phoenix.com',
    address: '江苏省南京市江宁区将军大道9号',
    status: 'active',
    remark: '电气元件供应商'
  },
  {
    id: 13,
    code: 'GYS013',
    name: '魏德米勒电联接（上海）有限公司',
    contact: '朱建华',
    phone: '021-22195555',
    email: 'liu15@weidmuller.com',
    address: '上海市松江区光华路888号',
    status: 'active',
    remark: '电气元件供应商'
  },
  {
    id: 14,
    code: 'GYS014',
    name: '贝加莱工业自动化（中国）有限公司',
    contact: '杨德明',
    phone: '021-54644800',
    email: 'chen16@br-automation.com',
    address: '上海市闵行区剑川路951号',
    status: 'active',
    remark: '控制系统供应商'
  },
  {
    id: 15,
    code: 'GYS015',
    name: '三菱电机自动化（中国）有限公司',
    contact: '许志远',
    phone: '021-23223300',
    email: 'yang17@mitsubishi.com',
    address: '上海市长宁区虹桥路1386号',
    status: 'active',
    remark: '控制系统供应商'
  },
  {
    id: 16,
    code: 'GYS016',
    name: '易格斯（上海）有限公司',
    contact: '何国强',
    phone: '021-51303100',
    email: 'huang18@igus.com',
    address: '上海市奉贤区环城东路123号',
    status: 'active',
    remark: '机械配件供应商'
  },
  {
    id: 17,
    code: 'GYS017',
    name: '堡盟电子（上海）有限公司',
    contact: '马光明',
    phone: '021-64956888',
    email: 'zhao19@baumer.com',
    address: '上海市徐汇区枫林路485号',
    status: 'active',
    remark: '传感器供应商'
  },
  {
    id: 18,
    code: 'GYS018',
    name: '威图电子机械技术（上海）有限公司',
    contact: '林学明',
    phone: '021-37198888',
    email: 'zhou20@rittal.com',
    address: '上海市青浦区华新镇华隆路1825号',
    status: 'active',
    remark: '机柜供应商'
  },
  {
    id: 19,
    code: 'GYS019',
    name: '雷尼绍（上海）贸易有限公司',
    contact: '黄德胜',
    phone: '021-61760123',
    email: 'wu21@renishaw.com',
    address: '上海市嘉定区菊园新区永盛路2889号',
    status: 'active',
    remark: '测量设备供应商'
  },
  {
    id: 20,
    code: 'GYS020',
    name: '康耐视视觉检测系统（上海）有限公司',
    contact: '徐志强',
    phone: '021-33588550',
    email: 'zheng22@cognex.com',
    address: '上海市浦东新区张江高科技园区科苑路399号',
    status: 'active',
    remark: '视觉系统供应商'
  }
]);

const total = ref(100);

// 对话框状态
const dialog = reactive({
  visible: false,
  type: 'add' as 'add' | 'edit' | 'view'
});

// 表单数据
const form = reactive({
  code: '',
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  status: 'active',
  remark: ''
});

// 表单规则
const rules = reactive<FormRules>({
  code: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
});

const formRef = ref<FormInstance>();

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadData();
};

// 加载数据
const loadData = () => {
  // TODO: 调用API获取数据
  console.log('加载供应商列表:', query.value);
};

// 新增供应商
const handleAdd = () => {
  dialog.type = 'add';
  Object.assign(form, {
    code: '',
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    status: 'active',
    remark: ''
  });
  dialog.visible = true;
};

// 编辑供应商
const handleEdit = (row: any) => {
  dialog.type = 'edit';
  Object.assign(form, row);
  dialog.visible = true;
};

// 查看供应商
const handleView = (row: any) => {
  dialog.type = 'view';
  Object.assign(form, row);
  dialog.visible = true;
};

// 切换状态
const handleToggleStatus = (row: any) => {
  const action = row.status === 'active' ? '禁用' : '启用';
  ElMessageBox.confirm(
    `确定要${action}该供应商吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = row.status === 'active' ? 'inactive' : 'active';
    ElMessage.success(`${action}成功`);
  }).catch(() => {});
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialog.type === 'add') {
        supplierList.value.unshift({
          id: supplierList.value.length + 1,
          ...form,
          createTime: new Date().toLocaleString()
        });
        ElMessage.success('添加成功');
      } else {
        const index = supplierList.value.findIndex(item => item.id === form.id);
        if (index !== -1) {
          Object.assign(supplierList.value[index], form);
          ElMessage.success('修改成功');
        }
      }
      dialog.visible = false;
    }
  });
};

// 分页
const handleSizeChange = () => {
  loadData();
};

const handleCurrentChange = () => {
  loadData();
};
</script>

<style scoped lang="scss">
.supplier-container {
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

  :deep(.operation-buttons) {
    display: flex;
    gap: 8px;
    
    a {
      color: var(--el-color-primary);
      cursor: pointer;
      
      &:hover {
        color: var(--el-color-primary-light-3);
      }
      
      &.danger {
        color: var(--el-color-danger);
        
        &:hover {
          color: var(--el-color-danger-light-3);
        }
      }
      
      &.success {
        color: var(--el-color-success);
        
        &:hover {
          color: var(--el-color-success-light-3);
        }
      }
    }
  }
}
</style> 