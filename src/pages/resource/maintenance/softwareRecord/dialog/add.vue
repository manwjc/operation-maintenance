<template>
  <el-dialog
    class="yw-dialog"
    width="720px"
    :close-on-click-modal="false"
    :title="dialogMsg.dialogTitle"
    :visible.sync="dialogMsg.showDialog">
    <section class="yw-dialog-main">
      <el-form
        :rules="rules"
        :model="form"
        ref="form"
        :inline="true"
        label-width="130px"
        class="yw-form is-required">
        <el-form-item label="软件名称" prop="softwareName">
          <el-select v-model="form.softwareName" @change="handleChangeSoftware">
            <el-option v-for="(item, index) in softwareList"
                       :key = "index"
                       :label="item.softwareName"
                       :value="item.softwareName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目">
          <el-input v-model="form.project" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-input v-model="form.classify" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务厂家" prop="company">
          <el-input v-model="form.company" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务人员" prop="serverPerson">
          <el-input v-model="form.serverPerson"></el-input>
        </el-form-item>
        <el-form-item label="服务级别" prop="serverLevel">
          <el-select v-model="form.serverLevel">
            <el-option v-for="(item, index) in levelList"
                       :key = "index"
                       :label="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="serverStartTime">
          <el-date-picker
            style="width: 178px"
            v-model="form.serverStartTime"
            type="date"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="serverEndTime">
          <el-date-picker
            style="width: 178px"
            v-model="form.serverEndTime"
            type="date"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理时长" prop="handleLong" required>
          <el-input v-model="form.handleLong" style="width: 178px" disabled>
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实际人天" prop="realDays">
          <el-input v-model="form.realDays" type="number" style="width: 178px" :min="1">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="移动审批人" prop="yidongApprover">
          <el-input v-model="form.yidongApprover"></el-input>
        </el-form-item>
        <el-form-item label="运维审批人" prop="devopsApprover">
          <el-input v-model="form.devopsApprover"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="createUser">
          <el-input v-model="form.createUser"></el-input>
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
  import rbConfigDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
  import rbmaintenanceServiceFactory from 'src/services/cmdb/rb-maintenance-services.factory.js'

export default {
    components: {},
    props: ['dialogMsg'],
    data () {
      return {
        projectMap: {},
        form: {},
        rules: {
          softwareName: [{required: true, message: '请选择软件', trigger: 'blur'}
          ],
          serverPerson: [{required: true, message: '请填写服务人员', trigger: 'blur'}],
          serverLevel: [{required: true, message: '请选择服务级别', trigger: 'blur'}],
          serverStartTime: [{required: true, message: '服务开始时间', trigger: 'blur'},
            {validator: this.checkServerTime, trigger: 'blur'}
          ],
          serverEndTime: [{required: true, message: '服务结束时间', trigger: 'blur'},
            {validator: this.checkServerTime, trigger: 'blur'}
          ],
          realDays: [{ required: true, message: '请输入实际人天', trigger: 'blur' },
            { pattern: /^[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]
        },
        projectList: [],
        softwareList: [],
        softwareMap: {},
        levelList: [],
        classList: []
      }
    },
    mounted () {
      this.initData()
      this.listSoftware()
      this.getServerLevel()
    },
    methods: {
      initData () {
        if (this.dialogMsg.data !== null) {
          let softwareRecord = this.dialogMsg.data[0]
          this.$set(this.form, 'id', softwareRecord.id)
          this.$set(this.form, 'project', softwareRecord.project)
          this.$set(this.form, 'softwareName', softwareRecord.softwareName)
          this.$set(this.form, 'softwareId', softwareRecord.softwareId)
          this.$set(this.form, 'classify', softwareRecord.classify)
          this.$set(this.form, 'company', softwareRecord.company)
          this.$set(this.form, 'serverPerson', softwareRecord.serverPerson)
          this.$set(this.form, 'serverLevel', softwareRecord.serverLevel)
          this.$set(this.form, 'serverStartTime', new Date(softwareRecord.serverStartTime))
          this.$set(this.form, 'serverEndTime', new Date(softwareRecord.serverEndTime))
          this.$set(this.form, 'handleLong', softwareRecord.handleLong)
          this.$set(this.form, 'realDays', softwareRecord.realDays)
          this.$set(this.form, 'yidongApprover', softwareRecord.yidongApprover)
          this.$set(this.form, 'devopsApprover', softwareRecord.devopsApprover)
          this.$set(this.form, 'createUser', softwareRecord.createUser)
        }
      },
      checkServerTime (rule, value, callback) {
        if (this.form.serverStartTime !== undefined && this.form.serverEndTime !== undefined) {
          let startTime = new Date(this.form.serverStartTime)
          let endTime = new Date(this.form.serverEndTime)
          if (endTime - startTime < 0) {
            return callback(new Error('服务结束时间要大于开始时间'))
          } else {
            let num = (endTime - startTime) / (1000 * 3600 * 24)
            this.$set(this.form, 'handleLong', num + 1)
          }
        }
        callback()
      },
      handleChangeSoftware () {
        let softwareInfo = this.softwareMap[this.form.softwareName]
        this.form.softwareId = this.softwareMap[this.form.softwareName].id
        this.form.project = softwareInfo.project
        this.form.classify = softwareInfo.classify
        this.form.company = softwareInfo.company
      },
      getServerLevel () {
        rbConfigDictServiceFactory.getDictsByType({type: 'server_level'}).then((res) => {
          this.levelList = res
        })
      },
      listSoftware () {
        rbmaintenanceServiceFactory.listMaintenanceByPage({}).then((data) => {
          this.softwareList = data.result
          this.softwareList.forEach(item => {
            this.$set(this.softwareMap, item.softwareName, item)
          })
        })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // let info = this.dialogMsg.data !== null ? '是否确认更新？' : '是否确认添加？'
            // this.$confirm(info, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'info'
            // }).then(() => {
            let data = []
            data.push(this.form)
            rbmaintenanceServiceFactory.saveAndUpdateSoftwareRecord(data).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.dialogMsg.showDialog = false
                this.$emit('refreshTable', true)
              } else {
                this.$message.error(res.message)
              }
            })
            // })
          }
        })
      }
    }
}
</script>

<style lang="scss" scoped>
</style>
