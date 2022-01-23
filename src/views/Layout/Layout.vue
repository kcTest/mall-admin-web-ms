<template>
  <div>
    <SideBar></SideBar>
    <div>
      <nav-bar></nav-bar>
      <app-main></app-main>
    </div>
  </div>

</template>

<script>

import {AppMain, NavBar, SideBar} from "./components";

export default {
  name: "Layout",
  components: {
    AppMain,
    NavBar,
    SideBar
  }
}
</script>

<style scoped>

</style>