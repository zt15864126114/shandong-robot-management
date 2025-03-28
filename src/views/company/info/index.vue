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
        <el-descriptions-item label="法定代表人">徐伟举</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码">91370800MA94FCPE5E</el-descriptions-item>
        <el-descriptions-item label="注册资本">2000万元</el-descriptions-item>
        <el-descriptions-item label="企业类型">股份有限公司</el-descriptions-item>
        <el-descriptions-item label="成立日期">2021-07-08</el-descriptions-item>
        <el-descriptions-item label="经营范围">
          工业机器人、服务机器人、特种机器人的研发、生产、销售及技术服务；智能装备及零部件的设计、制造、销售；自动化系统集成及技术咨询；软件开发；进出口业务
        </el-descriptions-item>
        <el-descriptions-item label="注册地址">
          山东省济宁市汶上县中都街道华儒小镇25号楼
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
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称" />
        </el-form-item>
        
        <el-form-item label="法定代表人" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="请输入法定代表人姓名" />
        </el-form-item>
        
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        
        <el-form-item label="注册资本" prop="registeredCapital">
          <el-input-number 
            v-model="form.registeredCapital" 
            :min="0" 
            :precision="2" 
            :step="100" 
            style="width: 100%"
            placeholder="请输入注册资本"
          />
        </el-form-item>
        
        <el-form-item label="企业类型" prop="companyType">
          <el-select v-model="form.companyType" placeholder="请选择企业类型" style="width: 100%">
            <el-option label="股份有限公司" value="股份有限公司" />
            <el-option label="有限责任公司" value="有限责任公司" />
            <el-option label="合伙企业" value="合伙企业" />
            <el-option label="个人独资企业" value="个人独资企业" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="成立日期" prop="foundingDate">
          <el-date-picker
            v-model="form.foundingDate"
            type="date"
            placeholder="选择成立日期"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="经营范围" prop="businessScope">
          <el-input
            v-model="form.businessScope"
            type="textarea"
            :rows="3"
            placeholder="请输入经营范围"
          />
        </el-form-item>
        
        <el-form-item label="注册地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            :rows="2"
            placeholder="请输入注册地址"
          />
        </el-form-item>

        <el-divider>联系方式</el-divider>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        
        <el-form-item label="传真" prop="fax">
          <el-input v-model="form.fax" placeholder="请输入传真号码" />
        </el-form-item>
        
        <el-form-item label="企业网站" prop="website">
          <el-input v-model="form.website" placeholder="请输入企业网站" />
        </el-form-item>
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
    expireDate: '2025-12-31',
    status: 'warning'
  },
  {
    name: '进出口经营资质证书',
    number: 'IE-2020-0456',
    issueDate: '2021-07-01',
    expireDate: '2025-06-30',
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

// 企业基本信息
const companyInfo = ref({
  name: '山东纳智达机器人有限公司',
  legalPerson: '徐伟举',
  creditCode: '91370800MA94FCPE5E',
  registeredCapital: 2000,
  companyType: '股份有限公司',
  foundingDate: '2021-07-08',
  businessScope: '工业机器人、服务机器人、特种机器人的研发、生产、销售及技术服务；智能装备及零部件的设计、制造、销售；自动化系统集成及技术咨询；软件开发；进出口业务',
  address: '山东省济宁市汶上县中都街道华儒小镇25号楼',
  phone: '0531-88888888',
  email: 'contact@shandong-robot.com',
  fax: '0531-88888889',
  website: 'www.shandong-robot.com'
});

// 表单数据
const form = ref({ ...companyInfo.value });

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  legalPerson: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入正确的统一社会信用代码', trigger: 'blur' }
  ],
  registeredCapital: [{ required: true, message: '请输入注册资本', trigger: 'blur' }],
  companyType: [{ required: true, message: '请选择企业类型', trigger: 'change' }],
  foundingDate: [{ required: true, message: '请选择成立日期', trigger: 'change' }],
  businessScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],
  address: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^(\d{3,4}-?)?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  website: [
    { pattern: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, message: '请输入正确的网址', trigger: 'blur' }
  ]
};

// 对话框控制
const dialogVisible = ref(false);
const formRef = ref();

// 编辑企业信息
const handleEdit = () => {
  form.value = { ...companyInfo.value };
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    // 更新企业信息
    Object.assign(companyInfo.value, form.value);
    ElMessage.success('保存成功');
    dialogVisible.value = false;
  } catch (error) {
    console.error('表单验证失败:', error);
  }
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