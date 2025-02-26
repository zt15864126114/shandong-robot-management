<template>
  <div class="company-info-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">山东纳智达机器人有限公司</span>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="企业名称">山东纳智达机器人有限公司</el-descriptions-item>
        <el-descriptions-item label="法定代表人">王志远</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码">91370100MA3XXXXXX8B</el-descriptions-item>
        <el-descriptions-item label="注册资本">5000万元</el-descriptions-item>
        <el-descriptions-item label="企业类型">股份有限公司</el-descriptions-item>
        <el-descriptions-item label="成立日期">2018-06-15</el-descriptions-item>
        <el-descriptions-item label="经营范围">
          工业机器人、服务机器人、特种机器人的研发、生产、销售及技术服务；智能装备及零部件的设计、制造、销售；自动化系统集成及技术咨询；软件开发；进出口业务
        </el-descriptions-item>
        <el-descriptions-item label="注册地址">
          山东省济南市高新区新泺大街1768号科汇大厦B座12层
        </el-descriptions-item>
      </el-descriptions>

      <div class="section-title">联系方式</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="联系电话">0531-88888888</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">contact@shandong-robot.com</el-descriptions-item>
        <el-descriptions-item label="传真">0531-88888889</el-descriptions-item>
        <el-descriptions-item label="网址">www.shandong-robot.com</el-descriptions-item>
      </el-descriptions>

      <div class="section-title">资质证书</div>
      <div class="certificate-list">
        <el-row :gutter="20">
          <el-col :span="8" v-for="cert in certificates" :key="cert.name">
            <el-card shadow="hover" class="cert-card">
              <template #header>
                <div class="cert-header">
                  <span>{{ cert.name }}</span>
                  <el-tag :type="getCertStatus(cert.status)">{{ getCertStatusText(cert.status) }}</el-tag>
                </div>
              </template>
              <div class="cert-content">
                <p>证书编号：{{ cert.number }}</p>
                <p>发证日期：{{ cert.issueDate }}</p>
                <p>有效期至：{{ cert.expireDate }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑企业信息"
      v-model="dialogVisible"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <!-- 添加表单内容 -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 资质证书列表
const certificates = ref([
  {
    name: '高新技术企业证书',
    number: 'GR202337001234',
    issueDate: '2023-12-01',
    expireDate: '2026-11-30',
    status: 'valid'
  },
  {
    name: 'ISO9001质量管理体系认证',
    number: 'ISO9001-2021-1234',
    issueDate: '2022-06-01',
    expireDate: '2025-05-31',
    status: 'valid'
  },
  {
    name: '机器人生产许可证',
    number: 'RL-2021-0123',
    issueDate: '2023-01-01',
    expireDate: '2026-12-31',
    status: 'valid'
  },
  {
    name: '软件企业认定证书',
    number: 'R-2021-0123',
    issueDate: '2022-01-01',
    expireDate: '2024-12-31',
    status: 'warning'
  },
  {
    name: '进出口经营资质证书',
    number: 'IE-2020-0456',
    issueDate: '2021-07-01',
    expireDate: '2024-06-30',
    status: 'warning'
  },
  {
    name: '安全生产许可证',
    number: 'SP-2020-0789',
    issueDate: '2022-01-01',
    expireDate: '2025-12-31',
    status: 'valid'
  }
]);

// 获取证书状态类型
const getCertStatus = (status: string) => {
  const map: Record<string, string> = {
    valid: 'success',
    expired: 'danger',
    warning: 'warning'
  };
  return map[status] || 'info';
};

// 获取证书状态文本
const getCertStatusText = (status: string) => {
  const map: Record<string, string> = {
    valid: '有效',
    expired: '已过期',
    warning: '即将过期'
  };
  return map[status] || '未知';
};

// 对话框控制
const dialogVisible = ref(false);

// 编辑企业信息
const handleEdit = () => {
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = () => {
  ElMessage.success('保存成功');
  dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.company-info-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0;
    padding-left: 10px;
    border-left: 4px solid #409EFF;
  }

  .certificate-list {
    margin-top: 20px;

    .cert-card {
      margin-bottom: 20px;

      .cert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cert-content {
        p {
          margin: 8px 0;
          color: #666;
        }
      }
    }
  }

  :deep(.el-descriptions) {
    margin: 20px 0;
  }
}
</style> 