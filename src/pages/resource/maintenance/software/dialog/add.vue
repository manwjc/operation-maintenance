<template>
  <el-dialog
    class="yw-dialog"
    :title="dialogMsg.dialogTitle"
    width="720px"
    :close-on-click-modal="false"
    :visible.sync="dialogMsg.showDialog">
    <section class="yw-dialog-main">
      <el-form
        class="yw-form is-required"
        :rules="rules"
        :model="form"
        ref="form"
        :inline="true"
        label-width="130px">
        <el-form-item label="项目" required>
          <el-select
            v-model="form.project"
            @change="setCurrProject">
            <el-option v-for="(project, index) in projectList"
                       :key = "index"
                       :label="project.projectName"
                       :value="project.projectName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务供应商" prop="company">
          <el-input v-model="form.company" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务联系人" prop="userName">
          <el-tooltip :content="form.userName || ''">
            <el-input v-model="form.userName" disabled></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="服务联系人电话" prop="telephone">
          <el-tooltip :content="form.telephone || ''">
            <el-input v-model="form.telephone" disabled></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="本期维保开始时间" prop="maintenBeginDate">
          <el-input v-model="form.maintenBeginDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="本期维保结束时间" prop="maintenEndDate">
          <el-input v-model="form.maintenEndDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-select v-model="form.classify">
            <el-option v-for="(item, index) in classList"
                       :key = "index"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件名称" prop="softwareName">
          <el-input v-model="form.softwareName"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" required>
          <el-select v-model="form.unit">
            <el-option v-for="(item, index) in unitList"
                       :key = "index"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="form.number" type="number" :min="1"></el-input>
        </el-form-item>
        <el-form-item label="维保管理员" prop="admin">
          <el-input v-model="form.admin"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" style="width: 178px"></el-input>
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
  import { formatDate2 } from 'src/assets/js/utility/rb-filters.js'

export default {
    components: {},
    props: ['dialogMsg'],
    data () {
      return {
        projectMap: {},
        form: {
          unit: '套'
        },
        rules: {
          softwareName: [{required: true, message: '请输入软件名称', trigger: 'blur'},
            {validator: this.checkSoftwareName, trigger: 'blur'}
          ],
          unit: [{required: true, message: '请选择单位', trigger: 'blur'}],
          classify: [{required: true, message: '请选择分类', trigger: 'blur'}],
          admin: [{required: true, message: '请输入维保管理员', trigger: 'blur'}],
          number: [{ required: true, message: '请输入数量', trigger: 'blur' },
            { pattern: /^[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]
        },
        projectList: [],
        classList: [],
        unitList: ['套']
      }
    },
    mounted () {
      this.listProject()
      this.getSoftwareType()
    },
    methods: {
      checkSoftwareName (rule, value, callback) {
        if (this.dialogMsg.data !== null) {
          callback()
        }
        let obj = {
          'project': this.form.project,
          'softwareName': this.form.softwareName
        }
        rbmaintenanceServiceFactory.listMaintenanceByPage(obj).then((res) => {
          if (res.result.length > 0) {
            return callback(new Error('相同项目软件名称重复'))
          } else {
            callback()
          }
        })
      },
      getSoftwareType () {
        rbConfigDictServiceFactory.getDictsByType({type: 'software_type'}).then((res) => {
          this.classList = res
        })
      },
      initData () {
        // this.$set(this.form, 'project', this.projectList[0].projectName)
        // this.setCurrProject(this.form.project)
        // this.$set(this.form, 'unit', this.unitList[0])
        // this.$set(this.form, 'classify', this.classList[0])
      },
      listProject () {
        var params = {
          maintenanceProjectType: '软件'
        }
        rbmaintenanceServiceFactory.listMaintenanceProject(params).then((data) => {
          this.projectList = data.data
          this.projectList.forEach(item => {
            this.$set(this.projectMap, item.projectName, item)
          })
          if (this.dialogMsg.data.length > 0) {
            let softwareData = this.dialogMsg.data[0]
            this.$set(this.form, 'id', softwareData.id)
            this.$set(this.form, 'project', softwareData.project)
            this.$set(this.form, 'softwareName', softwareData.softwareName)
            this.$set(this.form, 'unit', softwareData.unit)
            this.$set(this.form, 'number', softwareData.number)
            this.$set(this.form, 'admin', softwareData.admin)
            this.$set(this.form, 'classify', softwareData.classify)
            this.$set(this.form, 'remark', softwareData.remark)
            this.setCurrProject(softwareData.project)
          }
        })
      },
      setCurrProject (val) {
        let project = this.projectMap[val]
        let produceInfo = this.projectMap[val].produceInfo
        this.form.company = produceInfo.produce
        this.form.maintenBeginDate = formatDate2(project.serviceStartTime)
        this.form.maintenEndDate = formatDate2(project.serviceEndTime)
        // 格式化服务厂商联系人信息
        var concat = produceInfo == null ? null : produceInfo.concats
        var name = '', phone = ''
        if (concat !== null && concat.length > 0) {
          concat.forEach((item) => {
            if (item['name'] !== undefined) {
              if (name !== '') {
                name += ','
              }
              name += item['name']
            }
            if (item['phone'] !== undefined) {
              if (phone !== '') {
                phone += ','
              }
              phone += item['phone']
            }
          })
        }
        this.form.userName = name
        this.form.telephone = phone
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // let info = this.dialogMsg.data[0] && this.dialogMsg.data[0].id ? '是否确认更新？' : '是否确认添加？'
            // this.$confirm(info, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'info'
            // }).then(() => {
            let data = {
              id: this.form.id,
              projectId: this.projectMap[this.form.project].id,
              softwareName: this.form.softwareName,
              unit: this.form.unit,
              number: this.form.number,
              admin: this.form.admin,
              classify: this.form.classify,
              remark: this.form.remark
            }
            rbmaintenanceServiceFactory.insertMaintenance(data).then(res => {
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
