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
                  height="calc(100vh - 280px)"
                  border
                  :data="pageData"
                  style="width: 100%">
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
              <!-- 新增厂家 -->
              <input class="edit-input"
                     v-if="companyNameList.indexOf(Object.keys(scope.row)[0]) < 0"
                     type="text"
                     v-model="allCompanyList[scope.$index]"
                     placeholder=""
                     @blur="blurProduce(scope.row,allCompanyList[scope.$index],scope.$index)" />
              <!-- 新增厂家 -->
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
              <!--<div v-if="scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id]">-->
                <!--<el-input class="edit-input"-->
                          <!--:class="{'form-validate-tip':!validateNumber(scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].count)}"-->
                          <!--v-model="scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].count"-->
                          <!--placeholder=""></el-input>-->
                <!--<div class="text-validate-tip"-->
                     <!--v-if="!validateNumber(scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].count)">数字:0~999999</div>-->
              <!--</div>-->
              <input class="edit-input"
                     type="number"
                     v-if="scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id]"
                      @input="(value) => resolveCountData(value, scope.row, firstTitle.child[0].id)"
                      v-model="scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id].count"
                      placeholder="">
              </input>
            </template>
            <!-- 一级标题 -->

            <!-- 二级标题 -->
            <template v-if="firstTitle.child.length > 1">
              <el-table-column v-for="(secondTitle,secondIndex) in firstTitle.child"
                               :key="secondIndex"
                               :label="secondTitle.name"
                               align="center"
                               width="130">
                <template slot-scope="scope">
                  <div>
                    <input class="edit-input"
                           type="number"
                           v-if="scope.row[Object.keys(scope.row)[0]][firstTitle.child[0].id]"
                            @input="(value) => resolveCountData(value, scope.row, secondTitle.id)"
                            v-model="scope.row[Object.keys(scope.row)[0]][secondTitle.id].count"
                            placeholder="">
                    </input>
                    <!--<el-input class="edit-input"-->
                              <!--@blur="(value) => resolveCountData(value, scope.row, secondTitle.id)"-->
                              <!--v-model="scope.row[Object.keys(scope.row)[0]][secondTitle.id].count"-->
                              <!--placeholder=""></el-input>-->
                    <!--<div class="text-validate-tip"-->
                         <!--v-if="checkNumber(scope.row,secondTitle.id)">数字:0~999999-->
                    <!--</div>-->
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
  // name: '/resource/deviceInfo',
  props: ['SelectProps', 'statusInfo', 'loadingInfo'],
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    YwImport: () => import('src/components/common/yw-import.vue')
  },
  data () {
    return {
      test: [],
      //查询条件
      queryParams: {

      },
      // 界面数据
      pageData: [],
      // 查询结果
      result: [],

      //表头标题
      tableTitle: [],

      //循环下拉框-厂商
      repeatCompanyResult: [],
      companyNameList: [],

      //数据状态
      disableStatus: [-1, 1],
      dataStatus: '',

      //校验结果
      validatePass: true,

      //厂商是否有空
      companyEmpty: false,

      //导入
      importData: {
        isImport: false,
        importType: 'deviceInfo',
        dataStart: 1
      },
      onlyOneFlag: true

    }
  },
  computed: {
    validateNumber () {
      return (val) => {
        let validate = !val || (/^\d+$/.test(val) && Number(val) < 1000000);
        return validate;
      }
    },
    allCompanyList () {
      let temp = (new Array(this.pageData.length)).fill('');
      this.pageData.forEach((item, index) => {
        temp[index] = Object.keys(item)[0];
      })
      return temp
    },
    titleColumns () {
      let temp = JSON.parse(JSON.stringify(this.tableTitle));
      let title = {
        total: [],//数据对应的列
      };
      let arr = [];
      temp.forEach((item, index) => {
        if (item.child && item.child.length > 0) {
          title.total = title.total.concat(item.child);
        } else {
          title.total.push(item);
        }

      })
      return title;
    }
  },
  created () {
    this.init();
  },
  mounted () {
    // this.init();
  },
  methods: {
    //导入弹窗
    setImportDisplay (val) {
      if(this.onlyOneFlag) {
        this.importData.isImport = val;
        this.init();
        this.onlyOneFlag = false;
      }
    },
    //导入
    importIn () {
      this.importData.isImport = true;
      this.onlyOneFlag = true;
    },
    checkNumber(row, titleId) {
      if (row[Object.keys(row)[0]]) {
        if (row[Object.keys(row)[0]][titleId]) {
          if (row[Object.keys(row)[0]][titleId].count) {
            return !this.validateNumber(row[Object.keys(row)[0]][titleId].count)
          }
        }
      }
      return false
    },
    resolveCountData (e, row, titleId) {
      let value=e.target.value
      if (!row[Object.keys(row)[0]][titleId].produce) {
        row[Object.keys(row)[0]][titleId] = {
          "produce": Object.keys(row)[0],
          "deviceTypeId": titleId,
          "count": value,
          "status": "",
          "createTime": ''
        }
      }
      if (value < 1) {
        row[Object.keys(row)[0]][titleId].count=null
      }
    },
    //初始化
    async init () {
      this.loadingInfo.loading = true
      await this.queryTableTitle();
      this.queryCompanys();
      this.query();
    },

    //数字校验
    validate (val) {
      let pass = !val || (/^\d+$/.test(val) && Number(val) < 1000000);
      return pass;
    },


    //设置参数
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
          "page": "evaluate"
        }
      }

    },

    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {
      this.pageData = []
      this.result = []
      this.total = 0
      this.setParams(activePagination);
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/device/count/list`,
        params: this.queryParams,
        data: this.queryParams
      }).then((res) => {
        this.total = res.total;
        this.result = res.data;
        this.resolvePageData()
        this.resolveResult();
        this.judgeStatus();
        return res
      }).finally(() => {
        this.loadingInfo.loading = false;
      });

    },
    // 处理返回数据到界面数据
    resolvePageData () {
      this.dataStatus = ''
      this.statusInfo.status = ''
      this.result.forEach(item => {
        this.dataStatus = item.status
        this.statusInfo.status = item.status;
        this.pageData.forEach(data => {
          if (Object.keys(data)[0] === item.produce) {
            data[item.produce][item.deviceTypeId] = item
          }
         })
      })
    },
    //查询表头
    queryTableTitle () {
      this.companyNameList = []
      return this.rbHttp.sendRequest({
        method: 'GET',
        url: `/v1/cmdb/device/type/list`,
        params: {},
      }).then((res) => {
        this.tableTitle = res;
        return res
      }).catch(() => {
        this.loadingInfo.loading = false;
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
        this.initData();
        return res;
      }).catch(() => {
        this.loadingInfo.loading = false;
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
          this.pageData.unshift({ '': JSON.parse(JSON.stringify(temp)) });
          break;
        // default: //厂商对应数据为空时
        //   this.pageData.forEach((item, index) => {
        //     let itemKey = Object.keys(item)[0];
        //     if (Object.keys(item[itemKey]).length < 1) {
        //       item[itemKey] = JSON.parse(JSON.stringify(temp));
        //     }
        //   });
        //   break;
      }

    },
    // 新增
    add () {

      if (Object.keys(this.pageData).indexOf('') > -1) {
        this.confirmMsg({ tip: '厂家名称不能为空' });
        return;
      }

      this.resolveResult('add');


    },

    //删除-提示
    del (keys) {

      let isExist = this.repeatCompanyResult.some((item, index) => {
        return item.name.trim() === keys.trim();
      })

      if (!isExist) {

        this.$delete(this.pageData, keys);

      } else {
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteData([keys])
        }).catch(() => {
        });
      }
      // this.total = Object.keys(this.result).length;
    },

    //删除-数据
    deleteData (row) {
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/device/count/delete`,
        data: row
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
    //判断数据状态
    judgeStatus () {
      this.validatePass = true;
      this.companyEmpty = false;
      this.pageData.forEach((item, index) => {
        let key = Object.keys(item)[0];
        if (!key) {
          this.companyEmpty = true;
        }
      })
    },

    //保存
    async save () {

      this.judgeStatus();

      if (this.companyEmpty) {
        this.confirmMsg({ tip: '厂家名称不能为空' });
        return false;
      }

      if (!this.SelectProps.province) {
        this.confirmMsg({ tip: '分支机构不能为空' });
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

      if (!this.SelectProps.person) {
        this.confirmMsg({ tip: '填报人不能为空' });
        return false;
      }

      if (!this.validatePass) {
        this.confirmMsg({ tip: '录入内容格式错误' });
        return false;
      }

      await this.addProduce();
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
        url: `/v1/cmdb/device/count/save`,
        data: {
          'user': {
            'createUserPhone': this.SelectProps.mobile ? this.SelectProps.mobile : '13115038110',
            'createUsername': this.SelectProps.person ? this.SelectProps.person : '',
            'province': this.SelectProps.province ? this.SelectProps.province : '',
            'quarter': this.SelectProps.year + '' + this.SelectProps.quarter
          },
          'deviceCounts': deviceCounts
        },
      }).then((res) => {
        if (res.success) {
          this.init()
          this.$message.success('保存成功！');
        } else {
          this.$message.error(res.message);
        }
        return res
      }).finally(() => {
        // this.loadingInfo.loading = false
      });
    },


    //失去焦点
    blurProduce (row, curKey, index) {
      if (this.companyNameList.indexOf(curKey.trim()) > -1) {
        this.pageData.splice(index, 1);
      } else {
        let obj = {};
        this.$set(obj, curKey, this.pageData[index][Object.keys(row)[0]])
        this.pageData.splice(index, 1, obj);
      }

    },

    //添加厂商
    addProduce () {
      let companyAll = [];
      this.pageData.forEach((item, index) => {
        if (this.companyNameList.indexOf(Object.keys(item)[0]) < 0) {
          companyAll.push({
            name: Object.keys(item)[0]
          });
        }
      })
      if (companyAll.length > 0) {
        this.rbHttp.sendRequest({
          method: 'POST',
          url: `/v1/cmdb/device/produce/save`,
          data: companyAll,
        }).then((res) => {
          if (res.success) {
            // this.init();
            // this.$message.success('增加厂商成功！');
          } else {
            this.$message.error(res.message);
          }
          return res
        });
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
