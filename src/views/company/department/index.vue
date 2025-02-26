<template>
  <div class="department-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="keyword"
              placeholder="请输入部门名称"
              style="width: 200px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="keyword = ''">重置</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增部门</el-button>
        </div>
      </template>

      <div class="content">
        <div class="tree-container">
          <el-tree
            ref="treeRef"
            :data="departmentTree"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ data.name }}</span>
                <span class="actions">
                  <el-button link type="primary" @click.stop="handleEdit(data)">编辑</el-button>
                  <el-button 
                    link 
                    type="danger" 
                    @click.stop="handleDelete(node, data)"
                    v-if="!data.children?.length"
                  >
                    删除
                  </el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </div>

        <div class="detail-container" v-if="currentDept">
          <h3>{{ currentDept.name }}</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="部门编码">{{ currentDept.code }}</el-descriptions-item>
            <el-descriptions-item label="负责人">{{ currentDept.manager }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentDept.createTime }}</el-descriptions-item>
            <el-descriptions-item label="部门人数">{{ currentDept.memberCount }}人</el-descriptions-item>
            <el-descriptions-item label="部门描述" :span="2">{{ currentDept.description }}</el-descriptions-item>
          </el-descriptions>

          <div class="section-title">部门成员</div>
          <el-table :data="currentDept.members" border style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="position" label="职位" width="150" />
            <el-table-column prop="phone" label="联系电话" width="150" />
            <el-table-column prop="email" label="邮箱" min-width="200" />
            <el-table-column prop="joinTime" label="入职时间" width="180" />
          </el-table>
        </div>
      </div>
    </el-card>

    <!-- 部门表单对话框 -->
    <el-dialog
      :title="currentDept ? '编辑部门' : '新增部门'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级部门">
          <el-tree-select
            v-model="form.parentId"
            :data="departmentTree"
            :props="defaultProps"
            check-strictly
            node-key="id"
            placeholder="请选择上级部门"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="form.manager" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-form-item label="部门描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入部门描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
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
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type';

interface Department {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  manager: string;
  description: string;
  createTime: string;
  memberCount: number;
  members?: Member[];
  children?: Department[];
}

interface Member {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  joinTime: string;
}

interface DepartmentForm {
  parentId: number | null;
  name: string;
  code: string;
  manager: string;
  description: string;
}

// 部门树数据
const departmentTree = ref<Department[]>([
  {
    id: 1,
    name: '总经理办公室',
    code: 'GM-OFFICE',
    parentId: null,
    manager: '王志远',
    description: '负责公司整体战略规划和运营管理',
    createTime: '2023-01-01',
    memberCount: 5,
    members: [
      {
        id: 1,
        name: '王志远',
        position: '总经理',
        phone: '13800138001',
        email: 'wangzy@shandong-robot.com',
        joinTime: '2023-01-01'
      }
    ]
  },
  {
    id: 2,
    name: '研发中心',
    code: 'RD-CENTER',
    parentId: null,
    manager: '李明',
    description: '负责公司产品研发和技术创新',
    createTime: '2023-01-01',
    memberCount: 45,
    children: [
      {
        id: 21,
        name: '机器人研发部',
        code: 'RD-ROBOT',
        parentId: 2,
        manager: '张工',
        description: '负责工业机器人、服务机器人等产品研发',
        createTime: '2023-01-01',
        memberCount: 25
      },
      {
        id: 22,
        name: '软件开发部',
        code: 'RD-SOFTWARE',
        parentId: 2,
        manager: '刘工',
        description: '负责机器人控制系统、应用软件开发',
        createTime: '2023-01-01',
        memberCount: 20
      }
    ]
  },
  {
    id: 3,
    name: '生产制造中心',
    code: 'PM-CENTER',
    parentId: null,
    manager: '赵强',
    description: '负责产品生产制造和质量管理',
    createTime: '2023-01-01',
    memberCount: 120,
    children: [
      {
        id: 31,
        name: '生产部',
        code: 'PM-PROD',
        parentId: 3,
        manager: '周工',
        description: '负责产品生产和装配',
        createTime: '2023-01-01',
        memberCount: 80
      },
      {
        id: 32,
        name: '质量部',
        code: 'PM-QC',
        parentId: 3,
        manager: '吴工',
        description: '负责产品质量检验和控制',
        createTime: '2023-01-01',
        memberCount: 40
      }
    ]
  }
]);

const defaultProps = {
  children: 'children',
  label: 'name'
};

// 搜索关键词
const keyword = ref('');

// 当前选中的部门
const currentDept = ref<Department>();

// 对话框控制
const dialogVisible = ref(false);

// 表单数据
const form = ref<DepartmentForm>({
  parentId: null,
  name: '',
  code: '',
  manager: '',
  description: ''
});

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
};

// 搜索
const handleSearch = () => {
  // 实现搜索逻辑
  ElMessage.success('搜索：' + keyword.value);
};

// 节点点击
const handleNodeClick = (data: Department) => {
  currentDept.value = data;
};

// 新增部门
const handleAdd = () => {
  form.value = {
    parentId: null,
    name: '',
    code: '',
    manager: '',
    description: ''
  };
  dialogVisible.value = true;
};

// 编辑部门
const handleEdit = (data: Department) => {
  form.value = {
    parentId: data.parentId,
    name: data.name,
    code: data.code,
    manager: data.manager,
    description: data.description
  };
  dialogVisible.value = true;
};

// 删除部门
const handleDelete = (node: TreeNodeData, data: Department) => {
  ElMessageBox.confirm(
    `确认删除部门"${data.name}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功');
  });
};

// 提交表单
const handleSubmit = () => {
  ElMessage.success('保存成功');
  dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.department-container {
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

  .content {
    display: flex;
    gap: 20px;
    margin-top: 20px;

    .tree-container {
      width: 300px;
      border-right: 1px solid #dcdfe6;
      padding-right: 20px;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        .actions {
          opacity: 0;
          transition: opacity 0.3s;
        }

        &:hover .actions {
          opacity: 1;
        }
      }
    }

    .detail-container {
      flex: 1;
      
      h3 {
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: bold;
      }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0;
        padding-left: 10px;
        border-left: 4px solid #409EFF;
      }
    }
  }
}
</style> 