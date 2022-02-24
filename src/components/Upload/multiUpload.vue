<template>
  <div>
    <el-upload :action="useOss?ossUploadUrl:minioUploadUrl" :data="useOss?dataObj:null"
               :headers="useOss?null:minioHeader" list-type="picture-card" :file-list="fileList"
               :before-upload="beforeUpload" :on-remove="handleRemove"
               :on-success="handleUploadSuccess" :on-preview="handlePreview" :limit="maxCount"
               :on-exceed="handleExceed">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {policy} from '@/api/oss'

export default {
  props: {
    value: Array,
    maxCount: {
      type: Number,
      default: 5
    }
  },
  data: function () {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccesskeyId: '',
        dir: '',
        host: ''
      },
      dialogVisible: false,
      dialogImageUrl: null,
      useOss: false,
      ossUploadUrl: '',
      minioUploadUrl: process.env.VUE_APP_BASE_API + '/minio/upload'
    }
  },
  computed: {
    minioHeader: function () {
      return {Authorization: this.$store.getters.token};
    },
    fileList: function () {
      let fileList = [];
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({url: this.value[i]});
      }
      return fileList;
    }
  },
  methods: {
    emitInput: function (fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url);
      }
      this.$emit('input', value);
    },
    handleRemove: function (file, fileList) {
      this.$emit(fileList);
    },
    handlePreview: function (file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    beforeUpload: function () {
      let _self = this;
      if (!this.useOss) {
        //不需要使用policy
        return true;
      }
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.data.policy;
          _self.dataObj.signature = response.data.signature;
          _self.dataObj.ossaccesskeyId = response.data.accessKeyId;
          _self.dataObj.key = response.data.dir + '/${filename}';
          _self.dataObj.dir = response.data.dir;
          _self.dataObj.host = response.data.host;
          _self.ossUploadUrl = response.data.host;
          resolve(true);
        }).catch((err) => {
          console.log('beforeUpload', err)
          reject(false);
        });
      });
    },
    handleUploadSuccess: function (res, file) {
      let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
      if (!this.useOss) {
        url = res.data.url;
      }
      this.fileList.push({name: file.name, url: url});
      this.emitInput(this.fileList);
    },
    handleExceed: function () {
      this.$message({message: '最多只能上传' + this.maxCount + '张图片', type: 'warning', duration: 1000});
    }
  }
}
</script>

<style scoped>

</style>