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
          <el-form-item label="商品名称：">
            <el-input class="input-width" v-model="listQuery.productName" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="推荐状态：">
            <el-select clearable class="input-width" v-model="listQuery.recommendStatus" placeholder="全部">
              <el-option v-for="item in recommendOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleSelectProduct" size="mini" style="margin-left: 20px">选择商品</el-button>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" ref="newProductTable"
                :data="list" style="width: 100%" v-loading="listLoading" border
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column label="编号" width="120">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template v-slot="scope"> {{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="是否推荐" width="200">
          <template v-slot="scope">
            <el-switch @change="handleRecommendStatusChange(scope.$index,scope.row)" :active-value="1"
                       :inactive-value="0"
                       v-model="scope.row.recommendStatus"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160">
          <template v-slot="scope"> {{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="状态" width="160">
          <template v-slot="scope">{{ scope.row.recommendStatus | formatRecommendStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="handleEditSort(scope.$index,scope.row)">设置排序</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
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
    <el-dialog title="选择商品" :visible.sync="selectDialogVisible" width="50%">
      <el-input v-model="dialogData.listQuery.keyword" style="width: 250px;margin-bottom: 20px" size="small"
                placeholder="商品名称搜索">
        <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch"></el-button>
      </el-input>
      <el-table :data="dialogData.list" @selection-change="handleDialogSelectionChange" border
                :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column label="商品名称">
          <template v-slot="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="货号" width="160">
          <template v-slot="{row}">NO.{{ row.productSn }}</template>
        </el-table-column>
        <el-table-column label="价格" width="120">
          <template v-slot="{row}">￥{{ row.price }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleDialogSizeChange" @current-change="handleDialogCurrentChange"
                       layout="prev,pager,next" :page-sizes="[5,10,15]"
                       :page-size="dialogData.listQuery.pageSize"
                       :current-page.sync="dialogData.listQuery.pageNum" :total="dialogData.total">
        </el-pagination>
      </div>
      <div style="clear: both"></div>
      <div slot="footer">
        <el-button size="small" @click="selectDialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSelectDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置排序" :visible.sync="sortDialogVisible" width="40%">
      <el-form :model="sortDialogData" label-width="150px">
        <el-form-item label="排序">
          <el-input v-model="sortDialogData.sort" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="sortDialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleUpdateSort">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  updateRecommendStatus,
  deleteNewProduct,
  createNewProduct,
  updateNewProductSort
} from '@/api/newProduct'
import {fetchList as fetchProductList} from "@/api/product";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  productName: null,
  recommendStatus: null
};

const defaultRecommendOptions = [
  {
    label: '未推荐',
    value: 0
  },
  {
    label: '推荐中',
    value: 1
  }
];

export default {
  data: function () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      recommendOptions: Object.assign({}, defaultRecommendOptions),
      list: null,
      total: null,
      listLoading: false,
      sortDialogVisible: false,
      sortDialogData: {sort: 0, id: null},
      multiSelection: [],
      operateType: null,
      operatesOptions: [
        {
          label: '设为推荐',
          value: 0
        },
        {
          label: '取消推荐',
          value: 1
        },
        {
          label: '删除',
          value: 2
        },
      ],
      selectDialogVisible: false,
      dialogData: {
        list: null,
        total: null,
        multiSelection: [],
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5
        }
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelectProduct: function () {
      this.selectDialogVisible = true;
      this.getDialogList();
    },
    handleSelectionChange: function (val) {
      this.multiSelection = val;
    },
    handleRecommendStatusChange: function (index, row) {
      this.updateRecommendStatus(row.id, row.recommendStatus);
    },
    updateRecommendStatus: function (ids, status) {
      this.$confirm('是否要修改推荐状态', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('recommendStatus', status);
        updateRecommendStatus(params).then(() => {
          this.$message({message: '修改成功', type: 'success', duration: 1000});
          this.getList();
        }).catch(err => {
          console.log(err);
        })
      }).catch(() => {
        this.$message({message: '已取消操作', type: 'success', duration: 1000});
        this.getList();
      });
    },
    handleEditSort: function (index, row) {
      this.sortDialogVisible = true;
      this.sortDialogData.sort = row.sort;
      this.sortDialogData.id = row.id;
    },
    handleDelete: function (index, row) {
      this.deleteProduct(row.id);
    },
    deleteProduct: function (ids) {
      this.$confirm('是否要删除该推荐', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append('ids', ids);
        deleteNewProduct(params).then(() => {
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
    handleBatchOperate: function () {
      // console.log(0 == []); // true
      if (this.multiSelection.length < 1) {
        this.$message({message: '请选择一条记录', type: 'warning', duration: 1000});
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multiSelection.length; i++) {
        ids.push(this.multiSelection[i].id);
      }
      if (this.operateType === 0) {
        //设为推荐
        this.updateRecommendStatus(ids, 1);
      } else if (this.operateType === 1) {
        //取消推荐
        this.updateRecommendStatus(ids, 0);
      } else if (this.operateType === 2) {
        //删除
        this.deleteProduct(ids);
      } else {
        this.$message({message: '请选择批量操作类型', type: 'warning', duration: 1000});
      }
    },
    handleSelectSearch: function () {
      this.dialogData.listQuery.pageNum = 1;
      this.getDialogList();
    },
    getDialogList: function () {
      fetchProductList(this.dialogData.listQuery).then((response) => {
        this.dialogData.list = response.data.list;
        this.dialogData.total = response.data.total;
      }).catch(err => {
        console.log(err);
      });
    },
    handleDialogSelectionChange: function (val) {
      this.dialogData.multiSelection = val;
    },
    handleDialogSizeChange: function (val) {
      //每页数量
      this.dialogData.listQuery.pageNum = 1;
      this.dialogData.listQuery.pageSize = val;
      this.getDialogList();
    },
    handleDialogCurrentChange: function (val) {
      //每页数量
      this.dialogData.listQuery.pageNum = val;
      this.getDialogList();
    },
    handleSelectDialogConfirm: function () {
      if (this.dialogData.multiSelection < 1) {
        this.$message({message: '请选择一条记录', type: 'warning', duration: 1000});
        return;
      }
      let selectProducts = [];
      for (let i = 0; i < this.dialogData.multiSelection.length; i++) {
        selectProducts.push({
          productId: this.dialogData.multiSelection[i].id,
          productName: this.dialogData.multiSelection[i].name,
        });
      }
      this.$confirm('是否要进行添加操作', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        createNewProduct(selectProducts).then(() => {
          this.$message({message: '添加成功', type: 'success', duration: 1000});
          this.dialogData.multiSelection = [];
          this.selectDialogVisible = false;
          this.getList();
        })
      });
    },
    handleUpdateSort: function () {
      this.$confirm('是否要修改排序', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        updateNewProductSort(this.sortDialogData.id, {sort: this.sortDialogData.sort}).then(() => {
          this.$message({message: '修改成功', type: 'success', duration: 1000});
          this.sortDialogVisible = false;
          this.getList();
        })
      });
    }
  },
  filters: {
    formatRecommendStatus: function (val) {
      return val === 1 ? '推荐中' : '未推荐';
    }
  }
}
</script>

<style scoped>
.input-width {
  width: 203px;
}
</style>