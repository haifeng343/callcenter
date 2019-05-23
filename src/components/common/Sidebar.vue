<template>
  <div class="sidebar">
    <div class="userInfo_box">
      <div class="user_item_top flex">
        <img class="user_item1" :src="userinfo.headportrait" alt>
        <div class="user_item2 flex">
          <p class="item2_p">{{userinfo.username}}</p>
          <p class="item2_p">{{userinfo.position}}</p>
        </div>
      </div>
      <div class="user_balance">
        <span>话费余额：{{userinfo.balance | normalMoney(userinfo.balance)}}元</span>
      </div>
    </div>
    <el-menu
      class="sidebar-el-menu"
      :default-active="active"
      background-color="#F0F0F0"
      text-color="#676767"
      active-text-color="#ffffff"
      unique-opened
    >
      <template v-for="item in items">
        <el-menu-item :index="item.MenuUrl" :key="item.Id" @click="jump(item.MenuUrl)">
          <!-- <i class="el-icon-menu"></i> -->
          <img :src="item.icon" class="icon">
          <span slot="title">{{ item.Name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { getAccountBaseInfo } from "api/home.js";
export default {
  data() {
    return {
      userinfo: {
        username: "",
        position: "",
        headportrait: "static/img/header.png",
        balance: 0
      },
      active: "",
      items: [
        {
          Id: 70,
          Name: "首页",
          MenuUrl: "myorder",
          icon:"static/img/main.png"
        },
        {
          Id: 71,
          Name: "拨打详情",
          MenuUrl: "calldetails",
          icon:"static/img/calldetails.png"
        },
        {
          Id: 72,
          Name: "电销统计",
          MenuUrl: "statistics",
          icon:"static/img/statistics.png"
        }
      ]
    };
  },
  watch: {
    $route(to, from) {
      if (to.path == "/myorder") {
        this.active = "myorder";
        sessionStorage.setItem("sidebarMenu","/myorder");
      }
      if (to.path == "/calldetails") {
        this.active = "calldetails";
        sessionStorage.setItem("sidebarMenu","/calldetails");
      }
      if (to.path == "/statistics") {
        this.active = "statistics";
        sessionStorage.setItem("sidebarMenu","/statistics");
      }
    }
  },
  created() {
    this._getAccountBaseInfo();
    this.getActive(sessionStorage.getItem("sidebarMenu"));
  },
  methods: {
    getActive(res) {
      if (res == undefined) {
        res=this.$route.path;
      }
      if (res == "/myorder") {
        this.active = "myorder";
      }
      if (res == "/calldetails") {
        this.active = "calldetails";
      }
      if (res == "/statistics") {
        this.active = "statistics";
      }
    },
    jump(Url) {
      this.$router.push(`/${Url}`);
    },
    _getAccountBaseInfo() {
      var params = null;
      return getAccountBaseInfo(params).then(res => {
        this.userinfo.username = res.Name;
        this.userinfo.position = res.Level == 1 ? "电销人员" : "主管";
        this.userinfo.balance = res.Balance;
      });
    }
  }
};
</script>

<style scoped lang="less">
.userInfo_box {
  width: 283px;
  height: 170px;
  .user_item_top {
    width: auto;
    height: 89px;
    padding: 30px 44px 10px 44px;
    justify-content: space-between;
    align-items: center;
    .user_item1 {
      display: block;
      width: 89px;
    }
    .user_item2 {
      width: 120px;
      height: 40px;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      .item2_p {
        height: 13px;
        font-family: PingFang-SC-Medium;
        font-size: 16px;
        line-height: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #151515;
      }
    }
  }
  .user_balance {
    width: auto;
    padding: 0 44px;
    height: 30px;
  }
}
.sidebar {
  width: 283px;
  display: block;
  position: absolute;
  left: 0;
  top: 45px;
  bottom: 0;
  // overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 208px;
  padding-left: 44px;
  background-color: #ffffff !important;
}
.el-menu {
  border: none !important;
}
.el-menu-item {
  width: 95%;
  height: 46px;
  border-radius: 4px;
  border: none;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  text-align: center;
  padding-left: 20px !important;
  span {
    margin-left: 10px;
  }
}
.sidebar > ul {
  height: 100%;
}
.icon {
  align-items: center;
  width: 19px;
  height: 20px;
  margin-right: 14px;
}
</style>
