<template>
  <div class="inventory-container">
    <div class="tabs-header">
      <div 
        v-for="tab in tabs" 
        :key="tab.name"
        :class="['tab-item', { active: activeTab === tab.name }]"
        @click="activeTab = tab.name"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="tab-content">
      <!-- 库存管理 -->
      <div v-if="activeTab === 'stock'">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="query.keyword"
                  placeholder="请输入商品编码/名称"
              style="width: 300px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
                <el-select v-model="query.category" placeholder="商品类别" clearable style="width: 120px">
                  <el-option label="机器人本体" value="robot" />
                  <el-option label="控制系统" value="control" />
                  <el-option label="传感器" value="sensor" />
                  <el-option label="电气元件" value="electrical" />
                  <el-option label="机械配件" value="mechanical" />
                </el-select>
                <el-select v-model="query.status" placeholder="库存状态" clearable style="width: 120px">
                  <el-option label="正常" value="normal" />
                  <el-option label="预警" value="warning" />
                  <el-option label="缺货" value="out" />
                </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
              <div class="right">
                <el-button type="primary" @click="handleAdd">新增商品</el-button>
                <el-button type="success" @click="handleStockIn">入库</el-button>
                <el-button type="warning" @click="handleStockOut">出库</el-button>
                <el-button type="info" @click="handleCheck">盘点</el-button>
              </div>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="inventoryList" border style="width: 100%" height="100%">
              <el-table-column prop="code" label="商品编码" width="120" />
              <el-table-column prop="name" label="商品名称" min-width="200" />
              <el-table-column prop="category" label="商品类别" width="120">
                <template #default="{ row }">
                  {{ getCategoryName(row.category) }}
                </template>
              </el-table-column>
              <el-table-column prop="spec" label="规格型号" width="150" />
          <el-table-column prop="unit" label="单位" width="80" />
              <el-table-column prop="quantity" label="库存数量" width="100" />
              <el-table-column prop="warningQuantity" label="预警数量" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
              <el-table-column prop="location" label="库位" width="120" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <div class="operation-buttons">
                <template v-if="row.status === 'normal'">
                  <a @click="handleStockIn(row)">入库</a>
                  <a @click="handleStockOut(row)">出库</a>
                  <a @click="handleCheck(row)">盘点</a>
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else-if="row.status === 'warning'">
                  <a @click="handleStockIn(row)">入库</a>
                  <a class="danger" @click="handleStockOut(row)">出库</a>
                  <a @click="handleCheck(row)">盘点</a>
                  <a @click="handleView(row)">查看</a>
                </template>
                <template v-else>
                  <a @click="handleStockIn(row)">入库</a>
                  <a @click="handleCheck(row)">盘点</a>
                  <a @click="handleView(row)">查看</a>
                </template>
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
      </div>

      <!-- 入库记录 -->
      <div v-if="activeTab === 'in'">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="left">
                <el-input
                  v-model="inQuery.keyword"
                  placeholder="请输入入库单号/商品名称"
                  style="width: 300px"
                  clearable
                  @keyup.enter="handleInSearch"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-select v-model="inQuery.type" placeholder="入库类型" clearable style="width: 120px">
                  <el-option label="采购入库" value="purchase" />
                  <el-option label="退货入库" value="return" />
                  <el-option label="其他入库" value="other" />
                </el-select>
                <el-date-picker
                  v-model="inQuery.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 240px"
                />
                <el-button type="primary" @click="handleInSearch">搜索</el-button>
              </div>
            </div>
          </template>

          <div class="table-container">
            <el-table :data="inList" border style="width: 100%" height="100%">
              <el-table-column prop="code" label="入库单号" min-width="180" />
              <el-table-column prop="type" label="入库类型" min-width="120">
                <template #default="{ row }">
                  {{ getInTypeText(row.type) }}
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="入库金额" min-width="120">
                <template #default="{ row }">
                  ¥{{ row.amount.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="操作人" min-width="120" />
              <el-table-column prop="createTime" label="入库时间" min-width="180" />
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="handleViewIn(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="inQuery.page"
              v-model:page-size="inQuery.pageSize"
              :total="inTotal"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              @size-change="handleInSizeChange"
              @current-change="handleInCurrentChange"
            />
          </div>
        </el-card>
      </div>

      <!-- 出库记录 -->
      <div v-if="activeTab === 'out'">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="left">
                <el-input
                  v-model="outQuery.keyword"
                  placeholder="请输入出库单号/商品名称"
                  style="width: 300px"
                  clearable
                  @keyup.enter="handleOutSearch"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-select v-model="outQuery.type" placeholder="出库类型" clearable style="width: 120px">
                  <el-option label="销售出库" value="sale" />
                  <el-option label="领用出库" value="use" />
                  <el-option label="其他出库" value="other" />
                </el-select>
                <el-date-picker
                  v-model="outQuery.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 240px"
                />
                <el-button type="primary" @click="handleOutSearch">搜索</el-button>
              </div>
            </div>
          </template>

          <div class="table-container">
            <el-table :data="outList" border style="width: 100%" height="100%">
              <el-table-column prop="code" label="出库单号" min-width="180" />
              <el-table-column prop="type" label="出库类型" min-width="120">
                <template #default="{ row }">
                  {{ getOutTypeText(row.type) }}
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="出库金额" min-width="120">
                <template #default="{ row }">
                  ¥{{ row.amount.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="操作人" min-width="120" />
              <el-table-column prop="createTime" label="出库时间" min-width="180" />
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="handleViewOut(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="outQuery.page"
              v-model:page-size="outQuery.pageSize"
              :total="outTotal"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              @size-change="handleOutSizeChange"
              @current-change="handleOutCurrentChange"
            />
          </div>
        </el-card>
      </div>

      <!-- 盘点记录 -->
      <div v-if="activeTab === 'check'">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="left">
                <el-input
                  v-model="checkQuery.keyword"
                  placeholder="请输入盘点单号/商品名称"
                  style="width: 300px"
                  clearable
                  @keyup.enter="handleCheckSearch"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-select v-model="checkQuery.status" placeholder="盘点状态" clearable style="width: 120px">
                  <el-option label="待盘点" value="pending" />
                  <el-option label="已盘点" value="completed" />
                  <el-option label="已调整" value="adjusted" />
                </el-select>
                <el-date-picker
                  v-model="checkQuery.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 240px"
                />
                <el-button type="primary" @click="handleCheckSearch">搜索</el-button>
              </div>
            </div>
          </template>

          <div class="table-container">
            <el-table :data="checkList" border style="width: 100%" height="100%">
              <el-table-column prop="code" label="盘点单号" min-width="180" />
              <el-table-column prop="status" label="状态" min-width="100">
                <template #default="{ row }">
                  <el-tag :type="getCheckStatusType(row.status)">
                    {{ getCheckStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="操作人" min-width="120" />
              <el-table-column prop="createTime" label="创建时间" min-width="180" />
              <el-table-column prop="completeTime" label="完成时间" min-width="180" />
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="{ row }">
                  <el-button 
                    v-if="row.status === 'pending'" 
                    link 
                    type="primary" 
                    @click="handleCheck(row)"
                  >
                    盘点
                  </el-button>
                  <el-button 
                    v-if="row.status === 'completed'" 
                    link 
                    type="success" 
                    @click="handleAdjust(row)"
                  >
                    调整
                  </el-button>
                  <el-button link type="primary" @click="handleViewCheck(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="checkQuery.page"
              v-model:page-size="checkQuery.pageSize"
              :total="checkTotal"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              @size-change="handleCheckSizeChange"
              @current-change="handleCheckCurrentChange"
            />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 商品表单对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.type === 'add' ? '新增商品' : dialog.type === 'edit' ? '编辑商品' : '商品详情'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="dialog.type === 'view'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入商品编码" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
        <el-form-item label="商品类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择商品类别" style="width: 100%">
                <el-option label="机器人本体" value="robot" />
                <el-option label="控制系统" value="control" />
                <el-option label="传感器" value="sensor" />
                <el-option label="电气元件" value="electrical" />
                <el-option label="机械配件" value="mechanical" />
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格型号" />
        </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
        <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预警数量" prop="warningQuantity">
              <el-input-number v-model="form.warningQuantity" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="库位" prop="location">
          <el-input v-model="form.location" placeholder="请输入库位" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button 
          v-if="dialog.type !== 'view'" 
          type="primary" 
          @click="handleSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 入库对话框 -->
    <el-dialog
      v-model="stockInDialog.visible"
      title="商品入库"
      width="800px"
    >
      <el-form
        ref="stockInFormRef"
        :model="stockInForm"
        :rules="stockInRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input v-model="stockInForm.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前库存">
              <el-input v-model="stockInForm.currentQuantity" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
        <el-form-item label="入库数量" prop="quantity">
              <el-input-number v-model="stockInForm.quantity" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库类型" prop="type">
              <el-select v-model="stockInForm.type" placeholder="请选择入库类型" style="width: 100%">
                <el-option label="采购入库" value="purchase" />
                <el-option label="退货入库" value="return" />
                <el-option label="其他入库" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="入库单号" prop="orderNo">
          <el-input v-model="stockInForm.orderNo" placeholder="请输入入库单号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="stockInForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockInDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleStockInSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 出库对话框 -->
    <el-dialog
      v-model="stockOutDialog.visible"
      title="商品出库"
      width="800px"
    >
      <el-form
        ref="stockOutFormRef"
        :model="stockOutForm"
        :rules="stockOutRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input v-model="stockOutForm.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前库存">
              <el-input v-model="stockOutForm.currentQuantity" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
        <el-form-item label="出库数量" prop="quantity">
              <el-input-number v-model="stockOutForm.quantity" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库类型" prop="type">
              <el-select v-model="stockOutForm.type" placeholder="请选择出库类型" style="width: 100%">
                <el-option label="销售出库" value="sale" />
                <el-option label="退货出库" value="return" />
                <el-option label="其他出库" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="出库单号" prop="orderNo">
          <el-input v-model="stockOutForm.orderNo" placeholder="请输入出库单号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="stockOutForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockOutDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleStockOutSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 盘点对话框 -->
    <el-dialog
      v-model="checkDialog.visible"
      title="库存盘点"
      width="800px"
    >
      <el-form
        ref="checkFormRef"
        :model="checkForm"
        :rules="checkRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input v-model="checkForm.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统库存">
              <el-input v-model="checkForm.systemQuantity" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="实际库存" prop="actualQuantity">
              <el-input-number v-model="checkForm.actualQuantity" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="差异数量">
              <el-input v-model="checkForm.diffQuantity" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="盘点单号" prop="orderNo">
          <el-input v-model="checkForm.orderNo" placeholder="请输入盘点单号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="checkForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="checkDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleCheckSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看入库记录对话框 -->
    <el-dialog
      v-model="viewInDialog.visible"
      title="入库记录详情"
      width="800px"
    >
      <el-form
        ref="viewInFormRef"
        :model="viewInDialog.data"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库单号">
              <el-input v-model="viewInDialog.data.code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库类型">
              <el-input v-model="viewInDialog.data.type" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库金额">
              <el-input v-model="viewInDialog.data.amount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人">
              <el-input v-model="viewInDialog.data.operator" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库时间">
              <el-input v-model="viewInDialog.data.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库产品">
              <el-table :data="viewInDialog.data.products" border>
                <el-table-column prop="name" label="商品名称" min-width="200" />
                <el-table-column prop="quantity" label="数量" width="100" />
                <el-table-column prop="price" label="单价" width="100" />
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="viewInDialog.data.remark" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="viewInDialog.visible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 查看出库记录对话框 -->
    <el-dialog
      v-model="viewOutDialog.visible"
      title="出库记录详情"
      width="800px"
    >
      <el-form
        ref="viewOutFormRef"
        :model="viewOutDialog.data"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出库单号">
              <el-input v-model="viewOutDialog.data.code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库类型">
              <el-input v-model="viewOutDialog.data.type" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出库金额">
              <el-input v-model="viewOutDialog.data.amount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人">
              <el-input v-model="viewOutDialog.data.operator" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出库时间">
              <el-input v-model="viewOutDialog.data.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库产品">
              <el-table :data="viewOutDialog.data.products" border>
                <el-table-column prop="name" label="商品名称" min-width="200" />
                <el-table-column prop="quantity" label="数量" width="100" />
                <el-table-column prop="price" label="单价" width="100" />
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="viewOutDialog.data.remark" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="viewOutDialog.visible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 查看盘点记录对话框 -->
    <el-dialog
      v-model="viewCheckDialog.visible"
      title="盘点记录详情"
      width="800px"
    >
      <el-form
        ref="viewCheckFormRef"
        :model="viewCheckDialog.data"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="盘点单号">
              <el-input v-model="viewCheckDialog.data.code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盘点状态">
              <el-input v-model="viewCheckDialog.data.status" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作人">
              <el-input v-model="viewCheckDialog.data.operator" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input v-model="viewCheckDialog.data.createTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="完成时间">
              <el-input v-model="viewCheckDialog.data.completeTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盘点产品">
              <el-table :data="viewCheckDialog.data.products" border>
                <el-table-column prop="name" label="商品名称" min-width="200" />
                <el-table-column prop="systemQuantity" label="系统库存" width="100" />
                <el-table-column prop="actualQuantity" label="实际库存" width="100" />
                <el-table-column prop="diffQuantity" label="差异数量" width="100" />
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="viewCheckDialog.data.remark" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="viewCheckDialog.visible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// 当前激活的标签页
const activeTab = ref('stock');

// 标签页配置
const tabs = [
  { name: 'stock', label: '库存管理' },
  { name: 'in', label: '入库记录' },
  { name: 'out', label: '出库记录' },
  { name: 'check', label: '盘点记录' }
];

// 初始化数据
onMounted(() => {
  // 确保组件挂载后再进行数据初始化
  loadData();
});

// 查询条件
const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  category: '',
  status: ''
});

// 库存列表
const inventoryList = ref([
  {
    id: 1,
    code: 'SP001',
    name: '发那科机器人 CR-7iA',
    category: 'robot',
    spec: 'CR-7iA',
    unit: '台',
    quantity: 5,
    warningQuantity: 2,
    status: 'normal',
    location: 'A-01-01',
    remark: '6轴机器人'
  },
  {
    id: 2,
    code: 'SP002',
    name: '安川机器人 GP8',
    category: 'robot',
    spec: 'GP8',
    unit: '台',
    quantity: 3,
    warningQuantity: 2,
    status: 'warning',
    location: 'A-01-02',
    remark: '6轴机器人'
  },
  {
    id: 3,
    code: 'SP003',
    name: '西门子S7-1500 PLC',
    category: 'control',
    spec: 'S7-1500',
    unit: '台',
    quantity: 10,
    warningQuantity: 5,
    status: 'normal',
    location: 'B-01-01',
    remark: '可编程控制器'
  },
  {
    id: 4,
    code: 'SP004',
    name: '欧姆龙光电传感器',
    category: 'sensor',
    spec: 'E3Z-T61',
    unit: '个',
    quantity: 100,
    warningQuantity: 20,
    status: 'normal',
    location: 'C-01-01',
    remark: '对射型传感器'
  },
  {
    id: 5,
    code: 'SP005',
    name: '倍加福接近开关',
    category: 'sensor',
    spec: 'NBB4-12GM50-E0',
    unit: '个',
    quantity: 15,
    warningQuantity: 10,
    status: 'out',
    location: 'C-01-02',
    remark: '电感式接近开关'
  },
  {
    id: 6,
    code: 'SP006',
    name: '施耐德断路器',
    category: 'electrical',
    spec: 'NSX100F',
    unit: '个',
    quantity: 20,
    warningQuantity: 5,
    status: 'normal',
    location: 'D-01-01',
    remark: '塑壳断路器'
  },
  {
    id: 7,
    code: 'SP007',
    name: '菲尼克斯端子',
    category: 'electrical',
    spec: 'PT 2.5/4',
    unit: '个',
    quantity: 500,
    warningQuantity: 100,
    status: 'normal',
    location: 'D-01-02',
    remark: '接线端子'
  },
  {
    id: 8,
    code: 'SP008',
    name: '易格斯拖链',
    category: 'mechanical',
    spec: 'E2.1',
    unit: '米',
    quantity: 50,
    warningQuantity: 10,
    status: 'normal',
    location: 'E-01-01',
    remark: '电缆拖链'
  },
  {
    id: 9,
    code: 'SP009',
    name: '堡盟编码器',
    category: 'sensor',
    spec: 'BHK 16.24',
    unit: '个',
    quantity: 8,
    warningQuantity: 5,
    status: 'warning',
    location: 'C-01-03',
    remark: '增量式编码器'
  },
  {
    id: 10,
    code: 'SP010',
    name: '威图控制柜',
    category: 'electrical',
    spec: 'TS 8',
    unit: '个',
    quantity: 3,
    warningQuantity: 1,
    status: 'normal',
    location: 'B-01-02',
    remark: '控制柜'
  },
  {
    id: 11,
    code: 'SP011',
    name: '三菱伺服电机',
    category: 'electrical',
    spec: 'HG-KR43',
    unit: '台',
    quantity: 12,
    warningQuantity: 3,
    status: 'normal',
    location: 'D-02-01',
    remark: '400W伺服电机'
  },
  {
    id: 12,
    code: 'SP012',
    name: '基恩士视觉系统',
    category: 'sensor',
    spec: 'CV-X150F',
    unit: '套',
    quantity: 2,
    warningQuantity: 1,
    status: 'normal',
    location: 'C-02-01',
    remark: '机器视觉检测系统'
  },
  {
    id: 13,
    code: 'SP013',
    name: '雷尼绍测量系统',
    category: 'sensor',
    spec: 'RMP60',
    unit: '套',
    quantity: 1,
    warningQuantity: 1,
    status: 'warning',
    location: 'C-02-02',
    remark: '机床测头系统'
  },
  {
    id: 14,
    code: 'SP014',
    name: '图尔克接近开关',
    category: 'sensor',
    spec: 'BI5-M18-AP6X',
    unit: '个',
    quantity: 45,
    warningQuantity: 10,
    status: 'normal',
    location: 'C-02-03',
    remark: '金属接近开关'
  },
  {
    id: 15,
    code: 'SP015',
    name: '魏德米勒端子',
    category: 'electrical',
    spec: 'WDU 2.5',
    unit: '个',
    quantity: 800,
    warningQuantity: 200,
    status: 'normal',
    location: 'D-02-02',
    remark: '接线端子'
  },
  {
    id: 16,
    code: 'SP016',
    name: '库卡机器人',
    category: 'robot',
    spec: 'KR10 R1100',
    unit: '台',
    quantity: 1,
    warningQuantity: 1,
    status: 'warning',
    location: 'A-02-01',
    remark: '6轴机器人'
  },
  {
    id: 17,
    code: 'SP017',
    name: '欧姆龙PLC',
    category: 'control',
    spec: 'NX1P2',
    unit: '台',
    quantity: 5,
    warningQuantity: 2,
    status: 'normal',
    location: 'B-02-01',
    remark: '可编程控制器'
  },
  {
    id: 18,
    code: 'SP018',
    name: '邦纳光电传感器',
    category: 'sensor',
    spec: 'QS18VP6',
    unit: '个',
    quantity: 30,
    warningQuantity: 8,
    status: 'normal',
    location: 'C-02-04',
    remark: '漫反射型传感器'
  },
  {
    id: 19,
    code: 'SP019',
    name: '力士乐气缸',
    category: 'mechanical',
    spec: 'R480',
    unit: '个',
    quantity: 15,
    warningQuantity: 5,
    status: 'normal',
    location: 'E-02-01',
    remark: '标准气缸'
  },
  {
    id: 20,
    code: 'SP020',
    name: '施耐德变频器',
    category: 'electrical',
    spec: 'ATV320',
    unit: '台',
    quantity: 0,
    warningQuantity: 2,
    status: 'out',
    location: 'D-02-03',
    remark: '通用变频器'
  }
]);

const total = ref(100);

// 对话框状态
const dialog = reactive({
  visible: false,
  type: 'add' as 'add' | 'edit' | 'view'
});

// 入库对话框
const stockInDialog = reactive({
  visible: false
});

// 出库对话框
const stockOutDialog = reactive({
  visible: false
});

// 盘点对话框
const checkDialog = reactive({
  visible: false
});

// 表单数据
const form = reactive({
  code: '',
  name: '',
  category: '',
  spec: '',
  unit: '',
  warningQuantity: 0,
  location: '',
  remark: ''
});

// 入库表单
const stockInForm = reactive({
  id: '',
  name: '',
  currentQuantity: 0,
  quantity: 1,
  type: '',
  orderNo: '',
  remark: ''
});

// 出库表单
const stockOutForm = reactive({
  id: '',
  name: '',
  currentQuantity: 0,
  quantity: 1,
  type: '',
  orderNo: '',
  remark: ''
});

// 盘点表单
const checkForm = reactive({
  id: '',
  name: '',
  systemQuantity: 0,
  actualQuantity: 0,
  diffQuantity: 0,
  orderNo: '',
  remark: ''
});

// 表单规则
const rules = reactive<FormRules>({
  code: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品类别', trigger: 'change' }],
  spec: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  warningQuantity: [{ required: true, message: '请输入预警数量', trigger: 'blur' }],
  location: [{ required: true, message: '请输入库位', trigger: 'blur' }]
});

// 入库表单规则
const stockInRules = reactive<FormRules>({
  quantity: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
  type: [{ required: true, message: '请选择入库类型', trigger: 'change' }],
  orderNo: [{ required: true, message: '请输入入库单号', trigger: 'blur' }]
});

// 出库表单规则
const stockOutRules = reactive<FormRules>({
  quantity: [{ required: true, message: '请输入出库数量', trigger: 'blur' }],
  type: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
  orderNo: [{ required: true, message: '请输入出库单号', trigger: 'blur' }]
});

// 盘点表单规则
const checkRules = reactive<FormRules>({
  actualQuantity: [{ required: true, message: '请输入实际库存', trigger: 'blur' }],
  orderNo: [{ required: true, message: '请输入盘点单号', trigger: 'blur' }]
});

const formRef = ref<FormInstance>();
const stockInFormRef = ref<FormInstance>();
const stockOutFormRef = ref<FormInstance>();
const checkFormRef = ref<FormInstance>();

// 获取类别名称
const getCategoryName = (category: string) => {
  const map: Record<string, string> = {
    robot: '机器人本体',
    control: '控制系统',
    sensor: '传感器',
    electrical: '电气元件',
    mechanical: '机械配件'
  };
  return map[category] || category;
};

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    normal: 'success',
    warning: 'warning',
    out: 'danger'
  };
  return map[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    out: '缺货'
  };
  return map[status] || status;
};

// 计算盘点差异
const calculateDiff = computed(() => {
  return checkForm.actualQuantity - checkForm.systemQuantity;
});

// 搜索
const handleSearch = () => {
  query.value.page = 1;
  loadData();
};

// 加载数据
const loadData = () => {
  // TODO: 调用API获取数据
  console.log('加载库存列表:', query.value);
};

// 新增商品
const handleAdd = () => {
  dialog.type = 'add';
  Object.assign(form, {
    code: '',
    name: '',
    category: '',
    spec: '',
    unit: '',
    warningQuantity: 0,
    location: '',
    remark: ''
  });
  dialog.visible = true;
};

// 编辑商品
const handleEdit = (row: any) => {
  dialog.type = 'edit';
  Object.assign(form, row);
  dialog.visible = true;
};

// 查看商品
const handleView = (row: any) => {
  dialog.type = 'view';
  Object.assign(form, row);
  dialog.visible = true;
};

// 入库
const handleStockIn = (row: any) => {
  Object.assign(stockInForm, {
    id: row.id,
    name: row.name,
    currentQuantity: row.quantity,
    quantity: 1,
    type: '',
    orderNo: '',
    remark: ''
  });
  stockInDialog.visible = true;
};

// 出库
const handleStockOut = (row: any) => {
  Object.assign(stockOutForm, {
    id: row.id,
    name: row.name,
    currentQuantity: row.quantity,
    quantity: 1,
    type: '',
    orderNo: '',
    remark: ''
  });
  stockOutDialog.visible = true;
};

// 盘点
const handleCheck = (row: any) => {
  Object.assign(checkForm, {
    id: row.id,
    name: row.name,
    systemQuantity: row.quantity,
    actualQuantity: row.quantity,
    diffQuantity: 0,
    orderNo: '',
    remark: ''
  });
  checkDialog.visible = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialog.type === 'add') {
        inventoryList.value.unshift({
          id: inventoryList.value.length + 1,
          ...form,
          quantity: 0,
          status: 'out'
        });
        ElMessage.success('添加成功');
      } else {
        const index = inventoryList.value.findIndex(item => item.id === form.id);
        if (index !== -1) {
          Object.assign(inventoryList.value[index], form);
          ElMessage.success('修改成功');
        }
      }
      dialog.visible = false;
    }
  });
};

// 提交入库
const handleStockInSubmit = async () => {
  if (!stockInFormRef.value) return;
  
  await stockInFormRef.value.validate((valid) => {
    if (valid) {
      const index = inventoryList.value.findIndex(item => item.id === stockInForm.id);
      if (index !== -1) {
        const item = inventoryList.value[index];
        item.quantity += stockInForm.quantity;
        item.status = item.quantity <= item.warningQuantity ? 'warning' : 'normal';
        ElMessage.success('入库成功');
      }
      stockInDialog.visible = false;
    }
  });
};

// 提交出库
const handleStockOutSubmit = async () => {
  if (!stockOutFormRef.value) return;
  
  await stockOutFormRef.value.validate((valid) => {
    if (valid) {
      const index = inventoryList.value.findIndex(item => item.id === stockOutForm.id);
      if (index !== -1) {
        const item = inventoryList.value[index];
        if (item.quantity < stockOutForm.quantity) {
          ElMessage.error('库存不足');
          return;
        }
        item.quantity -= stockOutForm.quantity;
        item.status = item.quantity === 0 ? 'out' : item.quantity <= item.warningQuantity ? 'warning' : 'normal';
        ElMessage.success('出库成功');
      }
      stockOutDialog.visible = false;
    }
  });
};

// 提交盘点
const handleCheckSubmit = async () => {
  if (!checkFormRef.value) return;
  
  await checkFormRef.value.validate((valid) => {
    if (valid) {
      const index = inventoryList.value.findIndex(item => item.id === checkForm.id);
      if (index !== -1) {
        const item = inventoryList.value[index];
        item.quantity = checkForm.actualQuantity;
        item.status = item.quantity === 0 ? 'out' : item.quantity <= item.warningQuantity ? 'warning' : 'normal';
        ElMessage.success('盘点成功');
      }
      checkDialog.visible = false;
    }
  });
};

// 分页
const handleSizeChange = () => {
  loadData();
};

const handleCurrentChange = () => {
  loadData();
};

// 入库记录查询条件
const inQuery = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  type: '',
  dateRange: [] as string[]
});

// 入库记录列表
const inList = ref([
  {
    id: 1,
    code: 'RK20250301001',
    type: 'purchase',
    amount: 150000.00,
    operator: '刘明阳',
    createTime: '2025-03-01 10:00:00',
    products: [
      { name: '发那科机器人 CR-7iA', quantity: 2, price: 75000.00 }
    ],
    remark: '采购入库-机器人本体'
  },
  {
    id: 2,
    code: 'RK20250301002',
    type: 'return',
    amount: 50000.00,
    operator: '王建国',
    createTime: '2025-03-01 14:30:00',
    products: [
      { name: '西门子S7-1500 PLC', quantity: 5, price: 10000.00 }
    ],
    remark: '退货入库-控制系统'
  },
  {
    id: 3,
    code: 'RK20250302001',
    type: 'purchase',
    amount: 280000.00,
    operator: '张志强',
    createTime: '2025-03-02 09:15:00',
    products: [
      { name: '安川机器人 GP8', quantity: 4, price: 70000.00 }
    ],
    remark: '采购入库-机器人本体'
  },
  {
    id: 4,
    code: 'RK20250302002',
    type: 'purchase',
    amount: 95000.00,
    operator: '陈海波',
    createTime: '2025-03-02 11:20:00',
    products: [
      { name: '西门子S7-1500 PLC', quantity: 8, price: 11875.00 }
    ],
    remark: '采购入库-控制系统'
  },
  {
    id: 5,
    code: 'RK20250302003',
    type: 'other',
    amount: 12000.00,
    operator: '李伟东',
    createTime: '2025-03-02 15:45:00',
    products: [
      { name: '欧姆龙光电传感器', quantity: 50, price: 240.00 }
    ],
    remark: '其他入库-传感器'
  },
  {
    id: 6,
    code: 'RK20250303001',
    type: 'purchase',
    amount: 85000.00,
    operator: '张志强',
    createTime: '2025-03-03 09:30:00',
    products: [
      { name: '三菱伺服电机', quantity: 5, price: 17000.00 }
    ],
    remark: '采购入库-电气设备'
  },
  {
    id: 7,
    code: 'RK20250303002',
    type: 'purchase',
    amount: 180000.00,
    operator: '王建国',
    createTime: '2025-03-03 11:15:00',
    products: [
      { name: '基恩士视觉系统', quantity: 1, price: 180000.00 }
    ],
    remark: '采购入库-视觉系统'
  },
  {
    id: 8,
    code: 'RK20250303003',
    type: 'return',
    amount: 15000.00,
    operator: '陈海波',
    createTime: '2025-03-03 14:20:00',
    products: [
      { name: '图尔克接近开关', quantity: 20, price: 750.00 }
    ],
    remark: '退货入库-传感器'
  },
  {
    id: 9,
    code: 'RK20250304001',
    type: 'purchase',
    amount: 320000.00,
    operator: '刘明阳',
    createTime: '2025-03-04 10:00:00',
    products: [
      { name: '库卡机器人', quantity: 1, price: 320000.00 }
    ],
    remark: '采购入库-机器人本体'
  },
  {
    id: 10,
    code: 'RK20250304002',
    type: 'purchase',
    amount: 45000.00,
    operator: '李伟东',
    createTime: '2025-03-04 13:30:00',
    products: [
      { name: '欧姆龙PLC', quantity: 3, price: 15000.00 }
    ],
    remark: '采购入库-控制系统'
  },
  {
    id: 11,
    code: 'RK20250304003',
    type: 'other',
    amount: 12000.00,
    operator: '张志强',
    createTime: '2025-03-04 15:45:00',
    products: [
      { name: '邦纳光电传感器', quantity: 15, price: 800.00 }
    ],
    remark: '其他入库-备用传感器'
  },
  {
    id: 12,
    code: 'RK20250305001',
    type: 'purchase',
    amount: 25000.00,
    operator: '王建国',
    createTime: '2025-03-05 09:20:00',
    products: [
      { name: '力士乐气缸', quantity: 10, price: 2500.00 }
    ],
    remark: '采购入库-机械配件'
  },
  {
    id: 13,
    code: 'RK20250305002',
    type: 'purchase',
    amount: 48000.00,
    operator: '陈海波',
    createTime: '2025-03-05 11:40:00',
    products: [
      { name: '施耐德变频器', quantity: 4, price: 12000.00 }
    ],
    remark: '采购入库-电气设备'
  }
]);

const inTotal = ref(100);

// 出库记录查询条件
const outQuery = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  type: '',
  dateRange: [] as string[]
});

// 出库记录列表
const outList = ref([
  {
    id: 1,
    code: 'CK20250301001',
    type: 'sale',
    amount: 200000.00,
    operator: '刘明阳',
    createTime: '2025-03-01 09:00:00',
    products: [
      { name: '发那科机器人 CR-7iA', quantity: 2, price: 100000.00 }
    ],
    remark: '销售出库-客户：山东智能制造有限公司'
  },
  {
    id: 2,
    code: 'CK20250301002',
    type: 'use',
    amount: 30000.00,
    operator: '王建国',
    createTime: '2025-03-01 16:00:00',
    products: [
      { name: '西门子S7-1500 PLC', quantity: 3, price: 10000.00 }
    ],
    remark: '领用出库-项目：自动化生产线改造'
  },
  {
    id: 3,
    code: 'CK20250302001',
    type: 'sale',
    amount: 350000.00,
    operator: '张志强',
    createTime: '2025-03-02 10:30:00',
    products: [
      { name: '安川机器人 GP8', quantity: 5, price: 70000.00 }
    ],
    remark: '销售出库-客户：济南机械制造厂'
  },
  {
    id: 4,
    code: 'CK20250302002',
    type: 'use',
    amount: 25000.00,
    operator: '陈海波',
    createTime: '2025-03-02 14:15:00',
    products: [
      { name: '倍加福接近开关', quantity: 50, price: 500.00 }
    ],
    remark: '领用出库-项目：传感器更换维护'
  },
  {
    id: 5,
    code: 'CK20250302003',
    type: 'other',
    amount: 15000.00,
    operator: '李伟东',
    createTime: '2025-03-02 16:45:00',
    products: [
      { name: '施耐德断路器', quantity: 10, price: 1500.00 }
    ],
    remark: '其他出库-设备维修'
  },
  {
    id: 6,
    code: 'CK20250303001',
    type: 'sale',
    amount: 36000.00,
    operator: '刘明阳',
    createTime: '2025-03-03 10:15:00',
    products: [
      { name: '三菱伺服电机', quantity: 2, price: 18000.00 }
    ],
    remark: '销售出库-客户：青岛自动化设备有限公司'
  },
  {
    id: 7,
    code: 'CK20250303002',
    type: 'use',
    amount: 190000.00,
    operator: '王建国',
    createTime: '2025-03-03 13:45:00',
    products: [
      { name: '基恩士视觉系统', quantity: 1, price: 190000.00 }
    ],
    remark: '领用出库-项目：PCB检测线'
  },
  {
    id: 8,
    code: 'CK20250303003',
    type: 'other',
    amount: 8000.00,
    operator: '李伟东',
    createTime: '2025-03-03 16:30:00',
    products: [
      { name: '图尔克接近开关', quantity: 10, price: 800.00 }
    ],
    remark: '其他出库-设备维修更换'
  },
  {
    id: 9,
    code: 'CK20250304001',
    type: 'sale',
    amount: 340000.00,
    operator: '张志强',
    createTime: '2025-03-04 09:30:00',
    products: [
      { name: '库卡机器人', quantity: 1, price: 340000.00 }
    ],
    remark: '销售出库-客户：潍坊工业机器人有限公司'
  },
  {
    id: 10,
    code: 'CK20250304002',
    type: 'use',
    amount: 16000.00,
    operator: '陈海波',
    createTime: '2025-03-04 14:20:00',
    products: [
      { name: '欧姆龙PLC', quantity: 1, price: 16000.00 }
    ],
    remark: '领用出库-项目：生产线改造'
  },
  {
    id: 11,
    code: 'CK20250304003',
    type: 'sale',
    amount: 16000.00,
    operator: '刘明阳',
    createTime: '2025-03-04 16:45:00',
    products: [
      { name: '邦纳光电传感器', quantity: 20, price: 800.00 }
    ],
    remark: '销售出库-客户：烟台包装设备厂'
  },
  {
    id: 12,
    code: 'CK20250305001',
    type: 'use',
    amount: 7500.00,
    operator: '李伟东',
    createTime: '2025-03-05 10:30:00',
    products: [
      { name: '力士乐气缸', quantity: 3, price: 2500.00 }
    ],
    remark: '领用出库-项目：气动系统维护'
  },
  {
    id: 13,
    code: 'CK20250305002',
    type: 'sale',
    amount: 26000.00,
    operator: '王建国',
    createTime: '2025-03-05 13:15:00',
    products: [
      { name: '施耐德变频器', quantity: 2, price: 13000.00 }
    ],
    remark: '销售出库-客户：临沂电气设备有限公司'
  }
]);

const outTotal = ref(100);

// 盘点记录查询条件
const checkQuery = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
  dateRange: [] as string[]
});

// 盘点记录列表
const checkList = ref([
  {
    id: 1,
    code: 'PD20250301001',
    status: 'completed',
    operator: '刘明阳',
    createTime: '2025-03-01 09:00:00',
    completeTime: '2025-03-01 10:00:00',
    products: [
      { 
        name: '发那科机器人 CR-7iA',
        systemQuantity: 5,
        actualQuantity: 5,
        diffQuantity: 0
      }
    ],
    remark: '月度例行盘点-机器人本体'
  },
  {
    id: 2,
    code: 'PD20250301002',
    status: 'pending',
    operator: '王建国',
    createTime: '2025-03-01 14:00:00',
    completeTime: '',
    products: [],
    remark: '季度盘点-控制系统'
  },
  {
    id: 3,
    code: 'PD20250302001',
    status: 'completed',
    operator: '张志强',
    createTime: '2025-03-02 09:30:00',
    completeTime: '2025-03-02 10:45:00',
    products: [
      {
        name: '西门子S7-1500 PLC',
        systemQuantity: 10,
        actualQuantity: 9,
        diffQuantity: -1
      }
    ],
    remark: '月度例行盘点-控制系统'
  },
  {
    id: 4,
    code: 'PD20250302002',
    status: 'adjusted',
    operator: '陈海波',
    createTime: '2025-03-02 14:30:00',
    completeTime: '2025-03-02 15:30:00',
    products: [
      {
        name: '欧姆龙光电传感器',
        systemQuantity: 100,
        actualQuantity: 95,
        diffQuantity: -5
      }
    ],
    remark: '月度例行盘点-传感器'
  },
  {
    id: 5,
    code: 'PD20250302003',
    status: 'completed',
    operator: '李伟东',
    createTime: '2025-03-02 16:45:00',
    completeTime: '2025-03-02 17:30:00',
    products: [
      {
        name: '施耐德断路器',
        systemQuantity: 20,
        actualQuantity: 20,
        diffQuantity: 0
      }
    ],
    remark: '月度例行盘点-电气元件'
  },
  {
    id: 6,
    code: 'PD20250303001',
    status: 'completed',
    operator: '张志强',
    createTime: '2025-03-03 09:00:00',
    completeTime: '2025-03-03 10:30:00',
    products: [
      {
        name: '三菱伺服电机',
        systemQuantity: 12,
        actualQuantity: 12,
        diffQuantity: 0
      }
    ],
    remark: '月度例行盘点-电气设备'
  },
  {
    id: 7,
    code: 'PD20250303002',
    status: 'adjusted',
    operator: '王建国',
    createTime: '2025-03-03 13:00:00',
    completeTime: '2025-03-03 14:30:00',
    products: [
      {
        name: '基恩士视觉系统',
        systemQuantity: 3,
        actualQuantity: 2,
        diffQuantity: -1
      }
    ],
    remark: '月度例行盘点-视觉系统'
  },
  {
    id: 8,
    code: 'PD20250303003',
    status: 'completed',
    operator: '陈海波',
    createTime: '2025-03-03 15:00:00',
    completeTime: '2025-03-03 16:15:00',
    products: [
      {
        name: '图尔克接近开关',
        systemQuantity: 45,
        actualQuantity: 45,
        diffQuantity: 0
      }
    ],
    remark: '月度例行盘点-传感器'
  },
  {
    id: 9,
    code: 'PD20250304001',
    status: 'pending',
    operator: '刘明阳',
    createTime: '2025-03-04 09:30:00',
    completeTime: '',
    products: [],
    remark: '季度盘点-机器人本体'
  },
  {
    id: 10,
    code: 'PD20250304002',
    status: 'completed',
    operator: '李伟东',
    createTime: '2025-03-04 13:30:00',
    completeTime: '2025-03-04 14:45:00',
    products: [
      {
        name: '欧姆龙PLC',
        systemQuantity: 5,
        actualQuantity: 5,
        diffQuantity: 0
      }
    ],
    remark: '月度例行盘点-控制系统'
  },
  {
    id: 11,
    code: 'PD20250304003',
    status: 'adjusted',
    operator: '张志强',
    createTime: '2025-03-04 15:30:00',
    completeTime: '2025-03-04 16:45:00',
    products: [
      {
        name: '邦纳光电传感器',
        systemQuantity: 35,
        actualQuantity: 30,
        diffQuantity: -5
      }
    ],
    remark: '月度例行盘点-传感器'
  },
  {
    id: 12,
    code: 'PD20250305001',
    status: 'completed',
    operator: '王建国',
    createTime: '2025-03-05 09:00:00',
    completeTime: '2025-03-05 10:15:00',
    products: [
      {
        name: '力士乐气缸',
        systemQuantity: 15,
        actualQuantity: 15,
        diffQuantity: 0
      }
    ],
    remark: '月度例行盘点-机械配件'
  },
  {
    id: 13,
    code: 'PD20250305002',
    status: 'pending',
    operator: '陈海波',
    createTime: '2025-03-05 13:30:00',
    completeTime: '',
    products: [],
    remark: '月度例行盘点-电气设备'
  }
]);

const checkTotal = ref(100);

// 获取入库类型文本
const getInTypeText = (type: string) => {
  const map: Record<string, string> = {
    purchase: '采购入库',
    return: '退货入库',
    other: '其他入库'
  };
  return map[type] || type;
};

// 获取出库类型文本
const getOutTypeText = (type: string) => {
  const map: Record<string, string> = {
    sale: '销售出库',
    use: '领用出库',
    other: '其他出库'
  };
  return map[type] || type;
};

// 获取盘点状态类型
const getCheckStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    completed: 'success',
    adjusted: 'warning'
  };
  return map[status] || 'info';
};

// 获取盘点状态文本
const getCheckStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待盘点',
    completed: '已盘点',
    adjusted: '已调整'
  };
  return map[status] || status;
};

// 入库记录搜索
const handleInSearch = () => {
  inQuery.value.page = 1;
  loadInData();
};

// 加载入库记录数据
const loadInData = () => {
  // TODO: 调用API获取入库记录数据
  console.log('加载入库记录:', inQuery.value);
};

// 出库记录搜索
const handleOutSearch = () => {
  outQuery.value.page = 1;
  loadOutData();
};

// 加载出库记录数据
const loadOutData = () => {
  // TODO: 调用API获取出库记录数据
  console.log('加载出库记录:', outQuery.value);
};

// 盘点记录搜索
const handleCheckSearch = () => {
  checkQuery.value.page = 1;
  loadCheckData();
};

// 加载盘点记录数据
const loadCheckData = () => {
  // TODO: 调用API获取盘点记录数据
  console.log('加载盘点记录:', checkQuery.value);
};

// 查看入库记录
const handleViewIn = (row: any) => {
  viewInDialog.data = row;
  viewInDialog.visible = true;
};

// 查看出库记录
const handleViewOut = (row: any) => {
  viewOutDialog.data = row;
  viewOutDialog.visible = true;
};

// 查看盘点记录
const handleViewCheck = (row: any) => {
  viewCheckDialog.data = row;
  viewCheckDialog.visible = true;
};

// 调整盘点
const handleAdjust = (row: any) => {
  checkForm.id = row.id;
  checkForm.systemQuantity = row.products[0].systemQuantity;
  checkForm.actualQuantity = row.products[0].actualQuantity;
  checkForm.diffQuantity = row.products[0].diffQuantity;
  checkForm.orderNo = row.code;
  checkForm.remark = row.remark;
  checkDialog.visible = true;
};

// 入库记录分页
const handleInSizeChange = () => {
  loadInData();
};

const handleInCurrentChange = () => {
  loadInData();
};

// 出库记录分页
const handleOutSizeChange = () => {
  loadOutData();
};

const handleOutCurrentChange = () => {
  loadOutData();
};

// 盘点记录分页
const handleCheckSizeChange = () => {
  loadCheckData();
};

const handleCheckCurrentChange = () => {
  loadCheckData();
};

// 监听标签页切换
watch(activeTab, (newTab) => {
  switch (newTab) {
    case 'stock':
      loadData();
      break;
    case 'in':
      loadInData();
      break;
    case 'out':
      loadOutData();
      break;
    case 'check':
      loadCheckData();
      break;
  }
});

// 查看入库记录对话框
const viewInDialog = reactive({
  visible: false,
  data: {} as any
});

// 查看出库记录对话框
const viewOutDialog = reactive({
  visible: false,
  data: {} as any
});

// 查看盘点记录对话框
const viewCheckDialog = reactive({
  visible: false,
  data: {} as any
});
</script>

<style scoped lang="scss">
.inventory-container {
  padding: 20px;
  height: calc(100vh - 84px); // 减去头部导航的高度
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .tabs-header {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #dcdfe6;
    flex-shrink: 0;

    .tab-item {
      padding: 12px 20px;
      cursor: pointer;
      font-size: 14px;
      color: #606266;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
      }

      &.active {
        color: #409eff;
        border-bottom-color: #409eff;
      }
    }
  }

  .tab-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    > div {
  height: 100%;
      
      .el-card {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.el-card__body) {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    
    .left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .right {
      display: flex;
      gap: 16px;
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
    margin: 20px 0;
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    flex-shrink: 0;
  }

  :deep(.operation-buttons) {
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