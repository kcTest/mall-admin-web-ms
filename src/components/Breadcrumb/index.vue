<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if=" item.redirect==='noredirect'||index===levelList.length-1"
              class="no-redirect">{{ item.meta.title }}</span>
        <router-link v-else :to="item.redirect||item.path">{{ item.meta.title }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data: function () {
    return {
      levelList: null
    }
  },
  methods: {
    getBreadcrumb: function () {
      let matched = this.$route.matched.filter(item => item.name && item.meta.title)
      const first = matched[0]
      if (first && first.name !== 'home') {
        matched = [{path: '/home', meta: {title: '首页'}}].concat(matched)
      }
      this.levelList = matched
    }
  },
  watch: {
    $route: function () {
      this.getBreadcrumb();
    }
  }

}
</script>

<style lang="scss" scoped>

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  line-height: 50px;
  margin-left: 10px;
  font-size: 14px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

</style>