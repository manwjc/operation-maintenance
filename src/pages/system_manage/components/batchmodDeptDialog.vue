<template>
  <el-dialog title="修改"
             :visible.sync="visible"
             width="1000px"
             class="yw-dialog mod-dept-manage__dialog"
             :before-close="handleModDeptDialogClose">
    <section class="yw-dialog-main">
      <el-row :gutter="30">
        <el-col :span="14"
                class="border_col">
          <el-input class="yw-search-box"
                    v-model="searchText"
                    placeholder="请输入用户名/真实姓名/手机号/邮箱">
            <i slot="suffix"
               class="el-input__icon el-icon-search"
               @click="searchData"></i>
          </el-input>
          <section>
            <el-table :data="personList"
                      class="yw-el-table"
                      stripe
                      tooltip-effect="dark"
                      border
                      height="500px"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column prop="code"
                               label="用户名称"
                               width="80">
              </el-table-column>
              <el-table-column prop="name"
                               label="真实姓名"
                               width="80">
              </el-table-column>
              <el-table-column prop="dept_id"
                               show-overflow-tooltip
                               label="部门"
                               width="80">
              </el-table-column>
              <el-table-column prop="mobile"
                               label="手机号"
                               width="100">
              </el-table-column>
              <el-table-column show-overflow-tooltip
                               prop="mail"
                               label="邮箱">
              </el-table-column>
            </el-table>
            <div class="yw-page-wrap">
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             :current-page="currentPage"
                             :page-size="pagesize"
                             :page-sizes="[5, 10]"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="total">
              </el-pagination>
            </div>
          </section>

        </el-col>
        <el-col :span="2"
                style="height: 400px;">
          <el-button @click="handlePersonList"
                     icon="el-icon-arrow-right"
                     size="small"
                     type="primary"
                     plain
                     style="position: absolute;left: 60%;top: 50%;"></el-button>
        </el-col>
        <el-col :span="8"
                class="border_col">
          <div class="choose-wrap">
            部门名称：
            <el-popover placement="bottom-start"
                        trigger="click">
              <comtree :data="departmentData"
                       :props="departmentTreeDefault"
                       :ex-control="true"
                       node-key="uuid"
                       :default-expand-all="true"
                       :ex-control-opt="[]"
                       @node-click="handleTreeClick">
              </comtree>
              <el-button slot="reference"
                         type="primary">{{departmentText}}</el-button>
            </el-popover>
          </div>
          <el-table :data="selectPersonList"
                    class="yw-el-table"
                    stripe
                    tooltip-effect="dark"
                    border
                    height="500px">
            <el-table-column prop="code"
                             label="用户名称">
            </el-table-column>
            <el-table-column prop="name"
                             label="真实姓名">
            </el-table-column>
            <el-table-column prop="mobile"
                             label="手机号">
            </el-table-column>
            <el-table-column label="操作"
                             width="50">
              <template slot-scope="scope">
                <div class="yw-table-operator">
                  <el-button type="text"
                             icon="el-icon-delete"
                             @click="clearSelected(scope.row)">
                  </el-button>
                </div>

              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </section>
    <section class="btn-wrap">
      <el-button type="primary"
                 @click="selected">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </section>

    <!-- <el-row :gutter="30">
      <el-col :span="14"
              class="border_col">
        <el-input class="search-box"
                  v-model="searchText"
                  placeholder="请输入用户名/真实姓名/手机号/邮箱">
          <i slot="suffix"
             class="el-input__icon el-icon-search"
             @click="searchData"></i>
        </el-input>
        <el-table :data="personList"
                  class="person-manage__table mod-table"
                  style="width: 100%;overflow:  auto;height: 500px;"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="code"
                           label="用户名称"
                           width="80">
          </el-table-column>
          <el-table-column prop="name"
                           label="真实姓名"
                           width="80">
          </el-table-column>
          <el-table-column prop="dept_id"
                           show-overflow-tooltip
                           label="部门"
                           width="80">
          </el-table-column>
          <el-table-column prop="mobile"
                           label="手机号"
                           width="100">
          </el-table-column>
          <el-table-column show-overflow-tooltip
                           prop="mail"
                           label="邮箱">
          </el-table-column>
        </el-table>
        <el-pagination class="person-manage__pager"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pagesize"
                       :page-sizes="[5, 10]"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </el-col>
      <el-col :span="2"
              style="height: 400px;">
        <el-button @click="handlePersonList"
                   icon="el-icon-arrow-right"
                   size="small"
                   type="primary"
                   plain
                   style="position: absolute;left: 60%;top: 50%;"></el-button>
      </el-col>
      <el-col :span="8"
              class="border_col">
        <div class="person-manage__bar-left">
          部门名称：
          <el-popover placement="bottom-start"
                      trigger="click">
            <comtree :data="departmentData"
                     :props="departmentTreeDefault"
                     :ex-control="true"
                     node-key="uuid"
                     :default-expand-all="true"
                     :ex-control-opt="[]"
                     @node-click="handleTreeClick">
            </comtree>
            <el-button slot="reference"
                       class="mod-btn"
                       size="small"
                       style="width: 180px;">{{departmentText}}</el-button>
          </el-popover>
        </div>
        <el-table :data="selectPersonList"
                  style="width: 100%;overflow:  auto;height: 500px;">
          <el-table-column prop="code"
                           label="用户名称">
          </el-table-column>
          <el-table-column prop="name"
                           label="真实姓名">
          </el-table-column>
          <el-table-column prop="mobile"
                           label="手机号">
          </el-table-column>
          <el-table-column label="操作"
                           width="50">
            <template slot-scope="scope">
              <el-button @click="clearSelected(scope.row)"
                         type="text">
                <i class="el-icon-delete"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <footer style="text-align: right;">
      <el-button class=""
                 type="primary"
                 @click="selected"
                 icon="el-icon-success">确定</el-button>
      <el-button class=""
                 type="primary"
                 @click="cancel"
                 icon="el-icon-error">取消</el-button>
    </footer> -->
  </el-dialog>
</template>

<script>
import comtree from 'src/pages/system_manage/components/tree.vue'
import personDataService from 'src/services/sys/person-services.js'
import _ from 'lodash'
export default {
  components: {
    comtree
  },
  data () {
    return {
      departmentData: [],
      departmentTreeDefault: {
        label: 'name',
        children: 'childList'
      },
      searchText: '',
      department: {},
      departmentText: '请选择部门',
      personList: [],
      selectPersonList: [],
      currentPage: 1,
      total: 1,
      pagesize: 10,
      multipleSelection: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
    // dictionary: {
    //   type: Object,
    //   default: null
    // }
  },
  watch: {
    visible (val) {
      // 隐藏时重置
      if (val) {
        this.getDepartmentTree()
        this.getPersonList('', this.pagesize, this.currentPage, this.searchText)
      }
    },
    searchText (newValue) {
      this.currentPage = 1
      this.getPersonList('', this.pagesize, this.currentPage, this.searchText)
    }
  },
  methods: {
    searchData () {
      this.currentPage = 1
      this.getPersonList('', this.pagesize, this.currentPage, this.searchText)
    },
    handleTreeClick (data) {
      this.departmentText = data.name
      this.department = data
    },
    // 获取资源
    getDepartmentTree () {
      personDataService.getDepartmentTree().then((res) => {
        this.departmentData = res
      })
    },
    selected () {
      var userIds = _.map(this.selectPersonList, 'uuid').join(',')
      personDataService.batchModifyDeptIdByUserId(this.department.uuid, userIds).then((res) => {
        this.$message({
          message: '批量修改部门成功',
          type: 'success'
        })
        this.selectPersonList = []
        this.$emit('add-done')
      }).catch(() => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
    clearSelected (row) {
      this.selectPersonList = this.selectPersonList.del(row)
      // this.selectPersonList.splice(index, 1)
    },
    handlePersonList () {
      this.multipleSelection.forEach((item) => {
        let userIdsList = _.map(this.selectPersonList, 'uuid')
        if (!userIdsList.includes(item.uuid)) {
          this.selectPersonList.push(item)
        }
      })
    },
    handleCurrentChange (val) {
      // console.log(this.pagesize)
      if (this.searchText) {
        this.getPersonList('', this.pagesize, val, this.searchText)
      } else {
        this.getPersonList('', this.pagesize, val)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.currentPage = 1
      // console.log(this.pagesize)
      this.getPersonList('', this.pagesize, this.currentPage)
    },
    getPersonList (id, page, val, search) {
      // console.log(id, page, val, code)
      personDataService.getPersonList(id, page, val, search).then((res) => {
        if (res) {
          this.currentPage = res.curPage
          this.total = res.count
          this.personList = res.result
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleModDeptDialogClose () {
      this.selectPersonList = []
      this.$emit('dialog-close')
    },
    cancel () {
      this.selectPersonList = []
      this.$emit('dialog-close')
    }
  },
  mounted () {
    this.getDepartmentTree()
    // this.getPersonList('', this.pagesize, this.currentPage, this.searchText)
  }
}
</script>

<style lang="scss" scoped>
.choose-wrap {
  margin-bottom: 10px;
  font-size: $font-size;
}
</style>
