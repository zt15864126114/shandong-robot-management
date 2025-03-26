<template>
  <div class="accounting-container">
    <!-- 统计概览卡片 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月收入</span>
              <el-tag type="success">+12.5%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">¥2,586,000.00</div>
            <div class="compare">较上月：¥2,300,000.00</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月支出</span>
              <el-tag type="danger">+8.2%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">¥1,856,000.00</div>
            <div class="compare">较上月：¥1,716,000.00</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月结余</span>
              <el-tag type="success">+15.8%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">¥730,000.00</div>
            <div class="compare">较上月：¥584,000.00</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待处理报销</span>
              <el-tag type="warning">4笔</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">¥12,860.00</div>
            <div class="compare">较上月：-2笔</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>收支趋势</span>
              <el-radio-group v-model="trendType" size="small">
                <el-radio-button label="month">月度</el-radio-button>
                <el-radio-button label="quarter">季度</el-radio-button>
                <el-radio-button label="year">年度</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里将使用ECharts展示趋势图 -->
            <div ref="trendChart" style="height: 300px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>支出类型分布</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里将使用ECharts展示饼图 -->
            <div ref="pieChart" style="height: 300px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 部门支出统计 -->
    <el-card shadow="hover" class="department-stats">
      <template #header>
        <div class="card-header">
          <span>部门支出统计</span>
        </div>
      </template>
      <el-table :data="departmentStats" border style="width: 100%">
        <el-table-column prop="department" label="部门" width="180" />
        <el-table-column prop="budget" label="预算" width="120">
          <template #default="{ row }">
            ¥{{ row.budget.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="expense" label="实际支出" width="120">
          <template #default="{ row }">
            ¥{{ row.expense.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="percentage" label="使用率" width="180">
          <template #default="{ row }">
            <el-progress 
              :percentage="row.percentage" 
              :status="row.percentage > 90 ? 'exception' : row.percentage > 80 ? 'warning' : 'success'"
            />
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="趋势">
          <template #default="{ row }">
            <span :class="row.trend >= 0 ? 'up' : 'down'">
              {{ row.trend >= 0 ? '+' : '' }}{{ row.trend }}%
            </span>
            较上月
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 收支记录列表 -->
    <el-card shadow="hover" class="transaction-list">
      <template #header>
        <div class="card-header">
          <span>收支记录</span>
          <div class="header-right">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
        </div>
      </template>
      <el-table :data="transactionList" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'income' ? 'success' : 'danger'">
              {{ row.type === 'income' ? '收入' : '支出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span :class="row.type === 'income' ? 'income' : 'expense'">
              {{ row.type === 'income' ? '+' : '-' }}¥{{ row.amount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="description" label="说明" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
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
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { ElMessageBox, ElMessage } from 'element-plus';

// 趋势图类型
const trendType = ref('month');

// 日期范围
const dateRange = ref([]);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 部门支出统计
const departmentStats = ref([
  {
    department: '销售部',
    budget: 500000,
    expense: 486000,
    percentage: 97,
    trend: 5.2
  },
  {
    department: '技术部',
    budget: 300000,
    expense: 285000,
    percentage: 95,
    trend: -2.1
  },
  {
    department: '市场部',
    budget: 200000,
    expense: 198000,
    percentage: 99,
    trend: 8.5
  },
  {
    department: '行政部',
    budget: 100000,
    expense: 95000,
    percentage: 95,
    trend: -1.2
  },
  {
    department: '财务部',
    budget: 80000,
    expense: 75000,
    percentage: 94,
    trend: 3.4
  }
]);

// 收支记录列表
const transactionList = ref([
  {
    date: '2025-03-20',
    type: 'income',
    category: '销售收入',
    amount: 586000,
    department: '销售部',
    description: '青岛客户项目收款',
    operator: '刘明阳'
  },
  {
    date: '2025-03-19',
    type: 'expense',
    category: '采购支出',
    amount: 342000,
    department: '技术部',
    description: '设备采购付款',
    operator: '张志强'
  },
  {
    date: '2025-03-18',
    type: 'income',
    category: '销售收入',
    amount: 468000,
    department: '销售部',
    description: '济南客户项目收款',
    operator: '陈海波'
  },
  {
    date: '2025-03-17',
    type: 'expense',
    category: '报销支出',
    amount: 12860,
    department: '市场部',
    description: '差旅费报销',
    operator: '王建国'
  },
  {
    date: '2025-03-16',
    type: 'expense',
    category: '办公支出',
    amount: 5600,
    department: '行政部',
    description: '办公用品采购',
    operator: '赵明'
  }
]);

// 趋势图实例
let trendChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChart) return;
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['收入', '支出']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: [2100000, 2300000, 2586000, 2800000, 3000000, 3200000],
        itemStyle: {
          color: '#67C23A'
        }
      },
      {
        name: '支出',
        type: 'line',
        data: [1500000, 1716000, 1856000, 1900000, 2000000, 2100000],
        itemStyle: {
          color: '#F56C6C'
        }
      }
    ]
  };
  
  trendChart.setOption(option);
};

// 初始化饼图
const initPieChart = () => {
  if (!pieChart) return;
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 500000, name: '设备采购' },
          { value: 300000, name: '人工成本' },
          { value: 200000, name: '差旅费' },
          { value: 150000, name: '办公用品' },
          { value: 100000, name: '其他支出' }
        ]
      }
    ]
  };
  
  pieChart.setOption(option);
};

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索条件:', dateRange.value);
};

// 分页大小改变
const handleSizeChange = () => {
  // TODO: 实现分页逻辑
  console.log('分页大小改变:', pageSize.value);
};

// 页码改变
const handleCurrentChange = () => {
  // TODO: 实现分页逻辑
  console.log('页码改变:', currentPage.value);
};

// 监听趋势图类型变化
watch(trendType, () => {
  // TODO: 根据类型更新趋势图数据
  console.log('趋势图类型改变:', trendType.value);
});

// 编辑记录
const handleEdit = (row: any) => {
  console.log('编辑记录:', row);
  // TODO: 实现编辑逻辑
};

// 删除记录
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除这条记录吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    console.log('删除记录:', row);
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功');
  }).catch(() => {
    // 取消删除
  });
};

// 新增记录
const handleAdd = () => {
  console.log('新增记录');
  // TODO: 实现新增逻辑
};

// 组件挂载时初始化图表
onMounted(() => {
  const trendChartDom = document.getElementById('trendChart');
  const pieChartDom = document.getElementById('pieChart');
  
  if (trendChartDom) {
    trendChart = echarts.init(trendChartDom);
    initTrendChart();
  }
  
  if (pieChartDom) {
    pieChart = echarts.init(pieChartDom);
    initPieChart();
  }
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    trendChart?.resize();
    pieChart?.resize();
  });
});
</script>

<style scoped lang="scss">
.accounting-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  .overview-cards {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-content {
      text-align: center;
      
      .amount {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .compare {
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;
    
    .chart-container {
      height: 300px;
    }
  }

  .department-stats {
    margin-bottom: 20px;
    
    .up {
      color: var(--el-color-success);
    }
    
    .down {
      color: var(--el-color-danger);
    }
  }

  .transaction-list {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-right {
        display: flex;
        gap: 16px;
      }
    }
    
    .income {
      color: var(--el-color-success);
    }
    
    .expense {
      color: var(--el-color-danger);
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style> 