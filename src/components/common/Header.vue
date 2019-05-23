<template>
  <div class="header">
    <div class="header-left flex">
      <img src="static/img/header_logo.png" alt>
      <el-badge is-dot class="item">
        <img src="static/img/header_click.png" alt @click="showDropdown">
      </el-badge>
      <div v-if="isShowdrop" class="dropBox">
        <ul class="dropBox-ul">
          <li class="dropBox-item" @click="showChangePassword">修改密码</li>
          <li class="dropBox-item" @click="exit">退出</li>
        </ul>
      </div>
    </div>
    <div class="logo" @click="goHomeMenu">古迪科技委托营销呼叫中心</div>
    <!-- 修改密码弹出框 -->
    <el-dialog title="修改密码" :visible.sync="changeVisible" width="30%">
      <el-form ref="changeForm" :model="changeForm" :rules="rules" label-width="100px" auto-complete="new-password">
        <el-form-item label="原密码" prop="oldpass">
          <el-input type="password" v-model="changeForm.oldpass" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input type="password" v-model="changeForm.newpass" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="repass">
          <el-input type="password" v-model="changeForm.repass" auto-complete="new-password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePass('changeForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { logout, changePassword } from "api/home.js";
export default {
  data() {
    var NRoldpass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("原密码不能为空"));
      } else {
        callback();
      }
    };
    var NRnewpass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.changeForm.repass !== "") {
          this.$refs.changeForm.validateField("repass");
          callback();
        }
        callback();
      }
    };
    var NRrepass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.changeForm.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isShowdrop: false,
      changeVisible: false,
      changeForm: {
        oldpass: "",
        newpass: "",
        repass: ""
      },
      rules: {
        oldpass: [
          { validator: NRoldpass, trigger: "blur" }
          // { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        newpass: [
          { validator: NRnewpass, trigger: "blur" }
          // { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        repass: [
          { validator: NRrepass, trigger: "blur" }
          // { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 点击显示下拉
    showDropdown() {
      this.isShowdrop = !this.isShowdrop;
    },
    //点击显示修改密码弹窗
    showChangePassword() {
      this.changeVisible = true;
      this.isShowdrop = !this.isShowdrop;
      this.resetForm('changeForm');
    },
    //点击退出登录
    exit() {
      var params = null;
      return logout(params).then(res => {
        sessionStorage.removeItem("sidebarMenu");
        localStorage.removeItem("userToken");
        this.$router.push("/login");
      });
    },
    goHomeMenu() {
      this.$router.push('/');
    },
    // 修改密码
    changePass(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            OldPassword: this.$md5(this.changeForm.oldpass),
            NewPassword: this.$md5(this.changeForm.newpass)
          };
          changePassword(params).then(res => {
            this.$message({
              showClose: true,
              message: "密码修改成功",
              type: "success"
            });
            this.changeVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      if(this.$refs[formName]!=undefined){
        this.$refs[formName].resetFields();
      }
    },
  }
};
</script>
<style scoped>
.dropBox {
  width: 110px;
  height: 53px;
  color: #6e7381;
  font-size: 14px;
  background-color: #ffffff;
  box-shadow: 0px 5px 30px 0px rgba(22, 115, 255, 0.17);
  position: absolute;
  top: 50px;
  right: 45px;
  z-index: 2;
  padding-left: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
}
.dropBox-ul {
  width: 100%;
  height: auto;
}
.dropBox-item {
  width: 100%;
  height: auto;
  margin-bottom: 13px;
  cursor: pointer;
}
.dropBox-item:active {
  background-color: #018ad8;
  color: #ffffff;
}
.dropBox-item:hover {
  background-color: #018ad8;
  color: #ffffff;
}
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;
  color: #fff;
}
.header-left {
  width: 283px;
  box-sizing: border-box;
  height: 60px;
  padding: 0 45px 0 50px;
  align-items: center;
  justify-content: space-between;
  float: left;
  background-color: #4877e8;
  position: relative;
  z-index: 1;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 60px;
  height: 60px;
}
.header .logo {
  float: left;
  width: auto;
  margin-left: 55px;
  line-height: 60px;
  cursor: pointer;
  height: 18px;
  font-family: PingFang-SC-Medium;
  font-size: 18px;
  color: #ffffff;
}
.header-right {
  float: right;
  padding-right: 50px;
  height: 60px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
