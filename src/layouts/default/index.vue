<template>
  <div class="layout-container">
    <div class="layout-sidebar" :class="{ collapsed: isCollapse }">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="logo">
        <span v-show="!isCollapse">智能制造</span>
      </div>
      <el-menu-component :is-collapse="isCollapse" />
    </div>
    <div class="layout-main">
      <div class="layout-header">
        <el-icon
          class="collapse-icon"
          @click="isCollapse = !isCollapse"
        >
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span>管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="layout-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Fold, Expand } from '@element-plus/icons-vue';
import ElMenuComponent from './menu.vue';

const isCollapse = ref(false);
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  display: flex;

  .layout-sidebar {
    width: 240px;
    height: 100%;
    background-color: #1e2c3c;
    transition: width 0.3s;
    overflow: hidden;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);

    &.collapsed {
      width: 64px;

      .logo {
        span {
          opacity: 0;
        }
        img {
          margin-right: 0;
        }
      }
    }

    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      background-color: #1a2736;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        transition: all 0.3s;
      }

      span {
        transition: opacity 0.3s;
        opacity: 1;
      }
    }
  }

  .layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .layout-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

      .collapse-icon {
        font-size: 20px;
        cursor: pointer;
      }

      .header-right {
        .user-info {
          display: flex;
          align-items: center;
          cursor: pointer;

          span {
            margin-left: 8px;
          }
        }
      }
    }

    .layout-content {
      height: calc(100vh - 60px);
      overflow: hidden;

      .main-content {
        padding: 0;
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style> 