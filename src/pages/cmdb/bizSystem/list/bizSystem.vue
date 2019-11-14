<template>
  <el-container class="repertory-panel">
    <!--左侧树-->
    <el-aside width="20%" class="panel-aside"  style="min-width: 150px;max-width: 100%;height: calc(100vh - 136px);" oncontextmenu="self.event.returnValue=false">
      <el-scrollbar style="margin: 20px; min-width: 150px; height: calc(100vh - 180px);">
        <el-tree
          ref="systemTree"
          :default-expand-all="true"
          :highlight-current="true"
          @node-contextmenu="rightClick"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick">
        </el-tree>
        <!--鼠标右键点击出现页面-->
        <div ref="menu" class="menu">
          <ul>
            <li class="menu__item" @click="editCard" v-show="level !== 1">修改</li>
            <li class="menu__item" @click="deleteCard" v-show="level !== 1">下线</li>
            <li class="menu__item" @click="addCard">添加下级业务</li>
          </ul>
        </div>
      </el-scrollbar>
    </el-aside>

    <!--右侧-->
    <el-main class="panel-main">
      <el-form class="components-condition yw-form"
               :inline="true"
               label-width="80px">
        <el-form-item label="一级部门：">
          <el-select v-model="department1" filterable clearable
                     placeholder="请选择" value-key="id"
                     @change="selectFirstDep($event)">
            <el-option
              v-for="(item, index) in departmentList1"
              :key="item.id"
              :label="item.orgName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级部门：">
          <el-select v-model="department2" filterable clearable
                     placeholder="请选择" value-key="id">
            <el-option
              v-for="(item, index) in departmentList2"
              :key="item.id"
              :label="item.orgName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务名称：">
          <el-input v-model="search_bizName"></el-input >
        </el-form-item>
        <el-form-item label="是否禁用：">
          <el-select v-model="search_isdisable" placeholder="请选择" >
            <el-option label="否" value="否"></el-option>
            <el-option label="是" value="是"></el-option>
          </el-select>
        </el-form-item>
        <section class="btn-wrap">
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button @click="cancel('searchHander')">重置</el-button>
        </section>
      </el-form>
      <!-- 检索条件 -->
      <div class="yw-el-table-wrap">
        <el-table border :data="bizSystemData" style="width: 100%;margin-top:10px;cursor: pointer;" stripe tooltip-effect="dark"
                  height="calc(100vh - 330px)" @selection-change="handleSelectionChange" row-key="id" @row-dblclick="selectedRow">
          <el-table-column prop="bizName" label="业务名称" align="center" :show-overflow-tooltip="true" > </el-table-column>
          <el-table-column prop="orgManager.orgName" label="所属组织" align="center" :show-overflow-tooltip="true" > </el-table-column>
          <el-table-column prop="isdisable" label="是否禁用" align="center" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true" ></el-table-column>
        </el-table>
        <el-container>
          <el-container>
            <!-- 数据展示 -->
            <div class="body-container" style="width: 99%">

              <el-row :gutter="20">
                <el-col :span="12" :offset="9">
                  <div class="block">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :total="total"
                                   layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-container>
          <el-container>
            <div >
              <el-table border :data="concatData" style="width: 100%;margin-top:10px;cursor: pointer;" stripe tooltip-effect="dark" height="calc(100vh - 240px)" border>
                <el-table-column prop="name" label="联系人" align="center" ></el-table-column>
                <el-table-column prop="phone" label="电话" align="center" ></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center" ></el-table-column>
              </el-table>
            </div>
          </el-container>
        </el-container>

        <!-- dialog -->
        <div class="dialog">
          <!-- add -->
          <el-dialog :visible.sync="addDialog" width="50%" center :show-close="false" :close-on-click-modal="false" title="新增业务系统">
            <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="80px" size="mini">
              <el-form-item label="上级业务" prop="">
                <el-input v-model="addForm.pname"  :disabled="true" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="业务名称" prop="bizName">
                <el-input v-model="addForm.bizName" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="所属组织" prop="addOrg">
                <select-tree v-show="level === 1" v-model="addForm.orgId" :options="orgTreeData" :props="defaultOrgProps" width="300" :disabled="isAble"/>
                <el-input v-show="level !== 1" v-model="addForm.orgName" style="width: 300px" :disabled="isAble"/>
              </el-form-item>
              <el-form-item label="是否禁用" prop="isdisable">
                <el-select v-model="addForm.isdisable" placeholder="请选择" style="width:300px">
                  <el-option label="否" value="否"></el-option>
                  <el-option label="是" value="是"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows="2" v-model="addForm.remark" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item >
                <div class="tableDate">
                  <div class="table">
                    <el-table
                      :data="addForm.concatData"
                      ref="table"
                      tooltip-effect="dark"
                      border
                      stripe
                      style="width: 100%">
                      <el-table-column label="联系人" min-width="30%">
                        <template slot-scope="scope">
                          <el-form-item :prop="'concatData.' + scope.$index + '.name'">
                            <el-input v-model="scope.row.name" ></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="电话" min-width="30%">
                        <template slot-scope="scope">
                          <el-form-item :prop="'concatData.' + scope.$index + '.phone'"
                                        :rules="{pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '电话格式不正确', trigger: ['blur', 'change']}">
                            <el-input v-model="scope.row.phone" ></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="邮箱" prop="addEmail" min-width="30%">
                        <template slot-scope="scope">
                          <el-form-item :prop="'concatData.' + scope.$index + '.email'"
                                        :rules="{pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '邮箱格式不正确', trigger: ['blur', 'change']}">
                            <el-input v-model="scope.row.email" ></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column min-width="15%">
                        <template slot-scope="scope">
                          <i class="el-icon-circle-plus-outline" style="color: #409eff; font-size:15px;" @click.prevent="addRow('add')"></i>
                          <i v-show="addForm.concatData.length > 1" class="el-icon-remove-outline" style="color: #409eff; font-size:15px;" @click.prevent="delData(scope.$index, addForm.concatData)"></i>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-form-item>
              <el-form-item size="large" >
                <el-button type="primary" class="tem-search1"  @click="saveAddForm('addForm')">确 定</el-button>
                <el-button type="primary" class="tem-search1" @click="cancel('add')">取 消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <!-- update -->
          <el-dialog :visible.sync="updateDialog" width="50%" center :show-close="false" :close-on-click-modal="false" title="编辑业务系统" top="5vh">
            <el-form :model="updateForm" :rules="updateRules" ref="updateForm" label-width="80px" size="mini">
              <el-form-item label="上级业务" prop="pname" >
                <el-input v-model="updateForm.pname"  :disabled="true" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="业务名称" prop="updateBizName">
                <el-input v-model="updateForm.updateBizName" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="所属组织" prop="" >
                <select-tree v-show="level === 2" v-model="updateForm.orgId" :options="orgTreeData" :props="defaultOrgProps" width="300" />
                <el-input v-show="level !== 2" v-model="updateForm.orgName" style="width: 300px" :disabled="isAble"/>
              </el-form-item>
              <el-form-item label="是否禁用" prop="updateIsdisable">
                <el-select v-model="updateForm.updateIsdisable" placeholder="请选择" style="width:300px">
                  <el-option label="否" value="否" ></el-option>
                  <el-option label="是" value="是"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="updateRemark">
                <el-input type="textarea" :rows="2" v-model="updateForm.updateRemark" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item >
                <div class="tableDate">
                  <div class="table">
                    <el-table
                      :data="updateForm.concatData"
                      ref="table"
                      tooltip-effect="dark"
                      border
                      stripe
                      style="width: 100%">
                      <el-table-column label="联系人" min-width="30%">
                        <template slot-scope="scope">
                          <el-form-item :prop="'concatData.' + scope.$index + '.name'">
                            <el-input v-model="scope.row.name" ></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="电话" min-width="30%">
                        <template slot-scope="scope">
                          <el-form-item :prop="'concatData.' + scope.$index + '.phone'"
                                        :rules="updateRules.phone">
                            <el-input v-model="scope.row.phone" ></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="邮箱" min-width="30%">
                        <template slot-scope="scope">
                          <el-form-item :prop="'concatData.' + scope.$index + '.email'"
                                        :rules="updateRules.email">
                            <el-input v-model="scope.row.email" ></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column min-width="15%">
                        <template slot-scope="scope">
                          <i class="el-icon-circle-plus-outline" style="color: #409eff; font-size:15px;" @click.prevent="addRow('update')"></i>
                          <i v-show="updateForm.concatData.length > 1" class="el-icon-remove-outline" style="color: #409eff; font-size:15px;" @click.prevent="delData(scope.$index, updateForm.concatData)"></i>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-form-item>
              <el-form-item size="large" >
                <el-button type="primary" class="tem-search1"  @click="saveEditForm('updateForm')">确 定</el-button>
                <el-button type="primary" class="tem-search1"  @click="cancel('update')">取 消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>

      </div>
    </el-main>
  </el-container>

</template>

<script>
  import bizSystemService from 'src/services/cmdb/rb-bizSystem-service.factory.js'
  import orgManagerService from 'src/services/cmdb/rb-orgManager-service.factory.js'
  import demandServiceFactory from 'src/services/cmdb/rb-demand-service.factory.js'
  import selectTree from 'src/pages/cmdb/bizSystem/list/selectTree.vue'
  export default {
    components: {
      selectTree
    },
    data () {
      return {
        concatData: [],
        currentPage: 1, // 当前页
        pageSize: 100, // 分页每页多少行数据
        pageSizes: [10, 20, 50, 100], // 每页多少行数组
        total: 3, // 总共多少行数据
        search_pid: '0',
        search_bizName: '',
        search_isdisable: '',
        department1: '',
        department2: '',
        treeData: [],
        orgTreeData: [],
        bizSystemData: [],
        parent_biz: [],
        addDialog: false,
        addForm: {
          id: '',
          bizName: '',
          pid: '',
          pname: '',
          orgId: '',
          orgName: '',
          concatData: [],
          isdisable: '否',
          remark: ''
        },
        addRules: {
          bizName: [
            { required: true, message: '请输入业务名称', trigger: 'blur' }
          ]
        },
        updateDialog: false,
        updateForm: {
          id: '',
          updateBizName: '',
          pid: '',
          pname: '',
          orgId: '',
          orgName: '',
          concatData: [],
          updateIsdisable: '',
          updateRemark: ''
        },
        updateRules: {
          updateBizName: [
            { required: true, message: '请输入业务名称', trigger: 'blur' }
          ],
          phone: [
            {pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '电话格式不正确', trigger: ['blur', 'change']}
          ],
          email: [
            {pattern: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: ['blur', 'change']}
          ]
        },
        concatRules: {
          phone: [
            {pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '电话格式不正确', trigger: ['blur', 'change']}
          ],
          email: [
            {pattern: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: ['blur', 'change']}
          ]
        },
        defaultProps: {
          children: 'children',
          label: 'bizName'
        },
        defaultOrgProps: {
          parent: 'pid',   // 父级唯一标识
          value: 'id',  // 唯一标识
          label: 'orgName', // 标签显示
          children: 'children' // 子级
        },
        dynamicModel: {},
        isAble: false, // 所属组织是否可选
        level: '',
        selectedObj: {},
        selectedParentData: {},
        departmentList1: [], // 部门
        departmentList2: [] // 部门
      }
    },
    mounted () {
      this.loadBizTree()
      this.search()
      this.loadOrgTree()

      this.getDepartment()
    },
    methods: {
      // 增加行
      addRow (type) {
        var list = {
          bizId: '',
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
      addCard () {
        let _t = this
        _t.addForm.concatData = [
          {
            bizId: '',
            name: '',
            phone: '',
            email: ''
          }
        ]
        if (_t.level === 1) {
          // 根业务的子业务系统可选择所属组织
          _t.isAble = false
        } else {
          _t.isAble = true
          _t.addForm.orgId = _t.selectedObj.orgId
          if (_t.selectedObj.orgId === '0') {
            _t.addForm.orgName = '根组织'
          } else {
            _t.addForm.orgName = _t.selectedObj.orgName
          }
        }
        _t.addForm.pname = _t.selectedObj.bizName
        _t.addForm.pid = _t.selectedObj.id
        _t.foo()
        _t.addBiz()
      },
      editCard () {
        let _t = this
        if (this.level !== 1) {
          _t.updateForm.pid = _t.selectedParentData.id
          _t.updateForm.pname = _t.selectedParentData.bizName
        }
        if (this.level === 2) {
          _t.isAble = false
          _t.updateForm.orgId = _t.selectedObj.orgId
          if (_t.selectedObj.orgId === '0') {
            _t.updateForm.orgName = '根组织'
          } else {
            _t.updateForm.orgName = _t.selectedObj.orgName
          }
        } else {
          _t.updateForm.orgId = _t.selectedObj.orgId
          _t.isAble = true
        }
        _t.foo()
        _t.editBiz(this.selectedObj.id)
      },
      deleteCard () {
        this.foo()
        this.$confirm('此操作将下线本业务及其子业务，确认下线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _t = this
          let param = {'id': _t.selectedObj.id}
          bizSystemService.deleteById(param).then((res) => {
            if (res === 'success') {
              this.loadBizTree()
              this.$message({
                message: '下线成功',
                type: 'success'
              })
              this.search()
            } else {
              this.$message.error('下线失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下线'
          })
        })
      },
      rightClick (MouseEvent, object, Node, element) { // 鼠标右击触发事件
        // this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
        // this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
        // var menu = document.querySelector('#menu')
        // menu.style.left = MouseEvent.clientX - 220 + 'px'
        // menu.style.top = MouseEvent.clientY - 163 + 'px'
        let _menu = this.$refs['menu']
        if (_menu !== undefined) {
          _menu.style.display = 'block'
          _menu.style.left = MouseEvent.clientX - 220 + 'px'
          _menu.style.top = MouseEvent.clientY - 143 + 'px'
        }
        document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
        this.level = Node.level
        this.selectedObj = object
        this.selectedParentData = Node.parent.data
      },
      foo () {
        // 取消鼠标监听事件 菜单栏
        let _menu = this.$refs['menu']
        if (_menu !== undefined) {
          _menu.style.display = 'none'
        }
        document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
      },
      handleNodeClick (data, node, vuecomponent) {
//          this.$refs.systemTree.setCurrentNode(node)
        let _t = this
        _t.concatData = []
        _t.search_pid = data.id
        let param = {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'pid': _t.search_pid,
          'bizName': _t.search_bizName,
          'isdisable': _t.search_isdisable
        }
        bizSystemService.listBizSystemByPage(param).then((res) => {
          this.total = res.count
          this.bizSystemData = res.data
        })
      },
      loadBizTree () {
        bizSystemService.loadTree().then((res) => {
          this.treeData = res
        })
      },
      loadOrgTree () {
        orgManagerService.loadTree().then((res) => {
          this.orgTreeData = res
        })
      },
      // element相关方法 多选框
      handleSelectionChange (val) {
        this.multipleSelection = val
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
        let _t = this
        _t.concatData = []
        let param = {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'pid': _t.search_pid,
          'department1': _t.department1 && _t.department1.id,
          'department2': _t.department2 && _t.department2.id,
          'bizName': _t.search_bizName,
          'isdisable': _t.search_isdisable
        }
        bizSystemService.listBizSystemByPage(param).then((res) => {
          this.total = res.count
          this.bizSystemData = res.data
        })
      },
      cancel (val) {
        if (val === 'add') {
          this.addDialog = false
          this.$refs['addForm'].resetFields()
        } else if (val === 'update') {
          this.updateDialog = false
          this.$refs['updateForm'].resetFields()
        } else if (val === 'searchHander') {
          this.search_bizName = ''
          this.search_isdisable = ''
        }
        this.search()
      },
      addBiz () {
        this.addDialog = true
        this.addForm.bizName = ''
        this.addForm.remark = ''
        this.concatData = [{
          bizId: '',
          name: '',
          email: '',
          phone: ''
        }]
        this.loadOrgTree()
      },
      saveAddForm (formName) {
        let _t = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addDialog = false
            let concats = []
            let concatList = _t.addForm.concatData
            concatList.forEach((concat) => {
              if ((concat.name !== undefined && concat.name !== '') || (concat.phone !== undefined && concat.phone !== '') || (concat.email !== undefined && concat.email !== '')) {
                concats.push(concat)
              }
            })
            let obj = {
              'bizName': _t.addForm.bizName,
              'pid': _t.addForm.pid,
              'orgId': _t.addForm.orgId,
              'isdisable': _t.addForm.isdisable,
              'remark': _t.addForm.remark,
              'concatList': concats
            }
            // console.log(obj)
            bizSystemService.insert(obj).then((res) => {
              if (res === 'success') {
                this.loadBizTree()
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.search()
              } else {
                this.$message.error('添加失败')
              }
            })
          } else {
            return false
          }
        })
      },
      editBiz (bizId) {
        let _t = this
        _t.loadOrgTree()
        _t.updateDialog = true
        bizSystemService.getById({'id': bizId}).then((res) => {
          _t.updateForm.id = bizId
          _t.updateForm.updateBizName = res.bizName
          _t.updateForm.orgId = res.orgId
          _t.updateForm.updateRemark = res.remark
          _t.updateForm.updateIsdisable = res.isdisable
          if (_t.level !== 2) {
            _t.updateForm.orgId = _t.selectedParentData.orgId
            _t.updateForm.orgName = res.orgManager.orgName
          }
          if (res.concatList.length > 0) {
            _t.updateForm.concatData = res.concatList
          } else {
            _t.updateForm.concatData = [{
              bizId: '',
              name: '',
              email: '',
              phone: ''
            }]
          }
        })
      },
      saveEditForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _t = this
            this.updateDialog = false
            let concats = []
            let concatList = _t.updateForm.concatData
            concatList.forEach((concat) => {
              if ((concat.name !== undefined && concat.name !== '') || (concat.phone !== undefined && concat.phone !== '') || (concat.email !== undefined && concat.email !== '')) {
                concats.push(concat)
              }
            })
            let obj = {
              'id': _t.updateForm.id,
              'bizName': _t.updateForm.updateBizName,
              'pid': _t.updateForm.pid,
              'orgId': _t.updateForm.orgId,
              'isdisable': _t.updateForm.updateIsdisable,
              'remark': _t.updateForm.updateRemark,
              'concatList': concats
            }
            // console.log(obj)
            bizSystemService.update(obj).then((res) => {
              if (res === 'success') {
                this.loadBizTree()
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.search()
              } else {
                this.$message.error('更新失败')
              }
            })
          } else {
            return false
          }
        })
      },
      selectedRow (row) {
        let param = {
          'id': row.id
        }
        bizSystemService.getConcatsById(param).then((res) => {
          this.concatData = res
        })
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
      // 获取部门
      getDepartment () {
        let _t = this
        demandServiceFactory.getDepartment({'pid': '0'}).then((res) => {
          if (res) {
            _t.departmentList1 = []
            _t.departmentList1 = res
          }
        })
      },
      selectFirstDep ($event) {
        let _t = this
        let pid = $event.id
        demandServiceFactory.getDepartment({'pid': pid}).then((res) => {
          if (res) {
            _t.departmentList2 = []
            _t.departmentList2 = res
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-row {
    padding-top: 10px;
  }
  /deep/ .el-table {
    .el-table__body-wrapper {
      overflow-x: auto !important;
    }
  }
  /deep/ .el-table td,/deep/ .el-table th {
    padding: 1px 0;
  }
  .repertory-panel {
    /*width: 100%;*/
    /*overflow:hidden;*/
    .panel-aside {
      background-color: white;
      /*height: calc(100vh - 136px);*/
      /*overflow: hidden;*/
      border-radius: 10px;
    }
    .panel-main {
      margin-left: 15px;
      background-color: white;
      height: calc(100vh - 136px);
      border-radius: 10px;
      overflow: hidden;
    }
  }
  .menu__item {
    display: block;
    line-height: 20px;
    text-align: center;
    margin-top: 10px;
  }
  .menu {
    display: none;
    height: auto;
    width: 85px;
    position: absolute;
    border-radius: 10px;
    border: 1px solid #999999;
    background-color: #f4f4f4;
    z-index: 9999;
  }
  li:hover {
    background-color: #1790ff;
    color: white;
  }
  .el-tree {
    width: 100%;
    overflow: auto;
    height: calc(100vh - 150px);
  }
  .el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
    height: 100%;
  }
  .el-scrollbar {
    margin-left: 5px !important;
    margin-right: 5px !important;
  }
  /*/deep/ .el-input {*/
    /*width: 100px;*/
  /*}*/
</style>
