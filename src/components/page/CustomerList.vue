<template>
  <div class="over-hidden">
    <div class="table">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="height:50px;line-height:40px;">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>拨打名单</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="position">
        <img
          :src="speechCraftImg"
          @click="ShowSpeechCraftForm"
          width="80px"
          height="80px"
          style="position:absolute;right:0;z-index: 99999;"
        >
        <img
          :src="speechCraftImg2"
          @click="openPushCommon"
          width="80px"
          height="80px"
          style="position:absolute;right:0;top:73px;z-index: 9999;"
        >
        <div v-if="showTalkingForm" style="position:absolute;right:-14px;top:39px;z-index: 9999;">
          <div>
            <img :src="popImg" width="800px" height="600px">
          </div>
          <div class="bgTable">
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="margin-left: 19px;margin-top: 25px;"
            >
              <el-form-item label="搜索话术:">
                <el-input v-model="talkKeyword" placeholder="请输入关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="talkingskillSearch()">搜索</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="talkingskillTableData"
              ref="multipleTable"
              height="auto"
              max-height="404"
              style="margin-top:-10px;"
            >
              <el-table-column prop="Question" align="center" label="问题" width="150px;"></el-table-column>
              <el-table-column prop="Answer" align="center" label="答案"></el-table-column>
            </el-table>
            <div>
              <el-pagination
                background
                @size-change="talkingskillHandleSizeChange"
                @current-change="talkingskillHandleCurrentChange"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="30"
                layout="total,prev, pager, next, jumper"
                :total="talkingskillTotalCount"
                class="paging"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" title="委托信息" style="border-top:1px solid #ebeef5">
          <div class="container-table container_div">
            <div class="content_box">
              <el-form size="mini">
                <el-form-item label="商家名称:">
                  <span>{{delegateDetails.SellerName}}</span>
                </el-form-item>
                <el-form-item label="商家地址:">
                  <span>{{delegateDetails.SellerAddress}}</span>
                </el-form-item>
                <el-form-item label="商家电话:">
                  <span>{{delegateDetails.SellerMobile}}</span>
                </el-form-item>
                <el-form-item label="任务有效期:">
                  <span>{{delegateDetails.DelegateStartTime+"至"+delegateDetails.DelegateEndTime}}</span>
                </el-form-item>
                <el-form-item label="委托时间:">
                  <span>{{delegateDetails.StartTime+"至"+delegateDetails.EndTime}}</span>
                </el-form-item>
                <el-form-item label="委托名称:">
                  <span>{{delegateDetails.Name}}</span>
                </el-form-item>
                <el-form-item label="委托内容:">
                  <span>{{delegateDetails.DelegateContent}}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3" title="统计信息">
          <div class="container-table container_div">
            <div class="content_box">
              <div>
                <ul class="entrust-ul flex">
                  <li class="entrust-item flex">
                    <img :src="entrustNumber" class="icon">
                    <span class="item-span">委托数量:{{delegateDetails.DelegateTotalCount}}</span>
                  </li>
                  <li class="entrust-item flex">
                    <img :src="realNumber" class="icon">
                    <span class="item-span">实际人数:{{delegateDetails.DelegateRealTotalCount}}</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul class="entrust-ul flex">
                  <li class="entrust-item flex">
                    <img :src="assignNumber" class="icon">
                    <span class="item-span">分配人数:{{delegateDetails.DelegateCount}}</span>
                  </li>
                  <li class="entrust-item flex">
                    <img :src="appointedNumber" class="icon">
                    <span class="item-span">已预约人数:{{delegateDetails.DelegateFinishCount}}</span>
                  </li>
                  <li class="entrust-item flex">
                    <img :src="notappointNumber" class="icon">
                    <span class="item-span">未预约人数:{{delegateDetails.DelegateHangCount}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4" title="已预约名单">
          <div class="container-table container_div">
            <div class="content_box">
              <el-table :data="finishTableData" fixed border ref="multipleTable">
                <el-table-column align="center" label="父母姓名" fixed>
                  <template slot-scope="scope">{{scope.row.FatherName}}/{{scope.row.MotherName}}</template>
                </el-table-column>
                <el-table-column align="center" label="孩子姓名">
                  <template slot-scope="scope">
                    <span>{{scope.row.ChildName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="Mobile" align="center" label="联系方式"></el-table-column>
                <el-table-column align="center" label="预约状态">
                  <template slot-scope="scope">{{getAppointmentStatus(scope.row.Status)}}</template>
                </el-table-column>
                <el-table-column align="center" label="推送状态">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="openPushStatusForm(scope.row)"
                    >{{getPushStatus(scope.row.PushStatus)}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="AppointmentTime" align="center" label="预约时间"></el-table-column>
                <el-table-column prop="ExportTime" align="center" label="导出时间"></el-table-column>
                <el-table-column label="操作" align="center" width="150" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showFinishRemark(scope.row)">备注</el-button>
                    <el-button type="text" class="red" @click="deleteFinishCustomer(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  background
                  @size-change="finishHandleSizeChange"
                  @current-change="finishHandleCurrentChange"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :page-size="30"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="finishTotalCount"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="5" title="跟进名单">
          <div class="container-table container_div">
            <div class="content_box">
              <el-table
                :data="traceTableData"
                fixed
                border
                ref="multipleTable"
                :row-class-name="tableRowClassName"
              >
                <el-table-column align="center" label="父母姓名" fixed>
                  <template slot-scope="scope">{{scope.row.FatherName}}/{{scope.row.MotherName}}</template>
                </el-table-column>
                <el-table-column align="center" label="孩子姓名">
                  <template slot-scope="scope">
                    <span>{{scope.row.ChildName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="联系方式1" width="150">
                  <template slot-scope="scope">
                    <el-radio v-model="scope.row.Selection" label="1">
                      <span :class="{red:scope.row.BackFrom===1}">{{scope.row.Mobile}}</span>
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="联系方式2" width="150">
                  <template slot-scope="scope" v-if="scope.row.OtherMobile">
                    <el-radio v-model="scope.row.Selection" label="2">
                      <span :class="{red:scope.row.BackFrom===1}">{{scope.row.OtherMobile}}</span>
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="CallCount" align="center" label="拨打次数"></el-table-column>
                <el-table-column prop="LasCallTime" align="center" label="最新拨打时间"></el-table-column>
                <el-table-column align="center" label="状态">
                  <template slot-scope="scope">{{getCallStatus(scope.row.Status)}}</template>
                </el-table-column>
                <el-table-column align="center" label="在其他委托拨打">
                  <template slot-scope="scope">
                   <div>{{scope.row.OthenDelegateName}}</div>
                   <div>{{scope.row.OthenDelegateLastCallTime}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="380" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="toCallMobile(scope.row)">拨打</el-button>
                    <el-button
                      v-if="scope.row.IsExport==true"
                      type="primary"
                      size="small"
                      @click="openExport(scope.row)"
                      disabled
                    >导出</el-button>
                    <el-button v-else type="primary" size="small" @click="openExport(scope.row)">导出</el-button>
                    <el-button type="text" @click="jumpCallRecord(scope.row)">拨打记录</el-button>
                    <el-button type="text" @click="openHangRemarkForm(scope.row)">备注</el-button>
                    <el-button
                      v-if="scope.row.BackFrom==1"
                      type="text"
                      @click="openBackForm(scope.row)"
                    >回退记录</el-button>
                    <el-button type="text" class="red" @click="deleteTraceCustomer(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  background
                  @size-change="traceHandleSizeChange"
                  @current-change="traceHandleCurrentChange"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :page-size="30"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="traceTotalCount"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="6" title="未预约名单">
          <div class="container-table container_div">
            <div class="content_box" v-loading="loading">
              <el-table
                :data="hangTableData"
                fixed
                border
                ref="multipleTable"
                :row-class-name="tableRowClassName"
              >
                >
                <el-table-column align="center" label="父母姓名" fixed>
                  <template slot-scope="scope">{{scope.row.FatherName}}/{{scope.row.MotherName}}</template>
                </el-table-column>
                <el-table-column align="center" label="孩子姓名">
                  <template slot-scope="scope">
                    <span>{{scope.row.ChildName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="联系方式1" width="150">
                  <template slot-scope="scope">
                    <el-radio v-model="scope.row.Selection" label="1">
                      <span :class="{red:scope.row.BackFrom===1}">{{scope.row.Mobile}}</span>
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="联系方式2" width="150">
                  <template slot-scope="scope" v-if="scope.row.OtherMobile">
                    <el-radio v-model="scope.row.Selection" label="2">
                      <span :class="{red:scope.row.BackFrom===1}">{{scope.row.OtherMobile}}</span>
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="CallCount" align="center" label="拨打次数"></el-table-column>
                <el-table-column prop="LasCallTime" align="center" label="最新拨打时间"></el-table-column>
                <el-table-column align="center" label="状态">
                  <template slot-scope="scope">{{getCallStatus(scope.row.Status)}}</template>
                </el-table-column>
                <el-table-column align="center" label="在其他委托拨打">
                  <template slot-scope="scope">
                   <div>{{scope.row.OthenDelegateName}}</div>
                   <div>{{scope.row.OthenDelegateLastCallTime}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="400" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="toCallMobile(scope.row)">拨打</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="openExport(scope.row)"
                      :disabled="scope.row.IsExport==true"
                    >导出</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="trace(scope.row)"
                      :disabled="scope.row.TraceStatus==1"
                    >跟进</el-button>
                    <el-button type="text" @click="jumpCallRecord(scope.row)">拨打记录</el-button>
                    <el-button type="text" @click="openHangRemarkForm(scope.row)">备注</el-button>
                    <el-button
                      v-if="scope.row.BackFrom==1"
                      type="text"
                      @click="openBackForm(scope.row)"
                    >回退记录</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="context-box-bottom">
                <div class="bottom-item1">
                  <label for>客户范围:</label>
                  <el-select v-model="customerType" placeholder="请选择" style="width:100px;">
                    <el-option
                      v-for="item in customerTypeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div v-if="ageList.length>0" class="bottom-item1">
                  <label for>年龄筛选:</label>
                  <el-select v-model="age1" placeholder="请选择" style="width:100px;">
                    <el-option
                      v-for="item in ageList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>至
                  <el-select v-model="age2" placeholder="请选择" style="width:100px;">
                    <el-option
                      v-for="item in ageList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div v-if="distanceList.length>0" class="bottom-item1">
                  <label for>公里范围:</label>
                  <el-select v-model="distance" placeholder="请选择" style="width:100px;">
                    <el-option
                      v-for="item in distanceList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div class="bottom-item2 flex" @click="changeother()">
                  <!-- <i class="reload icon1 flex"></i> -->
                  <i class="el-icon-refresh reload"></i>
                  <span class="item-span" v-if="hangTableData.length>0">换一批</span>
                  <span class="item-span" v-else>重新加载</span>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- 拨打电话弹窗 -->
      <callPhone :data="FamilyData" v-on:listenShowCall="changeShowCall" v-if="isShowMobile"></callPhone>
      <!-- 话术详情弹窗 -->
      <el-dialog :title="'话术详情'" :visible.sync="talkingskillDetailsVisible" width="633px">
        <el-form ref="talkingskillDetailsForm" :model="talkingskillDetailsForm" label-width="100px">
          <el-form-item label="问题:">
            <el-input
              type="textarea"
              :rows="4"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="talkingskillDetailsForm.Question"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="答案:">
            <el-input
              type="textarea"
              :rows="4"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="talkingskillDetailsForm.Answer"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="talkingskillDetailsVisible = false" type="primary" size="medium">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 导出弹窗 -->
      <el-dialog title="导出名单" :visible.sync="exportVisible" width="633px">
        <el-form ref="exportForm" :model="exportForm" label-width="100px">
          <div
            style="margin-bottom:10px;"
          >您确定要把【{{exportForm.ChildName}}】的信息导出给【{{exportForm.SellerName}}】吗?</div>

          <el-table :data="callRecordTableData" border ref="multipleTable" max-height="250">
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
      <!-- 已预约备注弹窗 -->
      <el-dialog
        :title="`备注-${finishRemarkForm.ChildName}`"
        :visible.sync="finishRemarkVisible"
        width="633px"
      >
        <el-form ref="finishRemarkForm" :model="finishRemarkForm" label-width="100px">
          <el-form-item label="商家备注:">
            <el-input type="textarea" :rows="6" v-model="finishRemarkForm.SellerRemark" disabled></el-input>
          </el-form-item>
          <el-form-item label="我的备注:">
            <el-input type="textarea" :rows="6" v-model="finishRemarkForm.AccountRemark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="finishRemarkVisible = false" size="medium">取消</el-button>
          <el-button @click="modifyFinishRemark()" type="primary" size="medium">确定</el-button>
        </span>
      </el-dialog>
      <!-- 未预约备注弹窗 -->
      <el-dialog
        :title="`备注-${hangRemarkForm.ChildName}`"
        :visible.sync="hangRemarkVisible"
        width="633px"
      >
        <el-form ref="hangRemarkForm" :model="hangRemarkForm" label-width="100px">
          <el-form-item label="备注:">
            <el-input type="textarea" :rows="6" v-model="hangRemarkForm.AccountRemark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hangRemarkVisible = false" size="medium">取消</el-button>
          <el-button @click="modifyHangRemark()" type="primary" size="medium">确定</el-button>
        </span>
      </el-dialog>
      <!-- 跟踪信息弹出框 -->
      <el-dialog title="跟踪记录" :visible.sync="editVisible" width="730px" :before-close="handleClose">
        <div class="edittitle">电话摘要</div>
        <el-checkbox-group v-model="editForm.AbstractTags">
          <el-checkbox v-for="item in abstractList" :label="item.Name" :key="item.Id">{{item.Name}}</el-checkbox>
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
      <!-- 回退记录弹出框 -->
      <el-dialog title="回退记录" :visible.sync="backVisible" width="630px">
        <el-table :data="backForm" fixed border ref="multipleTable">
          <el-table-column prop="Reason" align="center" label="原因" fixed></el-table-column>
          <el-table-column prop="Description" align="center" label="描述"></el-table-column>
          <el-table-column prop="CreateTime" align="center" label="回退时间"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @size-change="back_handleSizeChange"
            @current-change="back_handleCurrentChange"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="30"
            layout="total, prev, pager, next"
            :total="back_pageCount"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backVisible = false" size="medium" type="primary">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 谁送状态弹出框 -->
      <el-dialog
        :title="`推送状态-${pushStatusForm.childName}`"
        :visible.sync="pushStatusVisible"
        width="630px"
      >
        <el-form
          :inline="true"
          class="demo-form-inline"
          ref="pushStatusForm"
          :model="pushStatusForm"
        >
          <el-form-item label="推送状态：" label-width="100px" prop="pushStatus">
            <el-select v-model="pushStatusForm.pushStatus" placeholder="请选择" style="width:400px;">
              <el-option
                v-for="item in pushStatusForm.pushStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推送至：" label-width="100px" prop="storeId">
            <el-cascader
              :options="pushStatusForm.storeIdList"
              v-model="pushStatusForm.storeId"
              :props="pushStatusForm.props"
              style="width:300px;"
              :disabled="pushStatusForm.pushStatus!=3"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="备注：" label-width="100px">
            <el-input type="textarea" rows="6" style="width:400px;" v-model="pushStatusForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="pushStatusVisible = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="pushStatusFormOk()" size="medium">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 公共池弹出框 -->
      <el-dialog title="名单转入" :visible.sync="pushCommonVisible" width="850px">
        <el-table :data="pushCommonTable" fixed border ref="multipleTable">
          <el-table-column align="center" label="父母姓名" fixed>
            <template slot-scope="scope">{{scope.row.FatherName}}/{{scope.row.MotherName}}</template>
          </el-table-column>
          <el-table-column prop="ChildName" align="center" label="孩子姓名"></el-table-column>
          <el-table-column prop="AccountName" align="center" label="拨打人员"></el-table-column>
          <el-table-column prop="CallTime" align="center" label="拨打时间"></el-table-column>
          <el-table-column prop="SellerName" align="center" label="转入门店"></el-table-column>
          <el-table-column prop="Remark" align="center" label="备注"></el-table-column>
          <el-table-column label="操作" align="center" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="traceCommon(scope.row)">跟进</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @current-change="pushCommonHandleCurrentChange"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="10"
            layout="total,prev, pager, next"
            :total="pushCommonTotalCount"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="pushCommonVisible=false" size="medium">关 闭</el-button>
        </div>
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
  deleteAccountDelegateFinishCustomer,
  getAccountDelegateFinishCustomerList,
  getAccountDelegateDetails,
  getAccountDelegateTalkingskillList,
  modifyAccountDelegateHangCustomerRemark,
  getAccountDelegateHangCustomerList,
  exportAccountDelegateHangCustomer,
  addTrack,
  getAccountDelegateCallRecordList,
  getAccountDelegateTraceCustomerList,
  deleteAccountDelegateTraceCustomer,
  traceAccountDelegateCustomer,
  getAccountDelegateExportBackList,
  modifyAccountDelegateFinishCustomerPushStatus,
  getAccountDelegateCommonList,
  traceAccountDelegateCommon,
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
      popImg: "static/img/pop.png",
      speechCraftImg: "static/img/speechcraftico.png",
      speechCraftImg2: "static/img/speechcraftico2.png",
      entrustNumber: "static/img/entrustNumber.png",
      realNumber: "static/img/realNumber.png",
      assignNumber: "static/img/assignNumber.png",
      appointedNumber: "static/img/appointedNumber.png",
      notappointNumber: "static/img/notappointNumber.png",
      Id: 0, //委托分配Id
      DelegateId: 0, //活动Id
      activeNames: ["3", "4", "5", "6"],
      finishTableData: [], //已预约名单列表
      finishTotalCount: 0, //已预约名单总条数
      finishPagesize: 30, //已预约每页数量
      finish_cur_page: 1, //已预约当前页码
      finishRemarkVisible: false, //已预约备注弹窗是否显示
      finishRemarkForm: {
        Id: 0, //数据Id
        ChildName: "", //孩子姓名
        SellerRemark: "", //商家备注
        AccountRemark: "" //我的备注
      },

      traceTableData: [], //跟进名单列表
      traceTotalCount: 0, //跟进名单总条数
      tracePagesize: 30, //跟进名单每页数量
      trace_cur_page: 1, //跟进名单当前页码

      showTalkingForm: false,
      talkKeyword: "",
      talkingskillTableData: [], //话术列表
      talkingskillTotalCount: 0, //话术总条数
      talkingskillPagesize: 30, //话术每页数量
      talkingskill_cur_page: 1, //话术当前页码
      talkingskillDetailsVisible: false, //话术详情是否像是
      talkingskillDetailsForm: {
        Question: "",
        Answer: ""
      }, //话术详情弹窗信息

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

      hangTableData: [], //未预约名单列表
      customerType: 0,
      customerTypeList: [
        { id: 0, name: "不限" },
        { id: 1, name: "新用户" },
        { id: 2, name: "老用户" }
      ],
      age1: 0,
      age2: 0,
      ageList: [],
      distance: 0,
      distanceList: [],
      hangRemarkVisible: false, //未预约备注弹窗是否显示
      hangRemarkForm: {
        Id: 0,
        ChildName: "", //孩子姓名
        AccountRemark: "" //我的备注
      },

      loading: false,

      // excel
      json_fields: {
        父母姓名: "Parent",
        孩子姓名: "ChilrenName",
        联系方式1: "Mobile",
        联系方式2: "OtherMobile",
        拨打次数: "CallCount",
        最新拨打时间: "LastCallTime",
        状态: "Status",
        状态描述: "StatusDes"
      },
      json_data: [],
      json_meta: [
        [
          {
            " key ": " charset ",
            " value ": " utf- 8 "
          }
        ]
      ],
      //委托详情
      delegateDetails: {
        SellerAddress: "",
        SellerMobile: "",
        StartTime: "",
        EndTime: "",
        DelegateStartTime: "",
        DelegateEndTime: "",
        DelegateContent: "",
        DelegateTotalCount: 0,
        DelegateRealTotalCount: 0,
        SellerName: "",
        Id: 0,
        Name: "",
        DelegateCount: 0,
        DelegateFinishCount: 0,
        DelegateHangCount: 0,
        MaxCallCount: 0,
        Status: 0,
        StatusDes: "",
        DelegateRemainTime: 0,
        SellerRemark: "",
        DirectorRemark: "",
        AgeRange: "",
        DistanceRange: ""
      },
      isShowMobile: false,
      FamilyData: {},

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
      traceInitInfo: {},

      backVisible: false,
      back_cur_page: 1, //页码
      back_pagesize: 30, //每页数量
      back_pageCount: 0, //总条数
      backForm: [],
      back_detailsId: 0,

      pushStatusVisible: false,
      pushStatusForm: {
        exportId: "",
        childName: "",
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
        storeIdList: [],
        remark: ""
      },

      pushCommonVisible: false,
      pushCommonTable: [],
      pushCommonTotalCount: 0,
      pushCommonPagesize: 10, //已预约每页数量
      pushCommon_cur_page: 1, //已预约当前页码

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
    // this.RecordId=10008;
    // this.showTrack();
    this.Id = this.$route.params.id;
    this.DelegateId = this.$route.query.DelegateId;
    this._getAccountDelegateDetails().then(res => {
      this.ageList = [];
      this.age = 0;
      if (this.delegateDetails.AgeRange != null) {
        var age = this.delegateDetails.AgeRange.split("-");
        if (age.length == 2) {
          for (var i = parseInt(age[0]); i <= parseInt(age[1]); i++) {
            this.ageList.push({ id: i, name: i + "岁" });
          }
          this.age1 = parseInt(age[0]);
          this.age2 = parseInt(age[1]);
        }
      }
      this.distanceList = [];
      this.distance = 0;
      if (this.delegateDetails.DistanceRange != null) {
        var distance = this.delegateDetails.DistanceRange.split("-");
        if (distance.length == 2) {
          for (var i = parseInt(distance[0]); i <= parseInt(distance[1]); i++) {
            this.distanceList.push({ id: i, name: i + "公里" });
          }
          this.distance = parseInt(distance[1]);
        }
      }
    });
    this._getAccountDelegateTalkingskillList();
    this._getAccountDelegateFinishCustomerList();
    this._getAccountDelegateTraceCustomerList();
    this._getAccountDelegateHangCustomerList(1);
    sessionStorage.setItem("callCustomerPageId", this.Id);
  },
  methods: {
    //打开已预约推送状态修改弹窗
    openPushStatusForm(item) {
      this._getAccountDelegateRelList().then(res => {
        this.pushStatusForm.storeIdList = res;
      });
      this.pushStatusForm.storeId = ["", ""];
      this.pushStatusVisible = true;
      this.pushStatusForm.childName = item.ChildName;
      this.pushStatusForm.exportId = item.Id;
      this.pushStatusForm.pushStatus = item.PushStatus;
      this.pushStatusForm.remark = item.AccountRemark;
    },
    //已预约推送状态修改确认
    pushStatusFormOk() {
      this._modifyAccountDelegateFinishCustomerPushStatus().then(val => {
        this.pushStatusVisible = false;
        this._getAccountDelegateFinishCustomerList();
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.BackFrom === 1) {
        return "red-row";
      }
      return "";
    },
    openBackForm(item) {
      this.back_detailsId = item.Id;
      this.back_cur_page = 1;
      this._getAccountDelegateExportBackList().then(val => {
        this.backVisible = true;
      });
    },
    //分页导航尺寸更改
    back_handleSizeChange(val) {
      this.back_pagesize = val;
      this._getAccountDelegateExportBackList();
    },
    // 分页导航
    back_handleCurrentChange(val) {
      this.back_cur_page = val;
      this._getAccountDelegateExportBackList();
    },
    ShowSpeechCraftForm() {
      this.showTalkingForm = !this.showTalkingForm;
    },
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
      this.isShowMobile = false;
      if (data.isShowTrack) {
        this.RecordId = data.RecordId;
        this.showTrack();
      }
      this._getAccountDelegateHangCustomerList(1);
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
      this._getAccountDelegateRelList().then(res => {
        this.exportForm.storeIdList = res;
      });
      this.exportForm.storeId = ["", ""];
      this.exportForm.pushStatus = 1;
      this.exportForm.Id = item.Id;
      this.exportForm.ChildName = item.ChildName;
      this.exportForm.SellerName = this.delegateDetails.SellerName;
      this.exportForm.Remark = item.AccountRemark;
      this.exportForm.Selection = item.Selection;
      this.exportVisible = true;
      this.exportForm.appointmentStatus = 1;
      this.exportForm.ChildName = item.ChildName;
      this.exportForm.Mobile =
        item.Selection == "1" ? item.Mobile : item.OtherMobile;
      this.exportForm.RecordFile = "";
      this.exportFormTableRadio = "";
      this.json_data = [
        {
          Parent: `${item.FatherName}/${item.MotherName}`,
          ChildrenName: `${item.ChildName}`,
          Mobile: `${item.Mobile}`,
          OtherMobile: `${item.OtherMobile}`,
          CallCount: `${item.CallCount}`,
          LastCallTime: `${item.LasCallTime}`,
          Status: `${this.getAppointmentStatus(item.Status)}`,
          StatusDes: `${item.StatusDes}`
        }
      ];
      this._getAccountDelegateCallRecordList(item.Id);
    },
    //确认导出
    exportOk() {
      this._exportAccountDelegateHangCustomer().then(val => {
        this._getAccountDelegateHangCustomerList(1);
        this._getAccountDelegateFinishCustomerList();
        this._getAccountDelegateTraceCustomerList();
        this._getAccountDelegateDetails();
        this.exportVisible = false;
        this.$message({
          showClose: true,
          message: "导出成功",
          type: "success"
        });
      });
    },
    //已预约名单分页导航尺寸更改
    finishHandleSizeChange(val) {
      this.finishPagesize = val;
      this._getAccountDelegateFinishCustomerList();
    },
    // 已预约名单分页导航
    finishHandleCurrentChange(val) {
      this.finish_cur_page = val;
      this._getAccountDelegateFinishCustomerList();
    },
    //跟进名单分页导航尺寸更改
    traceHandleSizeChange(val) {
      this.tracePagesize = val;
      this._getAccountDelegateTraceCustomerList();
    },
    // 跟进名单分页导航
    traceHandleCurrentChange(val) {
      this.trace_cur_page = val;
      this._getAccountDelegateTraceCustomerList();
    },
    //话术列表分页导航尺寸更改
    talkingskillHandleSizeChange(val) {
      this.talkingskillPagesize = val;
      this._getAccountDelegateTalkingskillList();
    },
    // 话术列表分页导航
    talkingskillHandleCurrentChange(val) {
      this.talkingskill_cur_page = val;
      this._getAccountDelegateTalkingskillList();
    },
    //话术列表搜索
    talkingskillSearch() {
      (this.talkingskill_cur_page = 1),
        this._getAccountDelegateTalkingskillList();
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
    //获取已预约名单
    _getAccountDelegateFinishCustomerList() {
      const params = {
        Id: this.Id,
        PageIndex: this.finish_cur_page,
        PageCount: this.finishPagesize
      };
      return getAccountDelegateFinishCustomerList(params).then(res => {
        this.finishTableData = res.List;
        this.finishTotalCount = res.TotalCount;
      });
    },
    //	删除用户分配到的委托已预约名单
    _deleteAccountDelegateFinishCustomer(item) {
      const params = {
        Id: item.Id
      };
      return deleteAccountDelegateFinishCustomer(params);
    },
    //获取用户分配到的委托活动详情
    _getAccountDelegateDetails() {
      const params = {
        Id: this.Id
      };
      return getAccountDelegateDetails(params).then(res => {
        this.delegateDetails = res;
      });
    },
    //	获取用户分配到的委托活动话术列表
    _getAccountDelegateTalkingskillList() {
      const params = {
        Id: this.DelegateId,
        Keyword: this.talkKeyword,
        PageIndex: this.talkingskill_cur_page,
        PageCount: this.talkingskillPagesize
      };
      return getAccountDelegateTalkingskillList(params).then(res => {
        this.talkingskillTableData = res.List;
        this.talkingskillTotalCount = res.TotalCount;
      });
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
    //获取用户分配到的委托未预约名单列表
    _getAccountDelegateHangCustomerList(Type) {
      const params = {
        Id: this.Id,
        Type: Type,
        CustomerType: this.customerType,
        AgeRange: this.ageList.length > 0 ? this.age1 + "-" + this.age2 : "",
        DistanceRange: this.distanceList.length > 0 ? "0-" + this.distance : "",
        PageCount: 8
      };
      return getAccountDelegateHangCustomerList(params).then(res => {
        this.hangTableData = res;
      });
    },

    //显示已预约备注弹窗
    showFinishRemark(item) {
      this.finishRemarkForm.Id = item.Id;
      this.finishRemarkForm.ChildName = item.ChildName;
      this.finishRemarkForm.SellerRemark = item.SellerRemark;
      this.finishRemarkForm.AccountRemark = item.AccountRemark;
      this.finishRemarkVisible = true;
    },
    deleteFinishCustomer(item) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this._deleteAccountDelegateFinishCustomer(item).then(() => {
          this._getAccountDelegateFinishCustomerList();
          this._getAccountDelegateTraceCustomerList();
          this._getAccountDelegateHangCustomerList(1);
          this._getAccountDelegateDetails();
        });
      });
    },
    deleteTraceCustomer(item) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this._deleteAccountDelegateTraceCustomer(item).then(val => {
          this._getAccountDelegateTraceCustomerList();
          this._getAccountDelegateHangCustomerList(1);
        });
      });
    },
    trace(item) {
      this._traceAccountDelegateCustomer(item).then(val => {
        this._getAccountDelegateTraceCustomerList();
        this._getAccountDelegateHangCustomerList(1);
      });
    },
    //打开话术详情弹窗
    openTalkingskillDetail(item) {
      this.talkingskillDetailsForm.Question = item.Question;
      this.talkingskillDetailsForm.Answer = item.Answer;
      this.talkingskillDetailsVisible = true;
    },
    //修改已预约备注确定
    modifyFinishRemark() {
      this._modifyAccountDelegateHangCustomerRemark(
        this.finishRemarkForm.Id,
        2,
        this.finishRemarkForm.AccountRemark
      ).then(val => {
        this._getAccountDelegateFinishCustomerList();
        this.finishRemarkVisible = false;
        this.$message({
          showClose: true,
          message: "备注修改成功",
          type: "success"
        });
      });
    },
    //修改未预约备注确定
    modifyHangRemark() {
      this._modifyAccountDelegateHangCustomerRemark(
        this.hangRemarkForm.Id,
        1,
        this.hangRemarkForm.AccountRemark
      ).then(val => {
        this._getAccountDelegateHangCustomerList(1);
        this._getAccountDelegateTraceCustomerList();
        this.hangRemarkVisible = false;
        this.$message({
          showClose: true,
          message: "备注修改成功",
          type: "success"
        });
      });
    },
    //未预约列表换一批
    changeother() {
      if (this.ageList.length > 0) {
        if (parseInt(this.age1) > parseInt(this.age2)) {
          this.$message.error("年龄范围输入有误");
          return false;
        }
      }
      this.loading = true;
      this._getAccountDelegateHangCustomerList(2)
        .then(val => {
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    //打开未预约备注弹窗
    openHangRemarkForm(item) {
      this.hangRemarkForm.Id = item.Id;
      this.hangRemarkForm.ChildName = item.ChildName;
      this.hangRemarkForm.AccountRemark = item.AccountRemark;
      this.hangRemarkVisible = true;
    },
    //跳转到拨打记录
    jumpCallRecord(item) {
      this.$router.push(`/callrecord/${item.Id}`);
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
    getCallStatus(status) {
      switch (status) {
        case 0:
          return "未拨打";
          break;
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
    getPushStatus(status) {
      switch (status) {
        case 1:
          return "直接推送";
        case 2:
          return "需主管确认";
        case 3:
          return "推送至其他门店";
        default:
          return "未知";
      }
    },
    openPushCommon() {
      this.pushCommonVisible = true;
      this._getAccountDelegateCommonList();
    },
    // 分页导航
    pushCommonHandleCurrentChange(val) {
      this.pushCommon_cur_page = val;
      this._getAccountDelegateCommonList();
    },
    traceCommon(item) {
      this._traceAccountDelegateCommon(item).then(val => {
        this._getAccountDelegateCommonList();
        this._getAccountDelegateTraceCustomerList();
        this.$message({
          showClose: true,
          message: "已加入跟进列表",
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
    //获取用户分配到的委托跟进名单列表
    _getAccountDelegateTraceCustomerList() {
      const params = {
        DistributionId: this.Id,
        PageIndex: this.trace_cur_page,
        PageCount: this.tracePagesize
      };
      return getAccountDelegateTraceCustomerList(params).then(res => {
        this.traceTableData = res.List;
        this.traceTotalCount = res.TotalCount;
      });
    },
    _deleteAccountDelegateTraceCustomer(item) {
      const params = {
        Id: item.Id
      };
      return deleteAccountDelegateTraceCustomer(params);
    },
    _traceAccountDelegateCustomer(item) {
      const params = {
        Id: item.Id
      };
      return traceAccountDelegateCustomer(params);
    },
    //获取委托导出名单回退记录列表
    _getAccountDelegateExportBackList() {
      const params = {
        Id: this.back_detailsId,
        pageindex: this.back_cur_page,
        pagecount: this.back_pagesize
      };
      return getAccountDelegateExportBackList(params).then(res => {
        this.backForm = res.List;
        this.back_pageCount = res.TotalCount;
      });
    },
    //修改用户分配到的委托已预约名单推送状态
    _modifyAccountDelegateFinishCustomerPushStatus() {
      const params = {
        ExportId: this.pushStatusForm.exportId,
        PushStatus: this.pushStatusForm.pushStatus,
        Remark: this.pushStatusForm.remark,
        PushDestination: this.pushStatusForm.storeId[1]
      };
      return modifyAccountDelegateFinishCustomerPushStatus(params);
    },
    //获取公共池数据列表
    _getAccountDelegateCommonList() {
      const params = {
        Id: this.DelegateId,
        PageIndex: this.pushCommon_cur_page,
        PageCount: this.pushCommonPagesize
      };
      return getAccountDelegateCommonList(params).then(res => {
        this.pushCommonTable = res.List;
        this.pushCommonTotalCount = res.TotalCount;
      });
    },
    //跟进公共池数据
    _traceAccountDelegateCommon(item) {
      const params = {
        CommonId: item.Id
      };
      return traceAccountDelegateCommon(params);
    },
    //查询关联门店委托列表
    _getAccountDelegateRelList() {
      const params = {
        Id: this.DelegateId
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

<style scoped lang="less">
.el-pagination {
  padding: 2px 30px !important;
}
.callContainer {
  width: 100%;
  height: 3000px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 888;
}
.el-collapse-item {
  width: 100%;
}
.export-excel-wrapper {
  display: inline-block;
  width: 56px;
  height: 32px;
}
.sendPlace_box {
  width: 330px;
  height: 360px;
  overflow-y: auto;
  border: 1px solid #eeeeee;
}
.title-box {
  justify-content: space-between;
  align-items: center;
}
.el-collapse {
  border-top: none;
}
.table {
  width: 100%;
  background-color: #ffffff;
}
.content_box {
  padding: 20px;
}
.handle-box {
  width: auto;
  height: 20px;
  margin-bottom: 20px;
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
.line {
  height: 5px;
  border-top: 1px solid #eeeeee;
  flex: 1;
  margin-left: 2px;
}
.whiteBox {
  width: 100%;
  height: 5px;
  background-color: #eeeeee;
}
.container_div {
  margin-top: 1px !important;
}
.content_box {
  padding: 5px;
}
.entrust-ul {
  width: auto;
  height: 20px;
  box-sizing: border-box;
  padding: 15px 0;
  margin-top: 15px;
  align-items: center;
}
.entrust-item {
  float: left;
  width: 180px;
  height: 20px;
  line-height: 20px;
  align-items: center;
}
.entrustNumber {
  background: url("/static/img/entrustnumber.png") center no-repeat;
}
.realNumber {
  background: url("/static/img/realnumber.png") center no-repeat;
}
.assignNumber {
  background: url("/static/img/assignNumber.png") center no-repeat;
}
.appointedNumber {
  background: url("/static/img/appointedNumber.png") center no-repeat;
}
.notappointNumber {
  background: url("/static/img/notappointNumber.png") center no-repeat;
}
.reload {
  color: #409eff;
  position: relative;
  width: 20px;
  height: 20px;
  top: 2px;
}
.icon {
  align-items: center;
  width: 19px;
  height: 20px;
  margin-right: 14px;
}
.icon1 {
  align-items: center;
  width: 19px;
  height: 20px;
  margin-right: 5px;
}
.item-span {
  display: inline-block;
  width: auto;
  height: 20px;
  line-height: 20px;
}
.el-table th {
  background-color: #ffffff !important;
}
.context-box-bottom {
  width: 100%;
  height: 100px;
  padding: 20px 30px;
  box-sizing: border-box;
}
.bottom-item1 {
  float: left;
  margin-left: 20px;
}
.bottom-item2 {
  width: 95px;
  height: 20px;
  float: right;
  cursor: pointer;
}
</style>
<style>
.el-form-item__label {
  text-align: left !important;
  /* width: auto !important; */
  padding: 0 3px !important;
}
/* .el-collapse-item__wrap {
  margin-top: -35px !important;
} */
.el-collapse-item__content {
  padding-bottom: 0;
}
.outline {
  outline: none;
  appearance: none;
}
.position {
  z-index: 9999;
  position: absolute;
  right: 28px;
  width: 87%;
  top: 5px;
}
.container-table {
  background: #fff;
  border: none;
}
.bgTable {
  position: absolute;
  top: 38px;
  left: 45px;
  width: 712px;
  height: 510px;
  overflow: hidden;
}
.paging {
  margin-top: 7px;
  margin-left: 394px;
}
.el-table .red-row {
  color: #ff0000;
}
.edittitle {
  font-weight: 900;
  margin-bottom: 10px;
  margin-top: 20px;
}
.edittitle:first-child {
  margin-top: 0;
}
.over-hidden {
  overflow-x: hidden;
}
</style>