<template>
  <el-container class="components-container">
    <el-aside class="yw-dashboard"
              width="300px">
      <el-scrollbar class="aside-main"
                    style="height: calc(100% - 60px)">
        <el-form class="yw-form is-required"
                 ref="form"
                 :model="form"
                 label-width="90px">
          <el-form-item label="数据库连接"
                        :prop="databaseUrl"
                        :key="databaseUrl"
                        :rules="[{required: true, message: '数据库连接不能为空'}]">
            <el-input v-model="form.databaseUrl"></el-input>
          </el-form-item>
          <el-form-item label="登录用户"
                        :prop="databaseUser"
                        :key="databaseUser"
                        :rules="[{required: true, message: '登录用户不能为空'}]">
            <el-input v-model="form.databaseUser"></el-input>
          </el-form-item>
          <el-form-item label="登录密码"
                        :prop="databasePwd"
                        :key="databasePwd"
                        :rules="[{required: true, message: '登录密码不能为空'}]">
            <el-input v-model="form.databasePwd"></el-input>
          </el-form-item>
          <el-form-item label="生成包目录">
            <el-input v-model="form.packagePath"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap"
             v-if="!isConnection">
          <el-button type="primary"
                     @click="connection()"
                     :disabled="isConnection">开始连接</el-button>
          <el-button @click="download()"
                     type="primary"
                     :disabled="!isConnection">下载JavaBeab</el-button>
          <el-button @click="generatorCurd()"
                     type="primary"
                     :disabled="!isConnection">生成CURD</el-button>
        </div>
        <div class="btn-wrap"
             v-if="isConnection">
          <el-button type="primary"
                     @click="connection()"
                     :disabled="isConnection">开始连接</el-button>
          <el-button @click="download()"
                     type="primary"
                     :disabled="!isConnection">下载JavaBeab</el-button>
          <el-button @click="generatorCurd()"
                     type="primary"
                     :disabled="!isConnection">生成CURD</el-button>
        </div>
      </el-scrollbar>
    </el-aside>
    <el-main class="yw-dashboard">
      <el-transfer filterable
                   :filter-method="filterMethod"
                   filter-placeholder="请输入表名"
                   :titles="['未选择表', '已选择表']"
                   :button-texts="['到左边', '到右边']"
                   :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                   v-model="value2"
                   :data="data2">
      </el-transfer>
    </el-main>
  </el-container>
  <!-- <div class="component-container">
    <div>
      <div style="width: 30%; float: left; height: 300px; max-height: 300px;">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row>
            <el-col>
              <el-form-item label="数据库连接" :prop="databaseUrl" :key="databaseUrl" :rules="[{required: true, message: '数据库连接不能为空'}]">
                <el-input v-model="form.databaseUrl"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="登录用户" :prop="databaseUser" :key="databaseUser" :rules="[{required: true, message: '登录用户不能为空'}]">
                <el-input v-model="form.databaseUser"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="登录密码" :prop="databasePwd" :key="databasePwd" :rules="[{required: true, message: '登录密码不能为空'}]">
                <el-input v-model="form.databasePwd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="生成包目录">
                <el-input v-model="form.packagePath"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="!isConnection">
              <el-button type="primary" @click="connection()" :disabled="isConnection">开始连接</el-button>
              <el-button type="info" @click="download()" :disabled="!isConnection">下载JavaBeab</el-button>
              <el-button type="info" @click="generatorCurd()" :disabled="!isConnection">生成CURD</el-button>
            </el-col>
            <el-col v-if="isConnection">
              <el-button type="info" @click="connection()" :disabled="isConnection">开始连接</el-button>
              <el-button type="primary" @click="download()" :disabled="!isConnection">下载JavaBeab</el-button>
              <el-button type="primary" @click="generatorCurd()" :disabled="!isConnection">生成CURD</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="width: 68%; float: right; height: 300px; max-height: 300px;">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入表名"
          :titles="['未选择表', '已选择表']"
          :button-texts="['到左边', '到右边']"
          :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
          v-model="value2"
          :data="data2">
        </el-transfer>
      </div>
    </div>
    <div style="white-space: pre-wrap; max-height: 400px; overflow: auto; display: inline-block; width: 100%;">
      <hr v-if="curd != ''" style="border: 2px solid #eee; padding-top: 0px; margin-bottom: 0px;" />
      {{curd}}
    </div>
  </div> -->
</template>
<script>
import httpClient from 'assets/js/utility/rb-http.factory'
export default {
  props: [
  ],
  data () {
    return {
      form: {
        databaseUrl: 'jdbc:mysql://10.12.70.40:3306/cmdb?useUnicode=true&characterEncoding=utf-8',
        databaseUser: 'root',
        databasePwd: 'root',
        packagePath: 'com.aspire.mirror',
        tableNames: [],
        operator: 'all'
      },
      data2: [],
      value2: [],
      curd: '',
      isConnection: false,
      filterMethod (query, item) {
        return item.pinyin.indexOf(query) > -1
      }
    }
  },
  mounted: function () {
  },
  methods: {
    connection () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.data2 = []
          this.value2 = []
          let self = this
          httpClient.sendRequest({
            method: 'POST',
            data: this.form,
            url: `/develophelp/connection/`
          }).then(function (data) {
            self.isConnection = true
            data.forEach(item => {
              self.data2.push({
                label: item,
                key: item,
                pinyin: item
              })
            })
          })
        } else {
          this.$message.error('请填写完整信息')
          return false
        }
      })
    },
    download () {
      if (this.value2.length === 0) {
        this.$message.error('请先选择需要操作的表')
        return
      }
      this.form.tableNames = this.value2
      httpClient.sendRequest({
        method: 'POST',
        data: this.form,
        url: `/develophelp/downloadBeans/`,
        responseType: 'arraybuffer'
      }).then(function (data) {
        const blob = new Blob([data])
        const fileName = 'javabean.zip'
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE10
          navigator.msSaveBlob(blob, fileName)
        } else {
          //  chrome/firefox
          let aTag = document.createElement('a')
          aTag.download = fileName
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          URL.revokeObjectURL(aTag.href)
        }
      })
    },
    generatorCurd () {
      const _this = this
      if (_this.value2.length === 0) {
        this.$message.error('请先选择需要操作的表')
        return
      }
      this.form.tableNames = this.value2
      httpClient.sendRequest({
        method: 'POST',
        data: this.form,
        url: `/develophelp/generator/curd/`
      }).then(function (data) {
        _this.curd = data
        console.log(_this.curd)
      })
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.btn-wrap {
  .el-button {
    margin-bottom: 15px;
  }
}
</style>
