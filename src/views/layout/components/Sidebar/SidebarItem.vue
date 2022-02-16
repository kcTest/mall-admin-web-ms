<template>
  <div class="menu-wrapper">
    <template v-for="item in shouldShowRoutes">
      <!--只有一个子菜单的一级菜单 直接默认显示子菜单 （首页）-->
      <router-link v-if="hasOneShowingChildren(item.children)&&!item.children[0].children
      &&!item.alwaysShow" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                    :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title"
                slot="title">{{ item.children[0].meta.title }}</span>
        </el-menu-item>
      </router-link>

      <!--含多个子菜单的一级菜单-->
      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{ item.meta.title }}</span>
        </template>
        <template v-for="child in item.children">
          <!--          如果存在三级菜单-->
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.length>0"
                        :routes=[child] :key="child.path">
          </sidebar-item>
          <!--          正常显示二级菜单-->
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{ child.meta.title }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  computed: {
    shouldShowRoutes: function () {
      let ret = this.routes.filter(item => !item.hidden && item.children);
      for (let item of ret) {
        if (item.children.length > 0) {
          item.children = item.children.filter(son => !son.hidden)
        }
      }
      return ret;
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
      return showingChildren.length === 1;

    }
  }
}
</script>