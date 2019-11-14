<!--
@author huangzhijie
@date   19.3.12
@description 资源管理页面 - 新增
-->
<template>
  <div class="res-mange">
    <div class="res-mange__top">
      <el-row style="margin-left: 20px;margin-right: 20px;  background: #fff;border: 1px solid #DCDFE6;border-radius: 8px;padding-left: 10px;">
        <el-form ref="resourceform"
          :rules="resourceRules"
          :inline="true"
          :model="resourceForm" class="demo-form-inline">
          <el-form-item label="资源名称" prop="name" style="margin-top: 22px;">
            <el-input v-model="resourceForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="资源描述" prop="describe" style="margin-top: 22px;">
            <el-input v-model="resourceForm.describe" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div class="res-mange__main">
      <el-row :gutter="50">
        <el-col :span="18" class="res-manage__aicon">
            <p class="res-manage__title">通用权限</p>
            <el-row :gutter="35">
              <el-col :span="8" >
                <comtree
                  :ref="treeName1"
                  class="res-manage__tree"
                  node-key="uuid"
                  :default-expanded-keys="areaDataExpanded"
                  :default-checked-keys="areaDataChecked"
                  :data="areaData"
                  :props="areaDataDefault"
                  show-checkbox
                  :exId="treeName1"
                  @check="treeName1ClickHandler"
                  ex-show-search></comtree>
              </el-col>
              <el-col :span="8" >
                <comtree
                  :ref="treeName2"
                  class="res-manage__tree"
                  node-key="uuid"
                  :default-expanded-keys="[0]"
                  :default-checked-keys="deviceTypeDataChecked"
                  :data="deviceTypeData"
                  :props="deviceTypeDataDefault"
                  show-checkbox
                  :exId="treeName2"
                  @check="treeName2ClickHandler"
                  ex-show-search></comtree>
              </el-col>
               <el-col :span="8">
                <comtree
                  :ref="treeName3"
                  class="res-manage__tree"
                  node-key="uuid"
                  :default-expanded-keys="[0]"
                  :default-checked-keys="bizSystemDataChecked"
                  :data="bizSystemData"
                  :props="bizSystemDataDefault"
                  show-checkbox
                  :exId="treeName3"
                  @check="treeName3ClickHandler"
                  ex-show-search></comtree>
              </el-col>
            </el-row>
            <!--<i class="icon el-icon-arrow-right"></i>-->
          </el-col>
          <el-col :span="6">
            <comtree
              :ref="treeName4"
              class="res-manage__tree"
              node-key="uuid"
              :default-expanded-keys="deviceAuthDataExpanded"
              :default-checked-keys="deviceAuthDataChecked"
              :expand-on-click-node="true"
              :data="deviceAuthData"
              :props="deviceDataDefault"
              show-checkbox
              :exId="treeName4"
              ex-title="特殊权限"
              ex-show-search
              :lazy="true"
              :load="loadHandler"></comtree>
          </el-col>
      </el-row>
    </div>
    <div class="res-mange__foot">
      <el-button type="primary" class="mod-btn"
        @click="handleSave">保存</el-button>
    </div>
  </div>
</template>
<script>
  import resourceDataService from 'src/services/sys/reource-services.js'
  // import configDictService from 'src/services/cmdb/rb-configDict-service.factory'
  import comtree from 'src/pages/system_manage/components/tree.vue'

  export default {
    components: {
      comtree
    },
    data () {
      return {
        resourceForm: {
          pid: '',
          id: '',
          name: '',
          describe: ''
        },
        resourceRules: {
          name: [
            { required: true, message: '请输入资源名称', trigger: 'blur' }
          ]
          // describe: [
          //  { required: true, message: '请输入资源名称', trigger: 'blur' }
          // ]
        },
        treeName1: 'areaTree',
        treeName2: 'deviceTypeTree',
        treeName3: 'bizSystemTree',
        treeName4: 'deviceAuthTree',
        deviceTypeData: [],
        deviceTypeDataDefault: {
          label: 'name',
          children: 'subList'
        },
        bizSystemData: [],
        bizSystemDataChecked: [],
        bizSystemDataDefault: {
          label: 'name',
          children: 'subList'
          // disabled: function (data, node) {
          //   return true
          // }
        },
        deviceTypeDataChecked: [],
        areaData: [],
        areaDataExpanded: [],
        areaDataChecked: [],
        deviceAuthData: [],
        deviceAuthDataExpanded: [],
        deviceAuthDataChecked: [],
        deviceAuthCheckName: [],
        areaDataDefault: {
          label: 'name',
          children: 'subList'
        },
        deviceDataDefault: {
          label: 'name',
          children: 'subList',
          isLeaf: 'isLeaf'
        }
      }
    },
    methods: {
      loadHandler (node, resolve) {
        if (node.data && node.data.type && node.data.type !== 'room') {
          return resolve(node.data.subList)
        } else if (node.data && node.data.type && node.data.type === 'room') {
          const deviceTypeData = _.map(this.$refs[this.treeName2].getCheckedNodes(true, false), 'uuid').join(',')
          const bizSystemData = _.map(this.$refs[this.treeName3].getCheckedNodes(true, false), 'uuid').join(',')
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
        if (node.data.uuid) {
          authIdArray.push(node.data.uuid)
        }
        if (node.parent) {
          this.getParseId(node.parent, authIdArray)
        }
      },
      treeName3ClickHandler (data, data1) {
        let test = JSON.parse(JSON.stringify(this.deviceAuthData))
        this.deviceAuthData = test
      },
      treeName2ClickHandler (data, data1) {
        let test = JSON.parse(JSON.stringify(this.deviceAuthData))
        this.deviceAuthData = test
      },
      treeName1ClickHandler (data, data1) {
        let checkedKey = data1.checkedKeys
        let halfCheckedKeys = data1.halfCheckedKeys
        checkedKey = checkedKey.concat(halfCheckedKeys)
        if (checkedKey && checkedKey.length > 0) {
          // resourceDataService.getDeviceTree(checkedKey.join(',')).then((res) => {
          //   this.deviceAuthData = res
          // })
          var deviceAuthData = JSON.parse(JSON.stringify(this.areaData))
          this.deviceAuthData = this.getDeviceAuthData(deviceAuthData, checkedKey)
        } else {
          this.deviceAuthData = []
        }
      },
      // treeName1ClickHandler (data, data1) {
      //   let checkedKey = data1.checkedKeys
      //   let halfCheckedKeys = data1.halfCheckedKeys
      //   checkedKey = checkedKey.concat(halfCheckedKeys)
      //   if (checkedKey && checkedKey.length > 0) {
      //     resourceDataService.getDeviceTree(checkedKey.join(',')).then((res) => {
      //       let authIds = []
      //       this.getAuthIds(res, authIds)
      //       const deviceTypeData = this.deviceTypeDataChecked
      //       const bizSystemData = this.bizSystemDataChecked
      //       let param = {}
      //       param.area = authIds.join(',')
      //       param.deviceType = deviceTypeData.join(',')
      //       param.bizSystem = bizSystemData.join(',')
      //       resourceDataService.getAuthDevice(param).then((result) => {
      //         this.getTree(res, result)
      //         this.deviceAuthData = res
      //       })
      //     })
      //   } else {
      //     this.deviceAuthData = []
      //   }
      // },
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
            this.getParseId(this.$refs[this.treeName1].getNode(item.id), authIdArray)
            let authId = authIdArray.reverse().join('_')
            authIds.push(authId)
          }
          if (item.subList) {
            this.getAuthIds(item.subList, authIds)
          }
        })
      },
      resetData () {
        this.resourceForm = {
          pid: '',
          id: '',
          name: '',
          describe: '',
          areaData: '',
          deviceTypeData: '',
          deviceData: ''
        }
        this.$refs[this.treeName1].setCheckedKeys([])
        this.$refs[this.treeName2].setCheckedKeys([])
        this.$refs[this.treeName3].setCheckedKeys([])
        this.$refs[this.treeName4].setCheckedKeys([])
      },
      handleSave () {
        this.$refs['resourceform'].validate((valid) => {
          if (valid) {
            if (this.$route.query.pid) {
              const resourceForm = this.processDataForAdd()
              this.addResource(resourceForm)
            } else {
              const resourceForm = this.processDataForUpdate()
              this.updateResource(resourceForm)
            }
          } else {
            return false
          }
        })
      },
      processDataForUpdate () {
        const deviceTypeData = this.processDeviceTypeData()
        const areaData = this.processtAreaData()
        const deviceData = this.processtdeviceAuthData()
        const bizSystemData = this.processBizSystemData()
        this.resourceForm.deviceType = deviceTypeData
        this.resourceForm.area = areaData
        this.resourceForm.device = deviceData
        this.resourceForm.bizSystem = bizSystemData
        // console.log('processDataForUpdate', this.resourceForm)
        return this.resourceForm
      },
      processDataForAdd () {
        const deviceTypeData = this.processDeviceTypeData()
        const areaData = this.processtAreaData()
        const deviceData = this.processtdeviceAuthData()
        const bizSystemData = this.processBizSystemData()

        this.resourceForm.deviceType = deviceTypeData
        this.resourceForm.area = areaData
        this.resourceForm.device = deviceData
        this.resourceForm.bizSystem = bizSystemData
        this.resourceForm.pid = this.$route.query.pid

        // console.log('processDataForAdd', this.resourceForm)
        return this.resourceForm
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
      processtAreaData () {
        const data = this.$refs[this.treeName1].getCheckedNodes()
        // const data1 = this.$refs[treeName].getCurrentNode()
        // console.log(data)
        let treeData = []
        // let checkList = []
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.type === 'room') {
              var parentId = this.$refs[this.treeName1].getNode(item.uuid).parent.key
              treeData.push(parentId + '_' + item.uuid)
            }
          })
          return treeData.join(',')
        } else {
          return ''
        }
      },
      processDeviceTypeData () {
        return this._processTreeData(this.treeName2, 'uuid')
      },
      processBizSystemData () {
        return this._processTreeData(this.treeName3, 'uuid')
      },
      processtdeviceAuthData () {
        return this._processTreeData(this.treeName4, 'uuid')
      },
      // 取出树里的数据
      _processTreeData (treeName, keyName) {
        const data = this.$refs[treeName].getCheckedNodes(true, false)
        // console.log(data)
        let treeData = []
        if (data && data.length > 0) {
          data.map((item) => {
            treeData.push(String(item[keyName]))
          })
          return treeData.join(',')
        } else {
          return ''
        }
      },
      handleDetailData (data) {
        // console.log('handleDetailData', data)
        this.resourceForm.id = data.uuid
        this.resourceForm.name = data.name
        this.resourceForm.describe = data.describe

        const constraints = data.permissions[0].constraints[0]
        const parents = data.parents[0]
        // console.log(1, 'handleDetailData constraints', constraints)
        if (parents && parents.uuid) {
          this.resourceForm.pid = parents.uuid
        } else {
          this.resourceForm.pid = resourceDataService.ROOT_ID
        }
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
      addResource (data) {
        // console.log(data)
        resourceDataService.addResource(data).then((res) => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.resetData()
          this.$router.push({
            path: '/system_manage/resource'
          })
        })
      },
      updateResource (data) {
        // console.log(data)
        resourceDataService.updateResource(data).then((res) => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.resetData()
          this.$router.push({
            path: '/system_manage/resource'
          })
        })
      },
      // 获取详细数据
      getResourceDetail (id) {
        resourceDataService.getResourceDetail(id).then((res) => {
          this.handleDetailData(res)
        })
      },
      // 获取设备类型
      getDevicetypeList () {
        resourceDataService.getDevicetypeList().then((res) => {
          this.deviceTypeData = res
        })
      },
      getBizSysData () {
        resourceDataService.getBizSysList().then((res) => {
          this.bizSystemData = res
        })
      },
      // 获取通用权限
      getAreaAuthData () {
        resourceDataService.getAreaTree().then((res) => {
          this.areaData = res
          if (res.length > 0) {
            this.areaDataExpanded = [res[0].id]
          }
        })
      },
      // 获取特殊权限
      getDeviceSpceialAuthData () {
        resourceDataService.getDeviceTree().then((res) => {
          // TODO
          // this.deviceAuthData = res
          // if (res.length > 0) {
          //   this.deviceAuthDataExpanded = [res[0].id]
          // }
        })
      }
    },
    mounted () {
      this.getAreaAuthData()
      this.getBizSysData()
      this.getDeviceSpceialAuthData()
      this.getDevicetypeList()
      if (this.$route.query.id) {
        this.getResourceDetail(this.$route.query.id)
      }
    }
  }
</script>
<!--<style lang="scss">-->
  <!--.res-manage__tree {-->
    <!--height: 400px;-->
    <!--.el-tree {-->
      <!--height: 350px;-->
      <!--overflow-y: auto;-->
    <!--}-->
  <!--}-->
  <!--.el-form-item__label {-->
    <!--font-size: 12px;-->
  <!--}-->
  <!--.el-input__inner {-->
    <!--border-radius: 4px;-->
  <!--}-->
<!--</style>-->
<style lang="scss" scoped>
  .res-manage__tree {
    height: 400px;
    /deep/ .el-tree {
      height: 350px;
      overflow-y: auto;
    }
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-input__inner {
    border-radius: 4px;
  }
  .res-mange {
    background: #F4F4F4;
    font-size:12px;
    /*.res-mange__top {*/
      /*background: #fff;*/
      /*border: 1px solid #DCDFE6;*/
      /*border-radius: 8px;*/
    /*}*/
    .el-tree {
      padding: 10px;
      height: 400px;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
    }
    .res-mange__main {
      margin-bottom: 20px;
      padding: 20px;
      border-radius: 8px;
      background: #F4F4F4;
    }

    .search-box {
      margin-bottom: 14px;
    }
  }
</style>
