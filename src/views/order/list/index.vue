<template>
  <div class="order-container">
    <!-- 顶部数据卡片 -->
    <div class="summary-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <h3>订单总数</h3>
            <div class="number">1,286</div>
            <div class="trend up">
              <el-icon><ArrowUp /></el-icon>
              8.5%
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <h3>订单金额</h3>
            <div class="number">¥15,862,500</div>
            <div class="trend up">
              <el-icon><ArrowUp /></el-icon>
              12.3%
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <h3>待处理订单</h3>
            <div class="number warning">86</div>
            <div class="trend down">
              <el-icon><ArrowDown /></el-icon>
              5.2%
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <h3>完成率</h3>
            <div class="number">96.8%</div>
            <div class="trend up">
              <el-icon><ArrowUp /></el-icon>
              2.1%
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索和表格卡片 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入订单号/客户名称"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.type" placeholder="产品类型" clearable style="width: 180px">
              <el-option label="工业机器人" value="industrial" />
              <el-option label="服务机器人" value="service" />
              <el-option label="特种机器人" value="special" />
              <el-option label="协作机器人" value="cooperative" />
            </el-select>
            <el-select v-model="query.status" placeholder="订单状态" clearable style="width: 120px">
              <el-option label="待付款" value="unpaid" />
              <el-option label="待发货" value="unshipped" />
              <el-option label="已发货" value="shipped" />
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
            <el-button @click="resetQuery">重置</el-button>
          </div>
          <el-button type="primary" @click="handleAdd">新增订单</el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="orderList" border style="width: 100%" height="100%">
          <el-table-column prop="orderNo" label="订单编号" width="180" />
          <el-table-column prop="customer" label="客户名称" width="180" />
          <el-table-column prop="productType" label="产品类型" width="120" />
          <el-table-column prop="productModel" label="产品型号" width="120" />
          <el-table-column prop="amount" label="订单金额" width="150">
            <template #default="{ row }">
              ¥{{ formatNumber(row.amount) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="订单状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="deliveryTime" label="交付时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button 
                link 
                type="danger" 
                @click="handleCancel(row)"
                v-if="row.status === 'unpaid'"
              >取消</el-button>
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

    <!-- 订单表单对话框 -->
    <order-dialog
      v-model="dialogs.order"
      :order="currentOrder"
      @success="handleSuccess"
    />

    <!-- 订单详情对话框 -->
    <order-detail
      v-model="dialogs.detail"
      :order="currentOrder"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Order, OrderStatus, OrderQuery } from '@/types/order';
import OrderDialog from '../components/order-dialog.vue';
import OrderDetail from '../components/order-detail.vue';

// 查询参数
const query = ref<OrderQuery>({
  page: 1,
  pageSize: 10,
  keyword: '',
  type: '',
  status: undefined,
  dateRange: undefined
});

// 订单列表数据
const orderList = ref<Order[]>([]);
const total = ref(0);

// 对话框控制
const dialogs = ref({
  order: false,
  detail: false
});

// 当前编辑的订单
const currentOrder = ref<Order>();

// 生成测试数据
const generateTestData = () => {
  const data: Order[] = [];
  const statuses: OrderStatus[] = ['unpaid', 'unshipped', 'shipped', 'completed', 'cancelled'];
  
  // 生成随机时间
  const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  // 获取90天前的日期
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  
  // 客户列表
  const customers = [
    '山东重工',
    '青岛港',
    '济南医院',
    '潍柴动力',
    '浪潮集团',
    '海尔集团',
    '中国重汽',
    '山东钢铁',
    '齐鲁制药',
    '东营石化'
  ];
  
  // 产品列表
  const products = [
    {
      type: '工业机器人',
      models: ['AR-150', 'AR-200', 'AR-300', 'AR-500']
    },
    {
      type: '服务机器人',
      models: ['SR-100', 'SR-200', 'SR-300']
    },
    {
      type: '特种机器人',
      models: ['SP-150', 'SP-200', 'SP-300']
    },
    {
      type: '协作机器人',
      models: ['CR-50', 'CR-100', 'CR-150']
    }
  ];

  for (let i = 1; i <= 100; i++) {
    // 随机选择产品类型和型号
    const productType = products[Math.floor(Math.random() * products.length)];
    const productModel = productType.models[Math.floor(Math.random() * productType.models.length)];
    
    // 根据型号生成价格（示例：AR-150 -> 150万）
    const basePrice = parseInt(productModel.split('-')[1]) * 10000;
    const amount = basePrice + Math.floor(Math.random() * 50000);

    const createDate = getRandomDate(startDate, new Date());
    
    // 生成订单号：年月日 + 4位序号
    const orderNo = `ORD${createDate.getFullYear()}${String(createDate.getMonth() + 1).padStart(2, '0')}${String(createDate.getDate()).padStart(2, '0')}${String(i).padStart(4, '0')}`;
    
    data.push({
      id: i,
      orderNo,
      customer: customers[Math.floor(Math.random() * customers.length)],
      productType: productType.type,
      productModel,
      amount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createTime: createDate.toISOString().replace('T', ' ').substring(0, 19),
      updateTime: createDate.toISOString().replace('T', ' ').substring(0, 19),
      payTime: status !== 'unpaid' ? new Date(createDate.getTime() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : null,
      shipTime: ['shipped', 'completed'].includes(status) ? new Date(createDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : null,
      completeTime: status === 'completed' ? new Date(createDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : null,
      deliveryTime: new Date(createDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  return data.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
};

// 所有测试数据
const allTestData = generateTestData();

// 加载订单列表
const loadOrderList = () => {
  const { page, pageSize, keyword, dateRange, status } = query.value;
  
  // 根据条件筛选
  let filteredData = allTestData;
  
  if (keyword) {
    const loweredKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.orderNo.toLowerCase().includes(loweredKeyword) || 
      item.customer.includes(keyword)
    );
  }
  
  if (dateRange) {
    const [start, end] = dateRange;
    filteredData = filteredData.filter(item => {
      const date = new Date(item.createTime);
      return date >= start && date <= end;
    });
  }
  
  if (status) {
    filteredData = filteredData.filter(item => item.status === status);
  }
  
  // 更新总数
  total.value = filteredData.length;
  
  // 分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  orderList.value = filteredData.slice(start, end);
};

// 获取订单状态样式
const getStatusType = (status: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    unpaid: 'warning',
    unshipped: 'primary',
    shipped: 'success',
    completed: 'success',
    cancelled: 'info'
  };
  return map[status];
};

// 获取订单状态文本
const getStatusText = (status: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    unpaid: '待付款',
    unshipped: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status];
};

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadOrderList();
};

// 重置查询
const resetQuery = () => {
  query.value = {
    page: 1,
    pageSize: 10,
    keyword: '',
    type: '',
    status: undefined,
    dateRange: undefined
  };
  loadOrderList();
};

// 查看订单
const handleView = (row: Order) => {
  currentOrder.value = row;
  dialogs.value.detail = true;
};

// 编辑订单
const handleEdit = (row: Order) => {
  currentOrder.value = row;
  dialogs.value.order = true;
};

// 取消订单
const handleCancel = (row: Order) => {
  ElMessageBox.confirm(
    '确定要取消该订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('取消订单:', row);
    ElMessage.success('订单已取消');
    loadOrderList();
  }).catch(() => {});
};

// 新增订单
const handleAdd = () => {
  currentOrder.value = undefined;
  dialogs.value.order = true;
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  query.value.pageSize = size;
  query.value.page = 1;
  loadOrderList();
};

// 页码改变
const handleCurrentChange = (page: number) => {
  query.value.page = page;
  loadOrderList();
};

// 操作成功回调
const handleSuccess = () => {
  loadOrderList();
};

// 初始化
loadOrderList();
</script>

<style scoped lang="scss">
.order-container {
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

  .summary-cards {
    margin-bottom: 20px;

    .data-card {
      text-align: center;
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #666;
      }
      
      .number {
        margin: 12px 0;
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;

        &.warning {
          color: #E6A23C;
        }
      }

      .trend {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 14px;
        
        &.up {
          color: #67C23A;
        }
        
        &.down {
          color: #F56C6C;
        }
      }
    }
  }

  .table-container {
    margin: 20px 0;
    height: calc(100vh - 460px);
    
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