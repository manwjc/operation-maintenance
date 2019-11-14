<template>
  <div class="component-container">
    <header>
      <div class="he-wrapper">
        <div class="item-tit">机房位置：</div>
        <el-select v-model="magine" placeholder="请选择" class="list-sel">
          <el-option
            v-for="item in room"
            :key="item.id"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
<!--         <div class="item-tit">监控模板名称：</div> -->
<!--         <el-input v-model="template_name" placeholder="请输入内容" class="item-input input-tem-name1"></el-input> -->

        <div class="item-tit" style="margin-left:-3%">监控项名称：</div>
        <el-input v-model="name" placeholder="请输入内容" class="item-input input-tem-name1"></el-input>

        <div class="item-tit" style="margin-left:3%">监控Key：</div>
        <el-input v-model="key" placeholder="请输入内容" class="item-input input-tem-name1"></el-input>
      </div>
      <div class="he-wrapper1">
        <div class='he-wrapper1-tit'>模板名称：</div>
        <el-select v-model="zbxTem" placeholder="请选择" class="list-sel" ref="temp">
          <el-option
            v-for="item in zbxTemList"
            :key="item.templateid"
            :label="item.name"
            :value="item.templateid">
          </el-option>
        </el-select>
        <el-button class="search item-button" type="primary" @click="search">查询</el-button>
        <el-button class="reset" type="primary" @click="reset">重置</el-button>
      </div>
      <!-- </div> -->
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
          prop="template_name"
          label="监控模板名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="监控项名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key"
          label="监控项key"
          align="center">
        </el-table-column>
        <el-table-column
          prop="value_type"
          label="数据类型"
          align="center"
          :formatter="formatterValueType">
        </el-table-column>
        <el-table-column
          prop="units"
          label="数据单位"
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
    <section>
      <div class="selected-head">
        <!-- <i class="el-icon-d-arrow-right"></i> -->
        <el-button type="primary" icon="el-icon-d-arrow-right" class="tem-search" @click="addItems">添加</el-button>
        <el-button type="primary" icon="el-icon-delete" class="tem-search" @click="clearAll">清空</el-button>
      </div>
      <div class="selected-container" ref="container1">
        <ul>
          <li><span class="moni-name">监控项名称</span></li>
          <li v-for="(item,index) in monitor"><span class="moni-name">{{item.name}}</span><i class="el-icon-delete" @click="clear(index)"></i></li>
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
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import {room} from '../../../task/config/options.js'
  export default {
    data () {
      return {
        template_name: '',
        name: '',
        key: '',
        magine: '',
        // 机房下拉框列表
        room: [],
        zbxTem: '',
        zbxTemList: [],
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
        // 已选择添加的监控项
        monitor: [],
        // 保存当前的监控项列表以作分页
        list: []
      }
    },
    methods: {
      // 多选项选中
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 分页改变每页个数
      handleSizeChange (val) {
        this.pageSize = val
        this.tableData = this.packData(this.list)
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.tableData = this.packData(this.list)
      },
      formatterValueType (row, column) {
        return rbMirrorCommonService.getZbxType(row.value_type)
      },
      // 添加到已选栏中
      addItems () {
        var arr = [].concat(this.multipleSelection)
        arr.forEach(item => {
          if (this.monitor.indexOf(item) < 0) {
            this.monitor.push(item)
          }
        })
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
        // 由于封装的方法中数组仍返回的是原数组而不是副本所以monitor数组和vuex的数组相关联
        // this.$store.commit('addItems', this.packInspectData(this.monitor))
        var id = this.$store.state.homeStore.template_id
        if (this.monitor.length <= 0) {
          this.$alert(`请选择至少一个监控项进行添加`, '警告', {
            confirmButtonText: '确定'
          })
        } else {
          // 判断添加进的模板是否重复
          rbProjectDataServiceFactory.detail(id).then((res) => {
            let bool = true
            let arr = []
            this.monitor.forEach((item) => {
              res.item_list.forEach((item1) => {
                if (item1.key === item.key) {
                  bool = false
                  arr.push(item1.name)
                }
              })
            })
            // 如果不重复
            if (bool) {
              let monitor = []
              this.monitor.forEach((item) => {
                // let obj = JSON.parse(JSON.stringify(item))
                let obj = Object.assign({}, item)
                obj.template_id = id
                obj.sys_type = 'ZABBIX'
                // obj.value_type = rbMirrorCommonService.getDaoZbxType(item.value_type)
                monitor.push(obj)
              })
              let obj = {
                'list_item': monitor
              }
              rbProjectDataServiceFactory.batchCreatItem(obj).then(() => {
                this.$store.commit('changeBatch', true)
                this.$router.go(-1)
              }).catch(() => {
                this.$alert(`内部服务器出错`, '警告', {
                  confirmButtonText: '确定'
                })
              })
            } else {
              // 如果添加的模板中有重复的
              let str = arr.join(',')
              this.$alert(`模板${str}已存在`, '警告', {
                confirmButtonText: '确定'
              })
            }
          })
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
      reset () {
        this.template_name = ''
        this.name = ''
        this.key = ''
        this.magine = '1'
        this.zbxTem = ''
      },
      search () {
        if (this.zbxTem === '' || this.magine === '') {
          this.$alert(`请填写机房和模板再进行查询`, '消息', {
            confirmButtonText: '确定'
          })
        } else {
          let obj = {
            'name': this.name,
            'template_id': this.zbxTem,
            'key': this.key,
            'room': this.magine
          }
          this.getItemList(obj)
        }
      },
      // 巡检项增删改查
      getItemList (obj) {
        // let obj1 = {
        //   room: this.magine,
        //   template_id: this.zbxTemList[0].templateid
        // }
        if (obj) {
          rbProjectDataServiceFactory.getZbxItem(obj).then((res) => {
            this.total = res.count
            this.list = res.result
            this.list.forEach((item) => {
              let obj = {}
              obj = this.zbxTemList.find((item) => {
                return item.templateid === this.zbxTem
              })
              item.key = item.key_
              item.template_name = obj.name
              // item.value_type = rbMirrorCommonService.getZbxType(item.value_type)
            })
            this.currentPage = 1
            this.pageSize = 5
            this.tableData = this.packData(this.list)
          })
        }
        // else {
        //   rbProjectDataServiceFactory.getZbxItem(obj1).then((res) => {
        //     this.total = res.count
        //     this.tableData = res.result
        //   })
        // }
      },
      // 分页封装数据
      packData (arr) {
        var arr1 = []
        var i = this.currentPage
        var j = this.pageSize
        for (let k = (i - 1) * j; k < i * j; k++) {
          if (arr[k]) {
            arr1.push(arr[k])
          }
        }
        return arr1
      },
      initMagineTem () {
        this.magine = '1'
        rbProjectDataServiceFactory.getZbxList(this.magine).then((res) => {
          this.zbxTemList = res
          // this.getItemList()
        })
      }
    },
    mounted () {
      this.initMagineTem()
      // this.getItemList()
      this.room = room
    },

    watch: {
      magine () {
        rbProjectDataServiceFactory.getZbxList(this.magine).then((res) => {
          this.zbxTemList = res
        }).catch(() => {
          this.zbxTemList = []
        })
      }
      // 右边的已选栏高度动态随着左边变化
      // pageSize () {
      //   this.$nextTick(() => {
      //   	var height = Number(window.getComputedStyle(this.$refs.container).height.slice(0,-2)) + 105;
      //   	this.$refs.container1.style.height = `${height}px`
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
      height: 140px;
      width: 74%;
      padding: 10px;
      border: 2px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      div.he-wrapper{
        text-align:center;
        width:100%;
        .item-tit {
          display: inline-block;
        }
        .item-input {
          width: 18%;
        }
        /deep/ .el-select {
          .el-input{
            width:75%
          }
        }
      }
      div.he-wrapper1{
        text-align:center;
        width:100%;
        .he-wrapper1-tit{
          display:inline-block;
        }
        /deep/ .el-select {
          .el-input{
            width:75%
          }
        }
        .el-button {
          height: 30px;
          width: 80px;
          padding: 8px 15px;
        }
        .item-button {
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
        height: 559px;
        border: 2px solid #f0f0f0;
        margin-top: 15px;
        padding: 10px;
        overflow-y: scroll;
        ul {
          list-style: none;
          li {
            color: #878d99;
            line-height: 24px;
            margin-top: 8px;
            padding-left: 10px;
            border: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            .moni-name {
              display: inline-block;
              width: 100%;
              text-align: center;
              text-align: center;
            }
            i {
              cursor: pointer;
              margin-left: 10px;
            }
          }
          li:first-of-type {
            border: none !important;
          }
        }
      }
    }
    footer {
      width: 74%;
      margin-top: 35px;
      text-align: center;
    }
  }
</style>
