<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps>
    <product-info-detail v-show="showStatus[0]" v-model="productParam" :is-edit="isEdit"
                         @nextStep="nextStep"></product-info-detail>
    <product-sale-detail v-show="showStatus[1]" v-model="productParam" :is-edit="isEdit"
                         @nextStep="nextStep" @prevStep="prevStep"></product-sale-detail>
  </el-card>
</template>

<script>
import ProductInfoDetail from './productInfoDetail';
import ProductSaleDetail from './productSaleDetail';

export default {
  components: {ProductInfoDetail}
}
</script>

<style scoped>

</style>