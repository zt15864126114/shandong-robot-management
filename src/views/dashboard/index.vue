<template>
  <div class="dashboard">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>欢迎使用山东纳智达机器人有限公司综合管理平台</span>
        </div>
      </template>
      <div class="card-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-statistic title="订单总数" :value="156">
              <template #suffix>个</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="本月营收" :value="52500">
              <template #prefix>¥</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="客户数量" :value="81">
              <template #suffix>位</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="供应商数量" :value="24">
              <template #suffix>家</template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.dashboard {
  .card-content {
    padding: 20px 0;
  }
}
</style> 