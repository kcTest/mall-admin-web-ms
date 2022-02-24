<template>
  <div>
    <el-upload :action="useOss?ossUploadUrl:minioUploadUrl" :data="useOss?dataObj:null"
               :headers="useOss?null:minioHeader" list-type="picture" :multiple="false" :show-file-list="showFileList"
               :file-list="fileList" :before-upload="beforeUpload" :on-remove="handleRemove"
               :on-success="handleUploadSuccess"
               :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不能超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {policy} from '@/api/oss'

export default {
  props: {
    value: String
  },
  computed: {
    minioHeader: function () {
      return {Authorization: this.$store.getters.token};
    },
    imageUrl: function () {
      return this.value;
    },
    imageName: function () {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1);
      } else {
        return null;
      }
    },
    fileList: function () {
      return [{
        name: this.imageName,
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function () {
        return this.value !== null && this.value !== '' && this.value !== undefined;
      },
      set: function () {
      }
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
      useOss: false,
      ossUploadUrl: '',
      minioUploadUrl: process.env.VUE_APP_BASE_API + '/minio/upload'
    }
  },
  methods: {
    emitInput: function (val) {
      this.$emit('input', val);
    },
    handleRemove: function () {
      this.$emit('');
    },
    handlePreview: function () {
      this.dialogVisible = true;
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
      this.showFileList = true;
      this.fileList.pop();
      let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
      if (!this.useOss) {
        url = res.data.url;
      }
      this.fileList.push({name: file.name, url: url});
      this.emitInput(this.fileList[0].url);
    }
  }
}
</script>

<style scoped>

</style>