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
            <el-table-column label="事件名称"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.eventName"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="级别"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <YwSelect :SelectData="scope.row.eventLevel"
                          :result="repeatLevelResult"
                          style="width: 100%"
                          @changeSelect="changeSelect({obj:scope.row,key:'eventLevel'},arguments)"
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
            <el-table-column label="设备型号"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.deviceModel"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="典配类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.dianpeiType"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="统计信息"
                           align="center">
            <el-table-column label="维保归属"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <YwSelect :SelectData="scope.row.repaireBelong"
                          :result="repeatBelongResult"
                          style="width: 100%"
                          @changeSelect="changeSelect({obj:scope.row,key:'repaireBelong'},arguments)"
                          type="mainten_owner"></YwSelect>
              </template>
            </el-table-column>
            <el-table-column label="故障部件类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.problemPartType"
                          placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="故障开始时间"
                             align="center"
                             width="260">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.problemStartTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="选择时间">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="故障消除时间"
                             align="center"
                             width="260">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.problemEndTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择时间">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="故障处理时长"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          v-model="scope.row.problemLong"
                          placeholder=""
                          disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column label="故障处理次数"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          :class="{'form-validate-tip':!validateNumber(scope.row.problemHandleCount)}"
                          v-model="scope.row.problemHandleCount"
                          placeholder=""></el-input>
                <div class="text-validate-tip"
                     v-if="!validateNumber(scope.row.problemHandleCount)">数字:0~999999</div>
              </template>
            </el-table-column>
            <el-table-column label="备件部件更换次数"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                <el-input class="edit-input"
                          :class="{'form-validate-tip':!validateNumber(scope.row.problemPartChangeCount)}"
                          v-model="scope.row.problemPartChangeCount"
                          placeholder=""></el-input>
                <div class="text-validate-tip"
                     v-if="!validateNumber(scope.row.problemPartChangeCount)">数字:0~999999</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           align="center"
                           width="60"
                           v-if="disableStatus.indexOf(statusInfo.status) < 0">
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
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
export default {
  // name: '/resource/repairInfo',
  props: ['SelectProps', 'statusInfo', 'loadingInfo'],
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    YwSelect: () => import('src/components/common/yw-select.vue'),
    YwImport: () => import('src/components/common/yw-import.vue'),
  },
  computed: {
    validateNumber () {
      return (val) => {
        let validate = !val || (/^\d+$/.test(val) && Number(val) < 1000000);
        return validate;
      }
    }

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
        importType: 'repairevent',
        dataStart: 3
      },

      //数据状态
      disableStatus: [-1, 1],
      dataStatus: '',
      //校验结果
      validatePass: true,

    }
  },
  created () {
    this.querylevels();
    this.queryCompanys();
    this.queryDevices();
    this.queryBelong();
    this.query();
  },
  methods: {
    //数字校验
    validate (val) {
      let pass = !val || (/^\d+$/.test(val) && Number(val) < 1000000);
      return pass;
    },

    //设置查询参数
    setParams (activePagination) {
      if (activePagination) {
        this.queryParams['pageNum'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          "createUserPhone": this.SelectProps.mobile ? this.SelectProps.mobile : '',
          "createUsername": this.SelectProps.person ? this.SelectProps.person : '',
          "province": this.SelectProps.province ? this.SelectProps.province : '',
          "quarter": this.SelectProps.year && this.SelectProps.quarter ? this.SelectProps.year + this.SelectProps.quarter : '',
          "pageNum": this.initPageChange(),
          "pageSize": this.pageSize,
        }
      }
    },

    //设置保存参数
    setSaveParams () {
      this.saveParams = Object.assign([], this.result);
      let SelectProps = this.SelectProps;
      this.saveParams.forEach((item, index, arr) => {

        //共有参数
        item.createUserPhone = SelectProps.mobile;
        item.createUsername = SelectProps.person;
        item.province = SelectProps.province;
        item.quarter = SelectProps.year + SelectProps.quarter
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
        url: `/v1/cmdb/device/repair/list?pageNum=${this.queryParams.pageNum}&pageSize=${this.queryParams.pageSize}`,
        data: this.queryParams
      }).then((res) => {
        this.loading = false;
        this.total = res.totalSize;
        this.result = res.data;
        this.result.forEach(item => {
          item.problemStartTime = formatDate(item.problemStartTime)
          item.problemEndTime = formatDate(item.problemEndTime)
        })
        this.judgeStatus();
        this.loadingInfo.loading = false;
        return res
      }).finally(() => {
        this.loadingInfo.loading = false;
      });

    },

    // 新增
    add () {
      this.result.unshift({})
      // this.result.unshift({
      //   //"id": "10e7f667a2874d3eada8546edd96657a",
      //   "eventName": "",
      //   "eventLevel": "",
      //   "province": "",
      //   "city": "",
      //   "produce": "",
      //   "deviceType": "",
      //   "deviceModel": "",
      //   "dianpeiType": "",
      //   "repaireBelong": "",
      //   "problemPartType": "",
      //   // "problemStartTime": "",
      //   // "problemEndTime": "",
      //   "problemLong": "",
      //   "problemHandleCount": 0,
      //   "problemPartChangeCount": 0,
      //   "createUsername": "",
      //   "createUserPhone": "",
      //   "status": ""
      // })

      //this.total = Object.keys(this.result).length;
    },

    //删除-提示
    del (row, index) {
      if (!row.id) {
        this.result.splice(index, 1);
      } else {
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteIds.push(row.id)
          this.result.splice(index, 1);
          // this.delete(row)
        }).catch(() => {
        });
      }
      //this.total = Object.keys(this.result).length;
    },

    //删除-数据
    delete (row) {
      this.rbHttp.sendRequest({
        method: 'DELETE',
        url: `/v1/cmdb/device/repair/delete/${row.id}`,
        // params: {
        //   id: row.id
        // }
      }).then((res) => {
        if (res.success) {
          this.query();
          this.$message.success('删除成功！');
        } else {
          this.$message.error(res.message);
        }

        return res
      });
    },

    //保存
    save () {
      this.judgeStatus();

      if (!this.SelectProps.province) {
        this.confirmMsg({ tip: '分支机构不能为空' });
        return false;
      }

      if (!this.SelectProps.person) {
        this.confirmMsg({ tip: '填报人不能为空' });
        return false;
      }

      if (!this.SelectProps.year) {
        this.confirmMsg({ tip: '年份不能为空' });
        return false;
      }

      if (!this.SelectProps.quarter) {
        this.confirmMsg({ tip: '季度不能为空' });
        return false;
      }

      if (!this.validatePass) {
        this.confirmMsg({ tip: '录入内容格式错误' });
        return false;
      }
      this.setSaveParams();
      try {
        this.saveParams.forEach(item => {
          if (!item.deviceType || item.deviceType.trim() === '') {
            throw new Error("设备类型不能不空")
          }
        })
      }catch (e) {
        this.confirmMsg({ tip: '设备类型不能不空' });
        return false;
      }
      this.loadingInfo.loading = true
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/device/repair/save`,
        data: { deleteIds: this.deleteIds, saveData: this.saveParams },
      }).then((res) => {
        this.loadingInfo.loading = false
        if (res.success) {
          this.query();
          this.$message.success('保存成功！');
        } else {
          this.$message.error(res.message);
        }
        return res
      }).catch(() => {
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
      if (this.result.length >0 ) {
        this.dataStatus = this.result[0].status;
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
