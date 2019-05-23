<template>
  <div class="login-wrap flex">
    <div class="ms-login">
      <h3 class="ms-title">古迪科技委托营销呼叫中心</h3>
      <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" class="ms-content">
        <el-form-item prop="username" style="margin-bottom:35px;">
          <i class="User_icon"></i>
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-bottom:35px;">
          <i class="Password_icon"></i>
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-checkbox v-model="checked">记住用户名</el-checkbox>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
      <div class="hits">
        <span class="hit-text">杭州古迪科技有限公司 © 2017-2018 guditech.com</span>
      </div>
    </div>
    <div class="right_bg_box">
      <img class="right_bg" src="static/img/login_person.png" alt>
    </div>
  </div>
</template>

<script>
import { login } from "api/home.js";
export default {
  data: function() {
    return {
      checked: "",
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    if (localStorage.getItem("userName") != undefined) {
      this.ruleForm.username = localStorage.getItem("userName");
      this.checked = true;
    }
  },
  mounted() {},
  methods: {
    _login() {
      const params = {
        UserName: this.ruleForm.username,
        Password: this.$md5(this.ruleForm.password),
        LoginType: 1
      };
      login(params).then(res => {
        localStorage.setItem("userToken", res.Usertoken);
        this.$router.push('/myorder');
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.checked) {
            localStorage.setItem("userName", this.ruleForm.username);
          } else {
            localStorage.removeItem("userName");
          }
          this._login();
        } else {
          console.log("error submit!!");
          this.$message.error('网络错误');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.el-checkbox__label {
  color: #333333 !important;
}
.User_icon {
  position: relative;
  top: 4px;
  width: 22px;
  height: 22px;
  display: inline-block;
  background: url("../../assets/login_user.png") center no-repeat;
  background-size: contain;
}
.Password_icon {
  position: relative;
  top: 4px;
  width: 22px;
  height: 22px;
  display: inline-block;
  background: url("../../assets/login_password.png") center no-repeat;
  background-size: contain;
}
.el-input {
  width: 80% !important;
  margin-left: 5px !important;
}
.el-input__inner {
  border-color: #ffffff !important;
}
.codeImg_box {
  width: 80px;
  height: 32px;
  float: right;
  text-align: center;
  .codeImg {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
}
.login-wrap {
  position: relative;
  width: auto;
  height: 100%;
  background-color: #ffffff;
  justify-content: space-between;
  align-items: center;
  padding-left: 213px;
  padding-right: 144px;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: left;
  font-size: 32px !important;
  color: #161616;
  margin-bottom: 70px;
}
.ms-login {
  width: 426px;
  height: 582px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn button {
  width: 93%;
  margin-top: 40px;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.right_bg_box {
  width: 723px;
  height: 627px;
}
.ms-content {
  padding: 30px 0 !important;
}
.hit-text {
  width: auto;
  height: 19px;
  text-align: center;
  font-family: PingFang-SC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 90px;
  letter-spacing: 0px;
  color: #a9a9a9;
}
</style>