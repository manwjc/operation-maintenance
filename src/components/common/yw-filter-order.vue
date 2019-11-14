<template>
  <!-- 工单筛选 -->
  <section>
    <div class="yw-order-filter"
         v-for="(item, index) in dataFilterList"
         :key="index">
      <div class="data-filter-form">
        <el-form :model="item"
                 ref="filterForm"
                 label-width="0px"
                 label-position="left">
          <template v-for="(row, inde) in item.rowList">
            <el-row class="data-filter-row"
                    :key="inde"
                    v-if="inde == 0">
              <div class="filter-img">
                <img src="/static/img/alert/filter-first.png"
                     class="data-filter-col-img"/>
                <div class="dotted-line"></div>
              </div>
              <template v-for="(col, ind) in row.colList">
                <div class="filter-part"
                     :key="ind"
                     v-if="ind == 0">
                  <el-select v-model="col.selectedVal"
                             @change="optionChange(col, index, inde)"
                             :disabled="detailFlag"
                             clearable
                             filterable>
                    <el-option :label="option.name"
                               :value="option.code"
                               v-for="(option, indexOption) in optionList"
                               :key="indexOption"></el-option>
                  </el-select>
                </div>

                <div class="filter-part"
                     v-else-if="ind == 1"
                     :key="ind">
                  <!--默认为单选框-->
                  <el-select v-model="col.selectedVal"
                             clearable
                             @change="operateChange(col, index, inde)"
                             :disabled="detailFlag">
                    <el-option :label="op"
                               :value="operateType[op]"
                               v-for="(op, opIndex) in col.operations"
                               :key="opIndex"></el-option>
                  </el-select>
                  <!-- <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div> -->
                </div>
                <div class="filter-part"
                     v-else
                     :key="ind">
                  <!--如果是 多选框-->
                  <div v-if="col.type === 'select'">
                    <el-select clearable
                               filterable
                               v-if="col.multipleFlag === false"
                               v-model="col.selectedVal"
                               placeholder="请选择"
                               @change="sourceChange(col, index, inde)"
                               :disabled="detailFlag">
                      <el-option v-for="(val, valIndex) in col.sources"
                                 :key="valIndex"
                                 :label="val.name"
                                 :value="val.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div v-if="col.type === 'select'">
                    <el-select v-if="col.multipleFlag === true"
                               clearable
                               filterable
                               size="small"
                               class="filter-select mutiple-choice"
                               v-model="col.selectedVal"
                               multiple
                               placeholder="请选择"
                               @change="sourceChange(col, index, inde)"
                               :disabled="detailFlag">
                      <el-option v-for="(val, valIndex) in col.sources"
                                 :key="valIndex"
                                 :label="val.name"
                                 :value="val.value">
                      </el-option>
                    </el-select>
                  </div>
                  <!--默认为单选框-->
                  <el-date-picker v-model="col.selectedVal"
                                  v-else-if="col.type === 'date'"
                                  type="date"
                                  placeholder="选择日期"
                                  value-format="yyyy-MM-dd"
                                  size="mini"></el-date-picker>
                  <el-input v-model="col.selectedVal"
                            placeholder=""
                            v-else
                            :disabled="detailFlag"></el-input>
                  <!-- <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div> -->
                </div>
              </template>
              <div class="filter-part filter-btn-wrap"
                   v-if="index !== 0">
                <img v-if="!detailFlag "
                     class="data-filter-col-delete"
                     src="/static/img/alert/filter-delete.png"
                     @click="deleteRow(index, inde)"/>
              </div>
            </el-row>
            <el-row class="data-filter-row"
                    v-else
                    :key="inde">
              <div class="filter-img">
                <img src="/static/img/alert/filter-piece-middle2.png"
                     class="data-filter-col-img"/>
                <div class="dotted-line"></div>
              </div>
              <template v-for="(col, ind) in row.colList">
                <div class="filter-part"
                     :key="ind"
                     v-if="ind == 0">
                  <el-select v-model="col.selectedVal"
                             clearable
                             filterable
                             @change="optionChange(col, index, inde)"
                             :disabled="detailFlag">
                    <el-option :label="option.name"
                               :value="option.code"
                               v-for="(option, indexOption) in optionList"
                               :key="indexOption"></el-option>
                  </el-select>
                  <!-- <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div> -->
                </div>
                <div class="filter-part"
                     v-else-if="ind == 1"
                     :key="ind">
                  <!--默认为单选框-->
                  <el-select v-model="col.selectedVal"
                             clearable
                             @change="operateChange(col, index, inde)"
                             :disabled="detailFlag">
                    <el-option :label="op"
                               :value="operateType[op]"
                               v-for="(op, opIndex) in col.operations"
                               :key="opIndex"></el-option>
                  </el-select>
                  <!-- <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div> -->
                </div>
                <div class="filter-part"
                     v-else
                     :key="ind">
                  <!--默认为单选框-->
                  <div v-if="col.type === 'select'">
                    <el-select v-if="col.multipleFlag === false"
                               clearable
                               filterable
                               v-model="col.selectedVal"
                               placeholder="请选择"
                               @change="sourceChange(col, index, inde)"
                               :disabled="detailFlag">
                      <el-option v-for="(val, valIndex) in col.sources"
                                 :key="valIndex"
                                 :label="val.name"
                                 :value="val.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div v-if="col.type === 'select'">
                    <el-select v-if="col.multipleFlag === true"
                               clearable
                               filterable
                               class="filter-select mutiple-choice"
                               v-model="col.selectedVal"
                               multiple
                               placeholder="请选择"
                               @change="sourceChange(col, index, inde)"
                               :disabled="detailFlag">
                      <el-option v-for="(val, valIndex) in col.sources"
                                 :key="valIndex"
                                 :label="val.name"
                                 :value="val.value">
                      </el-option>
                    </el-select>
                  </div>
                  <el-date-picker v-model="col.selectedVal"
                                  v-else-if="col.type === 'date'"
                                  type="date"
                                  placeholder="选择日期"
                                  value-format="yyyy-MM-dd"
                                  size="mini"></el-date-picker>
                  <el-input v-model="col.selectedVal"
                            placeholder=""
                            v-else
                            :disabled="detailFlag"></el-input>
                  <!-- <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div> -->
                </div>
              </template>
              <div class="filter-part filter-btn-wrap">
                <img v-if="!detailFlag"
                     class="data-filter-col-delete"
                     src="/static/img/alert/filter-delete.png"
                     @click="deleteRow(index, inde)"/>
              </div>
            </el-row>
          </template>
          <el-row class="data-filter-row">
            <div class="filter-img">
              <img src="/static/img/alert/filter-piece-last.png"
                   class="data-filter-col-img"/>
            </div>
            <div class="filter-part filter-btn-wrap">
              <img src="/static/img/alert/filter-add.png"
                   v-if="!detailFlag"
                   class="data-filter-col-add"
                   @click="addRow(index)"
                   :disabled="detailFlag"/>
              <img src="/static/img/alert/filter-add-inactive.png"
                   v-else
                   class="data-filter-col-add"/>
            </div>
          </el-row>
        </el-form>
      </div>
      <!--激活状态的 或-->
      <div class="filter-or"
           v-if="(index == dataFilterList.length - 1) && !detailFlag">
        <img class="filter-or-img"
             src="/static/img/alert/filter-or.png"
             @click="addFilterOR(index)"/>
      </div>
      <!--失效状态的 或-->
      <div class="filter-or"
           v-else>
        <img class="filter-or-img"
             src="/static/img/alert/filter-or-inactive.png"/>
      </div>
    </div>
  </section>

</template>
<script>
  import rbAlertFilterSceneServicesFactory from 'src/services/alert/rb-alertFilterScene-services.factory.js'

  export default {
    props: {
      //数据
      dataList: {
        type: Object,
        default: {}
      },
      //能否筛选
      detailFlag: {
        type: Boolean,
        default: false
      },
      //能否筛选
      queryType: {
        type: String,
        default: false
      }
    },
    data() {
      return {
        //业务数据
        optionList: [],
        //规则数据
        operateType: {},
        //状态数据
        dataFilterList: []
      }
    },
    mounted() {
      this.operateType = {
        "大于": ">",
        "小于": "<",
        "等于": "=",
        "不等于": "!=",
        "大于等于": ">=",
        "小于等于": "<=",
        "包含": "in",
        "不包含": "not in",
        "模糊匹配": "like"
      }
      if (this.queryType) {
        this.queryByType()
      } else {
        this.query()
      }
    },
    methods: {
      //下拉框数据查询
      query() {
        rbAlertFilterSceneServicesFactory.getOptionAll().then((res) => {
          this.optionList = res
          if (!this.dataList || !this.dataList.data) {
            this.dataFilterList.push(this.getFilterObj())
          } else {
            this.initEditData(this.dataList)
          }
          this.$forceUpdate()
        })
      },
      queryByType() {
        rbAlertFilterSceneServicesFactory.getOptionByType(this.queryType).then((res) => {
          this.optionList = res
          if (!this.dataList || !this.dataList.data) {
            this.dataFilterList = []
            this.dataFilterList.push(this.getFilterObj())
          } else {
            this.initEditData(this.dataList, true)
          }
          this.$forceUpdate()
        })
      },
      //添加工单块
      addFilterOR() {
        this.dataFilterList.push(this.getFilterObj());
        this.$emit('changeFilterOrder', {functionName: 'addFilterOR', datas: this.dataFilterList});
      },

      //删除工单行
      deleteRow(data, index) {
        this.dataFilterList[data].rowList.splice(index, 1)
        if (index === 0) {
          this.dataFilterList.splice(data, 1)
        }
        this.$emit('changeFilterOrder', {functionName: 'deleteRow', datas: this.dataFilterList});
      },

      //添加工单行
      addRow(data) {
        this.dataFilterList[data].rowList.push(this.getRowObj());
        this.$emit('changeFilterOrder', {functionName: 'addRow', datas: this.dataFilterList});

      },
      optionChange(col, filterIndex, rowIndex) {
        // 设置操作符和来源值
        let value = col.selectedVal
        let option = this.optionList.find(function (o) {
          return o.code === value
        })
        col.jdcbType = option.jdbc_type
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].type = option.type
        let operation = option.operate
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[1].operations = operation.split(',')
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[1].selectedVal = ''
        if (option.type === 'select') {
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = []
          if (option.source) {
            rbAlertFilterSceneServicesFactory.getSourceVal(option.source, option.method).then((res) => {
              if (res.length > 0) {
                if (typeof res[0] !== 'object') {
                  this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = []
                  res.forEach(item => {
                    let obj = {}
                    obj.value = item
                    obj.name = item
                    this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources.push(obj)
                  })
                } else {
                  this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = res
                }
                // this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = col2Value
              }
            })
          } else {
            this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = JSON.parse(option.content)
          }
        }
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = ''
        this.$forceUpdate()
      },
      optionChangeEdit(col, filterIndex, rowIndex, operateEdit, valueEdit) {
        this.$forceUpdate()
        // 设置操作符和来源值
        let value = col.selectedVal
        let option = this.optionList.find(function (o) {
          return o.code === value
        })
        col.jdcbType = option.jdbc_type
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].type = option.type
        let operation = option.operate
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[1].operations = operation.split(',')
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[1].selectedVal = operateEdit
        if (option.type === 'select') {
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = []
          if (option.source) {
            rbAlertFilterSceneServicesFactory.getSourceVal(option.source, option.method).then((res) => {
              if (res.length > 0) {
                if (typeof res[0] !== 'object') {
                  this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = []
                  res.forEach(item => {
                    let obj = {}
                    obj.value = item
                    obj.name = item
                    this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources.push(obj)
                  })
                } else {
                  this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = res
                }
              }
            })
          } else {
            this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].sources = JSON.parse(option.content)
          }
        }
        if (this.getMultiplyFlag(operateEdit) && (option.type === 'select')) {
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = true
          // this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = JSON.parse(valueEdit)
        } else {
          if (operateEdit === 'in' || operateEdit.indexOf('not') === 0) {
            let valueEditTemp = ''
            valueEdit.forEach(v => {
              valueEditTemp += v + ','
            })
            valueEdit = valueEditTemp.substring(0, valueEditTemp.length - 1)
          }
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = false
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = valueEdit
        }
      },
      operateChange(col, filterIndex, rowIndex) {
        //        this.$forceUpdate()
        if (this.getMultiplyFlag(col.selectedVal)) {
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = []
          // this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleVal = []
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = true
        } else {
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = ''
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = false
        }
        this.$forceUpdate()
      },
      getMultiplyFlag(val) {
        return (val === 'in' || val.indexOf('not') === 0)
      },
      //工单行数据
      getRowObj() {
        let row = {}
        let col = []
        let obj = {}
        obj.id = 1
        obj.selectedVal = ''
        let obj1 = {}
        obj1.operations = []
        obj1.selectedVal = ''
        obj1.id = 2
        let obj2 = {}
        obj2.selectedVal = ''
        obj2.id = 3
        obj2.multipleFlag = false
        obj2.multipleVal = []
        obj2.sources = []
        obj2.multipleSources = []
        obj2.type = 'select'
        col.push(obj)
        col.push(obj1)
        col.push(obj2)
        row.colList = col
        return row
      },
      //工单块数据
      getFilterObj() {
        let filter = {}
        let rowList = []
        rowList.push(this.getRowObj())
        filter.rowList = rowList
        return filter
      },
      initEditData(options, checkType = false) {
        this.dataFilterList = []
        let optionsData = options.data
        let i = 0
        optionsData.forEach(item => {
          this.dataFilterList.push(this.getEditFilterObj(item, checkType))
          let j = 0
          this.dataFilterList[i].rowList.forEach(rowItem => {
            let colList = rowItem.colList
            this.optionChangeEdit(colList[0], i, j, colList[1].selectedVal, colList[2].selectedVal)
            j++
          })
          i++
        })
      },
      getEidtRowObj(rowObj) {
        let row = {}
        let col = []
        let obj = {}
        obj.id = 1
        obj.selectedVal = rowObj.filterItemName
        let obj1 = {}
        obj1.operations = []
        obj1.selectedVal = rowObj.operate
        obj1.id = 2
        let obj2 = {}
        obj2.selectedVal = rowObj.value
        obj2.id = 3
        obj2.sources = []
        col.push(obj)
        col.push(obj1)
        col.push(obj2)
        row.colList = col
        return row
      },
      getEditFilterObj(optionsItemData, checkType) {
        let filter = {}
        let rowList = []
        optionsItemData.data.forEach(item => {
          if (checkType) {
            let checkYes = false
            for (let k = 0; k < this.optionList.length; k++) {
              let option = this.optionList[k]
              if (option.code === item.filterItemName) {
                checkYes = true
                break
              }
            }
            if (!checkYes) {
              return
            }
          }
          rowList.push(this.getEidtRowObj(item))
        })
        if (rowList.length === 0) {
          rowList.push(this.getRowObj())
        }
        filter.rowList = rowList
        return filter
      },
      sourceChange(col, filterIndex, rowIndex) {
        this.$forceUpdate()
      },
    },
    watch: {
      queryType: {
        handler: function () {
          this.queryByType()
        },
      }
    }
  }
</script>
<style lang="scss" scoped>
  /**流程工单*/
  .yw-order-filter {
    margin: 0 0 15px 0;

    &:first-of-type {
      margin: 15px 0 0 0;
    }

    .filter-or {
      margin-left: calc(50% - 20px);

      .filter-or-img {
        width: 40px;
        height: 52px;
        cursor: pointer;
      }
    }

    .data-filter-form {
      border: 1px solid #eeeeee;
      border-radius: 3px;

      .data-filter-row {
        margin-left: 10px;

        .filter-img {
          display: inline-block;
          vertical-align: middle;
        }

        .filter-part {
          display: inline-block;
          margin-right: 10px;
        }

        .data-filter-col-img {
          width: 90px;
          height: 46px;
        }

        .filter-btn-wrap {
          height: 26px;
        }

        .data-filter-col-delete {
          display: block;
          margin-top: 10px;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .data-filter-col-add {
          display: block;
          margin-top: 10px;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }
  }
</style>
