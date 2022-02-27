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
          <el-form-item label="活动名称：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="活动名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd" size="mini" style="margin-left: 20px">添加活动</el-button>
      <el-button class="btn-add" @click="handleShowSessionList" size="mini">秒杀时间段列表</el-button>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" ref="flashTable"
                :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
          <!-- Scoped Slot自定义列内容-->
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="活动标题">
          <template v-slot="scope"> {{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="活动状态" width="140">
          <template v-slot="scope"> {{ scope.row | formatActiveStatus }}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="140">
          <template v-slot="scope"> {{ scope.row.startDate | formatDate }}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="140">
          <template v-slot="scope"> {{ scope.row.endDate | formatDate }}</template>
        </el-table-column>
        <el-table-column label="线上线下" width="200">
          <template v-slot="scope">
            <el-switch @change="handleStatusChange(scope.$index,scope.row)" :active-value="1"
                       :inactive-value="0" v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="handleSelectSession(scope.$index,scope.row)">设置商品</el-button>
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
    <el-dialog title="添加活动" :visible.sync="dialogVisible" width="40%">
      <el-form :model="flashPromotion" ref="flashPromotionForm" label-width="150px" size="small">
        <el-form-item label="活动标题">
          <el-input v-model="flashPromotion.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="flashPromotion.startDate" type="date" placeholder="请选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="flashPromotion.endDate" type="date" placeholder="请选择时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="线上线下">
          <el-radio-group v-model="flashPromotion.status">
            <el-radio :label="1">上线</el-radio>
            <el-radio :label="0">下线</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {fetchList, updateStatus, updateFlash, deleteFlash, createFlash} from '@/api/flash'
import {formatDate} from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  keyword: null
};

const defaultFlashPromotion = {
  id: null,
  title: null,
  startDate: null,
  endDate: null,
  status: 0
}

export default {
  data: function () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      flashPromotion: Object.assign({}, defaultFlashPromotion)
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleAdd: function () {
      this.dialogVisible = true;
      this.isEdit = false;
      this.flashPromotion = Object.assign({}, defaultFlashPromotion);
    },
    handleShowSessionList: function () {
      this.$router.push({path: '/sms/flashSession'});
    },
    handleStatusChange: function (index, row) {
      this.$confirm('是否要修改状态', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
          .then(() => {
            updateStatus(row.id, {status: row.status}).then(() => {
              this.$message({message: '修改成功', type: 'success', duration: 1000});
            }).catch(err => {
              console.log(err);
            });
          }).catch(() => {
        this.$message({message: '取消修改', type: 'info', duration: 1000});
        this.getList();
      });
    },
    handleDialogConfirm: function () {
      this.$confirm('是否要修改状态', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
          .then(() => {
            if (this.isEdit) {
              updateFlash(this.flashPromotion.id, this.flashPromotion).then(() => {
                this.$message({message: '修改成功', type: 'success', duration: 1000});
                this.dialogVisible = false;
                this.getList();
              }).catch(err => {
                console.log(err);
              });
            } else {
              createFlash(this.flashPromotion).then(() => {
                this.$message({message: '添加成功', type: 'success', duration: 1000});
                this.dialogVisible = false;
                this.getList();
              }).catch(err => {
                console.log(err);
              });
            }
          }).catch(() => {
      });
    },
    handleSelectSession: function (index, row) {
      this.$router.push({path: '/sms/selectSession', query: {flashPromotionId: row.id}});
    },
    handleUpdate: function (index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.flashPromotion = Object.assign({}, row);
    },
    handleDelete: function (index, row) {
      this.$confirm('是否要删除该活动', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deleteFlash(row.id).then(() => {
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
</style>