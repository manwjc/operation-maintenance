<template>
  <div class="component-container">
    <header>
      <div class="head">
        <el-form :model="template" :rules="rules1" ref="ruleform">
          <el-form-item prop="name" label="巡检任务名称：" class="add-tit" label-width="140px">
            <el-input v-model="template.name" placeholder="请输入内容" class="input-tem-name1"></el-input>
          </el-form-item>
          <el-form-item prop="receivers" label="巡检结果发送：" class="add-tit" label-width="140px">
            <el-input v-model="template.receivers" placeholder="请输入内容" class="input-tem-name1" readonly></el-input>
            <el-button class="sel-user" type="primary" @click="selUser">选择用户</el-button>
          </el-form-item>
          <el-form-item prop="type" label="任务类型：" class="add-tit" label-width="110px">
            <el-select v-model="template.type" placeholder="请选择" class="list-sel">
              <el-option
                v-for="item in task_type"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!--         <div class="task-name">巡检任务名称：</div>
                <el-input v-model="name" placeholder="请输入内容" class="input-tem-name"></el-input> -->
        <!-- <div class="head-type">巡检结果发送：</div>
        <el-input v-model="receivers" placeholder="请输入内容" class="input-tem-name" readonly></el-input>
        <el-button class="sel-user" type="primary" @click="selUser">选择用户</el-button>
        <div class="head-type">任务类型：</div>
        <el-select v-model="type" placeholder="请选择" class="list-sel">
            <el-option
              v-for="item in task_type"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
        </el-select> -->
      </div>
      <div class="dataTime">
        <div class="head-type rule">周期类型：</div>
        <el-select v-model="cycle" placeholder="请选择" class="list-sel" :disabled="selected">
          <el-option
            v-for="item in cycle_type"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>

        <div class="creat-time rule">执行时间：</div>
        <div v-if=' cycle == "" '>
          <el-input placeholder="请输入内容" class="input-creat-time" disabled prefix-icon="el-icon-time" key="1"></el-input>
        </div>

        <div v-if=' cycle == "自定义" ' style="position:relative">
          <el-input v-model="exec_time" placeholder="请输入cron表达式" class="input-creat-time zidingyi" @change="cronVal"
                    ref="cron" suffix-icon="el-icon-warning"></el-input>
          <span class="cron" ref="cronText">请输入6位数正确的cron表达式</span>
        </div>

        <div v-if=' cycle == "分钟" '>
          <el-input-number v-model="exec_time" controls-position="right" :min="1" :max="60"
                           size="small"></el-input-number>
        </div>

        <div v-if=' cycle == "小时" '>
          <el-input-number v-model="exec_time" controls-position="right" :min="1" :max="60"
                           size="small"></el-input-number>
        </div>

        <div v-if=' cycle == "日" '>
          <el-time-picker
            v-model="exec_time"
            placeholder="选择日期时间"
            class="input-creat-time data-inp1"
            format="HH:mm">
          </el-time-picker>
        </div>

        <div v-if=' cycle == "周" '>
          <el-select v-model="zhou" placeholder="请选择" class="list-sel" style="width:100px">
            <el-option
              v-for="item in zhou_type"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-time-picker
            v-model="exec_time"
            placeholder="选择时间"
            class="input-creat-time data-inp1"
            format="HH:mm"
            style="width:136px">
          </el-time-picker>
        </div>

        <div v-if=' cycle == "月" '>
          <el-select v-model="yue" placeholder="请选择" class="list-sel" style="width:100px">
            <el-option
              v-for="item in yue_type"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-time-picker
            v-model="exec_time"
            placeholder="选择时间"
            class="input-creat-time data-inp1"
            format="HH:mm"
            style="width:136px">
          </el-time-picker>
        </div>
      </div>
    </header>
    <div class="body-container">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button type="primary" @click="del">删除</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top:15px"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          prop="template_name"
          label="模板名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="模板关联"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editTemplate(scope.row, scope.$index)">模板编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="devices_ip_more"
          label="关联对象"
          align="center">
        </el-table-column>
        <el-table-column
          label="对象关联"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editDevices(scope.row)" v-if="scope.row.mon_type === '系统模板'">设备编辑</el-button>
            <el-button type="text" @click="editDevices(scope.row)" v-else-if="scope.row.mon_type === '业务模板' ? getBizname(scope.row) : false" disabled>业务编辑</el-button>
            <el-button type="text" @click="editDevices(scope.row)" v-else>对象编辑</el-button>
          </template>
          <template>11</template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="选择用户"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      class="sel-dialog"
      :before-close="handleClose"
      width="50%">
      <div class="sel-name">用户名：</div>
      <el-input v-model="userName" placeholder="请输入用户名" class="input-sel-name"></el-input>
      <el-button class="tem-search" type="primary" @click="userSearch">查询</el-button>
      <el-table
        :data="tableData1"
        style="marginTop:20px"
        @selection-change="handleSelectionChange1"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="updated_at"
          label="更新时间"
          align="center">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="tem-search1" width="auto">取 消</el-button>
        <el-button type="primary" @click="goUser" class="tem-search1" width="auto">确 定</el-button>
      </span>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-dialog>

    <footer>
      <el-button class="" type="primary" @click="save">保存</el-button>
      <el-button class="" type="primary" @click="reset">重置</el-button>
    </footer>
  </div>
</template>

<script>
  // import rbHttp from '../../../../assets/js/utility/rb-http.factory.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import {cronValidate} from 'src/assets/js/utility/cron.js'
  import {task_type1, cycle_type, zhou_type, yue_type} from '../config/options.js'
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'

  export default {
    data () {
      var validateName = (rule, value, callback) => {
        let reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
        if (reg.test(value)) {
          callback(new Error('请输入中文英文数字'))
        } else {
          rbProjectDataServiceFactory.getTaskList({'name': this.template.name}).then((res) => {
            if (res.result.length > 0) {
              res.result.forEach((item) => {
                if (item.name === this.template.name) {
                  callback(new Error('任务名重复'))
                }
              })
            }
            callback()
          })
        }
      }
      return {
        template: {
          name: '',
          receivers: '',
          type: ''
        },
        task_type: '',
        cycle_type: '',
        cycle: '',
        exec_time: '',
        selected: false,
        zhou: '',
        zhou_type: [],
        yue: '',
        yue_type: [],
        tableData: [],
        // 多选框模板存放的值
        multipleSelection: [],
        // 选择用户的多选框值
        multipleSelection1: [],
        dialogVisible: false,
        tableData1: [],
        // 选择用户时的相关数据
        userName: '',
        // 当前页
        currentPage: 1,
        // 分页每页多少行数据
        pageSize: 5,
        // 每页多少行数组
        pageSizes: [5, 10, 20],
        // 总共多少行数据
        total: 0,
        // arr:[1,2,3,4,5,6]
        loading: true,
        rules1: {
          name: [
            {required: true, message: '请输入任务名称', trigger: 'blur'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur'},
            {validator: validateName, trigger: 'blur'}
          ],
          receivers: [
            {required: true, message: '请选择接收人', trigger: 'change'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择任务类型', trigger: 'change'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      // 多选框 element
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSelectionChange1 (val) {
        this.multipleSelection1 = val
      },
      handleSizeChange (val) {
        this.pageSize = val
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
      },
      handleClose (done) {
        done()
      },
      // 业务逻辑
      editTemplate (obj, num) {
        this.num_obj = num
        // 将vuex的指引和当前对象指引为同一个然后进行修改
        this.$store.commit('editTemplate', obj)
        this.$router.push('add/editTemplate')
      },
      editDevices (obj) {
        if (obj.template_id !== -1) {
          this.$store.commit('editDevices', obj)
          this.$router.push('add/editDevices')
        } else {
          this.$alert('请先选择一个模板', '警告', {
            confirmButtonText: '确定'
          })
        }
      },
      saveData () {
        let arr = []
        this.tableData.forEach((item) => {
          let obj = {
            template_id: item.template_id,
            object_ids: item.instanceId,
            object_type: item.mon_type === '业务模板' ? '2' : '1'
          }
          arr.push(obj)
        })
        let obj = {
          name: this.template.name,
          // 此处是否必填有待确认
          receivers: this.template.receivers,
          type: rbMirrorCommonService.getDaoTaskType1(this.template.type),
          exec_time: this.packTime(),
          cycle: rbMirrorCommonService.getDaoCycleType(this.cycle),
          object_list: arr
        }
        rbProjectDataServiceFactory.creatTask(obj).then((res) => {
          if (res.task_id) {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
          }
          this.$router.push('list')
        }).catch(() => {
          this.$message.error('创建失败')
        })
      },
      save () {
        this.$refs['ruleform'].validate((valid) => {
          if (valid) {
            if (this.template.type === '手动') {
              if (this.ruleList()) {
                this.saveData()
              }
            } else {
              if (this.cycle === '' || this.exec_time === '' || this.exec_time === null) {
                this.$alert('自动任务需填写周期类型和执行时间', '警告', {
                  confirmButtonText: '确定'
                })
              } else {
                if (this.cycle === '月') {
                  if (this.yue === '') {
                    this.$alert('请填写每月日期', '警告', {
                      confirmButtonText: '确定'
                    })
                  } else if (this.ruleList()) {
                    this.saveData()
                  }
                } else if (this.cycle === '周') {
                  if (this.zhou === '') {
                    this.$alert('请填写每周日期', '警告', {
                      confirmButtonText: '确定'
                    })
                  } else if (this.ruleList()) {
                    this.saveData()
                  }
                } else if (this.cycle === '自定义') {
                  if (cronValidate(this.exec_time)) {
                    if (this.ruleList()) {
                      this.saveData()
                    }
                  } else {
                    this.$alert('请填写正确的cron表达式', '警告', {
                      confirmButtonText: '确定'
                    })
                  }
                } else {
                  if (this.ruleList()) {
                    this.saveData()
                  }
                }
              }
            }
          } else {
            this.$alert('请正确填写相关选项', '警告', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      reset () {
        this.template.name = ''
        this.template.receivers = ''
        this.template.type = ''
        this.cycle = ''
        this.zhou = ''
        this.yue = ''
        this.exec_time = ''
      },
      add () {
        this.tableData.push({
          template_id: -1,
          template_name: '',
          // 需要在这设置属性名为空否则后面添加属性无法动态(业务与系统的名称)
          devices_ip_more: '',
          instanceId: ''
        })
      },
      del () {
        this.multipleSelection.forEach((item) => {
          let index = this.tableData.indexOf(item)
          this.tableData.splice(index, 1)
        })
      },
      selUser () {
        this.dialogVisible = true
        this.selUserData()
      },

      // 选择用户树相关方法
      selUserData () {
        // namespace在这里设置
        const namespace = sessionStorage.getItem('namespace')
        let arr = [namespace, {
          order_by: '-createTime',
          page_size: this.pageSize,
          page: this.currentPage
        }]
        rbProjectDataServiceFactory.getUserList(arr).then((res) => {
          this.tableData1 = res.result
          this.tableData1.forEach((item) => {
            item.created_at = formatDate(item.created_at)
            item.updated_at = formatDate(item.updated_at)
          })
          this.total = res.count
          this.loading = false
        }).watch(() => {
          this.loading = false
        })
      },
      userSearch () {
        this.loading = true
        let arr = ['alauda', {
          order_by: '-createTime',
          page_size: this.pageSize,
          page: this.currentPage,
          username: this.userName
        }]
        rbProjectDataServiceFactory.getUserList(arr).then((res) => {
          this.tableData1 = res.result
          this.tableData1.forEach((item) => {
            item.created_at = formatDate(item.created_at)
            item.updated_at = formatDate(item.updated_at)
          })
          this.total = res.count
          this.loading = false
        }).watch(() => {
          this.loading = false
        })
      },
      goUser () {
        this.dialogVisible = false
        let str = ''
        this.multipleSelection1.forEach((res) => {
          str += res.username + ','
        })
        str = str.slice(0, -1)
        this.template.receivers = str
      },

      // cron表达式
      cronVal () {
        if (!cronValidate(this.exec_time)) {
          let inp = this.$refs.cron.$el.getElementsByClassName('el-input__inner')[0]
          let span = this.$refs.cron.$el.getElementsByClassName('el-input__suffix')[0]
          inp.style.border = '1px solid #f56c6c'
          span.style.display = 'inline-block'
          this.$refs.cronText.style.display = 'block'
        } else {
          let inp = this.$refs.cron.$el.getElementsByClassName('el-input__inner')[0]
          let span = this.$refs.cron.$el.getElementsByClassName('el-input__suffix')[0]
          inp.style.border = '1px solid #dcdfe6'
          span.style.display = 'none'
          this.$refs.cronText.style.display = 'none'
        }
      },
      // 校验模板设备不能为空
      ruleList () {
        if (this.tableData.length > 0) {
          let bool = true
          this.tableData.forEach((item) => {
            if (item.instanceId === '' || item.template_id === -1) {
              if (item.instanceId === '' && item.template_id === -1) {
                this.$alert('请填充模板和对象', '警告', {
                  confirmButtonText: '确定'
                })
                bool = false
              } else if (item.instanceId === '') {
                this.$alert('请填充对象', '警告', {
                  confirmButtonText: '确定'
                })
                bool = false
              } else if (item.template_id === -1) {
                this.$alert('请填充模板', '警告', {
                  confirmButtonText: '确定'
                })
                bool = false
              }
            }
          })
          return bool
        } else {
          this.$alert('请填充至少一个模板对象', '警告', {
            confirmButtonText: '确定'
          })
          return false
        }
      },
      // 封装方法
      packTime () {
        if (this.cycle === '月') {
          let index = formatDate(this.exec_time).indexOf(' ')
          let str1 = formatDate(this.exec_time).slice(index + 1, -3)
          let yue = this.yue.slice(0, -1)
          let str = yue + '+' + str1
          return str
        } else if (this.cycle === '周') {
          let index = formatDate(this.exec_time).indexOf(' ')
          let str1 = formatDate(this.exec_time).slice(index + 1, -3)
          let zhou = rbMirrorCommonService.getDaoZhou(this.zhou)
          let str = zhou + '+' + str1
          return str
        } else if (this.cycle === '日') {
          let index = formatDate(this.exec_time).indexOf(' ')
          let str = formatDate(this.exec_time).slice(index + 1, -3)
          return str
        } else if (this.cycle === '分钟') {
          return this.exec_time
        } else if (this.cycle === '小时') {
          return this.exec_time
        } else if (this.cycle === '自定义') {
          return this.exec_time
        }
      },
      // 获取数据方法
      getBizname (obj) {
        rbProjectDataServiceFactory.detail(obj.template_id).then((res) => {
          obj.devices_ip_more = res.object_list[0].biz_name
          obj.instanceId = res.object_list[0].biz_code
        })
        return true
      }
    },
    mounted () {
      this.task_type = task_type1
      this.cycle_type = cycle_type
      this.zhou_type = zhou_type
      this.yue_type = yue_type
    },
    computed: {
      type () {
        return this.template.type
      }
    },
    watch: {
      type (newValue, oldValue) {
        if (newValue === '自动' || newValue === '全部') {
          this.selected = false
        } else if (newValue === '手动') {
          this.cycle = ''
          this.selected = true
        }
      },
      cycle (newValue) {
        if (newValue === '自定义') {
          this.$nextTick(() => {
            this.exec_time = ''
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    header {
      height: 140px;
      border: 2px solid #f0f0f0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .head {
        width:100%;
        text-align:center;
        .add-tit {
          display: inline-block;
          margin-bottom: 0px;
        }
        .task-name {
          display: inline-block;
          margin-left: 60px;
        }
        .head-type {
          margin-left: 60px;
          display: inline-block;
        }
        .sel-user {
          height: 30px;
          width: 90px;
          padding: 8px 15px;
          margin-left: 15px;
        }
        .input-tem-name1 {
          width: 150px;
        }
        .list-sel {
          width: 180px;
          display: inline-block;
        }
      }
      .dataTime {
        width:100%;
        text-align:center;
        display: block;
        .rule {
          font-size: 12px;
          color: #606266;
          font-weight: 700;
        }
        div {
          display: inline-block;
        }
        .list-sel {
          width: 180px;
          margin-left: 12px;
        }
        .creat-time {
          margin-left: 2%;
          margin-right:12px;
        }
        .task-list-button {
          margin-left: 117px;
        }
        .cron {
          position: absolute;
          top: 8px;
          left: 232px;
          width: 168px;
          color: #f56c6c;
          font-size: 12px;
          display: none;
        }
      }
    }
    .body-container {
      //border:2px solid #dfdfdf;
      border: 2px solid #f0f0f0;
      margin-top: 10px;
      padding: 10px 5px;
      .el-button {
        height: 30px;
        width: 85px;
        padding: 8px 15px;
        margin-left: 20px;
      }
      .el-button:nth-child(1) {
        margin-left: 0;
      }
    }
    footer {
      margin-top: 35px;
      text-align: center;
    }
    .sel-dialog {
      .input-sel-name {
        width: 120px;
      }
      .sel-name {
        display: inline-block;
      }
      .block {
        margin-top: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
