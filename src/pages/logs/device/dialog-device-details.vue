<template>
  <div>
    <section class="yw-dialog-main">
      <el-form class="yw-form"
               label-width="82px"
               :model="result">
        <el-form-item label="告警发起:">
          <span>
            <el-switch
              v-model="sysLogAlertFlag"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
          </span>
          <span style="padding-left:90px;">
            <el-button size="mini" round
                       v-if="sysLogAlertFlag"
                       @click="createInit()">发起</el-button>
          </span>
        </el-form-item>
        <el-form-item label="告警等级:" v-if="sysLogAlertFlag">
          <el-select v-model="alert_level"
                     style="width: 200px;"
                     placeholder="请选择"
                     clearable
                     filterable>
            <el-option v-for="item in alert_levels"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警描述:" v-if="sysLogAlertFlag">
          <el-input type="textarea"
                    v-model="description"
                    style="width: 200px;"
                    :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="设备名称:">
          {{result.hostName}}
        </el-form-item>
        <el-form-item label="业务系统:">
          {{result.bizSystem}}
        </el-form-item>
        <el-form-item label="IP地址:">
          {{result.ip}}
        </el-form-item>
        <el-form-item label="设备分类:">
          {{result.deviceClass}}<span v-if="result.deviceClass3"> - {{result.deviceClass3}}</span>
        </el-form-item>
        <el-form-item label="资源池:">
          {{result.idcType}}
        </el-form-item>
        <el-form-item label="设备类型:">
          {{result.deviceType}}
        </el-form-item>
        <el-form-item label="设备位置:">
          {{result.department1}}<span v-if="result.department2"> - {{result.department2}}</span>
        </el-form-item>
        <el-form-item label="设备描述:">
          {{result.deviceDescription}}
        </el-form-item>
        <el-form-item label="设备型号:">
          {{result.deviceModel}}
        </el-form-item>
        <el-form-item label="sys服务地址:">
          {{obj.proxyip}}
        </el-form-item>
        <el-form-item label="sys服务端口:">
          {{obj.proxyport}}
        </el-form-item>
        <el-form-item label=" ">
        </el-form-item>
        <el-form-item label="日志内容:">
          {{obj.massage}}
        </el-form-item>
      </el-form>
      <!--<div class="dialog-empty"-->
           <!--v-else>暂无数据</div>-->
    </section>
  </div>
</template>
<script>
import {alert_level} from 'src/pages/mirror_alert/alert/config/options.js'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import rbAlertThirdServiceFactory from 'src/services/alert/rb-alert-third-service.factory.js'
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
export default {
  props: ['obj'],
  data () {
    return {
      result: {},
      sysLogAlertFlag: false,
      alert_levels: alert_level,
      alert_level: '',
      description: ''
    }
  },
  mounted () {
    this.getDeviceDetail(this.obj)
  },
  methods: {
    getDeviceDetail (obj) {
      let queryParams = {
        'idc': obj.pool_name,
        'deviceIp': obj.ip
      }
      rbCmdbServiceFactory.queryDeviceByRoomAndIP(queryParams).then((res) => {
        this.result = res
//        this.result.proxyip = this.obj.proxyip
//        this.result.proxyport = this.obj.proxyport
//        this.result.massage = this.obj.massage
      })
    },
    getUuid () {
      let s = []
      let hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      return s.join('')
    },
    createLogAlert () {
      let request = {
        'action_id': null,
        'alert_desc': this.description,
        'alert_id': this.getUuid(),
        'alert_level': this.alert_level,
        'alert_start_time': '',
        'business_system': this.result.idcType ? this.result.idcType : this.obj.pool_name,
        'cur_moni_time': '',
        'cur_moni_value': '',
        'device_ip': this.result.ip ? this.result.ip : this.obj.ip,
        'host_name': '',
        'item_id': '',
        'moni_result': '1',
        'monitor_index': this.obj.massage,
        'monitor_object': '',
        'monitor_room': '',
        'object_type': '',
        'serv_system': this.result.bizSystem,
        'source': 'sysLog'
      }
      rbAlertThirdServiceFactory.createSydLogAlert(request).then((res) => {
        if (res.code === '0000') {
          this.$message({
            message: '发起成功!',
            type: 'success'
          })
        }
        this.$emit('closeDialog',false)
      })
    },
    getAlertRequest () {
      let obj = {
        'order': 'DESC',
        'page_no': 1,
        'page_size': 50,
        'sort_name': '',
        'deviceIp': this.result.ip ? this.result.ip : this.obj.ip,
        'alertLevel': this.alert_level,
        'bizSys': this.result.bizSystem,
        'idcType': this.result.idcType ? this.result.idcType : this.obj.pool_name,
        'hostName': '',
        'monitDesc': this.obj.massage,
        'source': 'sysLog'
      }
      return obj
    },
    createInit () {
      if (!this.alert_level) {
        this.$alert('请先选择告警等级!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      rbAlertKanBanServiceFactory.getSearchAlertList(this.getAlertRequest()).then((res) => {
        if (res && res.count > 0) {
          this.$alert('当前日志已经生成过告警,请重新选择!', '警告', {
            confirmButtonText: '确定'
          })
//          this.$emit('closeDialog',false)
        } else {
          this.createLogAlert()
        }
      })
    }
  },
  watch: {
    obj: {
      handler: function () {
        if (this.obj) {
          this.getDeviceDetail(this.obj)
        }
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.yw-dialog {
  /deep/ .yw-form {
    .el-form-item {
      width: 49%;
      margin-right: 0;
      border-bottom: 1px dashed #eee;
      &:last-of-type {
        width: 100%;
      }
    }
  }
}
</style>
