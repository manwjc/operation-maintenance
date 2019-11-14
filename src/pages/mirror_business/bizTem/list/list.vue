<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="模板名称">
        <el-input v-model="name"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
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

    <el-form class="yw-form"
             >
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
        <el-table class="yw-el-table"
                  :data="tableData"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 275px)"
                  @selection-change="handleSelectionChange"
                  :default-sort="{prop: 'create_time', order: 'descending'}">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="name"
                           label="模板名称">
          </el-table-column>
          <el-table-column prop="description"
                           label="模板描述">
          </el-table-column>

          <el-table-column prop="items"
                           label="关联指标项">
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

  </div>

</template>

<script>
import { typeOptions } from '../config/options.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
// import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'

export default {
  name: '/mirror_business/bizTem/list',
  data () {
    return {
      name: '',
      time_range: [],
      // 巡检类型的选项
      options: [],
      // 巡检类型下拉框的值
      type: '',
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
    // 封装列表数据
    packData (arr) {
      arr.forEach((item) => {
        if (item.create_time) {
          item.create_time = formatDate(item.create_time)
        }
      })
      return arr
    },
    // 模板的增删改查
    getList (obj) {
      let obj1 = {
        page_no: this.currentPage,
        page_size: this.pageSize,
        mon_type: '2',
        fun_type: '1'
      }
      if (obj) {
        obj = Object.assign(obj, obj1)
      } else {
        obj = obj1
      }
      rbProjectDataServiceFactory.getList(obj).then((res) => {
        this.tableData = this.packData(res.result)
        this.total = res.count
      })
    },
    // 业务逻辑
    search (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      let obj = {
        'name': this.name,
        'create_time_start': this.time_range ? this.time_range[0] : '',
        'create_time_end': this.time_range ? this.time_range[1] : ''
      }
      this.getList(obj)
    },
    reset () {
      this.name = ''
      this.time_range = []
    },
    goAdd () {
      this.$root.$children[0].$children[0].reload()
      this.$router.push('add')
    },
    update () {
      if (this.multipleSelection.length > 1) {
        this.$alert('一次只能修改一个模板', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        this.$root.$children[0].$children[0].reload()
        this.$store.commit('updateTemplate', this.multipleSelection[0].template_id)
        this.$router.push('update')
      }
    },
    del () {
      let bool = true
      this.multipleSelection.forEach((item) => {
        if (item.task_num > 0) {
          bool = false
        }
      })
      if (bool) {
        this.$confirm('确认删除？').then(() => {
          let str = ''
          this.multipleSelection.forEach((item) => {
            str += item.template_id
            str += ','
          })
          let str1 = str.slice(0, -1)
          let obj = {
            'template_ids': str1
          }
          rbProjectDataServiceFactory.delete(obj).then((res) => {
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message.error('删除失败')
          })
        }).catch(() => {

        })
      } else {
        this.$alert('删除模板中包含已关联任务的模板', '消息', {
          confirmButtonText: '确定'
        })
      }
    },
    copy () {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (i !== this.multipleSelection.length - 1) {
          rbProjectDataServiceFactory.copy(this.multipleSelection[i].template_id).then(() => {
            this.$message({
              message: '拷贝成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message.error('拷贝失败')
          })
        } else {
          rbProjectDataServiceFactory.copy(this.multipleSelection[i].template_id).then(() => {
            this.getList()
            this.$message({
              message: '拷贝成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message.error('拷贝失败')
          })
        }
      }
    }
  },
  mounted () {
    this.options = typeOptions
    this.getList()
    // this.tableData = this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
.component-container {
  width: 100%;
  height: calc(100% - 58px - 48px);
  padding: 14px 14px 0px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f4f4f4;
  header {
    height: 140px;
    //border:2px solid #dfdfdf;
    border: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .head {
      width: 100%;
      text-align: center;
      .template-name {
        display: inline-block;
      }
      .moni-type {
        margin-left: 2.9%;
        display: inline-block;
      }
      .input-tem-name1 {
        width: 8.7%;
        min-width: 102px;
        margin-left: 1%;
      }
      .list-sel {
        width: 8.7%;
        min-width: 102px;
        margin-left: 1%;
        display: inline-block;
      }
      div {
        display: inline-block;
      }
      .time-range {
        width: 36%;
        min-width: 403px;
        margin-left: 1%;
        height: 34px;
        line-height: 32px;
        padding: 0 15px;
      }
      .creat-time {
        margin-left: 2.9%;
      }
      .but {
        min-width: 58px;
        width: 6%;
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
      width: 80px;
      padding: 8px 15px;
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
