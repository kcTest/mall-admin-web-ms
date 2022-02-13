<template>
  <div class="menu-wrapper">
    <template v-for="item in shouldShowRoutes">
      <!-- 首页-->
      <router-link v-if="hasOneShowingChildren(item.children)&&!item.children[0].children
      &&!item.alwaysShow" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-item-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon">
            <span v-if="item.children[0].meta&&item.children[0].meta.title"
                  slot="title">{{ item.children[0].meta.title }}</span>
            <span>test</span>
          </svg-icon>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    shouldShowRoutes: function () {
      return this.routes.filter(item => !item.hidden && item.children)
    }
  },
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren: function (children) {
      const showingChildren = children.filter(item => !item.hidden);
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>