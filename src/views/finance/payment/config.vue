<template>
  <div class="payment-config-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-button @click="handleBack" :icon="ArrowLeft">返回</el-button>
          </div>
          <div class="right">
            <span>支付配置</span>
          </div>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="payment-form"
      >
        <!-- 支付宝配置 -->
        <el-divider content-position="left">支付宝配置</el-divider>
        <el-form-item label="支付宝状态" prop="alipay.enabled">
          <el-switch v-model="form.alipay.enabled" />
        </el-form-item>
        <el-form-item label="AppID" prop="alipay.appId">
          <el-input v-model="form.alipay.appId" placeholder="请输入支付宝AppID" />
        </el-form-item>
        <el-form-item label="商户私钥" prop="alipay.privateKey">
          <el-input
            v-model="form.alipay.privateKey"
            type="textarea"
            :rows="3"
            placeholder="请输入商户私钥"
          />
        </el-form-item>
        <el-form-item label="支付宝公钥" prop="alipay.publicKey">
          <el-input
            v-model="form.alipay.publicKey"
            type="textarea"
            :rows="3"
            placeholder="请输入支付宝公钥"
          />
        </el-form-item>
        <el-form-item label="回调地址" prop="alipay.notifyUrl">
          <el-input v-model="form.alipay.notifyUrl" placeholder="请输入支付回调地址" />
        </el-form-item>

        <!-- 微信支付配置 -->
        <el-divider content-position="left">微信支付配置</el-divider>
        <el-form-item label="微信支付状态" prop="wechat.enabled">
          <el-switch v-model="form.wechat.enabled" />
        </el-form-item>
        <el-form-item label="商户号" prop="wechat.mchId">
          <el-input v-model="form.wechat.mchId" placeholder="请输入微信商户号" />
        </el-form-item>
        <el-form-item label="AppID" prop="wechat.appId">
          <el-input v-model="form.wechat.appId" placeholder="请输入微信AppID" />
        </el-form-item>
        <el-form-item label="API密钥" prop="wechat.apiKey">
          <el-input v-model="form.wechat.apiKey" placeholder="请输入API密钥" />
        </el-form-item>
        <el-form-item label="回调地址" prop="wechat.notifyUrl">
          <el-input v-model="form.wechat.notifyUrl" placeholder="请输入支付回调地址" />
        </el-form-item>

        <!-- 银行卡支付配置 -->
        <el-divider content-position="left">银行卡支付配置</el-divider>
        <el-form-item label="银行卡支付状态" prop="bank.enabled">
          <el-switch v-model="form.bank.enabled" />
        </el-form-item>
        <el-form-item label="商户号" prop="bank.merchantId">
          <el-input v-model="form.bank.merchantId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="API密钥" prop="bank.apiKey">
          <el-input v-model="form.bank.apiKey" placeholder="请输入API密钥" />
        </el-form-item>
        <el-form-item label="回调地址" prop="bank.notifyUrl">
          <el-input v-model="form.bank.notifyUrl" placeholder="请输入支付回调地址" />
        </el-form-item>

        <!-- 通用配置 -->
        <el-divider content-position="left">通用配置</el-divider>
        <el-form-item label="支付超时时间" prop="common.timeout">
          <el-input-number
            v-model="form.common.timeout"
            :min="1"
            :max="60"
            placeholder="请输入支付超时时间(分钟)"
          />
        </el-form-item>
        <el-form-item label="自动关闭订单" prop="common.autoClose">
          <el-switch v-model="form.common.autoClose" />
        </el-form-item>
        <el-form-item label="支付通知" prop="common.notify">
          <el-checkbox-group v-model="form.common.notify">
            <el-checkbox label="email">邮件通知</el-checkbox>
            <el-checkbox label="sms">短信通知</el-checkbox>
            <el-checkbox label="webhook">Webhook通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存配置</el-button>
          <el-button @click="handleTest">测试配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const formRef = ref<FormInstance>();

// 表单数据
const form = reactive({
  alipay: {
    enabled: true,
    appId: '',
    privateKey: '',
    publicKey: '',
    notifyUrl: ''
  },
  wechat: {
    enabled: true,
    mchId: '',
    appId: '',
    apiKey: '',
    notifyUrl: ''
  },
  bank: {
    enabled: true,
    merchantId: '',
    apiKey: '',
    notifyUrl: ''
  },
  common: {
    timeout: 30,
    autoClose: true,
    notify: ['email', 'sms']
  }
});

// 表单验证规则
const rules = reactive<FormRules>({
  alipay: {
    appId: [{ required: true, message: '请输入支付宝AppID', trigger: 'blur' }],
    privateKey: [{ required: true, message: '请输入商户私钥', trigger: 'blur' }],
    publicKey: [{ required: true, message: '请输入支付宝公钥', trigger: 'blur' }],
    notifyUrl: [{ required: true, message: '请输入回调地址', trigger: 'blur' }]
  },
  wechat: {
    mchId: [{ required: true, message: '请输入微信商户号', trigger: 'blur' }],
    appId: [{ required: true, message: '请输入微信AppID', trigger: 'blur' }],
    apiKey: [{ required: true, message: '请输入API密钥', trigger: 'blur' }],
    notifyUrl: [{ required: true, message: '请输入回调地址', trigger: 'blur' }]
  },
  bank: {
    merchantId: [{ required: true, message: '请输入商户号', trigger: 'blur' }],
    apiKey: [{ required: true, message: '请输入API密钥', trigger: 'blur' }],
    notifyUrl: [{ required: true, message: '请输入回调地址', trigger: 'blur' }]
  }
});

// 返回上一页
const handleBack = () => {
  router.back();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API保存配置
      console.log('保存配置:', form);
      ElMessage.success('配置保存成功');
    }
  });
};

// 测试配置
const handleTest = () => {
  // 这里应该调用API测试支付配置
  ElMessage.info('正在测试支付配置...');
  setTimeout(() => {
    ElMessage.success('支付配置测试成功');
  }, 2000);
};
</script>

<style scoped lang="scss">
.payment-config-container {
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
    
    .right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  .payment-form {
    max-width: 800px;
    margin: 0 auto;
  }
}
</style> 