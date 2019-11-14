<template>
  <div class="component-container">
    <el-row class="header">
      <span>资源池：</span>
      <el-select v-model="resourcePool" filterable placeholder="请选择" @change="select()">
        <el-option
          v-for="(item, index) in poolList"
          :key="index"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-row>
    <el-row v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <div v-if="resourcePool === null">
        <el-row class="row">
          <el-col :span="12">
            <div ref="pie" class="pie"></div>
          </el-col>
          <el-col :span="12">
            <div ref="pie1" class="pie"></div>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            <div ref="pie2" class="pie"></div>
          </el-col>
          <el-col :span="12">
            <div ref="pie3" class="pie"></div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row class="row">
          <el-col :span="12">
            <div ref="pie" class="pie"></div>
          </el-col>
          <el-col :span="12">
            <div ref="pie1" class="pie"></div>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            <div ref="pie2" class="pie"></div>
          </el-col>
          <el-col :span="12">
            <div ref="pie3" class="pie"></div>
          </el-col>
        </el-row>
      </div>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {poolList} from '../config/options'
  import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'

  export default {
    data () {
      return {
        loading: false,
        resourcePool: null,
        poolList: [],
        echartOption: {
          title: {
            text: '物理机资源总览',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            data: ['需求资源', '建设资源', '已分配资源', '剩余资源']
          },
          series: [
            {
              name: '访问来源',
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
              data: [
                {value: 0, name: '需求资源'},
                {value: 0, name: '建设资源'}
              ]
            },
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '55%'],
              data: [
                {
                  value: 0,
                  name: '剩余资源',
                  label: {
                    normal: {
                      formatter: [
                        '{title|{a}}{abg|}',
                        '  {textCon|{b}: {c} }{rateCon|({d}%)}'
                      ].join('\n'),
                      backgroundColor: '#eee',
                      borderColor: '#777',
                      borderWidth: 1,
                      borderRadius: 4,
                      rich: {
                        title: {
                          color: '#eee',
                          align: 'center'
                        },
                        abg: {
                          backgroundColor: '#333',
                          width: '100%',
                          align: 'right',
                          height: 25,
                          borderRadius: [4, 4, 0, 0]
                        },
                        textCon: {
                          height: 24,
                          fontSize: 16
                        },
                        rateCon: {
                          // color: '#eee',
                          fontSize: 16
                          // backgroundColor: '#444'
                        }
                      }
                    }
                  }
                },
                {
                  value: 0,
                  name: '已分配资源',
                  label: {
                    normal: {
                      formatter: [
                        '{title|{a}}{abg|}',
                        '  {textCon|{b}: {c} }{rateCon|({d}%)}'
                      ].join('\n'),
                      backgroundColor: '#eee',
                      borderColor: '#777',
                      borderWidth: 1,
                      borderRadius: 4,
                      rich: {
                        title: {
                          color: '#eee',
                          align: 'center',
                          borderBottom: '1px solid red'
                        },
                        abg: {
                          backgroundColor: '#333',
                          width: '100%',
                          align: 'right',
                          height: 25,
                          borderRadius: [4, 4, 0, 0]
                        },
                        textCon: {
                          height: 24,
                          fontSize: 16
                        },
                        rateCon: {
                          // color: '#eee',
                          fontSize: 16
                          // backgroundColor: '#444'
                        }
                      }
                    }
                  }
                }
                // {value: 0, name: '已分配资源'},
                // {value: 0, name: '剩余资源'}
              ]
            }
          ]
        },
        echartOption1: {
          title: {
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} <br/>brands: {d}%({c})'
          },
          toolbox: {
            feature: {
              // myTool2: {
              //   show: true,
              //   title: '自定义扩展方法',
              //   icon: 'image://http://echarts.baidu.com/images/favicon.png',
              //   onclick: function () {
              //     alert('myToolHandler2')
              //   }
              // }
              saveAsImage: {
                title: '保存'
              }
            }
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            show: false,
            data: ['当期剩余数量', '当期已分配数量', '往期数量', '不可分配', '未来规划']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],
              data: [
                {
                  value: 0,
                  name: '当期剩余数量',
                  label: {
                    normal: {
                      formatter: '{b}: {d}%'
                    }
                  }
                },
                {
                  value: 0,
                  name: '当期已分配数量',
                  label: {
                    normal: {
                      formatter: '{b}: {d}%'
                    }
                  }
                },
                {
                  value: 0,
                  name: '往期数量',
                  label: {
                    normal: {
                      formatter: '{b}: {d}%'
                    }
                  }
                },
                {
                  value: 0,
                  name: '不可分配',
                  label: {
                    normal: {
                      formatter: '{b}: {d}%'
                    }
                  }
                },
                {
                  value: 0,
                  name: '未来规划',
                  label: {
                    normal: {
                      formatter: '{b}: {d}%'
                    }
                  }
                }
              ]
            }
          ]
        },
        echartsArr: []
      }
    },
    methods: {
      // 1 element select选择
      select () {
        if (this.resourcePool === null) {
          this.disposeEcharts()
          this.$nextTick(() => {
            this.initEcharts()
          })
        } else {
          this.disposeEcharts()
          this.$nextTick(() => {
            for (let item of this.poolList) {
              if (item.id === this.resourcePool) {
                this.initEcharts1(item.name)
                break
              }
            }
          })
        }
      },
      // 2 业务逻辑 跳转
      goPages (params) {
        let name = params.name
        switch (name) {
          case '需求资源':
            this.$router.push('/resource/collect/list')
            break
          case '建设资源':
            this.$router.push('/resource/construct/list')
            break
          case '已分配资源':
            this.$router.push('/resource/distribution/list')
            break
          default:
            break
        }
      },
      // 3 封装方法
      initData () {
        this.poolList = poolList
        this.initEcharts()
      },
      // 初始化图层
      initEcharts () {
        for (let i in this.$refs) {
          this.loading = true
          if (i === 'pie1') {
            this.getDatas('vm', '虚拟机资源总览', i)
          } else if (i === 'pie2') {
            this.getDatas('storage', '存储资源总览', i)
          } else if (i === 'pie3') {
            this.getDatas('network', '网络资源总览', i)
          } else {
            this.getDatas('pm', '物理机资源总览', i)
          }
        }
      },
      // 初始化资源池图层
      initEcharts1 (str) {
        for (let i in this.$refs) {
          this.loading = true
          if (i === 'pie1') {
            rbProjectDataServiceFactory.getStorageOverviewData({
              resource_pool: str
            }).then((res) => {
              this.packData(res, `${str}存储总览`, i)
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else if (i === 'pie2') {
            rbProjectDataServiceFactory.getServerEstimateData({
              resource_pool: str
            }).then((res) => {
              this.packData(res, `${str}服务器分配总览`, i)
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else if (i === 'pie3') {
            rbProjectDataServiceFactory.getStorageEstimateData({
              resource_pool: str
            }).then((res) => {
              this.packData(res, `${str}存储分配总览`, i)
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            rbProjectDataServiceFactory.getServerOverviewData({
              resource_pool: str
            }).then((res) => {
              this.packData(res, `${str}服务器总览`, i)
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        }
      },
      disposeEcharts () {
        for (let item of this.echartsArr) {
          item.dispose()
        }
        this.echartsArr = []
      },
      packData (res, str, num) {
        let options = JSON.parse(JSON.stringify(this.echartOption1))
        options.title.text = str
        if (res.futureplanCount) {
          options.series[0].data[0].value = res.currpersyCount
          options.series[0].data[1].value = res.currperyfpCount
          options.series[0].data[2].value = res.perCount
          options.series[0].data[3].value = res.nodiscount
          options.series[0].data[4].value = res.futureplanCount
        }
        this.echartsArr[this.echartsArr.length] = echarts.init(this.$refs[num])
        this.echartsArr[this.echartsArr.length - 1].setOption(options)
      },
      // 4 得到数据的方法
      getDatas (params, str, num) {
        rbProjectDataServiceFactory.getOverviewData({
          remark: params
        }).then((res) => {
          let options = JSON.parse(JSON.stringify(this.echartOption))
          options.title.text = str
          options.series[0].data[0].value = res.collectCount
          options.series[0].data[1].value = res.buildCount
          options.series[1].data[0].value = res.syCount
          options.series[1].data[1].value = res.yfpCount
          this.echartsArr[this.echartsArr.length] = echarts.init(this.$refs[num])
          this.echartsArr[this.echartsArr.length - 1].setOption(options)
          this.echartsArr[this.echartsArr.length - 1].on('click', (params) => {
            this.goPages(params)
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    .row {
      margin-top:2%;
      .pie {
        width: 579px;
        height:320px;
      }
    }
  }
</style>
