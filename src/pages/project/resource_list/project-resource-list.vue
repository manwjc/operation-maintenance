<template>
  <div>
    <div v-for="(obj, index) in resourceJson" v-if="obj.allData.length">
      <div style="width: 100%;background-color: #ffffff;height: 50px;margin-bottom: 2px;line-height: 50px;">
        <span style="margin-left: 10px;font-weight: 400;color: #333">{{obj.name}}</span>
        <el-input  v-model="obj.search" placeholder="按名称搜索" style="width: 250px;float: right;right: 5px;" size="small"></el-input>
      </div>
      <el-table :data="obj.data" stripe style="width: 100%">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==='success'" size="mini" type="success" round style="cursor: default">成功</el-button>
            <el-button v-else-if ="scope.row.status==='warning'" size="mini" type="warning" round>告警</el-button>
            <el-button v-else size="mini" type="danger" round>失败</el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | formatUtcStr}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import rbProjectDataService from 'src/services/rb-project-data-service.factory.js'
  export default {
    data () {
      return {
        project_name: this.$route.query.project_name,
        resourceJson: {
          knamespace: {
            name: '命名空间',
            type: 'KNAMESPACE',
            data: [],
            allData: [],
            search: ''
          },
          priv_regis_proj: {
            name: '镜像仓库项目',
            type: 'PRIV_REGIS_PROJ',
            data: [],
            allData: [],
            search: ''
          }
        }
      }
    },
    mounted: function () {
      this.getProjectDetailStatus()
    },
    methods: {
      getProjectDetailStatus () {
        rbProjectDataService.getProjectDetailStatus({project_name: this.project_name}).then((data) => {
          data.resources && data.resources.forEach(item => {
            for (let key in this.resourceJson) {
              if (item.type === this.resourceJson[key].type) {
                let obj = {
                  name: item.name,
                  status: item.status,
                  created_at: item.created_at
                }
                this.resourceJson[key].data.push(obj)
                this.resourceJson[key].allData.push(obj)
              }
            }
          })
        })
      }
    },
    watch: {
      'resourceJson.knamespace.search': function (val, oldVal) {
        this.resourceJson.knamespace.data = this.resourceJson.knamespace.allData.filter((data) => {
          return data.name.includes(val)
        })
      },
      'resourceJson.priv_regis_proj.search': function (val, oldVal) {
        this.resourceJson.priv_regis_proj.data = this.resourceJson.priv_regis_proj.allData.filter((data) => {
          return data.name.includes(val)
        })
      }
    }
  }
</script>
<style scoped>

</style>
