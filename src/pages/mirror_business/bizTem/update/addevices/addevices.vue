<template>
  <div class="component-container">
    <header>
      <div class="devices-head">
        <el-row type="flex" justify="center">
          <el-col :span="7">
            <div class="devices-one">设备名称：
              <el-input v-model="name" placeholder="请输入内容" class="devices-input input-tem-name1"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="devices-one">机房位置：
              <el-select v-model="machine" placeholder="请选择" class="list-sel">
                <el-option
                  v-for="item in room"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="devices-three">设备类型：
              <el-cascader
                expand-trigger="hover"
                :options="equipType"
                v-model="equipTypeValue"
                @change=""
                class="list-sel">
              </el-cascader>
            </div>
          </el-col>
        </el-row>


<!--         <div class="devices-one">设备名称：
          <el-input v-model="name" placeholder="请输入内容" class="devices-input input-tem-name"></el-input>
        </div>
        <div class="devices-one">机房位置：
          <el-select v-model="machine" placeholder="请选择" class="list-sel">
            <el-option
              v-for="item in room"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="devices-three">设备类型：
          <el-cascader
            expand-trigger="hover"
            :options="equipType"
            v-model="equipTypeValue"
            @change=""
            class="list-sel">
          </el-cascader>
        </div> -->
      </div>
      <div class="devices-head devices-button">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </div>
    </header>
    <div class="body-container" ref="container">
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
          prop="name"
          label="设备名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="设备IP"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bizSystemName"
          label="业务系统"
          align="center">
        </el-table-column>
        <el-table-column
          prop="roomName"
          label="归属机房"
          align="center">
        </el-table-column>
        <el-table-column
          prop="moduleName"
          label="设备类型"
          align="center">
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
    <section style="height:86.72%">
      <div class="selected-head">
        <!-- <i class="el-icon-d-arrow-right"></i> -->
        <el-button type="primary" icon="el-icon-d-arrow-right" class="items-add mirror_but" @click="addItems" style="margin-left:0">添加</el-button>
        <el-button type="primary" icon="el-icon-delete" class="items-add mirror_but" @click="clearAll">清空</el-button>
      </div>
      <div class="selected-container" ref="container1">
        <ul>
          <li><span class="moni-name">设备名称</span></li>
          <li v-for="(item,index) in monitor"><span class="moni-name">{{item.name}}</span><i class="el-icon-delete"
                                                                                             @click="clear(index)"></i>
          </li>
        </ul>
      </div>
    </section>
    <footer>
      <el-button class="" type="primary" @click="selected" icon="el-icon-success">选择</el-button>
      <el-button class="" type="primary" @click="empty" icon="el-icon-delete">清空</el-button>
      <el-button class="" type="primary" @click="cancel" icon="el-icon-error">取消</el-button>
    </footer>
  </div>
</template>

<script>
  import {equipType, room} from '../../config/options.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  // import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'

  export default {
    data () {
      return {
        name: '',
        // 机房位置
        machine: '',
        // 机房位置下拉框选项
        room: [],
        // 设备类型的值
        equipTypeValue: [],
        // 设备类型的下拉框选项
        equipType: [],
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
        total: 0,
        // 已选择添加的设备
        monitor: []
      }
    },
    computed: {
      temDevices () {
        return this.$store.state.homeStore.bizTemDevices
      }
    },
    methods: {
      // 1 element 多选项选中
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 分页改变每页个数
      handleSizeChange (val) {
        this.pageSize = val
        // this.tableData = this.packData()
        let obj = {
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          name: this.name,
          moduleId: this.equipTypeValue[this.equipTypeValue.length - 1],
          roomId: this.machine
        }
        this.getTableData(obj)
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        // this.tableData = this.packData()
        let obj = {
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          name: this.name,
          moduleId: this.equipTypeValue[this.equipTypeValue.length - 1],
          roomId: this.machine
        }
        this.getTableData(obj)
      },
      // 2 业务逻辑 添加到已选栏中
      addItems () {
        var arr = [].concat(this.multipleSelection)
        var arr1 = []
        arr.forEach((item) => {
          let bool = false
          this.monitor.forEach((item1) => {
            if (item1.instanceId === item.instanceId) {
              bool = true
            }
          })
          if (!bool) {
            this.monitor.push(item)
          } else {
            arr1.push(`${item.name}`)
          }
        })
        // if(arr1.length > 0){
        //   let str = arr1.join(',')
        //   this.$alert(`${str}已被添加`, '消息', {
        //     confirmButtonText: '确定'
        //   })
        // }
      },
      // 已选栏全清
      clearAll () {
        this.monitor = []
      },
      // 已选栏单个清
      clear (index) {
        this.monitor.splice(index, 1)
      },
      // 选择监控项
      selected () {
        if (this.monitor.length <= 0) {
          this.$alert('请选择设备进行添加', '消息', {
            confirmButtonText: '确定'
          })
        } else {
          this.$store.commit('bizTemDevi', this.monitor)
          this.$store.commit('temDevState', true)
          this.$router.go(-1)
        }
      },
      // 取消选择
      cancel () {
        this.$router.go(-1)
      },
      // 清空监控项
      empty () {
        this.tableData = []
      },
      // 查询
      search () {
        let obj = {
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          name: this.name,
          moduleId: this.equipTypeValue[this.equipTypeValue.length - 1],
          roomId: this.machine
        }
        this.getTableData(obj)
      },
      // 重置
      reset () {
        this.name = ''
        this.machine = ''
        this.equipTypeValue = ''
      },
      // 3 封装 封装新增任务时设备编辑的数据
      packTaskDevices () {
        let str = ''
        this.monitor.forEach((item) => {
          str += item.name + ','
        })
        str = str.slice(0, -1)
        return str
      },
      initData () {
        var obj = {
          pageSize: this.pageSize,
          pageNumber: 1
        }
        return obj
      },
      initDevices () {
        this.monitor = this.temDevices
        // if (this.temDevices !== '') {
        //   this.temDevices.split(',').forEach((item) => {
        //     let obj = {
        //       name: item
        //     }
        //     this.monitor.push(obj)
        //   })
        // }
      },
      // 4 数据相关方法
      getTableData (obj) {
        rbProjectDataServiceFactory.getDeviceList(obj).then((res) => {
          this.tableData = res.dataList
          this.total = res.total
        })
      }
    },
    mounted () {
      this.getTableData(this.initData())
      this.initDevices()
      this.room = room
      this.equipType = equipType
    },
    watch: {
      // 右边的已选栏高度动态随着左边变化
      // pageSize () {
      //   this.$nextTick(() => {
      //     var height = Number(window.getComputedStyle(this.$refs.container).height.slice(0,-2)) + 180;
      //     this.$refs.container1.style.height = `${height}px`
      //   })
      // }
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
    background-color: #F4F4F4;
    position: relative;
    header {
      width: 74%;
      padding: 10px;
      //border:2px solid #dfdfdf;
      border: 2px solid #f0f0f0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .devices-head {
        display: block;
        margin-top: 20px;
        .devices-one {
          height:40px;
          line-height:40px;
          display: inline-block;
          .devices-input {
            width: 46.8%;
            min-width:90px;
            margin-left: 3%;
          }
          .list-sel {
            width: 46.8%;
            min-width:90px;
            margin-left: 3%;
          }
        }
        .devices-three {
          height:40px;
          line-height:40px;
          display: inline-block;
          .list-sel {
            width: 46.8%;
            min-width:90px;
            margin-left: 3%;
          }
        }
      }
      .devices-head:nth-child(1) {
        margin-top: 0;
        height: 80px;
        line-height: 80px;
        width: 100%;
        text-align: center;
      }
      .devices-button {
        width: 100%;
        text-align: center;
        .el-button {
          height: 30px;
          width: 80px;
          padding: 8px 15px;
        }
      }
    }
    .body-container {
      border: 2px solid #f0f0f0;
      margin-top: 20px;
      padding: 10px 5px;
      width: 74%;
      .block {
        margin-top: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        width:100%;
      }
    }
    section {
      position: absolute;
      right: 2%;
      top: 15px;
      width: 22%;
      .selected-head {
        height: 40px;
        display: flex;
        align-items: center;
      }
      .selected-container {
        height: 100%;
        border: 2px solid #f0f0f0;
        margin-top: 15px;
        padding: 10px;
        overflow-y: scroll;
        ul {
          list-style: none;
          li {
            color: #878d99;
            display: flex;
            align-items: center;
            line-height: 21px;
            margin-top: 8px;
            padding-left: 10px;
            border: 1px solid #f0f0f0;
            .moni-name {
              display: inline-block;
              width: 100%;
              text-align: center;
            }
            i {
              cursor: pointer;
            }
          }
          li:first-of-type {
            border: none !important;
          }
        }
      }
    }
    footer {
      margin-top: 60px;
      width: 74%;
      text-align: center;
    }
  }
</style>
