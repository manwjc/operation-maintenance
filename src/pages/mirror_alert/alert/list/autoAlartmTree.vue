<template>
    <div>
      <el-tree-transfer height="171px" :title="['待选业务线', '已选业务线']" :from_data="unSelectedData" :to_data="selectedData"
                        openAll @addBtn='add' @removeBtn='remove'>
      </el-tree-transfer>
      <div style="border: 1px solid #ebeef5;border-radius: 5px;margin: 10px 0px">
        <el-row style="background-color: #f5f7fa;border-bottom: 1px solid #ebeef5;padding: 10px;">告警分类</el-row>
        <el-row style="padding: 10px;">
          <el-checkbox-group v-model="monitorType">
          <el-checkbox label="5">监控建设</el-checkbox>
          <el-checkbox label="2">主机</el-checkbox>
          <el-checkbox label="4">数据库</el-checkbox>
          <el-checkbox label="3">网络</el-checkbox>
          <el-checkbox label="1">业务</el-checkbox>
        </el-checkbox-group>
        </el-row>
      </div>
      <div style="border: 1px solid #ebeef5;border-radius: 5px;margin: 10px 0px">
        <el-row style="background-color: #f5f7fa;border-bottom: 1px solid #ebeef5;padding: 10px;">告警级别</el-row>
        <el-row style="padding: 10px;">
          <el-checkbox-group v-modelmi="alertLevel">
            <el-checkbox label="5">重大</el-checkbox>
            <el-checkbox label="4">高</el-checkbox>
            <el-checkbox label="3">中</el-checkbox>
            <el-checkbox label="2">低</el-checkbox>
          </el-checkbox-group>
        </el-row>
      </div>
      <span slot="footer" style="float: right;margin: 10px 0px 20px 0px" class="dialog-footer">
          <el-button @click="changeVisible()">取 消</el-button>
          <el-button type="primary" @click="insertAutoAlarmConfig()">确 定</el-button>
        </span>
    </div>
</template>

<script>
  import elTreeTransfer from 'el-tree-transfer'
  import rbMonitorServiceFactory from 'src/services/monitor/rb-monitor-service.factory.js'

  export default {
    components: {elTreeTransfer},
    name: 'autoAlarmDailog',
    props: ['visible', 'bizSysList'],
    data () {
      return {
        unSelectedData: [{
          id: '1',
          pid: 0,
          label: '根业务',
          children: []
        }],
        selectedData: [],
        monitorType: [],
        alertLevel: [],
        alertId: '',
        targetSelected: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getSelectedInfo()
      },

      getSelectedInfo () {
        rbMonitorServiceFactory.autoSendInfo().then((data) => {
          if (data.flag === 'false') {
          } else {
            this.flag = true
            this.monitorType = data.moniType.split(',')
            this.alertLevel = data.alertLevel.split(',')
            let businesData = data.business
            this.selectedData.push({
              id: '1',
              pid: 0,
              label: '根业务',
              children: []
            })
            this.alertId = data.alertId
            businesData.forEach(item => {
              this.bizSysList.forEach(item1 => {
                if (item === item1.value) {
                  this.selectedData[0].children.push({id: item1.id, pid: '1', 'label': item1.name, 'value': item1.value})
                }
              })
            })
          }
          this.getUnSelectedInfo()
        })
      },
      getUnSelectedInfo () {
        this.bizSysList.forEach(item => {
          this.unSelectedData[0].children.push({id: item.id, pid: '1', 'label': item.name, 'value': item.value})
        })
        if (this.selectedData.length > 0) {
          let selData = this.selectedData[0].children
          let unSelData = this.unSelectedData[0].children
          for (let i = 0; i < selData.length; i++) {
            for (let j = 0; j < unSelData.length; j++) {
              if (selData[i].value === unSelData[j].value) {
                this.unSelectedData[0].children.splice(j, 1)
              }
            }
          }
        }
      },
      changeVisible () {
        this.$emit('changeVisible', false)
      },
      insertAutoAlarmConfig () {
        if (this.selectedData.length === 0) {
          this.$message({
            message: '请选择发送告警的业务线',
            type: 'warning'
          })
          return
        }
        if (this.monitorType.length === 0) {
          this.$message({
            message: '请选择发送告警的分类',
            type: 'warning'
          })
          return
        }
        if (this.alertLevel.length === 0) {
          this.$message({
            message: '请选择发送告警的级别',
            type: 'warning'
          })
          return
        }
        let selectedDataIds = []
        if (this.targetSelected > 0) {
          this.targetSelected[0].children.forEach(item => {
            selectedDataIds.push(item.value)
          })
        } else {
          this.selectedData[0].children.forEach(item => {
            selectedDataIds.push(item.value)
          })
        }
        let params = {
          id: selectedDataIds.toString(),
          alertSort: this.monitorType.toString(),
          alertLevel: this.alertLevel.toString(),
          alertId: this.alertId
        }
        rbMonitorServiceFactory.insertAutoAlarmConfig(params).then((data) => {
          if (data[0] === true) {
            this.$message({
              message: data[1],
              type: 'success'
            })
          } else {
            this.$message.error(data[1])
          }
        })
        this.changeVisible()
      },
      add (fromData, toData, obj) {
        this.targetSelected.push(obj)
        this.selectedData = toData
      },
      remove (fromData, toData, obj) {
        this.targetSelected.push(obj)
        this.selectedData = toData
      }
    }
  }
</script>

<style scoped>

</style>
