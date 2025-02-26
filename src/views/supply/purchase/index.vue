<template>
  <div class="purchase-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入采购单号/供应商"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.status" placeholder="采购状态" clearable style="width: 120px">
              <el-option label="待审核" value="pending" />
              <el-option label="已审核" value="approved" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
            <el-date-picker
              v-model="query.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增采购单</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="purchaseList" border style="width: 100%" height="100%">
          <el-table-column prop="code" label="采购单号" width="180" />
          <el-table-column prop="supplier" label="供应商" />
          <el-table-column prop="amount" label="采购金额" width="120">
            <template #default="{ row }">
              ¥{{ row.amount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'pending'" 
                link 
                type="primary" 
                @click="handleApprove(row)"
              >
                审核
              </el-button>
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
              <el-button 
                v-if="row.status === 'pending'" 
                link 
                type="danger" 
                @click="handleCancel(row)"
              >
                取消
              </el-button>
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
      v-model="dialogs.view"
      title="采购单详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="采购单号">{{ currentRow.code }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ currentRow.supplier }}</el-descriptions-item>
        <el-descriptions-item label="采购金额">¥{{ currentRow.amount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">
            {{ getStatusText(currentRow.status) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider>采购明细</el-divider>

      <el-table :data="currentRow.items" border style="width: 100%">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="quantity" label="数量" width="120" />
        <el-table-column prop="price" label="单价" width="150">
          <template #default="{ row }">
            ¥{{ row.price?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="150">
          <template #default="{ row }">
            ¥{{ (row.price * row.quantity)?.toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
  dateRange: []
});

// 采购列表
const purchaseList = ref([
  {
    id: 1,
    code: 'CG202403200001',
    supplier: '发那科（中国）有限公司',
    amount: 1568000.00,
    createTime: '2025-02-20 09:30:00',
    status: 'completed',
    items: [
      { name: '工业机器人本体', quantity: 5, price: 286000.00 },
      { name: '控制系统', quantity: 5, price: 27600.00 }
    ]
  },
  {
    id: 2,
    code: 'CG202403200002',
    supplier: '安川（中国）机器人有限公司',
    amount: 986000.00,
    createTime: '2025-02-20 10:15:00',
    status: 'approved',
    items: [
      { name: '四轴机器人', quantity: 4, price: 246500.00 }
    ]
  },
  {
    id: 3,
    code: 'CG202403200003',
    supplier: '库卡机器人（上海）有限公司',
    amount: 1286000.00,
    createTime: '2025-02-20 11:30:00',
    status: 'pending',
    items: [
      { name: '协作机器人', quantity: 3, price: 428666.67 }
    ]
  },
  {
    id: 4,
    code: 'CG202403200004',
    supplier: '西门子（中国）有限公司',
    amount: 568000.00,
    createTime: '2025-02-20 13:45:00',
    status: 'pending',
    items: [
      { name: '伺服驱动器', quantity: 50, price: 8960.00 },
      { name: '伺服电机', quantity: 50, price: 2400.00 }
    ]
  },
  {
    id: 5,
    code: 'CG202403200005',
    supplier: '基恩士（中国）有限公司',
    amount: 386000.00,
    createTime: '2025-02-20 14:30:00',
    status: 'pending',
    items: [
      { name: '视觉传感器', quantity: 30, price: 12866.67 }
    ]
  },
  {
    id: 6,
    code: 'CG202403200006',
    supplier: 'ATI工业自动化',
    amount: 256000.00,
    createTime: '2025-02-20 15:10:00',
    status: 'pending',
    items: [
      { name: '力矩传感器', quantity: 20, price: 12800.00 }
    ]
  },
  {
    id: 7,
    code: 'CG202403200007',
    supplier: '欧姆龙（中国）有限公司',
    amount: 328000.00,
    createTime: '2025-02-20 15:45:00',
    status: 'pending',
    items: [
      { name: '安全光栅', quantity: 40, price: 5200.00 },
      { name: '安全控制器', quantity: 20, price: 6800.00 }
    ]
  },
  {
    id: 8,
    code: 'CG202403200008',
    supplier: '倍加福工业自动化（中国）有限公司',
    amount: 198000.00,
    createTime: '2025-02-20 16:00:00',
    status: 'pending',
    items: [
      { name: '激光测距传感器', quantity: 25, price: 7920.00 }
    ]
  },
  {
    id: 9,
    code: 'CG202403200009',
    supplier: '施耐德电气（中国）有限公司',
    amount: 436000.00,
    createTime: '2025-02-20 16:15:00',
    status: 'pending',
    items: [
      { name: '工业交换机', quantity: 20, price: 12800.00 },
      { name: '工业电源', quantity: 50, price: 3600.00 }
    ]
  },
  {
    id: 10,
    code: 'CG202403200010',
    supplier: '图尔克（天津）传感器有限公司',
    amount: 156000.00,
    createTime: '2025-02-20 16:30:00',
    status: 'pending',
    items: [
      { name: '接近传感器', quantity: 200, price: 780.00 }
    ]
  },
  {
    id: 11,
    code: 'CG202403200011',
    supplier: '邦纳工程国际有限公司',
    amount: 245000.00,
    createTime: '2025-02-20 16:45:00',
    status: 'pending',
    items: [
      { name: '光电传感器', quantity: 150, price: 1633.33 }
    ]
  },
  {
    id: 12,
    code: 'CG202403200012',
    supplier: '菲尼克斯（中国）投资有限公司',
    amount: 168000.00,
    createTime: '2025-02-20 17:00:00',
    status: 'pending',
    items: [
      { name: '端子排', quantity: 2000, price: 84.00 }
    ]
  },
  {
    id: 13,
    code: 'CG202403200013',
    supplier: '魏德米勒电联接（上海）有限公司',
    amount: 186000.00,
    createTime: '2025-02-20 17:15:00',
    status: 'pending',
    items: [
      { name: '接线端子', quantity: 3000, price: 62.00 }
    ]
  },
  {
    id: 14,
    code: 'CG202403200014',
    supplier: '贝加莱工业自动化（中国）有限公司',
    amount: 486000.00,
    createTime: '2025-02-20 17:30:00',
    status: 'pending',
    items: [
      { name: '工业PC', quantity: 15, price: 32400.00 }
    ]
  },
  {
    id: 15,
    code: 'CG202403200015',
    supplier: '三菱电机自动化（中国）有限公司',
    amount: 658000.00,
    createTime: '2025-02-20 17:45:00',
    status: 'pending',
    items: [
      { name: 'PLC控制器', quantity: 20, price: 18600.00 },
      { name: '触摸屏', quantity: 20, price: 14300.00 }
    ]
  },
  {
    id: 16,
    code: 'CG202403200016',
    supplier: '易格斯（上海）有限公司',
    amount: 235000.00,
    createTime: '2025-02-20 18:00:00',
    status: 'pending',
    items: [
      { name: '拖链', quantity: 50, price: 4700.00 }
    ]
  },
  {
    id: 17,
    code: 'CG202403200017',
    supplier: '堡盟电子（上海）有限公司',
    amount: 298000.00,
    createTime: '2025-02-20 18:15:00',
    status: 'pending',
    items: [
      { name: '编码器', quantity: 100, price: 2980.00 }
    ]
  },
  {
    id: 18,
    code: 'CG202403200018',
    supplier: '威图电子机械技术（上海）有限公司',
    amount: 486000.00,
    createTime: '2025-02-20 18:30:00',
    status: 'pending',
    items: [
      { name: '控制柜', quantity: 30, price: 16200.00 }
    ]
  },
  {
    id: 19,
    code: 'CG202403200019',
    supplier: '雷尼绍（上海）贸易有限公司',
    amount: 568000.00,
    createTime: '2025-02-20 18:45:00',
    status: 'pending',
    items: [
      { name: '光栅尺', quantity: 40, price: 14200.00 }
    ]
  },
  {
    id: 20,
    code: 'CG202403200020',
    supplier: '康耐视视觉检测系统（上海）有限公司',
    amount: 486000.00,
    createTime: '2025-02-20 19:00:00',
    status: 'pending',
    items: [
      { name: '工业相机', quantity: 20, price: 15800.00 },
      { name: '镜头', quantity: 20, price: 8500.00 }
    ]
  }
]);

// 总数
const total = ref(100);

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'primary',
    completed: 'success',
    cancelled: 'info'
  };
  return map[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadPurchaseList();
};

// 加载采购列表
const loadPurchaseList = () => {
  // 这里应该调用API获取数据
  console.log('加载采购列表:', query.value);
};

// 新增采购单
const handleAdd = () => {
  console.log('新增采购单');
};

// 审核采购单
const handleApprove = (row: any) => {
  ElMessageBox.confirm(
    '确定要审核通过该采购单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('审核采购单:', row);
    ElMessage.success('审核成功');
  }).catch(() => {});
};

// 查看采购单
const handleView = (row: any) => {
  currentRow.value = row;
  dialogs.view = true;
};

// 取消采购单
const handleCancel = (row: any) => {
  ElMessageBox.confirm(
    '确定要取消该采购单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('取消采购单:', row);
    ElMessage.success('取消成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadPurchaseList();
};

// 页码改变
const handleCurrentChange = () => {
  loadPurchaseList();
};

const dialogs = reactive({
  view: false
});

const currentRow = ref({});
</script>

<style scoped lang="scss">
.purchase-container {
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
}
</style> 