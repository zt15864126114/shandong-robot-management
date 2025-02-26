<template>
  <div class="employee-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入姓名/工号"
              style="width: 200px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.department" placeholder="所属部门" clearable style="width: 180px">
              <el-option
                v-for="dept in departments"
                :key="dept.value"
                :label="dept.label"
                :value="dept.value"
              />
            </el-select>
            <el-select v-model="query.position" placeholder="职位" clearable style="width: 150px">
              <el-option label="工程师" value="engineer" />
              <el-option label="主管" value="supervisor" />
              <el-option label="经理" value="manager" />
              <el-option label="总监" value="director" />
            </el-select>
            <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px">
              <el-option label="在职" value="active" />
              <el-option label="离职" value="resigned" />
              <el-option label="试用期" value="probation" />
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增员工</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="employeeList" border style="width: 100%" height="100%">
          <el-table-column prop="employeeNo" label="工号" width="120" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="department" label="所属部门" width="150" />
          <el-table-column prop="position" label="职位" width="120" />
          <el-table-column prop="phone" label="联系电话" width="150" />
          <el-table-column prop="email" label="邮箱" min-width="200" />
          <el-table-column prop="joinTime" label="入职时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button 
                link 
                type="danger" 
                @click="handleDelete(row)"
                v-if="row.status === 'active'"
              >离职</el-button>
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

    <!-- 员工详情对话框 -->
    <el-dialog
      title="员工详情"
      v-model="dialogs.detail"
      width="800px"
    >
      <el-descriptions :column="2" border v-if="currentEmployee">
        <el-descriptions-item label="工号">{{ currentEmployee.employeeNo }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentEmployee.name }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ currentEmployee.department }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ currentEmployee.position }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentEmployee.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentEmployee.email }}</el-descriptions-item>
        <el-descriptions-item label="入职时间">{{ currentEmployee.joinTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentEmployee.status)">
            {{ getStatusText(currentEmployee.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ currentEmployee.idCard }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ currentEmployee.birthday }}</el-descriptions-item>
        <el-descriptions-item label="学历">{{ currentEmployee.education }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ currentEmployee.major }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系人">{{ currentEmployee.emergencyContact }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系电话">{{ currentEmployee.emergencyPhone }}</el-descriptions-item>
        <el-descriptions-item label="居住地址" :span="2">{{ currentEmployee.address }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentEmployee.remark || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 员工表单对话框 -->
    <el-dialog
      :title="currentEmployee ? '编辑员工' : '新增员工'"
      v-model="dialogs.form"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工号" prop="employeeNo">
              <el-input v-model="form.employeeNo" placeholder="请输入工号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
                <el-option
                  v-for="dept in departments"
                  :key="dept.value"
                  :label="dept.label"
                  :value="dept.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-select v-model="form.position" placeholder="请选择职位" style="width: 100%">
                <el-option label="工程师" value="engineer" />
                <el-option label="主管" value="supervisor" />
                <el-option label="经理" value="manager" />
                <el-option label="总监" value="director" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 其他表单项... -->
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogs.form = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 部门选项
const departments = [
  { label: '总经理办公室', value: 'GM-OFFICE' },
  { label: '研发中心', value: 'RD-CENTER' },
  { label: '机器人研发部', value: 'RD-ROBOT' },
  { label: '软件开发部', value: 'RD-SOFTWARE' },
  { label: '生产制造中心', value: 'PM-CENTER' },
  { label: '生产部', value: 'PM-PROD' },
  { label: '质量部', value: 'PM-QC' }
];

// 查询参数
const query = ref({
  keyword: '',
  department: '',
  position: '',
  status: '',
  page: 1,
  pageSize: 20
});

// 总数
const total = ref(100);

// 对话框控制
const dialogs = ref({
  detail: false,
  form: false
});

// 当前选中的员工
const currentEmployee = ref();

// 表单数据
const form = ref({
  employeeNo: '',
  name: '',
  department: '',
  position: '',
  phone: '',
  email: '',
  status: 'active'
});

// 表单校验规则
const rules = {
  employeeNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请选择职位', trigger: 'change' }]
};

// 员工列表数据
const employeeList = ref([
  {
    id: 1,
    employeeNo: 'EMP001',
    name: '王志远',
    department: '总经理办公室',
    position: '总经理',
    phone: '13900139000',
    email: 'wangzy@shandong-robot.com',
    joinTime: '2023-01-01',
    status: 'active',
    idCard: '370100198001011234',
    birthday: '1980-01-01',
    education: '博士',
    major: '机械工程',
    address: '济南市历下区',
    emergencyContact: '王女士',
    emergencyPhone: '13911111111'
  },
  {
    id: 2,
    employeeNo: 'EMP002',
    name: '李明',
    department: '研发中心',
    position: '总监',
    phone: '13900139001',
    email: 'liming@shandong-robot.com',
    joinTime: '2023-02-01',
    status: 'active',
    idCard: '370100198203121234',
    birthday: '1982-03-12',
    education: '硕士',
    major: '机器人工程',
    address: '济南市高新区',
    emergencyContact: '李先生',
    emergencyPhone: '13922222222'
  },
  {
    id: 3,
    employeeNo: 'EMP003',
    name: '张工',
    department: '机器人研发部',
    position: '主管',
    phone: '13900139002',
    email: 'zhang@shandong-robot.com',
    joinTime: '2023-03-15',
    status: 'active',
    idCard: '370100198505151234',
    birthday: '1985-05-15',
    education: '硕士',
    major: '控制工程',
    address: '济南市天桥区',
    emergencyContact: '张女士',
    emergencyPhone: '13933333333'
  },
  {
    id: 4,
    employeeNo: 'EMP004',
    name: '刘芳',
    department: '软件开发部',
    position: '主管',
    phone: '13900139003',
    email: 'liuf@shandong-robot.com',
    joinTime: '2023-04-01',
    status: 'active',
    idCard: '370100198707071234',
    birthday: '1987-07-07',
    education: '本科',
    major: '软件工程',
    address: '济南市槐荫区',
    emergencyContact: '刘先生',
    emergencyPhone: '13944444444'
  },
  {
    id: 5,
    employeeNo: 'EMP005',
    name: '周强',
    department: '生产制造中心',
    position: '总监',
    phone: '13900139004',
    email: 'zhouq@shandong-robot.com',
    joinTime: '2023-03-01',
    status: 'active',
    idCard: '370100198404041234',
    birthday: '1984-04-04',
    education: '硕士',
    major: '机械制造',
    address: '济南市历城区',
    emergencyContact: '周女士',
    emergencyPhone: '13955555555'
  },
  {
    id: 6,
    employeeNo: 'EMP006',
    name: '吴工',
    department: '质量部',
    position: '主管',
    phone: '13900139005',
    email: 'wu@shandong-robot.com',
    joinTime: '2023-05-01',
    status: 'active',
    idCard: '370100198606061234',
    birthday: '1986-06-06',
    education: '本科',
    major: '质量工程',
    address: '济南市市中区',
    emergencyContact: '吴先生',
    emergencyPhone: '13966666666'
  },
  {
    id: 7,
    employeeNo: 'EMP007',
    name: '赵工',
    department: '机器人研发部',
    position: '工程师',
    phone: '13900139006',
    email: 'zhao@shandong-robot.com',
    joinTime: '2023-07-01',
    status: 'probation',
    idCard: '370100199001011234',
    birthday: '1990-01-01',
    education: '硕士',
    major: '机器人工程',
    address: '济南市历下区',
    emergencyContact: '赵女士',
    emergencyPhone: '13977777777'
  },
  {
    id: 8,
    employeeNo: 'EMP008',
    name: '孙工',
    department: '软件开发部',
    position: '工程师',
    phone: '13900139007',
    email: 'sun@shandong-robot.com',
    joinTime: '2023-06-15',
    status: 'resigned',
    idCard: '370100199202021234',
    birthday: '1992-02-02',
    education: '本科',
    major: '计算机科学',
    address: '济南市天桥区',
    emergencyContact: '孙先生',
    emergencyPhone: '13988888888'
  },
  {
    id: 9,
    employeeNo: 'EMP009',
    name: '陈工',
    department: '机器人研发部',
    position: '工程师',
    phone: '13900139008',
    email: 'chen@shandong-robot.com',
    joinTime: '2023-08-01',
    status: 'probation',
    idCard: '370100199303031234',
    birthday: '1993-03-03',
    education: '硕士',
    major: '机械电子工程',
    address: '济南市历下区',
    emergencyContact: '陈先生',
    emergencyPhone: '13999999999'
  },
  {
    id: 10,
    employeeNo: 'EMP010',
    name: '郭工',
    department: '软件开发部',
    position: '工程师',
    phone: '13900139009',
    email: 'guo@shandong-robot.com',
    joinTime: '2023-08-15',
    status: 'probation',
    idCard: '370100199404041234',
    birthday: '1994-04-04',
    education: '本科',
    major: '人工智能',
    address: '济南市高新区',
    emergencyContact: '郭女士',
    emergencyPhone: '13900000001'
  },
  {
    id: 11,
    employeeNo: 'EMP011',
    name: '杨工',
    department: '生产部',
    position: '主管',
    phone: '13900139010',
    email: 'yang@shandong-robot.com',
    joinTime: '2023-03-01',
    status: 'active',
    idCard: '370100198808081234',
    birthday: '1988-08-08',
    education: '本科',
    major: '机械制造',
    address: '济南市槐荫区',
    emergencyContact: '杨先生',
    emergencyPhone: '13900000002'
  },
  {
    id: 12,
    employeeNo: 'EMP012',
    name: '马工',
    department: '质量部',
    position: '工程师',
    phone: '13900139011',
    email: 'ma@shandong-robot.com',
    joinTime: '2023-04-01',
    status: 'active',
    idCard: '370100199505051234',
    birthday: '1995-05-05',
    education: '本科',
    major: '测控技术',
    address: '济南市市中区',
    emergencyContact: '马女士',
    emergencyPhone: '13900000003'
  },
  {
    id: 13,
    employeeNo: 'EMP013',
    name: '韩工',
    department: '机器人研发部',
    position: '工程师',
    phone: '13900139012',
    email: 'han@shandong-robot.com',
    joinTime: '2023-05-15',
    status: 'active',
    idCard: '370100199606061234',
    birthday: '1996-06-06',
    education: '硕士',
    major: '控制工程',
    address: '济南市历城区',
    emergencyContact: '韩先生',
    emergencyPhone: '13900000004'
  },
  {
    id: 14,
    employeeNo: 'EMP014',
    name: '朱工',
    department: '软件开发部',
    position: '工程师',
    phone: '13900139013',
    email: 'zhu@shandong-robot.com',
    joinTime: '2023-06-01',
    status: 'active',
    idCard: '370100199707071234',
    birthday: '1997-07-07',
    education: '本科',
    major: '软件工程',
    address: '济南市天桥区',
    emergencyContact: '朱女士',
    emergencyPhone: '13900000005'
  },
  {
    id: 15,
    employeeNo: 'EMP015',
    name: '秦工',
    department: '生产部',
    position: '工程师',
    phone: '13900139014',
    email: 'qin@shandong-robot.com',
    joinTime: '2023-07-01',
    status: 'active',
    idCard: '370100199808081234',
    birthday: '1998-08-08',
    education: '本科',
    major: '机械工程',
    address: '济南市历下区',
    emergencyContact: '秦先生',
    emergencyPhone: '13900000006'
  },
  {
    id: 16,
    employeeNo: 'EMP016',
    name: '许工',
    department: '质量部',
    position: '工程师',
    phone: '13900139015',
    email: 'xu@shandong-robot.com',
    joinTime: '2023-07-15',
    status: 'active',
    idCard: '370100199909091234',
    birthday: '1999-09-09',
    education: '本科',
    major: '质量工程',
    address: '济南市高新区',
    emergencyContact: '许女士',
    emergencyPhone: '13900000007'
  },
  {
    id: 17,
    employeeNo: 'EMP017',
    name: '何工',
    department: '机器人研发部',
    position: '工程师',
    phone: '13900139016',
    email: 'he@shandong-robot.com',
    joinTime: '2023-08-01',
    status: 'probation',
    idCard: '370100199010101234',
    birthday: '1990-10-10',
    education: '硕士',
    major: '机器人工程',
    address: '济南市槐荫区',
    emergencyContact: '何先生',
    emergencyPhone: '13900000008'
  },
  {
    id: 18,
    employeeNo: 'EMP018',
    name: '曹工',
    department: '软件开发部',
    position: '工程师',
    phone: '13900139017',
    email: 'cao@shandong-robot.com',
    joinTime: '2023-08-15',
    status: 'probation',
    idCard: '370100199111111234',
    birthday: '1991-11-11',
    education: '本科',
    major: '计算机科学',
    address: '济南市市中区',
    emergencyContact: '曹女士',
    emergencyPhone: '13900000009'
  }
]);

// 获取状态样式
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    resigned: 'info',
    probation: 'warning'
  };
  return map[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    active: '在职',
    resigned: '离职',
    probation: '试用期'
  };
  return map[status] || '未知';
};

// 搜索
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索条件：', query.value);
};

// 重置查询
const resetQuery = () => {
  query.value = {
    keyword: '',
    department: '',
    position: '',
    status: '',
    page: 1,
    pageSize: 20
  };
  handleSearch();
};

// 查看员工
const handleView = (row: any) => {
  currentEmployee.value = row;
  dialogs.value.detail = true;
};

// 编辑员工
const handleEdit = (row: any) => {
  currentEmployee.value = row;
  form.value = { ...row };
  dialogs.value.form = true;
};

// 新增员工
const handleAdd = () => {
  currentEmployee.value = undefined;
  form.value = {
    employeeNo: '',
    name: '',
    department: '',
    position: '',
    phone: '',
    email: '',
    status: 'active'
  };
  dialogs.value.form = true;
};

// 员工离职
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确认将员工"${row.name}"设置为离职状态吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('操作成功');
  });
};

// 提交表单
const handleSubmit = () => {
  ElMessage.success('保存成功');
  dialogs.value.form = false;
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  query.value.pageSize = size;
  query.value.page = 1;
  handleSearch();
};

// 页码改变
const handleCurrentChange = (page: number) => {
  query.value.page = page;
  handleSearch();
};
</script>

<style scoped lang="scss">
.employee-container {
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
    height: calc(100vh - 240px);
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style> 