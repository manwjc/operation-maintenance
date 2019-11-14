<template>
  <div class="components-container" v-loading="loading">
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="add()">新增</el-button>
        <!--<el-button type="text"-->
                   <!--icon="el-icon-edit"-->
                   <!--@click="update()">修改</el-button>-->
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="personList"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  height="300px">
          <el-table-column
             prop="name"
             label="联系人">
          </el-table-column>
          <el-table-column
            prop="personType"
            label="人员类型">
            <template slot-scope="scope">
              {{resolveType(scope.row.personTypes)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
          <el-table-column
            label="删除">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="update(scope.row)">
                修改
              </el-button>
              <el-button type="text"
                         @click="deleteConcat(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <AddEditPerson
      v-if="dialogInfo.show === true"
      @refresh="refresh()"
      :produceId="produceId"
      :dialogInfo="dialogInfo">
    </AddEditPerson>
  </div>
</template>

<script>
  import rbMainProServiceFactory from 'src/services/cmdb/rb-maintenance-produce-services.factory.js'
  export default {
    // name: 'person-list'
    components: {
      AddEditPerson: () => import('./add-edit-person.vue')
    },
    props: ['produceId'],
    data () {
      return {
        personList: [],
        loading: false,
        dialogInfo: {
          type: '',
          show: false,
          data: {}
        }
      }
    },
    mounted () {
      this.getPersonList()
    },
    methods: {
      // 获取当前厂商下所有联系人
      getPersonList () {
        this.loading = true
        let data={
          produceId: this.produceId
        }
        rbMainProServiceFactory.listProducePerson(data).then((res) => {
          this.personList = res
        }).finally(() => {
          this.loading = false
        })
      },
      //添加联系人（展示添加弹框）
      add () {
        this.dialogInfo.type = 'add'
        this.dialogInfo.show = true
      },
      //修改联系人（展示修改弹框）
      update (row) {
        this.dialogInfo.data = row
        this.dialogInfo.type = 'update'
        this.dialogInfo.show = true
      },
      deleteConcat(row) {
        let that = this
        this.$confirm('确认删除联系人' + row.name + "-" + row.phone).then(() => {
          this.loading = true
          rbMainProServiceFactory.deleteProduceConcat({id: row.id}).then((res) => {
            if (res.success) {
              that.$message.success("删除成功")
              this.getPersonList()
            } else {
              that.$message.error("删除失败, error: " + res.message)
            }
          }).finally(() => {
            this.loading = false
          })
        })
      },
      refresh () {
        this.getPersonList()
        this.dialogInfo.show = false
      },
      resolveType (types) {
        let res=''
        if (types) {
          types.forEach(item => {
            res += item.value
            res += ','
          })
          return res.substring(0,res.length-1)
        }
      },
      handleCurrentChange (val) {
      }
    }
  }
</script>

<style scoped>

</style>
