<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top+'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "scrollBar",
  data() {
    return {
      top: 0
    }
  },
  methods: {
    handleScroll() {
      
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables';

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;

  .scroll-wrapper {
    position: absolute;
    width: 100% !important;
  }
}

</style>