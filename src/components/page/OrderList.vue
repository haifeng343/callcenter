<template>
  <div class="table">
    <el-breadcrumb separator-class="el-icon-arrow-right"></el-breadcrumb>
    <div class="container">
      <div class="handle-box">
        <label for>商家名称:</label>
        <el-input v-model="name" placeholder="请输入商家名称" class="handle-input mr10"></el-input>
        <label for>委托名称:</label>
        <el-input v-model="activity" placeholder="请输入委托名称" class="handle-input mr10"></el-input>
        <label for>状态:</label>
        <el-select v-model="status" placeholder="请选择状态">
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button icon="search" @click="search" type="primary">
          <i class="el-icon-search" style="margin-right:10px;"></i>搜 索
        </el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="SellerName" align="center" label="商家名称"></el-table-column>
        <el-table-column prop="Name" align="center" label="委托名称"></el-table-column>
        <el-table-column prop="Status" align="center" label="状态">
          <template slot-scope="scope">{{getStatus(scope.row.Status)}}</template>
        </el-table-column>
        <el-table-column prop="StatusDes" align="center" label="状态描述"></el-table-column>
        <el-table-column prop="DelegateCount" align="center" label="分配人数"></el-table-column>
        <el-table-column prop="DelegateHangCount" align="center" label="需预约人数"></el-table-column>
        <el-table-column align="center" label="任务剩余时间">
          <template slot-scope="scope">
            <span v-if="scope.row.Status!=2">/</span>
            <span
              v-else-if="scope.row.DelegateRemainTime < 0"
              class="red"
            >超时{{scope.row.DelegateRemainTime | formatSecondsToDate(scope.row.DelegateRemainTime)}}</span>
            <span
              v-else
            >{{scope.row.DelegateRemainTime | formatSecondsToDate(scope.row.DelegateRemainTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openCustomer(scope.row)">拨打名单</el-button>
            <el-button type="text" @click="openRemark(scope.row)">委托备注</el-button>
            <el-button
              v-if="scope.row.Status==5"
              type="text"
              @click="openCommission(scope.row)"
            >提成情况</el-button>
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
      <!-- 提成弹出框 -->
      <el-dialog :title="`提成信息-${editForm.SellerName}`" :visible.sync="editVisible" width="633px">
        <el-form ref="editForm" :model="editForm" label-width="100px">
          <el-form-item label="合同总价(元):" prop="TotalPrice">
            <el-input v-model="editForm.TotalPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="已预约:" prop="ExportCount">
            <el-input v-model="editForm.ExportCount" disabled></el-input>
          </el-form-item>
          <el-form-item label="提成绩点(%):" prop="RoyaltyPoint">
            <el-input v-model="editForm.RoyaltyPoint" disabled></el-input>
          </el-form-item>
          <el-form-item label="提成金额(元):" prop="RoyaltyAmount">
            <el-input v-model="editForm.RoyaltyAmount" disabled></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <span v-if="editForm.RoyaltyPointIsBuild" style="text-align:left;">提点已计算</span>
          <span v-else class="red" style="text-align:left;">提点未计算</span>
          <el-button @click="editVisible = false" type="primary">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 备注弹出框 -->
      <el-dialog :title="`委托备注-${remarkForm.SellerName}`" :visible.sync="remarkVisible" width="40%">
        <el-form ref="remarkForm" :model="remarkForm" label-width="100px">
          <el-form-item label="主管活动备注:" prop="DirectorRemark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10}"
              v-model="remarkForm.DirectorRemark"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="商家备注:" prop="SellerRemark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10}"
              v-model="remarkForm.SellerRemark"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="remarkVisible = false" type="primary">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAccountDelegateList,
  getAccountDelegateRoyaltyDetails
} from "api/home.js";
export default {
  name: "basetable",
  data() {
    return {
      tableData: [],
      cur_page: 1,
      activity: "",
      name: "",
      pageCount: 0,
      pagesize: 30,
      editVisible: false,
      remarkVisible: false,
      status: 0,
      statusList: [
        { id: 0, name: "全部" },
        { id: 2, name: "委托中" },
        { id: 3, name: "委托暂停" },
        { id: 4, name: "委托停止" },
        { id: 5, name: "完成委托" },
        { id: 7, name: "被系统作废" }
      ],
      editForm: {
        SellerName: "",
        TotalPrice: "",
        ExportCount: "",
        RoyaltyPoint: "",
        RoyaltyAmount: "",
        RoyaltyPointIsBuild: false
      },
      remarkForm: {
        SellerName: "",
        SellerRemark: "",
        DirectorRemark: ""
      }
    };
  },
  created() {
    this._getDelegateList();
  },
  mounted() {
    setInterval(() => {
      for (let index in this.tableData) {
        this.tableData[index].DelegateRemainTime--;
      }
    }, 1000);
  },
  methods: {
    // 拨打名单
    openCustomer(item) {
      this.$router.push({
        path: `/customerlist/${item.Id}`,
        query: {
          DelegateId: item.DelegateId
        }
      });
    },
    // 委托备注
    openRemark(item) {
      this.remarkForm.SellerName = item.SellerName;
      this.remarkForm.SellerRemark = item.SellerRemark;
      this.remarkForm.DirectorRemark = item.DirectorRemark;
      this.remarkVisible = true;
    },
    // 提成情况
    openCommission(item) {
      this._getAccountDelegateRoyaltyDetails(item.Id).then(val => {
        this.editForm.SellerName = item.SellerName;
        this.editForm.TotalPrice = (this.editForm.TotalPrice * 1.0) / 100;
        this.editForm.RoyaltyPoint = (this.editForm.RoyaltyPoint * 1.0) / 100;
        this.editForm.RoyaltyAmount = (this.editForm.RoyaltyAmount * 1.0) / 100;
      });
      this.editVisible = true;
    },
    //分页导航尺寸更改
    handleSizeChange(val) {
      this.pagesize = val;
      this._getDelegateList();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this._getDelegateList();
    },

    search() {
      this.cur_page = 1;
      this._getDelegateList();
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return "申请委托中";
          break;
        case 2:
          return "委托中";
          break;
        case 3:
          return "暂停委托";
          break;
        case 4:
          return "停止委托";
          break;
        case 5:
          return "委托完成";
          break;
        case 6:
          return "委托失败";
          break;
        case 7:
          return "管理员作废";
          break;
        default:
          break;
      }
    },
    // 获取用户分配到的委托活动列表
    _getDelegateList() {
      const params = {
        SellerName: this.name,
        DelegateName: this.activity,
        Status: this.status,
        PageIndex: this.cur_page,
        PageCount: this.pagesize
      };
      return getAccountDelegateList(params).then(res => {
        this.tableData = res.List;
        this.pageCount = res.TotalCount;
      });
    },
    _getAccountDelegateRoyaltyDetails(Id) {
      const params = {
        Id: Id
      };
      return getAccountDelegateRoyaltyDetails(params).then(res => {
        this.editForm = res;
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
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
</style>