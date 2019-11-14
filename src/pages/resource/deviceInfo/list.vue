<template>
  <div class="components-container">

    <el-form class="yw-form">
      <!-- <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="add()"
                   :disabled="dataStatus !== undefined && disableStatus.indexOf(dataStatus) > -1">新增</el-button>

        <el-button type="text"
                   icon="el-icon-s-order"
                   @click="save()"
                   :disabled="dataStatus !== undefined && disableStatus.indexOf(dataStatus) > -1">保存</el-button>
      </div> -->
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table evaluate-table"
                  height="calc(100vh - 230px)"
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
            <!--<template slot-scope="scope">-->
              <!--{{Object.keys(scope.row)[0]}}-->
            <!--</template>-->
            <template slot-scope="scope">
              <!-- 已存在厂家 -->
              <span v-if="companyNameList.indexOf(Object.keys(scope.row)[0]) > -1">
                {{Object.keys(scope.row)[0]}}
              </span>
              <!-- 已存在厂家 -->
            </template>
          </el-table-column>
          <!-- 厂家 -->

          <el-table-column v-for="(firstTitle,firstIndex) in tableTitle"
                           :key="firstIndex"
                           :label="firstTitle.name"
                           align="center"
                           width="130">
            <!-- 一级标题 -->
            <template slot-scope="scope"
                      v-if="firstTitle.child.length < 2">
              <div class="table-link"
                   :class="{score: sumScores[scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].id]}"
                   @click="evaluate(scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id],new Date())">

                {{scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].count}}
                <span v-if="sumScores[scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].id]">({{sumScores[scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].id]}}分)</span>
              </div>

            </template>
            <!-- 一级标题 -->

            <!-- 二级标题 -->
            <template v-if="firstTitle.child.length > 1">
              <el-table-column v-for="(secondTitle,secondIndex) in firstTitle.child"
                               :key="secondIndex"
                               :label="secondTitle.name"
                               align="center"
                               width="80">
                <template slot-scope="scope">
                  <div class="table-link"
                       :class="{score: sumScores[scope.row[Object.keys(scope.row)[0]][secondTitle.id].id]}"
                       @click="evaluate(scope.row[Object.keys(scope.row)[0]][secondTitle.id],new Date())">
                    {{scope.row[Object.keys(scope.row)[0]][secondTitle.id].count}}
                    <span v-if="sumScores[scope.row[Object.keys(scope.row)[0]][secondTitle.id].id]">({{sumScores[scope.row[Object.keys(scope.row)[0]][secondTitle.id].id]}}分)</span>
                  </div>

                </template>
              </el-table-column>
            </template>
            <!-- 二级标题 -->
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
  // name: '/resource/deviceInfo',
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
      //界面数据
      pageData: [],
      // 查询结果
      result: [],

      //表头标题
      tableTitle: [],

      //评分
      sumScores: {},
      repeatCompanyResult: [],
      companyNameList: []
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
    //初始化
    async init () {
      this.loadingInfo.loading = true;
      await this.queryTableTitle();
      this.queryCompanys();
      this.query();
    },
    //查询company
    queryCompanys () {
      this.repeatCompanyResult = []
      this.companyNameList = []
      let that = this
      this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/produce/list`,
        params: this.queryParams,
      }).then((res) => {
        that.repeatCompanyResult = res;
        that.companyNameList = _.map(that.repeatCompanyResult, 'name');
        that.initData()
      });
    },
    // 处理返回数据到界面数据
    resolvePageData () {
      this.result.forEach(item => {
        this.pageData.forEach(data => {
          if (Object.keys(data)[0] === item.produce) {
            data[item.produce][item.deviceTypeId] = item
          }
        })
      })
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
    //设置参数
    setParams (activePagination) {
      if (activePagination) {
        this.queryParams['pageNum'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          "createUserPhone": '',
          "createUsername": '',
          "province": this.provinceObj.name,
          "pageNum": this.initPageChange(),
          "pageSize": this.pageSize,
          "quarter": this.quarter.year + this.quarter.quarter,
          'page': 'approve'
        }
      }

    },

    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {
      this.loadingInfo.loading = true;
      this.total = 0;
      this.result = []
      this.pageData = []
      this.setParams(activePagination);
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/device/count/list`,
        params: this.queryParams,
      }).then((res) => {
        this.total = res.total;
        this.result = res.data;
        if (res.data === null) {
          this.result = []
        }
        this.resolvePageData()
        this.resolveResult();
        this.judgeStatus();
        this.loadingInfo.loading = false;
      }).finally(() => {
        this.loadingInfo.loading = false;
      });

    },

    //查询表头
    queryTableTitle () {
      this.tableTitle = []
      return this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/type/list`,
        params: {},
      }).then((res) => {
        this.tableTitle = res;
        return res
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
          if (this.result !== null) {
            this.result.forEach((item, index) => {
              let itemKey = Object.keys(item)[0];
              if (Object.keys(item[itemKey]).length < 1) {
                item[itemKey] = JSON.parse(JSON.stringify(temp));
              }
            });
          }


          break;
      }

    },

    //判断数据状态
    judgeStatus () {
      this.result.forEach((item, index) => {
        let key = Object.keys(item)[0];
        for (let i in item[key]) {
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
</style>
