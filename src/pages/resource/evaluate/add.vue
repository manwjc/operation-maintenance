<template>
  <div class="components-container">
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
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
        <el-table class="yw-el-table evaluate-table"
                  height="calc(100vh - 280px)"
                  border
                  :data="pageData">
          <el-table-column label="序号"
                           align="center"
                           width="50">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <!-- 厂家 -->
          <el-table-column align="center"
                           fixed="left"
                           width="130"
                           label-class-name="yw-table-slash-wrap">
            <template slot="header"
                      slot-scope="scope">
              <span class="yw-table-slash-up">设备类型</span>
              <span class="yw-table-slash-down">厂家名称</span>
              <span class="split"></span>

            </template>
            <template slot-scope="scope">
              {{Object.keys(scope.row)[0]}}
            </template>
          </el-table-column>
          <!-- 厂家 -->

          <el-table-column v-for="(firstTitle,firstIndex) in tableTitle"
                           :key="firstIndex"
                           :label="firstTitle.name"
                           align="center"
                           width="130">
            <!-- 一级标题 #F5F7FA -->
            <template slot-scope="scope">
              <div class="table-link"
                   :class="{score: sumScores[scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].id]}"
                   @click="evaluate(scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id],new Date())">

                {{scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].count}}
                <span v-if="sumScores[scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].id]">({{sumScores[scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].id]}}分)</span>
              </div>

            </template>
            <!-- 一级标题 -->

            二级标题
            <!--<template v-if="firstTitle.child.length > 1">-->
            <!--<el-table-column style="line-height: 0"></el-table-column>-->
            <!--<el-table-column v-for="(secondTitle,secondIndex) in firstTitle.child"-->
            <!--:key="secondIndex"-->
            <!--:label="secondTitle.name"-->
            <!--align="center"-->
            <!--width="80">-->
            <!--<template slot-scope="scope">-->
            <!--<div class="table-link"-->
            <!--:class="{score: sumScores[scope.row[Object.keys(scope.row)[0]][secondTitle.id].id]}"-->
            <!--@click="evaluate(scope.row[Object.keys(scope.row)[0]][secondTitle.id],new Date())">-->
            <!--{{scope.row[Object.keys(scope.row)[0]][secondTitle.id].count}}-->
            <!--<span v-if="sumScores[scope.row[Object.keys(scope.row)[0]][secondTitle.id].id]">({{sumScores[scope.row[Object.keys(scope.row)[0]][secondTitle.id].id]}}分)</span>-->
            <!--</div>-->

            <!--</template>-->
            <!--</el-table-column>-->
            <!--</template>-->
            <!-- 二级标题 -->
          </el-table-column>
        </el-table>
      </div>
      <!--<YwPagination @handleSizeChange="handleSizeChange"-->
                    <!--@handleCurrentChange="handleCurrentChange"-->
                    <!--:current-page="currentPage"-->
                    <!--:page-sizes="pageSizes"-->
                    <!--:page-size="pageSize"-->
                    <!--:total="total"></YwPagination>-->
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

    <!-- dialog -->
    <DialogEvaluate v-if="dialogMsg.dialogVisible"
                    :dialogMsg="dialogMsg"
                    :sumScores="sumScores"
                    @closeDialog="closeDialog"></DialogEvaluate>
    <!-- dialog -->
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'

export default {
  // name: '/resource/deviceInfo',
  props: ['SelectProps', 'statusInfo', 'loadingInfo'],
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    DialogEvaluate: () => import('../evaluate/dialog-evaluate.vue'),
    YwImport: () => import('src/components/common/yw-import.vue')
  },
  data () {
    return {

      loading: false,
      //查询条件
      queryParams: {

      },
      // 查询结果
      result: [],
      // 界面数据
      pageData: [],

      //表头标题
      tableTitle: [],

      //循环下拉框-厂商
      repeatCompanyResult: [],
      companyNameList: [],

      //dialog
      dialogMsg: {
        id: '',//每个弹窗数据的唯一标识
        dialogVisible: false,
        data: {} //数据(暂时没有详情接口，从列表数据携带)
      },
      sumScores: {},

      //数据状态
      disableStatus: [-1, 1],
      dataStatus: '',

      //导入
      importData: {
        isImport: false,
        importType: 'evaluate',
        dataStart: 1
      },

    }
  },
  computed: {
    titleColumns () {
      let temp = JSON.parse(JSON.stringify(this.tableTitle));
      let title = {
        // first: [],//标题第一行
        // second: [],// 标题第二行
        total: [],//数据对应的列
      };
      let arr = [];
      temp.forEach((item, index) => {
        // if (item.child && item.child.length > 1) {
        //   title.second = item.child.concat(title.second);
        // } else {
        //   title.first.push(item);
        // }

        if (item.child && item.child.length > 0) {
          title.total = title.total.concat(item.child);
        } else {
          title.total.push(item);
        }

      })
      return title;
    }
  },

  mounted () {
    this.init();
  },

  methods: {
//导入弹窗
    setImportDisplay (val) {
      this.importData.isImport = val;
      this.query();
    },

    //导入
    importIn () {
      this.importData.isImport = true;
    },// 处理返回数据到界面数据
    resolvePageData () {
      this.dataStatus = ''
      this.result.forEach(item => {
        this.dataStatus = item.status
        this.pageData.forEach(data => {
          if (Object.keys(data)[0] === item.produce) {
            data[item.produce][item.deviceTypeId] = item
          }
        })
      })
    },    //初始化
    async init () {
      this.tableTitle = []
      this.companyNameList = []
      this.pageData = []
      await this.queryTableTitle();
      this.queryCompanys();
      this.query();
    },

    //设置参数
    setParams (activePagination) {
      if (activePagination) {
        this.queryParams['pageNum'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          "createUserPhone": this.SelectProps.mobile,
          "createUsername": this.SelectProps.person ? this.SelectProps.person : '',
          "province": this.SelectProps.province ? this.SelectProps.province : '',
          "pageNum": this.initPageChange(),
          "pageSize": this.pageSize,
          "quarter": this.SelectProps.year + this.SelectProps.quarter,
          "page": "evaluate"
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
        url: `/v1/cmdb/device/count/list`,
        params: this.queryParams,
        data: this.queryParams
      }).then((res) => {
        this.total = res.total;
        this.result = res.data || [];
        this.resolvePageData()
        this.resolveResult();
        this.judgeStatus();

        return res
      }).finally(() => {
        this.loadingInfo.loading = false;
      });

    },

    //查询表头
    queryTableTitle () {
      return this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/type/list`,
        params: {},
      }).then((res) => {
        this.tableTitle = res;
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
        this.companyNameList = _.map(this.repeatCompanyResult, 'name');
        this.initData()
        return res;
      });
    },
    //初始化界面数据
    initData() {
      this.companyNameList.forEach(item => {
        let temp = {}
        this.$set(temp, item, {})
        this.tableTitle.forEach(title => {
          if (title.child.length > 1) {
            temp[item][title.child[0].id] = {}
            temp[item][title.child[1].id] = {}
          } else {
            temp[item][title.child[0].id] = {}
          }
        })
        this.pageData.push(temp)
      })
    },

    //评估
    evaluate (row, id) {
      if (!row.count) {
        return
      }
      if (this.dataStatus && (this.dataStatus === 1 || this.dataStatus === -1)) {
        return
      }
      if (!row) {
        return
      }
      this.dialogMsg.dialogVisible = true;
      this.dialogMsg.id = id;
      this.dialogMsg.data = row;
    },

    //关闭弹窗
    closeDialog (type) {
      this.dialogMsg.dialogVisible = false;
      if (type === 'update') {
        this.query();
      }

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
        let flag = false
        this.pageData.forEach(item => {
          for(let i in item ) {
            for(let j in item[i] ) {
              if (item[i][j].produceAssessment) {
                flag = true
              }
            }
          }

        })
        if (flag === false) {
          this.confirmMsg({ tip: '没有要保存的评分' });
          return false;
        }

      this.loadingInfo.loading = true
      let deviceCounts = []
      this.pageData.forEach(item => {
        let count = item[Object.keys(item)[0]]
        for (let key in count) {
          if (count[key].id) {
            deviceCounts.push(count[key])
          } else {
            if (count[key].count && count[key].count.trim() !== '') {
              deviceCounts.push(count[key])
            }
          }
        }
      })
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/assessment/assessment/save`,
        data: {
          'deviceCounts': deviceCounts
        }
      }).then((res) => {
        if (res.success) {
          this.query();
          this.loadingInfo.loading = false
          this.$message.success('保存成功！');
        } else {
          this.$message.error(res.message);
        }

        return res
      }).finally(() => {
        this.loadingInfo.loading = false
      });
    },

    //数据处理
    resolveResult (type) {

      let temp = {};
      let newKeyObj = {};
      this.titleColumns.total.forEach((item, index, attr) => {
        temp[item.id] = {
          "produce": "",
          "deviceTypeId": item.id,
          "count": "",
          "status": "",
          "createTime": ''
        };
      })

      switch (type) {
        case 'add': //新增
          this.result.unshift({ '': JSON.parse(JSON.stringify(temp)) });

          break;

        default: //厂商对应数据为空时
          this.result.forEach((item, index) => {
            let itemKey = Object.keys(item)[0];
            if (Object.keys(item[itemKey]).length < 1) {
              item[itemKey] = JSON.parse(JSON.stringify(temp));
            }
          });

          break;
      }

    },

    //判断数据状态
    judgeStatus () {
      // this.dataStatus = ''
      this.pageData.forEach((item, index) => {
        let key = Object.keys(item)[0];
        for (let i in item[key]) {
          // //数据状态
          // this.dataStatus = item[key][i].status;
          //评分
          if (item[key][i].produceAssessment) {
            let sum = 0
            item[key][i].produceAssessment.forEach(item => {
              sum += item.score
            })
            this.$set(this.sumScores, item[key][i].id, sum)
          }
        }
      })

    },


  }
}
</script>

<style lang="scss" scoped>
/deep/ .evaluate-table.el-table {
  td {
    padding: 0;
    .cell {
      padding: 0;
    }
  }
  .score {
    &.table-link {
      background: green;
      color: #fff;
    }
  }
}

/deep/.el-table--border th,
.el-table__fixed-right-patch {
  line-height: 68px;
  background: #f5f7fa;
}
</style>
