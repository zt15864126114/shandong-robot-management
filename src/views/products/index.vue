<template>
  <div class="products-container">
    <div class="products-content">
      <div class="products-header">
        <h1>产品与服务</h1>
        <p>我们提供全方位的机器人解决方案，助力企业实现智能制造转型升级</p>
      </div>

      <el-tabs v-model="activeTab" class="product-tabs">
        <el-tab-pane label="工业机器人" name="industrial">
          <div class="product-cards">
            <div v-for="product in industrialProducts" :key="product.id" class="product-card">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-content">
                <h3 class="product-title">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-features">
                  <div v-for="feature in product.features" :key="feature" class="feature-item">
                    <el-icon><Check /></el-icon>
                    {{ feature }}
                  </div>
                </div>
                <div class="product-price">
                  <div class="price-label">基础价格</div>
                  <div class="price-value">
                    ¥{{ product.price.basePrice.toLocaleString() }}
                    <span v-if="product.price.discount" class="discount-tag">
                      {{ product.price.discount.percentage }}% OFF
                    </span>
                  </div>
                </div>
                <div class="product-actions">
                  <el-button type="primary" @click="showProductDetail(product)">查看详情</el-button>
                  <el-button @click="showContactForm(product)">联系我们</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="服务机器人" name="service">
          <div class="product-cards">
            <div v-for="product in serviceProducts" :key="product.id" class="product-card">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-content">
                <h3 class="product-title">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-features">
                  <div v-for="feature in product.features" :key="feature" class="feature-item">
                    <el-icon><Check /></el-icon>
                    {{ feature }}
                  </div>
                </div>
                <div class="product-price">
                  <div class="price-label">基础价格</div>
                  <div class="price-value">
                    ¥{{ product.price.basePrice.toLocaleString() }}
                    <span v-if="product.price.discount" class="discount-tag">
                      {{ product.price.discount.percentage }}% OFF
                    </span>
                  </div>
                </div>
                <div class="product-actions">
                  <el-button type="primary" @click="showProductDetail(product)">查看详情</el-button>
                  <el-button @click="showContactForm(product)">联系我们</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="解决方案" name="solutions">
          <div class="solutions-section">
            <div class="solutions-header">
              <h2>行业解决方案</h2>
              <p>针对不同行业特点，提供定制化的机器人应用解决方案</p>
            </div>
            <div class="solution-cards">
              <div v-for="solution in solutions" :key="solution.id" class="solution-card">
                <div class="solution-icon">
                  <el-icon><component :is="solution.icon" /></el-icon>
                </div>
                <div class="solution-content">
                  <h3 class="solution-title">{{ solution.title }}</h3>
                  <p class="solution-description">{{ solution.description }}</p>
                  <ul class="solution-features">
                    <li v-for="feature in solution.features" :key="feature">
                      <el-icon><Check /></el-icon>
                      {{ feature }}
                    </li>
                  </ul>
                  <div class="solution-actions">
                    <el-button type="primary" @click="showSolutionDetail(solution)">了解更多</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 产品详情对话框 -->
    <el-dialog
      v-model="productDetailVisible"
      title="产品详情"
      width="80%"
      class="product-detail-dialog"
    >
      <div v-if="selectedProduct" class="detail-content">
        <img :src="selectedProduct.image" :alt="selectedProduct.name" class="detail-image">
        
        <div class="detail-section">
          <h3>产品描述</h3>
          <p>{{ selectedProduct.description }}</p>
        </div>

        <div class="detail-section">
          <h3>技术规格</h3>
          <div class="specs-grid">
            <div v-for="spec in selectedProduct.specifications" :key="spec.name" class="spec-item">
              <div class="spec-label">{{ spec.name }}</div>
              <div class="spec-value">{{ spec.value }}</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>技术特点</h3>
          <div class="technical-details">
            <div v-for="(value, key) in selectedProduct.technicalDetails" :key="key" class="tech-item">
              <div class="tech-label">{{ key }}</div>
              <div class="tech-value">{{ value }}</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>应用场景</h3>
          <div class="applications-list">
            <div v-for="app in selectedProduct.applications" :key="app" class="application-item">
              {{ app }}
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>服务与支持</h3>
          <div class="services-list">
            <div v-for="service in selectedProduct.services" :key="service.name" class="service-item">
              <div class="service-name">{{ service.name }}</div>
              <div class="service-description">{{ service.description }}</div>
              <div class="service-price">¥{{ service.price.toLocaleString() }}</div>
              <div class="service-duration">{{ service.duration }}</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>认证与质保</h3>
          <div class="certifications-list">
            <div v-for="cert in selectedProduct.certifications" :key="cert" class="certification-item">
              {{ cert }}
            </div>
          </div>
          <div class="warranty-info">
            <h4>质保期：{{ selectedProduct.warranty.period }}</h4>
            <ul class="warranty-terms">
              <li v-for="term in selectedProduct.warranty.terms" :key="term" class="warranty-term">
                <el-icon><Check /></el-icon>
                {{ term }}
              </li>
            </ul>
          </div>
        </div>

        <div class="detail-section">
          <h3>维护保养</h3>
          <div class="maintenance-info">
            <p>维护周期：{{ selectedProduct.maintenance.schedule }}</p>
            <ul class="maintenance-requirements">
              <li v-for="req in selectedProduct.maintenance.requirements" :key="req" class="maintenance-requirement">
                <el-icon><Tools /></el-icon>
                {{ req }}
              </li>
            </ul>
          </div>
        </div>

        <div class="detail-section">
          <h3>技术支持</h3>
          <div class="support-info">
            <div class="support-type">{{ selectedProduct.support.type }}</div>
            <div class="support-description">{{ selectedProduct.support.description }}</div>
            <div class="support-contact">联系电话：{{ selectedProduct.support.contact }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 联系我们对话框 -->
    <el-dialog
      v-model="contactFormVisible"
      title="联系我们"
      width="500px"
    >
      <div class="contact-form">
        <div class="form-item">
          <label class="form-label">公司名称</label>
          <el-input v-model="contactForm.company" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">联系人</label>
          <el-input v-model="contactForm.name" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">联系电话</label>
          <el-input v-model="contactForm.phone" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">电子邮箱</label>
          <el-input v-model="contactForm.email" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">咨询内容</label>
          <el-input
            v-model="contactForm.message"
            type="textarea"
            class="form-textarea"
            :rows="4"
          />
        </div>
        <el-button type="primary" class="submit-button" @click="submitContactForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Check, Tools } from '@element-plus/icons-vue';
import { products } from '@/data/products';
import type { Product } from '@/types/product';

const activeTab = ref('industrial');
const productDetailVisible = ref(false);
const contactFormVisible = ref(false);
const selectedProduct = ref<Product | null>(null);

const industrialProducts = computed(() => products.filter(p => p.category === 'industrial'));
const serviceProducts = computed(() => products.filter(p => p.category === 'service'));

const solutions = [
  {
    id: 1,
    title: '汽车制造解决方案',
    description: '提供汽车零部件装配、焊接、喷涂等全流程自动化解决方案',
    icon: 'Van',
    features: [
      '柔性装配系统',
      '智能焊接工作站',
      '自动化喷涂线',
      '质量检测系统'
    ]
  },
  {
    id: 2,
    title: '电子制造解决方案',
    description: '针对电子产品组装、测试、包装等环节的自动化解决方案',
    icon: 'Monitor',
    features: [
      '精密装配系统',
      '自动化测试线',
      '智能包装系统',
      '追溯管理系统'
    ]
  },
  {
    id: 3,
    title: '物流仓储解决方案',
    description: '提供仓储物流、分拣、配送等环节的智能化解决方案',
    icon: 'Box',
    features: [
      '智能仓储系统',
      '自动化分拣线',
      'AGV配送系统',
      '库存管理系统'
    ]
  }
];

const showProductDetail = (product: Product) => {
  selectedProduct.value = product;
  productDetailVisible.value = true;
};

const showContactForm = (product: Product) => {
  selectedProduct.value = product;
  contactFormVisible.value = true;
};

const contactForm = ref({
  company: '',
  name: '',
  phone: '',
  email: '',
  message: ''
});

const submitContactForm = () => {
  // 这里添加表单提交逻辑
  ElMessage.success('提交成功，我们会尽快与您联系！');
  contactFormVisible.value = false;
  contactForm.value = {
    company: '',
    name: '',
    phone: '',
    email: '',
    message: ''
  };
};
</script>

<style scoped>
.products-container {
  padding: 20px;
  height: calc(100vh - 60px); /* 减去顶部导航栏的高度 */
  overflow-y: auto;
  background-color: #f5f7fa;
  position: relative;
}

.products-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px; /* 添加底部内边距 */
}

.products-header {
  margin-bottom: 30px;
  text-align: center;
}

.products-header h1 {
  font-size: 2.5em;
  color: #303133;
  margin-bottom: 10px;
}

.products-header p {
  font-size: 1.2em;
  color: #606266;
  max-width: 800px;
  margin: 0 auto;
}

.product-tabs {
  margin-bottom: 30px;
}

.product-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin: -20px -20px 0;
  border-radius: 8px 8px 0 0;
}

.product-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.5em;
  color: #303133;
  margin-bottom: 10px;
}

.product-description {
  color: #606266;
  margin-bottom: 15px;
  flex: 1;
}

.product-features {
  margin: 15px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #606266;
}

.feature-item i {
  margin-right: 8px;
  color: #409EFF;
}

.product-price {
  margin: 15px 0;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.price-label {
  color: #909399;
  font-size: 0.9em;
}

.price-value {
  color: #f56c6c;
  font-size: 1.2em;
  font-weight: bold;
}

.discount-tag {
  margin-left: 8px;
  font-size: 0.9em;
  color: #f56c6c;
  background: #fef0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.product-actions .el-button {
  flex: 1;
}

.solutions-section {
  margin-top: 50px;
  padding: 30px 0;
}

.solutions-header {
  text-align: center;
  margin-bottom: 30px;
}

.solutions-header h2 {
  font-size: 2em;
  color: #303133;
  margin-bottom: 10px;
}

.solutions-header p {
  color: #606266;
  max-width: 800px;
  margin: 0 auto;
}

.solution-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.solution-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.solution-card:hover {
  transform: translateY(-5px);
}

.solution-icon {
  width: 60px;
  height: 60px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecf5ff;
  border-radius: 50%;
}

.solution-icon i {
  font-size: 24px;
  color: #409EFF;
}

.solution-content {
  padding: 20px;
  text-align: center;
}

.solution-title {
  font-size: 1.3em;
  color: #303133;
  margin-bottom: 10px;
}

.solution-description {
  color: #606266;
  margin-bottom: 15px;
}

.solution-features {
  text-align: left;
  margin: 15px 0;
  list-style: none;
  padding: 0;
}

.solution-features li {
  color: #606266;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.solution-features li i {
  margin-right: 8px;
  color: #67c23a;
}

.solution-actions {
  margin-top: 20px;
}

/* 产品详情对话框样式 */
.product-detail-dialog {
  max-width: 800px;
  margin: 0 auto;
}

.detail-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.detail-content {
  padding: 20px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  font-size: 1.5em;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.spec-item {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.spec-label {
  color: #909399;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.spec-value {
  color: #303133;
  font-weight: bold;
}

.technical-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.tech-item {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.tech-label {
  color: #909399;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.tech-value {
  color: #303133;
}

.applications-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.application-item {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  color: #303133;
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.service-item {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.service-name {
  font-size: 1.2em;
  color: #303133;
  margin-bottom: 10px;
}

.service-description {
  color: #606266;
  margin-bottom: 15px;
}

.service-price {
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 10px;
}

.service-duration {
  color: #909399;
  font-size: 0.9em;
}

.certifications-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.certification-item {
  background: #f5f7fa;
  padding: 8px 15px;
  border-radius: 4px;
  color: #303133;
}

.warranty-terms {
  list-style: none;
  padding: 0;
}

.warranty-term {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #606266;
}

.warranty-term i {
  margin-right: 8px;
  color: #67c23a;
}

.maintenance-requirements {
  list-style: none;
  padding: 0;
}

.maintenance-requirement {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #606266;
}

.maintenance-requirement i {
  margin-right: 8px;
  color: #409EFF;
}

.support-info {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.support-type {
  font-size: 1.2em;
  color: #303133;
  margin-bottom: 10px;
}

.support-description {
  color: #606266;
  margin-bottom: 15px;
}

.support-contact {
  color: #409EFF;
  font-weight: bold;
}

/* 联系我们对话框样式 */
.contact-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
}

.form-input {
  width: 100%;
}

.form-textarea {
  width: 100%;
  min-height: 120px;
}

.submit-button {
  width: 100%;
  margin-top: 20px;
}
</style> 