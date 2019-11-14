<template>
  <div v-loading="loading">
    <el-form class="yw-form" >
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                    icon="el-icon-plus"
                    @click="showAddDialog">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="update()">修改</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="clear()">删除</el-button>
        <el-button type="text"
                    icon="el-icon-upload2"
                    @click="importInstance()">导入信息</el-button>
        <el-button type="text"
                    icon="el-icon-download"
                     @click="exportExcelData('networkCard')">全部导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  :element-loading-text="loading_text"
                  border
                  height="calc(100vh - 210px)"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            label="名称"
            prop="networkCardName"
            width="115px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="链接状态"
            prop="networkCardStatus"
            width="115px">
          </el-table-column>
          <el-table-column
            label="端口类型"
            prop="portType"
            width="115px">
          </el-table-column>
          <el-table-column
            label="端口速率"
            prop="portRate"
            width="115px">
          </el-table-column>
          <el-table-column
            label="IPv4地址"
            prop="ipv4Address"
            width="115px">
          </el-table-column>
          <el-table-column
            label="IPv6地址"
            prop="ipv6Address"
            width="115px">
          </el-table-column>
          <el-table-column
            label="MAC地址"
            prop="macAddress"
            width="115px">
          </el-table-column>
          <el-table-column
            label="默认网关"
            prop="defaultGateway"
            width="115px">
          </el-table-column>
          <el-table-column
            label="是否DHCP"
            prop="isDhcp"
            width="115px">
          </el-table-column>
          <el-table-column
            label="DHCP地址"
            prop="dhcpAddress"
            width="115px">
          </el-table-column>
          <el-table-column
            label="DNS服务器"
            prop="dnsServer"
            width="115px">
          </el-table-column>
          <el-table-column
            label="描述"
            prop="remark"
            width="115px"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <AddDialog :dialogMsg="dialogMsg"
               :instanceId="instanceId"
               :formData="formData"
               @reload="getNetworkCardData"
               v-if="dialogMsg.showDialog"></AddDialog>
    <YwImport ref="importInstances"
              v-if="importData.isImport"
              :showImport="importData.isImport"
              :instanceId="instanceId"
              @setImportDisplay="setImportDisplay"
              :importType="importData.importType"></YwImport>
  </div>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  export default {
    components: {
      AddDialog: () => import('src/pages/resource/iframe/detail/addNetworkCard.vue'),
      YwImport: () => import('src/components/common/yw-import.vue')
    },
    data () {
      return {
        tableData: [],  // 列表数据
        instanceId: this.$route.query.instanceId,
        loading: false,
        loading_text: '正在查询数据, 请稍等...',
        importData: {
          isImport: false,
          importType: 'networkCard'
        },
        ids: '',
        formData: {},
        dialogMsg: {
          dialogTitle: '新增信息',
          showDialog: false,
          add: true
        }
      }
    },
    mounted () {
      this.getNetworkCardData()
    },
    methods: {
      // 导出
      exportExcelData(exportType) {
        // if(this.tableData.length == 0){
        //   return;
        // }
        this.loading = true
        this.loading_text = '正在导出数据,请稍等...'
        const params = {
          instanceId: this.instanceId,
          fileName: '网卡或端口信息',
          header: ['名称','链接状态','端口类型','端口速率','IPv4地址','IPv6地址','MAC地址','默认网关','是否DHCP','DHCP地址','DNS服务器','描述'],
          header_key: ['network_card_name','network_card_status','port_type','port_rate','ipv4_address','ipv6_address','mac_address','default_gateway','is_dhcp','dhcp_address','dns_server','remark']
        }
        rbCmdbServiceFactory.downloadReport(exportType, params).then((res) => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = params.fileName + '.xlsx'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        }).finally(() => {
          this.loading = false
          this.loading_text = '正在查询数据,请稍等...'
        })
      },
      handleSelectionChange(val){
        if(val) {
          this.formData = val[0]
          var rsStr = val[0].id
          for(var i=1;i<val.length;i++){
            rsStr = rsStr +  "," + val[i].id
          }
          this.ids = rsStr
        }
      },
      // 修改网卡信息
      update() {
        var array = this.ids.split(',').length
        if(this.ids != '' && array < 2){
          this.dialogMsg.showDialog = true
          this.dialogMsg.add = false
          this.dialogMsg.dialogTitle = '修改信息'
        } else {
          this.$message.error('请正确勾选')
        }
      },
      // 删除网卡信息
      clear() {
        if(this.ids != ''){
          this.$confirm('确认要删除选中的信息吗?').then(() => {
            var params = {
              id: this.ids
            }
            rbCmdbServiceFactory.deleteNetworkCardByLogic(params).then((res) => {
              if (res.success) {
                this.$message.success(res.msg)
                this.getNetworkCardData()
              } else {
                this.$message.error(res.msg)
              }
            })
          })
        } else {
          this.$message.error('请勾选对象')
        }
      },
      // 获取网卡信息
      getNetworkCardData(){
        this.loading = true
        var params = {
          instanceId: this.instanceId
        }
        rbCmdbServiceFactory.getNetworkCardByInstanceId(params).then((res) => {
          this.tableData = res
          this.loading = false
        })
      },
      importInstance () {
        this.importData.isImport = true
      },
      showAddDialog () {
        this.dialogMsg.showDialog = true
        this.dialogMsg.dialogTitle = '新增信息'
        this.dialogMsg.add = true
        this.formData = {}
      },
      // 导入弹窗
      setImportDisplay (val) {
        this.importData.isImport = val
        this.getNetworkCardData()
      }
    }
  }
</script>

<style scoped>

</style>
