<template>
  <brand-detail :is-edit="false"></brand-detail>
</template>

<script>
import BrandDetail from "@/views/pms/brand/components/BrandDetail";

export default {
  name: "index",
  components: {BrandDetail}
}
</script>

<style scoped>

</style>