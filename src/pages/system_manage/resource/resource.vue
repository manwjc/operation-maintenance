<!--
@author huangzhijie
@date   19.2.27
@description 资源管理页面
-->
<template>
  <div class="components-container yw-dashboard">
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="handleAdd">增加资源</el-button>
      </div>
      <div>
        <el-row :gutter="35">
          <el-col :span="5">
            <div class="resoure">
              <div class="res-manage__main">
                <comtree class="res-manage__tree"
                         :ref="treeName1"
                         :data="resourceData"
                         :props="resourceTreeDefault"
                         node-key="id"
                         ex-title="资源"
                         :exId="treeName1"
                         :ex-control="true"
                         :ex-control-opt="customControl"
                         ex-show-search
                         @node-click="handleNodeClick">
                </comtree>
              </div>
            </div>
          </el-col>
          <el-col :span="18"
                  style="padding-left:0;">
            <div class="resoure">
              <div class="res-manage__main">
                <el-row :gutter="50">
                  <el-col :span="18"
                          class="res-manage__aicon">
                    <p class="res-manage__title">通用权限</p>
                    <el-row :gutter="35">
                      <el-col :span="8">
                        <comtree :ref="treeName2"
                                 class="res-manage__tree"
                                 node-key="uuid"
                                 :default-expanded-keys="areaDataExpanded"
                                 :default-checked-keys="areaDataChecked"
                                 :data="areaData"
                                 :props="areaDataDefault"
                                 show-checkbox
                                 :exId="treeName2"
                                 ex-show-search></comtree>
                        <!--@check="treeName1ClickHandler"-->
                      </el-col>
                      <el-col :span="8">
                        <comtree :ref="treeName3"
                                 class="res-manage__tree"
                                 node-key="uuid"
                                 :default-expanded-keys="[0]"
                                 :default-checked-keys="deviceTypeDataChecked"
                                 :data="deviceTypeData"
                                 :props="deviceTypeDataDefault"
                                 show-checkbox
                                 :exId="treeName3"
                                 ex-show-search></comtree>
                      </el-col>
                      <el-col :span="8">
                        <comtree :ref="treeName4"
                                 class="res-manage__tree"
                                 node-key="uuid"
                                 :default-expanded-keys="[0]"
                                 :default-checked-keys="bizSystemDataChecked"
                                 :data="bizSystemData"
                                 :props="bizSystemDataDefault"
                                 show-checkbox
                                 :exId="treeName4"
                                 ex-show-search></comtree>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="6">
                    <comtree :load="loadHandler"
                             :lazy="true"
                             :ref="treeName5"
                             class="res-manage__tree"
                             node-key="uuid"
                             :default-expanded-keys="deviceAuthDataExpanded"
                             :default-checked-keys="deviceAuthDataChecked"
                             :data="deviceAuthData"
                             :props="areaDataDefault"
                             show-checkbox
                             :exId="treeName5"
                             ex-title="特殊权限"
                             ex-show-search></comtree>

                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-dialog :visible.sync="dialogTableVisible"
                     :show-close="false"
                     width="450px"
                     top="12%"
                     class="acc-manage__dialog">
            <span class="dialog__header">已绑定账号</span>
            <el-table class="mod-table"
                      :data="accountList"
                      style="width: 100%"
                      highlight-current-row>
              <el-table-column prop="account"
                               label="账号">
              </el-table-column>
              <el-table-column prop="name"
                               label="用户名">
              </el-table-column>
              <el-table-column prop="dept_id"
                               label="部门">
              </el-table-column>
              <el-table-column prop="no"
                               label="工号">
              </el-table-column>
            </el-table>
            <span slot="footer"
                  class="acc-manage dialog-footer">
              <el-button class="mod-btn"
                         @click="dialogTableVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </el-row>
      </div>

    </el-form>

    <!-- dialog -->

    <!-- dialog -->
  </div>

  <!-- <el-row :gutter="35">

    <div class="res-manage__top"
         style="padding-left: 17.5px; padding-right: 17.5px; padding-bottom: 10px;">
      <el-button type="primary"
                 @click="handleAdd"
                 size="small"
                 class="mod-btn"><i class="el-icon-plus"
           style="margin-right:4px;"></i>增加资源</el-button>
    </div>

    <el-col :span="5">
      <div class="resoure">
        <div class="res-manage__main">
          <comtree class="res-manage__tree"
                   :ref="treeName1"
                   :data="resourceData"
                   :props="resourceTreeDefault"
                   node-key="id"
                   ex-title="资源"
                   :exId="treeName1"
                   :ex-control="true"
                   :ex-control-opt="customControl"
                   ex-show-search
                   @node-click="handleNodeClick">
          </comtree>
        </div>
      </div>
    </el-col>
    <el-col :span="18"
            style="padding-left:0;">
      <div class="resoure">
        <div class="res-manage__main">
          <el-row :gutter="50">
            <el-col :span="18"
                    class="res-manage__aicon">
              <p class="res-manage__title">通用权限</p>
              <el-row :gutter="35">
                <el-col :span="8">
                  <comtree :ref="treeName2"
                           class="res-manage__tree"
                           node-key="uuid"
                           :default-expanded-keys="areaDataExpanded"
                           :default-checked-keys="areaDataChecked"
                           :data="areaData"
                           :props="areaDataDefault"
                           show-checkbox
                           :exId="treeName2"
                           ex-show-search></comtree>
                </el-col>
                <el-col :span="8">
                  <comtree :ref="treeName3"
                           class="res-manage__tree"
                           node-key="uuid"
                           :default-expanded-keys="[0]"
                           :default-checked-keys="deviceTypeDataChecked"
                           :data="deviceTypeData"
                           :props="deviceTypeDataDefault"
                           show-checkbox
                           :exId="treeName3"
                           ex-show-search></comtree>
                </el-col>
                <el-col :span="8">
                  <comtree :ref="treeName4"
                           class="res-manage__tree"
                           node-key="uuid"
                           :default-expanded-keys="[0]"
                           :default-checked-keys="bizSystemDataChecked"
                           :data="bizSystemData"
                           :props="bizSystemDataDefault"
                           show-checkbox
                           :exId="treeName4"
                           ex-show-search></comtree>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <comtree :load="loadHandler"
                       :lazy="true"
                       :ref="treeName5"
                       class="res-manage__tree"
                       node-key="uuid"
                       :default-expanded-keys="deviceAuthDataExpanded"
                       :default-checked-keys="deviceAuthDataChecked"
                       :data="deviceAuthData"
                       :props="areaDataDefault"
                       show-checkbox
                       :exId="treeName5"
                       ex-title="特殊权限"
                       ex-show-search></comtree>

            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
    <el-dialog :visible.sync="dialogTableVisible"
               :show-close="false"
               width="450px"
               top="12%"
               class="acc-manage__dialog">
      <span class="dialog__header">已绑定账号</span>
      <el-table class="mod-table"
                :data="accountList"
                style="width: 100%"
                highlight-current-row>
        <el-table-column prop="account"
                         label="账号">
        </el-table-column>
        <el-table-column prop="name"
                         label="用户名">
        </el-table-column>
        <el-table-column prop="dept_id"
                         label="部门">
        </el-table-column>
        <el-table-column prop="no"
                         label="工号">
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="acc-manage dialog-footer">
        <el-button class="mod-btn"
                   @click="dialogTableVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-row> -->
</template>
<script>
import resourceDataService from 'src/services/sys/reource-services.js'
import comtree from 'src/pages/system_manage/components/tree.vue'
import systemAccountService from 'src/services/sys/account-services.js'
export default {
  components: {
    comtree
  },
  data () {
    const that = this
    return {
      treeName1: 'resourceTree',
      treeName2: 'areaTree',
      treeName3: 'deviceTypeTree',
      treeName4: 'bizSystemTree',
      treeName5: 'deviceAuthTree',
      resourceData: [],
      resourceTreeDefault: {
        label: 'name',
        children: 'childList'
      },
      areaData: [],
      bizSystemData: [],
      bizSystemDataDefault: {
        label: 'name',
        children: 'subList',
        disabled: function (data, node) {
          return true
        }
      },
      bizSystemDataChecked: [],
      areaDataExpanded: [],
      areaDataChecked: [],
      areaDataDefault: {
        label: 'name',
        children: 'subList',
        disabled: function (data, node) {
          return true
        }
      },
      deviceTypeData: [],
      deviceTypeDataChecked: [],
      deviceTypeDataDefault: {
        label: 'name',
        children: 'subList',
        disabled: function (data, node) {
          return true
        }
      },
      deviceAuthData: [],
      deviceAuthDataExpanded: [],
      deviceAuthCheckName: [],
      deviceAuthDataChecked: [],
      customControl: [
        {
          title: '编辑',
          icon: 'el-icon-edit-outline',
          callback: that.customEdit
        },
        {
          title: '删除',
          icon: 'el-icon-delete',
          callback: that.customDelete
        }
      ],
      selectedNode: '',
      needAddRoot: false,
      gridData: [],
      dialogTableVisible: false,
      accountList: []
    }
  },
  watch: {
    deviceAuthData: {
      handler (newValue, oldValue) {
        this.$forceUpdate()
      },
      deep: true
    }
  },
  methods: {
    // treeName1ClickHandler (data, data1) {
    //   let checkedKey = data1.checkedKeysloadHandler
    //   let halfCheckedKeys = data1.halfCheckedKeys
    //   checkedKey = checkedKey.concat(halfCheckedKeys)
    //   if (checkedKey && checkedKey.length > 0) {
    //     resourceDataService.getDeviceTree(checkedKey.join(',')).then((res) => {
    //       this.deviceAuthData = res
    //     })
    //   } else {
    //     this.deviceAuthData = []
    //   }
    // },
    // loadHandler (node, resolve) {
    //   if (node.data && node.data.type && node.data.type !== 'roomId') {
    //     return resolve(node.data.subList)
    //   } else if (node.data && node.data.type && node.data.type === 'roomId') {
    //     const deviceTypeData = this.deviceTypeDataChecked
    //     const bizSystemData = this.bizSystemDataChecked
    //     let authIdArray = []
    //     this.getParseId(node, authIdArray)
    //     const authId = authIdArray.reverse().join('_')
    //     let param = {}
    //     param.area = authId
    //     param.deviceType = deviceTypeData
    //     param.bizSystem = bizSystemData
    //     resourceDataService.getAuthDevice(param).then((res) => {
    //       return resolve(res[authId])
    //     })
    //   } else {
    //     return resolve([])
    //   }
    // },
    loadHandler (node, resolve) {
      if (node.data && node.data.type && node.data.type !== 'room') {
        return resolve(node.data.subList)
      } else if (node.data && node.data.type && node.data.type === 'room') {
        const deviceTypeData = _.map(this.$refs[this.treeName3].getCheckedNodes(true, false), 'uuid').join(',')
        const bizSystemData = _.map(this.$refs[this.treeName4].getCheckedNodes(true, false), 'uuid').join(',')
        let parentId = node.parent.data.uuid
        let authId = parentId + '_' + node.data.uuid
        let param = {}
        param.area = authId
        param.deviceType = deviceTypeData
        param.bizSystem = bizSystemData
        resourceDataService.getAuthDevice(param).then((res) => {
          res.forEach((item, index) => {
            item.isLeaf = true
          })
          return resolve(res)
        })
      } else {
        return resolve([])
      }
    },
    getParseId (node, authIdArray) {
      if (node.data.id) {
        authIdArray.push(node.data.id)
      }
      if (node.parent) {
        this.getParseId(node.parent, authIdArray)
      }
    },
    // 重置
    resetData () {
      this.$refs[this.treeName2].setCheckedKeys([])
      this.$refs[this.treeName3].setCheckedKeys([])
      this.$refs[this.treeName4].setCheckedKeys([])
      this.$refs[this.treeName5].setCheckedKeys([])
      this.deviceTypeDataChecked = []
      this.areaDataChecked = []
      this.deviceAuthDataChecked = []
      this.bizSystemDataChecked = []
    },
    // 点新增
    handleAdd () {
      if (this.selectedNode) {
        this.goAdd(this.selectedNode)
      } else {
        this.goAdd(resourceDataService.ROOT_ID)
      }
    },
    goAdd (pid) {
      this.$router.push({
        path: '/system_manage/resource-add',
        query: {
          pid: pid
        }
      })
    },
    // 点击资源
    handleNodeClick (data) {
      this.selectedNode = data.uuid
      this.getResourceDetail(data.uuid)
    },
    // 获取账户列表
    getAccountList (pageSize, pageNo, searchData) {
      this.accountList = []
      systemAccountService.getAccountList(pageSize, pageNo, searchData).then((res) => {
        if (res) {
          res.results.map((item) => {
            if (item.userInfo !== undefined) {
              this.accountList.push({
                account: item.username,
                name: item.userInfo.name,
                dept_id: item.userInfo.dept_id,
                no: item.userInfo.no
              })
            }
          })
        }
      })
    },
    // 修改
    customEdit (node, data) {
      this.$router.push({
        path: '/system_manage/resource-add',
        query: {
          id: data.uuid
        }
      })
    },
    // 删除
    customDelete (node, data) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resourceDataService.deleteResource(data.uuid).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$refs[this.treeName1].remove(node)
        })
      })
    },
    // 显示详细数据
    handleDetailData (data) {
      const constraints = data.permissions[0].constraints[0]
      if (constraints.deviceType) {
        this.deviceTypeDataChecked = constraints.deviceType.split(',')
      }
      if (constraints.area) {
        var areaChecked = constraints.area.split(',')
        let allIds = []
        let roomDataChecked = []
        areaChecked.forEach(item => {
          let itemArea = item.split('_')
          if (!allIds.includes(itemArea[0])) {
            allIds.push(itemArea[0])
          }
          if (!roomDataChecked.includes(itemArea[1])) {
            roomDataChecked.push(itemArea[1])
          }
        })
        this.areaDataChecked = roomDataChecked
        if (constraints.device) {
          this.deviceAuthDataChecked = constraints.device.split(',')
          resourceDataService.getInstance(constraints.device).then((res) => {
            let roomList = _.map(res, 'roomId')
            let idcList = _.map(res, 'idcType')
            this.deviceAuthCheckName = _.uniq(roomList).concat(_.uniq(idcList))
            allIds = allIds.concat(roomDataChecked)
            this.parseIds(constraints.area, allIds)
          })
        } else {
          allIds = allIds.concat(roomDataChecked)
          this.parseIds(constraints.area, allIds)
        }
        // this.areaDataChecked =  areaChecked.split('_')
      }
      if (constraints.bizSystem) {
        this.bizSystemDataChecked = constraints.bizSystem.split(',')
      }
    },
    async parseIds (param, allIds) {
      if (allIds && allIds.length > 0) {
        await resourceDataService.getDeviceTree().then((res) => {
          this.deviceAuthData = this.getDeviceAuthData(res, allIds)
          let expandedKey = []
          this.getDeviceAuthDataChecked(this.deviceAuthData, this.deviceAuthCheckName, expandedKey)
          this.deviceAuthDataExpanded = expandedKey
          this.$forceUpdate()
        })
      } else {
        this.deviceAuthData = []
      }
      // }
    },
    getDeviceAuthDataChecked (data, checkedName, checkKey) {
      data.forEach((item, index) => {
        if (checkedName.includes(item.name)) {
          checkKey.push(item.uuid)
        }
        if (item.type !== 'room' && item.subList && item.subList.length > 0) {
          this.getDeviceAuthDataChecked(item.subList, checkedName, checkKey)
        }
      })
    },
    getDeviceAuthData (data, checkedKey) {
      let deviceData = []
      data.forEach((item, index) => {
        if (checkedKey.includes(item.uuid)) {
          if (item.subList && item.subList.length > 0) {
            let subDeviceData = this.getDeviceAuthData(item.subList, checkedKey)
            item.subList = subDeviceData
          }
          deviceData.push(item)
        }
      })
      return deviceData
    },
    getTree (res, authData) {
      res.forEach(item => {
        if (authData[item.id]) {
          item.subList = authData[item.id]
        }
        if (item.subList) {
          this.getTree(item.subList, authData)
        }
      })
    },
    getAuthIds (res, authIds) {
      res.forEach(item => {
        if (item.type === 'roomId') {
          let authIdArray = []
          this.getParseId(this.$refs[this.treeName2].getNode(item.id), authIdArray)
          let authId = authIdArray.reverse().join('_')
          authIds.push(authId)
        }
        if (item.subList) {
          this.getAuthIds(item.subList, authIds)
        }
      })
    },
    // 获取资源
    getResourceList () {
      resourceDataService.getResourceList().then((res) => {
        if (res) {
          this.needAddRoot = res.length === 0
        }
        this.resourceData = res
      })
    },
    // 获取设备类型
    getDevicetypeList () {
      resourceDataService.getDevicetypeList().then((res) => {
        this.deviceTypeData = res
      })
    },
    // 获取通用权限
    getAreaData () {
      resourceDataService.getAreaTree().then((res) => {
        this.areaData = res
        if (res.length > 0) {
          this.areaDataExpanded = [res[0].id]
        }
      })
    },
    getBizSysData () {
      resourceDataService.getBizSysList().then((res) => {
        this.bizSystemData = res
      })
    },
    // 获取特殊权限
    // getDeviceAuthData () {
    //   resourceDataService.getDeviceTree().then((res) => {
    //     // this.deviceAuthData = res
    //     // if (res.length > 0) {
    //     //   this.deviceAuthDataExpanded = [res[0].id]
    //     // }
    //   })
    // },
    // 获取详细数据
    getResourceDetail (id) {
      this.resetData()
      resourceDataService.getResourceDetail(id).then((res) => {
        this.handleDetailData(res)
      })
    }
    // 展开查看账户
  },
  mounted () {
    this.getResourceList()
    this.getAreaData()
    this.getBizSysData()
    // this.getDeviceAuthData()
    this.getDevicetypeList()
    this.getAccountList()
  }
}
</script>
<style lang="scss" scoped>
/deep/.yw-search-box {
  width: 100%;
}

.mod-btn {
  border-radius: 8px;
}
.res-manage__tree {
  /deep/ .el-tree {
    height: 400px;
    overflow-y: auto;
    overflow-x: auto;
    border-radius: 8px;
  }
}
.resoure {
  // background: #f4f4f4;
  height: 500px;
  padding: 20px;
  border-radius: 8px;
  /deep/ .el-tree {
    padding: 10px;
    height: 400px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
  }
}
.res-manage {
  .el-tree {
    padding: 10px;
    height: 507px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
  }

  .res-manage__top {
    margin-bottom: 20px;
    padding-left: 17.5px;
    padding-right: 17.5px;
  }

  .res-manage__main {
    margin-bottom: 20px;
    padding: 20px 20px 20px 0;
    border-top: 1px solid #f4f4f4;
  }

  .res-manage__tree {
    .el-tree {
      height: 400px;
    }
  }

  .res-manage__aicon {
    position: relative;
    .icon {
      margin-top: 12px;
      position: absolute;
      top: 50%;
      right: -10px;
      font-size: 24px;
      color: #dddddd;
    }
  }

  .res-manage__title {
    font-size: 12px;
  }
}
/deep/ .acc-manage__dialog {
  font-size: 12px;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto;
    margin-bottom: 0;
    border: 1px solid rgba(229, 232, 237, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
  }
  .dialog__header {
    display: block;
    padding: 14px 0 18px;
  }
  .el-dialog__body {
    font-size: 12px;
    height: 240px;
    overflow-y: auto;
  }
  /*.res-manage__top {*/
  /*padding-left: 17.5px;*/
  /*padding-right: 17.5px;*/
  /*}*/
}
</style>
