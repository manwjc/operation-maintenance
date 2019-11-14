<template>
  <div class="components-container">
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-upload2"
                   @click="exportOut">导出</el-button>
        <el-form class="yw-form" label-width="100px" :inline="true" v-model="searchParams">
        <el-form-item label="编号：">
          <el-input v-model="searchParams.name"></el-input>
        </el-form-item>
        <el-form-item label="源区域：">
          <el-input v-model="searchParams.sourceZone"></el-input>
        </el-form-item>
        <el-form-item label="目标区域：">
          <el-input v-model="searchParams.destinationZone"></el-input>
        </el-form-item>
        <el-form-item label="执行动作：">
          <el-input v-model="searchParams.action"></el-input>
        </el-form-item>
        <el-form-item label="源地址：">
          <el-input v-model="searchParams.sourceAddress"></el-input>
        </el-form-item>
        <el-form-item label="目标地址：">
          <el-input v-model="searchParams.destinationAddress"></el-input>
        </el-form-item>
        <el-form-item label="服务端口：">
          <el-input v-model="searchParams.servicePort"></el-input>
        </el-form-item>
        </el-form>
        <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="query()">查询
        </el-button>
        </section>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  :data="result"
                  height="calc(100vh - 305px)"
                  v-loading="loading"
                  stripe
                  border
                  size="mini"
                  style="width: 100%">
          <el-table-column label="防火墙IP"
                           align="center"
                           width="120">
            <template slot-scope="scope">
              {{ scope.row.ip }}
            </template>
          </el-table-column>
          <el-table-column label="策略编号"
                           align="center"
                           width="140">
            <template slot-scope="scope">
              {{ scope.row.security_rule.name }}
            </template>
          </el-table-column>
          <el-table-column label="源区域"
                           align="center"
                           width="80">
            <template slot-scope="scope">
              {{ scope.row.security_rule.source_zone }}
            </template>
          </el-table-column>
          <el-table-column label="目的区域"
                           align="center"
                           width="80">
            <template slot-scope="scope">
              {{ scope.row.security_rule.destination_zone }}
            </template>
          </el-table-column>
          <el-table-column label="执行动作"
                           align="center"
                           width="80">
            <template slot-scope="scope">
              {{ scope.row.security_rule.action }}
            </template>
          </el-table-column>
          <el-table-column label="源地址"
                           align="center"
                           width="300"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.source.join(',') }}
            </template>
          </el-table-column>
          <el-table-column label="目的地址"
                           align="center"
                           width="300"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.target.join(',') }}
            </template>
          </el-table-column>
          <el-table-column label="服务端口"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.port.join(',')}}
            </template>
          </el-table-column>
          <el-table-column label="所属机房"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.roomId }}
            </template>
          </el-table-column>

          <el-table-column label="创建日期"
                           prop="log_create_time"
                           sortable
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
    </el-form>
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
import rbAlertNetworkStrategyFactory from 'src/services/alert/rb-alert-network-strategy.factory'

export default {
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
  },
  //关键字
  props: ['keyword','searchParams'],
  data () {
    return {
      //查询条件
      queryParams: {

      },
      // 查询结果
      result: [],
    }
  },
  created () {
    //    console.log(this.keyword);
    this.query()
  },
  methods: {
    //设置参数(参数具体字段名称，自行修改)
    setParams (activePagination) {
      if (activePagination) {
        this.queryParams['pageNum'] = this.currentPage;
        this.queryParams['pageSize'] = this.pageSize;
      } else {
        this.queryParams = {
          'pageNum': this.initPageChange(),
          'pageSize': this.pageSize,
          'name': this.searchParams.name,
          'sourceZone': this.searchParams.sourceZone,
          'destinationZone': this.searchParams.destinationZone,
          'action': this.searchParams.action,
          'destinationAddress': this.searchParams.destinationAddress,
          'sourceAddress': this.searchParams.sourceAddress,
          'servicePort': this.searchParams.servicePort
        }
      }

    },
    /**查询
     * activePagination:分页活动下保持先前的查询条件
     */
    query (activePagination = false) {

      this.setParams(activePagination);
      rbAlertNetworkStrategyFactory.getFillWallData(this.queryParams).then((res) => {
        this.loading = false;
        this.total = res.count
        // this.result = res.result
        this.result = []
        res.result.forEach((item) => {
          let rule = item
          let source = []
          if (!item.security_rule) {
            this.result.push(rule)
            return
          }
          if (item.security_rule.source_address) {
            let source_address = item.security_rule.source_address
            if (source_address.default) {
              source_address.default.forEach((item1) => {
                source.push(item1.network + '/' + item1.mask)
              })
            }
            if (source_address.range) {
              source_address.range.forEach((item1) => {
                source.push(item1.from + '-' + item1.to)
              })
            }
            if (source_address.address_sets && source_address.address_sets.list) {
              source_address.address_sets.list.forEach((item1) => {
                source.push(item1.ip + '/' + item1.mask)
              })
            }
          }
          rule.source = source
          let target = []
          if (item.security_rule.destination_address) {
            let target_address = item.security_rule.destination_address
            if (target_address.default) {
              target_address.default.forEach((item1) => {
                target.push(item1.network + '/' + item1.mask)
              })
            }
            if (target_address.range) {
              target_address.range.forEach((item1) => {
                target.push(item1.from + '-' + item1.to)
              })
            }
            if (target_address.address_sets && target_address.address_sets.list) {
              target_address.address_sets.list.forEach((item1) => {
                target.push(item1.ip + '/' + item1.mask)
              })
            }
          }
          rule.target = target
          let port = []
          if (item.security_rule['service'] && item.security_rule['service'].service_set) {
            let service = item.security_rule['service'].service_set
            service.forEach((item1) => {
              if (item1.list) {
                item1.list.forEach((item2) => {
                  let protocol = item2.protocol
                  if (item2.service_ports && item2.service_ports.range_ports) {
                    item2.service_ports.range_ports.forEach((item3) => {
                      if (protocol) {
                        port.push(item3.from + '-' + item3.to + '/' + protocol)
                      } else {
                        port.push(item3.from + '-' + item3.to)
                      }
                    })
                  }
                  if (item2.service_ports && item2.service_ports.ports) {
                    item2.service_ports.ports.forEach((item3) => {
                      if (protocol) {
                        port.push(item3 + '/' + protocol)
                      } else {
                        port.push(item3)
                      }
                    })
                  }
                })
              }
            })
          }
          rule.port = port
          this.result.push(rule)
        })
        this.$emit('updateTabData', this.total, 'fireWall');
      }).finally(() => {
        this.loading = false;
      })
      //      this.total = 20;
      //      this.result = (new Array(20)).fill({ 'pool_name': 'ssssssssssss', 'log_create_time': 'Thu Jul 25 2019 11:12:41 GMT+0800 (中国标准时间)' });
      //      this.$emit('updateTabData', this.total, 'fireWall');
    },

    //导出
    exportOut () {
      rbAlertNetworkStrategyFactory.exportFillWallData({ 'keyword': this.keyword }).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '网络策略-防火墙.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .yw-form {
    /deep/ .el-form-item__content {
      .el-input {
        width: 100px;
      }
      .el-select {
        width: 148px;
      }
    }
  }
</style>
