<template>
  <div class="market-container">
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
              <h3>市场份额</h3>
              <div class="number">23.5%</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                2.1%
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>客户增长</h3>
              <div class="number up">+156</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                12.3%
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>客户流失</h3>
              <div class="number down">-23</div>
              <div class="trend down">
                <el-icon><ArrowUp /></el-icon>
                5.6%
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>客户满意度</h3>
              <div class="number">4.8</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                0.2
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="chart-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="chart-wrapper">
              <div class="chart-title">市场份额趋势</div>
              <div id="marketShareChart" style="height: 300px;"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-wrapper">
              <div class="chart-title">竞品分析</div>
              <div id="competitorChart" style="height: 300px;"></div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <div class="chart-wrapper">
              <div class="chart-title">客户画像</div>
              <div id="customerChart" style="height: 300px;"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-wrapper">
              <div class="chart-title">地域分布</div>
              <div id="regionChart" style="height: 300px;"></div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="dataList" border style="width: 100%" height="100%">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="marketShare" label="市场份额" width="120">
            <template #default="{ row }">
              {{ row.marketShare.toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column prop="newCustomers" label="新增客户" width="120">
            <template #default="{ row }">
              <span class="amount-up">+{{ row.newCustomers }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lostCustomers" label="流失客户" width="120">
            <template #default="{ row }">
              <span class="amount-down">{{ row.lostCustomers }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="satisfaction" label="满意度" width="100">
            <template #default="{ row }">
              {{ row.satisfaction.toFixed(1) }}
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
  // 市场份额趋势图
  const marketShareChart = echarts.init(document.getElementById('marketShareChart'));
  marketShareChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['我司', '竞争对手A', '竞争对手B'] },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { 
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '我司',
        type: 'line',
        data: [21.5, 22.1, 22.8, 23.2, 23.5, 23.8],
        smooth: true,
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '竞争对手A',
        type: 'line',
        data: [19.8, 19.5, 19.2, 18.8, 18.5, 18.2],
        smooth: true,
        itemStyle: { color: '#F56C6C' }
      },
      {
        name: '竞争对手B',
        type: 'line',
        data: [15.2, 15.5, 15.8, 16.0, 16.2, 16.5],
        smooth: true,
        itemStyle: { color: '#E6A23C' }
      }
    ]
  });

  // 竞品分析图
  const competitorChart = echarts.init(document.getElementById('competitorChart'));
  competitorChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['性能', '价格', '服务', '品牌'] },
    radar: {
      indicator: [
        { name: '工业机器人', max: 100 },
        { name: '服务机器人', max: 100 },
        { name: '特种机器人', max: 100 },
        { name: '智能装备', max: 100 },
        { name: '系统集成', max: 100 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [85, 90, 75, 95, 85],
            name: '性能',
            itemStyle: { color: '#409EFF' }
          },
          {
            value: [90, 80, 85, 75, 80],
            name: '价格',
            itemStyle: { color: '#67C23A' }
          },
          {
            value: [95, 85, 90, 85, 90],
            name: '服务',
            itemStyle: { color: '#E6A23C' }
          },
          {
            value: [80, 85, 80, 90, 85],
            name: '品牌',
            itemStyle: { color: '#F56C6C' }
          }
        ]
      }
    ]
  });

  // 客户画像图
  const customerChart = echarts.init(document.getElementById('customerChart'));
  customerChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 45, name: '制造业' },
          { value: 25, name: '医疗行业' },
          { value: 15, name: '物流行业' },
          { value: 10, name: '教育行业' },
          { value: 5, name: '其他' }
        ]
      }
    ]
  });

  // 地域分布图
  const regionChart = echarts.init(document.getElementById('regionChart'));
  regionChart.setOption({
    title: { text: '' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 35, name: '华东地区' },
          { value: 25, name: '华北地区' },
          { value: 20, name: '华南地区' },
          { value: 12, name: '西部地区' },
          { value: 8, name: '其他地区' }
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
    marketShare: 23.8,
    newCustomers: 168,
    lostCustomers: -18,
    satisfaction: 4.9,
    remark: '市场份额持续增长'
  },
  {
    date: '2025-02',
    marketShare: 23.5,
    newCustomers: 156,
    lostCustomers: -21,
    satisfaction: 4.8,
    remark: '客户满意度提升'
  },
  {
    date: '2025-01',
    marketShare: 23.5,
    newCustomers: 156,
    lostCustomers: -23,
    satisfaction: 4.8,
    remark: '市场表现良好'
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
.market-container {
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