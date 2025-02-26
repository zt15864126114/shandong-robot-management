<template>
  <div class="products-container">
    <div class="page-header">
      <h2>产品与解决方案</h2>
      <p>智能制造的引领者，为工业4.0提供全方位解决方案</p>
    </div>

    <el-tabs v-model="activeTab" class="product-tabs">
      <el-tab-pane label="工业机器人" name="industrial">
        <div class="category-intro">
          <h3>工业级机器人系列</h3>
          <p>高精度、高可靠性的工业自动化解决方案</p>
        </div>
        <div class="product-grid">
          <el-card v-for="product in industrialRobots" :key="product.id" class="product-card">
            <div class="product-image" :style="{ backgroundImage: `url(${product.image})` }">
              <div class="product-tag" v-if="product.tag">{{ product.tag }}</div>
            </div>
            <div class="product-content">
              <h3>{{ product.name }}</h3>
              <p class="description">{{ product.description }}</p>
              <div class="features">
                <span v-for="feature in product.features" :key="feature">{{ feature }}</span>
              </div>
              <el-button type="primary" text class="detail-btn">了解详情</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="服务机器人" name="service">
        <div class="category-intro">
          <h3>智能服务机器人系列</h3>
          <p>引领服务机器人新时代，提供智能化服务体验</p>
        </div>
        <div class="product-grid">
          <el-card v-for="product in serviceRobots" :key="product.id" class="product-card">
            <div class="product-image" :style="{ backgroundImage: `url(${product.image})` }">
              <div class="product-tag" v-if="product.tag">{{ product.tag }}</div>
            </div>
            <div class="product-content">
              <h3>{{ product.name }}</h3>
              <p class="description">{{ product.description }}</p>
              <div class="features">
                <span v-for="feature in product.features" :key="feature">{{ feature }}</span>
              </div>
              <el-button type="primary" text class="detail-btn">了解详情</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="解决方案" name="solutions">
        <div class="category-intro">
          <h3>行业解决方案</h3>
          <p>深耕各行业场景，提供定制化智能制造解决方案</p>
        </div>
        <div class="solution-grid">
          <el-card v-for="solution in solutions" :key="solution.id" class="solution-card">
            <el-icon class="solution-icon"><component :is="solution.icon" /></el-icon>
            <h3>{{ solution.title }}</h3>
            <p>{{ solution.description }}</p>
            <ul class="benefits">
              <li v-for="benefit in solution.benefits" :key="benefit">{{ benefit }}</li>
            </ul>
            <el-button type="primary" class="solution-btn">查看方案</el-button>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  House,
  Box,
  TakeawayBox,
  FirstAidKit,
  Reading,
  ShoppingBag
} from '@element-plus/icons-vue';
import industrial1 from '@/assets/robot-images/industrial-1.png';
import industrial2 from '@/assets/robot-images/industrial-2.png';
import industrial3 from '@/assets/robot-images/industrial-3.png';

const activeTab = ref('industrial');

const industrialRobots = [
  {
    id: 1,
    name: 'NZ-6R-180',
    description: '六轴通用工业机器人，适用于各类制造场景，提供精准、高效的自动化解决方案',
    image: industrial1,
    tag: '畅销产品',
    features: ['负载: 20kg', '精度: ±0.02mm', '自由度: 6', '工作半径: 1.8m']
  },
  {
    id: 2,
    name: 'NZ-4R-120',
    description: '四轴高速机器人，专为拾取和包装应用设计，具有业内领先的作业速度',
    image: industrial2,
    features: ['负载: 8kg', '精度: ±0.01mm', '自由度: 4', '工作半径: 1.2m']
  },
  {
    id: 3,
    name: 'NZ-6R-250',
    description: '大负载工业机器人，适用于重型工件搬运和大型零部件加工',
    image: industrial3,
    tag: '新品',
    features: ['负载: 250kg', '精度: ±0.05mm', '自由度: 6', '工作半径: 2.5m']
  },
  {
    id: 4,
    name: 'NZ-7R-160',
    description: '七轴协作机器人，具备高度灵活性和安全性，可与人类工作者紧密协作',
    image: '/robot-images/industrial-4.jpg',
    features: ['负载: 15kg', '精度: ±0.02mm', '自由度: 7', '工作半径: 1.6m']
  }
];

const serviceRobots = [
  {
    id: 1,
    name: 'NZ-AGV-100',
    description: '智能物流配送机器人，适用于医院、酒店等场景的智能配送服务',
    image: 'https://example.com/placeholder.jpg',
    tag: '热销',
    features: ['自主导航', '避障功能', '语音交互', '远程控制']
  },
  {
    id: 2,
    name: 'NZ-Clean-50',
    description: '商用清洁机器人，适用于大型商场、办公楼的自动化清洁',
    image: 'https://example.com/placeholder.jpg',
    features: ['智能规划', '自动充电', '远程监控', '多场景适配']
  },
  {
    id: 3,
    name: 'NZ-Guide-200',
    description: '智能导览机器人，提供专业的展厅讲解和互动服务',
    image: '/robot-images/service-3.jpg',
    features: ['人脸识别', '多语言支持', '手势交互', '云端管理']
  },
  {
    id: 4,
    name: 'NZ-Security-100',
    description: '智能安防机器人，提供24小时自主巡逻和安全监控',
    image: '/robot-images/service-4.jpg',
    tag: '新品',
    features: ['红外侦测', '异常报警', '实时监控', '自动巡航']
  }
];

const solutions = [
  {
    id: 1,
    title: '智能工厂解决方案',
    icon: House,
    description: '面向制造业的智能化整体解决方案，实现生产全流程数字化转型',
    benefits: [
      '提升生产效率30%以上',
      '降低人工成本40%',
      '质量控制更精准',
      '生产数据可视化'
    ]
  },
  {
    id: 2,
    title: '智能仓储解决方案',
    icon: Box,
    description: '基于AGV和机器人的智能仓储系统，提升仓储运营效率',
    benefits: [
      '仓储效率提升50%',
      '人力成本降低60%',
      '库存准确率99.9%',
      '24小时自动化运营'
    ]
  },
  {
    id: 3,
    title: '智能物流解决方案',
    icon: TakeawayBox,
    description: '智能物流配送系统，实现物流全程可视化管理',
    benefits: [
      '配送效率提升40%',
      '运营成本降低30%',
      '客户满意度提升25%',
      '实时追踪管理'
    ]
  },
  {
    id: 4,
    title: '医疗服务解决方案',
    icon: FirstAidKit,
    description: '医疗服务机器人解决方案，提升医疗服务效率',
    benefits: [
      '减少医护人员工作负担',
      '提高医疗服务效率',
      '降低交叉感染风险',
      '提升患者满意度'
    ]
  },
  {
    id: 5,
    title: '教育培训解决方案',
    icon: Reading,
    description: '智能教育机器人解决方案，创新教育模式',
    benefits: [
      '提供沉浸式学习体验',
      '个性化教学辅导',
      'STEAM教育支持',
      '远程互动教学'
    ]
  },
  {
    id: 6,
    title: '零售服务解决方案',
    icon: ShoppingBag,
    description: '智能零售服务解决方案，提升购物体验',
    benefits: [
      '智能导购服务',
      '自动化库存管理',
      '客流分析优化',
      '无人零售支持'
    ]
  }
];
</script>

<style scoped lang="scss">
.products-container {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);

  .page-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      font-size: 32px;
      color: #2c3e50;
      margin: 0 0 16px;
      font-weight: 600;
    }

    p {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .product-tabs {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
      background: linear-gradient(90deg, transparent, #dcdfe6, transparent);
    }
  }

  .category-intro {
    text-align: center;
    margin-bottom: 30px;

    h3 {
      font-size: 24px;
      color: #2c3e50;
      margin: 0 0 12px;
    }

    p {
      color: #606266;
      margin: 0;
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 20px;

    .product-card {
      transition: all 0.3s;
      border: none;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

        .product-image {
          transform: scale(1.05);
        }
      }

      .product-image {
        height: 200px;
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        margin: -20px -20px 16px;
        transition: all 0.3s;
        position: relative;

        .product-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          background: rgba(64, 158, 255, 0.9);
          color: white;
          border-radius: 4px;
          font-size: 12px;
        }
      }

      .product-content {
        h3 {
          font-size: 18px;
          margin: 0 0 12px;
          color: #303133;
        }

        .description {
          color: #606266;
          margin: 0 0 16px;
          line-height: 1.6;
          min-height: 48px;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;

          span {
            padding: 4px 12px;
            background: #f5f7fa;
            border-radius: 4px;
            font-size: 12px;
            color: #606266;
          }
        }

        .detail-btn {
          width: 100%;
        }
      }
    }
  }

  .solution-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
    margin-top: 20px;

    .solution-card {
      transition: all 0.3s;
      border: none;
      padding: 30px;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .solution-icon {
        font-size: 40px;
        color: #409EFF;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        margin: 0 0 16px;
        color: #303133;
      }

      p {
        color: #606266;
        margin: 0 0 20px;
        line-height: 1.6;
      }

      .benefits {
        margin: 0 0 24px;
        padding-left: 20px;
        color: #606266;

        li {
          margin-bottom: 8px;
          line-height: 1.6;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .solution-btn {
        width: 100%;
      }
    }
  }
}
</style> 