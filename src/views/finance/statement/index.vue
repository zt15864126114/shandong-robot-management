<template>
  <div class="statement-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-select v-model="query.type" placeholder="报表类型" style="width: 120px">
              <el-option label="收支统计" value="income-expense" />
              <el-option label="利润分析" value="profit" />
              <el-option label="现金流量" value="cash-flow" />
            </el-select>
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
          <el-col :span="8">
            <el-card shadow="hover" class="data-card">
              <h3>总收入</h3>
              <div class="number up">¥{{ stats.totalIncome.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="data-card">
              <h3>总支出</h3>
              <div class="number down">¥{{ stats.totalExpense.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="data-card">
              <h3>净利润</h3>
              <div class="number up">¥{{ stats.totalProfit.toFixed(2) }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="chart-container">
        <div class="chart-wrapper">
          <div class="chart-title">收支趋势图</div>
          <div id="trendChart" style="height: 300px;"></div>
        </div>
        <div class="chart-wrapper">
          <div class="chart-title">收入构成</div>
          <div id="incomeChart" style="height: 300px;"></div>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="statementList" border style="width: 100%" height="100%">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="income" label="收入" width="150">
            <template #default="{ row }">
              <span class="amount-up">¥{{ row.income.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="expense" label="支出" width="150">
            <template #default="{ row }">
              <span class="amount-down">¥{{ row.expense.toFixed(2) }}</span>
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  type: 'income-expense',
  period: 'month',
  dateRange: []
});

// 报表数据
const statementList = ref([
  {
    date: '2025-02',
    income: 4358000.00,
    expense: 3137500.00,
    profit: 1220500.00,
    profitRate: 28.0,
    remark: '新产品销售增长'
  },
  {
    date: '2025-02-W4',
    income: 1268000.00,
    expense: 986500.00,
    profit: 281500.00,
    profitRate: 22.2,
    remark: '第四周销售情况良好'
  },
  {
    date: '2025-02-W3',
    income: 1156000.00,
    expense: 856000.00,
    profit: 300000.00,
    profitRate: 25.9,
    remark: '新客户订单增加'
  },
  {
    date: '2025-02-W2',
    income: 985000.00,
    expense: 685000.00,
    profit: 300000.00,
    profitRate: 30.5,
    remark: '成本控制效果显现'
  },
  {
    date: '2025-02-W1',
    income: 949000.00,
    expense: 610000.00,
    profit: 339000.00,
    profitRate: 35.7,
    remark: '月初订单交付'
  },
  {
    date: '2024-02',
    income: 3685000.00,
    expense: 2235600.00,
    profit: 1449400.00,
    profitRate: 39.3,
    remark: '春节期间开支减少'
  },
  {
    date: '2024-02-W4',
    income: 986000.00,
    expense: 586000.00,
    profit: 400000.00,
    profitRate: 40.6,
    remark: '春节后订单恢复'
  },
  {
    date: '2024-02-W3',
    income: 856000.00,
    expense: 485000.00,
    profit: 371000.00,
    profitRate: 43.3,
    remark: '春节期间固定支出减少'
  },
  {
    date: '2024-02-W2',
    income: 968000.00,
    expense: 586000.00,
    profit: 382000.00,
    profitRate: 39.5,
    remark: '春节前集中交付'
  },
  {
    date: '2024-02-W1',
    income: 875000.00,
    expense: 578600.00,
    profit: 296400.00,
    profitRate: 33.9,
    remark: '月初正常经营'
  },
  {
    date: '2024-01',
    income: 3268000.00,
    expense: 2568000.00,
    profit: 700000.00,
    profitRate: 21.4,
    remark: '年初开支较大'
  },
  {
    date: '2024-01-W4',
    income: 856000.00,
    expense: 685000.00,
    profit: 171000.00,
    profitRate: 20.0,
    remark: '月末设备采购'
  },
  {
    date: '2024-01-W3',
    income: 785000.00,
    expense: 625000.00,
    profit: 160000.00,
    profitRate: 20.4,
    remark: '研发投入增加'
  },
  {
    date: '2024-01-W2',
    income: 868000.00,
    expense: 658000.00,
    profit: 210000.00,
    profitRate: 24.2,
    remark: '新项目启动'
  },
  {
    date: '2024-01-W1',
    income: 759000.00,
    expense: 600000.00,
    profit: 159000.00,
    profitRate: 20.9,
    remark: '年初例行支出'
  }
]);

// 总数
const total = ref(100);

// 统计数据
const stats = {
  totalIncome: 11311000.00,
  totalExpense: 7941100.00,
  totalProfit: 3369900.00,
  monthlyData: {
    income: [3268000.00, 3685000.00, 4358000.00],
    expense: [2568000.00, 2235600.00, 3137500.00],
    profit: [700000.00, 1449400.00, 1220500.00]
  },
  weeklyData: {
    income: [759000.00, 868000.00, 785000.00, 856000.00, 875000.00, 968000.00, 856000.00, 986000.00, 949000.00, 985000.00, 1156000.00, 1268000.00],
    expense: [600000.00, 658000.00, 625000.00, 685000.00, 578600.00, 586000.00, 485000.00, 586000.00, 610000.00, 685000.00, 856000.00, 986500.00],
    profit: [159000.00, 210000.00, 160000.00, 171000.00, 296400.00, 382000.00, 371000.00, 400000.00, 339000.00, 300000.00, 300000.00, 281500.00]
  }
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadStatementList();
};

// 加载报表数据
const loadStatementList = () => {
  // 这里应该调用API获取数据
  console.log('加载报表数据:', query.value);
};

// 导出报表
const handleExport = () => {
  ElMessage.success('报表导出成功');
};

// 分页大小改变
const handleSizeChange = () => {
  loadStatementList();
};

// 页码改变
const handleCurrentChange = () => {
  loadStatementList();
};

// 初始化图表
const initCharts = () => {
  // 收支趋势图
  const trendChart = echarts.init(document.getElementById('trendChart'));
  const chartData = query.value.period === 'week' ? stats.weeklyData : stats.monthlyData;
  const xAxisData = query.value.period === 'week' 
    ? ['1月第1周', '1月第2周', '1月第3周', '1月第4周', '2月第1周', '2月第2周', '2月第3周', '2月第4周', '3月第1周', '3月第2周', '3月第3周', '3月第4周']
    : ['1月', '2月', '3月'];

  trendChart.setOption({
    title: { text: '' },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any[]) {
        let result = params[0].axisValue + '<br/>';
        params.forEach(param => {
          result += `${param.seriesName}: ¥${(param.value * 10000).toLocaleString()}<br/>`;
        });
        return result;
      }
    },
    legend: { data: ['收入', '支出', '利润'] },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: { 
      type: 'value',
      min: value => Math.floor(value.min / 50) * 50,
      max: value => Math.ceil(value.max / 50) * 50,
      axisLabel: {
        formatter: (value: number) => `${value}万`
      }
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: chartData.income.map(v => +(v / 10000).toFixed(1)),
        smooth: true,
        itemStyle: { color: '#67C23A' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(103, 194, 58, 0.2)'
            }, {
              offset: 1,
              color: 'rgba(103, 194, 58, 0)'
            }]
          }
        }
      },
      {
        name: '支出',
        type: 'line',
        data: chartData.expense.map(v => +(v / 10000).toFixed(1)),
        smooth: true,
        itemStyle: { color: '#F56C6C' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(245, 108, 108, 0.2)'
            }, {
              offset: 1,
              color: 'rgba(245, 108, 108, 0)'
            }]
          }
        }
      },
      {
        name: '利润',
        type: 'line',
        data: chartData.profit.map(v => +(v / 10000).toFixed(1)),
        smooth: true,
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(64, 158, 255, 0.2)'
            }, {
              offset: 1,
              color: 'rgba(64, 158, 255, 0)'
            }]
          }
        }
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
          { value: 75, name: '工业机器人' },
          { value: 15, name: '技术服务' },
          { value: 7, name: '配件销售' },
          { value: 3, name: '其他收入' }
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
};

onMounted(() => {
  initCharts();
});
</script>

<style scoped lang="scss">
.statement-container {
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

        &.up {
          color: #67C23A;
        }

        &.down {
          color: #F56C6C;
        }
      }
    }
  }

  .chart-container {
    margin: 20px 0;
    display: flex;
    gap: 20px;

    .chart-wrapper {
      flex: 1;
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