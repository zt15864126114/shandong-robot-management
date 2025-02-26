<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical"
    :collapse="isCollapse"
    background-color="#1e2c3c"
    text-color="#fff"
    active-text-color="#409EFF"
    unique-opened
    router
    @select="handleSelect"
  >
    <template v-for="menu in menus" :key="menu.path">
      <!-- 有子菜单的情况 -->
      <el-sub-menu v-if="menu.children?.length" :index="menu.path">
        <template #title>
          <el-icon v-if="menu.icon">
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <el-menu-item
          v-for="subMenu in menu.children"
          :key="subMenu.path"
          :index="`/${menu.path}/${subMenu.path}`"
        >
          {{ subMenu.title }}
        </el-menu-item>
      </el-sub-menu>

      <!-- 没有子菜单的情况 -->
      <el-menu-item v-else :index="`/${menu.path}`">
        <el-icon v-if="menu.icon">
          <component :is="menu.icon" />
        </el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { menuConfig } from '@/config/menu';

const props = defineProps<{
  isCollapse: boolean;
}>();

const route = useRoute();
const router = useRouter();

// 菜单数据
const menus = computed(() => menuConfig);

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 菜单选择事件
const handleSelect = (index: string) => {
  // 由于添加了 router 属性，el-menu 会自动处理路由跳转
  // 这里可以添加其他逻辑
};
</script>

<style scoped lang="scss">
.menu-container {
  height: 100%;
  
  :deep(.el-menu) {
    height: 100%;
    border-right: none;
  }

  :deep(.el-menu-item) {
    &.is-active {
      background-color: #263445 !important;
    }

    &:hover {
      background-color: #263445 !important;
    }
  }

  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      padding-left: 20px !important;

      &:hover {
        background-color: #263445 !important;
      }
    }

    // 子菜单样式
    .el-menu {
      background-color: #1f2d3d !important;

      .el-menu-item {
        padding-left: 40px !important;
        
        &.is-active {
          background-color: #1890ff !important;
        }
      }
    }
  }
}

// 折叠时的样式
.el-menu--collapse {
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      padding-left: 20px !important;
      
      span {
        display: none;
      }
    }
  }
}

// 弹出的子菜单样式
:deep(.el-menu--popup) {
  background-color: #1f2d3d !important;
  
  .el-menu-item {
    background-color: #1f2d3d;
    
    &:hover {
      background-color: #263445 !important;
    }
    
    &.is-active {
      background-color: #1890ff !important;
    }
  }
}

:deep(.el-menu) {
  border-right: none;

  .el-menu-item {
    &:hover {
      background-color: #1a2736 !important;
    }
    
    &.is-active {
      background-color: #1a2736 !important;
    }
  }

  .el-sub-menu__title {
    &:hover {
      background-color: #1a2736 !important;
    }
  }
}
</style> 