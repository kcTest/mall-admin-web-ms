<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409eff"></svg-icon>
        </div>
        <h2 class="login-title color-main">mall-admin-web</h2>
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名">
            <!--通过 slot 来放置图标-->
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码"
                    @keyup.enter.native="handleLogin">
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" @click="showPwd">
              <svg-icon icon-class="eye" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width:45%" type="primary" :loading="loading" @click.n.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {isValidUserName} from "@/utils/validate";
import {setCookie} from "@/utils/support";


export default {
  data: function () {
    const validateUserName = (rule, value, callback) => {
      if (!isValidUserName(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于三位'));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      pwdType: 'password',
      loginForm: {
        username: '#409eff',
        password: ''
      },
      loginRules: {
        //自定义校验规则 失去焦点时触发
        username: [{require: true, trigger: 'blur', validator: validateUserName}],
        password: [{require: true, trigger: 'blur', validator: validatePass}]
      }
    }
  },
  methods: {
    showPwd: function () {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin: function () {
      this.$refs.loginForm.validate((success, errorField) => {
        if (success) {
          this.loading = true;
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false;
            setCookie('username', this.loginForm.username, 15);
            setCookie('password', this.loginForm.password, 15);
            this.$router.push({path: '/'});
          }).catch(() => {
            this.loading = false;
          });
        } else {
          console.log('参数验证不合法: ', errorField)
          return false;
        }
      })
    }

  }
}
</script>

<style scoped>

.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409eff;
}

.login-title {
  text-align: center;
}
</style>