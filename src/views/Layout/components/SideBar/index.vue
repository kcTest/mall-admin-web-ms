<template>
  <scroll-bar>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156"
             text-color="#bfcbd9" active-text-color="#409EFF">
      <side-bar-item :routes="routes"></side-bar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>

import ScrollBar from '@/components/ScrollBar'
import SideBarItem from "./SideBarItem";
import {mapGetters} from 'vuex'

export default {
  components: {ScrollBar, SideBarItem},
  computed: {
    ...mapGetters([
      'sidebar',
      'routers'
    ]),
    routes() {
      return this.routers;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
}
</script>