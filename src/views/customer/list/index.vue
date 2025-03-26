<template>
  <div class="customer-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
              placeholder="请输入客户名称/联系人/电话"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="query.level" placeholder="客户等级" clearable style="width: 120px">
              <el-option label="普通客户" value="normal" />
              <el-option label="VIP客户" value="vip" />
              <el-option label="重点客户" value="important" />
            </el-select>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增客户</el-button>
        </div>
      </template>

      <div class="summary-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>总客户数</h3>
              <div class="number">{{ stats.total }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>本月新增</h3>
              <div class="number up">+{{ stats.newMonth }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>VIP客户</h3>
              <div class="number">{{ stats.vip }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="data-card">
              <h3>重点客户</h3>
              <div class="number">{{ stats.important }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="customerList" border style="width: 100%" height="100%" v-loading="loading">
          <el-table-column prop="name" label="客户名称" min-width="120" />
          <el-table-column prop="contact" label="联系人" min-width="100" />
          <el-table-column prop="phone" label="联系电话" min-width="120" />
          <el-table-column prop="level" label="客户等级" min-width="100">
            <template #default="{ row }">
              <el-tag :type="row.level === 'A' ? 'success' : row.level === 'B' ? 'warning' : 'info'">
                {{ row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="industry" label="所属行业" min-width="120">
            <template #default="{ row }">
              {{ getIndustryText(row.industry) }}
            </template>
          </el-table-column>
          <el-table-column prop="scale" label="企业规模" min-width="100">
            <template #default="{ row }">
              {{ getScaleText(row.scale) }}
            </template>
          </el-table-column>
          <el-table-column prop="annualRevenue" label="年营业额" min-width="120" />
          <el-table-column prop="lastContactTime" label="最近联系" min-width="120" />
          <el-table-column prop="nextContactTime" label="下次联系" min-width="120" />
          <el-table-column prop="tags" label="客户标签" min-width="200">
            <template #default="{ row }">
              <el-tag
                v-for="tag in row.tags"
                :key="tag"
                :type="getTagType(tag)"
                class="mx-1"
                style="margin-right: 4px"
              >
                {{ getTagText(tag) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <a @click="handleEdit(row)">编辑</a>
                <a @click="handleView(row)">查看</a>
                <a class="danger" @click="handleDelete(row)">删除</a>
              </div>
            </template>
          </el-table-column>
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

    <el-dialog
      v-model="dialogs.form"
      :title="formType === 'add' ? '新增客户' : '编辑客户'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="客户等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择客户等级" style="width: 100%">
            <el-option label="普通客户" value="normal" />
            <el-option label="VIP客户" value="vip" />
            <el-option label="重点客户" value="important" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="所属行业" prop="industry">
          <el-select v-model="form.industry" placeholder="请选择所属行业" style="width: 100%">
            <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模" prop="scale">
          <el-select v-model="form.scale" placeholder="请选择企业规模" style="width: 100%">
            <el-option v-for="item in scaleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年营业额" prop="annualRevenue">
          <el-input v-model="form.annualRevenue" placeholder="请输入年营业额" />
        </el-form-item>
        <el-form-item label="企业网站" prop="website">
          <el-input v-model="form.website" placeholder="请输入企业网站" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="form.fax" placeholder="请输入传真" />
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input v-model="form.businessScope" placeholder="请输入经营范围" />
        </el-form-item>
        <el-form-item label="合作历史" prop="cooperationHistory">
          <el-input v-model="form.cooperationHistory" placeholder="请输入合作历史" />
        </el-form-item>
        <el-form-item label="最近联系时间" prop="lastContactTime">
          <el-input v-model="form.lastContactTime" placeholder="请输入最近联系时间" />
        </el-form-item>
        <el-form-item label="下次联系时间" prop="nextContactTime">
          <el-input v-model="form.nextContactTime" placeholder="请输入下次联系时间" />
        </el-form-item>
        <el-form-item label="营销备注" prop="marketingNotes">
          <el-input v-model="form.marketingNotes" placeholder="请输入营销备注" />
        </el-form-item>
        <el-form-item label="客户标签" prop="tags">
          <el-select v-model="form.tags" placeholder="请选择客户标签" style="width: 100%" multiple>
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.form = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogs.view"
      title="客户详情"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户名称">{{ currentRow?.name }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ currentRow?.contact }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentRow?.phone }}</el-descriptions-item>
            <el-descriptions-item label="客户等级">
              <el-tag :type="currentRow?.level === 'A' ? 'success' : currentRow?.level === 'B' ? 'warning' : 'info'">
                {{ currentRow?.level }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="所属行业">{{ getIndustryText(currentRow?.industry) }}</el-descriptions-item>
            <el-descriptions-item label="企业规模">{{ getScaleText(currentRow?.scale) }}</el-descriptions-item>
            <el-descriptions-item label="年营业额">{{ currentRow?.annualRevenue }}</el-descriptions-item>
            <el-descriptions-item label="企业网站">{{ currentRow?.website }}</el-descriptions-item>
            <el-descriptions-item label="电子邮箱">{{ currentRow?.email }}</el-descriptions-item>
            <el-descriptions-item label="传真">{{ currentRow?.fax }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{ currentRow?.address }}</el-descriptions-item>
            <el-descriptions-item label="经营范围" :span="2">{{ currentRow?.businessScope }}</el-descriptions-item>
            <el-descriptions-item label="合作历史" :span="2">{{ currentRow?.cooperationHistory }}</el-descriptions-item>
            <el-descriptions-item label="最近联系时间">{{ currentRow?.lastContactTime }}</el-descriptions-item>
            <el-descriptions-item label="下次联系时间">{{ currentRow?.nextContactTime }}</el-descriptions-item>
            <el-descriptions-item label="营销备注" :span="2">{{ currentRow?.marketingNotes }}</el-descriptions-item>
            <el-descriptions-item label="客户标签" :span="2">
              <el-tag
                v-for="tag in currentRow?.tags"
                :key="tag"
                :type="getTagType(tag)"
                class="mx-1"
                style="margin-right: 4px"
              >
                {{ getTagText(tag) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        
        <el-tab-pane label="跟踪记录" name="tracking">
          <div class="tracking-header">
            <el-button type="primary" :icon="Plus" @click="handleTracking(currentRow)">添加跟踪记录</el-button>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(tracking, index) in trackingRecords"
              :key="index"
              :timestamp="tracking.time"
              :type="tracking.type"
            >
              <h4>{{ tracking.title }}</h4>
              <p>{{ tracking.content }}</p>
              <div class="tracking-footer">
                <span>记录人：{{ tracking.recorder }}</span>
                <div class="operation-buttons">
                  <el-button type="primary" text @click="handleEditTracking(tracking)">编辑</el-button>
                  <el-button type="danger" text @click="handleDeleteTracking(tracking)">删除</el-button>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        
        <el-tab-pane label="营销活动" name="marketing">
          <div class="marketing-header">
            <el-button type="primary" :icon="Plus" @click="handleMarketing(currentRow)">添加营销活动</el-button>
          </div>
          <el-table :data="marketingRecords" border style="width: 100%">
            <el-table-column prop="time" label="活动时间" width="180" />
            <el-table-column prop="type" label="活动类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getMarketingTypeTag(row.type)">{{ getMarketingTypeText(row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="活动主题" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getMarketingStatusType(row.status)">
                  {{ getMarketingStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <div class="operation-buttons">
                  <el-button type="primary" text @click="handleEditMarketing(row)">编辑</el-button>
                  <el-button type="success" text @click="handleViewMarketing(row)">查看</el-button>
                  <el-button type="danger" text @click="handleDeleteMarketing(row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogs.view = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加跟踪记录对话框 -->
    <el-dialog
      v-model="dialogs.tracking"
      title="添加跟踪记录"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="trackingFormRef"
        :model="trackingForm"
        :rules="trackingRules"
        label-width="100px"
      >
        <el-form-item label="客户名称">
          <span>{{ currentRow?.name }}</span>
        </el-form-item>
        <el-form-item label="跟踪类型" prop="type">
          <el-select v-model="trackingForm.type" placeholder="请选择跟踪类型">
            <el-option label="电话沟通" value="phone" />
            <el-option label="邮件沟通" value="email" />
            <el-option label="上门拜访" value="visit" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟踪时间" prop="time">
          <el-date-picker
            v-model="trackingForm.time"
            type="datetime"
            placeholder="选择跟踪时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="跟踪内容" prop="content">
          <el-input
            v-model="trackingForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入跟踪内容"
          />
        </el-form-item>
        <el-form-item label="下次跟进" prop="nextTime">
          <el-date-picker
            v-model="trackingForm.nextTime"
            type="datetime"
            placeholder="选择下次跟进时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.tracking = false">取消</el-button>
        <el-button type="primary" @click="handleTrackingSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加营销活动对话框 -->
    <el-dialog
      v-model="dialogs.marketing"
      title="添加营销活动"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="marketingFormRef"
        :model="marketingForm"
        :rules="marketingRules"
        label-width="100px"
      >
        <el-form-item label="客户名称">
          <span>{{ currentRow?.name }}</span>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="marketingForm.type" placeholder="请选择活动类型">
            <el-option label="产品推介" value="product" />
            <el-option label="技术交流" value="technical" />
            <el-option label="客户回访" value="visit" />
            <el-option label="展会活动" value="exhibition" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            v-model="marketingForm.time"
            type="datetime"
            placeholder="选择活动时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="marketingForm.location" placeholder="请输入活动地点" />
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <el-input
            v-model="marketingForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入活动内容"
          />
        </el-form-item>
        <el-form-item label="预期效果" prop="expected">
          <el-input
            v-model="marketingForm.expected"
            type="textarea"
            :rows="3"
            placeholder="请输入预期效果"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogs.marketing = false">取消</el-button>
        <el-button type="primary" @click="handleMarketingSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看营销活动详情对话框 -->
    <el-dialog
      v-model="dialogs.viewMarketing"
      title="营销活动详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="活动主题">{{ currentMarketing?.title }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">
          <el-tag :type="getMarketingTypeTag(currentMarketing?.type)">
            {{ getMarketingTypeText(currentMarketing?.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动时间">{{ currentMarketing?.time }}</el-descriptions-item>
        <el-descriptions-item label="活动状态">
          <el-tag :type="getMarketingStatusType(currentMarketing?.status)">
            {{ getMarketingStatusText(currentMarketing?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动内容">{{ currentMarketing?.content }}</el-descriptions-item>
        <el-descriptions-item label="预期效果">{{ currentMarketing?.expectedResult }}</el-descriptions-item>
        <el-descriptions-item label="实际效果">{{ currentMarketing?.actualResult || '暂无' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogs.viewMarketing = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Search, Plus, Edit, View, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

interface Customer {
  name: string;
  contact: string;
  phone: string;
  level: string;
  address: string;
  createTime: string;
}

// 查询参数
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  level: ''
});

// 客户列表
const customerList = ref([
  {
    id: 1,
    name: '山东科技职业学院',
    contact: '王德明',
    phone: '0531-82710568',
    level: 'A',
    industry: 'education',
    scale: 'large',
    annualRevenue: '5000万',
    website: 'www.sdtech.edu.cn',
    email: 'contact@sdtech.edu.cn',
    fax: '0531-85953667',
    address: '山东省济南市历城区',
    businessScope: '高等职业教育、技术培训、科研服务',
    cooperationHistory: '2020年合作机器人实训室建设，2021年合作智能制造实训基地建设',
    lastContactTime: '2025-03-15',
    nextContactTime: '2025-04-15',
    marketingNotes: '重点客户，每年有稳定的设备采购需求',
    tags: ['important', 'regular', 'high_value']
  },
  {
    id: 2,
    name: '济南智能制造有限公司',
    contact: '张建华',
    phone: '0531-67885498',
    level: 'B',
    industry: 'manufacturing',
    scale: 'medium',
    annualRevenue: '2000万',
    website: 'www.jnznzz.com',
    email: 'info@jnznzz.com',
    fax: '0531-88888889',
    address: '山东省济南市高新区',
    businessScope: '工业机器人应用、自动化生产线集成、智能制造解决方案',
    cooperationHistory: '2023年合作机器人应用项目',
    lastContactTime: '2025-03-18',
    nextContactTime: '2025-03-25',
    marketingNotes: '潜在重点客户，有扩大合作意向',
    tags: ['potential', 'strategic']
  },
  {
    id: 3,
    name: '青岛医疗设备有限公司',
    contact: '李志强',
    phone: '0532-66897669',
    level: 'A',
    industry: 'healthcare',
    scale: 'large',
    annualRevenue: '8000万',
    website: 'www.qdmedical.com',
    email: 'contact@qdmedical.com',
    fax: '0532-85888889',
    address: '山东省青岛市崂山区',
    businessScope: '医疗设备研发、生产、销售',
    cooperationHistory: '2022年合作医疗机器人项目，2023年合作智能医疗设备项目',
    lastContactTime: '2025-03-20',
    nextContactTime: '2025-04-20',
    marketingNotes: '战略客户，有长期合作计划',
    tags: ['important', 'strategic', 'high_value']
  },
  {
    id: 4,
    name: '烟台自动化科技有限公司',
    contact: '刘伟',
    phone: '0535-6789198',
    level: 'B',
    industry: 'manufacturing',
    scale: 'medium',
    annualRevenue: '3000万',
    website: 'www.ytzdh.com',
    email: 'info@ytzdh.com',
    fax: '0535-6288889',
    address: '山东省烟台市开发区',
    businessScope: '自动化设备研发、生产、销售',
    cooperationHistory: '2023年合作自动化生产线项目',
    lastContactTime: '2025-03-22',
    nextContactTime: '2025-04-22',
    marketingNotes: '重点跟进客户，有较大采购意向',
    tags: ['potential', 'high_value']
  },
  {
    id: 5,
    name: '潍坊机器人研究院',
    contact: '赵明',
    phone: '0536-8234536',
    level: 'A',
    industry: 'it',
    scale: 'large',
    annualRevenue: '6000万',
    website: 'www.wfrobot.com',
    email: 'contact@wfrobot.com',
    fax: '0536-8888889',
    address: '山东省潍坊市高新区',
    businessScope: '机器人技术研发、人才培养、产业孵化',
    cooperationHistory: '2021年合作机器人研发项目，2022年合作人才培养项目',
    lastContactTime: '2025-03-25',
    nextContactTime: '2025-04-25',
    marketingNotes: '战略合作伙伴，长期合作客户',
    tags: ['important', 'strategic', 'regular']
  },
  {
    id: 6,
    name: '淄博智能装备有限公司',
    contact: '孙华',
    phone: '0533-5678236',
    level: 'B',
    industry: 'manufacturing',
    scale: 'medium',
    annualRevenue: '2500万',
    website: 'www.zbznzb.com',
    email: 'info@zbznzb.com',
    fax: '0533-8888889',
    address: '山东省淄博市张店区',
    businessScope: '智能装备制造、系统集成',
    cooperationHistory: '2023年合作智能装备项目',
    lastContactTime: '2025-03-28',
    nextContactTime: '2025-04-28',
    marketingNotes: '重点跟进客户，有采购意向',
    tags: ['potential', 'new']
  },
  {
    id: 7,
    name: '临沂工业自动化有限公司',
    contact: '周强',
    phone: '0539-7123456',
    level: 'C',
    industry: 'manufacturing',
    scale: 'small',
    annualRevenue: '1500万',
    website: 'www.lyzdh.com',
    email: 'contact@lyzdh.com',
    fax: '0539-8888889',
    address: '山东省临沂市兰山区',
    businessScope: '工业自动化设备销售、技术服务',
    cooperationHistory: '2023年合作自动化设备项目',
    lastContactTime: '2025-03-30',
    nextContactTime: '2025-04-30',
    marketingNotes: '新客户，需要重点跟进',
    tags: ['new', 'potential']
  },
  {
    id: 8,
    name: '济宁智能制造产业园',
    contact: '吴明',
    phone: '0537-3456798',
    level: 'A',
    industry: 'manufacturing',
    scale: 'large',
    annualRevenue: '10000万',
    website: 'www.jnznzz.com',
    email: 'info@jnznzz.com',
    fax: '0537-8888889',
    address: '山东省济宁市高新区',
    businessScope: '智能制造产业园区运营、企业孵化',
    cooperationHistory: '2022年合作产业园项目，2023年合作企业孵化项目',
    lastContactTime: '2025-04-01',
    nextContactTime: '2025-05-01',
    marketingNotes: '战略客户，有大量采购需求',
    tags: ['important', 'strategic', 'high_value']
  }
]);

// 总数
const total = ref(100);

// 统计数据
const stats = {
  total: 1526,
  newMonth: 85,
  vip: 386,
  important: 245
};

// 获取等级类型
const getLevelType = (level: string) => {
  const map: Record<string, string> = {
    normal: '',
    vip: 'success',
    important: 'warning'
  };
  return map[level] || '';
};

// 获取等级文本
const getLevelText = (level: string) => {
  const map: Record<string, string> = {
    normal: '普通客户',
    vip: 'VIP客户',
    important: '重点客户'
  };
  return map[level] || '未知';
};

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadCustomerList();
};

// 加载客户列表
const loadCustomerList = () => {
  // 这里应该调用API获取数据
  console.log('加载客户列表:', query.value);
};

// 对话框状态
const dialogs = reactive({
  form: false,
  view: false,
  tracking: false,
  marketing: false,
  viewMarketing: false
});

// 表单类型
const formType = ref<'add' | 'edit'>('add');

// 当前行数据
const currentRow = ref<Customer | null>(null);

// 表单数据
const form = reactive({
  name: '',
  contact: '',
  phone: '',
  level: '',
  address: '',
  industry: '', // 所属行业
  scale: '', // 企业规模
  annualRevenue: '', // 年营业额
  website: '', // 企业网站
  email: '', // 电子邮箱
  fax: '', // 传真
  businessScope: '', // 经营范围
  cooperationHistory: '', // 合作历史
  lastContactTime: '', // 最近联系时间
  nextContactTime: '', // 下次联系时间
  marketingNotes: '', // 营销备注
  tags: [] // 客户标签
});

// 表单规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  level: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
  scale: [{ required: true, message: '请选择企业规模', trigger: 'change' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();

// 新增客户
const handleAdd = () => {
  formType.value = 'add';
  Object.assign(form, {
    name: '',
    contact: '',
    phone: '',
    level: '',
    address: '',
    industry: '',
    scale: '',
    annualRevenue: '',
    website: '',
    email: '',
    fax: '',
    businessScope: '',
    cooperationHistory: '',
    lastContactTime: '',
    nextContactTime: '',
    marketingNotes: '',
    tags: []
  });
  dialogs.form = true;
};

// 编辑客户
const handleEdit = (row: any) => {
  formType.value = 'edit';
  Object.assign(form, {
    name: row.name,
    contact: row.contact,
    phone: row.phone,
    level: row.level,
    address: row.address,
    industry: row.industry,
    scale: row.scale,
    annualRevenue: row.annualRevenue,
    website: row.website,
    email: row.email,
    fax: row.fax,
    businessScope: row.businessScope,
    cooperationHistory: row.cooperationHistory,
    lastContactTime: row.lastContactTime,
    nextContactTime: row.nextContactTime,
    marketingNotes: row.marketingNotes,
    tags: row.tags
  });
  currentRow.value = row;
  dialogs.form = true;
};

// 查看客户
const handleView = (row: any) => {
  currentRow.value = row;
  dialogs.view = true;
};

// 删除客户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该客户吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除客户:', row);
    ElMessage.success('删除成功');
  }).catch(() => {});
};

// 分页大小改变
const handleSizeChange = () => {
  loadCustomerList();
};

// 页码改变
const handleCurrentChange = () => {
  loadCustomerList();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用API保存数据
      const now = new Date();
      const createTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-');

      if (formType.value === 'add') {
        customerList.value.unshift({
          id: customerList.value.length + 1,
          ...form,
          createTime
        });
        ElMessage.success('添加成功');
      } else {
        if (currentRow.value) {
          Object.assign(currentRow.value, form);
          ElMessage.success('修改成功');
        }
      }
      dialogs.form = false;
    }
  });
};

// 添加行业选项
const industryOptions = [
  { label: '制造业', value: 'manufacturing' },
  { label: '医疗健康', value: 'healthcare' },
  { label: '信息技术', value: 'it' },
  { label: '金融', value: 'finance' },
  { label: '教育', value: 'education' },
  { label: '其他', value: 'other' }
];

// 添加企业规模选项
const scaleOptions = [
  { label: '大型企业', value: 'large' },
  { label: '中型企业', value: 'medium' },
  { label: '小型企业', value: 'small' },
  { label: '微型企业', value: 'micro' }
];

// 添加客户标签选项
const tagOptions = [
  { label: '重点客户', value: 'important' },
  { label: '潜在客户', value: 'potential' },
  { label: '老客户', value: 'regular' },
  { label: '新客户', value: 'new' },
  { label: '高价值', value: 'high_value' },
  { label: '战略客户', value: 'strategic' }
];

// 添加辅助函数
const getIndustryText = (industry: string) => {
  const item = industryOptions.find(item => item.value === industry);
  return item ? item.label : '未知';
};

const getScaleText = (scale: string) => {
  const item = scaleOptions.find(item => item.value === scale);
  return item ? item.label : '未知';
};

const getTagType = (tag: string) => {
  const map: Record<string, string> = {
    important: 'danger',
    potential: 'warning',
    regular: 'success',
    new: 'info',
    high_value: 'primary',
    strategic: 'warning'
  };
  return map[tag] || 'info';
};

const getTagText = (tag: string) => {
  const item = tagOptions.find(item => item.value === tag);
  return item ? item.label : '未知';
};

// 添加新的响应式变量
const activeTab = ref('basic');
const trackingRecords = ref([
  {
    id: '1',
    title: '电话沟通产品需求',
    type: 'phone',
    content: '与客户讨论了新一代工业机器人的具体需求，包括精度要求、负载能力和应用场景。客户对产品性能表示满意，建议增加远程监控功能。',
    time: '2025-03-20 14:30:00',
    recorder: '张明'
  },
  {
    id: '2',
    title: '现场技术交流',
    type: 'visit',
    content: '前往客户工厂进行技术交流，参观了生产线，了解了实际应用场景。客户提出了一些优化建议，包括操作界面的人性化改进。',
    time: '2025-03-18 09:00:00',
    recorder: '李强'
  },
  {
    id: '3',
    title: '邮件确认合作细节',
    type: 'email',
    content: '通过邮件确认了产品规格、价格和交付时间等合作细节。客户同意先进行小批量试用，后续根据效果扩大采购规模。',
    time: '2025-03-15 16:20:00',
    recorder: '王芳'
  }
]);

const marketingRecords = ref([
  {
    id: '1',
    title: '工业机器人新品发布会',
    type: 'product',
    time: '2025-03-25 09:00:00',
    status: 'planned',
    content: '计划举办新一代工业机器人新品发布会，展示产品性能和应用案例。',
    expectedResult: '预计吸引50家潜在客户参与，达成3-5个意向订单。',
    actualResult: ''
  },
  {
    id: '2',
    title: '智能制造技术交流会',
    type: 'technical',
    time: '2025-03-22 14:00:00',
    status: 'ongoing',
    content: '组织技术专家团队进行智能制造解决方案交流，分享行业最新发展趋势。',
    expectedResult: '提升客户对产品的技术认知，促进深度合作。',
    actualResult: '客户对技术方案表示认可，计划进行深入合作。'
  },
  {
    id: '3',
    title: '客户回访活动',
    type: 'visit',
    time: '2025-03-20 10:00:00',
    status: 'completed',
    content: '回访重点客户，了解产品使用情况，收集改进建议。',
    expectedResult: '收集客户反馈，改进产品和服务质量。',
    actualResult: '收集到多条有价值的改进建议，客户满意度较高。'
  }
]);

// 跟踪记录表单
const trackingForm = reactive({
  type: '',
  time: '',
  content: '',
  nextTime: ''
});

// 营销活动表单
const marketingForm = reactive({
  type: '',
  time: '',
  location: '',
  content: '',
  expected: ''
});

// 表单规则
const trackingRules = reactive<FormRules>({
  type: [{ required: true, message: '请选择跟踪类型', trigger: 'change' }],
  time: [{ required: true, message: '请选择跟踪时间', trigger: 'change' }],
  content: [{ required: true, message: '请输入跟踪内容', trigger: 'blur' }],
  nextTime: [{ required: true, message: '请选择下次跟进时间', trigger: 'change' }]
});

const marketingRules = reactive<FormRules>({
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
  expected: [{ required: true, message: '请输入预期效果', trigger: 'blur' }]
});

const trackingFormRef = ref<FormInstance>();
const marketingFormRef = ref<FormInstance>();

// 添加跟踪记录
const handleTracking = (row: any) => {
  currentRow.value = row;
  trackingForm.type = '';
  trackingForm.time = '';
  trackingForm.content = '';
  trackingForm.nextTime = '';
  dialogs.tracking = true;
};

// 提交跟踪记录
const handleTrackingSubmit = async () => {
  if (!trackingFormRef.value) return;
  
  await trackingFormRef.value.validate((valid) => {
    if (valid) {
      console.log('跟踪记录:', {
        customerId: currentRow.value?.id,
        ...trackingForm
      });
      ElMessage.success('跟踪记录添加成功');
      dialogs.tracking = false;
    }
  });
};

// 添加营销活动
const handleMarketing = (row: any) => {
  currentRow.value = row;
  marketingForm.type = '';
  marketingForm.time = '';
  marketingForm.location = '';
  marketingForm.content = '';
  marketingForm.expected = '';
  dialogs.marketing = true;
};

// 提交营销活动
const handleMarketingSubmit = async () => {
  if (!marketingFormRef.value) return;
  
  await marketingFormRef.value.validate((valid) => {
    if (valid) {
      console.log('营销活动:', {
        customerId: currentRow.value?.id,
        ...marketingForm
      });
      ElMessage.success('营销活动添加成功');
      dialogs.marketing = false;
    }
  });
};

// 辅助函数
const getMarketingTypeTag = (type: string) => {
  const map: Record<string, string> = {
    product: 'primary',
    technical: 'success',
    visit: 'warning',
    exhibition: 'info',
    other: ''
  };
  return map[type] || '';
};

const getMarketingTypeText = (type: string) => {
  const map: Record<string, string> = {
    product: '产品推介',
    technical: '技术交流',
    visit: '客户回访',
    exhibition: '展会活动',
    other: '其他'
  };
  return map[type] || '未知';
};

const getMarketingStatusType = (status: string) => {
  const map: Record<string, string> = {
    planned: 'info',
    ongoing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return map[status] || '';
};

const getMarketingStatusText = (status: string) => {
  const map: Record<string, string> = {
    planned: '计划中',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status] || '未知';
};
</script>

<style scoped lang="scss">
.customer-container {
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
        color: #409EFF;

        &.up {
          color: #67C23A;
        }
      }
    }
  }

  .table-container {
    margin: 20px 0;
    height: 500px;
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .tracking-header,
  .marketing-header {
    margin-bottom: 20px;
  }

  .tracking-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    color: #666;
    font-size: 14px;

    .operation-buttons {
      display: flex;
      gap: 0;
    }
  }

  .operation-buttons {
    display: flex;
    gap: 8px;
    
    a {
      color: var(--el-color-primary);
      cursor: pointer;
      
      &:hover {
        color: var(--el-color-primary-light-3);
      }
      
      &.danger {
        color: var(--el-color-danger);
        
        &:hover {
          color: var(--el-color-danger-light-3);
        }
      }
      
      &.success {
        color: var(--el-color-success);
        
        &:hover {
          color: var(--el-color-success-light-3);
        }
      }
    }
  }
}
</style> 