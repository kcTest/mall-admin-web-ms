<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}"
                ref="returnReasonTable"
                :data="list" style="width: 100%" @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column label="编号" width="80">
          <!-- Scoped Slot自定义列内容-->
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="原因类型">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100">
          <template v-slot="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="是否可用">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" @change="handleStatusChange(scope.$index,scope.row)"
                       :active-value="1" :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="180">
          <template v-slot="scope">{{ scope.row.createTime | formatCreateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template v-slot="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)"> 删除</el-button>
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
                 size="small">确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     layout="total,sizes, prev,pager,next,jumper" :page-sizes="[5,10,15]"
                     :page-size="listQuery.pageSize"
                     :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加退货原因" :visible.sync="dialogVisible" width="30%">
      <el-form :model="returnReason" ref="reasonForm" label-width="150px">
        <el-form-item label="原因类型：">
          <el-input v-model="returnReason.name" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="returnReason.sort" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch v-model="returnReason.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getReasonDetail, deleteReason, fetchList, addReason, updateReason, updateStatus} from '@/api/returnReason'
import {formatDate} from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
};

const defaultReturnReason = {
  name: null,
  sort: 0,
  status: 1,
  createTime: null
};

export default {
  data: function () {
    return {
      returnReason: Object.assign({}, defaultReturnReason),
      operateReasonId: null,
      dialogVisible: false,
      operatesOptions: [
        {
          label: '删除',
          value: 1
        }
      ],
      operateType: null,
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
    formatCreateTime: function (val) {
      let date = new Date(val);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    handleStatusChange: function (index, row) {
      let ids = [];
      ids.push(row.id);
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('status', row.status);
      updateStatus(params).then(() => {
        this.$message({message: '修改成功', type: 'success', duration: 1000});
      }).catch(err => {
        console.log(err);
      });
    },
    handleAdd: function () {
      this.dialogVisible = true;
      this.operateReasonId = null;
      this.returnReason = Object.assign({}, defaultReturnReason);
    },
    handleConfirm: function () {
      if (this.operateReasonId == null) {
        //添加
        addReason(this.returnReason).then(() => {
          this.dialogVisible = false;
          this.operateReasonId = null;
          this.$message({message: '添加成功', type: 'success', duration: 1000});
          this.getList();
        })
      } else {
        //编辑
        updateReason(this.operateReasonId, this.returnReason).then(() => {
          this.dialogVisible = false;
          this.operateReasonId = null;
          this.$message({message: '修改成功', type: 'success', duration: 1000});
          this.getList();
        })
      }
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
    handleUpdate: function (index, row) {
      this.dialogVisible = true;
      this.operateReasonId = row.id;
      getReasonDetail(row.id).then(response => {
        this.returnReason = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    handleDelete: function (index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteReason(ids);
    },
    deleteReason: function (ids) {
      this.$confirm('是否要进行该删除操作', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append('ids', ids);
        deleteReason(params).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.listQuery.pageNum = 1;
          this.getList();
        })
      }).catch(err => {
        console.log(err);
      });
    },
    handleBatchOperate: function () {
      if (this.multiSelection == null || this.multiSelection.length < 1) {
        this.$message({
          message: '请选择要操作的条目', type: 'warning', duration: 1000
        });
        return;
      }
      if (this.operateType === 1) {
        let ids = [];
        for (let i = 0; i < this.multiSelection.length; i++) {
          if (this.multiSelection[i].status === 1) {
            ids.push(this.multiSelection[i].id);
          }
        }
        this.deleteReason(ids);
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
  }
}
</script>

<style scoped>
.input-width {
  width: 80%;
}
</style>