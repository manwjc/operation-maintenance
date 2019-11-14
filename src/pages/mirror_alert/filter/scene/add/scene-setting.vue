<template>
  <div class="components-container yw-dashboard">
    <el-form :inline="true"
             :model="form"
             ref="form"
             class="yw-form form-scene is-required"
             label-width="85px"
             :rules="rules"
             v-if="formFlag">
      <el-form-item label="过滤器名称"
                    prop="filter_id">
        <el-select v-model="form.filter_id"
                   :disabled="detailFlag">
          <el-option :label="item.name"
                     :value="item.id"
                     v-for="(item, index) in filterList"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="场景名称"
                    prop="name">
        <el-input v-model="form.name"
                  placeholder=""
                  :disabled="detailFlag"></el-input>
      </el-form-item>

      <el-form-item label="维护用户">
        <el-checkbox v-model="currentUserFlag"
                     disabled>当前用户</el-checkbox>
        <br />
        <el-checkbox v-model="otherUserFlag"
                     :disabled="detailFlag"
                     @change="checkOther">其他用户</el-checkbox>
        <el-input v-model="form.operate_user"
                  placeholder=""
                  :disabled="true"></el-input>
        <el-button type="primary"
                   @click="getUser()"
                   :disabled="otherValFlag || detailFlag">选择</el-button>
      </el-form-item>
      <el-form-item v-if="formFlag"
                    label="备注"
                    prop="note">
        <el-input type="textarea"
                  :rows="2"
                  v-model="form.note"
                  placeholder=""
                  :disabled="detailFlag">
        </el-input>
      </el-form-item>
    </el-form>
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
              <el-col :span="1">
                <img src="/static/img/alert/filter-first.png"
                     class="data-filter-col-img" />
                <div class="dotted-line"></div>
              </el-col>
              <template v-for="(col, ind) in row.colList">
                <el-col :span="5"
                        style="margin-left: 44px;"
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
                  <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div>
                </el-col>
                <el-col :span="5"
                        class="data-filter-col"
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
                  <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div>
                </el-col>
                <el-col :span="5"
                        class="data-filter-col"
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
                  <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div>
                </el-col>
              </template>
              <el-col :span="1"
                      v-if="index !== 0">
                <img v-if="index !== 0 && !detailFlag "
                     class="data-filter-col-delete"
                     src="/static/img/alert/filter-delete.png"
                     @click="deleteRow(index, inde)" />
              </el-col>
            </el-row>
            <el-row class="data-filter-row"
                    v-else
                    :key="inde">
              <el-col :span="1">
                <img src="/static/img/alert/filter-piece-middle2.png"
                     class="data-filter-col-img" />
                <div class="dotted-line"></div>
              </el-col>
              <template v-for="(col, ind) in row.colList">
                <el-col :span="5"
                        style="margin-left: 44px;"
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
                  <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div>
                </el-col>
                <el-col :span="5"
                        class="data-filter-col"
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
                  <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div>
                </el-col>
                <el-col :span="5"
                        class="data-filter-col"
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
                  <div class="my-error-tip data-filter-error"
                       v-if="validationPhase.isValidating && (col.selectedVal === '' )">此处不能为空</div>
                </el-col>
              </template>
              <el-col :span="1">
                <img v-if="!detailFlag"
                     class="data-filter-col-delete"
                     src="/static/img/alert/filter-delete.png"
                     @click="deleteRow(index, inde)" />
              </el-col>
            </el-row>
          </template>
          <el-row class="data-filter-row">
            <el-col :span="1">
              <img src="/static/img/alert/filter-piece-last.png"
                   class="data-filter-col-img" />
            </el-col>
            <el-col :span="1">
              <img src="/static/img/alert/filter-add.png"
                   v-if="!detailFlag"
                   class="data-filter-col-add"
                   @click="addRow(index)"
                   :disabled="detailFlag" />
              <img src="/static/img/alert/filter-add-inactive.png"
                   v-else
                   class="data-filter-col-add" />
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--激活状态的 或-->
      <div class="filter-or"
           v-if="(index == dataFilterList.length - 1) && !detailFlag">
        <img class="filter-or-img"
             src="/static/img/alert/filter-or.png"
             @click="addFilterOR(index)" />
      </div>
      <!--失效状态的 或-->
      <div class="filter-or"
           v-else>
        <img class="filter-or-img"
             src="/static/img/alert/filter-or-inactive.png" />
      </div>
    </div>
    <div class="alertNotice">
      <el-dialog title="选择用户"
                 :visible.sync="dialogChoose"
                 width="50%"
                 center
                 :show-close="false"
                 :close-on-click-modal="true">
        <!-- <span>这是一段信息</span> -->
        <el-transfer filterable
                     filter-placeholder="请输入用户名称"
                     :titles="['用户列表', '已选用户']"
                     v-model="userResult"
                     :data="userList">
        </el-transfer>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="choose"
                     class="tem-search"
                     style="width:auto">确认选择</el-button>
          <el-button type="primary"
                     @click="dialogChoose = false"
                     class='tem-search'>返回</el-button>
        </span>
      </el-dialog>
    </div>
    <el-button class="tem-search"
               type="primary"
               @click="save"
               style="margin-left:10px;"
               v-if="!detailFlag">确认</el-button>
    <el-button class="tem-search"
               style="width: auto"
               @click="back"
               v-if="!detailFlag">取消</el-button>
    <el-button class="tem-search"
               style="width: auto"
               @click="back"
               v-if="detailFlag">返回</el-button>
  </div>
</template>
<script>
import { operateType } from 'src/pages/mirror_alert/alert_his/config/options.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbAlertFilterSceneServicesFactory from 'src/services/alert/rb-alertFilterScene-services.factory.js'
import rbAlertFilterServicesFactory from 'src/services/alert/rb-alertFilter-services.factory.js'

export default {
  name: '/mirror_alert/filter/scene/add/',
  data () {
    return {
      editName: '',
      editFilterId: '',
      operateType: {},
      formFlag: false,
      buttonStyle: 'height:30px;',
      sceneId: '',
      detailFlag: false,
      oper: '',
      sceneObj: {},
      selectWidth: 240,
      form: {},
      currentUserFlag: true,
      otherUserFlag: false,
      dialogChoose: false,
      otherValFlag: true,
      userResult: [],
      userList: [],
      transferTableData: [],
      dataFilterList: [],
      optionList: [],
      filterList: [],
      rules: {
        name: [
          { required: true, message: '必填项' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符' },
          { pattern: /^[A-Za-z\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5\\-]*[A-Za-z0-9\u4e00-\u9fa5]$/, message: '格式错误' }
        ],
        filter_id: [
          { required: true, message: '必填项' }
        ]
      },
      validationPhase: {
        allCorrect: true,
        isValidating: false,
        errorMsg: '数据未填写或填写错误,不能保存'
      }
    }
  },
  mounted () {
    this.operateType = operateType
    if (this.$route.query.sceneId) {
      this.sceneId = this.$route.query.sceneId
    }
    if (this.$route.query.oper) {
      this.oper = this.$route.query.oper
    }
    if (this.$route.query.detail) {
      this.detailFlag = true
    }
    this.getFilterData()
    this.getOptionData()
  },
  computed: {
    selectStyle () {
      return 'width: ' + (this.selectWidth + 10) + 'px;'
    }
  },
  methods: {
    checkOther (val) {
      this.otherValFlag = !val
    },
    back () {
      this.$router.push({ path: '/mirror_alert/filter/scene/list' })
    },
    transformData () {
      let dataFilterJson = { data: [] }
      let dataFilterList = JSON.parse(JSON.stringify(this.dataFilterList))

      for (let i = 0; i < dataFilterList.length; i++) {
        let rowList = dataFilterList[i].rowList
        let andData = { data: [] }
        for (let j = 0; j < rowList.length; j++) {
          let col0 = rowList[j].colList[0].selectedVal
          let col1 = rowList[j].colList[1].selectedVal
          let col2 = rowList[j].colList[2].selectedVal
          if (col0 === '' || col1 === '' || col2 === '' || col2 === null || col2.length === 0) {
            console.log('有数据未填，不能提交')
            this.$message.warning(this.validationPhase.errorMsg)
            return
          }
          let colData = {}
          if (rowList[j].colList[2].type === 'select' && rowList[j].colList[1].multipleFlag === true) {
            colData['value'] = col2
          } else if ((col1 === 'in' || col1.indexOf('not') === 0) && rowList[j].colList[2].type !== 'select') {
            let vals = col2.split(',')
            colData['value'] = vals
          } else {
            colData['value'] = col2
          }
          colData['filterItemName'] = col0
          colData['operate'] = col1
          colData['jdbcType'] = rowList[j].colList[0].jdcbType
          andData['data'].push(colData)
        }
        dataFilterJson['data'].push(andData)
      }
      this.form.filter_option = JSON.stringify(dataFilterJson)
      if (!this.currentUserFlag) {
        this.form.operate_user = ''
      }
      if (this.sceneId && !this.oper) {
        if (this.editName !== this.form.name || this.editFilterId !== this.form.filter_id) {
          rbAlertFilterSceneServicesFactory.getByName(this.form.name, this.form.filter_id).then((res) => {
            if (res != null && res !== '') {
              this.$message.info('场景名称已经存在，请重新命名')
              return
            }
            rbAlertFilterSceneServicesFactory.update(this.form.id, this.form).then((res) => {
              this.back()
              this.$message.success('修改成功')
              // this.search()
            }).catch((e) => {
              this.$message.error('修改失败')
            })
          })
        } else {
          rbAlertFilterSceneServicesFactory.update(this.form.id, this.form).then((res) => {
            this.back()
            this.$message.success('修改成功')
            // this.search()
          }).catch((e) => {
            this.$message.error('修改失败')
          })
        }
      } else {
        rbAlertFilterSceneServicesFactory.getByName(this.form.name, this.form.filter_id).then((res) => {
          if (res != null && res !== '') {
            this.$message.info('场景名称已经存在，请重新命名')
            return
          }
          rbAlertFilterSceneServicesFactory.create(this.form).then((res) => {
            this.back()
            this.$message.success('新增成功')
            // this.search()
          }).catch((e) => {
            this.$message.error('新增失败')
          })
        })
      }
    },
    validate () {
      this.validationPhase.allCorrect = true
      this.validationPhase.errorMsg = '数据未填写或填写错误,不能保存'
      this.$nextTick(() => {
        this.transformData()
      })
    },
    save () {
      this.validationPhase.isValidating = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.validate()
        }
      })
    },
    sourceChange (col, filterIndex, rowIndex) {
      this.$forceUpdate()
    },
    operateChange (col, filterIndex, rowIndex) {
      //        this.$forceUpdate()
      if (this.getMultiplyFlag(col.selectedVal)) {
        //          alert(this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal)
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = []
        // this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleVal = []
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = true
      } else {
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = ''
        this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = false
      }
      this.$forceUpdate()
    },
    getMultiplyFlag (val) {
      return (val === 'in' || val.indexOf('not') === 0)
    },
    optionChange (col, filterIndex, rowIndex) {
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
        /* if (this.getMultiplyFlag(this.dataFilterList[filterIndex].rowList[rowIndex].colList[1].selectedVal)) {
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = true
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = []
        } else {
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].multipleFlag = false
          this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = ''
        } */
      }
      this.dataFilterList[filterIndex].rowList[rowIndex].colList[2].selectedVal = ''
      this.$forceUpdate()
    },
    optionChangeEdit (col, filterIndex, rowIndex, operateEdit, valueEdit) {
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
    getFilterData () {
      rbAlertFilterServicesFactory.getAll().then((res) => {
        this.filterList = res
      })
    },
    getOptionData () {
      rbAlertFilterSceneServicesFactory.getOptionAll().then((res) => {
        this.optionList = res
        this.initData()
      })
    },
    addRow (data) {
      console.log(this.dataFilterList)
      this.dataFilterList[data].rowList.push(this.getRowObj())
    },
    getRowObj () {
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
    getFilterObj () {
      let filter = {}
      let rowList = []
      rowList.push(this.getRowObj())
      filter.rowList = rowList
      return filter
    },
    getEidtRowObj (rowObj) {
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
    getEditFilterObj (optionsItemData) {
      let filter = {}
      let rowList = []
      optionsItemData.data.forEach(item => {
        rowList.push(this.getEidtRowObj(item))
      })
      filter.rowList = rowList
      return filter
    },
    initEditData (options) {
      this.dataFilterList = []
      let optionsData = options.data
      let i = 0
      optionsData.forEach(item => {
        this.dataFilterList.push(this.getEditFilterObj(item))
        let j = 0
        this.dataFilterList[i].rowList.forEach(rowItem => {
          let colList = rowItem.colList
          this.optionChangeEdit(colList[0], i, j, colList[1].selectedVal, colList[2].selectedVal)
          j++
        })
        i++
      })
    },
    initData () {
      if (this.sceneId) {
        rbAlertFilterSceneServicesFactory.getByKey(this.sceneId).then((res) => {
          this.form = res
          if (this.oper) {
            this.form.id = ''
          }
          if (this.form.operate_user) {
            this.otherUserFlag = true
            this.otherValFlag = false
            this.userResult = this.form.operate_user.split(',')
          }
          let option = this.filterList.find(function (o) {
            return o.id === res.filter_id
          })
          if (option === null || option === undefined) {
            this.form.filter_id = ''
          }
          this.initEditData(JSON.parse(res.option_condition))
          this.formFlag = true
          this.editName = res.name
          this.editFilterId = res.filter_id
        })
      } else {
        this.dataFilterList.push(this.getFilterObj())
        this.formFlag = true
      }
    },
    deleteRow (data, index) {
      this.dataFilterList[data].rowList.splice(index, 1)
      if (index === 0) {
        this.dataFilterList.splice(data, 1)
      }
    },
    getUser () {
      this.getUserList()
      this.dialogChoose = true
    },
    addFilterOR () {
      this.dataFilterList.push(this.getFilterObj())
    },
    // 获取用户列表
    getUserList () {
      const namespace = sessionStorage.getItem('namespace')
      let arr = [namespace, {
        order_by: '-createTime',
        page_size: -1
      }]
      rbProjectDataServiceFactory.getUserList(arr).then((res) => {
        let arr = []
        res.result.forEach((item) => {
          let obj = {
            label: item.name,
            key: item.username
          }
          arr.push(obj)
        })
        this.userList = arr
      })
    },
    choose () {
      if (this.userResult.size === 0) {
        this.$message.info('用户为空，请选择！')
        return
      }
      this.form.operate_user = this.userResult.toString()
      // this.userResult = []
      this.dialogChoose = false
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
      margin-top: 10px;
      margin-left: 10px;
      margin-bottom: 20px;

      .data-filter-col-img {
        width: 90px;
        height: 46px;
        margin-top: -9px;
        margin-left: 20px;
      }

      .data-filter-col-delete {
        width: 20px;
        height: 20px;
        margin-top: 4px;
        cursor: pointer;
        margin-left: -36px;
      }

      .data-filter-col-add {
        width: 20px;
        height: 20px;
        margin-left: 45px;
        margin-top: 4px;
        cursor: pointer;
      }
    }
  }
}

/deep/ .form-scene {
  .el-form-item {
    &:nth-of-type(odd) {
      width: 55%;
    }
  }
}
.alertNotice {
  /deep/ .el-dialog {
    min-width: 540px;
    .el-dialog__body {
      text-align: center;
      .el-transfer-panel {
        text-align: left;
      }
    }
  }
}
</style>
