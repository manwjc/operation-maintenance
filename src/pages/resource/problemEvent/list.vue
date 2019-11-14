<template>
  <div class="components-container">
    <el-form class="yw-form">
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  height="calc(100vh - 230px)"
                  border
                  :data="result">
          <el-table-column label="序号"
                           align="center"
                           width="50">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column label="故障信息"
                           align="center">
            <el-table-column label="故障名称"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problemName}}
              </template>
            </el-table-column>
            <el-table-column label="故障等级"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problemLevel}}
              </template>
            </el-table-column>
            <el-table-column label="发生地市"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.city}}
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="厂家信息"
                           align="center">
            <el-table-column label="厂家"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.produce}}

              </template>
            </el-table-column>
            <el-table-column label="设备类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.deviceType}}
              </template>
            </el-table-column>
            <el-table-column label="设备型号"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.deviceModel}}
              </template>
            </el-table-column>
            <el-table-column label="典配类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.typicalType}}
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="统计信息"
                           align="center">
            <el-table-column label="维保归属"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.repaireBelong}}
              </template>
            </el-table-column>
            <el-table-column label="故障部件类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problemPartType}}
              </template>
            </el-table-column>
            <el-table-column label="故障开始时间"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.problemStartTime}}
              </template>
            </el-table-column>
            <el-table-column label="业务恢复时间"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.bizRegainTime}}
              </template>
            </el-table-column>
            <el-table-column label="故障消除时间"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.problemRemoveTime}}
              </template>
            </el-table-column>
            <el-table-column label="业务恢复时长"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.bizRegainLong}}
              </template>
            </el-table-column>
            <el-table-column label="故障处理时长"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problemHandleLong}}
              </template>
            </el-table-column>
            <el-table-column label="障处理次数"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problemHandleCount}}
              </template>
            </el-table-column>
            <el-table-column label="备件部件更换次数"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problemPartChangeCount}}
              </template>
            </el-table-column>
            <el-table-column label="故障报告及相关证明材料"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.reportDesc}}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </el-form>

    <!-- dialog -->

    <!-- dialog -->
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'

export default {
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
  },
  props: ['provinceObj', 'loadingInfo', 'quarter'],
  data () {
    return {

      //查询条件
      queryParams: {

      },
      //保存参数
      saveParams: [],
      // 查询结果
      result: [],

      isShowAdd: true

    }
  },
  mounted () {
    this.queryUser();
    this.query();
  },
  methods: {
    //设置查询参数
    setParams (activePagination) {

      if (activePagination) {
        this.queryParams['pageNum'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          "createUserPhone": '',
          "createUsername": '',
          "province": this.provinceObj.name,
          "quarter": this.quarter.year + this.quarter.quarter,
          "pageNum": this.initPageChange(),
          "pageSize": this.pageSize,
          'page': 'approve'
        }
      }
    },


    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {
      this.loadingInfo.loading = true;
      this.setParams(activePagination);
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/problemEvent/list`,
        params: this.queryParams
      }).then((res) => {
        this.loadingInfo.loading = false;
        this.total = res.count;
        this.result = res.data || [];
        if (this.result !== undefined && this.result !== null) {
          this.result.forEach(item => {
            if (item.status !== 0) {
              this.isShowAdd = false
            } else {
              this.isShowAdd = true
            }
            return
          })
        } else {
          this.isShowAdd = true
        }
        return res
      }).finally(() => {
        this.loadingInfo.loading = false;
      });
    }



  }
}
</script>

<style lang="scss" scoped>
</style>
