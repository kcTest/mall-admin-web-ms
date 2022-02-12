<template>
  <section class="app-main">
    <!--   out-in 当前元素先进行过渡，完成之后新元素过渡进入。-->
    <transition name="fade" mode="out-in">
      <router-view>
      </router-view>
    </transition>
  </section>
</template>

<script>
export default {
}
</script>

<style scoped>

</style>