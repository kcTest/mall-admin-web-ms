<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}"
                ref="flashSessionTable"
                :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
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
        <el-table-column label="启用">
          <template v-slot="scope">
            <el-switch @change="handleStatusChange(scope.$index,scope.row)" :active-value="1"
                       :inactive-value="0" v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加时间段：" :visible.sync="dialogVisible" width="40%">
      <el-form :model="flashSession" ref="flashSessionForm" label-width="150px" size="small">
        <el-form-item label="秒杀时间段名称：">
          <el-input v-model="flashSession.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="每日开始时间：">
          <el-time-picker v-model="flashSession.startTime" placeholder="请选择时间"></el-time-picker>
        </el-form-item>
        <el-form-item label="每日结束时间：">
          <el-time-picker v-model="flashSession.endTime" placeholder="请选择时间"></el-time-picker>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="flashSession.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
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
import {fetchList, updateStatus, updateSession, deleteSession, createSession} from '@/api/flashSession'
import {formatDate} from "@/utils/date";

const defaultFlashSession = {
  name: null,
  startTime: null,
  endTime: null,
  status: 0
}

export default {
  data: function () {
    return {
      list: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      flashSession: Object.assign({}, defaultFlashSession)
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleAdd: function () {
      this.dialogVisible = true;
      this.isEdit = false;
      this.flashSession = Object.assign({}, defaultFlashSession);
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
              updateSession(this.flashSession.id, this.flashSession).then(() => {
                this.$message({message: '修改成功', type: 'success', duration: 1000});
                this.dialogVisible = false;
                this.getList();
              }).catch(err => {
                console.log(err);
              });
            } else {
              createSession(this.flashSession).then(() => {
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
    handleUpdate: function (index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.flashSession = Object.assign({}, row);
      this.flashSession.startTime = new Date(row.startTime);
      this.flashSession.endtTime = new Date(row.endTime);
    },
    handleDelete: function (index, row) {
      this.$confirm('是否要删除该时间段', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deleteSession(row.id).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.getList();
        })
      });
    },
    getList: function () {
      this.listLoading = true;
      fetchList({}).then(response => {
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
.operate-container {
  margin-top: 0
}
</style>