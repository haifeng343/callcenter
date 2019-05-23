<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <label for>商家名称:</label>
        <el-input v-model="name" placeholder="请输入商家名称" class="handle-input mr10"></el-input>
        <label for>委托名称:</label>
        <el-input v-model="activity" placeholder="请输入委托名称" class="handle-input mr10"></el-input>
        <label for>状态:</label>
        <el-select v-model="status" placeholder="请选择状态" style="width:120px">
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <label for>从</label>
        <el-date-picker
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button icon="search" @click="search()" type="primary">
          <i class="el-icon-search" style="margin-right:10px;"></i>搜 索
        </el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="SellerName" align="center" label="商家名称"></el-table-column>
        <el-table-column align="center" label="委托名称">
          <template slot-scope="scope">
            <el-button type="text" @click="openDelegateForm(scope.row)">{{scope.row.DelegateName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="父母姓名">
          <template slot-scope="scope">{{scope.row.FatherName}}/{{scope.row.MotherName}}</template>
        </el-table-column>
        <el-table-column align="center" label="孩子姓名">
          <template slot-scope="scope">
            <span>{{scope.row.ChildName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系方式1" width="120">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.Selection" label="1">{{scope.row.Mobile}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系方式2" width="120">
          <template slot-scope="scope" v-if="scope.row.OtherMobile">
            <el-radio v-model="scope.row.Selection" label="2">{{scope.row.OtherMobile}}</el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="CallCount" align="center" label="拨打次数"></el-table-column> -->
        <el-table-column prop="LasCallTime" align="center" label="最新拨打时间"></el-table-column>
        <el-table-column align="center" label="拨打状态">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.CallStatus!=null"
              type="text"
              @click="openCallStatusForm(scope.row)"
            >{{getCallStatus(scope.row.CallStatus.Status)}}</el-button>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="预约状态">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.AppointmentStatus!=null"
              type="text"
              @click="openAppointmentStatusForm(scope.row)"
            >{{getAppointmentStatus(scope.row.AppointmentStatus.Status)}}</el-button>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="toCallMobile(scope.row)">拨打</el-button>
            <el-button v-if="scope.row.IsExport==true" type="primary" disabled>导出</el-button>
            <el-button v-else type="primary" @click="openExport(scope.row)">导出</el-button>
            <el-button type="text" @click="openCallRecord(scope.row)">拨打记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="30"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </div>
      <!-- 拨打电话弹窗 -->
      <callPhone :data="FamilyData" v-on:listenShowCall="changeShowCall" v-if="isShowMobile"></callPhone>
      <!-- 活动详情弹出框 -->
      <el-dialog
        :title="`活动内容-${delegateDetailsForm.delegateName}`"
        :visible.sync="delegateDetailsVisible"
        width="633px"
      >
        <el-form ref="delegateDetailsForm" :model="delegateDetailsForm" label-width="100px">
          <el-form-item>
            <el-input
              type="textarea"
              :rows="12"
              v-model="delegateDetailsForm.delegateContent"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
          style="width:100%;display:inline-block;text-align:left;"
        >
          <el-button @click="delegateDetailsVisible = false" type="primary" style="float:right;">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 导出弹窗 -->
      <el-dialog title="导出名单" :visible.sync="exportVisible" width="633px">
        <el-form ref="exportForm" :model="exportForm" label-width="100px">
          <div
            style="margin-bottom:10px;"
          >您确定要把【{{exportForm.ChildName}}】的信息导出给【{{exportForm.SellerName}}】吗?</div>

          <el-table
            :data="callRecordTableData"
            border
            ref="multipleTable"
            style="margin-bottom:10px;"
          >
            <el-table-column prop="Mobile" align="left" label="电话号码">
              <template slot-scope="scope">
                <el-radio
                  v-model="exportFormTableRadio"
                  :label="scope.row.RecordId"
                  @change="exportFormTableRadioChange(scope.row)"
                >{{scope.row.Mobile}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="CallTime" align="center" label="拨打时间"></el-table-column>
            <el-table-column prop="CallSecond" align="center" label="拨打时长">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.CallSecond>0"
                >{{scope.row.CallSecond | formatSeconds(scope.row.CallSecond)}}</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column prop="RecordFile" align="center" label="录音文件">
              <template slot-scope="scope">
                <span v-if="scope.row.CallSecond>0">
                  <el-button type="text" @click="RecordListen(scope.row)" size="medium">录音听取</el-button>
                </span>
                <span v-else>/</span>
              </template>
            </el-table-column>
          </el-table>

          <el-form-item label="导出号码:" style="margin-top:20px;">
            <el-input v-model="exportForm.Mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="录音文件:">
            <el-input v-model="exportForm.RecordFile" disabled></el-input>
          </el-form-item>
          <el-form-item label="预约状态:">
            <el-select v-model="exportForm.appointmentStatus" placeholder="请选择">
              <el-option
                v-for="item in exportForm.statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预约时间:" v-if="exportForm.appointmentStatus===2">
            <el-date-picker
              v-model="exportForm.appointmentTime"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="推送状态：" prop="pushStatus">
            <el-select v-model="exportForm.pushStatus" placeholder="请选择" style="width:400px;">
              <el-option
                v-for="item in exportForm.pushStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推送至：" label-width="100px" prop="storeId">
            <el-cascader
              :options="exportForm.storeIdList"
              v-model="exportForm.storeId"
              :props="exportForm.props"
              style="width:300px;"
              :disabled="exportForm.pushStatus!=3"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" :rows="4" v-model="exportForm.Remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportVisible = false" size="medium">取消</el-button>
          <el-button @click="exportOk()" type="primary" size="medium">导出</el-button>
        </span>
      </el-dialog>
      <!-- 拨打状态弹出框 -->
      <el-dialog
        :title="`拨打状态-${callStatusForm.ChildName}`"
        :visible.sync="callStatusVisible"
        width="633px"
      >
        <el-form ref="callStatusForm" :model="callStatusForm" label-width="100px">
          <el-form-item label="状态：">
            <el-input type="text" v-model="callStatusForm.Status" disabled></el-input>
          </el-form-item>
          <el-form-item label="状态描述">
            <el-input type="textarea" :rows="4" v-model="callStatusForm.StatusDes" disabled></el-input>
          </el-form-item>
          <el-form-item label="商家备注：">
            <el-input type="textarea" :rows="6" v-model="callStatusForm.SellerRemark" disabled></el-input>
          </el-form-item>
          <el-form-item label="我的备注：">
            <el-input type="textarea" :rows="6" v-model="callStatusForm.AccountRemark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="callStatusVisible = false" size="medium">取消</el-button>
          <el-button @click="callStatusRemarkOk()" type="primary" size="medium">确定</el-button>
        </span>
      </el-dialog>
      <!-- 预约状态弹出框 -->
      <el-dialog
        :title="`预约状态-${appointmentStatusForm.ChildName}`"
        :visible.sync="appointmentStatusVisible"
        width="633px"
      >
        <el-form ref="appointmentStatusForm" :model="appointmentStatusForm" label-width="100px">
          <el-form-item label="状态：">
            <el-input type="text" v-model="appointmentStatusForm.Status" disabled></el-input>
          </el-form-item>
          <el-form-item label="状态描述">
            <el-input type="textarea" :rows="4" v-model="appointmentStatusForm.StatusDes" disabled></el-input>
          </el-form-item>
          <el-form-item label="商家备注：">
            <el-input
              type="textarea"
              :rows="6"
              v-model="appointmentStatusForm.SellerRemark"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="我的备注：">
            <el-input type="textarea" :rows="6" v-model="appointmentStatusForm.AccountRemark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="appointmentStatusVisible = false" size="medium">取消</el-button>
          <el-button @click="appointmentStatusRemarkOk()" type="primary" size="medium">确定</el-button>
        </span>
      </el-dialog>
      <!-- 跟踪信息弹出框 -->
      <el-dialog title="跟踪记录" :visible.sync="editVisible" width="730px" :before-close="handleClose">
        <div class="edittitle">电话摘要</div>
        <el-checkbox-group v-model="editForm.AbstractTags">
          <el-checkbox v-for="item in abstractList" :label="item.Name" :key="item.Id" style="margin-left:30px;">{{item.Name}}</el-checkbox>
        </el-checkbox-group>
        <div class="edittitle">数据摘要</div>
        <el-form ref="editForm" :model="editForm" label-width="100px">
          <el-form-item label="家庭角色:" prop="FamilyRole">
            <el-radio v-model="editForm.FamilyRole" label="0">未知</el-radio>
            <el-radio v-model="editForm.FamilyRole" label="1">爸爸</el-radio>
            <el-radio v-model="editForm.FamilyRole" label="2">妈妈</el-radio>
            <el-radio v-model="editForm.FamilyRole" label="3">其它</el-radio>
          </el-form-item>
          <el-form-item label="原角色:">
            <div>未知</div>
          </el-form-item>
          <el-form-item label="孩子姓名:" prop="ChildName">
            <el-input v-model="editForm.ChildName"></el-input>
          </el-form-item>
          <el-form-item label="原姓名:">
            <div>{{traceInitInfo.ChildName}}</div>
          </el-form-item>
          <el-form-item label="孩子年龄(岁):" prop="ChildAge">
            <el-input v-model="editForm.ChildAge"></el-input>
          </el-form-item>
          <el-form-item label="联系地址:">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="原地址:">
            <div>{{traceInitInfo.Address}}</div>
          </el-form-item>
          <el-form-item label="详细地址:" prop="AddressDetails">
            <el-input v-model="editForm.AddressDetails"></el-input>
          </el-form-item>
          <div class="edittitle">其他</div>
          
          <el-form-item :label="item.TypeName" v-for="item in tagList" :key="item.TypeId">
            <el-input
              v-model="item.TagList"
              suffix-icon="el-icon-arrow-down"
              @focus="item.ShowTag = true"
            ></el-input>
            <div v-if="item.ShowTag==true" @mouseleave="item.ShowTag=false">
              <el-checkbox-group v-model="item.TagArr" @change="changeLearning(item)">
                <el-checkbox v-for="x in item.List" :label="x.Name" :key="x.Id">{{x.Name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>

          <el-form-item label="备注:">
            <el-input type="textarea" rows="4" v-model="editForm.Remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveRemark" type="primary" size="medium">提 交</el-button>
          <el-button @click="editVisible = false" size="medium">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 听取录音弹出框 -->
      <el-dialog title="听取录音" :visible.sync="iframeVisible" width="630px" @close="closeDialog">
        <audio
          :src="iframeUrl"
          style="width:500px;display:block; margin:10px auto"
          autoplay="autoplay"
          controls="controls"
          class="outline"
          preload
          id="music1"
        ></audio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="iframeVisible = false" type="primary" size="medium">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import callPhone from "base/callPhone";
import {
  getAccountDelegateCallDetailsList,
  modifyAccountDelegateHangCustomerRemark,
  exportAccountDelegateHangCustomer,
  addTrack,
  getAccountDelegateCallRecordList,
  getAccountDelegateRelList,
  getAccountDelegateTraceInitList,
  getAccountDelegateTraceAbstractList,
  getAccountDelegateTraceAlltagList
} from "api/home.js";
export default {
  name: "basetable",
  components: {
    callPhone
  },
  data() {
    return {
      activity: "",
      name: "",
      status: 0,
      statusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "潜在客户" },
        { id: 2, name: "预约中" },
        { id: 3, name: "确认到店" },
        { id: 4, name: "确认成交" },
        { id: 5, name: "无效" }
      ],
      time: ["", ""],

      tableData: [],
      pageCount: 0,
      appointedCount: 0,
      appointingCount: 0,
      pagesize: 30,
      cur_page: 1,

      exportVisible: false, //导出弹窗是否可见
      exportForm: {
        Id: 0,
        ChildName: "",
        SellerName: "",
        Remark: "",
        Selection: "",
        Mobile: "",
        RecordFile: "",
        statusList: [{ id: 1, name: "潜在用户" }, { id: 2, name: "预约中" }],
        appointmentStatus: "",
        appointmentTime: "",
        pushStatus: "",
        pushStatusList: [
          { id: 1, name: "直接推送" },
          { id: 2, name: "需主管确认" },
          { id: 3, name: "推送至门店" }
        ],
        props: {
          value: "Id",
          children: "Children",
          label: "Name"
        },
        storeId: ["", ""],
        storeIdList: []
      },
      exportFormTableRadio: "",
      callRecordTableData: [],
      iframeVisible: false,
      iframeUrl: "",

      delegateDetailsVisible: false,
      delegateDetailsForm: {
        delegateName: "",
        delegateContent: ""
      },

      callStatusVisible: false,
      callStatusForm: {
        Id: 0,
        ChildName: "",
        Status: "",
        StatusDes: "",
        SellerRemark: "",
        AccountRemark: ""
      },

      appointmentStatusVisible: false,
      appointmentStatusForm: {
        Id: 0,
        ChildName: "",
        Status: "",
        StatusDes: "",
        SellerRemark: "",
        AccountRemark: ""
      },
      FamilyData: {}, // 拨打电话时家庭数据
      isShowMobile: false,

      editVisible: false,
      editForm: {
        RecordId: "",
        FamilyRole: "",
        ChildName: "",
        Province: "",
        City: "",
        County: "",
        AddressDetails: "",
        LearningTags: "",
        InterestTags: "",
        Remark: "",
        ChildAge: "",
        AbstractTags: [],
        checkList: []
      },
      RecordId: "",
      IsShowInterest: false,
      interestCheckList: [], // 选中的兴趣标签
      IsShowLearning: false,
      learningCheckList: [], // 选中的学习标签
      options: regionDataPlus,
      selectedOptions: [],
      traceInitInfo: {}, //跟踪信息原始数据
      abstractList:[],
      tagList:[]
    };
  },
  filters: {
    NameSubstr(name) {
      if (name.length == 2) {
        return "*" + name[1];
      } else if (name.length == 3) {
        return name[0] + "*" + name[2];
      } else {
        return name[0] + "**" + name[name.length - 1];
      }
    }
  },
  mounted() {
    if (name.length == 2) {
      return "*" + name[1];
    } else if (name.length == 3) {
      return name[0] + "*" + name[2];
    } else {
      return name[0] + "**" + name[name.length - 1];
    }
  },
  created() {
    // this.RecordId=10018;
    // this.showTrack();
    this._getAccountDelegateCallDetailsList();
    sessionStorage.removeItem("callCustomerPageId");
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    closeDialog() {
      var myAuto = document.getElementById("music1");
      myAuto.pause();
    },
    RecordListen(item) {
      this.iframeVisible = true;
      this.iframeUrl = item.RecordFile;
    },
    exportFormTableRadioChange(item) {
      this.exportForm.Mobile = item.Mobile;
      this.exportForm.RecordFile = item.RecordFile;
    },
    // 监听子组件传回的数据
    changeShowCall(data) {
      console.log(data, "父");
      this.isShowMobile = false;
      if (data.isShowTrack) {
        this.RecordId = data.RecordId;
        this.showTrack();
      }
      this._getAccountDelegateCallDetailsList();
    },
    // 显示上传跟踪记录
    showTrack() {
      this.editVisible = true;
      this._getAccountDelegateTraceInitList().then(res => {
        this.traceInitInfo = res;
      });
      this._getAccountDelegateTraceAbstractList();
      this._getAccountDelegateTraceAlltagList();
    },
    // 保存上传跟踪记录
    saveRemark() {
      const params = {
        RecordId: this.RecordId,
        FamilyRole: this.editForm.FamilyRole,
        ChildName: this.editForm.ChildName,
        Province: this.editForm.Province,
        City: this.editForm.City,
        County: this.editForm.County,
        AddressDetails: this.editForm.AddressDetails,
        Remark: this.editForm.Remark,
        TagList:this.tagList,
        ChildAge: this.editForm.ChildAge,
        AbstractTags: this.editForm.AbstractTags.toString()
      };
      return addTrack(params).then(res => {
        this.$message.success("保存成功");
        this.editVisible = false;
      });
    },
    // 选择地区
    handleChange(value) {
      this.editForm.Province = CodeToText[value[0]];
      this.editForm.City =
        CodeToText[value[1]] != undefined ? CodeToText[value[1]] : "";
      this.editForm.County =
        CodeToText[value[2]] != undefined ? CodeToText[value[2]] : "";
    },
    changeLearning(item) {
      item.TagList=item.TagArr.toString();
    },
    // 拨打电话
    toCallMobile(item) {
      this.FamilyData = Object.assign(item);
      this.isShowMobile = true;
      // this.editForm.FamilyRole = "0";
      // this.editForm.ChildName = item.ChildName;
      // this.editForm.ChildAge = item.ChildAge;
      // var temp = item.Address.split(" ");
      // this.editForm.Province = temp.length > 0 ? temp[0] : "";
      // this.editForm.City = temp.length > 1 ? temp[1] : "";
      // this.editForm.County = temp.length > 2 ? temp[2] : "";
      // this.selectedOptions = [
      //   TextToCode[this.editForm.Province].code,
      //   TextToCode[this.editForm.Province][this.editForm.City].code,
      //   TextToCode[this.editForm.Province][this.editForm.City][
      //     this.editForm.County
      //   ].code
      // ];
    },
    // 打开导出窗口
    openExport(item) {
      this._getAccountDelegateRelList(item.DelegateId).then(res => {
        this.exportForm.storeIdList = res;
      });
      this.exportForm.storeId = ["", ""];
      this.exportForm.pushStatus = 1;
      this.exportForm.Id = item.Id;
      this.exportForm.ChildName = item.ChildName;
      this.exportForm.SellerName = item.SellerName;
      this.exportForm.Remark = item.CallStatus.AccountRemark;
      this.exportForm.Selection = item.Selection;
      this.exportVisible = true;
      this.exportForm.appointmentStatus = 1;
      this.exportForm.ChildName = item.ChildName;
      this.exportForm.Mobile =
        item.Selection == "1" ? item.Mobile : item.OtherMobile;
      this.exportForm.RecordFile = "";
      this.exportFormTableRadio = "";
      this._getAccountDelegateCallRecordList(item.Id);
    },
    //确认导出
    exportOk() {
      this._exportAccountDelegateHangCustomer().then(val => {
        this._getAccountDelegateCallDetailsList();
        this.exportVisible = false;
        this.$message({
          showClose: true,
          message: "导出成功",
          type: "success"
        });
      });
    },
    // 拨打名单
    openCallRecord(item) {
      this.$router.push(`/callrecord/${item.Id}`);
    },
    //分页导航尺寸更改
    handleSizeChange(val) {
      this.pagesize = val;
      this._getAccountDelegateCallDetailsList();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this._getAccountDelegateCallDetailsList();
    },

    search() {
      this.cur_page = 1;
      this._getAccountDelegateCallDetailsList();
    },
    getCallStatus(status) {
      switch (status) {
        case 1:
          return "未接通";
          break;
        case 2:
          return "意外中断";
          break;
        case 3:
          return "完成通话";
          break;
        default:
          return "未知";
          break;
      }
    },
    getAppointmentStatus(status) {
      switch (status) {
        case 1:
          return "潜在客户";
          break;
        case 2:
          return "预约中";
          break;
        case 3:
          return "确认到店";
          break;
        case 4:
          return "确认成交";
          break;
        case 5:
          return "无效";
          break;
        default:
          return "未知";
          break;
      }
    },
    _getAccountDelegateCallDetailsList() {
      const params = {
        SellerName: this.name,
        DelegateName: this.activity,
        AppointmentStatus: this.status,
        StartTime: this.time == null ? "" : this.time[0],
        EndTime: this.time == null ? "" : this.time[1],
        PageIndex: this.cur_page,
        PageCount: this.pagesize
      };
      return getAccountDelegateCallDetailsList(params).then(res => {
        this.tableData = res.List;
        this.appointedCount = res.AppointedCount;
        this.appointingCount = res.AppointingCount;
        this.pageCount = res.TotalCount;
      });
    },
    //导出用户分配到的委托预约名单
    _exportAccountDelegateHangCustomer() {
      const params = {
        Id: this.exportForm.Id,
        Selection: this.exportForm.Selection,
        Remark: this.exportForm.Remark,
        CallRecordId: this.exportFormTableRadio,
        Status: this.exportForm.appointmentStatus,
        AppointmentTime: this.exportForm.appointmentTime,
        PushStatus: this.exportForm.pushStatus,
        PushDestination: this.exportForm.storeId[1]
      };
      return exportAccountDelegateHangCustomer(params);
    },
    //修改用户分配到的委托预约名单备注
    _modifyAccountDelegateHangCustomerRemark(Id, Type, Remark) {
      const params = {
        Id: Id,
        Type: Type,
        Remark: Remark
      };
      return modifyAccountDelegateHangCustomerRemark(params);
    },
    //打开活动详情弹窗
    openDelegateForm(item) {
      this.delegateDetailsForm.delegateName = item.DelegateName;
      this.delegateDetailsForm.delegateContent = item.DelegateContent;
      this.delegateDetailsVisible = true;
    },
    //打开拨打状态弹窗
    openCallStatusForm(item) {
      this.callStatusForm.Id = item.Id;
      this.callStatusForm.ChildName = item.ChildName;
      this.callStatusForm.Status = this.getCallStatus(item.CallStatus.Status);
      this.callStatusForm.StatusDes = item.CallStatus.StatusDes;
      this.callStatusForm.SellerRemark = item.CallStatus.SellerRemark;
      this.callStatusForm.AccountRemark = item.CallStatus.AccountRemark;
      this.callStatusVisible = true;
    },
    //拨打状态弹窗点击确定
    callStatusRemarkOk() {
      this._modifyAccountDelegateHangCustomerRemark(
        this.callStatusForm.Id,
        1,
        this.callStatusForm.AccountRemark
      ).then(val => {
        this._getAccountDelegateCallDetailsList();
        this.callStatusVisible = false;
        this.$message({
          showClose: true,
          message: "备注修改成功",
          type: "success"
        });
      });
    },
    openAppointmentStatusForm(item) {
      this.appointmentStatusForm.Id = item.AppointmentId;
      this.appointmentStatusForm.ChildName = item.ChildName;
      this.appointmentStatusForm.Status = this.getAppointmentStatus(
        item.AppointmentStatus.Status
      );
      this.appointmentStatusForm.StatusDes = item.AppointmentStatus.StatusDes;
      this.appointmentStatusForm.SellerRemark =
        item.AppointmentStatus.SellerRemark;
      this.appointmentStatusForm.AccountRemark =
        item.AppointmentStatus.AccountRemark;
      this.appointmentStatusVisible = true;
    },
    //预约状态弹窗点击确定
    appointmentStatusRemarkOk() {
      this._modifyAccountDelegateHangCustomerRemark(
        this.appointmentStatusForm.Id,
        2,
        this.appointmentStatusForm.AccountRemark
      ).then(val => {
        this._getAccountDelegateCallDetailsList();
        this.appointmentStatusVisible = false;
        this.$message({
          showClose: true,
          message: "备注修改成功",
          type: "success"
        });
      });
    },
    //获取用户分配到的委托名单拨打记录
    _getAccountDelegateCallRecordList(id) {
      const params = {
        Id: id,
        PageIndex: 1,
        PageCount: 1000
      };
      return getAccountDelegateCallRecordList(params).then(res => {
        this.callRecordTableData = res.List;
      });
    },
    //查询关联门店委托列表
    _getAccountDelegateRelList(delegateId) {
      const params = {
        Id: delegateId
      };
      return getAccountDelegateRelList(params);
    },
    //获取跟踪记录原始数据
    _getAccountDelegateTraceInitList() {
      const params = {
        Id: this.RecordId
      };
      return getAccountDelegateTraceInitList(params);
    },
    //获取跟踪记录电话摘要配置
    _getAccountDelegateTraceAbstractList() {
      return getAccountDelegateTraceAbstractList().then(res=>{
        this.abstractList=res;
      });
    },
    //获取跟踪记录所有标签列表
    _getAccountDelegateTraceAlltagList() {
      return getAccountDelegateTraceAlltagList().then(res=>{
        let arr=[];
        res.forEach(item=>{
          item=Object.assign({},item,{ShowTag:false},{TagArr:[]});
          arr.push(item);
        })
        this.tagList=arr;
      });
    },
  }
};
</script>

<style scoped>
/* .container {
  width: 100%;
  height: 100%;
}
.callContainer {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
} */
.handle-box {
  margin-bottom: 20px;
}
.handle-select {
  width: 12% !important;
}
.outline {
  outline: none;
  appearance: none;
}
.handle-input {
  width: 12% !important;
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
.outline {
  outline: none;
  appearance: none;
}
.edittitle {
  font-weight: 900;
  margin-bottom: 10px;
  margin-top: 20px;
}
.edittitle:first-child {
  margin-top: 0;
}
</style>