<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
          class="btn-add"
          @click="handleAddMenu()"
          size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="menuTable" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="菜单名称">
          <template v-slot="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="菜单级数" width="100">
          <template v-slot="scope">{{ scope.row.level | levelFilter }}</template>
        </el-table-column>
        <el-table-column label="前端名称">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="前端图标" width="100">
          <template v-slot="scope">
            <svg-icon :icon-class="scope.row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100">
          <template v-slot="scope">
            <el-switch
                @change="handleHiddenChange(scope.$index, scope.row)"
                :active-value="0"
                :inactive-value="1"
                v-model="scope.row.hidden">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100">
          <template v-slot="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="120">
          <template v-slot="scope">
            <el-button
                size="mini"
                type="text"
                :disabled="scope.row.level | disableNextLevel"
                @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button
                size="mini"
                type="text"
                @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize"
          :page-sizes="[10,15,20]"
          :current-page.sync="listQuery.pageNum"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {fetchList, deleteMenu, updateHidden} from '@/api/menu'

export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      parentId: 0
    }
  },
  created() {
    this.resetParentId();
    this.getList();
  },
  watch: {
    $route() {
      this.resetParentId();
      this.getList();
    }
  },
  methods: {
    resetParentId() {
      this.listQuery.pageNum = 1;
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
    },
    handleAddMenu() {
      this.$router.push('/ums/addMenu');
    },
    getList() {
      this.listLoading = true;
      fetchList(this.parentId, this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleHiddenChange(index, row) {
      updateHidden(row.id, {hidden: row.hidden}).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    handleShowNextLevel(index, row) {
      this.$router.push({path: '/ums/menu', query: {parentId: row.id}})
    },
    handleUpdate(index, row) {
      this.$router.push({path: '/ums/updateMenu', query: {id: row.id}});
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      });
    }
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return '一级';
      } else if (value === 1) {
        return '二级';
      }
    },
    disableNextLevel(value) {
      return value !== 0;
      
    }
  }
}
</script>

<style scoped>

</style>
