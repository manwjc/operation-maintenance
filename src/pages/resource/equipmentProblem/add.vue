<template>
  <div class="components-container">
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="add()"
                   :disabled="dataStatus !== undefined && disableStatus.indexOf(dataStatus) > -1">新增</el-button>
        <el-button type="text"
                   icon="el-icon-s-order"
                   @click="save()"
                   :disabled="dataStatus !== undefined && disableStatus.indexOf(dataStatus) > -1">保存</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importIn()"
                   :disabled="dataStatus !== undefined && disableStatus.indexOf(dataStatus) > -1">导入</el-button>

      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  height="calc(100vh - 310px)"
                  border
                  :data="result">

          <el-table-column label="序号"
                           align="center"
                           width="50">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column label="事件信息"
                           align="center">
            <el-table-column label="问题名称"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.problem_name"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="问题级别"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <YwSelect :SelectData="scope.row.problem_level"
                          :result="repeatLevelResult"
                          style="width: 100%"
                          @changeSelect="changeSelect({obj:scope.row,key:'problem_level'},arguments)"
                          type="event_level"></YwSelect>
              </template>
            </el-table-column>

            <el-table-column label="发生地市"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.city"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="厂家信息"
                           align="center">
            <el-table-column label="厂家"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <YwSelect :SelectData="scope.row.produce"
                          :result="repeatCompanyResult"
                          style="width: 100%"
                          @changeSelect="changeSelect({obj:scope.row,key:'produce'},arguments)"></YwSelect>
              </template>
            </el-table-column>
            <el-table-column label="设备类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <YwSelect :SelectData="scope.row.deviceType"
                          :result="repeatDeviceResult"
                          style="width: 100%"
                          @changeSelect="changeSelect({obj:scope.row,key:'deviceType'},arguments)"></YwSelect>
              </template>
            </el-table-column>
            <el-table-column label="设备名称"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.device_name"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="典配类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.config_type"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="统计信息"
                           align="center">

            <el-table-column label="故障发生时间"
                             align="center"
                             width="260">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.begin_date"
                                type="datetime"
                                placeholder="选择发生时间"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             align="center"
                             width="120">
              <template slot-scope="scope">

                <el-select v-model="scope.row.status"
                           placeholder="请选择"
                           class="list-sel"
                           style="width: 100px"
                           clearable>
                  <el-option label="OPEN"
                             value="OPEN"></el-option>
                  <el-option label="CLOSED"
                             value="CLOSED"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="解决时间"
                             align="center"
                             width="260">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.solve_date"
                                type="datetime"
                                placeholder="选择解决时间"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </template>
            </el-table-column>

            <el-table-column label="问题/需求"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.problem_demand"
                           placeholder="请选择"
                           class="list-sel"
                           style="width: 100px"
                           clearable>
                  <el-option label="问题"
                             value="问题"></el-option>
                  <el-option label="需求"
                             value="需求"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="问题提出人及电话"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.problem_person"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="问题报告"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.detail"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           align="center"
                           v-if="disableStatus.indexOf(statusInfo.status) < 0"
                           width="60">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           @click="del(scope.row,scope.$index)"
                           title="删除"
                           icon="el-icon-delete"></el-button>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
    </el-form>

    <!-- dialog -->
    <YwImport ref="importInstances"
              v-if="importData.isImport"
              :showImport="importData.isImport"
              :dataStart="importData.dataStart"
              :SelectProps="SelectProps"
              @setImportDisplay="setImportDisplay"
              :importType="importData.importType"></YwImport>
    <!-- dialog -->
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'

export default {
  mixins: [QueryObject],
  props: ['SelectProps', 'statusInfo', 'loadingInfo'],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    YwSelect: () => import('src/components/common/yw-select.vue'),
    YwImport: () => import('src/components/common/yw-import.vue')
  },
  data () {
    return {
      //查询条件
      queryParams: {

      },
      //保存参数
      saveParams: [],
      saveData: {},
      // 查询结果
      result: [],
      deleteIds: [],
      //循环下拉框
      repeatLevelResult: [], //级别
      repeatCompanyResult: [],//厂商
      repeatDeviceResult: [],//设备类型
      repeatBelongResult: [],//维保归属

      //导入
      importData: {
        isImport: false,
        importType: 'equipmentproblem',
        dataStart: 3
      },

      //数据状态
      disableStatus: ['-1', '1'],
      dataStatus: '',

    }
  },
  mounted () {
    this.querylevels();
    this.queryCompanys();
    this.queryDevices();
    this.queryBelong();
    this.query();
  },
  methods: {
    //设置查询参数
    setParams (activePagination) {

      if (activePagination) {

        this.queryParams['page_no'] = this.currentPage;
        this.queryParams['page_size'] = this.pageSize;
      } else {
        this.queryParams = {
          "mobile": this.SelectProps.mobile,
          "person": this.SelectProps.person,
          "province": this.SelectProps.province,
          "quarter": this.SelectProps.year + this.SelectProps.quarter,
          "page_no": this.initPageChange(),
          "page_size": this.pageSize,
        }
      }
    },

    //设置保存参数
    setSaveParams () {
      this.saveParams = Object.assign([], this.result);
      let SelectProps = this.SelectProps;
      this.saveParams.forEach((item, index, arr) => {

        //共有参数
        item.phone = SelectProps.mobile;
        item.person = SelectProps.person || SelectProps.person.name;
        item.province = SelectProps.province || SelectProps.province.name;
        item.quarter = SelectProps.year + SelectProps.quarter;
      });
    },

    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {
      this.setParams(activePagination);
      this.loadingInfo.loading = true;
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/assessment/seleteEquipmentProblemByPage`,
        data: this.queryParams
      }).then((res) => {
        this.loadingInfo.loading = false;
        this.total = res.count;
        this.result = res.result || [];
        this.judgeStatus();
        return res
      }).finally(() => {
        this.loadingInfo.loading = false;
      });
    },

    // 新增
    add () {
      this.result.unshift({
        //"id": "",
        "problem_name": "",
        "problem_level": "",
        "province": this.SelectProps.province ? this.SelectProps.province : '',
        "city": "",
        "produce": "",
        "deviceType": "",
        "device_name": "",
        "config_type": "",
        "begin_date": "",
        "status": "",
        "solve_date": "",
        "problem_demand": "",
        "detail": "",
        "person": this.SelectProps.person ? this.SelectProps.person : '',
        "mobile": this.SelectProps.mobile,
        "assess_status": "2",
        "quarter": this.SelectProps.year + this.SelectProps.quarter,
      })
      //this.total = Object.keys(this.result).length;
    },

    //删除-提示
    del (row, index) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.result.splice(index, 1);
        if (row.id) {
          this.deleteIds.push(row.id)
        }
        // this.delete(row)
      }).catch(() => {
      });
    },

    //删除-数据
    delete (row) {
      if (row.id != undefined && row.id != null && row.id != '') {
        var obj = {
          id: row.id
        }
        this.rbHttp.sendRequest({
          method: 'DELETE',
          url: `/v1/cmdb/assessment/deleteEquipmentProblem`,
          params: obj
        }).then((res) => {
          if (res === "success") {

            this.$message.success('删除成功！');
          } else {
            this.$message.success('删除失败，请联系管理员！');
          }
          this.query()

        });
      }
    },

    //保存
    save () {
      // this.judgeStatus();
      if (!this.SelectProps.province) {
        this.confirmMsg({ tip: '分支机构不能为空' });
        return false;
      }

      if (!this.SelectProps.person) {
        this.confirmMsg({ tip: '填报人不能为空' });
        return false;
      }

      this.setSaveParams();

      try {
        this.saveParams.forEach(item => {
          if (!item.problem_name || item.problem_name === '') {
            throw new Error("问题名称不能为空")
          }
          if (!item.problem_level || item.problem_level === '') {
            throw new Error("问题级别不能为空")
          }
          if (!item.city || item.city === '') {
            throw new Error("发生地市不能为空")
          }
          if (!item.produce || item.produce === '') {
            throw new Error("厂家不能为空")
          }
          if (!item.deviceType || item.deviceType === '') {
            throw new Error("设备类型不能为空")
          }
        })
      }catch (e) {
        this.confirmMsg({ tip: e });
        return false;
      }

      this.loadingInfo.loading = true
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/assessment/saveEquipmentProblemList`,
        data: { "deleteIds": this.deleteIds, "saveData": this.saveParams }
      }).then((res) => {
        this.loadingInfo.loading = false
        if (res === "success") {
          this.$message.success('保存成功！');
          this.query()
        } else {
          this.$message.success('保存失败，请联系管理员！');
        }

      }).finally(() => {
        this.loadingInfo.loading = false
      });
    },

    //导入
    importIn () {
      this.importData.isImport = true;
    },

    //导出
    exportOut () {

    },

    //查询下拉框-level(解决循环加载问题)
    querylevels () {
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/configDict/getDictsByType`,
        params: {
          'type': 'event_level'
        },
      }).then((res) => {
        this.repeatLevelResult = res;
        return res
      });

    },
    //查询下拉框-company(解决循环加载问题)
    queryCompanys () {
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/produce/list`,
        params: this.queryParams,
      }).then((res) => {
        this.repeatCompanyResult = res;
        return res
      });
    },
    //查询下拉框-deviceType(解决循环加载问题)
    queryDevices () {
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/type/list`,
        params: this.queryParams,
      }).then((res) => {
        this.repeatDeviceResult = res;
        return res
      });
    },
    //查询下拉框-belong(解决循环加载问题)
    queryBelong () {

      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/configDict/getDictsByType`,
        params: {
          'type': 'mainten_owner'
        },
      }).then((res) => {
        this.repeatBelongResult = res;
        return res
      });
    },

    //判断数据状态
    judgeStatus () {
      this.dataStatus = ''
      if (this.result.length > 0 ) {
        this.dataStatus = this.result[0].assess_status;
      }

    },

    //导入弹窗
    setImportDisplay (val) {
      this.importData.isImport = val;
      this.query()
    },

  }
}
</script>

<style lang="scss" scoped>
</style>
