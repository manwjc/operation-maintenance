<template>
  <div>

    <el-form label-position="top" class="demo-ruleForm" label-width="100px" style="padding-right:30px;">


      <el-form-item align="center" label="请选择需要导出的配置类型" style="width:100%; margin-left:auto;margin-right:auto;">
        <el-select placeholder="配置类型" v-model="moduleId">
          <el-option-group
            v-for="group in selectData"
            :key="group.id"
            :label="group.name">
            <el-option
              v-for="item in group.item"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item align="center" style="margin-top:15px;">
        <form id="frmHostInfo" name="frmHostInfo" method="post"  fit="true"></form>
        <el-button type="primary" @click="onSubmit">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped>
</style>
<script>
  // import $ from 'jquery'
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'

  export default {
    props: ['circleId'],
    data () {
      return {
        moduleId: '',
        selectData: [],
        isShowItem: false,
        fileList: []
      }
    },
    mounted: function () {
      this.initData()
    },
    methods: {
      // 提交表单
      onSubmit () {
        rbCmdbServiceFactory.downloadCMDBData(this.moduleId).then((data) => {
          let blob = new Blob([data], {type: 'application/msword'})
          // 创建下载链接
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          let filename = ''
          for (let i in this.selectData) {
            let group = this.selectData[i]
            for (let j in group.item) {
              let item = group.item[j]
              if (item.id === this.moduleId) {
                filename = item.name + '.xls'
                break
              }
            }
            if (filename !== '') {
              break
            }
          }
          downLoadElement.download = filename
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      initData () {
        rbCmdbServiceFactory.getModuleTree('').then((data) => {
          this.selectData = data
        })
        // var sysCodeUrl = '/cmdb/circle/getModuleTree'
        // $.ajax({
        //   url: sysCodeUrl,
        //   type: 'POST',
        //   cache: false,
        //   async: true,
        //   dataType: 'json',
        //   data: ''
        // }).done(function (data) {
        //   this.selectData = data
        // }.bind(this))
      },
      closeWin: function () {
        this.$emit('childBindAdd')
      },
      closeDialog () {
        this.$confirm('是否确认退出？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.closeWin()
        }).catch(() => {
          this.$notify({
            title: '提示',
            message: '已取消退出',
            type: 'info',
            duration: 3000
          })
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
