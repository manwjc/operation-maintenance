<template>
  <el-dialog
    class="yw-dialog"
    width="380px"
    :close-on-click-modal="false"
    :title="dialogMsg.dialogTitle"
    :show-close="false"
    :visible.sync="dialogMsg.showDialog">
    <section class="yw-dialog-main">
      <el-form
        :rules="rules"
        :model="form"
        ref="form"
        label-width="100px"
        class="yw-form is-required">
        <el-form-item label="本地端口" prop="aPortId">
          <el-input v-model="form.aPortId"></el-input>
        </el-form-item>
        <el-form-item label="对端资源池" prop="idcType">
          <el-select v-model="form.idcType">
            <el-option v-for="(item, index) in poolList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对端设备IP" prop="zInstanceId">
          <el-select v-model="form.zInstanceId"
                     remote
                     :remote-method="getList"
                     clearable
                     v-loading="ipLoading"
                     filterable>
            <el-option v-for="(item, index) in currentList"
                       v-if="item.id !== instanceId"
                       :key="index"
                       :label="item.ip"
                       :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="对端设备端口" prop="zPortId">
          <el-input v-model="form.zPortId"></el-input>
        </el-form-item>
        <el-form-item label="连接属性" prop="connectType">
          <el-select v-model="form.connectType">
            <el-option v-for="(item, index) in connectTypeList"
                       :key="index"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" style="width: 178px" v-model="form.remark">
          </el-input>
        </el-form-item>
      </el-form>
    </section>
    <section class="btn-wrap">
    <el-button type="primary" @click="submit">确 定</el-button>
    <el-button @click="dialogMsg.showDialog = false">取 消</el-button>
  </section>
  </el-dialog>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import rbConfigServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'

  export default {
    components: {},
    props: ['dialogMsg', 'instanceId'],
    data () {
      return {
        rules:{
          aPortId: [{required: true, message: '请填写本地端口', trigger: 'blur'},
            {max: 40, message: '最大长度40', trigger: 'blur'}],
          idcType: [{required: true, message: '请选择对端资源池', trigger: 'blur'}],
          zInstanceId: [{required: true, message: '请选择对端设备IP', trigger: 'blur'}],
          zPortId: [{required: true, message: '请填写对端端口', trigger: 'blur'},
            {max: 40, message: '最大长度40', trigger: 'blur'}],
          connectType: [{required: true, message: '连接属性', trigger: 'blur'}],
        },
        poolList: [],
        connectTypeList: [],
        instanceList: [],
        form: {},
        ipLoading: false,
        currentList: [],
        currentLoadCount: 0
      }
    },
    mounted () {
      this.getPoolList()
      this.getConnectTypeList()
    },
    methods: {
      getList(query) {
        let query_data =
          {idcType:this.form.idcType,
            ip:query,
            queryType:"normal",
            pageNumber: 1,
            pageSize: 50}
        rbCmdbServiceFactory.getInstanceList(query_data).then((res) => {
          this.currentList = res.data
        })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let data = {
              aInstanceId: this.instanceId,
              aPortId: this.form.aPortId,
              zInstanceId: this.form.zInstanceId,
              zPortId: this.form.zPortId,
              connectType: this.form.connectType,
              remark: this.form.remark
            }
            rbCmdbServiceFactory.validRelationUnique(data).then((res) => {
              if (!res) {
                this.$message.error("当前端口和对端端口关系已存在!")
              } else {
                rbCmdbServiceFactory.insertInstnacePortRelation(data).then((res) => {
                  if (res.success) {
                    this.dialogMsg.showDialog = false
                    this.$message.success(res.message)
                    this.$emit('reload');
                  } else {
                    this.$message.error(res.message)
                  }
                })
              }
            })

          }
        })
      },
      getPoolList () {
        let data = {
          'type': 'idcType'
        }
        rbConfigServiceFactory.getDictsByType(data).then((res) => {
          this.poolList = res
          this.$set(this.form, 'idcType', this.poolList[0].value)
          this.getInstanceList()
        })
      },
      getConnectTypeList () {
        let data = {
          'type': 'resource_relation_type'
        }
        rbConfigServiceFactory.getDictsByType(data).then((res) => {
          this.connectTypeList = res
        })
      }
    }
  }
</script>

<style scoped>

</style>
