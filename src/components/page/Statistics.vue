<template>
  <div class="table">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>操作日志</el-breadcrumb-item>-->
    </el-breadcrumb>
    <div class="container">
      <div class="handle-box flex">
        <div class="box-item flex">
          <img class="item-img" src="static/img/callnumber.png" alt>
          <div class="item-info flex">
            <span class="info-1">{{StatisticData.CallCount}}</span>
            <span class="info-2">拨打数量</span>
          </div>
        </div>
        <div class="box-item flex">
          <img class="item-img" src="static/img/invitenumber.png" alt>
          <div class="item-info flex">
            <span class="info-1">{{StatisticData.ExportCount}}</span>
            <span class="info-2">邀约人数</span>
          </div>
        </div>
        <div class="box-item flex">
          <img class="item-img" src="static/img/totalMoney.png" alt>
          <div class="item-info flex">
            <span
              class="info-1"
            >￥{{StatisticData.TotalAmount | normalMoney(StatisticData.TotalAmount)}}</span>
            <span class="info-2">总金额</span>
          </div>
        </div>
        <div class="box-item flex">
          <img class="item-img" src="static/img/performance.png" alt>
          <div class="item-info flex">
            <span
              class="info-1"
            >￥{{StatisticData.RoyaltyAmount | normalMoney(StatisticData.RoyaltyAmount)}}</span>
            <span class="info-2">提成业绩</span>
          </div>
        </div>
      </div>
      <!-- 拨打统计 -->
      <div class="echart-container statisticsBox">
        <h4>拨打统计</h4>
        <div class="handle-box1">
          <el-button
            style="width:70px;height:30px;margin-left:20px;"
            class="dateBtn"
            :type="type == 1?'primary':''"
            @click="getTodayData"
          >当天</el-button>
          <el-button :type="type == 2?'primary':''" style="width:70px;height:30px;" class="dateBtn" @click="getYesterdayData">昨天</el-button>
          <el-button :type="type == 3?'primary':''" style="width:70px;height:30px;" class="dateBtn" @click="getWeekData">一周</el-button>
          <el-button :type="type == 4?'primary':''" style="width:70px;height:30px;" class="dateBtn" @click="showTime">自定义</el-button>
          <el-date-picker
            v-if="isShowTime"
            v-model="time"
            type="datetimerange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"
          ></el-date-picker>
        </div>
        <div class="handle-box1" style="margin-top:35px;">
          <span>拨打数量：{{statisticsInfo.CallCount}}</span>
          <span>已接听数量：{{statisticsInfo.CallAnswerCount}}</span>
          <span>有效接听数量：{{statisticsInfo.CallEffectiveCount}}</span>
          <span>未接通数量：{{statisticsInfo.CallUnconnectedCount}}</span>
          <span>未接听数量：{{statisticsInfo.ListenUnconnectedCount}}</span>
        </div>
        <div class="handle-box1">
          <span>总通话时长：{{statisticsInfo.CallTotalSecond |formatSecondsNewDate(statisticsInfo.CallTotalSecond)}}</span>
          <span>有效通话时长：{{statisticsInfo.CallEffectiveSecond |formatSecondsNewDate(statisticsInfo.CallEffectiveSecond)}}</span>
        </div>
        <div class="handle-box1">
          <span>跟进名单数量：{{statisticsInfo.CallFollowCount}}</span>
          <span>已预约数量：{{statisticsInfo.CallExportCount}}</span>
        </div>
        <div class="handle-box1">
          <span>最后拨打时间：{{statisticsInfo.LastCallTime}}</span>
        </div>
      </div>
      <!-- 拨打统计 -->
      <div class="echart-container">
        <div class="inviteSelectBox">
          <el-select v-model="status" placeholder="请选择" @change="InviteSelect()">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div
          id="myChart"
          :style="{width: '1000px', height: '500px',marginLeft:'30px',marginTop:'60px'}"
        ></div>
      </div>
      <div class="echart-container">
        <div
          id="dudectChart"
          :style="{width: '1000px', height: '500px',marginLeft:'30px',marginTop:'60px'}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import Schart from "vue-schart";
import { regionDataPlus, CodeToText } from "element-china-area-data";
import { getAccountStatistic, getAccountCallStatistic,getStatisticCallTime } from "api/home.js";
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  components: {
    Schart
  },
  name: "basetable",
  data() {
    return {
      time: [],
      isShowTime:false,
      starttime: "",
      endtime: "",
      StatisticData: {},
      status: 5,
      statusList: [
        { id: 1, name: "最近一天" },
        { id: 2, name: "最近七天" },
        { id: 3, name: "近30天(5天一周期)" },
        { id: 4, name: "近90天(10天一周期)" },
        { id: 5, name: "近半年(1月一周期)" }
      ],
      myChartNameArr: [],
      myChartCallArr: [],
      myChartExportArr: [],
      dudectChartNameArr: [],
      dudectChartDataArr: [],
      statisticsInfo:{},
      type:'1'
    };
  },
  created() {
    this.getTimeData(1)
    this._getAccountStatistic().then(val => {
      this.analyzeMyChart();
    });
  },
  methods: {
    getTodayData(){
      this.isShowTime = false
      this.type = 1
      this.starttime = ''
      this.endtime = ''
      this.getTimeData(1)
    },
    getYesterdayData(){
      this.isShowTime = false
      this.type = 2
      this.starttime = ''
      this.endtime = ''
      this.getTimeData(2)
    },
    getWeekData(){
      this.isShowTime = false
      this.type = 3
      this.starttime = ''
      this.endtime = ''
      this.getTimeData(3)
    },
    getTimeData(type){
      const params = {
        'type': type,
        'StartTime':this.starttime,
        'EndTime':this.endtime
      };
      return getStatisticCallTime(params).then(res => {
        this.statisticsInfo = Object.assign({},res)
      });
    },
    // 获取时间
    showTime(){
      this.type = 4
      this.isShowTime = !this.isShowTime
    },
    // 时间改变
    getTime() {
      if (this.time != null && this.time.length > 0) {
        this.starttime = this.time[0];
        this.endtime = this.time[1];
        this.getTimeData(4)
      } else {
        this.starttime = "";
        this.endtime = "";
      }
    },
    //获取用户电销统计
    _getAccountStatistic() {
      const params = null;
      return getAccountStatistic(params).then(res => {
        this.StatisticData = res;
      });
    },
    //获取用户电销拨打（邀约）人数统计
    _getAccountCallStatistic() {
      const params = {
        Type: this.status
      };
      return getAccountCallStatistic(params).then(res => {
        this.StatisticData.CallCountStatisticList = res;
      });
    },
    //分析myChart图标数据
    analyzeMyChart() {
      this.myChartNameArr = [];
      this.myChartCallArr = [];
      this.myChartExportArr = [];
      this.dudectChartNameArr = [];
      this.dudectChartDataArr = [];
      this.StatisticData.CallCountStatisticList.forEach(element => {
        this.myChartNameArr.push(element.Key);
        this.myChartCallArr.push(element.Value1);
        this.myChartExportArr.push(element.Value2);
      });
      this.StatisticData.RoyaltyStatisticList.forEach(element => {
        this.dudectChartNameArr.push(element.Key);
        this.dudectChartDataArr.push(element.Value1 / 100);
      });
      this.drawLine();
    },

    InviteSelect(value) {
      this._getAccountCallStatistic().then(val => {
        this.analyzeMyChart();
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let dudectChart = this.$echarts.init(
        document.getElementById("dudectChart")
      );
      // 绘制图表
      myChart.setOption({
        title: {
          text: "邀约人数",
          textStyle: {
            fontSize: 14
          },
          left: 30
        },
        tooltip: {},
        legend: {
          data: ["拨打数量", "邀约人数"],
          left: 30,
          top: 30
        },
        xAxis: {
          data: this.myChartNameArr
        },
        yAxis: {},
        series: [
          {
            name: "拨打数量",
            type: "line",
            smooth: true,
            data: this.myChartCallArr
          },
          {
            name: "邀约人数",
            type: "line",
            smooth: true,
            data: this.myChartExportArr
          }
        ]
      });
      dudectChart.setOption({
        color: ["#fda855"],
        title: {
          text: "提成总览",
          textStyle: {
            fontSize: 14
          },
          left: 30
        },
        tooltip: {},
        legend: {
          data: ["提成业绩"]
        },
        grid: {
          top: 100
        },
        xAxis: {
          data: this.dudectChartNameArr
        },
        yAxis: { name: "k" },
        series: [
          {
            name: "拨打数量",
            type: "bar",
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 16
                  }
                }
              }
            },
            smooth: true,
            data: this.dudectChartDataArr
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.echart-container {
  background-color: #ffffff;
  box-shadow: 0px 5px 30px 0px rgba(22, 115, 255, 0.11);
}
.dateBtn {
  margin-top: 25px;
  margin-right: 15px;
}
.statisticsBox {
  width: auto;
  height: 250px;
  margin-top: 10px;
  padding: 10px 60px;
}
.inviteSelectBox {
  width: 250px;
  height: 30px;
  float: right;
  position: relative;
  top: 30px;
  right: 10px;
}
.schart-box {
  display: inline-block;
  margin: 20px;
}
.schart {
  width: 500px;
  height: 400px;
}
.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.handle-box {
  width: 100%;
  height: 146px;
  box-sizing: border-box;
  background-color: #ffffff;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 5px 30px 0px rgba(22, 115, 255, 0.11);
}
.handle-box1 {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
}
.handle-box1 span {
  margin-right: 30px;
}
.box-item {
  flex: 1;
  border-right: 1px solid #e9e9e9;
  height: 76px;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
}
.item-img {
  display: block;
  height: 72px;
  width: 72px;
}
.item-info {
  width: auto;
  height: 47px;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
}
.info-1 {
  width: auto;
  height: 21px;
  font-family: MicrosoftYaHei;
  font-size: 24px;
  text-align: center;
  line-height: 21px;
  color: #575757;
}
.info-2 {
  width: auto;
  height: 15px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  color: #575757;
}
.box-item:last-child {
  border: none;
}
.handle-select {
  width: 120px;
}

.handle-input {
  width: 230px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>