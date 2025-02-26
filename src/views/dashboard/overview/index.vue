<template>
  <div class="dashboard-container">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in dataCards" :key="card.title">
        <el-card shadow="hover" class="data-card">
          <div class="card-header">
            <span class="title">{{ card.title }}</span>
            <el-icon :class="['icon', card.trend]"><component :is="card.icon" /></el-icon>
          </div>
          <div class="number" :class="card.trend">{{ card.number }}</div>
          <div class="footer">
            <span class="trend" :class="card.trend">
              <el-icon><component :is="card.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
              {{ card.rate }}
            </span>
            <span class="label">较上月</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <div class="chart-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span class="title">销售趋势</span>
                <div class="actions">
                  <el-radio-group v-model="salesPeriod" size="small" @change="updateSalesTrend">
                    <el-radio-button label="week">本周</el-radio-button>
                    <el-radio-button label="month">本月</el-radio-button>
                    <el-radio-button label="year">全年</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </template>
            <div class="chart-content">
              <div ref="salesTrendChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span class="title">销售分布</span>
                <el-dropdown @command="handleDistributionChange">
                  <span class="el-dropdown-link">
                    {{ salesType }}
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="product">按产品</el-dropdown-item>
                      <el-dropdown-item command="region">按地区</el-dropdown-item>
                      <el-dropdown-item command="customer">按客户</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <div class="chart-content">
              <div ref="distributionChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span class="title">实时订单</span>
                <el-tag type="success">实时数据</el-tag>
              </div>
            </template>
            <div class="order-list">
              <div v-for="order in recentOrders" :key="order.id" class="order-item">
                <div class="order-info">
                  <span class="time">{{ order.time }}</span>
                  <span class="customer">{{ order.customer }}</span>
                  <span class="product">{{ order.product }}</span>
                </div>
                <div class="order-amount" :class="{ 'amount-up': order.amount > 10000 }">
                  ¥{{ formatNumber(order.amount) }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span class="title">库存预警</span>
                <el-button type="primary" link>查看全部</el-button>
              </div>
            </template>
            <el-table :data="warningList" style="width: 100%">
              <el-table-column prop="name" label="商品名称" />
              <el-table-column prop="stock" label="当前库存" width="100" />
              <el-table-column prop="warning" label="预警值" width="100" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.stock <= row.warning ? 'danger' : 'warning'">
                    {{ row.stock <= row.warning ? '已告警' : '预警' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import {
  TrendCharts,
  Money,
  ShoppingCart,
  User,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue';

// 顶部数据卡片
const dataCards = [
  {
    title: '本月销售额',
    number: '¥1,268,560',
    icon: Money,
    trend: 'up',
    rate: '15.2%'
  },
  {
    title: '机器人销量',
    number: '386台',
    icon: ShoppingCart,
    trend: 'up',
    rate: '12.5%'
  },
  {
    title: '维保任务',
    number: '128个',
    icon: TrendCharts,
    trend: 'up',
    rate: '8.3%'
  },
  {
    title: '故障工单',
    number: '12个',
    icon: User,
    trend: 'down',
    rate: '25.8%'
  }
];

// 销售周期
const salesPeriod = ref('month');

// 销售类型
const salesType = ref('按产品');

// 最近订单
const recentOrders = [
  {
    id: 1,
    time: '10:23:15',
    customer: '山东重工',
    product: '工业机器人 AR-150',
    amount: 158000
  },
  {
    id: 2,
    time: '10:21:32',
    customer: '青岛港',
    product: '特种机器人 SR-200',
    amount: 235000
  },
  {
    id: 3,
    time: '10:20:08',
    customer: '济南医院',
    product: '服务机器人 MR-100',
    amount: 98000
  },
  {
    id: 4,
    time: '10:18:55',
    customer: '潍柴动力',
    product: '协作机器人 CR-50',
    amount: 125000
  },
  {
    id: 5,
    time: '10:17:23',
    customer: '浪潮集团',
    product: '工业机器人 AR-200',
    amount: 188000
  }
];

// 库存预警
const warningList = [
  {
    name: '工业机器人 AR-150',
    stock: 3,
    warning: 5
  },
  {
    name: '伺服电机 M2235',
    stock: 8,
    warning: 15
  },
  {
    name: '控制器 C100',
    stock: 5,
    warning: 10
  },
  {
    name: '减速器 R50',
    stock: 12,
    warning: 20
  }
];

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 图表实例引用
const salesTrendChart = ref<HTMLElement | null>(null);
const distributionChart = ref<HTMLElement | null>(null);
let trendChartInstance: echarts.ECharts | null = null;
let distributionChartInstance: echarts.ECharts | null = null;

// 初始化销售趋势图表
const initSalesTrendChart = () => {
  if (salesTrendChart.value) {
    trendChartInstance = echarts.init(salesTrendChart.value);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['销售额', '维保收入']
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
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '销售额',
          type: 'line',
          smooth: true,
          data: [320000, 450000, 380000, 580000, 690000, 820000, 950000],
          areaStyle: {
            opacity: 0.1
          },
          lineStyle: {
            width: 3
          }
        },
        {
          name: '维保收入',
          type: 'line',
          smooth: true,
          data: [28000, 32000, 35000, 42000, 48000, 52000, 56000],
          areaStyle: {
            opacity: 0.1
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    };
    trendChartInstance.setOption(option);
  }
};

// 初始化销售分布图表
const initDistributionChart = () => {
  if (distributionChart.value) {
    distributionChartInstance = echarts.init(distributionChart.value);
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [
        {
          name: '销售分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 580, name: '工业机器人' },
            { value: 484, name: '服务机器人' },
            { value: 300, name: '特种机器人' },
            { value: 235, name: '协作机器人' },
            { value: 148, name: '其他产品' }
          ]
        }
      ]
    };
    distributionChartInstance.setOption(option);
  }
};

// 更新销售趋势
const updateSalesTrend = () => {
  // 根据 salesPeriod 更新数据
  console.log('更新销售趋势:', salesPeriod.value);
};

// 处理分布类型变化
const handleDistributionChange = (command: string) => {
  salesType.value = command === 'product' ? '按产品' : command === 'region' ? '按地区' : '按客户';
  // 更新图表数据
};

// 监听窗口大小变化
const handleResize = () => {
  trendChartInstance?.resize();
  distributionChartInstance?.resize();
};

onMounted(() => {
  initSalesTrendChart();
  initDistributionChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  trendChartInstance?.dispose();
  distributionChartInstance?.dispose();
});
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  .data-card {
    height: 180px;
    padding: 20px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .title {
        font-size: 16px;
        color: #606266;
      }

      .icon {
        font-size: 28px;
        color: #909399;
        
        &.up {
          color: #67C23A;
        }
        
        &.down {
          color: #F56C6C;
        }
      }
    }

    .number {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      
      &.up {
        color: #67C23A;
      }
      
      &.down {
        color: #F56C6C;
      }
    }

    .footer {
      display: flex;
      align-items: center;
      gap: 8px;

      .trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: bold;
        
        &.up {
          color: #67C23A;
        }
        
        &.down {
          color: #F56C6C;
        }
      }

      .label {
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .chart-section {
    margin-top: 20px;

    .chart-card {
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .chart-content {
        height: 300px;
        
        .chart {
          width: 100%;
          height: 100%;
        }
      }

      .order-list {
        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #EBEEF5;

          &:last-child {
            border-bottom: none;
          }

          .order-info {
            display: flex;
            gap: 16px;

            .time {
              color: #909399;
              width: 80px;
            }

            .customer {
              width: 60px;
            }

            .product {
              color: #606266;
            }
          }

          .order-amount {
            font-weight: bold;
            
            &.amount-up {
              color: #67C23A;
            }
          }
        }
      }
    }
  }
}
</style> 