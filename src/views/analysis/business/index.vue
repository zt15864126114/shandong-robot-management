<template>
  <div class="business-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-select v-model="query.period" placeholder="统计周期" style="width: 120px">
              <el-option label="按日" value="day" />
              <el-option label="按周" value="week" />
              <el-option label="按月" value="month" />
              <el-option label="按年" value="year" />
            </el-select>
            <el-date-picker
              v-model="query.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
          <el-button type="primary" @click="handleExport">导出报表</el-button>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>总营收</h3>
              <div class="number up">¥1,234,567.89</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                12.5%
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>总成本</h3>
              <div class="number down">¥987,654.32</div>
              <div class="trend down">
                <el-icon><ArrowUp /></el-icon>
                8.3%
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>净利润</h3>
              <div class="number up">¥246,913.57</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                15.7%
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>订单数</h3>
              <div class="number">1,234</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                5.2%
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="chart-container">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="chart-wrapper">
              <div class="chart-title">营收趋势</div>
              <div id="revenueChart" style="height: 300px;"></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="chart-wrapper">
              <div class="chart-title">收入构成</div>
              <div id="incomeChart" style="height: 300px;"></div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <div class="chart-wrapper">
              <div class="chart-title">订单分析</div>
              <div id="orderChart" style="height: 300px;"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-wrapper">
              <div class="chart-title">成本分析</div>
              <div id="costChart" style="height: 300px;"></div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="dataList" border style="width: 100%" height="100%">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="revenue" label="营收" width="150">
            <template #default="{ row }">
              <span class="amount-up">¥{{ row.revenue.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="成本" width="150">
            <template #default="{ row }">
              <span class="amount-down">¥{{ row.cost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="profit" label="利润" width="150">
            <template #default="{ row }">
              <span :class="row.profit >= 0 ? 'amount-up' : 'amount-down'">
                ¥{{ row.profit.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="profitRate" label="利润率" width="120">
            <template #default="{ row }">
              <span :class="row.profitRate >= 0 ? 'amount-up' : 'amount-down'">
                {{ row.profitRate.toFixed(2) }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="orderCount" label="订单数" width="100" />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
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
import { ArrowUp } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { onMounted } from 'vue';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  period: 'month',
  dateRange: []
});

// 初始化图表
const initCharts = () => {
  // 营收趋势图
  const revenueChart = echarts.init(document.getElementById('revenueChart'));
  revenueChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['营收', '成本', '利润'] },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '营收',
        type: 'line',
        data: [150, 180, 220, 270, 320, 350],
        smooth: true,
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '成本',
        type: 'line',
        data: [120, 140, 160, 200, 250, 280],
        smooth: true,
        itemStyle: { color: '#F56C6C' }
      },
      {
        name: '利润',
        type: 'line',
        data: [30, 40, 60, 70, 70, 70],
        smooth: true,
        itemStyle: { color: '#67C23A' }
      }
    ]
  });

  // 收入构成图
  const incomeChart = echarts.init(document.getElementById('incomeChart'));
  incomeChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 45, name: '工业机器人' },
          { value: 25, name: '服务机器人' },
          { value: 20, name: '特种机器人' },
          { value: 10, name: '配件及服务' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });

  // 订单分析图
  const orderChart = echarts.init(document.getElementById('orderChart'));
  orderChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['订单数', '完成率'] },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: [
      { type: 'value', name: '订单数' },
      { type: 'value', name: '完成率', max: 100 }
    ],
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: [120, 150, 180, 200, 220, 250]
      },
      {
        name: '完成率',
        type: 'line',
        yAxisIndex: 1,
        data: [85, 88, 90, 92, 95, 96]
      }
    ]
  });

  // 成本分析图
  const costChart = echarts.init(document.getElementById('costChart'));
  costChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 40, name: '原材料' },
          { value: 25, name: '人工' },
          { value: 15, name: '制造费用' },
          { value: 12, name: '研发投入' },
          { value: 8, name: '其他' }
        ]
      }
    ]
  });
};

onMounted(() => {
  initCharts();
});

// 数据列表
const dataList = ref([
  {
    date: '2025-02',
    revenue: 3500000.00,
    cost: 2800000.00,
    profit: 700000.00,
    profitRate: 20.0,
    orderCount: 250,
    remark: '新产品上市'
  },
  {
    date: '2025-02',
    revenue: 3200000.00,
    cost: 2600000.00,
    profit: 600000.00,
    profitRate: 18.75,
    orderCount: 220,
    remark: '正常'
  },
  {
    date: '2025-01',
    revenue: 2800000.00,
    cost: 2300000.00,
    profit: 500000.00,
    profitRate: 17.86,
    orderCount: 180,
    remark: '正常'
  }
]);

// 总数
const total = ref(100);

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadDataList();
};

// 加载数据列表
const loadDataList = () => {
  // 这里应该调用API获取数据
  console.log('加载数据列表:', query.value);
};

// 导出报表
const handleExport = () => {
  ElMessage.success('报表导出成功');
};

// 分页大小改变
const handleSizeChange = () => {
  loadDataList();
};

// 页码改变
const handleCurrentChange = () => {
  loadDataList();
};
</script>

<style scoped lang="scss">
.business-container {
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
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #666;
      }
      
      .number {
        margin: 10px 0;
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;

        &.up {
          color: #67C23A;
        }

        &.down {
          color: #F56C6C;
        }
      }

      .trend {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        &.up {
          color: #67C23A;
        }

        &.down {
          color: #F56C6C;
        }

        .el-icon {
          font-size: 12px;
        }
      }
    }
  }

  .chart-container {
    margin: 20px 0;

    .chart-wrapper {
      background-color: #fff;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      .chart-title {
        font-size: 16px;
        color: #333;
        margin-bottom: 20px;
      }

      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fa;
        color: #909399;
      }
    }
  }

  .table-container {
    margin: 20px 0;
    height: 300px;
    
    :deep(.el-table) {
      height: 100%;
    }

    .amount-up {
      color: #67C23A;
    }

    .amount-down {
      color: #F56C6C;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
}
</style> 