<template>
  <div class="callContainer">
    <div class="callBox flex" v-if="showMsg">
      <p class="mobileNumber">{{data.Selection == '1'?data.Mobile:data.OtherMobile}}</p>
      <p class="msgStatus">{{status_msg}}</p>
      <p v-if="showSeconds">{{seconds}}</p>
      <div class="icon" @click="handleClick">
        <img class="icon_img" :src="call_icon" alt>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "callphone",
  props: {
    data: Object
  },
  data() {
    return {
      websock: null,
      status_msg: "呼叫中...",
      showSeconds: false,
      seconds: "",
      timer: "",
      showMsg: true,
      call_icon: "static/img/red_call.png",

      closePar: {
        RecordId: 0, //记录Id
        isShowTrack: false
      }
    };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    console.log("destroyed");
    this.websock.close(); //离开路由之后断开websocket连接
    clearInterval();
    clearTimeout();
  },
  methods: {
    ...mapMutations({
      IsShowCall: "IsShowCall"
    }),
    // 关闭拨打电话窗口
    closeMsg(par) {
      this.$emit("listenShowCall", par);
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = "wss://test.guditech.com/centerCall";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let actions = {
        ActionCode: "000001",
        Type: "0101",
        Data: {
          UserToken: localStorage.getItem("userToken"),
          DetailsId: this.data.Id,
          Selection: this.data.Selection
        }
      };
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      //连接建立失败重连
      // this.initWebSocket();
      this.$message.error("连接失败");
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      if (redata.Type == "0301") {
        this.closePar.RecordId = redata.RecordId;
        this.closePar.isShowTrack = true;
      } else if (redata.Type == "0201") {
        switch (redata.Status) {
          case 1:
            this.status_msg = "拨号中...";
            break;
          case 2:
            this.status_msg = "呼叫中...";
            break;
          case 3:
            this.status_msg = "等待对方接听...";
            break;
          case 4:
            this.status_msg = "通话中";
            this.onCalling();
            break;
          case 5:
            this.status_msg = "挂断中...";
            this.onHangUping();
            break;
          case 6:
            this.status_msg = "已挂断";
            this.onHangUp();
            break;
          default:
            break;
        }
      } else if (redata.Type == "9999") {
        this.$message.error(redata.Message);
      } else if (redata.Type == "0102" || redata.Type == "0104") {
        if (redata.Data.Code !== 0) {
          this.$message.error(redata.Data.Message);
        }
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("服务端断开连接", e);
      this.closeMsg(this.closePar);
    },
    clockSeconds() {
      let seconds = 0;
      this.showSeconds = true;
      let _this = this;
      this.timer = setInterval(() => {
        this.seconds = _this.formatSeconds(seconds++);
      }, 1000);
    },
    formatSeconds(a) {
      var hh = parseInt(a / 3600);
      if (hh < 10) hh = "0" + hh;
      var mm = parseInt((a - hh * 3600) / 60);
      if (mm < 10) mm = "0" + mm;
      var ss = parseInt((a - hh * 3600) % 60);
      if (ss < 10) ss = "0" + ss;
      var length = hh + ":" + mm + ":" + ss;
      if (a > 0) {
        return length;
      } else {
        return "00:00:00";
      }
    },
    // 点击挂断
    handleClick() {
      this.status_msg = "挂断中...";
      this.websocketsend(
        JSON.stringify({ ActionCode: "000001", Type: "0103", Data: null })
      );
      let _this = this
      setTimeout(() => {
        if (_this.status_msg != "已挂断") {
          _this.status_msg = "已挂断";
          _this.onHangUp();
          _this.closeMsg(_this.closePar)
        }
      }, 2000);
    },
    onCalling() {
      this.clockSeconds();
    },
    // 挂断了
    onHangUp() {
      clearInterval(this.timer);
      this.call_icon = "static/img/gray_call.png";
      let _this = this;
      setTimeout(() => {
        _this.showMsg = false;
      }, 1500);
    }
  }
};
</script>
<style lang='less'>
.callContainer{
  width: 100%;
  height: 1000px;
  background-color: rgba(83,82,82,0.3);
  opacity: 0.7;
  filter: alpha(opacity=80);
  position: absolute;
  left: 0;
  top: 0;
}
.callBox {
  width: 471px;
  height: 256px;
  background-color: #3B3A3A;
  border-radius: 6px;
  z-index: 999;
  position: absolute;
  top: 250px;
  left: 30%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  padding-top: 47px;
  padding-bottom: 47px;
}
.checkBox {
  margin-top: 10px;
  width: 90%;
  height: auto;
  padding: 10px 20px;
  border: 1px solid #dcdfe6;
}
.mobileNumber {
  width: auto;
  height: 23px;
  font-family: PingFang-SC-Medium;
  font-size: 30px;
  color: #ffffff;
}
.msgSuccessIcon {
  width: 90px;
  height: 90px;
  border-radius: 100%;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  background-color: #e73c2c;
}
.icon {
  width: 55px;
  height: 55px;
  border-radius: 100%;
}
.icon_img {
  z-index: 10000;
}
.msgErrorIcon {
  width: 90px;
  height: 90px;
  border-radius: 100%;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  background-color: #9d9d9d;
}
.msgStatus {
  width: auto;
  height: 21px;
  font-family: PingFang-SC-Medium;
  font-size: 22px;
  color: #ffffff;
}
.callIcon {
  font-size: 52px;
  transform: rotate(-135deg);
  -ms-transform: rotate(-135deg); /* IE 9 */
  -webkit-transform: rotate(-135deg); /* Safari and Chrome */
  position: relative;
  top: 5px;
}
</style>