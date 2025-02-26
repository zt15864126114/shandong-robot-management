<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-header">
        <h1>山东纳智达机器人综合管理平台</h1>
        <div class="divider">
          <span></span>
          <p class="subtitle">智能制造 · 数字化转型 · 高效管理</p>
          <span></span>
        </div>
      </div>

      <el-row :gutter="24" class="stat-cards">
        <el-col :span="6" v-for="stat in statistics" :key="stat.title">
          <div class="stat-card" :class="stat.type">
            <div class="stat-icon">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stat.title }}</h3>
              <div class="number">{{ stat.number }}</div>
              <div class="trend" :class="stat.trend">
                <el-icon><component :is="stat.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                {{ stat.rate }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="quick-access">
        <div class="section-header">
          <h2>快速访问</h2>
          <div class="line"></div>
        </div>
        <el-row :gutter="24">
          <el-col :span="8" v-for="menu in quickMenus" :key="menu.title">
            <div class="menu-card" @click="handleNavigate(menu.path)">
              <div class="menu-icon">
                <el-icon><component :is="menu.icon" /></el-icon>
              </div>
              <div class="menu-content">
                <h3>{{ menu.title }}</h3>
                <p>{{ menu.description }}</p>
              </div>
              <div class="hover-effect"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  Monitor, 
  Document, 
  User,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  UserFilled,
  Goods,
  Money
} from '@element-plus/icons-vue';

const router = useRouter();

const statistics = [
  {
    title: '本月订单',
    number: '128',
    trend: 'up',
    rate: '12.5%',
    icon: ShoppingBag,
    type: 'primary'
  },
  {
    title: '活跃客户',
    number: '1,286',
    trend: 'up',
    rate: '8.2%',
    icon: UserFilled,
    type: 'success'
  },
  {
    title: '产品库存',
    number: '386',
    trend: 'down',
    rate: '5.3%',
    icon: Goods,
    type: 'warning'
  },
  {
    title: '本月收入',
    number: '￥286,420',
    trend: 'up',
    rate: '15.4%',
    icon: Money,
    type: 'danger'
  }
];

const quickMenus = [
  {
    title: '数据概览',
    icon: Monitor,
    description: '查看企业运营数据和关键指标',
    path: '/dashboard'
  },
  {
    title: '订单管理',
    icon: Document,
    description: '处理订单、跟踪订单状态',
    path: '/order/list'
  },
  {
    title: '客户管理',
    icon: User,
    description: '管理客户信息和服务记录',
    path: '/customer/list'
  }
];

const handleNavigate = (path: string) => {
  router.push(path);
};
</script>

<style scoped lang="scss">
.welcome-container {
  padding: 40px;
  min-height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);

  .welcome-content {
    max-width: 1200px;
    margin: 0 auto;

    .welcome-header {
      text-align: center;
      margin-bottom: 60px;

      h1 {
        font-size: 36px;
        color: #2c3e50;
        margin: 0;
        font-weight: 600;
        letter-spacing: 1px;
      }

      .divider {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        
        span {
          height: 1px;
          width: 60px;
          background: linear-gradient(90deg, transparent, #409EFF, transparent);
        }

        .subtitle {
          font-size: 16px;
          color: #606266;
          margin: 0 20px;
          font-weight: 300;
        }
      }
    }

    .stat-cards {
      margin-bottom: 60px;

      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 20px;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        &.primary { .stat-icon { background: rgba(64, 158, 255, 0.1); color: #409EFF; }}
        &.success { .stat-icon { background: rgba(103, 194, 58, 0.1); color: #67C23A; }}
        &.warning { .stat-icon { background: rgba(230, 162, 60, 0.1); color: #E6A23C; }}
        &.danger { .stat-icon { background: rgba(245, 108, 108, 0.1); color: #F56C6C; }}

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-info {
          flex: 1;

          h3 {
            font-size: 14px;
            color: #909399;
            margin: 0 0 8px;
            font-weight: normal;
          }

          .number {
            font-size: 24px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 8px;
          }

          .trend {
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;

            &.up { color: #67C23A; }
            &.down { color: #F56C6C; }
          }
        }
      }
    }

    .quick-access {
      .section-header {
        text-align: center;
        margin-bottom: 40px;
        position: relative;

        h2 {
          font-size: 24px;
          color: #2c3e50;
          margin: 0;
          font-weight: 600;
        }

        .line {
          width: 40px;
          height: 3px;
          background: #409EFF;
          margin: 12px auto 0;
          border-radius: 2px;
        }
      }

      .menu-card {
        background: white;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.3s;
        height: 100%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

          .hover-effect {
            transform: scale(1);
            opacity: 1;
          }
        }

        .menu-icon {
          font-size: 36px;
          color: #409EFF;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .menu-content {
          position: relative;
          z-index: 1;

          h3 {
            font-size: 18px;
            color: #303133;
            margin: 0 0 12px;
            font-weight: 600;
          }

          p {
            font-size: 14px;
            color: #606266;
            margin: 0;
            line-height: 1.6;
          }
        }

        .hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(64, 158, 255, 0.05) 0%, rgba(64, 158, 255, 0.1) 100%);
          transform: scale(0.8);
          opacity: 0;
          transition: all 0.3s;
          border-radius: 12px;
        }
      }
    }
  }
}
</style> 