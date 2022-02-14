<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top+'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const delta = 15

export default {
  data() {
    return {
      top: 0
    }
  },
  methods: {
    handleScroll(e) {
      const $container = this.$refs.scrollContainer
      const $containerHeight = $container.offsetHeight

      const $wrapper = this.$refs.scrollWrapper
      const $wrapperHieght = $wrapper.offsetHeight;

      const eventDelta = e.wheelDelta || -e.delaY * 3
      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta)
      } else {
        if ($containerHeight - delta < $wrapperHieght) {
          if (this.top > -($wrapperHieght - $containerHeight + delta)) {
            this.top = Math.max(this.top + eventDelta, $containerHeight - $wrapperHieght - delta)
          }
        } else {
          this.top = 0
        }
      }

    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variables';

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