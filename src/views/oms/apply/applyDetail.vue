<template>
  <div class="detail-container">
    <el-card shadow="never">
      <span class="font-title-medium">退货商品</span>
      <el-table border class="standard-margin" ref="productTable" :data="productList"
                :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
        <el-table-column label="商品图片" width="160">
          <template v-slot="{row}"><img style="height: 80px" :src="row.productPic" alt=""></template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template v-slot="{row}">
            <span class="font-small">{{ row.productName }}</span><br>
            <span class="font-small">品牌：{{ row.productBrand }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180">
          <template v-slot="{row}">
            <span class="font-small">价格：￥{{ row.productRealPrice }}</span><br>
            <span class="font-small">货号：NO.{{ row.productId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="180">
          <template v-slot="{row}">{{ row.productAttr }}</template>
        </el-table-column>
        <el-table-column label="数量" width="100">
          <template v-slot="{row}">{{ row.productCount }}</template>
        </el-table-column>
        <el-table-column label="小计" width="100">
          <template>￥{{ totalAmount }}</template>
        </el-table-column>
      </el-table>
      <div style="float:right; margin-top: 15px;margin-bottom: 15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{ totalAmount }}</span>
      </div>
    </el-card>
    <el-card class="standard-margin" shadow="never">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">服务单号</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.id }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">申请状态</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.status | formatStatus }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height: 50px;line-height: 30px">订单编号
          </el-col>
          <el-col :span="18" class="form-border  font-small" style="height: 50px;line-height: 30px">
            {{ orderReturnApply.orderSn }}
            <el-button type="text" size="small" @click="handleViewOrder">查看</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">申请时间</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.createTime | formatTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">用户账号</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.memberUsername }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">联系人</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.returnName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">联系电话</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.returnPhone }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">退货原因</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.reason }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">问题描述</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.description }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height: 100px;line-height: 80px">凭证图片
          </el-col>
          <el-col :span="18" class="form-border  font-small" style="height: 100px">
            <img v-for="item in proofPics" :src="item" :key="item"
                 style="width: 80px;height: 80px" alt="">
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">订单金额</el-col>
          <el-col :span="18" class="form-border  font-small">￥{{ totalAmount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height: 52px;line-height: 32px">确认退款金额
          </el-col>
          <el-col :span="18" class="form-border  font-small">
            ￥
            <el-input size="small" v-model="updateStatusParam.returnAmount"
                      :disabled="orderReturnApply.status!==0" style="width: 200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
        <div v-show="orderReturnApply.status!==3">
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small" style="height: 52px;line-height: 32px">选择收货点
            </el-col>
            <el-col :span="18" class="form-border  font-small" style="height: 52px">
              <el-select size="small" style="width:200px" :disabled="orderReturnApply.status!==0"
                         v-model="updateStatusParam.companyAddressId">
                <el-option v-for="address in companyAddressList" :key="address.id" :label="address.addressName"
                           :value="address.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">收货人姓名</el-col>
            <el-col :span="18" class="form-border  font-small">{{ currentAddress.name }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">所在区域</el-col>
            <el-col :span="18" class="form-border  font-small">{{ currentAddress | formatRegion }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">详细地址</el-col>
            <el-col :span="18" class="form-border  font-small">{{ currentAddress.detailAddress }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">联系电话</el-col>
            <el-col :span="18" class="form-border  font-small">{{ currentAddress.phone }}</el-col>
          </el-row>
        </div>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status!==0">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">处理人员</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.handleMan }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">处理时间</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.handleTime | formatTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">处理备注</el-col>
          <el-col :span="18" class="form-border  font-small">{{ orderReturnApply.handleNote }}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===2">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">收货人员</el-col>
          <el-col :span="18" class="form-border  font-small">￥{{ orderReturnApply.receiveMan }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">收货时间</el-col>
          <el-col :span="18" class="form-border  font-small">￥{{ orderReturnApply.receiveTime | formatTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">收货备注</el-col>
          <el-col :span="18" class="form-border  font-small">￥{{ orderReturnApply.receiveNote }}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===0">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height: 52px;line-height: 32px">处理备注
          </el-col>
          <el-col :span="18" class="form-border  font-small">
            <el-input size="small" v-model="updateStatusParam.handleNote"
                      style="width: 200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===1">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height: 52px;line-height: 32px">收货备注
          </el-col>
          <el-col :span="18" class="form-border  font-small">
            <el-input size="small" v-model="updateStatusParam.receiveNote"
                      style="width: 200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 15px;text-align: center" v-show="orderReturnApply.status===0">
        <el-button type="primary" size="small" @click="handleUpdateStatus(1)">确认退货</el-button>
        <el-button type="danger" size="small" @click="handleUpdateStatus(3)">拒绝退货</el-button>
      </div>
      <div style="margin-top: 15px;text-align: center" v-show="orderReturnApply.status===1">
        <el-button type="primary" size="small" @click="handleUpdateStatus(2)">确认收货</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

import {formatDate} from '@/utils/date'
import {updateApplyStatus, getApplyDetail} from '@/api/returnApply'
import {fetchList} from '@/api/companyAddress'

const defaultOrderReturnApply = {
  id: null, orderId: null, companyAddressId: null, productId: null,
  orderSn: null, createTime: null, memberUsername: null, returnAmount: null,
  returnName: null, returnPhone: null, status: null, handleTime: null,
  productPic: null, productName: null, productBrand: null, productAttr: null,
  productCount: null, productPrice: null, productRealPrice: null, reason: null,
  description: null, proofPics: null, handleNote: null, handleMan: null,
  receiveMan: null, receiveTime: null, receiveNote: null
};

const defaultUpdateStatusParam = {
  companyAddressId: null, handleMan: 'admin', handleNote: null,
  receiveMan: 'admin', receiveNote: null, returnAmount: 0, status: 0
};

export default {
  data: function () {
    return {
      productList: null,
      orderReturnApply: Object.assign({}, defaultOrderReturnApply),
      updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
      companyAddressList: null,
      proofPics: null
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.getDetail();
  },
  computed: {
    totalAmount: function () {
      return this.orderReturnApply.productRealPrice * this.orderReturnApply.productCount;
    },
    currentAddress: function () {
      let id = this.updateStatusParam.companyAddressId;
      if (this.companyAddressList == null) {
        return {};
      }

      // console.log('$$$');
      // for (let address in this.companyAddressList) {
      //   console.log(address);
      // }
      //
      for (let address of this.companyAddressList) {
        if (address.id === id) {
          return address;
        }
      }

      // for (let i = 0; i < this.companyAddressList.length; i++) {
      //   let address = this.companyAddressList[i];
      //   if (address.id === id) {
      //     return address;
      //   }
      // }
      return null;
    }
  },
  methods: {
    getDetail: function () {
      getApplyDetail(this.id).then(response => {
        this.orderReturnApply = response.data;
        this.productList = [];
        this.productList.push(this.orderReturnApply);
        if (this.orderReturnApply.proofPics != null) {
          this.proofPics = this.orderReturnApply.proofPics.split(',');
        }
        //退货中 或者 完成 时
        if (this.orderReturnApply.status === 1 || this.orderReturnApply.status === 2) {
          this.updateStatusParam.returnAmount = this.orderReturnApply.returnAmount;
          this.updateStatusParam.companyAddressId = this.orderReturnApply.companyAddressId;
        }
        this.getCompanyAddressList();
      }).catch(err => {
        console.log(err);
      });
    },
    getCompanyAddressList: function () {
      fetchList().then(response => {
        this.companyAddressList = response.data;
        for (let address of this.companyAddressList) {
          //设置默认收货地址
          if (address.receiveStatus === 1 && this.orderReturnApply.status === 0) {
            this.updateStatusParam.companyAddressId = address.id;
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    handleViewOrder: function () {
      this.$router.push({path: '/oms/orderDetail', query: {id: this.orderReturnApply.orderId}});
    },
    handleUpdateStatus: function (status) {
      this.updateStatusParam.status = status;
      this.$confirm('是否要进行此操作', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        updateApplyStatus(this.id, this.updateStatusParam).then(() => {
          this.$message({message: '从操作成功', type: 'success', duration: 1000});
          this.$router.back();
        }).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        console.log(err);
      });
    }
  },
  filters: {

    formatStatus: function (val) {
      switch (val) {
        case 0:
          return '待处理';
        case 1:
          return '退货中';
        case 2:
          return '已完成';
        default:
          return '已拒绝';
      }
    },
    formatTime: function (val) {
      if (val == null || val === '') {
        return 'N/A';
      }
      let date = new Date(val);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatRegion: function (val) {
      let str = val.province;
      if (val.city != null) {
        str += '  ' + val.city;
      }
      str += '  ' + val.region;
      return str;
    }
  }
}
</script>

<style scoped>
.detail-container {
  position: absolute;
  left: 0;
  right: 0;
  width: 72%;
  padding: 35px 35px 15px 35px;
  margin: 20px auto;
}

.standard-margin {
  margin-top: 15px;
}

.form-container-border {
  margin-top: 15px;
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
}

.form-border {
  padding: 10px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
}

.form-left-bg {
  background: #f2f6fc;
}

img {
  border-style: none;
}
</style>