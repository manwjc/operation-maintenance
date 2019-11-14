<template>
  <div class="components-container yw-dashboard"
       v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="65px">
      <!--<el-form-item label="联系人">-->
        <!--<el-input v-model="search_name"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="电话号码">-->
        <!--<el-input v-model="search_phone"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="邮箱地址">-->
        <!--<el-input v-model="search_email"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="设备厂商">
        <el-input v-model="search_produce"></el-input>
      </el-form-item>
      <el-form-item label="厂商类型">
        <el-select clearable
                   v-model="search_type"
                   placeholder="请选择">
          <el-option v-for="(item, index) in produceTypeList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search('search')">查询</el-button>
        <el-button @click="cancel('searchHander')">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form form-left">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="showAddDialog()">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="showUpdateCheck">编辑</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="showdeleteDialog()">删除</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importData()">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData()">导出</el-button>

      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 300px)"
                  @selection-change="handleSelectionChange"
                  row-key="id"
                  @row-click="clickRow"
                  ref="moviesTable"
                  @row-dblclick="selectedRow">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="produce"
                           label="厂商"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="gotoDetail(scope.row.id)">
                {{scope.row.produce}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type"
                           label="厂商类型"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="remark"
                           label="备注"
                           :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-form>
    <!--<el-form class="yw-form form-right"-->
             <!--:inline="true">-->
      <!--<div class="yw-el-table-wrap">-->
        <!--<el-table :data="concatData"-->
                  <!--class="yw-el-table"-->
                  <!--stripe-->
                  <!--tooltip-effect="dark"-->
                  <!--border-->
                  <!--height="calc(100vh - 300px)">-->
          <!--<el-table-column prop="name"-->
                           <!--label="联系人"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column prop="phone"-->
                           <!--label="电话"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column prop="email"-->
                           <!--label="邮箱"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column prop="remark"-->
                           <!--label="备注"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
        <!--</el-table>-->
      <!--</div>-->
    <!--</el-form>-->

    <!-- dialog -->
    <el-dialog class="yw-dialog"
               :visible.sync="addDialog"
               width="720px"
               :close-on-click-modal="false"
               title="新增厂商信息">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="addForm"
                 :rules="addRules"
                 ref="addForm"
                 label-width="80px">
          <el-form-item label="厂商"
                        prop="produce">
            <el-input v-model="addForm.produce"></el-input>
          </el-form-item>
          <el-form-item label="厂商类型"
                        prop="type">
            <el-select v-model="addForm.type">
              <el-option v-for="(item, index) in produceTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <el-input type="textarea"
                      style="width: 178px"
                      v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   class="tem-search1"
                   @click="saveAddForm('addForm')">确 定</el-button>
        <el-button class="tem-search1"
                   @click="cancel('add')">取 消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               :visible.sync="updateDialog"
               width="720px"
               :close-on-click-modal="false"
               title="编辑厂商信息">
      <section class="yw-dialog-main">
        <el-form :model="updateForm"
                 :rules="updateRules"
                 ref="updateForm"
                 label-width="80px"
                 class="yw-form is-required">
          <el-form-item label="厂商"
                        prop="produce">
            <el-input v-model="updateForm.produce"></el-input>
          </el-form-item>
          <el-form-item label="厂商类型"
                        prop="type">
            <el-select v-model="updateForm.type">
              <el-option v-for="(item, index) in produceTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <el-input type="textarea"
                      v-model="updateForm.remark"
                      style="width:178px"></el-input>
          </el-form-item>
          <!--<el-form-item>-->
            <!--<div class="tableDate">-->
              <!--<div class="table">-->
                <!--<el-table class="yw-el-table"-->
                          <!--:data="updateForm.concatData"-->
                          <!--ref="table"-->
                          <!--tooltip-effect="dark"-->
                          <!--border-->
                          <!--stripe-->
                          <!--style="width: 100%">-->
                  <!--<el-table-column label="联系人"-->
                                   <!--min-width="30%">-->
                    <!--<template slot-scope="scope">-->
                      <!--<el-form-item :prop="'concatData.' + scope.$index + '.name'">-->
                        <!--<el-input v-model="scope.row.name"></el-input>-->
                      <!--</el-form-item>-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                  <!--<el-table-column label="电话"-->
                                   <!--min-width="30%">-->
                    <!--<template slot-scope="scope">-->
                      <!--<el-form-item :prop="'concatData.' + scope.$index + '.phone'"-->
                                    <!--:rules="updateRules.phone">-->
                        <!--<el-input v-model="scope.row.phone"></el-input>-->
                      <!--</el-form-item>-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                  <!--<el-table-column label="邮箱"-->
                                   <!--min-width="30%">-->
                    <!--<template slot-scope="scope">-->
                      <!--<el-form-item :prop="'concatData.' + scope.$index + '.email'"-->
                                    <!--:rules="updateRules.email">-->
                        <!--<el-input v-model="scope.row.email"></el-input>-->
                      <!--</el-form-item>-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                  <!--<el-table-column label="备注"-->
                                   <!--min-width="30%">-->
                    <!--<template slot-scope="scope">-->
                      <!--<el-form-item :prop="'concatData.' + scope.$index + '.remark'">-->
                        <!--<el-input v-model="scope.row.remark"></el-input>-->
                      <!--</el-form-item>-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                  <!--<el-table-column min-width="15%">-->
                    <!--<template slot-scope="scope">-->
                      <!--<i class="el-icon-circle-plus-outline"-->
                         <!--style="color: #409eff; font-size:15px;cursor:pointer"-->
                         <!--@click.prevent="addRow('update')"></i>-->
                      <!--<i v-show="updateForm.concatData.length > 1"-->
                         <!--class="el-icon-remove-outline"-->
                         <!--style="color: #409eff; font-size:15px;cursor:pointer"-->
                         <!--@click.prevent="delData(scope.$index, updateForm.concatData)"></i>-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                <!--</el-table>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-form-item>-->
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   class="tem-search1"
                   @click="saveEditForm('updateForm')">确 定</el-button>
        <el-button class="tem-search1"
                   @click="cancel('update')">取 消</el-button>
      </section>
    </el-dialog>
    <YwImport v-if="display.isImport"
              :showImport="display.isImport"
              @setImportDisplay="closeParent"
              :importType="importType"></YwImport>
  </div>
</template>

<script>
export default {
  name: '/resource/maintenance/produceInfo',
  components: {
    YwImport: () => import('src/components/common/yw-import.vue')
  },
  data () {
    return {
      display: {
        isImport: false
      },
      importType: 'produce',
      multipleSelection: [],
      // concatData: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      search_produce: '',
      search_type: '',
      search_name: '',
      search_phone: '',
      search_email: '',
      tableData: [],
      parent_biz: [],
      addDialog: false,
      loading: false,
      addForm: {
        id: '',
        produce: '',
        type: '',
        remark: '',
        concatData: []
      },
      addRules: {
        produce: [
          { required: true, message: '厂商必填', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '厂商类型必填', trigger: 'blur' }
        ]
      },
      updateDialog: false,
      updateForm: {
        id: '',
        produce: '',
        type: '',
        remark: '',
        concatData: []
      },
      updateRules: {
        produce: [
          { required: true, message: '厂商必填', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '厂商类型必填', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '电话格式不正确', trigger: ['blur', 'change'] }
        ],
        email: [
          { pattern: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: ['blur', 'change'] }
        ]
      },
      concatRules: {
        phone: [
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '电话格式不正确', trigger: ['blur', 'change'] }
        ],
        email: [
          { pattern: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: ['blur', 'change'] }
        ]
      },
      dynamicModel: {},
      selectedObj: {},
      produceTypeList: []
    }
  },
  mounted () {
    this.getProduceTypeList()
    this.search()
  },
  methods: {
    gotoDetail (row) {
      this.$router.push({
        path: '/resource/maintenance/produceDetail',
        query: {id: row}
      })
    },
    clickRow (row) {
      this.$refs.moviesTable.toggleRowSelection(row)
    },
    // 增加行
    addRow (type) {
      var list = {
        produceId: '',
        name: '',
        email: '',
        phone: ''
      }
      if (type === 'add') {
        this.addForm.concatData.push(list)
      } else {
        this.updateForm.concatData.push(list)
      }
    },
    delData (index, list) {
      list.splice(index, 1)
    },
    // initConcat () {
    //   if (this.tableData.length > 0) {
    //     let row = this.tableData[0]
    //     let param = {
    //       'produceId': row.id
    //     }
    //
    //     this.rbHttp.sendRequest({
    //       method: 'GET',
    //       url: `/v1/cmdb/maintenProduce/getConcatsByProduceId`,
    //       params: param
    //     }).then((res) => {
    //       this.concatData = res
    //
    //       return res
    //     });
    //   }
    // },
    showdeleteDialog () {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请至少选择一条数据进行删除')
      } else {
        this.$confirm('此操作将删除厂商信息，确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.forEach((item) => {
            ids.push(item.id)
          })
          let param = { 'produceId': ids.toString() }
          this.rbHttp.sendRequest({
            method: 'DELETE',
            url: `/v1/cmdb/maintenProduce/deleteProduce`,
            params: param
          }).then((res) => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.search('search')
            } else {
              this.$message.error(res.message)
            }
            return res
          })

        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
      }
    },
    // element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search('page')
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search('page')
    },
    // 字典表查询厂商类型
    getProduceTypeList () {
      let obj = {
        'type': 'produceType',
        'pid': '',
        'pValue': '',
        'pType': ''
      }

      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        this.produceTypeList = res
        return res
      })
    },
    search (type) {
      this.loading = true
      this.concatData = []
      let param = {
        'pageNum': type === 'search' ? 1 : this.currentPage,
        'pageSize': this.pageSize,
        'produce': this.search_produce,
        'type': this.search_type,
        'name': this.search_name,
        'phone': this.search_phone,
        'email': this.search_email
      }
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/maintenProduce/listProduceByPage`,
        data: param
      }).then((res) => {
        this.loading = false
        this.total = res.count
        this.tableData = res.data;
        // this.initConcat()
        return res
      }).finally(() => {
        this.loading = false
      });

    },
    cancel (val) {
      if (val === 'add') {
        this.addDialog = false
        this.$refs['addForm'].resetFields()
      } else if (val === 'update') {
        this.updateDialog = false
        this.$refs['updateForm'].resetFields()
      } else if (val === 'searchHander') {
        this.search_produce = ''
        this.search_type = ''
        this.search_name = ''
        this.search_phone = ''
        this.search_email = ''
      }
      this.search('search')
    },
    showAddDialog () {
      this.addForm.produce = ''
      this.addForm.type = ''
      this.addForm.remark = ''
      this.addForm.concatData = [{
        produceId: '',
        name: '',
        email: '',
        phone: ''
      }]

      this.addDialog = true
    },
    saveAddForm (formName) {
      let _t = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addDialog = false
          // let concats = []
          // let concatList = _t.addForm.concatData
          // concatList.forEach((concat) => {
          //   if ((concat.name !== undefined && concat.name !== '')
          //     || (concat.phone !== undefined && concat.phone !== '')
          //     || (concat.email !== undefined && concat.email !== '')) {
          //     concats.push(concat)
          //   }
          // })
          let param = {
            'produce': _t.addForm.produce,
            'type': _t.addForm.type,
            'remark': _t.addForm.remark
            // 'concats': concats
          }
          this.rbHttp.sendRequest({
            method: 'POST',
            url: `/v1/cmdb/maintenProduce/insertProduce`,
            data: param
          }).then((res) => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.search('search')
            } else {
              this.$message.error(res.message)
            }
            return res;
          })
        } else {
          return false
        }
      })
    },
    showUpdateCheck () {
      if (this.multipleSelection.length !== 1) {
        this.$message.error('请选择一条数据进行修改')
      } else {
        this.updateDialog = true

        let item = this.multipleSelection[0]

        this.updateForm.id = item.id;
        this.updateForm.produce = item.produce
        this.updateForm.type = item.type
        this.updateForm.remark = item.remark

        // this.updateForm.concatData = item.concats
        // if (this.updateForm.concatData.length == 0) {
        //   this.updateForm.concatData = [{
        //     produceId: '',
        //     name: '',
        //     email: '',
        //     phone: ''
        //   }]
        // }
      }
    },
    saveEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _t = this
          this.updateDialog = false
          // let concats = []
          // let concatList = _t.updateForm.concatData
          // concatList.forEach((concat) => {
          //   if ((concat.name !== undefined && concat.name !== '')
          //     || (concat.phone !== undefined && concat.phone !== '')
          //     || (concat.email !== undefined && concat.email !== '')) {
          //     concats.push(concat)
          //   }
          // })
          let param = {
            'id': _t.updateForm.id,
            'produce': _t.updateForm.produce,
            'type': _t.updateForm.type,
            'remark': _t.updateForm.remark,
            // 'concats': concats
          }
          this.rbHttp.sendRequest({
            method: 'POST',
            url: `/v1/cmdb/maintenProduce/updateProduce`,
            data: param
          }).then((res) => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.search('search')
            } else {
              this.$message.error(res.message)
            }
            return res;
          })
        } else {
          return false
        }
      })
    },
    selectedRow (row) {
      // let param = {
      //   'produceId': row.id
      // }
      //
      // this.rbHttp.sendRequest({
      //   method: 'GET',
      //   url: `/v1/cmdb/maintenProduce/getConcatsByProduceId`,
      //   params: param
      // }).then((res) => {
      //   // this.concatData = res
      //
      //   return res
      // });
    },
    p (key) {
      let _t = this
      if (_t.dynamicModel[key]['showSize'] + 1 <= _t.dynamicModel[key]['default'].length) {
        _t.$set(_t.dynamicModel[key], 'showSize', _t.dynamicModel[key]['showSize'] + 1)
      }
    },
    s (key, value) {
      let _t = this
      if (_t.dynamicModel[key]['showSize'] - 1 > 0) {
        _t.$set(_t.dynamicModel[key], 'showSize', _t.dynamicModel[key]['showSize'] - 1)
        // 改下拉框已经选过值 则替换值
        let indexInArray = this.findSelectTypeByRowIndex(key, value.split('_')[0])
        if (indexInArray !== undefined) {
          _t.dynamicModel[key]['select_type'].splice(indexInArray, 1) // 移除
        }
        _t.dynamicModel[key]['row_' + value.split('_')[0]] = ''
        this.filter(key, value)
      }
    },
    exportData () {
      this.loading = true
      let params = {
        'produce': this.search_produce,
        'type': this.search_type,
        'name': this.search_name,
        'phone': this.search_phone,
        'email': this.search_email
      }

      this.rbHttp.sendRequest({
        method: 'POST',
        data: params,
        binary: true,
        url: `/v1/cmdb/maintenProduce/export`
      }).then((res) => {
        this.loading = false
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '维保厂商信息列表.xls'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
        return res
      }).finally(() => {
        this.loading = false
      })
    },
    importData () {
      this.display.isImport = true
    },
    closeParent (val) {
      this.display.isImport = val
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .yw-el-table .el-input__inner {
  width: 100px;
}
.form-left {
  display: inline-block;
  width: 100%;
}
.form-right {
  display: inline-block;
  vertical-align: top;
  width: 38%;
  margin-left: 1%;
  margin-top: 26px;
}
</style>
