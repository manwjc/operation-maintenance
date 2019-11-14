<template>
  <div class="component-container">
    <header>
      <div class="head">
        <div class="template-name">巡检模板名称：</div>
        <el-input v-model="name" placeholder="请输入内容" class="input-tem-name1"></el-input>
        <div class="moni-type">巡检类型：</div>
        <el-select v-model="type" placeholder="请选择" class="list-sel" clearable>
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>

        <div class="creat-time">创建时间：</div>
        <el-date-picker
          v-model="time_range"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="time-range"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-button class="tem-search" type="primary" @click="search" style="width:6%">查询</el-button>
        <el-button class="tem-search" type="primary" @click="reset" style="width:6%">重置</el-button>
      </div>
<!--       <div class="dataTime">

      </div> -->

    </header>
        <div class="body-container">
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
            label="模板名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="description"
            label="模板描述"
            align="center">
          </el-table-column>
          <el-table-column
            prop="task_num"
            label="关联任务数"
            align="center"
            sortable>
          </el-table-column>
          <el-table-column
            prop="mon_type"
            label="模板类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="type"
            label="巡检类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="items"
            label="关联监控项"
            align="center">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            align="center"
            sortable>
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
    <footer>
      <el-button class="" type="primary" @click="determine">确定</el-button>
      <el-button class="" type="primary" @click="cancel">取消</el-button>
    </footer>
  </div>
</template>

<script>
  // import rbHttp from '../../../../assets/js/utility/rb-http.factory.js'
  import { typeOptions } from '../../../template/config/options.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'
  export default {
    data () {
      return {
        name: '',
        time_range: [],
        // 多选框模板存放的值
        multipleSelection: [],
        // 巡检类型的选项
        options: [],
        // 巡检类型下拉框的值
        type: '',
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
          item.type = rbMirrorCommonService.getType(item.type)
          item.mon_type = rbMirrorCommonService.common('MONTYPE', '1', item.mon_type) + '模板'
        })
        return arr
      },
      // 模板的增删改查
      getList (obj) {
        let obj1 = {
          page_no: this.currentPage,
          page_size: this.pageSize,
          fun_type: '2'
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
          'type': rbMirrorCommonService.getDaoType(this.type),
          'create_time_start': this.time_range[0] ? this.time_range[0] : '',
          'create_time_end': this.time_range[1] ? this.time_range[1] : ''
        }
        this.getList(obj)
      },
      reset () {
        this.name = ''
        this.type = ''
        this.time_range = []
      },
      determine () {
        if (this.multipleSelection.length > 1) {
          this.$alert('一次只能选择一个模板', '警告', {
            confirmButtonText: '确定'
          })
        } else if (this.multipleSelection.length <= 0) {
          this.$alert('请选择一个模板', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          // 将当前对象的值赋值给vuex从而让add组件改变
          let id = this.$store.state.homeStore.template.template_id
          if (this.multipleSelection[0].template_id !== id) {
            // 如果重新选择模板 那模板已关联的设备默认为空
            this.$store.commit('editDevices1', ['', ''])
            this.$store.commit('editTemplate1', this.multipleSelection[0])
            this.$router.go(-1)
          } else {
            this.$router.go(-1)
          }
        }
      },
      cancel () {
        this.$router.go(-1)
      }
    },
    mounted () {
      this.options = typeOptions
      this.getList()
      // rbHttp.getList('/api/list').then((response) => {
      //  this.tableData = response
      // })
    }
  }
</script>

<style lang="scss" scoped>
  .component-container{
    width: 100%;
      height: calc(100% - 58px - 48px);
      padding: 14px 14px 0px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #F4F4F4;
      header{
        height:140px;
        border:2px solid #f0f0f0;
        display:flex;
        align-items:center;
        flex-wrap:wrap;
        .head{
          width: 100%;
          text-align: center;
          .template-name{
            display:inline-block;
          }
          .moni-type{
            margin-left: 1.9%;
            display:inline-block;
          }
          .input-tem-name1{
            width: 8.7%;
            min-width:102px;
            margin-left: 1%;
          }
          .list-sel{
            width: 8.7%;
            min-width:102px;
            margin-left: 1%;
            display:inline-block;
          }

          div{
            display:inline-block;
          }
          .time-range{
            width: 36%;
            min-width: 403px;
            margin-left: 1%;
            height: 34px;
            line-height: 32px;
            padding: 0 15px;
          }
          .creat-time{
            margin-left: 1.9%;
          }
        }
      }
      .body-container{
        //border:2px solid #dfdfdf;
        border:2px solid #f0f0f0;
        margin-top:10px;
        padding:10px 5px;
        .el-button{
          height:30px;
          width:80px;
          padding:8px 15px;
        }
        .block {
          margin-top: 30px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      footer{
        margin-top: 35px;
        text-align: center;
      }
  }
</style>
