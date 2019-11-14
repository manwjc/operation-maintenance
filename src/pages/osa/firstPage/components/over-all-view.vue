<template>
  <div>
    <div class="main-container" id="main-container">
      <div style="background:#cad4e0 !important;">
        <el-row :gutter="10" style="padding-left: 5px;padding-right: 5px;padding-bottom: 10px">
          <el-col :span="6">
            <div class="top-item">
              <el-row class="panel-master-1">
                <el-col class="panel-heading-1">
                  <h1>主机<span id="host1">{{businessData.host.deviceTotalNum}}台</span></h1>
                  <h5 class="corner"><span id="host2">{{businessData.host.deviceAlarmNum}}</span></h5>
                  <ul>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell red" aria-hidden="true"></span><span
                      id="host3"></span>{{businessData.host.critical}}
                    </li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell orange" aria-hidden="true"></span><span
                      id="host4">{{businessData.host.high}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell yellow" aria-hidden="true"></span><span
                      id="host5">{{businessData.host.medium}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell gray" aria-hidden="true"></span><span
                      id="host6">{{businessData.host.low}}</span></li>
                  </ul>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="top-item">
              <el-row class="panel-success-1">
                <el-col class="panel-heading-1">
                  <h1>网络<span id="net1">{{businessData.network.deviceTotalNum}}</span></h1>
                  <h5 class="corner"><span id="net2">{{businessData.network.deviceAlarmNum}}</span></h5>
                  <ul>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell red" aria-hidden="true"></span><span
                      id="net3">{{businessData.network.critical}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell orange" aria-hidden="true"></span><span
                      id="net4">{{businessData.network.high}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell yellow" aria-hidden="true"></span><span
                      id="net5">{{businessData.network.medium}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell gray" aria-hidden="true"></span><span
                      id="net6">{{businessData.network.low}}</span></li>
                  </ul>
                </el-col>
              </el-row>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="top-item">
              <el-row class="panel-warning-1">
                <el-col class="panel-heading-1">
                  <h1>块存储<span id="storage1">{{businessData.storage.deviceTotalNum}}</span></h1>
                  <h5 class="corner"><span id="storage2">{{businessData.storage.deviceAlarmNum}}</span></h5>
                  <ul>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell red" aria-hidden="true"></span><span
                      id="storage3">{{businessData.storage.critical}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell orange" aria-hidden="true"></span><span
                      id="storage4">{{businessData.storage.high}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell yellow" aria-hidden="true"></span><span
                      id="storage5">{{businessData.storage.medium}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell gray" aria-hidden="true"></span><span
                      id="storage6">{{businessData.storage.low}}</span></li>
                  </ul>
                </el-col>
              </el-row>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="top-item">
              <el-row class="panel-info-1">
                <el-col class="panel-heading-1">
                  <h1>数据库<span id="database1">{{businessData.database.deviceTotalNum}}</span></h1>
                  <h5 class="corner"><span id="database2">{{businessData.database.deviceAlarmNum}}</span></h5>
                  <ul>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell red" aria-hidden="true"></span><span
                      id="database3">{{businessData.database.critical}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell orange" aria-hidden="true"></span><span
                      id="database4">{{businessData.database.high}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell yellow" aria-hidden="true"></span><span
                      id="database5">{{businessData.database.medium}}</span></li>
                    <li class="col-md-3"><span class="glyphicon glyphicon-bell gray" aria-hidden="true"></span><span
                      id="database6">{{businessData.database.low}}</span></li>
                  </ul>
                </el-col>
              </el-row>
            </div>
          </el-col>

        </el-row>
        <el-row :gutter="10" style="padding-left: 5px;padding-right: 5px;">
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading ">
                <h3 class="panel-title  text-left"><b>物理机分配情况统计</b></h3>
                <div style="float:right;margin-top:-20px;"><select id="ZYCAndRHTX5" class="selectStyle"
                                                                   style="padding-left:4px;float:right;width:130px;"
                                                                   v-model="physicalDeviceAssignIDC">
                  <!--<option value="ZYC" selected="selected">资源池</option>
                          <option value="RHTX">融合通信资源池</option> -->
                  <option v-for="(item, index) in idc" :value="item.VALUE">{{item.LABEL}}</option>
                </select>
                </div>
              </div>
              <div style="width:100%;height:230px;padding:10px;" id="physicalMachineAssign">

              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading ">
                <h3 class="panel-title  text-left"><b>虚拟化资源统计</b></h3>
                <div style="float:right;margin-top:-20px;">
                  <select id="ZYCAndRHTX1" class="selectStyle" style="padding-left:4px;float:right;width:130px;"
                          v-model="verticalResourceAssignIDC">
                    <option v-for='(item,index) in idc' :value='item.VALUE'>{{item.LABEL}}</option>
                  </select>
                </div>
              </div>
              <div style="width:100%;height:230px;padding:10px;" id="virtualResourceStatics">
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="padding-left: 5px;padding-right: 5px;">
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading ">
                <h3 class="panel-title  text-left"><b>服务器使用率分布统计</b></h3>
                <div style="float:right;margin-top:-20px;">
                  <select id="ZYCAndRHTX2" class="selectStyle" style="padding-left:4px;float:right;width:130px;"
                          v-model="serviceUsageIDC">
                    <option v-for="(item, index) in idc" :value="item.VALUE">{{item.LABEL}}</option>
                  </select>
                </div>
              </div>
              <table class="table table-bordered">
                <tbody>
                <tr>
                  <td width="10%" class="text-center" style="padding: 0">
                    <div id="storageImage" @click="selectStoryage()"><span
                      :class="['nav_left', {'storageImageSelect':selectCard === 'storage','storageImage':selectCard !== 'storage'}]"></span>内存
                    </div>
                  </td>
                  <td rowspan="3">
                    <div style="width:100%;height:215px;padding:10px;" id="serverUsageDistribution">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-center" style="padding: 0">
                    <div id="cpuImage" @click="selectCpu()"><span
                      :class="['nav_left', {'cpuImageSelect':selectCard === 'cpu','cpuImage':selectCard !== 'cpu'}]"></span>CPU
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-center" style="padding: 0">
                    <div id="hardwareImage" @click="selectHardware()"><span
                      :class="['nav_left', {'hardwareImageSelect':selectCard === 'hardware','hardwareImage':selectCard !== 'hardware'}]"></span>存储
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title  text-left"><b>虚拟结算统计</b></h3>
              </div>
              <div style="height:226.5px;padding:1px" id='dgs'>
                <el-table id="dg" :data="visualAccountStatisticsOV" border max-height="225" size="small"
                          style="width: 100%" header-row-class-name="tabelHeadClass" row-class-name="tabelRowClass">
                  <el-table-column prop="businessName" label="业务系统"></el-table-column>
                  <el-table-column prop="physicalMachine" label="物理机(台)"></el-table-column>
                  <el-table-column prop="virtualMachine" label="虚拟机(台)"></el-table-column>
                  <el-table-column prop="storage" label="存储(T)"></el-table-column>
                  <el-table-column prop="database" label="数据库"></el-table-column>
                  <el-table-column prop="bandwidth" label="带宽"></el-table-column>
                  <el-table-column prop="os" label="操作系统"></el-table-column>
                  <el-table-column prop="total" label="总金额(元)" :formatter="totalMoneyFormatter"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="padding-left: 5px;padding-right: 5px;">
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading ">
                <h3 class="panel-title  text-left"><b>资源池使用率趋势分析</b></h3>
                <div style="float:right;margin-top:-20px;">
                  <select id="ZYCAndRHTX3" class="selectStyle" style="width:90px;" v-model="resourceUsageAnalyseIDC">
                    <option value="ZYC">资源池</option>
                    <option value="RHTX">融合通信</option>
                  </select>
                  <div class="panel-date">
                    <el-date-picker id='beginDate1' v-model="beginDate" class="date-time" size="mini"
                                    style="border:0;width:105px;height:22px"
                                    type="date"></el-date-picker>
                    <!--<div class="date-btn">-->
                    <!--<div class="date-icon"></div>-->
                    <!--</div>-->
                  </div>
                  <span style="float:left;margin-right:10px;margin-top:3px;">至</span>
                  <div class="panel-date">
                    <el-date-picker id='endDate1' v-model="endDate" size="mini" class="date-time"
                                    style="border:0;width:105px;height:22px" type="date"></el-date-picker>
                    <!--<div class="date-btn">-->
                    <!--<div class="date-icon"></div>-->
                    <!--</div>-->
                  </div>
                  <div id="searchBtn1" class="panel-image approach"><img style="margin:2px 20% 0 20%;height:16px;"
                                                                         src="/static/img/osa/icon_find.png"></img>
                  </div>
                  <!--  <input id='beginDate1' class="easyui-datebox" name="beginDate" data-options="buttons:buttons,required:false,currentText:'今天',editable:false" style="width:95px;">
                         <label for="endDate">至:</label>
                        <input  id='endDate1' class="easyui-datebox" name="endDate" data-options="buttons:buttons,required:false,currentText:'今天',editable:false" style="width:95px"> -->
                  <!-- <a id="searchBtn1" class="easyui-linkbutton approach" style="border:0;" data-options="iconCls:'icon-btn-search'"></a> -->
                </div>
              </div>
              <table class="table table-bordered">
                <tbody>
                <tr>
                  <td width="10%" class="text-center" style="padding: 0">
                    <div id="storageImage2"><span
                      :class="['nav_left', {'storageImageSelect':resourceSelectCard === 'storage','storageImage':resourceSelectCard !== 'storage'}]"></span>内存
                    </div>
                  </td>
                  <td rowspan="3">
                    <div style="width:100%;height:215px;padding:10px;" id="resourcePoolUsageAnalyze">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-center" style="padding: 0">
                    <div id="cpuImage2"><span
                      :class="['nav_left', {'cpuImageSelect':resourceSelectCard === 'cpu','cpuImage':resourceSelectCard !== 'cpu'}]"></span>CPU
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-center" style="padding: 0">
                    <div id="hardwareImage2"><span
                      :class="['nav_left', {'hardwareImageSelect':resourceSelectCard === 'hardware','hardwareImage':resourceSelectCard !== 'hardware'}]"></span>存储
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading ">
                <h3 class="panel-title  text-left"><b>服务器使用率统计</b></h3>
                <div style="float:right;margin-top:-20px;">
                  <div class="panel-date">
                    <input id='beginDate2' type="text" class="date-time" style="border:0;width:90px;height:22px"
                           onClick="WdatePicker();">
                    <div class="date-btn">
                      <div class="date-icon"></div>
                    </div>
                  </div>
                  <span style="float:left;margin-right:10px;margin-top:3px;">至</span>
                  <div class="panel-date">
                    <input id='endDate2' type="text" class="date-time" style="border:0;width:90px;height:22px"
                           onClick="WdatePicker();">
                    <div class="date-btn">
                      <div class="date-icon"></div>
                    </div>
                  </div>
                  <div id="searchBtn2" class="panel-image approach"><img style="margin:2px 20% 0 20%;height:16px;"
                                                                         src="${ctxStatic}/newthemes/images/icon_find.png"></img>
                  </div>
                </div>
              </div>
              <table class="table table-bordered">
                <tbody>
                <tr>
                  <td width="10%" class="text-center" style="padding: 0">
                    <div id="storageImage3"><span class="nav_left storageImage"></span>内存</div>
                  </td>
                  <td rowspan="3">
                    <div style="width:100%;height:215px;padding:10px;" id="serverUsageStatistic">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-center" style="padding: 0">
                    <div id="cpuImage3"><span class="nav_left cpuImage"></span>CPU</div>
                  </td>
                </tr>
                <tr>
                  <td class="text-center" style="padding: 0">
                    <div id="hardwareImage3"><span class="nav_left hardwareImage"></span>存储</div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    businessData,
    physicalDeviceAssignmentOV,
    verticalResourceAssignmentOV,
    serviceUsageStorageOV,
    visualAccountStatisticsOV,
    resourcePoolUsageAnalyzeOV
  } from 'src/assets/js/common/testdata'
  import rbHttp from 'src/assets/js/utility/rb-http.factory'

  var echarts = require('echarts')

  export default {
    name: 'overAllView',
    data: function () {
      return {
        idc: [
          {'LABEL': '融合通信资源池', 'VALUE': 'RHTX'},
          {'LABEL': '资源池', 'VALUE': 'ZYC'}
        ],
        businessData: businessData,
        physicalDeviceAssignmentOV: physicalDeviceAssignmentOV,
        verticalResourceAssignmentOV: verticalResourceAssignmentOV,
        serviceUsageOV: serviceUsageStorageOV,
        visualAccountStatisticsOV: visualAccountStatisticsOV,
        resourcePoolUsageAnalyzeOV: resourcePoolUsageAnalyzeOV,
        physicalDeviceAssignIDC: 'RHTX',
        verticalResourceAssignIDC: 'RHTX',
        serviceUsageIDC: 'RHTX',
        resourceUsageAnalyseIDC: 'ZYC',
        selectCard: 'storage',
        resourceSelectCard: 'storage',
        beginDate: '',
        endDate: ''
      }
    },
    watch: {
      physicalDeviceAssignIDC: function (val, oldVal) {
        this.getPhysicalDeviceAssignment()
        this.drawChartPhysicalMachineAssign()
      },
      verticalResourceAssignIDC: function (val, oldVal) {
        this.getVerticalResourceAssignment()
        this.drawVerticalResourceAssign()
      },
      serviceUsageIDC: function (val, oldVal) {
        if (this.selectCard === 'storage') {
          this.getServiceUsageStorage()
          this.drawChart()
        } else {
          this.selectCard = 'storage'
        }
      },
      selectCard: function (val, oldVal) {
        if (val === 'storage') {
          this.getServiceUsageStorage()
        } else if (val === 'cpu') {
          this.getServiceUsageCpu()
        } else if (val === 'hardware') {
          this.getServiceUsageHardware()
        }
        this.drawChart()
      }
    },
    mounted: function () {
      var date = new Date()
      date.setDate(date.getDate() - 1)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      if (parseInt(month) < 10) {
        month = '0' + month
      }
      var strDate = date.getDate()
      if (parseInt(strDate) < 10) {
        strDate = '0' + strDate
      }
      this.beginDate = year + '-' + month + '-' + strDate
      this.endDate = year + '-' + month + '-' + strDate
      this.physicalDeviceAssignIDC = 'RHTX'
      this.verticalResourceAssignIDC = 'RHTX'
      this.serviceUsageIDC = 'RHTX'
      this.$nextTick(function () {
        // 物理机分配情况统计
        this.getPhysicalDeviceAssignment()
        this.drawChartPhysicalMachineAssign()
        // 虚拟化资源统计
        this.getVerticalResourceAssignment()
        this.drawVerticalResourceAssign()
        // 服务器使用率分布统计
        this.getServiceUsageStorage()
        this.drawChart()
        // 虚拟结算统计
        this.getVisualAccountStatistics()
        // 资源池分析统计
        this.getResourcePoolUsageAnalyze()
        this.drawResourcePoolUsageAnalyzeStorage()
      })
    },
    methods: {
      // tabelHeadClass: function (row, rowIndex) {
      //
      // },
      totalMoneyFormatter: function (row, column) {
        return this.fmoney(row.total, 2)
      },
      fmoney: function (s, n) {
        s = parseFloat((s + '')).toFixed(n) + ''
        let l = s.split('.')[0].split('').reverse()
        let r = s.split('.')[1]
        let t = ''
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
        }
        return t.split('').reverse().join('') + '.' + r
      },
      selectStoryage: function () {
        this.selectCard = 'storage'
      },
      selectCpu: function () {
        this.selectCard = 'cpu'
      },
      selectHardware: function () {
        this.selectCard = 'hardware'
      },
      getPhysicalDeviceAssignment: function () {
        let url = '/dubbo/getPhysicalDeviceAssignmentOV/' + this.physicalDeviceAssignIDC
        rbHttp.sendRequest({
          method: 'GET',
          url: url,
          params: {}
        }).then(res => {
          if (res.result === 'true') {
            this.physicalDeviceAssignmentOV = res.data
          }
        })
      },
      drawChartPhysicalMachineAssign: function () {
        var chart = echarts.init(document.getElementById('physicalMachineAssign'))
        let end = 25
        if (physicalDeviceAssignmentOV.deviceName.length >= 30) {
          end = 20
        } else if (physicalDeviceAssignmentOV.deviceName.length >= 20) {
          end = 25
        } else if (physicalDeviceAssignmentOV.deviceName.length > 10) {
          end = 35
        } else {
          end = 60
        }
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
              return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' + params[1].seriesName + ' : ' + (params[1].value + params[0].value)
            }
          },
          calculable: true,
          grid: {
            left: '3%',
            top: '8%',
            bottom: '6%',
            right: '2%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              axisLabel: {
                margin: 8,
                textStyle: {
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontFamily: '微软雅黑',
                  fontSize: 8
                },
                formatter: function (value, index) {
                  var s = value.substring(0, value.length / 2)
                  var s1 = value.substring(value.length / 2, value.length)
                  return s + '\n' + s1
                }
              },
              data: physicalDeviceAssignmentOV.deviceName
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          dataZoom: [
            {
              height: 12,
              type: 'slider',
              show: true,
              zoomLock: true,
              start: 0,
              handleSize: '110%',
              backgroundColor: 'rgba(51,204,255,0.3)',
              showDetail: false,
              dataBackground: {
                lineStyle: {
                  opacity: 0
                },
                areaStyle: {
                  opacity: 0
                }

              },
              handleStyle: {
                color: '#000000',
                borderColor: '#000000',
                borderWidth: 1
              },
              end: end,
              top: '94%'
            }
          ],
          series: [
            {
              name: '已分配',
              type: 'bar',
              stack: 'sum',
              animationDuation: 400,
              animationDuationUpdate: 100,
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: '#00BBFF',
                  barBorderColor: '#00BBFF',
                  barBorderWidth: 6,
                  barBorderRadius: 0,
                  label: {
                    show: true, position: 'insideTop'
                  }
                }
              },
              data: physicalDeviceAssignmentOV.assign
            },
            {
              name: '预分配',
              type: 'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#fff',
                  barBorderColor: '#00BBFF',
                  barBorderWidth: 6,
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (params) {
                      for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
                        if (option.xAxis[0].data[i] === params.name) {
                          return option.series[0].data[i] + params.value
                        }
                      }
                    },
                    textStyle: {
                      color: '#00BBFF'
                    }
                  }
                }
              },
              data: physicalDeviceAssignmentOV.unassign
            }
          ]
        }
        chart.setOption(option)
      },
      getVerticalResourceAssignment: function () {
        let url = '/dubbo/getVerticalResourceAssignmentOV/' + this.verticalResourceAssignIDC
        rbHttp.sendRequest({
          method: 'GET',
          url: url,
          params: {}
        }).then(res => {
          if (res.result === 'true') {
            this.verticalResourceAssignmentOV = res.data
          }
        })
      },
      drawVerticalResourceAssign: function () {
        let chart = echarts.init(document.getElementById('virtualResourceStatics'))
        let option = {
          tooltip: {
            formatter: '{b} <br/>{c} {a}'
          },
          series: [
            {
              name: '核',
              type: 'gauge',
              z: 3,
              min: this.verticalResourceAssignmentOV.cpu[0],
              max: this.verticalResourceAssignmentOV.cpu[1],
              splitNumber: 3,
              radius: '90%',
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 7
                }
              },
              axisLabel: {
                formatter: function (value) {
                  var re = ('' + value).split('.')
                  return re[0]
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: {           // 分隔线
                length: 12,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              title: {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: 'bolder',
                  fontSize: 12,
                  fontStyle: 'italic'
                }
              },
              detail: {
                offsetCenter: ['-3%', '65%'],
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: 'bolder',
                  fontSize: 18
                },
                formatter: function (value) {
                  return value + '核'
                }
              },
              data: [{value: this.verticalResourceAssignmentOV.cpu[2], name: 'cpu'}]
            },
            {
              name: 'G',
              type: 'gauge',
              center: ['25%', '55%'],    // 默认全局居中
              radius: '75%',
              min: this.verticalResourceAssignmentOV.ram[0],
              max: this.verticalResourceAssignmentOV.ram[1],
              endAngle: 45,
              splitNumber: 3,
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 5
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 8,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                formatter: function (value) {
                  var re = ('' + value).split('.')
                  return re[0]
                }
              },
              splitLine: {           // 分隔线
                length: 10,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 5
              },
              title: {
                offsetCenter: [0, '-30%']       // x, y，单位px
              },
              detail: {
                offsetCenter: ['-3%', '65%'],
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: 'bolder',
                  fontSize: 18
                },
                formatter: function (value) {
                  return value + 'G'
                }
              },
              data: [{value: this.verticalResourceAssignmentOV.ram[2], name: '内存'}]
            },
            {
              name: '%',
              type: 'gauge',
              center: ['74%', '50%'],    // 默认全局居中
              radius: '75%',
              min: 0,
              max: 100,
              startAngle: 135,
              endAngle: 45,
              splitNumber: 2,
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 7
                }
              },
              axisTick: {            // 坐标轴小标记
                splitNumber: 5,
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                formatter: function (v) {
                  switch (v + '') {
                    case '0' :
                      return '0%'
                    case '100' :
                      return '100%'
                    case '50' :
                      return '物理存储'
                  }
                }
              },
              splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 3
              },
              title: {
                show: false
              },
              detail: {
                show: false
              },
              data: [{value: this.verticalResourceAssignmentOV.physicalStorage, name: '物理存储'}]
            },
            {
              name: '%',
              type: 'gauge',
              center: ['74%', '50%'],    // 默认全局居中
              radius: '75%',
              min: 0,
              max: 100,
              startAngle: 315,
              endAngle: 225,
              splitNumber: 2,
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 7
                }
              },

              axisTick: {
                show: true, // 坐标轴小标记
                splitNumber: 5,
                length: 10,
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                formatter: function (v) {
                  switch (v + '') {
                    case '0' :
                      return '0%'
                    case '100' :
                      return '100%'
                    default :
                      return '虚拟化存储'
                  }
                }
              },
              splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 3
              },
              title: {
                show: false
              },
              detail: {
                show: false
              },
              data: [{value: this.verticalResourceAssignmentOV.virtualStorage, name: '虚拟化存储'}]
            }
          ]
        }
        chart.setOption(option)
      },
      getServiceUsageStorage: function () {
        let url = '/dubbo/getServiceUsageOV/' + this.serviceUsageIDC + '/' + 'storage'
        rbHttp.sendRequest({
          method: 'GET',
          url: url,
          params: {}
        }).then(res => {
          if (res.result === 'true') {
            this.serviceUsageOV = res
          }
        })
      },
      getServiceUsageCpu: function () {
        let url = '/dubbo/getServiceUsageOV/' + this.serviceUsageIDC + '/' + 'cpu'
        rbHttp.sendRequest({
          method: 'GET',
          url: url,
          params: {}
        }).then(res => {
          if (res.result === 'true') {
            this.serviceUsageOV = res
          }
        })
      },
      getServiceUsageHardware: function () {
        let url = '/dubbo/getServiceUsageOV/' + this.serviceUsageIDC + '/' + 'memory'
        rbHttp.sendRequest({
          method: 'GET',
          url: url,
          params: {}
        }).then(res => {
          if (res.result === 'true') {
            this.serviceUsageOV = res
          }
        })
      },
      drawChart: function () {
        let data = this.serviceUsageOV
        var chart = echarts.init(document.getElementById('serverUsageDistribution'))
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#DDDDDD', '#33CCFF', '#FFFF77', '#FF8800', '#FF88C2'],
          series: [
            {
              name: '服务器使用率分布',
              type: 'pie',
              radius: '60%',
              center: ['50%', '50%'],
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    fontWeight: 'lighter',
                    color: '#666666'
                  }
                }
              },
              itemStyle: {
                emphasis: {
                  show: true,
                  borderWidth: 1,
                  shadowBlur: 4,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.8)'
                }
              },
              data: [
                {value: data.value[0], name: data.range[0]},
                {value: data.value[1], name: data.range[1]},
                {value: data.value[2], name: data.range[2]},
                {value: data.value[3], name: data.range[3]},
                {value: data.value[4], name: data.range[4]}
              ]
            }
          ]
        }
        chart.setOption(option)
      },
      getVisualAccountStatistics: function () {
        let url = '/dubbo/getVirtualSettlementOV/' + '10'
        rbHttp.sendRequest({
          method: 'GET',
          url: url,
          params: {}
        }).then(res => {
          if (res.result === 'true') {
            this.visualAccountStatisticsOV = res
          }
        })
      },
      getResourcePoolUsageAnalyze: function () {
        let url = '/dubbo/getResourceUsageAnalyseOV/' + this.resourceUsageAnalyseIDC + '/' + this.beginDate + '/' + this.endDate
        rbHttp.sendRequest({
          method: 'GET',
          url: url,
          params: {}
        }).then(res => {
          if (res.result === 'true') {
            this.resourcePoolUsageAnalyzeOV = res
          }
        })
      },
      drawResourcePoolUsageAnalyzeStorage: function () {
        this.drawResourcePoolUsageAnalyzeChart(resourcePoolUsageAnalyzeOV.time, resourcePoolUsageAnalyzeOV.memoryMax, resourcePoolUsageAnalyzeOV.memoryAvg)
      },
      drawResourcePoolUsageAnalyzeChart: function (time, max, avg) {
        var chart = echarts.init(document.getElementById('resourcePoolUsageAnalyze'))
        time = time.map(function (str) {
          return str.substring(5, str.length - 3)
        })
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#33CCFF', '#FF88C2'],
          legend: {
            orient: 'horizontal',
            top: '-1%',
            right: '7%',
            data: ['峰值', '均值'],
            textStyle: {
              fontSize: 8
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time,
            axisLabel: {
              margin: 12,
              textStyle: {
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 10
              }
            }
          },
          yAxis: {
            type: 'value'
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            }
          ],
          series: [
            {
              name: '峰值',
              showSymbol: false,
              type: 'line',
              data: max
            },
            {
              name: '均值',
              showSymbol: false,
              type: 'line',
              data: avg
            }
          ]
        }
        chart.setOption(option)
      }
    }
  }
</script>

<style scoped>
  .top-item {
    margin-top: 5px;
  }

  .panel-master {
    border-color: #ddd;
  }

  .panel-master > .panel-heading {
    color: #fff;
    background-color: #564d8a;
    border-color: #ddd;
  }

  .panel-master > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #ddd;
  }

  .panel-master > .panel-heading .badge {
    color: #f5f5f5;
    background-color: #333;
  }

  .panel-master > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #ddd;
  }

  .panel-master-1, .panel-server, .panel-default {
    background: #fff;
    border-radius: 2px;
    box-shadow: 2px 6px 6px #b8c4d3;
  }

  .panel-master-1 > .panel-heading-1 {
    color: #6f6f6f;
    background: #fff url(/static/img/osa/zhuji.png) no-repeat 30px center;
  }

  .panel-primary {
    border-color: #337ab7;
  }

  .panel-primary > .panel-heading {
    color: #fff;
    background-color: #337ab7;
    border-color: #337ab7;
  }

  .panel-primary > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #337ab7;
  }

  .panel-primary > .panel-heading .badge {
    color: #337ab7;
    background-color: #fff;
  }

  .panel-primary > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #337ab7;
  }

  .panel-success {
    border-color: #d6e9c6;
  }

  .panel-success > .panel-heading {
    color: #3c763d;
    background-color: #dff0d8;
    border-color: #d6e9c6;
  }

  .panel-success > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #d6e9c6;
  }

  .panel-success > .panel-heading .badge {
    color: #dff0d8;
    background-color: #3c763d;
  }

  .panel-success > .panel-footer + .panel-collapse > .panel-bcody {
    border-bottom-color: #d6e9c6;
  }

  .panel-success-1 {
    background: #fff;
    border-radius: 2px;
    box-shadow: 2px 6px 6px #b8c4d3;
  }

  .panel-success-1 > .panel-heading-1 {
    color: #6f6f6f;
    background: #fff url(/static/img/osa/net.png) no-repeat 30px center;
  }

  .panel-info {
    border-color: #bce8f1;
  }

  .panel-info > .panel-heading {
    color: #31708f;
    background-color: #d9edf7;
    border-color: #bce8f1;
  }

  .panel-info > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #bce8f1;
  }

  .panel-info > .panel-heading .badge {
    color: #d9edf7;
    background-color: #31708f;
  }

  .panel-info > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #bce8f1;
  }

  .panel-info-1 {
    background: #fff;
    border-radius: 2px;
    box-shadow: 2px 6px 6px #b8c4d3;
  }

  .panel-info-1 > .panel-heading-1 {
    color: #6f6f6f;
    background: #fff url(/static/img/osa/shujuku.png) no-repeat 30px center;
  }

  .panel-warning {
    border-color: #faebcc;
  }

  .panel-warning > .panel-heading {
    color: #8a6d3b;
    background-color: #fcf8e3;
    border-color: #faebcc;
  }

  .panel-warning > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #faebcc;
  }

  .panel-warning > .panel-heading .badge {
    color: #fcf8e3;
    background-color: #8a6d3b;
  }

  .panel-warning > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #faebcc;
  }

  .panel-warning-1 {
    background: #fff;
    border-radius: 2px;
    box-shadow: 2px 6px 6px #b8c4d3;
  }

  .panel-warning-1 > .panel-heading-1 {
    color: #6f6f6f;
    background: #fff url(/static/img/osa/cunchu.png) no-repeat 30px center;

  }

  .panel-heading-1 {
    width: 100%;
    height: 90px;
    padding: 20px 10px 10px 25%;
  }

  .panel-master-1 h1, .panel-success-1 h1, .panel-heading-1 h1, .panel-warning-1 h1, .panel-danger-1 h1 {
    text-align: center;
    margin: 0px 0 15px 0;
    font-size: 18px;
  }

  .corner {
    display: inline-block;
    background-color: #2d86f2;
    min-width: 25px;
    padding: 0 3px;
    background-clip: padding-box;
    position: absolute;
    z-index: 100;
    left: 62px;
    top: 10px;
    border-radius: 10px;
    line-height: 12px;
    text-align: center;
    color: #fff !important;
    font-size: 12px;
  }

  .panel-heading-1 h1 span {
    padding: 0 0 0 10px;
    color: #ff6649;
  }

  .red {
    color: #dc0005;
  }

  .red-1 {
    color: #f6766c;
  }

  .orange {
    color: #fe7010;

  }

  .blue {
    color: #0084d1;
  }

  .yellow {
    color: #ffd821;
  }

  .gray {
    color: #d3d2cc;
  }

  .glyphicon-bell:before {
    content: "\e123";
  }

  .panel-heading-1 ul {
    height: 20px;
    padding: 0;
    margin: 0;
  }

  .panel-heading-1 ul li {
    float: left;
    list-style: none;
    text-align: center;
    padding-right: 0px;
    padding-left: 0px;
  }

  .panel-heading-1 ul li span {
    margin-right: 3px;
  }

  .panel-heading {
    padding: 12px 10px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .storageImageSelect {
    margin-top: 5px;
    background: url(/static/img/osa/neicun.png) no-repeat 15px center;
  }

  .storageImage {
    margin-top: 5px;
    background: url(/static/img/osa/neicun_gray.png) no-repeat 15px center;
  }

  .cpuImageSelect {
    margin-top: 5px;
    background: url(/static/img/osa/cpu.png) no-repeat 15px center;
  }

  .cpuImage {
    margin-top: 5px;
    background: url(/static/img/osa/cpu_gray.png) no-repeat 15px center;
  }

  .hardwareImageSelect {
    margin-top: 5px;
    background: url(/static/img/osa/yingpan.png) no-repeat 15px center;
  }

  .hardwareImage {
    margin-top: 5px;
    background: url(/static/img/osa/yingpan_gray.png) no-repeat 15px center;
  }

  .nav_left {
    display: block;
    margin-left: 8%;
    width: 100%;
    height: 40px;
  }

  .selectStyle {
    float: left;
    margin-right: 5px;
    border: 1px solid #dee0ed;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    padding: 0 24px 0 5px;
    height: 24px;
    outline: none;
    padding-left: 1%;
    text-align: center;
    background: url(/static/img/osa/icon_select.png) no-repeat right center #fff;
  }

  .panel-date, .panel-search {
    float: left;
    border-radius: 2px;
    border: 1px solid #dee0ed;
    background: #fff;
    margin-right: 10px;
  }

  .panel-image {
    float: left;
    width: 25px;
    height: 19px;
    margin: 3.5px 0 0 0;
  }
</style>
<style>
  tr.tabelHeadClass {
    background-color: #6fb3e0;
    color: #ffffff;
  }

  tr.el-table__row.tabelRowClass {
    text-align: center;
  }

  .panel-date .el-input--mini .el-input__inner {
    height: 22px;
    border: 0px;
  }

  .panel-date .el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
</style>
