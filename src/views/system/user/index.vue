<template>
  <div class="user-container">
    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入用户名/姓名/邮箱"
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
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="userList" border style="width: 100%" height="100%">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="realName" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column label="角色" min-width="150">
            <template #default="{ row }">
              <el-tag
                v-for="role in row.roles"
                :key="role.id"
                size="small"
                style="margin-right: 4px"
              >
                {{ role.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getUserStatusType(row.status)">
                {{ getUserStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="success" link @click="handleAssignRoles(row)">分配角色</el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <user-dialog
      v-model="dialogs.user"
      :user="currentUser"
      @success="handleSuccess"
    />

    <!-- 角色分配对话框 -->
    <role-dialog
      v-model="dialogs.role"
      :user="currentUser"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import pinyin from 'pinyin';
import type { User, UserStatus, PageQuery } from '@/types/system';
import UserDialog from './components/user-dialog.vue';
import RoleDialog from './components/role-dialog.vue';

// 查询参数
const query = ref<PageQuery>({
  page: 1,
  pageSize: 10,
  keyword: ''
});

// 用户列表数据
const userList = ref<User[]>([]);
const total = ref(0);

// 在姓氏列表后添加常用名字列表
const familyNames = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻水云苏潘葛范彭郎鲁韦昌马苗凤花方俞任袁柳鲍史唐费岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计成戴宋茅庞熊纪舒屈项祝董粱杜阮席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田胡凌霍万柯卢莫房缪干解应宗丁宣邓郁单杭洪包诸左石崔吉龚程邢滑裴陆荣翁荀羊甄家封芮储靳邴松井富乌焦巴弓牧隗山谷车侯伊宁仇祖武符刘景詹束龙叶幸司韶黎乔苍双闻莘劳逄姬冉宰桂牛寿通边燕冀尚农温庄晏瞿茹习鱼容向古戈终居衡步都耿满弘国文东殴沃曾关红游盖益桓公晋楚闫';

// 添加常用名字列表
const givenNames = {
  male: [
    '伟', '强', '磊', '军', '洋', '勇', '建华', '志强', '晓东', '明', 
    '建国', '建军', '国强', '志明', '伟业', '文博', '宇轩', '浩然', '泽宇', '明辉',
    '俊杰', '振华', '文轩', '浩宇', '子轩', '宇航', '志远', '俊豪', '子墨', '博文',
    '智勇', '弘毅', '宇泽', '雨泽', '鸿运', '博雅', '博涛', '博超', '博厚', '博达'
  ],
  female: [
    '芳', '娟', '敏', '静', '秀英', '丽', '婷婷', '玲', '小红', '晓燕',
    '雪梅', '佳怡', '梦婷', '欣怡', '思琪', '雨欣', '雨萱', '语嫣', '欣妍', '雅静',
    '雅琪', '雅婷', '雅雯', '雅文', '雅楠', '雅萱', '雅涵', '雅玲', '雅琳', '雅诗',
    '雨婷', '雨晴', '雨彤', '雨桐', '雨童', '雨薇', '雨萍', '雨璇', '雨馨', '雨欣'
  ]
};

// 简单的拼音转换函数
const toPinyin = (chinese: string) => {
  // 简单的姓氏拼音映射
  const nameMap: Record<string, string> = {
    '赵': 'zhao', '钱': 'qian', '孙': 'sun', '李': 'li', '周': 'zhou', 
    '吴': 'wu', '郑': 'zheng', '王': 'wang', '冯': 'feng', '陈': 'chen',
    '张': 'zhang', '刘': 'liu', '杨': 'yang', '黄': 'huang', '胡': 'hu',
    '林': 'lin', '郭': 'guo', '马': 'ma', '罗': 'luo', '梁': 'liang'
  };

  const firstName = chinese.charAt(0);
  return (nameMap[firstName] || 'user') + Math.floor(Math.random() * 1000);
};

// 修改生成测试数据部分的姓名生成逻辑
const generateTestData = () => {
  const data: User[] = [
    {
      id: 1,
      username: 'admin',
      realName: '系统管理员',
      email: 'admin@example.com',
      phone: '13800138000',
      roles: [{ id: 1, name: '超级管理员', code: 'SUPER_ADMIN', description: '', permissions: [], createTime: '', updateTime: '' }],
      status: 'active',
      createTime: '2025-02-26 18:51:19',  // 修改这里
      updateTime: '2025-02-26 18:51:19'   // 修改这里
    }
  ];

  // 生成更多测试数据
  for (let i = 2; i <= 100; i++) {
    // 随机生成姓名
    const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
    const isMale = Math.random() < 0.6; // 60%概率是男性
    const nameList = isMale ? givenNames.male : givenNames.female;
    const givenName = nameList[Math.floor(Math.random() * nameList.length)];
    const realName = familyName + givenName;
    
    // 随机生成手机号
    const phone = `1${[3,4,5,6,7,8,9][Math.floor(Math.random() * 7)]}${Array(9).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`;
    
    // 随机分配角色
    const roleId = Math.floor(Math.random() * 4) + 2; // 2-5之间的随机数
    const roleMap = {
      2: { id: 2, name: '系统管理员', code: 'SYSTEM_ADMIN' },
      3: { id: 3, name: '运营管理员', code: 'OPERATION_ADMIN' },
      4: { id: 4, name: '普通用户', code: 'NORMAL_USER' },
      5: { id: 5, name: '访客', code: 'VISITOR' }
    };
    
    // 修改创建时间生成逻辑
    const date = new Date('2025-02-26 18:51:19');
    date.setDate(date.getDate() - (i - 1));  // 每条数据递减一天
    const createTime = date.toISOString().replace('T', ' ').substring(0, 19);
    
    data.push({
      id: i,
      username: `user${String(i).padStart(3, '0')}`,
      realName,
      email: `${toPinyin(realName)}@example.com`,
      phone,
      roles: [{ 
        ...roleMap[roleId as keyof typeof roleMap],
        description: '',
        permissions: [],
        createTime: '',
        updateTime: ''
      }],
      status: ['active', 'active', 'active', 'inactive', 'locked'][Math.floor(Math.random() * 5)],
      createTime,
      updateTime: createTime
    });
  }

  // 按创建时间倒序排序
  return data.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
};

// 所有测试数据
const allTestData = generateTestData();

// 加载用户列表
const loadUserList = () => {
  // 模拟分页和搜索
  const { page, pageSize, keyword } = query.value;
  
  // 根据关键字筛选
  let filteredData = allTestData;
  if (keyword) {
    const loweredKeyword = keyword.toLowerCase();
    filteredData = allTestData.filter(item => 
      item.username.toLowerCase().includes(loweredKeyword) || 
      item.realName.includes(keyword) || 
      item.email.toLowerCase().includes(loweredKeyword) ||
      item.phone.includes(keyword)
    );
  }
  
  // 更新总数
  total.value = filteredData.length;
  
  // 分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  userList.value = filteredData.slice(start, end);
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadUserList();
};

// 新增用户
const handleAdd = () => {
  currentUser.value = null;
  dialogs.value.user = true;
};

// 编辑用户
const handleEdit = (row: User) => {
  currentUser.value = { ...row };
  dialogs.value.user = true;
};

// 分配角色
const handleAssignRoles = (row: User) => {
  currentUser.value = { ...row };
  dialogs.value.role = true;
};

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    type: 'warning'
  }).then(() => {
    // 这里实现删除逻辑
    ElMessage.success('删除成功');
    loadUserList();
  });
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  query.value.pageSize = size;
  query.value.page = 1;  // 切换每页数量时重置为第一页
  loadUserList();
};

// 页码改变
const handleCurrentChange = (page: number) => {
  query.value.page = page;
  loadUserList();
};

// 操作成功回调
const handleSuccess = () => {
  loadUserList();
};

// 用户状态显示
const getUserStatusType = (status: UserStatus) => {
  const map: Record<UserStatus, string> = {
    active: 'success',
    inactive: 'info',
    locked: 'danger'
  };
  return map[status];
};

const getUserStatusText = (status: UserStatus) => {
  const map: Record<UserStatus, string> = {
    active: '正常',
    inactive: '禁用',
    locked: '锁定'
  };
  return map[status];
};

// 对话框控制
const dialogs = ref({
  user: false,
  role: false
});

// 当前编辑的用户
const currentUser = ref<User | null>(null);

// 初始化
loadUserList();
</script>

<style scoped lang="scss">
.user-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  
  .user-card {
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