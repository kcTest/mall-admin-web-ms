<template>
  <div class="app-container">
    <el-card shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}"
                ref="selectSessionTable"
                :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
          <!-- Scoped Slot自定义列内容-->
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="秒杀时间段名称">
          <template v-slot="scope"> {{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="每日开始时间">
          <template v-slot="scope"> {{ scope.row.startTime | formatTime }}</template>
        </el-table-column>
        <el-table-column label="每日结束时间">
          <template v-slot="scope"> {{ scope.row.endTime | formatTime }}</template>
        </el-table-column>
        <el-table-column label="商品数量">
          <template v-slot="scope"> {{ scope.row.productCount }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="handleShowRelation(scope.$index,scope.row)">商品列表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {fetchSelectList} from '@/api/flashSession'
import {formatDate} from "@/utils/date";

export default {
  data: function () {
    return {
      list: null,
      listLoading: false,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleShowRelation: function (index, row) {
      this.$router.push({
        path: '/sms/flashProductRelation', query: {
          flashPromotionId: this.$route.query.flashPromotionId, flashPromotionSessionId: row.id
        }
      });
    },
    getList: function () {
      this.listLoading = true;
      fetchSelectList({flashPromotionId: this.$route.query.flashPromotionId}).then(response => {
        this.listLoading = false;
        this.list = response.data;
      })
    }
  },
  filters: {
    formatTime: function (time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'hh:mm:ss');
    }
  }
}
</script>

<style scoped>
</style>