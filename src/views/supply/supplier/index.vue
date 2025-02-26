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
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增供应商</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="supplierList" border style="width: 100%" height="100%">
          <el-table-column prop="name" label="供应商名称" />
          <el-table-column prop="contact" label="联系人" width="120" />
          <el-table-column prop="phone" label="联系电话" width="120" />
          <el-table-column prop="address" label="地址" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '正常' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: ''
});

// 供应商列表
const supplierList = ref([
  {
    id: 1,
    name: '发那科（中国）有限公司',
    contact: '王经理',
    phone: '021-50580888',
    address: '上海市宝山区富联三路1号',
    status: 'active'
  },
  {
    id: 2,
    name: '安川（中国）机器人有限公司',
    contact: '李工',
    phone: '0510-85217888',
    address: '江苏省无锡市新区长江路18号',
    status: 'active'
  },
  {
    id: 3,
    name: '库卡机器人（上海）有限公司',
    contact: '张总',
    phone: '021-20509888',
    address: '上海市松江区申港路1号',
    status: 'active'
  },
  {
    id: 4,
    name: '西门子（中国）有限公司',
    contact: '刘经理',
    phone: '010-64765888',
    address: '北京市朝阳区望京中环南路7号',
    status: 'active'
  },
  {
    id: 5,
    name: '基恩士（中国）有限公司',
    contact: '陈工',
    phone: '021-54961001',
    address: '上海市闵行区申长路988号',
    status: 'active'
  },
  {
    id: 6,
    name: 'ATI工业自动化',
    contact: '赵经理',
    phone: '0512-87861888',
    address: '江苏省苏州市工业园区星汉街5号',
    status: 'active'
  },
  {
    id: 7,
    name: '欧姆龙（中国）有限公司',
    contact: '孙工',
    phone: '021-50509988',
    address: '上海市浦东新区金桥路1398号',
    status: 'active'
  },
  {
    id: 8,
    name: '倍加福工业自动化（中国）有限公司',
    contact: '吴经理',
    phone: '010-58549988',
    address: '北京市朝阳区酒仙桥路10号',
    status: 'active'
  },
  {
    id: 9,
    name: '施耐德电气（中国）有限公司',
    contact: '郑总',
    phone: '010-84346688',
    address: '北京市朝阳区望京东路6号',
    status: 'active'
  },
  {
    id: 10,
    name: '图尔克（天津）传感器有限公司',
    contact: '钱工',
    phone: '022-83988188',
    address: '天津市西青经济开发区兴华四支路18号',
    status: 'active'
  },
  {
    id: 11,
    name: '邦纳工程国际有限公司',
    contact: '周经理',
    phone: '021-54430123',
    address: '上海市闵行区虹中路263号',
    status: 'active'
  },
  {
    id: 12,
    name: '菲尼克斯（中国）投资有限公司',
    contact: '胡工',
    phone: '025-85800888',
    address: '江苏省南京市江宁区将军大道9号',
    status: 'active'
  },
  {
    id: 13,
    name: '魏德米勒电联接（上海）有限公司',
    contact: '朱经理',
    phone: '021-22195555',
    address: '上海市松江区光华路888号',
    status: 'active'
  },
  {
    id: 14,
    name: '贝加莱工业自动化（中国）有限公司',
    contact: '杨工',
    phone: '021-54644800',
    address: '上海市闵行区剑川路951号',
    status: 'active'
  },
  {
    id: 15,
    name: '三菱电机自动化（中国）有限公司',
    contact: '许总',
    phone: '021-23223300',
    address: '上海市长宁区虹桥路1386号',
    status: 'active'
  },
  {
    id: 16,
    name: '易格斯（上海）有限公司',
    contact: '何工',
    phone: '021-51303100',
    address: '上海市奉贤区环城东路123号',
    status: 'active'
  },
  {
    id: 17,
    name: '堡盟电子（上海）有限公司',
    contact: '马经理',
    phone: '021-64956888',
    address: '上海市徐汇区枫林路485号',
    status: 'active'
  },
  {
    id: 18,
    name: '威图电子机械技术（上海）有限公司',
    contact: '林工',
    phone: '021-37198888',
    address: '上海市青浦区华新镇华隆路1825号',
    status: 'active'
  },
  {
    id: 19,
    name: '雷尼绍（上海）贸易有限公司',
    contact: '黄经理',
    phone: '021-61760123',
    address: '上海市嘉定区菊园新区永盛路2889号',
    status: 'active'
  },
  {
    id: 20,
    name: '康耐视视觉检测系统（上海）有限公司',
    contact: '徐工',
    phone: '021-33588550',
    address: '上海市浦东新区张江高科技园区科苑路399号',
    status: 'active'
  }
]);

// 总数
const total = ref(100);

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadSupplierList();
};

// 加载供应商列表
const loadSupplierList = () => {
  // 这里应该调用API获取数据
  console.log('加载供应商列表:', query.value);
};

// 新增供应商
const handleAdd = () => {
  console.log('新增供应商');
};

// 编辑供应商
const handleEdit = (row: any) => {
  console.log('编辑供应商:', row);
};

// 删除供应商
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该供应商吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除供应商:', row);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadSupplierList();
};

// 页码改变
const handleCurrentChange = () => {
  loadSupplierList();
};
</script>

<style scoped lang="scss">
.supplier-container {
  padding: 20px;

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
    height: calc(100vh - 250px);
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
  }
}
</style> 