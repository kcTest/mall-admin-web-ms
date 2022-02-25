<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandForm" label-width="150px">
      <el-form-item label="品牌名称" :prop="name">
        <el-input v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母">
        <el-input v-model="brand.firstLetter"></el-input>
      </el-form-item>
      <el-form-item label="品牌logo" :prop="logo">
        <single-upload v-model="brand.logo"></single-upload>
      </el-form-item>
      <el-form-item label="品牌专区大图">
        <single-upload v-model="brand.bigPic"></single-upload>
      </el-form-item>
      <el-form-item label="品牌故事">
        <el-input type="textarea" :autosize="true" v-model="brand.brandStory"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model.number="brand.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="brand.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌制造商">
        <el-radio-group v-model="brand.factoryStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('brandForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<script>

import SingleUpload from "@/components/Upload/singleUpload";

import {updateBrand, createBrand, getBrand} from '@/api/brand'

const defaultBrand = {
  bigPic: '',
  brandStory: '',
  factoryStatus: 0,
  firstLetter: '',
  logo: '',
  name: '',
  showStatus: 0,
  sort: 0
}

export default {
  components: {SingleUpload},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      brand: Object.assign({}, defaultBrand),
      rules: {
        name: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在2到140字符', trigger: 'blur'}
        ],
        logo: [
          {required: true, message: '请输入品牌logo', trigger: 'blur'},
        ],
        sort: [
          {type: 'number', message: '排序必须位数字'},
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      getBrand(this.$route.query.id).then(response => {
        this.brand = response.data;
      });
    } else {
      this.brand = Object.assign({}, defaultBrand);
    }
  },
  methods: {
    onSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateBrand(this.$route.query.id, this.brand).then(() => {
                this.$refs[formName].resetFields();
                this.$message({message: '修改成功', type: 'success', duration: 1000});
                this.$router.back();
              });
            } else {
              createBrand(this.brand).then(() => {
                this.$refs[formName].resetFields();
                this.brand = Object.assign({}, defaultBrand);
                this.$message({message: '提交成功', type: 'success', duration: 1000});
              });
            }
          });
        }
      })
    },
    resetForm: function (formName) {
      this.$refs[formName].resetFields();
      this.brand = Object.assign({}, defaultBrand);
    }
  }
}
</script>

<style scoped>

</style>