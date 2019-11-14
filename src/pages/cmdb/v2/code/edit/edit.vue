<template>
  <el-dialog class="yw-dialog" :title="title" :visible.sync="show"  @close="resetDialog" width="700px">
    <section class="yw-dialog-main">
      <el-form ref="codeForm" :model="cmdbCode" class="yw-form is-required" :inline="true" label-position="right" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="filedCode" label="字段编码">
              <el-input v-model="cmdbCode.filedCode" :disabled="codeId !== ''"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="filedName" label="字段名称">
            <el-input v-model="cmdbCode.filedName" :disabled="codeId !== ''"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="codeGroup" label="字段分组">
            <el-select v-model="cmdbCode.codeGroup" placeholder="请选择字段分组" filterable
            @change="changeControlGroup">
              <el-option v-for="(item, index) in groupList" :key="index" :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="customGroup" label="分组名称">
            <el-input v-model="cmdbCode.customGroup" :disabled="!showCustomGroup"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="controlTypeId" label="控件类型">
            <el-select v-model="cmdbCode.controlType.controlId" placeholder="请选择控件类型" filterable
            @change="changeControlType">
              <el-option v-for="(item, index) in controlList" :key="index" :label="item.controlName"
                         :value="item.controlId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="showSourceType">
          <el-form-item prop="bindSourceType" label="数据源类型">
            <el-select v-model="cmdbCode.bindSourceType" placeholder="请选择数据源类型" @change="changeSourceType">
              <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.value"
                         :value="item.name">{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="showCascader">
          <el-form-item prop="refCodeId" label="父码表字段">
            <el-select v-model="cmdbCode.refCode.codeId" placeholder="请选择父码表字段" filterable>
              <el-option v-for="(item, index) in codeList" :key="index" :label="item.filedName"
                         :value="item.codeId">
                <span style="float: left; width: 100px;">{{ item.filedName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.filedCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 显示级联SQL配置 -->
      <el-row v-show="showCascader || showTableSel">
        <el-col :span="24" class="sql-box">
          <el-form-item prop="bindSql" label="SQL配置" style="width: 100% !important;">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 16}" placeholder="请输入查询SQL" v-model="cmdbCode.bindSql"
                      style="width: 100% !important;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 显示表格显示项 -->
      <el-row v-show="showTable" v-for="(column, idx) in bindColumns" :key="idx">
        <el-col :span="12">&nbsp;</el-col>
        <el-col :span="5">
          <el-input v-model="bindColumns[idx]['key']" style="width: 90% !important"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="bindColumns[idx]['value']" style="width: 90% !important"></el-input>
        </el-col>
        <el-col :span="2">
          <i class="el-icon-circle-plus-outline" v-show="showPlus(idx)" style="color: #409eff; font-size:15px;" @click="plus(idx)"></i>
          <i class="el-icon-remove-outline" v-show="showMouse(idx)" style="color: #409eff; font-size:15px;" @click="mouse(idx)"></i>
        </el-col>
      </el-row>
      <!-- 显示字典数据源 -->
      <el-row v-show="showDict">
        <el-col>
          <el-form-item prop="bindSource" label="字典值编码">
            <el-select v-model="cmdbCode.bindSource" placeholder="请选择字典值" filterable>
              <el-option v-for="(item, index) in dictList" :key="index" :label="item.description"
                         :value="item.col_name">
                <span style="float: left; width: 100px;">{{ item.description }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.col_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="codeLength" label="字段长度">
            <el-input v-model="cmdbCode.codeLength"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="codeTip" label="提示信息">
            <el-input v-model="cmdbCode.codeTip"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="isBuiltIn" label="是否内置">
            <el-switch v-model="isBuiltIn" active-text="是" inactive-text="否" active-value="是" inactive-value="否" :disabled="isEditBuiltIn"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isRequire" label="是否必填">
            <el-switch v-model="isRequire" active-text="是" inactive-text="否" active-value="是" inactive-value="否"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="isCollect" label="支持数据采集">
            <el-switch v-model="isCollect" active-text="是" inactive-text="否" active-value="是" inactive-value="否"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="showCollectSource">
        <el-col :span="12">
          <el-form-item prop="collectSource" label="采集数据来源">
            <el-select v-model="cmdbCode.collectSource" placeholder="请选择数据来源" filterable>
              <el-option v-for="(item, index) in collectSourceList" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="collectMapperKey" label="映射来源字段">
            <el-input v-model="cmdbCode.collectMapperKey"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </section>
    <section class="btn-wrap">
      <el-button type="primary"
                 @click="submit()">保存</el-button>
      <el-button @click="resetDialog()">取消</el-button>
    </section>
  </el-dialog>
</template>

<script>
  import cmdbCodeService from 'src/services/cmdb/rb-cmdb-code-services.factory'
  import cmdbDictService from 'src/services/cmdb/rb-configDict-service.factory'
  import moduleService from 'src/services/cmdb/rb-cmdb-module-service.factory'
  import {uniqueCodeByCodeOrName, isEmptyOrInteger} from '../valid/validate.js'
  export default {
    name: 'codeEdit',
    props: ['display', 'codeId'],
    data () {
      return {
        title: this.codeId === '' ? '新增码表' : '修改码表',
        show: this.display,
        groupList: [],
        controlList: [],
        codeList: [],
        showCustomGroup: false,
        showSourceType: false,
        showDict: false,
        showTable: false,
        showTableSel: false,
        showCascader: false,
        showCollectSource: false,
        isEditBuiltIn: false,
        isRequire: '否',
        isBuiltIn: '否',
        isCollect: '否',
        dictList: [],
        collectSourceList: [],
        tableList: [],
        columnsList: [],
        sourceTypeList: [],
        bindSourceType: '',
        bindSource: '',
        showSelectControl: ['listSel', 'multiSel'],
        showTableControl: ['table'],
        showCascaderControl: ['cascader'],
        cmdbCode: {
          codeId: '',
          filedCode: '',
          filedName: '',
          codeGroup: '',
          customGroup: '',
          controlType: {controlId: '', controlCode: ''},
          bindSourceType: '',
          bindSource: '',
          bindTable: '',
          refCode: {codeId: ''},
          bindSql: '',
          codeLength: 40,
          codeTip: '',
          isBuiltIn: '',
          isRequire: '',
          isCollect: '',
          collectSource: '',
          collectMapperKey: '',
          sortIndex: ''
        },
        oldCodeLength: '',
        bindColumns: [{
          'key': '',
          'value': ''
        }],
        rules: {
          filedCode: [
            { required: true, message: '请输入编码', trigger: 'blur' },
            { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '请输入英文字母', trigger: 'blur' },
            { validator: (rule, value, callback) => uniqueCodeByCodeOrName(rule, value, callback, value, this.codeId === '' ? 'insert' : 'update'), trigger: 'blur' }
          ],
          filedName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { validator: (rule, value, callback) => uniqueCodeByCodeOrName(rule, value, callback, value, this.codeId === '' ? 'insert' : 'update'), trigger: 'blur' }
          ],
          customGroup: [],
          codeLength: [{ validator: this.checkCodeLength, trigger: 'blur' }],
          sortIndex: [{ validator: isEmptyOrInteger, trigger: 'blur' }]
        }
      }
    },
    watch: {
      isRequire (val) {
        this.cmdbCode.isRequire = val
      },
      isBuiltIn (val) {
        this.cmdbCode.isBuiltIn = val
      },
      isCollect (val) {
        this.showCollectSource = val === '是'
        this.cmdbCode.isCollect = val
        if (val === '否') {
          this.cmdbCode.collectSource = ''
          this.cmdbCode.collectMapperKey = ''
        }
      }
    },
    methods: {
      checkCodeLength (rule, value, callback) {
        const pattern = /^[1-9]\d*|0$/
        if (value === null || value.toString().trim() === '') {
          return callback(new Error('长度不能为空'))
        }
        if (value && (!pattern.test(value) || (value + '').indexOf('.') > 0)) {
          return callback(new Error('请输入整数'))
        }
        if (value < this.oldCodeLength) {
          return callback(new Error('长度不能小于原长度' + this.oldCodeLength))
        }
        callback()
      },
      resetDialog () {
        this.$refs['codeForm'].resetFields()
        this.$emit('setEditDisplay', false)
      },
      getControlList (callback) {
        let _t = this
        cmdbCodeService.queryCodeControl().then((data) => {
          _t.controlList = data
          if (_t.codeId === '') {
            _t.cmdbCode.controlType.controlId = data[0].controlId
            _t.cmdbCode.controlType.controlCode = data[0].controlCode
          }
          _t.controlList.forEach((item) => {
            if (item.isBindSource === '是') {
              if (_t.showTableControl.indexOf(item.controlCode) === -1 && _t.showCascaderControl.indexOf(item.controlCode) === -1) {
                _t.showSelectControl.push(item.controlCode)
              }
            }
          })
          if (callback) {
            callback()
          }
        }).catch((data) => {
          _t.$message.error('获取控件类型失败')
        })
      },
      getDistinctDictType () {
        let _t = this
        cmdbDictService.getDistinctDictType().then((data) => {
          _t.dictList = data
          _t.bindSource = data[0].description
        }).catch((data) => {
          _t.$message.error('获取字典列表失败')
        })
      },
      getTableList () {
        let _t = this
        if (_t.tableList.length === 0) {
          cmdbCodeService.getTableList().then((data) => {
            _t.tableList = data
          }).catch((data) => {
            _t.$message.error('获取数据表失败')
          })
        }
      },
      queryCodeGroupList () {
        let _t = this
        cmdbCodeService.queryCodeGroupList().then((data) => {
          _t.groupList = data
          _t.groupList.push('其他')
          if (_t.codeId === '') {
            _t.cmdbCode.codeGroup = data[0]
          }
        }).catch((data) => {
          _t.$message.error('获取码表分组失败')
        })
      },
      changeControlGroup (val) {
        if (val === '其他') {
          this.showCustomGroup = true
          this.rules.customGroup = [
            { required: true, message: '请输入分名称', trigger: 'blur' },
            { validator: (rule, value, callback) => uniqueCodeByCodeOrName(rule, value, callback, '', this.codeId === '' ? 'insert' : 'update'), trigger: 'blur' }
          ]
        } else {
          this.showCustomGroup = false
          this.cmdbCode.customGroup = ''
          this.rules.customGroup = []
        }
      },
      clean () {
        this.showDict = false
        this.showTableSel = false
        this.showCascader = false
        this.showTable = false
        this.bindColumns = [{'key': '', 'value': ''}]
        this.showSourceType = false
        this.cmdbCode.refCode.codeId = ''
        this.cmdbCode.bindSource = ''
        this.cmdbCode.bindSourceType = ''
        this.cmdbCode.bindTable = ''
        this.$set(this.cmdbCode, 'bindSql', '')
        this.cmdbCode.controlType.controlCode = ''
      },
      changeControlType (val) {
        this.clean()
        let controlCode
        this.controlList.forEach((item) => {
          if (item.controlId === val) {
            controlCode = item.controlCode
            return false
          }
        })
        this.cmdbCode.controlType.controlCode = controlCode
        // 下拉框类
        if (this.showSelectControl.indexOf(controlCode) > -1) {
          this.selectControl(val)
        }
        // 表格类
        if (this.showTableControl.indexOf(controlCode) > -1) {
          this.showTable = true
        }
        // 联级类
        if (this.showCascaderControl.indexOf(controlCode) > -1) {
          this.showCascader = true
        }
      },
      selectControl (val) {
        let isBindSource = '否'
        this.controlList.forEach((item) => {
          if (item.controlId === val) {
            isBindSource = item.isBindSource
            return false
          }
        })
        this.showSourceType = isBindSource === '是'
        this.cmdbCode.bindSourceType = ''
        if (!this.showSourceType) {
          this.bindSource = ''
        } else {
          this.getDistinctDictType()
        }
      },
      changeSourceType (val) {
        this.toggleSelectShow(val)
      },
      toggleSelectShow (val) {
        if (val === '数据表') {
          this.showTableSel = true
          this.showDict = false
        } else if (val === '数据字典') {
          this.showTableSel = false
          this.showDict = true
        } else {
          this.showTableSel = false
          this.showDict = false
        }
      },
      changeSelectTable (val, callback) {
        let _t = this
        _t.bindColumns = [{'key': '', 'value': ''}]
        cmdbCodeService.getColumnsByTableName(val).then((data) => {
          _t.columnsList = data
          if (callback) {
            callback()
          }
        }).catch((data) => {
          _t.$message.error('获取数据表[' + val + ']列名失败')
        })
      },
      checkSql () {
        let sql = this.cmdbCode.bindSql.toLowerCase()
        let filter = ['delete', 'drop', 'truncate', 'update', 'insert', 'alter']
        let flag = false
        sql.split(' ').forEach((item) => {
          if (filter.indexOf(item) > -1) {
            flag = true
            return false
          }
        })
        if (flag) {
          this.$message.error('SQL中不能包含敏感词[delete, drop, truncate, update, insert, alter等]')
          return false
        }
        if (sql.substring(0, 6).trim() !== 'select') {
          this.$message.error('SQL配置格式不正确, 正确格式如:\n\rselect xx `id`, xx `key`, xxx `value` from table_name ')
          return false
        }
        if (this.showCascaderControl.indexOf(this.cmdbCode.controlType.controlCode) > -1) {
          if (sql.indexOf('\'?\'') === -1) {
            this.$message.error('SQL配置格式不正确, 缺少[?]占位符')
            return false
          }
        }
        sql = sql.substring(6, sql.indexOf('from')).trim()
        let fileds = sql.split(',')
        if (fileds.length !== 3) {
          this.$message.error('SQL配置格式不正确, 正确格式如:\n\rselect xx `id`, xx `key`, xxx `value` from table_name ')
          return false
        }
        if (!this.checkSqlFiled(fileds[0].trim(), '`id`')) {
          return false
        }
        if (!this.checkSqlFiled(fileds[1].trim(), '`key`')) {
          return false
        }
        if (!this.checkSqlFiled(fileds[2].trim(), '`value`')) {
          return false
        }
        return true
//        let _t = this
//        // 检测sql列是否正确
//        cmdbCodeService.checkSql(this.cmdbCode.bindSql).then((checkData) => {
//          console.log(checkData)
//          if (checkData.flag === 'error') {
//            _t.$message.error(checkData.msg)
//            return false
//          } else {
//            return true
//          }
//        })
      },
      checkSqlFiled (filed, key) {
        if (filed.split(' ').length !== 2 && filed.split(' ').length !== 3) {
          this.$message.error('SQL配置格式不正确, 正确格式如:\n\rselect xx `id`, xx `key`, xxx `value` from table_name ')
          return false
        }
        if (filed.split(' ').length === 2 && filed.split(' ')[1] !== key) {
          this.$message.error('SQL配置格式不正确, 正确格式如:\n\rselect xx `id`, xx `key`, xxx `value` from table_name ')
          return false
        }
        if (filed.split(' ').length === 3 && (filed.split(' ')[1] !== 'as' || filed.split(' ')[2] !== key)) {
          this.$message.error('SQL配置格式不正确, 正确格式如:\n\rselect xx `id`, xx `key`, xxx `value` from table_name ')
          return false
        }
        let pattern = /^[a-zA-Z.][a-zA-Z0-9_.]*$/
        if (!pattern.test(filed.split(' ')[0])) {
          this.$message.error('SQL配置格式不正确, [id、key、value]列名只能为字母、数字或下划线')
          return false
        }
        return true
      },
      submit () {
        let _t = this
        // 提交前验证
        if (_t.showSelectControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
          if (!_t.cmdbCode.bindSourceType) {
            _t.$message.error('数据源不能为空')
            return false
          }
          if (_t.cmdbCode.bindSourceType === '数据表') {
            if (!_t.checkSql()) {
              return false
            }
          }
          if (_t.cmdbCode.bindSourceType === '数据字典') {
            if (!_t.cmdbCode.bindSource) {
              _t.$message.error('数据字典不能为空')
              return false
            }
          }
        }
        if (_t.showTableControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
          let flag = true
          let tempArr = []
          _t.bindColumns.forEach((item) => {
            if (tempArr.indexOf(item.key) > -1) {
              flag = false
              return false
            }
            tempArr.push(item.key)
          })
          if (!flag) {
            _t.$message.error('表格表头不能重复')
            return false
          }
          tempArr = []
          _t.bindColumns.forEach((item) => {
            if (tempArr.indexOf(item.value) > -1) {
              flag = false
              return false
            }
            tempArr.push(item.value)
          })
          if (!flag) {
            _t.$message.error('表格列值不能重复')
            return false
          }
        }
        if (_t.showCascaderControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
          if (!_t.cmdbCode.refCode.codeId) {
            _t.$message.error('父码表不能为空')
            return false
          }
          if (!_t.cmdbCode.bindSql) {
            _t.$message.error('SQL配置不能为空')
            return false
          }
          if (!_t.checkSql()) {
            return false
          }
        }
        if (_t.cmdbCode.isCollect === '是') {
          if (!_t.cmdbCode.collectSource) {
            _t.$message.error('采集数据来源不能为空')
            return false
          }
          if (!_t.cmdbCode.collectMapperKey) {
            _t.$message.error('映射采集字段不能为空')
            return false
          }
        }
        if (_t.cmdbCode.isBuiltIn === '是' && _t.codeId === '') {
          _t.$confirm('内置字段创建后,将不允许被修改,是否继续?').then(() => {
            _t.submitData()
          })
        } else {
          _t.submitData()
        }
      },
      submitData () {
        let _t = this
        _t.$refs['codeForm'].validate((valid) => {
          if (valid) {
            if (_t.cmdbCode.customGroup) {
              _t.cmdbCode.codeGroup = _t.cmdbCode.customGroup
            }
            if (_t.showSelectControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
              if (_t.cmdbCode.bindSourceType === '数据表') {
                _t.cmdbCode.bindSource = _t.cmdbCode.bindSql
              }
            }
            if (_t.showTableControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
              _t.cmdbCode.bindSource = JSON.stringify(_t.bindColumns)
            }
            if (_t.showCascaderControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
              _t.cmdbCode.bindSource = _t.cmdbCode.bindSql
            }
            if (_t.cmdbCode.isBuiltIn === '') {
              _t.cmdbCode.isBuiltIn = '否'
            }
            this.$emit('showLoading')
            cmdbCodeService.saveCode(_t.cmdbCode).then((data) => {
              _t.$message.success('保存成功')
              _t.resetDialog()
            }).catch((data) => {
              _t.$message.error('保存失败')
            }).finally(() => {
              this.$emit('hideLoading')
            })
          }
        })
      },
      getSourceTypeList () {
        let _ = this
        moduleService.getDictByColName('code_source_type').then((data) => {
          _.sourceTypeList = data
        }).catch((data) => {
          _.$message.error('获取数据源类型失败')
        })
      },
      getCollectSourceList () {
        let _ = this
        moduleService.getDictByColName('collect_source_type').then((data) => {
          _.collectSourceList = data
        }).catch((data) => {
          _.$message.error('获取采集数据来源失败')
        })
      },
      plus (idx) {
        this.bindColumns.splice(idx + 1, 0, {'key': '', 'value': ''})
      },
      showPlus (idx) {
        return true
      },
      mouse (idx) {
        this.bindColumns.splice(idx, 1)
      },
      showMouse (idx) {
        return (this.bindColumns.length > 1 && idx === 0) || idx > 0
      },
      getCodeList () {
        let _t = this
        cmdbCodeService.queryCodeListFormatByGroup().then((data) => {
          data.forEach((item) => {
            item.codeList.forEach((item2) => {
              _t.codeList.push(item2.cmdbCode)
            })
          })
        }).catch((data) => {
          _t.$message.error('获取码表列表失败')
        })
      }
    },
    mounted: function () {
      this.queryCodeGroupList()
      this.getSourceTypeList()
      this.getCollectSourceList()
      this.getTableList()
      this.getCodeList()
      let _t = this
      this.getControlList(() => {
        if (_t.codeId !== '') {
          this.$emit('showLoading')
          _t.clean()
          cmdbCodeService.getCodeByCodeId(this.codeId).then((data) => {
            _t.isEditBuiltIn = data.isBuiltIn === '是'
            _t.cmdbCode = data
            if (_t.cmdbCode.codeLength === null) {
              _t.cmdbCode.codeLength = 40
              _t.oldCodeLength = 40
            } else {
              _t.oldCodeLength = _t.cmdbCode.codeLength
            }
            if (data.controlType === null) {
              _t.cmdbCode.controlType = { controlId: '' }
            }
            if (_t.showTableControl.indexOf(data.controlType.controlCode) > -1) {
              _t.showTable = true
              _t.bindColumns = JSON.parse(data.bindSource)
            }
            if (_t.showCascaderControl.indexOf(data.controlType.controlCode) > -1) {
              _t.showCascader = true
              _t.$set(_t.cmdbCode, 'bindSql', data.bindSource)
            }
            if (data.bindSourceType && data.bindSourceType !== '') {
              _t.showSourceType = true
              if (data.bindSourceType === '数据表') {
                // 加载数据
                _t.showTableSel = true
                this.showDict = false
                _t.$set(_t.cmdbCode, 'bindSql', data.bindSource)
//                _t.cmdbCode.bindTable = JSON.parse(data.bindSource).table
//                // 加载表格列数据
//                _t.changeSelectTable(_t.cmdbCode.bindTable, () => {
//                  _t.bindColumns = JSON.parse(data.bindSource).columns
//                })
              }
              if (data.bindSourceType === '数据字典') {
                _t.getDistinctDictType()
                this.showDict = true
              }
              _t.toggleSelectShow(data.bindSourceType)
            }
            if (!data.refCode) {
              _t.cmdbCode.refCode = {codeId: ''}
            }
            _t.isRequire = data.isRequire
            _t.isBuiltIn = data.isBuiltIn
            _t.isCollect = data.isCollect
          }).catch((data) => {
            _t.$message.error('查询码表信息失败')
          }).finally(() => {
            this.$emit('hideLoading')
          })
        }
        _t.controlList.forEach((item) => {
          if (item.controlId === _t.cmdbCode.controlType.controlId) {
            _t.cmdbCode.controlType.controlCode = item.controlCode
            return false
          }
        })
        // 下拉框类
        if (_t.showSelectControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
          _t.selectControl(_t.cmdbCode.controlType.controlId)
        }
        // 表格类
        if (_t.showTableControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
          _t.showTable = true
        }
        // 联级类
        if (_t.showCascaderControl.indexOf(_t.cmdbCode.controlType.controlCode) > -1) {
          _t.showCascader = true
        }
      })
    }
  }
</script>
<style lang="scss" scoped>
  .el-row {
    margin-bottom: 5px !important;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
  .el-dialog__body {
    padding-top: 5px !important;
    padding-left: 50px !important;
    padding-right: 50px !important;
    padding-bottom: 20px !important;
  }
  .el-input {
    width: 193px !important;
  }
  /deep/ .sql-box{
    .el-form-item__content {
      width: 79%;
    }
  }
  /deep/ .yw-dialog {
    .yw-dialog-main {
      min-height: 100px;
      max-height: 410px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
