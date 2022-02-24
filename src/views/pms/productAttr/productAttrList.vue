<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addProductAttr" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}" :data="list" v-loading="listLoading" border
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60px"></el-table-column>
        <el-table-column label="编号" width="100">
          <template v-slot="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="140">
          <template v-slot="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="商品类型" width="140">
          <template>{{ $route.query.cname }}</template>
        </el-table-column>
        <el-table-column label="属性是否可选" width="120">
          <template v-slot="{row}">{{ row.selectType | selectTypeFilter }}</template>
        </el-table-column>
        <el-table-column label="属性值得录入方式" width="150">
          <template v-slot="{row}">{{ row.inputType | inputTypeFilter }}</template>
        </el-table-column>
        <el-table-column label="可选值列表">
          <template v-slot="{row}">{{ row.inputList }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100">
          <template v-slot="{row}">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index,scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" style="margin-left: 20px" class="search-button"
                 @click="handleBatchOperate">确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     layout="total,sizes,prev,pager,next,jumper" :page-size="listQuery.pageSize"
                     :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total">

      </el-pagination>
    </div>
  </div>
</template>

<script>

import {fetchList, deleteProductAttr} from '@/api/productAttr'

export default {
  data: function () {
    return {
      multipleSelection: [],
      operateType: null,
      operates: [
        {
          label: '删除',
          value: 'deleteProductAttr'
        }
      ],
      list: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        type: this.$route.query.type
      },
      total: null
    }
  },
  created() {
    this.getList();
  },
  methods: {
    addProductAttr: function () {
      this.$router.push({
        path: '/pms/addProductAttr',
        query: {cid: this.$route.query.cid, type: this.$route.query.type}
      });
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
    },
    handleBatchOperate: function () {
      if (this.multipleSelection < 1) {
        this.$message({message: '请选择一条记录', type: 'warning', duration: 1000});
        return;
      }
      if (this.operateType !== 'deleteProductAttr') {
        this.$message({message: '请选择批量操作的类型', type: 'warning', duration: 1000});
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      this.handleDeleteProductAttr(ids);
    },
    getList: function () {
      this.listLoading = true;
      fetchList(this.$route.query.cid, this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
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
    handleUpdate: function (index, row) {
      this.$router.push({path: '/pms/updateProductAttr', query: {id: row.id}});
    },
    handleDelete: function (index, row) {
      let ids = [];
      ids.push(row.id);
      this.handleDeleteProductAttr(ids);
    },
    handleDeleteProductAttr: function (ids) {
      this.$confirm('是否要删除该属性', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        let data = new URLSearchParams();
        data.append("ids", ids);
        deleteProductAttr(data).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.getList();
        })
      });
    }
  },
  filters: {
    selectTypeFilter: function (val) {
      switch (val) {
        case 1:
          return '单选';
        case 2:
          return '多选';
        default:
          return '唯一';
      }
    },
    inputTypeFilter: function (val) {
      return val === 1 ? '从列表中选取' : '手工录入';
    },
  }
}
</script>

<style scoped>

</style>