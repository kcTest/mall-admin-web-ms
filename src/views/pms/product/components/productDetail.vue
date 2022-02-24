<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps>
    <product-info-detail v-show="showStatus[0]" v-model="productParam" :is-edit="isEdit"
                         @nextStep="nextStep"></product-info-detail>
    <product-sale-detail v-show="showStatus[1]" v-model="productParam" :is-edit="isEdit" @prevStep="prevStep"
                         @nextStep="nextStep"></product-sale-detail>
    <product-attr-detail v-show="showStatus[2]" v-model="productParam" :is-edit="isEdit" @prevStep="prevStep"
                         @nextStep="nextStep"></product-attr-detail>
    <product-relation-detail v-show="showStatus[3]" v-model="productParam" :is-edit="isEdit" @prevStep="prevStep"
                             @finishCommit="finishCommit"></product-relation-detail>
  </el-card>
</template>

<script>
import ProductInfoDetail from './productInfoDetail';
import ProductSaleDetail from './productSaleDetail';
import ProductAttrDetail from './productAttrDetail';
import ProductRelationDetail from "./productRelationDetail";

import {createProduct, updateProduct, getProduct} from "@/api/product";

const defaultProductParam = {
  albumPics: '',
  brandId: null,
  brandName: '',
  deleteStatus: 0,
  description: '',
  detailDesc: '',
  detailHtml: '',
  detailMobileHtml: '',
  detailTitle: '',
  freightTemplateId: 0,
  flashPromotionCount: '',
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  gitPoint: 0,
  gitGrowth: 0,
  keywords: '',
  lowStock: 0,
  name: '',
  newStatus: 0,
  note: '',
  originalPrice: '',
  pic: '',
  memberPriceList: [],
  productFullReductionList: [{fullPrice: 0, reducePrice: 0}],
  productLadderList: [{count: 0, discount: 0, price: 0}],
  previewStatus: 0,
  price: 0,
  productAttributeCategoryId: null,
  productAttributeValueList: [],
  skuStockList: [],
  subjectProductRelationList: [],
  preferenceAreaProductRelationList: [],
  productCategoryId: null,
  productCategoryName: '',
  productSn: '',
  promotionEndTime: '',
  promotionPerLimit: 0,
  promotionPrice: null,
  promotionStartTime: '',
  promotionType: 0,
  publishStatus: 0,
  recommendStatus: 0,
  sale: 0,
  serviceIds: '',
  sort: 0,
  stock: 0,
  subTitle: '',
  unit: '',
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0
}

export default {
  components: {ProductInfoDetail, ProductSaleDetail, ProductAttrDetail, ProductRelationDetail},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      active: 0,
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false, false, false]
    }
  },
  created() {
    if (this.isEdit) {
      getProduct(this.$route.query.id).then(response => {
        this.productParam = response.data;
      });
    }
  },
  methods: {
    hideAll: function () {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep: function () {
      if (this.active > 0 && this.active <= this.showStatus.length - 1) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep: function () {
      if (this.active <= this.showStatus.length - 2) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit: function (isEdit) {
      this.$confirm('是否要提交产品', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        if (isEdit) {
          updateProduct(this.$route.query.id, this.productParam).then(() => {
            this.$message({message: '提交成功', type: 'success', duration: 1000});
            this.$router.back();
          }).catch(err => {
            console.log(err);
          });
        } else {
          createProduct(this.productParam).then(() => {
            this.$message({message: '提交成功', type: 'success', duration: 1000});
            location.reload();
          }).catch(err => {
            console.log(err);
          });
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
}

</script>

<style scoped>
.form-container {
  width: 800px;
}
</style>