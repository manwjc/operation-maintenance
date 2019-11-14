<template>
  <div v-loading="loading">
    <el-form class="yw-form" >
      <el-form class="components-condition yw-form"
               :inline="true"
               label-width="100px"
               v-model="queryForm">
        <el-form-item label="配置CI名称">
          <el-input v-model="queryForm.codeFiledName"></el-input>
        </el-form-item>
        <el-form-item label="变更方式">
          <el-select v-model="queryForm.operaterType"
                     clearable
                     placeholder="请选择">
            <el-option v-for="(item,index) in operaterTypeList"
                       :key="index"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker v-model="queryForm.date"
                          type="datetimerange"
                          align="right"
                          :default-time="['00:00:00', '23:59:59']"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <!--<el-date-picker v-model="queryForm.endDate"-->
                          <!--type="datetime"-->
                          <!--format="yyyy-MM-dd HH:mm:ss"-->
                          <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                          <!--placeholder="选择时间"-->
                          <!--:picker-options="endMonthOption">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <section class="btn-wrap">
          <el-button type="primary"
                     @click="getApprovalList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </section>
      </el-form>
      <el-form class="yw-form">
        <!--<div class="table-operate-wrap clearfix">-->
          <!--<el-button type="text"-->
                     <!--icon="el-icon-plus"-->
                     <!--@click="">新增</el-button>-->
          <!--<el-button type="text"-->
                     <!--icon="el-icon-download"-->
                     <!--@click="importInstance()">导入</el-button>-->
        <!--</div>-->
        <div class="yw-el-table-wrap">
          <el-table :data="tableData"
                    class="yw-el-table"
                    stripe
                    tooltip-effect="dark"
                    border
                    height="calc(100vh - 302px)">
            <el-table-column label="管理IP地址" prop="instance.ip" min-width="100"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="配置CI名称" prop="code.filedName"
                             min-width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="配置项原值" prop="oldValue" min-width="150"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="配置项新值" prop="currValue" min-width="150"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="变更方式" prop="operaterType" min-width="80"
                             :show-overflow-tooltip="true"></el-table-column>
            <!--<el-table-column label="审核状态" prop="approvalStatus" min-width="150"-->
                             <!--:show-overflow-tooltip="true">-->
              <!--<template slot-scope="scope">{{scope.row.approvalStatus === 1 ? '审核通过' : '审核驳回'}}</template>-->
            <!--</el-table-column>-->
            <el-table-column label="提交时间" prop="operatorTime" min-width="120"
                             :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.operatorTime | formatDate}}
              </template>
            </el-table-column>
            <el-table-column label="提交人"
                             prop="operator"
                             min-width="80"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <!--<el-table-column label="操作" prop="safety_number" width="80" fixed="right">-->
              <!--<template slot-scope="scope">-->
                <!--<div class="yw-table-operator">-->
                  <!--<el-button type="text" title="通过" icon="el-icon-circle-check" @click="audit(scope.row)"></el-button>-->
                  <!--<el-button type="text" title="驳回" icon="el-icon-circle-close" @click="refuse(scope.row)"></el-button>-->
                <!--</div>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
      </el-form>
      <div class="yw-page-wrap">
        <YwPagination @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizes"
                      :page-size="pageSize"
                      :total="total">
        </YwPagination>
      </div>
    </el-form>
  </div>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  export default {
    components: {
      YwPagination: () => import('src/components/common/yw-pagination.vue')
    },
    data () {
      return {
        queryForm: {},
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [10, 20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        instanceId: this.$route.query.instanceId,
        loading: false,
        tableData: [],
        operaterTypeList: [
          {
            name: '自动采集'
          },
          {
            name: '手动更新'
          },
          {
            name: '苏研数据'
          }
        ],
      }
    },
    mounted () {
      this.getApprovalList();
    },
    methods: {
      // 重置查询条件
      resetForm () {
        this.queryForm = {}
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.getApprovalList()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.getApprovalList()
      },
      getApprovalList() {
        this.loading = true
        let data = {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'instanceId': this.instanceId,
          'codeFiledName': this.queryForm.codeFiledName,
          'operaterType': this.queryForm.operaterType,
          "startTime": this.queryForm.date ? this.queryForm.date[0] : undefined,
          "endTime":  this.queryForm.date ? this.queryForm.date[1] : undefined,
          "type": 'detail',
          "approvalStatus": "1"
        }
        rbCmdbServiceFactory.getApprovalList(data).then((res) => {
          this.loading = false
          if (res) {
            this.tableData = res.data
            this.total = res.count
          }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
