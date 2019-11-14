<template>
  <div class="components-container yw-dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content-info">
          <el-card class="box-card"
                   shadow="never">
            <div slot="header"
                 class="clearfix">
              <span class="title">告警数量</span>
            </div>
            <div class="text item">
              <div class="noData"
                   v-if="!alertType || alertType.length < 1">暂无数据</div>

              <div class="alert-sum-wrap"
                   v-for="(aa, index) in alertType"
                   :key="index">
                <el-row class="alert-sum"
                        :gutter="20">
                  <el-col :span="5">
                    <img :src="alertSrc[index]">
                  </el-col>
                  <el-col :span="7">
                    <div class="link-total-wrap">
                      <a @click="goto(index, '')"
                         class="text-ellipse total"
                         title="aa.summary">{{aa.summary}}</a>
                      <p>{{alertTile[index]}}</p>
                    </div>

                  </el-col>
                  <el-col :span="12">
                    <el-row class="link-sum-wrap">
                      <el-col :span="6">
                        <a @click="goto(index, 5)"
                           class="link-sum">{{converAlertNumStr(aa.serious)}}</a>
                      </el-col>
                      <el-col :span="6">
                        <a @click="goto(index, 4)"
                           class="link-sum">{{converAlertNumStr(aa.high)}}</a>
                      </el-col>
                      <el-col :span="6">
                        <a @click="goto(index, 3)"
                           class="link-sum">{{converAlertNumStr(aa.medium)}}</a>
                      </el-col>
                      <el-col :span="6">
                        <a @click="goto(index, 2)"
                           class="link-sum">{{converAlertNumStr(aa.low)}}</a>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <div class="circle red"></div>
                      </el-col>
                      <el-col :span="6">
                        <div class="circle orange"></div>
                      </el-col>
                      <el-col :span="6">
                        <div class="circle yellow"></div>
                      </el-col>
                      <el-col :span="6">
                        <div class="circle blue"></div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content-info">
          <el-card class="box-card"
                   shadow="never">
            <div slot="header"
                 class="clearfix">
              <span class="title">告警级别</span>
              <div class="fr">
                <el-button class="btn-time"
                           :class="{active: type === 'day'}"
                           type="text"
                           @click="getAlertLevel('day')">日</el-button>
                <el-button class="btn-time"
                           :class="{active: type === 'week'}"
                           type="text"
                           @click="getAlertLevel('week')">周</el-button>
                <el-button class="btn-time"
                           :class="{active: type === 'month'}"
                           type="text"
                           @click="getAlertLevel('month')">月</el-button>
                <el-button class="btn-time"
                           :class="{active: type === 'season'}"
                           type="text"
                           @click="getAlertLevel('season')">季</el-button>

                <el-button class="btn-time"
                           :class="{active: type === 'year'}"
                           type="text"
                           @click="getAlertLevel('year')">年</el-button>

              </div>
            </div>
            <div class="text item">
              <div class="noData"
                   v-if="!alertLevels || alertLevels.length === 0">暂无数据</div>
              <div>
                <el-row class='progress-item'
                        :gutter="10"
                        v-for="(level, index) in alertLevels"
                        :key="index">
                  <div @dblclick="jumpWithLevel(type, index)">
                    <el-progress :percentage="alertLevelViews[index]"
                                 :id="widthVal[index]"
                                 :color="alertLevelsColor[index]"
                                 :stroke-width="12"></el-progress>
                  </div>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div :style="getLevelStyle(alertLevelViews[index], alertLevelsTile[index], index)"
                           class="level-wrap clearfix"><span class="fl">{{alertLevelsTile[index]}}</span> <span class="fr">{{level}}%</span></div>
                    </el-col>
                  </el-row>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content-info">
          <el-card class="box-card"
                   shadow="never">
            <div slot="header"
                 class="clearfix">
              <span>告警趋势</span>
              <div class="fr">
                <el-button class="btn-time"
                           :class="{active: trendType === 'week'}"
                           type="text"
                           @click="getLineAlert('week')">周</el-button>
                <el-button class="btn-time"
                           :class="{active: trendType === 'month'}"
                           type="text"
                           @click="getLineAlert('month')">月</el-button>
                <el-button class="btn-time"
                           :class="{active: trendType === 'season'}"
                           type="text"
                           @click="getLineAlert('season')">季</el-button>
                <el-button class="btn-time"
                           :class="{active: trendType === 'year'}"
                           type="text"
                           @click="getLineAlert('year')">年</el-button>

              </div>

            </div>
            <div class="text item">
              <div class="noData"
                   v-if="!trendData">暂无数据</div>
              <div ref="trend"
                   :style="canvasWidth"></div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20"
            class="row-last">
      <el-col :span="8">
        <div class="grid-content-info">
          <el-card class="box-card"
                   shadow="never">
            <div slot="header"
                 class="clearfix">
              <span class="title">设备分类</span>
              <div class="fr">
                <el-button class="btn-time"
                           :class="{active: deviceType === 'day'}"
                           type="text"
                           @click="getAlertType('day')">日</el-button>
                <el-button class="btn-time"
                           :class="{active: deviceType === 'week'}"
                           type="text"
                           @click="getAlertType('week')">周</el-button>
                <el-button class="btn-time"
                           :class="{active: deviceType === 'month'}"
                           type="text"
                           @click="getAlertType('month')">月</el-button>
                <el-button class="btn-time"
                           :class="{active: deviceType === 'season'}"
                           type="text"
                           @click="getAlertType('season')">季</el-button>

                <el-button class="btn-time"
                           :class="{active: deviceType === 'year'}"
                           type="text"
                           @click="getAlertType('year')">年</el-button>

              </div>

            </div>
            <div class="text item">
              <div class="noData"
                   v-if="!deviceData || deviceData.length < 1">暂无数据</div>
              <div ref="devicePie"
                   :style="canvasWidth"></div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content-info">
          <el-card class="box-card"
                   shadow="never">
            <div slot="header"
                 class="clearfix">
              <span class="title">资源池归属</span>
              <div class="fr">
                <el-button class="btn-time"
                           :class="{active: resType === 'day'}"
                           type="text"
                           @click="getAlertRes('day')">日</el-button>
                <el-button class="btn-time"
                           :class="{active: resType === 'week'}"
                           type="text"
                           @click="getAlertRes('week')">周</el-button>
                <el-button class="btn-time"
                           :class="{active: resType === 'year'}"
                           type="text"
                           @click="getAlertRes('month')">月</el-button>
                <el-button class="btn-time"
                           :class="{active: resType === 'season'}"
                           type="text"
                           @click="getAlertRes('season')">季</el-button>
                <el-button class="btn-time"
                           :class="{active: resType === 'year'}"
                           type="text"
                           @click="getAlertRes('year')">年</el-button>
              </div>

            </div>
            <div class="text item">
              <div class="noData"
                   v-if="!resData || resData.length < 1">暂无数据</div>
              <div ref="resPie"
                   :style="canvasWidth"></div>

            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content-info">
          <el-card class="box-card"
                   shadow="never">
            <div slot="header"
                 class="clearfix">
              <span class="title">最新热点告警</span>
            </div>
            <div class="text item">
              <div class="noData"
                   v-if="!newAlerts || newAlerts.length < 1">暂无数据</div>
              <div v-else>

                <el-row :gutter="0"
                        v-for="(aa, index) in newAlerts"
                        :key="index"
                        v-if="aa.moni_index"
                        style="margin-bottom:7px;">
                  <div @dblclick="jumpWithAlertId(aa.alert_id)">
                    <el-col :span="6">
                      <span class="status"
                            :class="getStatusCss(aa.alert_level)"> {{getLevelStr(aa.alert_level)}}告警</span>
                    </el-col>
                    <el-col :span="17"
                            :offset="1">
                      <span style="color: #a1a1a1">
                        {{getDateStr(aa.alert_start_time, 'day')}}@{{getDateStr(aa.alert_start_time, 'h')}}@{{aa.source_room}}
                      </span><br />
                      <span>
                        {{aa.moni_index}}<span v-if="getVal(aa.cur_moni_value)">-{{aa.cur_moni_value}}</span>
                      </span>
                    </el-col>
                  </div>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>

</template>
<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'
import rbAlertServiceFactory from 'src/services/alert/rb-alert-services.factory.js'
import { ALERT_LEVEL_CSS_MAP, DEVICE_TYPE_MAP } from 'src/pages/mirror_alert/main/rb-alert.constants.js'
export default {
  name: 'mirror_alert/main',
  data() {
    return {
      // echartsObj: {},
      canvasWidth: 'width: 100%;height: 100%;',
      alertNum: {
        toBeConfirmed: {},
        confirmed: {},
        toBeResolved: {},
        resolved: {}
      },
      idcTypeDict: [],
      sourceRoomDict: [],
      deviceClassDict: [],
      alertLevelCodes: [5, 4, 3, 2, 1],
      widthVal: ['serious', 'high', 'middle', 'low', 'tip'],
      alertType: [],
      alertTile: ['待确认告警', '待解决告警', '已确认告警', '已解决告警'],
      alertSrc: ['/static/img/alert/A.png', '/static/img/alert/B.png', '/static/img/alert/C.png', '/static/img/alert/D.png'],
      alertLevels: [],
      alertLevelViews: [],
      alertLevelsTile: ['重大', '高', '中', '低'],
      alertLevelStr: ['', '低', '中', '高', '重大'],
      alertLevelsColor: ['#ff0036', '#ff7e00', '#ffba00', '#38b9ec', '#4cdd1f'],
      levelDate: 'levelDate',
      type: 'day',
      trendType: 'week',
      deviceType: 'day',
      resType: 'day',
      newAlerts: [],
      trendChart: null,
      resChart: null,
      deviceChart: null,
      pollTime: '',
      deviceData: [],
      resData: [],
      trendData: null,
      lineOption: {
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      },
      rsOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        calculable: true,
        series: [
          {
            name: '设备分类',
            label: {
              formatter: '{b} \n{d}%'
            },
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: []
          }
        ]
      },
      resOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '资源池归属',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          },
          {
            name: '资源池归属',
            type: 'pie',
            radius: ['40%', '60%'],
            label: {
              normal: {
                formatter: '{b}: \n{c} {d}%'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.pollTime)
  },
  methods: {
    initData() {
      this.getAlertNum()
      this.getAlertLevel('day')
      this.getNewAlert()
      this.initIdcTypeDict()
      this.initSourceRoomsDict()
      this.initDeviceClassDict()
      if (this.pollTime) {
        clearInterval(this.pollTime)
      }
      this.pollTime = setInterval(() => {
        this.getNewAlert()
      }, 60000)
      this.getLineAlert(this.trendType)
      this.getAlertType('day')
      this.getAlertRes('day')
    },
    initSourceRoomsDict() {
      rbAlertServiceFactory.getDictByCode('roomId').then((res) => {
        this.sourceRoomDict = res
      })
    },
    initIdcTypeDict() {
      rbAlertServiceFactory.getDictByCode('idcType').then((res) => {
        this.idcTypeDict = res
      })
    },
    initDeviceClassDict() {
      rbAlertServiceFactory.getDictByCode('device_class').then((res) => {
        this.deviceClassDict = res
      })
    },
    getIndexOfArrayElement(array, value) {
      let arr = array.valueOf()
      let len = array.length
      let fromindex = 0
      if (toString.call(arr) !== '[object Array]' || value === '' || value === undefined || toString.call(value) === '[object Function]') {
        return false
      }
      for (var i = 0 + fromindex; i < len; i++) {
        if (value === arr[i]) {
          return i
        } else {
          if (arr[i].toString() === value.toString()) {
            if (JSON.stringify(arr[i]) === JSON.stringify(value)) {
              return i
            } else {
              return -1
            }
          }
        }
      }
      return -1
    },
    jumpWithLevel(_span, _level) {
      //        alert(this.alertLevelCodes[_level])
      var _this = this
      this.$router.push({
        path: '/mirror_alert/alert/list',
        query: {
          alertType: 'main',
          span: _span,
          alert_level: _this.alertLevelCodes[_level]
        }
      })
    },
    jumpWithAlertId(id) {
      this.$router.push({
        path: '/mirror_alert/alert/detail',
        query: {
          alert_id: id
        }
      })
    },
    getLevelStyle(level, title, index) {
      // let widthStr = this.widthVal[index]
      let obj = document.getElementById(this.widthVal[index])
      if (obj === null) {
        return
      }
      // alert(this.$refs[this.widthVal[index]])
      // alert(JSON.stringify(this.$refs[this.widthVal[index]]))
      // alert(this.$refs[this.widthVal[index]].offsetWidth)
      let val = ((obj.offsetWidth - 20) * level) / 100
      if (val < 20) {
        return ''
      }
      let str = String(val)
      if (val < 60) {
        return ''
      }
      if ((str.length > 4 && val < 80) && title.length === 2) {
        return ''
      }
      if ((str.length > 4 && val < 70) && title.length === 1) {
        return ''
      }
      return 'text-align:right;width:' + val + 'px;'
    },
    getDictValueByName(dict, name) {
      let idc_val = name
      dict.forEach(idc => {
        if (idc.name === name) {
          idc_val = idc.value
        }
      })
      return idc_val
    },
    getVal(val) {
      if (val === null || val === 0 || val === '0' || val === 'null') {
        return false
      }
      return true
    },
    goto(index, level) {
      let status = index
      if (index === 2) {
        status = 1
      }
      if (index === 1) {
        status = ''
      }
      let path = '/mirror_alert/alert/list'
      if (status === 3) {
        path = '/mirror_alert/alert_his/his_alert'
      }
      this.$router.push({
        path: path,
        query: {
          alertType: 'main',
          operation_status: status,
          alert_level: level
        }
      })
    },
    getAlertFromResArray(resData, resName, resType) {
      let idcInfo
      resData.forEach(item => {
        let alerts = item.alerts
        alerts.forEach(alert => {
          if (resType === '1') {
            if (!alert.sourceRoom && !resName) {
              idcInfo = alert
              idcInfo.type = resType
              return idcInfo
            } else if (alert.sourceRoom === resName) {
              idcInfo = alert
              idcInfo.type = resType
              return idcInfo
            }
          } else if (resType === '0') {
            if (!alert.idcType && !resName) {
              idcInfo = alert
              idcInfo.type = resType
              return idcInfo
            } else if (alert.idcType === resName) {
              idcInfo = alert
              idcInfo.type = resType
              return idcInfo
            }
          }
        })
      })
      return idcInfo
    },
    getAlertRes(type) {
      this.resType = type
      rbAlertServiceFactory.getAlertRes(type).then((res) => {
        /* res = []
        res.push({source: '', alerts: [{sourceRoom: '2', alertNum: 44}, {sourceRoom: 'aa', alertNum: 56}, {sourceRoom: 'aa', alertNum: 89}]})
        res.push({source: 'ddwd', alerts: [{sourceRoom: '1', alertNum: 23}, {sourceRoom: 'aa', alertNum: 45}, {sourceRoom: 'aa', alertNum: 21}]})
        res.push({source: 'dd21d', alerts: [{sourceRoom: '24', alertNum: 78}, {sourceRoom: 'aa', alertNum: 22}]})
        res.push({source: 'ddrtd', alerts: [{sourceRoom: '23r', alertNum: 54}, {sourceRoom: 'aa', alertNum: 7}, {sourceRoom: 'aa', alertNum: 9}]})
        res.push({source: 'ddfd', alerts: [{sourceRoom: 'df', alertNum: 54}, {sourceRoom: 'aa', alertNum: 11}]})
        res.push({source: 'dd2d', alerts: [{sourceRoom: 'awa', alertNum: 54}, {sourceRoom: 'awa', alertNum: 54}, {sourceRoom: 'a2a', alertNum: 5}, {sourceRoom: 'aa', alertNum: 90}]}) */
        if (res === null) {
          res = []
        }
        this.resData = res
        let option = JSON.parse(JSON.stringify(this.resOption))
        this.resOuters = []
        res.forEach(item => {
          let typeObj = {}
          typeObj.value = 0
          if (!item.source) {
            typeObj.name = '其他'
          } else {
            typeObj.name = item.source
          }
          let alerts = item.alerts
          let list = []
          alerts.forEach(t => {
            let a = {}
            a.value = t.alertNum
            a.name = t.sourceRoom
            typeObj.value += t.alertNum
            list.push(a)
          })
          if (option.series[0].data.length === 0) {
            typeObj.selected = true
          } else {
            typeObj.selected = false
          }
          Array.prototype.push.apply(option.series[1].data, list)
          option.series[0].data.push(typeObj)
        })
        if (!this.resChart) {
          this.resChart = echarts.init(this.$refs['resPie'], 'macarons')
        }
        this.resChart.clear()
        this.resChart.setOption(option)
        this.resChart.off('dblclick')
        var _this = this
        this.resChart.on('dblclick', function(params) {
          var resType = params.seriesId.charAt(params.seriesId.length - 1)
          if (params.name === '其他') {
            idc_type = '其他'
            _this.$router.push({
              path: '/mirror_alert/alert/list',
              query: {
                alertType: 'main',
                span: type,
                idcType: idc_type,
                deviceRoom: '',
                sourceRoom: ''
              }
            })
          } else {
            var target = _this.getAlertFromResArray(_this.resData, params.name, resType)
            var device_room = ''
            var idc_type = _this.getDictValueByName(_this.idcTypeDict, target.idcType)
            if (target.type === '1') {
              device_room = _this.getDictValueByName(_this.sourceRoomDict, target.sourceRoom)
            }
            _this.$router.push({
              path: '/mirror_alert/alert/list',
              query: {
                alertType: 'main',
                span: type,
                idcType: idc_type,
                deviceRoom: device_room,
                sourceRoom: target.type === '0' ? '' : target.sourceRoom
              }
            })
          }
        })
      })
    },
    getAlertType(type) {
      this.deviceType = type
      rbAlertServiceFactory.getAlertType(type).then((res) => {
        /* res.push({deviceType: '1', alertNum: 78})
        res.push({deviceType: '2', alertNum: 23})
        res.push({deviceType: '3ww', alertNum: 34}) */
        if (res === null) {
          res = []
        }
        this.deviceData = res
        let option = JSON.parse(JSON.stringify(this.rsOption))
        res.forEach(item => {
          let name = DEVICE_TYPE_MAP[item.deviceType]
          if (name === undefined || name === null) {
            name = item.deviceType
          }
          if (name === undefined || name === null) {
            name = '未知类型'
          }
          let val = { value: item.alertNum, name: name }
          // alert(JSON.stringify(val))
          option.series[0].data.push(val)
        })
        if (!this.deviceChart) {
          // debugger
          this.deviceChart = echarts.init(this.$refs['devicePie'], 'macarons')
        }
        this.deviceChart.clear()
        this.deviceChart.setOption(option)
        this.deviceChart.off('dblclick')
        var _this = this
        this.deviceChart.on('dblclick', function(params) {
          _this.$router.push({
            path: '/mirror_alert/alert/list',
            query: {
              alertType: 'main',
              span: type,
              device_class: params.name
              //              device_class: _this.getDictValueByName(_this.deviceClassDict, params.name)
            }
          })
        })
      })
    },
    getLineAlert(type) {
      this.trendType = type
      rbAlertServiceFactory.getAlertLine(type).then((res) => {
        let option = JSON.parse(JSON.stringify(this.lineOption))
        if (res === null || res.xAxis === null || res.xAxis.length === 0) {
          this.trendData = null
          return
        }
        this.trendData = res
        for (var x in res.series) {
          let yData = []
          let dataObjs = res.series[x]
          dataObjs.forEach(item => {
            for (var time in item) {
              yData.push(parseInt(item[time]))
            }
          })
          let s = {
            name: this.alertLevelStr[x - 1],
            itemStyle: {
              normal: {
                color: this.alertLevelsColor[this.alertLevelsColor.length - x],
                lineStyle: {
                  color: this.alertLevelsColor[this.alertLevelsColor.length - x]
                }
              }
            },
            type: 'line',
            data: yData
          }
          option.series.push(s)
        }
        Array.prototype.push.apply(option.xAxis[0].data, res.xAxis)
        if (!this.trendChart) {
          this.trendChart = echarts.init(this.$refs['trend'], 'macarons')
        }
        this.trendChart.clear()
        this.trendChart.setOption(option)
        this.trendChart.off('dblclick')
        var _this = this
        this.trendChart.on('dblclick', function(params) {
          let dataStr = params.name

          //          var _span = type
          var level = _this.getIndexOfArrayElement(_this.alertLevelStr, params.seriesName) + 1
          _this.$router.push({
            path: '/mirror_alert/alert/list',
            query: {
              alertType: 'main',
              //              span: _span,
              date: dataStr.substring(0, 4) + '-' + dataStr.substring(4, 6) + '-' + dataStr.substring(6, 8),
              alert_level: level
            }
          })
        })
      })
    },
    getDateStr(date, type) {
      let now = new Date(date)
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      var dateNum = now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes()
      if (type === 'day') {
        return year + '-' + month + '-' + dateNum
      } else {
        return (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute)
      }
    },
    getStatusCss(status) {
      return ALERT_LEVEL_CSS_MAP[status]
    },
    getLevelStr(status) {
      return this.alertLevelStr[status - 1]
    },
    converAlertNumStr(rs) {
      let str = String(rs)
      if (str.length < 5) {
        return str
      }
      rs = rs / 10000
      return (Math.round(rs * 10) / 10) + 'w'
    },
    getAlertNum() {
      rbAlertServiceFactory.getAlertNum().then((res) => {
        this.alertNum = res
        /*  res.toBeConfirmed.high = 126556
          res.toBeConfirmed.serious = 123456
          res.toBeConfirmed.tip = 12345
          res.toBeConfirmed.medium = 12345
          res.toBeConfirmed.low = 12345
          res.toBeConfirmed.summary = 12345 */
        this.alertType.push(res.toBeConfirmed)
        this.alertType.push(res.toBeResolved)
        this.alertType.push(res.confirmed)
        this.alertType.push(res.resolved)
      })
    },
    getAlertLevel(type) {
      this.type = type
      rbAlertServiceFactory.getAlertLevel(type).then((res) => {
        this.alertLevels = []
        this.alertLevelViews = []
        let sum = res.summary
        this.alertLevels.push(this.percentage(res.serious, sum))
        this.alertLevels.push(this.percentage(res.high, sum))
        this.alertLevels.push(this.percentage(res.medium, sum))
        this.alertLevels.push(this.percentage(res.low, sum))
        //        this.alertLevels.push(this.percentage(res.tip, sum))
        let maxVal = Math.max(res.serious, res.high, res.medium, res.low, res.tip)
        this.alertLevelViews.push(this.percentage(res.serious, maxVal))
        this.alertLevelViews.push(this.percentage(res.high, maxVal))
        this.alertLevelViews.push(this.percentage(res.medium, maxVal))
        this.alertLevelViews.push(this.percentage(res.low, maxVal))
        //        this.alertLevelViews.push(this.percentage(res.tip, maxVal))
      })
    },
    getNewAlert() {
      rbAlertServiceFactory.getNewAlert().then((res) => {
        this.newAlerts = res
      })
    },
    percentage(num, total) {
      if (total === 0) {
        return 0
      }
      return (Math.round(num / total * 10000) / 100.00)
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style  lang="scss" scoped>
.noData {
  text-align: center;
  line-height: 260px;
}
/deep/ .box-card.el-card {
  .el-card__body {
    height: 279px;
    overflow-x: hidden;
    overflow-y: auto;
    .status {
      display: inline-block;
      width: 70px;
      height: 22px;
      text-align: center;
      line-height: 22px;
      border-radius: $border-radius;
      &.normal {
        background: $color-common;
        color: $color-base;
      }
      &.low {
        background: $color-tip-blue;
        color: $color-base;
      }
      &.medium {
        background: $color-tip-yellow;
        color: $color-base;
      }
      &.high {
        background: $color-tip-orange;
        color: $color-base;
      }
      &.serious {
        background: $color-tip-red;
        color: $color-base;
      }
    }
    .text.item {
      width: 100%;
      height: 100%;
    }
    .progress-item {
      margin-bottom: 40px;
      &:last-of-type {
        margin-bottom: 0;
      }
      /deep/ .el-progress {
        padding: 0 10px;
        .el-progress-bar {
          padding-right: 20px;
        }
        .el-progress__text {
          display: none;
        }
      }
      .level-wrap {
        padding: 0 20px 0 10px;
      }
    }
    .alert-sum-wrap {
      border-bottom: 1px solid $color-bg;
      &:last-of-type {
        border-bottom: none;
      }
      .alert-sum {
        padding: 5px;
      }
    }

    .link-total-wrap {
      .total {
        font-size: 22px;
        font-weight: bold;
        color: $color-normal;
      }
    }

    .link-sum-wrap {
      margin: 10px 0;
      .link-sum {
        color: $color-common;
      }
    }

    .circle {
      width: 8px;
      height: 8px;
      background: transparent;
      border-radius: 50%;
      &.red {
        background: $color-tip-red;
      }
      &.orange {
        background: $color-tip-orange;
      }
      &.yellow {
        background: $color-tip-yellow;
      }
      &.blue {
        background: $color-tip-blue;
      }
    }
  }
}

.row-last {
  margin-top: 20px;
  /deep/ .box-card.el-card {
    .el-card__body {
      min-height: 279px;
      height: calc(100vh - 520px);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
