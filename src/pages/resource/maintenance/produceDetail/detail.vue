<template>
  <div class="components-container yw-dashboard">
    <el-collapse class="yw-dashboard-section"
                 v-model="activeColl">
      <el-collapse-item name="1">
        <template slot="title">
          详情
        </template>
        <el-form class="yw-form form-details"
                 :inline="true"
                 label-width="80px">
          <el-form-item label="厂商">
            {{produceInfo.produce}}
          </el-form-item>
          <el-form-item label="厂商类型">
            {{produceInfo.type}}
          </el-form-item>
          <el-form-item label="备注">
            {{produceInfo.remark}}
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <!--<template slot="title">-->
          <!--记录-->
        <!--</template>-->
        <el-tabs class="yw-tabs"
                 v-model="activeName">
          <el-tab-pane label="联系人"
                       name="first">
            <person-list
              :produceId="produceId">
            </person-list>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import rbMainProServiceFactory from 'src/services/cmdb/rb-maintenance-produce-services.factory.js'

  export default {
    // name: 'detail'
    components: {
      personList: () => import('./person-list.vue')
    },
    data () {
      return {
        activeColl: ['1', '2'],
        produceId: this.$route.query.id,
        produceInfo: {},
        activeName: 'first'
      }
    },
    mounted () {
      this.getProduceDetail()
    },
    methods: {
      getProduceDetail () {
        let data = {
          id: this.produceId
        }
        rbMainProServiceFactory.getProduceDetail(data).then((res) => {
          this.produceInfo = res || {}
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .form-details {
  .el-form-item {
    width:45%;
  }
  }
</style>
