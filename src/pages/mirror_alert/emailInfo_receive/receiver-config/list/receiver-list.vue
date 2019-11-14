<template>
  <div class="component-container">
    <header >
      <div class="dataTime">
        <div style="margin-left: 12px;">发件人邮箱：</div>
        <el-input v-model="sender" placeholder="请输入内容" class="input-tem-name1" style="width:200px;" clearable></el-input>
        <div class="creat-time" style="margin-left: 80px;">采集状态：</div>
        <el-select v-model="active" placeholder="请选择" class="input-tem-name1" clearable filterable style="width: 200px">
          <el-option   label="启用" value="1"></el-option>
          <el-option   label="禁用" value="0"></el-option>
        </el-select>
        <el-button class="tem-search" type="primary" @click="search">查询</el-button>
        <el-button class="tem-search" style="width: auto"  @click="reset">重置</el-button>
      </div>
      <div class="dataTime" style="margin-top: 10px;">
        <div >最新发件时间：</div>
        <el-date-picker
          v-model="time_range"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="time-range"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="dataTime" style="margin-left: 0px;margin-top: 10px;">
        <el-button class="tem-search"  @click="create" style="margin-left: 0px;">新增</el-button>
        <el-button class="tem-search"  @click="deleteBatch">删除</el-button>
      </div>
    </header>
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%;margin-top:15px">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="receiver"
        label="收件邮箱账号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sender"
        label="发件人邮箱"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title_include"
        label="邮件标题过滤"
        align="center">
      </el-table-column>
      <el-table-column
        prop="content_include"
        label="邮件内容过滤"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="active"
        label="采集状态"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.active === 1 ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="last_send_time"
        label="最新发件时间"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.last_send_time ? moment(scope.row.last_send_time).format('YYYY-MM-DD HH:mm:ss') : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="times"
        label="采集次数"
        align="center"
      >
        <template slot-scope="scope">
          <a href="#" @click="gotoScene(scope.row.id)">{{scope.row.times}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="region"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button  type="text" @click="openUpdate(scope.row.id)" size="small" icon="el-icon-edit-outline" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="20" >
      <el-col :span="12" style="float: right">
        <el-pagination style="margin-bottom: 10px;"
                       class="pull-right pagination-margin"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="editFlag" width="80%"  :show-close="false"
               title="发件邮箱告警采集配置"
               :close-on-click-modal="false" >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules"  v-if="editFlag">
        <el-row >
          <el-col :span="8">
            <el-form-item label="邮箱地址" prop="receiver" style="margin-bottom: 0px">
              <span style="width: 200px;">{{this.receiver}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采集状态" style="margin-bottom: 0px" prop="active" >
              <el-checkbox v-model="form.active">启用</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin: 0px;padding: 0px;">
          <el-col :span="8" style="margin: 0px;padding: 0px;">
            <el-form-item style="margin-bottom: 0px">
              <span slot="label" style="font-size: 16px;">过滤设置</span>
              <hr style="color: #ebe9e9; width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="16" style="margin: 0px;padding: 0px;">
            <hr style="color: #ebe9e9; width: calc(100% - 20px);" />
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="8">
            <el-form-item label="发件人邮箱" style="margin-bottom: 0px" prop="sender" >
              <el-input v-model="form.sender" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮件标题" style="margin-bottom: 0px" prop="title_include">
              <el-input v-model="form.title_include" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮件内容" style="margin-bottom: 0px" prop="content_include">
              <el-input v-model="form.content_include" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin: 0px;padding: 0px;">
          <el-col :span="8" style="margin: 0px;padding: 0px;">
            <el-form-item style="margin-bottom: 0px;margin-top: 0px;">
              <span slot="label" style="font-size: 16px;">告警映射</span>
              <hr style="color: #ebe9e9; width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="16" style="margin: 0px;padding: 0px;">
            <hr style="color: #ebe9e9; width: calc(100% - 20px);" />
          </el-col>
        </el-row>
        <el-row v-for="(row, index) in row1List" :key="index">
          <el-col :span="13">
            <el-form-item :label="row.name" >
              <el-select v-model="row.type" placeholder="请选择" class="input-tem-name1" @change="sourceChange(row, index)"   style="width: 150px;float: left;margin-right: 5px;">
                <el-option   label="自定义" value="1"></el-option>
                <el-option   label="邮件信息" value="2"></el-option>
              </el-select>
              <div v-if="row.type === '2'" style="float: left">
                <el-select v-model="row.content" placeholder="请选择" class="input-tem-name1" clearable  style="width: 200px">
                  <el-option   label="标题" value="0"></el-option>
                  <el-option   label="内容" value="1"></el-option>
                  <el-option   label="发件人" value="2"></el-option>
                  <el-option   label="发件时间" value="3"></el-option>
                </el-select>
              </div>
              <el-input v-model="row.content" placeholder="" v-else  style="width: 200px;float: left"></el-input>
              <div class="my-error-tip data-filter-error" v-if="validationPhase.isValidating && (row.content === '' )" style="margin-left: 155px;">此处不能为空</div>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="(row.type === '2') && !row.isLevel" >
            <el-row>
              <el-col :span="12">
                <el-checkbox v-model="row.flag" style="line-height: 30px;float: right;padding-right: 5px;">正则匹配</el-checkbox>
              </el-col>
              <el-col :span="12">
                <el-input v-model="row.rule"  style="width: 200px;float: left"></el-input>
                <div class="my-error-tip data-filter-error" v-if="validationPhase.isValidating && (row.rule === '' )" >此处不能为空</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="11" v-if="(row.type === '2') && row.isLevel" >
            <el-row>
              <el-col :span="12">
                <div class="my-error-tip data-filter-error" v-if="validationPhase.isValidating && (row.rule === '' )" style="margin-left: 20%;">此处不能为空</div>
                <el-input v-model="row.rule"  style="width: 150px;float:right;"></el-input>
                <label  style="float: right;width: 40px;line-height: 30px;font-weight:normal;padding-right: 0px;">包含</label>
              </el-col>
              <el-col :span="12">
                <img src="/static/img/alert/to.png"  style="float: left;"/>
                <el-select v-model="row.level" placeholder="请选择" class="input-tem-name1" clearable  style="width: 124px;float: left">
                  <el-option   label="重大" value="5"></el-option>
                  <el-option   label="高" value="4"></el-option>
                  <el-option   label="中" value="3"></el-option>
                  <el-option   label="低" value="2"></el-option>
                  <!--<el-option   label="提示" value="1"></el-option>-->
                </el-select>
                <div class="my-error-tip data-filter-error" v-if="validationPhase.isValidating && (row.level === '' )" style="margin-left: 76px;">此处不能为空</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24" >
            <label class="el-form-item__label" style="width: 120px;float: left">告警字段</label>
            <el-select v-model="addColVal" placeholder="请选择"    class="list-sel" clearable filterable style="width: 150px;float: left">
              <el-option   :label="row.name" :value="row.code" v-for="(row, index) in alertEmailCol" :key="index"></el-option>
            </el-select>
            <img src="/static/img/alert/filter-add.png"  @click="addRow2()" class="data-filter-col-add"  style="float: left;height: 25px;line-height: 25px;margin-left: 5px;"/>
          </el-col>
        </el-row>
        <div style="background-color: #f9fafc;padding-top: 5px;padding-bottom: 10px;">
          <el-row v-for="(row, index) in row2List" :key="index">
            <el-col :span="13">
              <el-form-item :label="row.name" >
                <el-select v-model="row.type" placeholder="请选择" class="input-tem-name1" @change="sourceChange(row, index)" clearable  style="width: 150px;float: left;margin-right: 5px;">
                  <el-option   label="自定义" value="1"></el-option>
                  <el-option   label="邮件信息" value="2"></el-option>
                </el-select>
                <div v-if="row.type === '2'" style="float: left">
                  <el-select v-model="row.content" placeholder="请选择" class="input-tem-name1" clearable  style="width: 200px">
                    <el-option   label="发件时间" value="1"></el-option>
                    <el-option   label="发件人" value="2"></el-option>
                    <el-option   label="标题" value="3"></el-option>
                    <el-option   label="内容" value="4"></el-option>
                  </el-select>
                </div>
                <el-input v-model="row.content" placeholder="" v-else  style="width: 200px;float: left"></el-input>
                <img src="/static/img/alert/filter-delete.png" v-if="row.type === '1'" @click="deleteRow2(index)" class="data-filter-col-add"  style="height: 30px;line-height: 30px;margin-left: 5px;margin-top:5px;float: left;"/>
                <div class="my-error-tip data-filter-error" v-if="validationPhase.isValidating && (row.content === '' )" style="margin-left: 155px;">此处不能为空</div>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="(row.type === '2') && !row.isLevel" >
              <el-row>
                <el-col :span="12">
                  <el-checkbox v-model="row.flag" style="line-height: 30px;float: right;padding-right: 5px;">正则匹配</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="row.rule"  style="width: 200px;float: left"></el-input>
                  <img src="/static/img/alert/filter-delete.png"  @click="deleteRow2(index)" class="data-filter-col-add"  style="height: 30px;line-height: 30px;margin-left: 5px;float: left;"/>
                  <div class="my-error-tip data-filter-error" v-if="validationPhase.isValidating && (row.rule === '' )" >此处不能为空</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">保存</el-button>
          <el-button @click="resetFields">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import {alert_email_col} from 'src/pages/mirror_alert/alert_his/config/options.js'
  import rbEmailReceiverServicesFactory from 'src/services/alert/rb-emailReceiver-services.factory.js'
  export default {
    data () {
      return {
        moment: moment,
        multipleSelection: [],
        sender: '',
        receiver: '',
        active: '',
        addColVal: '',
        isValidating: false,
        alertEmailCol: [],
        detailFlag: false,
        row1List: [],
        row2List: [],
        editFlag: false,
        edit: false,
        form: {},
        filterName: '',
        filterSceneName: '',
        time_range: [],
        tableData: [],
        currentPage: 1, // 当前页
        pageSize: 30, // 分页每页多少行数据
        pageSizes: [30, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据,
        validationPhase: {
          isValidating: false,
          errorMsg: '数据未填写或填写错误,不能保存'
        },
        rules: {
          sender: [
            {required: true, message: '请输入发件人邮箱账号'},
            {type: 'email', message: '请输入正确的邮箱账号'}
          ],
          title_include: [
            {required: true, message: '请输入邮件标题'}
          ],
          content_include: [
            {required: true, message: '请输入邮件内容'}
          ]
        }
      }
    },
    mounted () {
      this.alertEmailCol = alert_email_col
      this.receiver = this.$route.query.receiver
      /* let opt = this.$route.query.filterNameParam
      let filterId = this.$route.query.filterId */
      this.search()
    },
    methods: {
      initData () {
        let row1 = {
          name: '设备ip',
          isLevel: false,
          rule: '',
          content: '',
          code: 'device_ip',
          type: '2',
          flag: false
        }
        let row2 = {
          name: '告警时间',
          isLevel: false,
          rule: '',
          content: '',
          code: 'cur_moni_time',
          type: '2',
          flag: false
        }
        let row3 = {
          name: '告警指标',
          isLevel: false,
          rule: '',
          content: '',
          code: 'moni_object',
          type: '2',
          flag: false
        }
        let row4 = {
          name: '告警描述',
          isLevel: false,
          rule: '',
          content: '',
          code: 'moni_index',
          type: '2',
          flag: false
        }
        let row5 = {
          name: '告警级别',
          rule: '',
          content: '',
          code: 'alert_level',
          level: '',
          isLevel: true,
          type: '2',
          flag: false
        }
        this.row1List.push(row1)
        this.row1List.push(row2)
        this.row1List.push(row3)
        this.row1List.push(row4)
        this.row1List.push(row5)
        this.$forceUpdate()
      },
      gotoScene (id) {
        this.$router.push({path: '/mirror_alert/emailInfo_receive/receiver-config/collection/', query: {filter_id: id}})
      },
      deleteRow2 (index) {
        this.row2List.splice(index, 1)
        this.$forceUpdate()
      },
      sourceChange (row, index) {
        row.content = ''
      },
      resetFields () {
        this.addColVal = ''
        this.editFlag = false
        this.row1List = []
        this.row2List = []
        this.validationPhase.isValidating = false
        this.$refs['form'].resetFields()
      },
      submitForm () {
        this.validationPhase.isValidating = true
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.validate()
          }
        })
      },
      validate () {
        this.validationPhase.errorMsg = '数据未填写或填写错误,不能保存'
        this.$nextTick(() => {
          this.transformData()
        })
      },
      transformData () {
        let strategyRequestList = []
        let rowList = this.row1List.concat(this.row2List)
        for (let i = 0; i < rowList.length; i++) {
          let strategy = {}
          let row = rowList[i]
          strategy.use_reg = row.flag ? 1 : 0
          if (row.content === '') {
            this.$message.warning(this.validationPhase.errorMsg)
            return
          }
          if (row.type === '2') {
            if (row.rule === '') {
              this.$message.warning(this.validationPhase.errorMsg)
              return
            }
            strategy.mail_field = row.content
          } else {
            strategy.field_match_value = row.content
            strategy.mail_field = -1
            strategy.use_reg = 0
          }
          if (row.isLevel && row.type === '2') {
            if (row.level === '') {
              this.$message.warning(this.validationPhase.errorMsg)
              return
            }
            strategy.field_match_target = row.level
            strategy.field_match_value = row.rule
          } else {
            strategy.field_match_reg = row.rule
          }
          strategy.alert_field = row.code
          strategyRequestList.push(strategy)
        }
        this.form.strategies = strategyRequestList
        this.form.receiver = this.receiver
        if (this.form.active) {
          this.form.active = 1
        } else {
          this.form.active = 0
        }
        if (this.edit) {
          rbEmailReceiverServicesFactory.update(this.form).then((res) => {
            this.resetFields()
            this.currentPage = 1
            this.$message.success('修改成功')
            this.$nextTick(() => {
              this.search()
            })
          }).catch(() => {
            this.$message.error('修改失败')
          })
        } else {
          rbEmailReceiverServicesFactory.create(this.form).then((res) => {
            this.resetFields()
            this.currentPage = 1
            this.$message.success('新增成功')
            this.$nextTick(() => {
              this.search()
            })
          }).catch((e) => {
            this.$message.error('新增失败')
          })
        }
      },
      reset () {
        this.sender = ''
        this.active = ''
        this.time_range = []
      },
      deleteRow (index) {
        this.row2List.splice(index, 1)
      },
      addRow2 () {
        if (this.addColVal === null || this.addColVal === '') {
          return
        }
        let addColValTemp = this.addColVal
        let temp = this.row2List.find(function (r) {
          return r.code === addColValTemp
        })
        if (temp !== null && temp !== undefined) {
          this.$message.warning('请不要重复添加！')
          return
        }
        let col = this.alertEmailCol.find(function (o) {
          return o.code === addColValTemp
        })
        let row = {
          name: col.name,
          isLevel: false,
          code: col.code,
          rule: '',
          content: '',
          type: '2'
        }
        this.row2List.push(row)
        this.$forceUpdate()
      },
      openUpdate (id) {
        this.form = {}
        rbEmailReceiverServicesFactory.getByKey(id).then((res) => {
          let cols = res.strategies
          this.getEditRowData(cols)
          this.form = res
          if (res.active === 1) {
            this.form.active = true
          }
          this.$forceUpdate()
          this.editFlag = true
          this.edit = true
        })
      },
      getEditRowData (cols) {
        this.initData()
        this.row1List.forEach(item => {
          let obj = {}
          let index = -1
          for (let i = 0; i < cols.length; i++) {
            let o = cols[i]
            if (item.code === o.alert_field) {
              obj = o
              index = i
              break
            }
          }
          if (index !== -1) {
            if (item.code === 'alert_level') {
              item.isLevel = true
            } else {
              item.isLevel = false
            }
            if (obj.use_reg === '0') {
              item.flag = false
            } else {
              item.flag = true
            }
            if (obj.field_match_value) {
              // 自定义
              if (obj.field_match_target) {
                item.type = '2'
                item.rule = obj.field_match_value
                item.content = obj.mail_field + ''
                item.level = obj.field_match_target
              } else {
                item.type = '1'
                item.content = obj.field_match_value
              }
            } else {
              item.type = '2'
              item.content = obj.mail_field + ''
              item.rule = obj.field_match_reg
            }
            cols.splice(index, 1)
          }
        })
        cols.forEach(col => {
          let row = {
            isLevel: false,
            code: col.alert_field
          }
          let emailCol = this.alertEmailCol.find(function (r) {
            return r.code === col.alert_field
          })
          if (emailCol !== undefined) {
            row.name = emailCol.name
            if (col.use_reg === '0') {
              row.flag = false
            } else {
              row.flag = true
            }
            if (col.field_match_value) {
              row.type = '1'
              row.content = col.field_match_value
            } else {
              row.type = '2'
              row.content = col.mail_field + ''
              row.rule = col.field_match_reg
            }
            this.row2List.push(row)
          }
        })
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.search()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.search()
      },
      search () {
        let page = {
          page_no: this.currentPage,
          page_size: this.pageSize,
          receiver: this.receiver,
          sender: this.sender,
          active: this.active
        }
        if (!this.active) {
          page.active = '-1'
        }
        if (this.time_range !== null && this.time_range.length > 1) {
          page.send_time_start = this.time_range[0]
          page.send_time_end = this.time_range[1]
        }

        rbEmailReceiverServicesFactory.getList(page).then((res) => {
          this.tableData = res.result
          this.total = res.count
        }).catch(() => {
          this.$message.error('查询失败')
        })
        this.tableData.push({times: 0})
      },
      // 1 element相关方法 多选框
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      deleteBatch () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警接入进行清除', '警告', {
            confirmButtonText: '确定'
          })
          return
        }
        this.$confirm('删除告警接入?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = ''
          this.multipleSelection.forEach(item => {
            if (!ids) {
              ids = item.id
            } else {
              ids += ',' + item.id
            }
          })
          rbEmailReceiverServicesFactory.delete(ids).then((res) => {
            this.$message.success('删除成功')
            this.search()
          }).catch(() => {
            this.$message.error('删除失败')
          })
        })
      },
      detail (id) {
        this.$router.push({path: '/mirror_alert/filter/scene/add/', query: {sceneId: id, detail: 'detail'}})
      },
      create () {
        this.edit = false
        this.form = {}
        this.editFlag = true
        this.initData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    .time-range {
      width: 36%;
      min-width: 403px;
      margin-left: 1%;
      height: 34px;
      /*line-height: 32px;*/
      padding: 0 15px;
      /deep/ .el-range-input {
        height: 32px;
        line-height: 32px;
        bottom: 4px;
      }
    }
    header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .head {
        width:100%;
        text-align:left;
        .task-name {
          display: inline-block;
          margin-left: 2.7%;
        }
        .head-type {
          margin-left: 2.9%;
          display: inline-block;
        }
        .input-tem-name1 {
          width: 8.7%;
          min-width:102px;
          margin-left: 1%;
        }
        .list-sel {
          width: 8.7%;
          min-width:102px;
          margin-left: 1%;
          display: inline-block;
        }
      }
      .dataTime {
        width:100%;
        text-align:left;
        display: block;
        .task-name {
          display: inline-block;
          margin-left: 2.7%;
          width:70px;
        }
        .input-tem-name1 {
          width: 10%;
          min-width:150px;
          margin-left: 1%;
        }
        div {
          display: inline-block;
        }

        .creat-time {
          margin-left: 2.9%;
        }
      }
    }
    .body-container {
      border: 2px solid #f0f0f0;
      margin-top: 10px;
      padding: 10px 5px;
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td:nth-child(1) {
        background: #fff
      }

      /deep/ .el-table .el-table__body-wrapper .warning-tip td:nth-child(2){
        background: #f0f9eb;
        border-bottom: 1px solid #f0f9eb;
      }
      /deep/ .el-table .el-table__body-wrapper .warning-di td:nth-child(2){
        background: oldlace;
        border-bottom: 1px solid oldlace;
      }
      /deep/ .el-table .el-table__body-wrapper .warning-zhong td:nth-child(2){
        background: #FFD700;
        border-bottom: 1px solid #FFD700;      }
      /deep/ .el-table .el-table__body-wrapper .warning-gao td:nth-child(2){
        background: #E6A23C;
        border-bottom: 1px solid #E6A23C;
      }
      /deep/ .el-table .el-table__body-wrapper .warning-max td:nth-child(2){
        background: #F56C6C;
        border-bottom: 1px solid #F56C6C;
      }
      .el-button {
        height: 30px;
        width: 105px;
        padding: 8px 15px;
        margin-left: 20px;
      }
      .el-button:nth-child(1) {
        margin-left: 0;
      }
      .block {
        margin-top: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .dialog {
      /deep/ .el-dialog {
        min-width:670px;
      }
      .col {
        text-align:center;
      }
    }
    .alertNotice {
      /deep/ .el-dialog {
        min-width:540px;
      }
    }
    .my-error-tip {
      color: #ff4949;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
    }
    .data-filter-error {
      top: 37px;
    }
  }
  .cursor{cursor:pointer;}
  .el-row{margin-bottom: 0px;}
</style>
