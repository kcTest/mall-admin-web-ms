<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="handleAddProductCate" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}" :data="list" v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
          <template v-slot="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称">
          <template v-slot="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="级别" width="100">
          <template v-slot="{row}">{{ row.level | levelFilter }}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="100">
          <template v-slot="{row}">{{ row.productCount }}</template>
        </el-table-column>
        <el-table-column label="数量单位" width="100">
          <template v-slot="{row}">{{ row.productUnit }}</template>
        </el-table-column>
        <el-table-column label="导航栏" width="100">
          <template v-slot="scope">
            <el-switch @change="handleNavStatusChange(scope.$index,scope.row)" :active-value="1"
                       :inactive-value="0" v-model="scope.row.navStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100">
          <template v-slot="scope">
            <el-switch @change="handleShowStatusChange(scope.$index,scope.row)" :active-value="1"
                       :inactive-value="0" v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100">
          <template v-slot="{row}">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200">
          <template v-slot="scope">
            <el-button size="mini" :disabled="scope.row.level | disableNextLevel"
                       @click="handleShowNextLevel(scope.$index,scope.row)">查看下级
            </el-button>
            <el-button size="mini" @click="handleTransferProduct(scope.$index,scope.row)">转移商品</el-button>
          </template>
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
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     layout="total,sizes,prev,pager,next,jumper" :page-size="listQuery.pageSize"
                     :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total">

      </el-pagination>
    </div>
  </div>
</template>

<script>

import {fetchList, deleteProductCate, updateShowStatus, updateNavStatus} from '@/api/productCate'

export default {
  data: function () {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      total: null,
      parentId: 0
    }
  },
  created() {
    this.resetParentId();
    this.getList();
  },
  watch: {
    $route: function () {
      this.resetParentId();
      this.getList();
    }
  },
  methods: {
    resetParentId: function () {
      this.listQuery.pageNum = 1;
      const parentCateId = this.$route.query.parentId;
      if (parentCateId != null) {
        this.parentId = parentCateId;
      } else {
        this.parentId = 0;
      }
    },
    handleAddProductCate: function () {
      this.$router.push('/pms/addProductCate');
    },
    getList: function () {
      this.listLoading = true;
      fetchList(this.parentId, this.listQuery).then(response => {
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
    handleNavStatusChange: function (index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id);
      data.append('ids', ids);
      data.append('navStatus', row.navStatus);
      updateNavStatus(data).then(() => {
        this.$message({message: '修改成功', type: 'success', duration: 1000});
      })
    },
    handleShowStatusChange: function (index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id);
      data.append('ids', ids);
      data.append('showStatus', row.showStatus);
      updateShowStatus(data).then(() => {
        this.$message({message: '修改成功', type: 'success', duration: 1000});
      })
    },
    handleShowNextLevel: function (index, row) {
      this.$router.push({path: '/pms/productCate', query: {parentId: row.id}});
    },
    handleTransferProduct: function (index, row) {
      console.log(index, row);
      console.log('handleTransferProduct');
    },
    handleUpdate: function (index, row) {
      this.$router.push({path: '/pms/updateProductCate', query: {id: row.id}});
    },
    handleDelete: function (index, row) {
      this.$confirm('是否要删除该品牌', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deleteProductCate(row.id).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.getList();
        });
      });
    },
  },
  filters: {
    levelFilter: function (value) {
      switch (value) {
        case 0:
          return '一级';
        case  1:
          return '二级'
      }
    },
    disableNextLevel: function (value) {
      return value !== 0
    }

  }
}
</script>

<style scoped>

</style>