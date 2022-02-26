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
            <el-input class="input-width" v-model="listQuery.orderSn" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input class="input-width" v-model="listQuery.receiverKeyword" placeholder="收货人姓名/手机号码"></el-input>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker class="input-width" v-model="listQuery.createTime" value-format="yyyy-MM-dd" type="date"
                            placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select class="input-width" v-model="listQuery.status" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单分类：">
            <el-select class="input-width" v-model="listQuery.orderType" placeholder="全部" clearable>
              <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源：">
            <el-select style="width: 203px" v-model="listQuery.sourceType" placeholder="全部">
              <el-option v-for="item in sourceTypeOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-right: 4px"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" ref="orderTable"
                :data="list" style="width: 100%" @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column label="编号" width="80">
          <!-- Scoped Slot自定义列内容-->
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="180">
          <template v-slot="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180px">
          <template v-slot="scope"> {{ scope.row.createTime | formatCreateTime }}</template>
        </el-table-column>
        <el-table-column label="用户账号">
          <template v-slot="scope">{{ scope.row.memberUsername }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120">
          <template v-slot="scope">￥{{ scope.row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120">
          <template v-slot="scope">{{ scope.row.payType | formatPayType }}</template>
        </el-table-column>
        <el-table-column label="订单来源" width="120">
          <template v-slot="scope">{{ scope.row.sourceType | formatSourceType }}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template v-slot="scope">{{ scope.row.status  | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button size="mini" @click="handleViewerOrder(scope.$index,scope.row)">查看订单</el-button>
            <el-button size="mini" @click="handleCloseOrder(scope.$index,scope.row)" v-show="scope.row.status===0">关闭订单
            </el-button>
            <el-button size="mini" @click="handleDeliveryOrder(scope.$index,scope.row)" v-show="scope.row.status===1">
              订单发货
            </el-button>
            <el-button size="mini" @click="handleViewLogistics"
                       v-show="scope.row.status===2||scope.row.status===3">
              订单跟踪
            </el-button>
            <el-button size="mini" type="danger" @click="handleDeleteOrder(scope.$index,scope.row)"
                       v-show="scope.row.status===4">
              删除订单
            </el-button>
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
    <el-dialog title="关闭订单" :visible.sync="closeOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input type="textarea" rows="5" placeholder="请输入内容" v-model="closeOrder.content" style="width: 80%">
      </el-input>
      <span slot="footer" class="dialog-footer">
              <el-button @click="closeOrder.dialogVisible=false">取 消</el-button>
              <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>

<script>
import {closeOrder, deleteOrder, fetchList} from '@/api/order'
import {formatDate} from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";

const defaultListQuery = {
  orderSn: null,
  receiverKeyword: null,
  createTime: null,
  status: null,
  orderType: null,
  sourceType: null,
  pageNum: 1,
  pageSize: 10,
};

export default {
  components: {LogisticsDialog},
  data: function () {
    return {
      statusOptions: [
        {
          label: '待付款',
          value: 0
        },
        {
          label: '待发货',
          value: 1
        },
        {
          label: '已发货',
          value: 2
        },
        {
          label: '已完成',
          value: 3
        },
        {
          label: '已关闭',
          value: 4
        }
      ],
      orderTypeOptions: [
        {
          label: '正常订单',
          value: 0
        },
        {
          label: '秒杀订单',
          value: 1
        },
      ],
      sourceTypeOptions: [
        {
          label: 'PC订单',
          value: 0
        },
        {
          label: 'APP订单',
          value: 1
        }
      ],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      logisticsDialogVisible: false,
      operatesOptions: [
        {
          label: '批量发货',
          value: 1
        },
        {
          label: '关闭订单',
          value: 2
        },
        {
          label: '删除订单',
          value: 3
        }
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
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
    },
    formatPayType: function (val) {
      switch (val) {
        case 1:
          return '支付宝';
        case  2:
          return '微信';
        default:
          return '未支付';
      }
    },
    formatSourceType: function (val) {
      return val === 1 ? 'APP订单' : 'PC订单';
    },
    formatStatus: function (val) {
      switch (val) {
        case 1:
          return '待发货';
        case 2:
          return '已发货';
        case 3:
          return '已完成';
        case 4:
          return '已关闭';
        case 5:
          return '无效订单';
        default:
          return '待付款';
      }
    }
  },
  methods: {
    handleViewerOrder: function (index, row) {
      this.$router.push({path: '/oms/orderDetail', query: {id: row.id}});
    },
    handleCloseOrder: function (index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleDeliveryOrder: function (index, row) {
      let listItem = this.covertOrder(row);
      this.$router.push({path: '/oms/deliveryOrderList', query: {list: [listItem]}});
    },
    covertOrder: function (order) {
      let address = order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress;
      return {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: null,
        deliverySn: null
      };
    },
    handleViewLogistics: function () {
      this.logisticsDialogVisible = true;
    },
    handleDeleteOrder: function (index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    deleteOrder: function (ids) {
      this.$confirm('是否要进行该删除操作', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append('ids', ids);
        console.log(params.toString());
        deleteOrder(params).then(() => {
          this.$message({message: '删除成功', type: 'success', duration: 1000});
          this.getList();
        })
      }).catch(err => {
        console.log(err);
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
    handleBatchOperate: function () {
      if (this.multiSelection == null || this.multiSelection.length < 1) {
        this.$message({
          message: '请选择要操作的订单', type: 'warning', duration: 1000
        });
        return;
      }
      if (this.operateType === 1) {
        //批量发货
        let list = [];
        for (let i = 0; i < this.multiSelection.length; i++) {
          if (this.multiSelection[i].status === 1) {
            list.push(this.coverOrder(this.multiSelection[i]));
          }
        }
        if (list.length === 0) {
          this.$message({
            message: '选中订单中没有可以发货的订单', type: 'warning', duration: 1000
          });
          return;
        }
        this.$router.push({path: '/oms/deliveryOrderList', query: {list: list}});
      } else if (this.operateType === 2) {
        //关闭订单
        this.closeOrder.orderIds = [];
        for (let i = 0; i < this.multiSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multiSelection[i].id);
        }
        this.closeOrder.dialogVisible = true;
      } else if (this.operateType === 3) {
        //删除订单
        let ids = [];
        for (let i = 0; i < this.multiSelection.length; i++) {
          ids.push(this.multiSelection[i].id);
        }
        this.deleteOrder(ids);
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
    handleCloseOrderConfirm: function () {
      if (this.closeOrder.content == null || this.closeOrder.content === '') {
        this.$message({message: '操作备注不能为空', type: 'warning', duration: 1000});
        return;
      }
      let params = new URLSearchParams();
      params.append('ids', this.closeOrder.orderIds);
      params.append('note', this.closeOrder.content);
      closeOrder(params).then(() => {
        this.closeOrder.orderIds = [];
        this.closeOrder.dialogVisible = false;
        this.getList();
        this.$message({message: '修改成功', type: 'success', duration: 1000});
      });
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