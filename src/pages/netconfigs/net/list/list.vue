<template>
  <div class="components-container yw-dashboard">
    <!-- 查询条件 -->
    <el-form class="yw-form components-condition"
             label-width="55px"
             :inline="true"
             :model="formData">
      <el-form-item label="设备IP">
        <el-input v-model="formData.ip"
                  placeholder="设备IP"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="formData.date"
                        type="datetimerange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="开始时间"
                        :picker-options="pickerOptions24">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="资源池">
        <YwSelectResource :pool="pool"
                          @changePool="changePool"
                          @cleanPool="cleanPool"></YwSelectResource>
      </el-form-item>
      <el-form-item label="关键字">
        <YwInputAdd :keys="keys"
                    :activeKey="activeKey"
                    @changeKey="changeKey"></YwInputAdd>
      </el-form-item>
      <div class="btn-wrap">
        <el-button type="primary"
                   @click="query()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-form>
    <!-- 查询条件 -->

    <!-- 查询结果 -->
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-upload2"
                   @click="exportOut">导出</el-button>
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-s-order"
                   @click="compare(new Date())">内容比对</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  :data="result"
                  height="calc(100vh - 310px)"
                  v-loading="loading"
                  stripe
                  border
                  @selection-change="changeCheckbox">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="资源池"
                           width="160">
            <template slot-scope="scope">
              {{ scope.row.pool_name }}
            </template>
          </el-table-column>
          <el-table-column label="设备IP"
                           prop="ip"
                           sortable
                           width="140">
            <template slot-scope="scope">
              {{ scope.row.ip }}
            </template>
          </el-table-column>
          <el-table-column label="采集时间"
                           prop="log_create_time"
                           sortable
                           width="160">
            <template slot-scope="scope">
              {{ scope.row.log_create_time | formatDate}}
            </template>
          </el-table-column>

          <el-table-column label="采集内容">
            <template slot-scope="scope">
              <!-- <el-tooltip placement="top">
                <div slot="content">{{ scope.row.massage }}</div>
                <span class="text-ellipse space-pre"
                      :title="scope.row.massage">{{ scope.row.massage }}</span>
              </el-tooltip> -->
              <span class="line-2">{{ scope.row.massage }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作"
                           width="140">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           @click="getDetails(scope.row,new Date())"
                           title="详情"
                           icon="el-icon-tickets"></el-button>
                <el-button type="text"
                           @click="download(scope.row)"
                           title="下载"
                           icon="el-icon-download"></el-button>
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
    <!-- 查询条件 -->

    <!-- dialog -->
    <DialogSettingDetails :dialogMsg="dialogDetails"></DialogSettingDetails>
    <YwCompare v-if="showCompare"
               :resultSelected="resultSelected"
               @changeCompare="changeCompare"></YwCompare>
    <!-- dialog -->
  </div>

</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'

export default {
  name: '/netconfigs/net/list',
  mixins: [QueryObject],
  components: {
    YwInputAdd: () => import('src/components/common/yw-input-add.vue'),
    YwSelectResource: () => import('src/components/common/yw-select-resource.vue'),
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    // DialogDetails: () => import('../dialog-details.vue'),
    DialogSettingDetails: () => import('../dialog-setting-details.vue'),
    YwCompare: () => import('../compare/compare.vue'),

  },
  data () {
    return {
      // 表单数据
      formData: {
        ip: '',
        date: ''
      },
      //查询条件
      queryParams: {

      },
      // 查询结果
      result: [],
      //选中项
      resultSelected: [],
      //dialog
      dialogDetails: {
        id: '',//每个弹窗数据的唯一标识
        dialogVisible: false,
        data: {} //数据(暂时没有详情接口，从列表数据携带)
      },
      showCompare: false
    }
  },
  created () {
    this.initDate();
    this.query()
  },
  methods: {
    //初始化
    initDate () {
      let now = new Date();
      let before = now.getTime() - 1000 * 60 * 60 * 24;
      this.formData.date = [before, now]
    },

    //设置参数
    setParams (activePagination) {

      if (activePagination) {
        this.queryParams['page_no'] = this.currentPage;
        this.queryParams['page_size'] = this.pageSize;
      } else {
        this.initPageChange(this.staticCurrentPage, this.staticPageSize);

        this.queryParams = {
          'create_time_end': formatDate(this.formData.date && this.formData.date[1]),
          'create_time_start': formatDate(this.formData.date && this.formData.date[0]),
          'ip': this.formData.ip,
          'pool': this.pool,
          'page_no': this.initPageChange(),
          'page_size': this.pageSize,
          'params': this.keys
        }
      }

    },

    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {
      this.loading = true;

      this.setParams(activePagination);

      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/config/getConfigData`,
        data: this.queryParams
      }).then((res) => {
        this.total = res.count;
        this.result = res.result;
        return res
      }).catch((res) => {
        this.$message.error(res.statusText);
      }).finally(() => {
        this.loading = false;
      });
    },

    // 详情
    getDetails (row, id) {
      this.dialogDetails.dialogVisible = true;
      this.dialogDetails.id = id;
      // this.dialogDetails.data = row;
      this.rbHttp.sendRequest({
        method: 'GET',
        // data: this.queryParams,
        // binary: true,
        url: `/v1/config/getConfigById/${row.index}/${row.id}`
      }).then((res) => {
        this.dialogDetails.data = res
      });
    },

    //重置
    reset () {
      this.formData = {
        ip: '',
        date: '',
      };
      this.cleanKey();
      this.cleanPool();
    },

    //导出
    exportOut () {
      this.rbHttp.sendRequest({
        method: 'POST',
        data: this.queryParams,
        binary: true,
        url: '/v1/config/exportConfigData'
      }).then((res) => {
        this.exportFiles({
          data: res,
          fileType: 'application/vnd.ms-excel',
          fileName: '配置文件列表.xls'
        });
        return res
      });
    },

    //下载
    download (val) {
      this.rbHttp.sendRequest({
        method: 'GET',
        // binary: true,
        url: `/v1/config/getConfigById/${val.index}/${val.id}`
      }).then((res) => {
        this.exportFiles({
          // data: JSON.stringify(val, null, '\r\n'),
          data: res.massage,
          fileType: 'text/plain;charset=utf-8',
          fileName: '配置信息.txt'
        });
        return res
      });

      // this.exportFiles({
      //   // data: JSON.stringify(val, null, '\r\n'),
      //   data: val.massage,
      //   fileType: 'text/plain;charset=utf-8',
      //   fileName: '配置信息.txt'
      // });
    },

    //比对
    compare (id) {
      if (!this.resultSelected || this.resultSelected.length != 2) {
        this.$confirm('请选择两条数据对比?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {
        });
        return false;
      }
      this.showCompare = true;
      //this.$router.push({ path: '/netconfigs/net/compare', query: { resultSelected: this.resultSelected } })
      //this.$router.push({ path: 'compare', query: { resultSelected: this.resultSelected } })
    },

    //checkbox
    changeCheckbox (val) {
      this.resultSelected = val;
    },

    //changeCompare
    changeCompare (val) {
      this.showCompare = val;
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
