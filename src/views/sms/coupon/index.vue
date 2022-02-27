<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" style="margin-right: 4px"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList" type="primary" size="small">查询结果</el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch" size="small">重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="优惠券名称：">
            <el-input class="input-width" v-model="listQuery.name" placeholder="优惠券名称"></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-select clearable class="input-width" v-model="listQuery.type" placeholder="全部">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd" size="mini" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" ref="couponTable"
                :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="优惠券名称">
          <template v-slot="scope"> {{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="优惠券类型" width="100">
          <template v-slot="scope"> {{ scope.row.type | formatType }}</template>
        </el-table-column>
        <el-table-column label="可使用商品" width="100">
          <template v-slot="scope"> {{ scope.row.useType | formatUseType }}</template>
        </el-table-column>
        <el-table-column label="使用门槛" width="140">
          <template v-slot="scope">满{{ scope.row.minPoint }}元可用</template>
        </el-table-column>
        <el-table-column label="面值" width="100">
          <template v-slot="scope">{{ scope.row.amount }}元</template>
        </el-table-column>
        <el-table-column label="适用平台" width="100">
          <template v-slot="scope">{{ scope.row.platform | formatPlatform }}</template>
        </el-table-column>
        <el-table-column label="有效期" width="180">
          <template v-slot="scope">{{
              scope.row.startTime | formatDate
            }}至{{ scope.row.endTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template v-slot="scope">{{ scope.row.endTime | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="handleView(scope.$index,scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     layout="total,sizes, prev,pager,next,jumper" :page-sizes="[5,10,15]"
                     :page-size="listQuery.pageSize"
                     :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
    <div style="clear: right">
    </div>
  </div>
</template>

<script>
import {fetchList, deleteCoupon} from '@/api/coupon'
import {formatDate} from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  type: null
};

const defaultTypeOptions = [
  {
    label: '全场赠券',
    value: 0
  },
  {
    label: '会员赠券',
    value: 1
  },
  {
    label: '购物赠券',
    value: 2
  },
  {
    label: '注册赠券',
    value: 3
  },
];

export default {
  data: function () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeOptions: Object.assign({}, defaultTypeOptions),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleAdd: function () {
      this.$router.push({path: '/sms/addCoupon'});
    },
    handleShowSessionList: function () {
      this.$router.push({path: '/sms/flashSession'});
    },
    handleView: function (index, row) {
      this.$router.push({path: '/sms/couponHistory', query: {id: row.id}});
    },
    handleUpdate: function (index, row) {
      this.$router.push({path: '/sms/updateCoupon', query: {id: row.id}});
    },
    handleDelete: function (index, row) {
      this.$confirm('是否要删除该优惠券', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deleteCoupon(row.id).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.getList();
        })
      });
    },
    getList: function () {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    },
    handleSearchList: function () {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleResetSearch: function () {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleSizeChange: function (val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange: function (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
  },
  filters: {
    formatActiveStatus: function (row) {
      let nowTime = new Date().getTime();
      if (nowTime >= row.startDate && nowTime <= row.endDate) {
        return '活动进行中';
      } else if (nowTime > row.endDate) {
        return '活动已结束';
      } else {
        return '活动未开始';
      }
    },
    formatType: function (val) {
      for (let i = 0; i < defaultTypeOptions.length; i++) {
        if (defaultTypeOptions[i].value === val) {
          return defaultTypeOptions[i].label;
        }
      }
      return '';
    },
    formatUseType: function (val) {
      switch (val) {
        case 0:
          return '全场通用';
        case  1:
          return '指定分类';
        default:
          return '指定商品';
      }
    },
    formatPlatform: function (val) {
      switch (val) {
        case 1:
          return '移动平台';
        case  2:
          return 'PC平台';
        default:
          return '全平台';
      }
    },
    formatStatus: function (val) {
      let now = new Date().getTime();
      let endDate = new Date(val);
      if (endDate > now) {
        return '未过期';
      } else {
        return '已过期';
      }
    },
    formatDate: function (time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd');
    }
  }
}
</script>

<style scoped>
.input-width {
  width: 203px;
}
</style>