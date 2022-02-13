<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">后台项目</div>
            <div class="color-main address-content">
              <a href="https://github.com/macrozheng/mall">mall</a>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">前端项目</div>
            <div class="color-main address-content">
              <a href="https://github.com/macrozheng/mall-admin-web">mall-admin-web</a>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">学习教程</div>
            <div class="color-main address-content">
              <a href="https://github.com/macrozheng/mall-admin-web">mall-learning</a>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon" alt="">
            <div class="total-title">今日订单总数</div>
            <div class="total-value">200</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon" alt="">
            <div class="total-title">今日销售总额</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon" alt="">
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-card class="mine-layout">
      <div style="text-align:center">
        <img width="150px" height="150px" alt=""
             src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/banner/qrcode_for_macrozheng_258.jpg">
      </div>
      <div style="text-align: center"> mall全套学习教程连载中！</div>
      <div style="text-align: center;margin-top: 5px"><span class="color-main">关注公众号</span>，第一时间获取。</div>
    </el-card>
    <div class="unhandled-layout">
      <div class="layout-title">待处理事务</div>
      <div class="unhandled-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">待确认收货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">新缺货登记</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">待处理退款申请</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">已发货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">待处理退货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="unhandled-item">
              <span class="font-medium">广告位即将到期</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">400</el-col>
                <el-col :span="6" class="color-danger overview-item-value">50</el-col>
                <el-col :span="6" class="color-danger overview-item-value">500</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">库存紧张</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">200</el-col>
                <el-col :span="6" class="color-danger overview-item-value">1000</el-col>
                <el-col :span="6" class="color-danger overview-item-value">5000</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding:20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size:24px;padding: 10px 0">10000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color:#c0c4cc;font-size:14px">同比上月</span>
              </div>
            </div>
            <div>
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size:24px;padding: 10px 0">1000</div>
              <div>
                <span class="color-success" style="font-size: 14px">-10%</span>
                <span style="color:#c0c4cc;font-size:14px">同比上周</span>
              </div>
            </div>
            <div>
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size:24px;padding: 10px 0">100000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color:#c0c4cc;font-size:14px">同比上月</span>
              </div>
            </div>
            <div>
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size:24px;padding: 10px 0">50000</div>
              <div>
                <span class="color-success" style="font-size: 14px">-10%</span>
                <span style="color:#c0c4cc;font-size:14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span=20>
          <div style="padding: 10px;border-left: 1px solid #dcdfe6">
            <el-date-picker style="float: right;z-index: 1" size="small" v-model="orderCountDate"
                            type="daterange" unlink-panels range-separator="|"
                            start-placeholder="开始日期" end-placeholder="结束日期"
                            @change="handleDateChange" :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line :data="chartData" :legend-visible="false" :loading="loading"
                       :data-empty="dataEmpty" :settings="chartSettings">

              </ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import img_home_order from '@/assets/images/home_order.png'
import img_home_today_amount from '@/assets/images/home_today_amount.png'
import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png'
import {str2Data} from "@/utils/date";

const DATA_FROM_BACKEND = {
  columns: ['date', 'orderCount', 'orderAmount'],
  rows: [
    {'date': '2022-02-01', 'orderCount': 100, 'orderAmount': 1001},
    {'date': '2022-02-02', 'orderCount': 200, 'orderAmount': 2001},
    {'date': '2022-02-03', 'orderCount': 300, 'orderAmount': 3001},
    {'date': '2022-02-04', 'orderCount': 400, 'orderAmount': 4001},
    {'date': '2022-02-05', 'orderCount': 500, 'orderAmount': 5001},
    {'date': '2022-02-06', 'orderCount': 600, 'orderAmount': 6001},
    {'date': '2022-02-07', 'orderCount': 700, 'orderAmount': 7001},
    {'date': '2022-02-08', 'orderCount': 400, 'orderAmount': 4001},
    {'date': '2022-02-09', 'orderCount': 300, 'orderAmount': 3001},
    {'date': '2022-02-10', 'orderCount': 200, 'orderAmount': 2001},
    {'date': '2022-02-11', 'orderCount': 100, 'orderAmount': 1001},
    {'date': '2022-02-12', 'orderCount': 200, 'orderAmount': 2001},
    {'date': '2022-02-13', 'orderCount': 400, 'orderAmount': 4001},
    {'date': '2022-02-14', 'orderCount': 600, 'orderAmount': 6001},
    {'date': '2022-02-15', 'orderCount': 700, 'orderAmount': 7001}
  ]
}

export default {
  data: function () {
    return {
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount,
      orderCountDate: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            let start = new Date(2022, 1, 1);
            const end = new Date();
            end.setTime(start.getTime());
            end.setDate(end.getDate() + 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一月',
          onClick(picker) {
            let start = new Date(2022, 1, 1);
            const end = new Date();
            end.setTime(start.getTime());
            end.setMonth(end.getMonth() + 1);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      chartSettings: {
        xAxisType: 'time',
        area: true,
        axisSite: {right: ['orderAmount']},
        labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}
      },
      chartData: {
        columns: [], rows: []
      },
      loading: false,
      dataEmpty: false
    }
  },
  created() {
    this.initOrderCountData();
    this.getData();
  },
  methods: {
    initOrderCountData: function () {
      //默认当月
      let start = new Date(2022, 1, 1);
      const end = new Date();
      end.setTime(start.getTime());
      end.setMonth(end.getMonth() + 1);
      end.setDate(end.getDate() - 1);
      this.orderCountDate = [start, end];
    },
    handleDateChange: function () {
      this.getData();
    },
    getData: function () {
      setTimeout(() => {
        this.chartData = {
          columns: ['date', 'orderCount', 'orderAmount'],
          rows: []
        };
        for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          let item = DATA_FROM_BACKEND.rows[i];
          let currDateOfData = str2Data(item.date);
          let start = this.orderCountDate[0];
          let end = this.orderCountDate[1];
          if (currDateOfData.getTime() >= start.getTime() && currDateOfData.getTime() <= end.getTime()) {
            this.chartData.rows.push(item);
          }
        }
        this.loading = false;
        this.dataEmpty = false;
      }, 1000)
    }
  }
}
</script>

<style scoped>

.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}

/*address-layout*/
.address-layout {
}

.out-border {
  border: 1px solid #dcdfe6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}

.address-content {
  padding: 20px;
  font-size: 18px;
}

/*total-layout*/
.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  left: 70px;
  top: -50px;
  font-size: 16px;
  color: #909399;
}

.total-value {
  position: relative;
  left: 70px;
  top: -40px;
  color: #606266;
  font-size: 18px;
}

/*mine-layout*/
.mine-layout {
  position: absolute;
  top: 107px;
  right: 140px;
  width: 250px;
  height: 235px;
}

/*unhandled-layout*/
.unhandled-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

.unhandled-content {
  padding: 20px 40px;
}

.unhandled-item {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}

/*overview-layout*/
.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

/*statistics-layout*/
.statistics-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
</style>