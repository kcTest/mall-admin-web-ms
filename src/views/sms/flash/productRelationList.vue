<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleSelectProduct" size="mini" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}"
                ref="productRelationTable"
                :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
          <!-- Scoped Slot自定义列内容-->
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template v-slot="scope">{{ scope.row.product.name }}</template>
        </el-table-column>
        <el-table-column label="货号" width="140">
          <template v-slot="scope">NO.{{ scope.row.product.productSn }}</template>
        </el-table-column>
        <el-table-column label="商品价格" width="100">
          <template v-slot="scope">￥{{ scope.row.product.price }}</template>
        </el-table-column>
        <el-table-column label="剩余数量" width="100">
          <template v-slot="scope">{{ scope.row.product.stock }}</template>
        </el-table-column>
        <el-table-column label="秒杀价格" width="100">
          <template v-slot="scope">
            <p v-if="scope.row.flashPromotionPrice!==null">￥{{ scope.row.flashPromotionPrice }}</p>
          </template>
        </el-table-column>
        <el-table-column label="秒杀数量" width="100">
          <template v-slot="scope"> {{ scope.row.flashPromotionCount }}</template>
        </el-table-column>
        <el-table-column label="限购数量" width="100">
          <template v-slot="scope"> {{ scope.row.flashPromotionLimit }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100">
          <template v-slot="scope"> {{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
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
    <el-dialog title="选择商品" :visible.sync="selectDialogVisible" width="50%">
      <el-input v-model="dialogData.listQuery.keyword" style="width: 250px;margin-bottom: 20px" size="small"
                placeholder="商品名称搜索">
        <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch"></el-button>
      </el-input>
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}"
                @selection-change="handleDialogSelectionChange" :data="dialogData.list" v-loading="listLoading" border>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column label="商品名称">
          <template v-slot="scope"> {{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="货号" width="160">
          <template v-slot="scope"> {{ scope.row.productSn }}</template>
        </el-table-column>
        <el-table-column label="商品价格" width="120">
          <template v-slot="scope"> {{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100">
          <template v-slot="scope"> {{ scope.row.sort }}</template>
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
        <el-button @click="selectDialogVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSelectDialogConfirm" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑秒杀商品信息：" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="flashProductRelation" ref="flashProductRelationForm" label-width="150px" size="small">
        <el-form-item label="商品名称："><span>{{ flashProductRelation.product.name }}</span></el-form-item>
        <el-form-item label="货号："><span>NO.{{ flashProductRelation.product.productSn }}</span></el-form-item>
        <el-form-item label="商品价格："><span>￥{{ flashProductRelation.product.price }}</span></el-form-item>
        <el-form-item label="秒杀价格：">
          <el-input v-model="flashProductRelation.flashPromotionPrice" class="input-width">
            <template slot="prepend">￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="剩余数量："><span>￥{{ flashProductRelation.product.stock }}</span></el-form-item>
        <el-form-item label="秒杀数量：">
          <el-input v-model="flashProductRelation.flashPromotionCount" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="限购数量：">
          <el-input v-model="flashProductRelation.flashPromotionLimit" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="flashProductRelation.sort" class="input-width"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible=false" size="small">取 消</el-button>
      <el-button type="primary" @click="handleEditDialogConfirm" size="small">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  deleteFlashProductRelation,
  createFlashProductRelation,
  updateFlashProductRelation
} from '@/api/flashProductRelation'
import {fetchList as fetchProductList} from '@/api/product'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  flashPromotionId: null,
  flashPromotionSessionId: null,
};

export default {
  data: function () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      selectDialogVisible: false,
      isEdit: false,
      dialogData: {
        list: null,
        total: null,
        multiSelection: [],
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5
        }
      },
      editDialogVisible: false,
      flashProductRelation: {
        product: {}
      }
    }
  },
  created() {
    this.listQuery.flashPromotionId = this.$route.query.flashPromotionId;
    this.listQuery.flashPromotionSessionId = this.$route.query.flashPromotionSessionId;
    this.getList();
  },
  methods: {
    handleSelectSearch: function () {
      this.getDialogList();
    },
    handleDialogSelectionChange: function (val) {
      this.dialogData.multiSelection = val;
    },
    handleSelectProduct: function () {
      this.selectDialogVisible = true;
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
    handleSelectDialogConfirm: function () {
      if (this.dialogData.multiSelection < 1) {
        this.$message({message: '请选择一条记录', type: 'warning', duration: 1000});
        return;
      }
      let selectProducts = [];
      for (let i = 0; i < this.dialogData.multiSelection.length; i++) {
        selectProducts.push({
          productId: this.dialogData.multiSelection[i].id,
          flashPromotionId: this.listQuery.flashPromotionId,
          flashPromotionSessionId: this.listQuery.flashPromotionSessionId
        });
      }
      this.$confirm('是否要进行添加操作', '提示',
          {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        createFlashProductRelation(selectProducts).then(() => {
          this.$message({message: '添加成功', type: 'success', duration: 1000});
          this.selectDialogVisible = false;
          this.dialogData.multiSelection = [];
          this.getList();
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
      });
    },
    handleEditDialogConfirm: function () {
      this.$confirm('是否确认修改', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
          .then(() => {
            updateFlashProductRelation(this.flashProductRelation.id, this.flashProductRelation).then(() => {
              this.$message({message: '修改成功', type: 'success', duration: 1000});
              this.editDialogVisible = false;
              this.getList();
            }).catch(err => {
              console.log(err);
            });
          }).catch(() => {
      });
    },
    handleUpdate: function (index, row) {
      this.editDialogVisible = true;
      this.flashProductRelation = Object.assign({}, row);
    },
    handleDelete: function (index, row) {
      this.$confirm('是否要删除该商品', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        deleteFlashProductRelation(row.id).then(() => {
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
    handleDialogSizeChange: function (val) {
      this.dialogData.listQuery.pageNum = 1;
      this.dialogData.listQuery.pageSize = val;
      this.getDialogList();
    },
    handleDialogCurrentChange: function (val) {
      this.dialogData.listQuery.pageNum = val;
      this.getDialogList();
    },
  }
}
</script>

<style scoped>
.operate-container {
  margin-top: 0;
}

.input-width {
  width: 200px;
}
</style>