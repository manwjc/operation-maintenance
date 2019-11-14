<template>
  <el-dialog class="yw-dialog"
             :title="dialogInfo.type === 'update' ? '修改' : '新增'"
             :visible.sync="dialogInfo.show"
             width="500px"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             v-loading="loading"
              @close="reset()">
    <section class="yw-dialog-main">
      <el-form class="yw-form"
               ref="personForm"
               :model="personDetail"
               label-width="82px"
                :rules="rules">
        <el-form-item
          label="联系人"
          prop="name">
          <el-input
            type="text"
            v-model="personDetail.name">
          </el-input>
        </el-form-item>
        <el-form-item
          required
          label="人员类型">
          <treeselect class="yw-treeselect chart-filter-item"
                      v-model="selectTypeIds"
                      :options="personTypeTree"
                      :multiple="true"
                      :limit="1"
                      filterable
                      placeholder="请选择人员类型">
          </treeselect>
          <div class="text-validate-tip"
            v-if="showTypeError">人员类型不能为空
          </div>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="phone">
          <el-input
            type="text"
            v-model="personDetail.phone">
          </el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input
            type="text"
            v-model="personDetail.email">
          </el-input>
        </el-form-item>
        <el-form-item
          label="备注"
          style="width: 178px"
          prop="remark">
          <el-input
            type="textarea"
            v-model="personDetail.remark">
          </el-input>
        </el-form-item>
      </el-form>
    </section>
    <section class="btn-wrap">
      <el-button type="primary"
                 @click="submit()">确定</el-button>
      <el-button @click="cancel()">取消</el-button>
    </section>
  </el-dialog>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import rbMainProServiceFactory from 'src/services/cmdb/rb-maintenance-produce-services.factory.js'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    // name: 'add-edit-person'
    components: {
      Treeselect
    },
    props:['dialogInfo', 'produceId'],
    data () {
      return {
        personDetail: this.dialogInfo.type === 'update' ? JSON.parse(JSON.stringify(this.dialogInfo.data)) : {},
        personTypeList: [],
        personTypeTree: [],
        selectTypeIds: [],
        loading: false,
        showTypeError: false,
        rules:{
          name: [
            { required: true, message: '联系人必填', trigger: 'blur' }
          ],
          phone: [
            { required: true,message: '电话不能为空'},
            { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '电话格式不正确', trigger: ['blur'] }
          ],
          email: [
            { required: true,message: '邮箱不能为空'},
            { pattern: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: ['blur'] }
          ]
        }
      }
    },
    mounted () {
      this.getPersonTypeList()
    },
    methods: {
      // 初始化当前被选中类型
      resolveData () {
        let that = this
        this.dialogInfo.data.personTypes.forEach(item => {
          that.selectTypeIds.push(item.id)
        })
      },
      // 获取所有人员类型
      getPersonTypeList ()  {
        this.loading = true
        this.personTypeList = []
        this.selectTypeIds = []
        let that = this
        let data = {'type': 'mainten_person_type'}
        rbCmdbServiceFactory.getDictsByType(data).then((res) => {
          that.personTypeList = res
          that.personTypeList.forEach(item => {
            that.personTypeTree.push ({
              id: item.id,
              label: item.value
            })
          })
          if (this.dialogInfo.type === 'update') {
            this.resolveData()
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 重置数据
      reset () {
        this.personDetail = {}
        this.personTypeList = []
        this.personTypeTree = []
        this.selectTypeIds = []
        this.loading = false
        this.dialogInfo.show = false
      },
      submit () {
        this.loading = true
        if (this.selectTypeIds.length === 0) {
          this.showTypeError = true
        } else {
          this.showTypeError = false
        }
        let that = this
        this.$refs['personForm'].validate((valid) => {
          if (valid && !that.showTypeError) {
            that.loading = true
            let personTypes = []
            that.selectTypeIds.forEach(item => {
              personTypes.push({id: item})
            })
            that.$set(that.personDetail, 'produceId', that.produceId)
            that.$set(that.personDetail, 'personTypes', personTypes)
            if (that.dialogInfo.type === 'update') {
              that.update()
            } else {
              that.save()
            }
          } else {
            that.loading = false
          }
        })
      },
      save() {
        let that = this
        rbMainProServiceFactory.saveProduceConcat(this.personDetail).then((res) => {
          if (res.success) {
            that.$message.success("新增成功")
            that.$emit('refresh')
          } else {
            that.$message.error(res.message)
          }
        }).finally(() => {
          that.loading = false
        })
      },
      update () {
        let that = this
        rbMainProServiceFactory.updateProduceConcat(this.personDetail).then((res) => {
          if (res.success) {
            that.$message.success("更新成功")
            that.$emit('refresh')
          } else {
            that.$message.error(res.message)
          }
        }).finally(() => {
          that.loading = false
        })
      },
      cancel () {
        this.reset()
        this.dialogInfo.show = false
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
