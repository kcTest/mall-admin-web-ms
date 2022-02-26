<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="deliveryOrderTable" style="width: 100%" :data="list" border :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center'}">
        <el-table-column label="订单编号" width="180">
          <template v-slot="{row}">{{ row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="收货人" width="180">
          <template v-slot="{row}">{{ row.receiverName }}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="160">
          <template v-slot="{row}">{{ row.receiverPhone }}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="160">
          <template v-slot="{row}">{{ row.receiverPostCode }}</template>
        </el-table-column>
        <el-table-column label="收货地址" width="160">
          <template v-slot="{row}">{{ row.address }}</template>
        </el-table-column>
        <el-table-column label="配送方式" width="160">
          <template v-slot="{row}">
            <el-select placeholder="请选择物流公司" v-model="row.deliveryCompany" size="small">
              <el-option v-for="item in companyOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="160">
          <template v-slot="{row}">
            <el-input size="small" v-model="row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import {deliveryOrder} from '@/api/order'

const defaultLogisticsOptions = ['顺丰快递', '圆通快递', '申通快递', '韵达快递'];
export default {
  data: function () {
    return {
      list: [],
      companyOptions: defaultLogisticsOptions
    }
  },
  created() {
    this.list = this.$route.query.list;
  },
  methods: {
    cancel: function () {
      this.$router.back();
    },
    confirm: function () {
      this.$confirm('是否要进行发货操作', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deliveryOrder(this.list).then(() => {
          this.$message({message: '发货成功', type: 'success', duration: 1000});
          this.$router.back();
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$message({message: '已取消发货', type: 'info', duration: 1000});
      });
    }
  }
}
</script>

<style scoped>

</style>