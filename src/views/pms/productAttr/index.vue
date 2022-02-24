<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addProductAttrCate" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}" :data="list" v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
          <template v-slot="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="类型名称">
          <template v-slot="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="属性数量" width="200">
          <template v-slot="{row}">{{ row.attributeCount == null ? 0 : row.attributeCount }}</template>
        </el-table-column>
        <el-table-column label="参数数量" width="200">
          <template v-slot="{row}">{{ row.paramCount == null ? 0 : row.paramCount }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200">
          <template v-slot="scope">
            <el-button size="mini" @click="getAttrList(scope.$index,scope.row)">属性列表</el-button>
            <el-button size="mini" @click="getParamList(scope.$index,scope.row)">参数列表</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" width="30%">
      <el-form ref="productAttrCateForm" :model="productAttrCate" :rules="rules" label-width="120px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="productAttrCate.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productAttrCateForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {fetchList, deleteProductAttrCate, createProductAttrCate, updateProductAttrCate} from '@/api/productAttrCate'

export default {
  data: function () {
    return {
      dialogVisible: false,
      dialogTitle: '',
      list: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      total: null,
      productAttrCate: {
        name: '',
        id: null
      },
      rules: {
        name: [
          {required: true, message: '请输入类型名称', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    addProductAttrCate: function () {
      this.dialogVisible = true;
      this.dialogTitle = '添加类型';
      this.productAttrCate = {name: '', id: null};
    },
    getAttrList: function (index, row) {
      this.$router.push({path: '/pms/productAttrList', query: {cid: row.id, cname: row.name, type: 0}});
    },
    getParamList: function (index, row) {
      this.$router.push({path: '/pms/productAttrList', query: {cid: row.id, cname: row.name, type: 1}});
    },
    getList: function () {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
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
    handleConfirm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new URLSearchParams();
          data.append('name', this.productAttrCate.name);
          if (this.dialogTitle === '添加类型') {
            createProductAttrCate(data).then(() => {
              this.$message({message: '添加成功', type: 'success', duration: 1000});
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            updateProductAttrCate(this.productAttrCate.id, data).then(() => {
              this.$message({message: '修改成功', type: 'success', duration: 1000});
              this.dialogVisible = false;
              this.getList();
            });
          }
        } else {
          return false;
        }
      });
    },
    handleTransferProduct: function (index, row) {
      console.log(index, row);
      console.log('handleTransferProduct');
    },
    handleUpdate: function (index, row) {
      this.dialogVisible = true;
      this.dialogTitle = '编辑类型';
      this.productAttrCate.name = row.name;
      this.productAttrCate.id = row.id;
    },
    handleDelete: function (index, row) {
      this.$confirm('是否要删除该属性分类', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deleteProductAttrCate(row.id).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.getList();
        });
      });
    },
    handleClose: function (done) {
      if (this.dialogVisible && this.$refs.productAttrCateForm) {
        this.$refs.productAttrCateForm.clearValidate();
        done();
      }
    },
  }
}
</script>

<style scoped>

</style>