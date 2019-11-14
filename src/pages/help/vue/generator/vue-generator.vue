<template>
  <div class="component-container">
    <div>
      <div>
        <el-form ref="form"
                 :model="form"
                 label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="数据库连接"
                            :prop="databaseUrl"
                            :key="databaseUrl"
                            :rules="[{required: true, message: '数据库连接不能为空'}]">
                <el-input v-model="form.databaseUrl"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="登录用户"
                            :prop="databaseUser"
                            :key="databaseUser"
                            :rules="[{required: true, message: '登录用户不能为空'}]">
                <el-input v-model="form.databaseUser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="登录密码"
                            :prop="databasePwd"
                            :key="databasePwd"
                            :rules="[{required: true, message: '登录密码不能为空'}]">
                <el-input v-model="form.databasePwd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="文件名称"
                            :prop="packagePath"
                            :key="packagePath"
                            :rules="[{required: true, message: '文件名称不能为空'}]">
                <el-input placeholder="请输入文件名称"
                          v-model="form.packagePath">
                  <template slot="append">.vue</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据表"
                            :prop="tableName"
                            :key="tableName"
                            :rules="[{required: true, message: '数据表不能为空'}]">
                <el-select v-model="form.tableName"
                           placeholder="请选择数据表"
                           @change="getTableColumns"
                           filterable>
                  <el-option v-for="(item, index) in data2"
                             :label="item.name"
                             :value="item.name"
                             :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="!isConnection"
                    :span="8">
              <el-button type="primary"
                         @click="connection()"
                         :disabled="isConnection"
                         size="small">开始连接</el-button>
              <el-button type="info"
                         @click="download()"
                         :disabled="!isConnection"
                         size="small">下载VUE页面</el-button>
            </el-col>
            <el-col v-if="isConnection"
                    :span="8">
              <el-button type="info"
                         @click="connection()"
                         :disabled="isConnection"
                         size="small">开始连接</el-button>
              <el-button type="primary"
                         @click="download()"
                         :disabled="!isConnection"
                         size="small">下载VUE页面</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="需要支持功能"
                            :prop="operator"
                            :key="operator">
                <el-checkbox-group v-model="form.operator">
                  <el-checkbox label="查询列表"
                               disabled></el-checkbox>
                  <el-checkbox label="高级查询"></el-checkbox>
                  <el-checkbox label="查看明细"></el-checkbox>
                  <el-checkbox label="新增"></el-checkbox>
                  <el-checkbox label="修改"></el-checkbox>
                  <el-checkbox label="批量删除"></el-checkbox>
                  <el-checkbox label="批量导入"></el-checkbox>
                  <el-checkbox label="批量导出"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-table v-loading="loading"
              :data="tableColumns"
              stripe
              tooltip-effect="dark"
              border
              style="width: 100%;margin-top:5px;cursor: pointer;">
      <el-table-column type="selection"
                       min-width="20px"
                       align="center"></el-table-column>
      <el-table-column prop="columnName"
                       label="列编码"
                       sortable
                       min-width="80px"></el-table-column>
      <el-table-column prop="columnComment"
                       label="列名称"
                       min-width="120px"></el-table-column>
      <el-table-column prop="showProp"
                       label="显示属性"
                       min-width="120px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.showProp"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="showLabel"
                       label="显示标签"
                       min-width="120px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.showLabel"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="inputType"
                       label="显示表单类型"
                       min-width="80px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.inputType"
                     placeholder="请选择表单类型">
            <el-option label="文本框"
                       value="text"></el-option>
            <el-option label="日期框"
                       value="datepicker"></el-option>
            <el-option label="下拉框"
                       value="listSel"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="bindSource"
                       label="绑定数据源"
                       min-width="80px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.bindSource"
                    v-show="scope.row.inputType==='listSel'"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="needInsert"
                       label="是否显示"
                       min-width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.needShow === 'true'"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="needInsert"
                       label="支持新增"
                       min-width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.needInsert === 'true'"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="needEdit"
                       label="支持修改"
                       min-width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.needEdit === 'true'"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="needImport"
                       label="支持导入"
                       min-width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.needImport === 'true'"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="needExport"
                       label="支持导出"
                       min-width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.needExport === 'true'"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="needSearch"
                       label="查询条件"
                       min-width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.needSearch === 'true'"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import httpClient from 'assets/js/utility/rb-http.factory'
export default {
  props: [
  ],
  data () {
    return {
      loading: false,
      form: {
        databaseUrl: 'jdbc:mysql://10.12.70.40:3306/cmdb?useUnicode=true&characterEncoding=utf-8',
        databaseUser: 'root',
        databasePwd: '1234@qwer',
        packagePath: 'com.aspire.mirror',
        tableName: '',
        operator: ['查询列表', '查看明细', '新增', '修改', '批量删除', '批量导出'],
        tableColumns: []
      },
      data2: [],
      isConnection: false,
      tableColumns: []
    }
  },
  mounted: function () {
  },
  methods: {
    connection () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.data2 = []
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
                name: item
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
      if (!this.form.tableName) {
        this.$message.error('请先选择需要操作的表')
        return
      }
      httpClient.sendRequest({
        method: 'POST',
        data: this.form,
        url: `/develophelp/downloadVue/`,
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
    getTableColumns () {
      const _this = this
      if (!this.form.tableName) {
        this.$message.error('请先选择需要一张表')
        return
      }
      this.loading = true
      httpClient.sendRequest({
        method: 'POST',
        data: this.form,
        url: `/develophelp/connection/columns`
      }).then(function (data) {
        _this.tableColumns = data
        _this.loading = false
      }).catch((data) => {
        _this.loading = false
      })
    }
  },
  watch: {
    tableColumns (val) {
      this.form.tableColumns = val
    }
  }
}
</script>
<style lang="scss" scoped>
.el-transfer-panel {
  width: 260px !important;
}
/deep/ .el-table {
  .el-table__body-wrapper {
    overflow-x: auto !important;
  }
}
/deep/ .el-table td,
/deep/ .el-table th {
  padding: 1px 0;
}
* ::-webkit-scrollbar {
  height: 6px !important;
}
/deep/ .el-row {
  margin-bottom: 0 !important;
}
.el-form-item {
  margin-bottom: 0px !important;
}
</style>
