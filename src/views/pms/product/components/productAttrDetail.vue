<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性类型：">
        <el-select v-model="value.productAttributeCategoryId" placeholder="请选择属性类型" @change="handleProductAttrChange">
          <el-option v-for="item in productAttributeCategoryOptions" :key="item.value" :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr,idx) in selectProductAttr">
            {{ productAttr.name }}
            <el-checkbox-group v-if="productAttr.hasAddStatus===0" v-model="selectProductAttr[idx].values">
              <el-checkbox v-for="item in getInputListAttr(productAttr.inputList)" :label="item" :key="item"
                           class="littleMarginLeft">
              </el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div v-for="(item ,index) in selectProductAttr[idx].options" style="display: inline-block"
                     class="littleMarginLeft">
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button type="text" class="littleMarginLeft" @click="handleRemoveAttrValue(idx,index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-mode="addProductAttrValue" style="width: 160px;margin-right: 10px" clearable></el-input>
              <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px" :data="value.skuStockList" border
                  :cell-style="{'text-align':'center'}"
                  :header-cell-style="{'text-align':'center'}">
          <el-table-column v-for="(item,index) in selectProductAttr" :label="item.name" :key="item.id">
            <template v-slot="scope">{{ getProductSkuSp(scope.row, index) }}</template>
          </el-table-column>
          <el-table-column label="销售价格" width="80">
            <template v-slot="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="80">
            <template v-slot="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存预警值" width="80">
            <template v-slot="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="SKU编号" width="80">
            <template v-slot="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template v-slot="scope">
              <el-button type="text" @click="handleRemoveProductSku(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuList">刷新列表</el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPrice">同步价格</el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuStock">同步库存</el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item) in selectProductAttrPics" :key="item">
            <span>{{ item.name }}:</span>
            <single-upload v-model="item.pic"
                           style="width: 300px;display: inline-block;margin-left:10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardbg">
          <div v-for="(item,index) in selectProductParam" :class="{littleMarginTop:index!==0}" :key="item">
            <div class="paramInputLabel">{{ item.name }}</div>
            <el-select v-if="item.inputType===1" class="paramInput" v-model="selectProductParam[index].value">
              <el-option v-for="item in getParamInputList(item.inputList)" :key="item" :label="item"
                         :value="item"></el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectProductParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步,填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步,选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {fetchList as fetchMemberLevelList} from '@/api/memberLevel'

import SingleUpload from "@/components/Upload/singleUpload";
import MultiUpload from "@/components/Upload/multiUpload";

export default {
  components: {SingleUpload, MultiUpload},
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      pickerOptions1: {
        // 禁用日期通过 disabledDate 设置，传入函数
        disabledDate: function (time) {
          return time.getTime() < Date.now();
        }
      },
    }
  },
  created() {
    if (!this.isEdit) {
      fetchMemberLevelList({defaultStatus: 0}).then(response => {
        let memberLevelList = [];
        for (let i = 0; i < response.data.length; i++) {
          let item = response.data[i];
          memberLevelList.push({memberLevelId: item.id, memberLevelName: item.name})
        }
        this.value.memberPriceList = memberLevelList;
      });
    }
  },
  computed: {
    selectServiceList: function () {
      return {
        get: function () {
          let list = [];
          if (this.value.serviceIds === undefined || this.value.serviceIds == null || this.value.serviceIds === '') {
            return list;
          }
          let ids = this.value.serviceIds.split(',');
          for (let i = 0; i < ids.length; i++) {
            list.push(Number(ids[i]));
          }
          return list;
        },
        set: function (newValue) {
          let serviceIds = '';
          if (newValue != null && newValue.length > 0) {
            for (let i = 0; i < newValue.length; i++) {
              serviceIds += newValue[i] + ',';
            }
            if (serviceIds.endsWith(',')) {
              serviceIds = serviceIds.substr(0, serviceIds.length - 1);
            }
            this.value.serviceIds = serviceIds;
          } else {
            this.value.serviceIds = null;
          }
        }
      }
    }
  },
  methods: {
    //处理编辑逻辑
    handleEditCreated: function () {
      let ids = this.value.serviceIds.split(',');
      for (let i = 0; i < ids.length; i++) {
        this.selectServiceList.push(Number(ids[i]));
      }
    },
    handleRemoveProductLadder: function (index) {
      let productLadderList = this.value.productLadderList;
      if (productLadderList.length === 1) {
        productLadderList.pop();
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        });
      } else {
        productLadderList.splice(index, 1);
      }
    },
    handleAddProductLadder: function () {
      let productLadderList = this.value.productLadderList;
      if (productLadderList.length < 3) {
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        });
      } else {
        this.$message({message: '最多只能添加三条', type: 'warning'});
      }
    },
    handleRemoveFullReduction: function (index) {
      let fullReductionList = this.value.productLadderList;
      if (fullReductionList.length === 1) {
        fullReductionList.pop();
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0,
        });
      } else {
        fullReductionList.splice(index, 1);
      }
    },
    handleAddFullReduction: function () {
      let fullReductionList = this.value.productFullReductionList;
      if (fullReductionList.length < 3) {
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0,
        });
      } else {
        this.$message({message: '最多只能添加三条', type: 'warning'});
      }
    },
    handlePrev: function () {
      this.$emit('prevStep');
    },
    handleNext: function () {
      this.$emit('nextStep');
    },
  }

}
</script>

<style scoped>
.littleMargin {
  margin-top: 10px;
}
</style>