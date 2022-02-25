<template>
  <el-dialog title="订单跟踪" :visible.sync="visible" :before-close="handleClose" width="40%">
    <el-steps direction="vertical" :active="6" finish-status="success" space="50px">
      <el-step v-for="item in logisticsList" :key="item.name" :title="item.name" :description="item.time"></el-step>
    </el-steps>
  </el-dialog>
</template>

<script>
const defaultLogisticsList = [
  {name: '订单已提交,等待付款', time: '2022-2-25 17:00:48'},
  {name: '订单付款成功', time: '2022-2-25 17:00:48'},
  {name: '在北京市下级地点扫描,等待付款', time: '2022-2-25 17:00:48'},
  {name: '在分拨中心广东深圳公司进行卸车扫描,等待付款', time: '2022-2-25 17:00:48'},
  {name: '在广东深圳公司进行发出扫描', time: '2022-2-25 17:00:48'},
  {name: '到达网点广东深圳公司,快件将很快派送', time: '2022-2-25 17:00:48'},
  {name: '订单已签收,期待再次为您服务', time: '2022-2-25 17:00:48'}
];
export default {
  props: {
    value: Boolean
  },
  data: function () {
    return {
      logisticsList: Object.assign({}, defaultLogisticsList)
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.value = val;
      }
    }
  },
  methods: {
    emitInput: function (val) {
      this.$emit('input', val);
    },
    handleClose: function () {
      this.emitInput(false);
    }
  }
}
</script>

<style scoped>

</style>