<template>
  <div class="components-container">
    <el-form class="yw-form"
             :inline="true">

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
            <el-table-column label="问题名称"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problem_name}}
              </template>
            </el-table-column>
            <el-table-column label="问题等级"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.problem_level}}
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
            <el-table-column label="设备名称"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.device_name}}
              </template>
            </el-table-column>
            <el-table-column label="典配类型"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.config_type}}
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="统计信息"
                           align="center">

            <el-table-column label="发生时间"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.begin_date}}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.status}}
              </template>
            </el-table-column>

            <el-table-column label="解决时间"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.solve_date}}
              </template>
            </el-table-column>
            <el-table-column label="问题/需求"
                             align="center"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.problem_demand}}
              </template>
            </el-table-column>
            <el-table-column label="问题报告"
                             align="center"
                             width="120">
              <template slot-scope="scope">
                {{scope.row.detail}}
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
  props: ['provinceObj', 'loadingInfo','quarter'],
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
        this.queryParams['page_no'] = this.currentPage;
        this.queryParams['page_size'] = this.pageSize;
      } else {
        this.queryParams = {
          "createUserPhone": '',
          "createUsername": '',
          "province": this.provinceObj.name,
          "page_no": this.initPageChange(),
          "page_size": this.pageSize,
          "quarter": this.quarter.year + this.quarter.quarter,
          'page': 'approve'
        }
      }
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
        this.total = res.count;
        this.result = res.result;
        if (this.result !== undefined && this.result !== null) {
          this.result.forEach(item => {
            if (item.status === 1) {
              this.isShowAdd = false
            } else {
              this.isShowAdd = true
            }
            return
          })
        } else {
          this.isShowAdd = true
        }
        this.loadingInfo.loading = false;
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
