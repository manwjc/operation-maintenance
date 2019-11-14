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
          <el-table-column label="事件信息"
                           align="center">
            <el-table-column label="事件名称"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.eventName}}
              </template>
            </el-table-column>
            <el-table-column label="级别"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.eventLevel}}
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
                {{scope.row.dianpeiType}}
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
                             width="180">
              <template slot-scope="scope">
                {{scope.row.problemStartTime  | formatDate}}
              </template>
            </el-table-column>
            <el-table-column label="故障消除时间"
                             align="center"
                             width="180">
              <template slot-scope="scope">
                {{scope.row.problemEndTime  | formatDate}}
              </template>
            </el-table-column>
            <el-table-column label="故障处理时长"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problemLong}}
              </template>
            </el-table-column>
            <el-table-column label="故障处理次数"
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
  // name: '/resource/repairInfo',
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

    }
  },
  created () {
    this.loadingInfo.loading = true;
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
        method: 'POST',
        url: `/v1/cmdb/device/repair/list`,
        params: this.queryParams,
        data: this.queryParams
      }).then((res) => {
        this.loadingInfo.loading = false;
        this.total = res.totalSize;
        this.result = res.data;
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
