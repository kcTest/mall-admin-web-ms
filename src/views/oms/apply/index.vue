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
          <el-form-item label="输入搜索：">
            <el-input class="input-width" v-model="listQuery.id" placeholder="服务单号"></el-input>
          </el-form-item>
          <el-form-item label="处理状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间：">
            <el-date-picker class="input-width" v-model="listQuery.createTime" value-format="yyyy-MM-dd" type="date"
                            placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作人员：">
            <el-input v-model="listQuery.handleMan" class="input-width" placeholder="全部"></el-input>
          </el-form-item>
          <el-form-item label="处理时间：">
            <el-date-picker class="input-width" v-model="listQuery.handleTime" value-format="yyyy-MM-dd" type="date"
                            placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}"
                ref="returnApplyTable"
                :data="list" style="width: 100%" @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column label="服务单号" width="180">
          <!-- Scoped Slot自定义列内容-->
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="180">
          <template v-slot="scope"> {{ scope.row.createTime | formatTime }}</template>
        </el-table-column>
        <el-table-column label="用户账号">
          <template v-slot="scope">{{ scope.row.memberUsername }}</template>
        </el-table-column>
        <el-table-column label="退款金额" width="180">
          <template v-slot="scope">￥{{ scope.row | formatReturnAmount }}</template>
        </el-table-column>
        <el-table-column label="申请状态" width="180">
          <template v-slot="scope">{{ scope.row.status  | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="处理时间" width="180">
          <template v-slot="scope"> {{ scope.row.handleTime | formatTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" @click="handleViewerDetail(scope.$index,scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operatesOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate" type="primary"
                 size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     layout="total,sizes, prev,pager,next,jumper" :page-sizes="[5,10,15]"
                     :page-size="listQuery.pageSize"
                     :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {deleteApply, fetchList} from '@/api/returnApply'
import {formatDate} from "@/utils/date";

const defaultListQuery = {
  receiverKeyword: null,
  createTime: null,
  status: null,
  handleMan: null,
  handleTime: null,
  pageNum: 1,
  pageSize: 10,
  id: null
};

const defaultStatusOptions = [
  {
    label: '待处理',
    value: 0
  },
  {
    label: '退货中',
    value: 1
  },
  {
    label: '已完成',
    value: 2
  },
  {
    label: '已拒绝',
    value: 3
  }
];

export default {
  data: function () {
    return {
      statusOptions: Object.assign({}, defaultStatusOptions),
      operatesOptions: [
        {
          label: '批量删除',
          value: 1
        }
      ],
      operateType: 1,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      multiSelection: [],
    }
  },
  created() {
    this.getList();
  },
  filters: {
    formatTime: function (val) {
      if (val == null || val == '') {
        return 'N/A';
      }
      let date = new Date(val);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatReturnAmount: function (row) {
      return row.productRealPrice * row.productCount
    },
    formatStatus: function (val) {
      for (let i = 0; i < defaultStatusOptions.length; i++) {
        if (val === defaultStatusOptions[i].value) {
          return defaultStatusOptions[i].label;
        }
      }
    }
  },
  methods: {
    handleViewerDetail: function (index, row) {
      this.$router.push({path: '/oms/returnApplyDetail', query: {id: row.id}});
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
    handleBatchOperate: function () {
      if (this.multiSelection == null || this.multiSelection.length < 1) {
        this.$message({message: '请选择要操作的申请', type: 'warning', duration: 1000});
        return;
      }
      if (this.operateType === 1) {
        this.$confirm('是否要进行删除操作', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        });
        let ids = [];
        for (let i = 0; i < this.multiSelection.length; i++) {
          ids.push(this.multiSelection[i].id);
        }
        let params = new URLSearchParams();
        params.append('ids', ids);
        deleteApply(params).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.getList();
        });
      }
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
    handleSelectionChange: function (val) {
      this.multiSelection = val;
    },
    handleResetSearch: function () {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    }
  }
}
</script>

<style scoped>
.input-width {
  width: 203px;
}
</style>