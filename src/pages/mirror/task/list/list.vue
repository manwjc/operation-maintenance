<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="75px">
      <el-form-item label="任务名称">
        <el-input v-model="name"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="巡检模板项">
        <el-select v-model="moni_template_items_value"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in moni_template_items"
                     :key="item.template_id"
                     :label="item.name"
                     :value="item.template_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="type"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in task_type"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行时间">
        <el-date-picker v-model="time_range"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>

      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="goAdd()">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="update">修改</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="del">清除</el-button>
        <el-button type="text"
                   icon="fa fa-clone"
                   @click="copy">拷贝</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 300px)"
                  @selection-change="handleSelectionChange"
                  :default-sort="{prop: 'create_time', order: 'descending'}">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="name"
                           label="模板名称"
                           sortable>
          </el-table-column>
          <el-table-column prop="description"
                           label="模板描述">
          </el-table-column>
          <el-table-column prop="task_num"
                           label="关联任务数"
                           sortable>
          </el-table-column>
          <el-table-column prop="mon_type"
                           label="模板类型">
          </el-table-column>
          <el-table-column prop="type"
                           label="巡检类型">
          </el-table-column>
          <el-table-column prop="items"
                           label="关联监控项">
          </el-table-column>
          <el-table-column prop="create_time"
                           label="创建时间"
                           sortable>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->

    <!-- dialog -->
  </div>
  <!-- <div class="component-container">
    <header>
      <div class="head">
        <div class="task-name">任务名称：</div>
        <el-input v-model="name" placeholder="请输入内容" class="input-tem-name1"></el-input>
        <div class="head-type">巡检模板项：</div>
        <el-select v-model="moni_template_items_value" placeholder="请选择" class="list-sel" clearable>
          <el-option
            v-for="item in moni_template_items"
            :key="item.template_id"
            :label="item.name"
            :value="item.template_id">
          </el-option>
        </el-select>
        <div class="head-type">任务类型：</div>
        <el-select v-model="type" placeholder="请选择" class="list-sel" clearable>
          <el-option
            v-for="item in task_type"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="dataTime">
        <div class="creat-time">运行时间：</div>
        <el-date-picker
          v-model="time_range"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="time-range"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-button class="tem-search task-list-button" type="primary" @click="search">查询</el-button>
        <el-button class="tem-search" type="primary" @click="reset">重置</el-button>
      </div>
    </header>
    <div class="body-container">
      <el-button type="primary" @click="goAdd">新增</el-button>
      <el-button type="primary" @click="update">修改</el-button>
      <el-button type="primary" @click="del">删除</el-button>
      <el-button type="primary" @click="goDetails">查看任务详情</el-button>
      <el-button type="primary" @click="execute">立即执行</el-button>
      <el-button type="primary" @click="addSchedu">添加调度</el-button>
      <el-button type="primary" @click="stopSchedu">停止调度</el-button>
      <el-button type="primary" @click="goResult">查看巡检结果</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top:15px"
        @selection-change="handleSelectionChange"
        :default-sort = "{prop: 'create_time', order: 'descending'}">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="任务名称"
          align="center"
          sortable>
        </el-table-column>
        <el-table-column
          prop="template_names"
          label="巡检模板项"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          label="任务类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="exec_time"
          label="执行时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="range"
          label="巡检范围"
          align="center">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center"
          sortable>
        </el-table-column>
        <el-table-column
          prop="recent_run_time"
          label="最近运行时间"
          align="center"
          sortable>
        </el-table-column>
        <el-table-column
          prop="sta"
          label="运行状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sta === '执行中'" style="color: #67c23a">{{scope.row.sta}}</span>
            <span v-else-if="scope.row.sta== '调度中'" style="color: #67c23a">{{scope.row.sta}}</span>
            <span v-else-if="scope.row.sta== '未执行'" style="color: #409eff">{{scope.row.sta}}</span>
            <span v-else-if="scope.row.sta== '未调度'" style="color: #409eff">{{scope.row.sta}}</span>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
  </div> -->
</template>

<script>
// import rbHttp from '../../../../assets/js/utility/rb-http.factory.js'
import { task_type } from '../config/options.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'

export default {
  data () {
    return {
      task_type: '',
      type: '',
      name: '',
      moni_template_items: '',
      moni_template_items_value: '',
      time_range: [],
      // 多选框模板存放的值
      multipleSelection: [],
      tableData: [],
      // 当前页
      currentPage: 1,
      // 分页每页多少行数据
      pageSize: 5,
      // 每页多少行数组
      pageSizes: [5, 10, 20],
      // 总共多少行数据
      total: 0
    }
  },
  methods: {
    // 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search(1)
    },
    // 封装数据
    packData (arr) {
      arr.forEach((item) => {
        item.type = rbMirrorCommonService.getTaskType(item.type)
        item.exec_time = rbMirrorCommonService.getListExecTime(item.cycle, item.exec_time)
        if (item.create_time) {
          item.create_time = formatDate(item.create_time)
        }
        if (item.recent_run_time) {
          item.recent_run_time = formatDate(item.recent_run_time)
        }
        item.sta = item.status === 'ON' ? (item.type === '手动' ? '执行中' : '调度中') : (item.type === '手动' ? '未执行' : '未调度')
      })
      return arr
    },
    // 数据来源
    getTableData (obj) {
      let obj1 = {
        page_no: this.currentPage,
        page_size: this.pageSize
      }
      if (obj) {
        obj = Object.assign(obj, obj1)
      } else {
        obj = obj1
      }
      rbProjectDataServiceFactory.getTaskList(obj).then((res) => {
        this.tableData = this.packData(res.result)
        this.total = res.count
      })
    },
    // 模板数据来源
    templateData () {
      rbProjectDataServiceFactory.getList().then((res) => {
        this.moni_template_items = res.result
      })
    },
    // 业务逻辑
    reset () {
      this.type = ''
      this.name = ''
      this.moni_template_items_value = ''
      this.time_range = []
    },
    // 任务的增删改查
    goAdd () {
      this.$root.$children[0].$children[0].reload()
      this.$router.push('add')
    },
    update () {
      if (this.multipleSelection.length < 1) {
        this.$alert('请先选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length >= 2) {
        this.$alert('只能选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length === 1) {
        if (this.multipleSelection[0].status === 'ON') {
          if (this.multipleSelection[0].type === '自动') {
            this.$alert('已被调度的任务不能修改', '警告', {
              confirmButtonText: '确定'
            })
          } else if (this.multipleSelection[0].type === '手动') {
            this.$alert('已被执行的任务不能修改', '警告', {
              confirmButtonText: '确定'
            })
          }
        } else {
          this.$root.$children[0].$children[0].reload()
          this.$store.commit('updateDetail', this.multipleSelection[0].task_id)
          this.$router.push('update')
        }
      }
    },
    goDetails () {
      if (this.multipleSelection.length <= 0) {
        this.$alert('请勾选查看对象', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length >= 2) {
        this.$alert('只能选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        let str = this.multipleSelection[0].task_id
        this.$store.commit('taskDetail', str)
        this.$store.commit('taskState', true)
        this.$router.push('/mirror/exec/taskExec')
      }
    },
    addSchedu () {
      if (this.multipleSelection.length < 1) {
        this.$alert('请先选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length >= 2) {
        this.$alert('只能选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        if (this.multipleSelection[0].type === '手动') {
          this.$alert('只有自动类型才能调度', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          if (this.multipleSelection[0].status === 'ON') {
            this.$alert('此任务已被调度', '警告', {
              confirmButtonText: '确定'
            })
          } else if (this.multipleSelection[0].status === 'OFF') {
            let str = this.multipleSelection[0].task_id
            rbProjectDataServiceFactory.addScheduling(str).then((res) => {
              if (res) {
                this.getTableData()
                this.$message({
                  message: '调度成功',
                  type: 'success'
                })
              }
            }).catch(() => {
              this.getTableData()
              this.$message.error('调度失败')
            })
          }
        }
      }
    },
    stopSchedu () {
      if (this.multipleSelection.length < 1) {
        this.$alert('请先选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length >= 2) {
        this.$alert('只能选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        if (this.multipleSelection[0].type === '手动') {
          this.$alert('只有自动类型才能调度', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          if (this.multipleSelection[0].status === 'OFF') {
            this.$alert('此任务未被调度', '警告', {
              confirmButtonText: '确定'
            })
          } else if (this.multipleSelection[0].status === 'ON') {
            let str = this.multipleSelection[0].task_id
            rbProjectDataServiceFactory.stopScheduling(str).then((res) => {
              if (res) {
                this.getTableData()
                this.$message({
                  message: '停止调度成功',
                  type: 'success'
                })
              }
            }).catch(() => {
              this.getTableData()
              this.$message.error('停止调度失败')
            })
          }
        }
      }
    },
    execute () {
      if (this.multipleSelection.length < 1) {
        this.$alert('请先选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length >= 2) {
        this.$alert('只能选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        if (this.multipleSelection[0].type === '自动') {
          this.$alert('只有手动类型才能立即执行', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          if (this.multipleSelection[0].status === 'ON') {
            this.$alert('此任务已被执行', '警告', {
              confirmButtonText: '确定'
            })
          } else {
            let str = this.multipleSelection[0].task_id
            rbProjectDataServiceFactory.execute(str).then((res) => {
              if (res) {
                this.getTableData()
                this.$message({
                  message: '立即执行成功',
                  type: 'success'
                })
              }
            }).catch(() => {
              this.getTableData()
              this.$message.error('立即执行失败')
            })
          }
        }
      }
    },
    // 查看任务详情
    goResult () {
      if (this.multipleSelection.length <= 0) {
        this.$alert('请勾选查看对象', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length >= 2) {
        this.$alert('只能选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        let str = this.multipleSelection[0].task_id
        this.$store.commit('taskDetail', str)
        this.$store.commit('taskState', true)
        this.$router.push('/mirror/exec/taskExec')
      }
    },
    search (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      let obj = {
        name: this.name,
        type: rbMirrorCommonService.getDaoTaskType(this.type),
        exec_time_start: this.time_range ? this.time_range[0] : '',
        exec_time_end: this.time_range ? this.time_range[1] : '',
        template_id: this.moni_template_items_value
      }
      if (rbMirrorCommonService.getDaoTaskType(this.type) === '0') {
        obj.type = ''
      }
      this.getTableData(obj)
    },
    del () {
      if (this.multipleSelection.length < 1) {
        this.$alert('请先选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length >= 2) {
        this.$alert('只能选择一个任务', '警告', {
          confirmButtonText: '确定'
        })
      } else if (this.multipleSelection.length === 1) {
        if (this.multipleSelection[0].status === 'ON') {
          if (this.multipleSelection[0].type === '自动') {
            this.$alert('已被调度的任务不能删除', '警告', {
              confirmButtonText: '确定'
            })
          } else if (this.multipleSelection[0].type === '手动') {
            this.$alert('已被执行的任务不能删除', '警告', {
              confirmButtonText: '确定'
            })
          }
        } else {
          this.$confirm('确认删除？').then(() => {
            rbProjectDataServiceFactory.deleteTask(this.multipleSelection[0].task_id).then(() => {
              this.getTableData()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message.error('删除失败')
            })
          }).catch(() => {
          })
        }
      }
    }
  },
  mounted () {
    this.getTableData()
    this.templateData()
    this.task_type = task_type
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
      width: 100%;
      text-align: left;
      .task-name {
        display: inline-block;
        margin-left: 4.7%;
      }
      .head-type {
        margin-left: 7.8%;
        display: inline-block;
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
      width: 100%;
      text-align: left;
      display: block;
      div {
        display: inline-block;
      }
      .time-range {
        height: 34px;
        line-height: 32px;
        padding: 0 15px;
      }
      .creat-time {
        margin-left: 4.7%;
      }
      .task-list-button {
        margin-left: 2%;
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
      width: 105px;
      min-width: 105px;
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
}
</style>
