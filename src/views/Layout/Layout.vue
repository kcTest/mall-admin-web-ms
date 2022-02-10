<template>
  <div class="app-wrapper" :class="classObj">
    <Sidebar class="sidebar-container"></Sidebar>
    <div class="main-container">
      <nav-bar></nav-bar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>

import {AppMain, NavBar, Sidebar} from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {
    AppMain,
    NavBar,
    Sidebar
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar: function () {
      return this.$store.state.app.sidebar;
    },
    device: function () {
      return this.$store.state.app.device;
    },
    classObj: function () {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

@import "src/styles/mixin";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

</style>