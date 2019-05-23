<template>
  <div class="table">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-if="callCustomerPageId>0" :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="callCustomerPageId==0 || callCustomerPageId==null"
        :to="{ path: '/calldetails' }"
      >拨打详情</el-breadcrumb-item>
      <el-breadcrumb-item v-else :to="{ path: '/customerlist/'+callCustomerPageId }">拨打名单</el-breadcrumb-item>
      <el-breadcrumb-item>拨打记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <div class="handle-box"></div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column align="center" label="孩子姓名">
          <template slot-scope="scope">
            <span>{{scope.row.ChildName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Mobile" align="center" label="手机号码"></el-table-column>
        <el-table-column align="center" label="拨打状态">
          <template slot-scope="scope">{{getStatus(scope.row.Status)}}</template>
        </el-table-column>
        <el-table-column prop="CallTime" align="center" label="拨打时间"></el-table-column>
        <el-table-column align="center" label="通话时长">
          <template slot-scope="scope">
            <span
              v-if="scope.row.Status==3"
            >{{scope.row.CallSecond | formatSeconds(scope.row.CallSecond)}}</span>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.Status==3">
              <el-button type="text" @click="openDetail(scope.row)">跟踪信息</el-button>
            </span>
            <span v-else></span>
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
      <!-- 跟踪信息弹出框 -->
      <el-dialog title="跟踪信息" :visible.sync="editVisible" width="730px">
        <el-form ref="editForm" :model="editForm" label-width="100px">
          <div class="edittitle">电话摘要</div>
          <el-checkbox-group v-model="editForm.AbstractTagsList">
            <el-checkbox disabled v-for="item in editForm.AbstractTagsList" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
          <div class="edittitle">数据摘要</div>
          <el-form-item label="家庭角色:" prop="position">
            <el-radio v-model="editForm.FamilyRole" label="0" disabled>未知</el-radio>
            <el-radio v-model="editForm.FamilyRole" label="1" disabled>爸爸</el-radio>
            <el-radio v-model="editForm.FamilyRole" label="2" disabled>妈妈</el-radio>
            <el-radio v-model="editForm.FamilyRole" label="3" disabled>其它</el-radio>
          </el-form-item>
          <el-form-item label="孩子姓名:">
            <el-input v-model="editForm.ChildName" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系地址:">
            <el-select
              v-model="editForm.Province"
              disabled
              style="float:left;width:130px;margin-right:20px;"
            ></el-select>
            <el-select
              v-model="editForm.City"
              disabled
              style="float:left;width:130px;margin-right:20px;"
            ></el-select>
            <el-select v-model="editForm.County" disabled style="float:left;width:130px;"></el-select>
          </el-form-item>
          <el-form-item label="详细地址:">
            <el-input v-model="editForm.AddressDetails" disabled></el-input>
          </el-form-item>
          <div class="edittitle">其他</div>
          <el-form-item :label="item.TypeName" v-for="item in editForm.TagList" :key="item.TypeId">
            <el-input v-model="item.TagList" disabled suffix-icon="el-icon-arrow-down"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" rows="4" v-model="editForm.Remark" disabled></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false" type="primary">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { regionDataPlus, CodeToText } from "element-china-area-data";
import {
  getAccountDelegateCallRecordList,
  getAccountDelegateCallRecordTrack
} from "api/home.js";
export default {
  name: "basetable",
  data() {
    return {
      callCustomerPageId: 0, //判断页面是哪里跳过来的
      Id: 0, //拨打详情Id
      tableData: [],
      cur_page: 1,
      pageCount: 0,
      pagesize: 30,

      editVisible: false, //跟踪信息弹出框是否显示
      editForm: {
        RecordId: 0,
        FamilyRole: "",
        ChildName: "",
        Province: "",
        City: "",
        County: "",
        AddressDetails: "",
        Remark: ""
      }
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
    this.Id = this.$route.params.id;
    this._getAccountDelegateCallRecordList();
    this.callCustomerPageId = sessionStorage.getItem("callCustomerPageId");
  },
  methods: {
    //获取用户分配到的委托名单拨打记录
    _getAccountDelegateCallRecordList() {
      const params = {
        Id: this.Id,
        PageIndex: this.cur_page,
        PageCount: this.pagesize
      };
      return getAccountDelegateCallRecordList(params).then(res => {
        this.tableData = res.List;
        this.pageCount = res.TotalCount;
      });
    },
    //获取用户分配到的委托名单拨打记录跟踪信息
    _getAccountDelegateCallRecordTrack(item) {
      const params = {
        Id: item.RecordId
      };
      return getAccountDelegateCallRecordTrack(params).then(res => {
        if (res != null) {
          this.editForm = res;
          this.editForm.FamilyRole = res.FamilyRole + "";
          this.editForm=Object.assign({},{AbstractTagsList:this.editForm.AbstractTags.split(',')})
        } else {
          this.editForm = {
            RecordId: 0,
            FamilyRole: "",
            ChildName: "",
            Province: "",
            City: "",
            County: "",
            AddressDetails: "",
            Remark: ""
          };
        }
      });
    },
    //分页导航尺寸更改
    handleSizeChange(val) {
      this.pagesize = val;
      this._getAccountDelegateCallRecordList();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this._getAccountDelegateCallRecordList();
    },
    // 跟踪信息
    openDetail(item) {
      this._getAccountDelegateCallRecordTrack(item);
      this.editVisible = true;
    },

    getStatus(status) {
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
    }
  }
};
</script>

<style scoped>
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
.edittitle {
  font-weight: 900;
  margin-bottom: 10px;
  margin-top: 20px;
}
.edittitle:first-child {
  margin-top: 0;
}
</style>