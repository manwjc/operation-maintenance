<template>
  <div id="addmodule">
    <div style="padding:0px 0px 10px 0px;text-align:center;"></div>
    <el-form :model="formmodule" :rules="formRules" ref="formmodule" label-width="85px">
      <el-form-item label="选择分组:" prop="parentId" required>
        <el-select v-model="formmodule.parentId" :disabled="parentForm.state==='edit' || parentForm.state==='copy'" placeholder="请选择模型所属分组:" @change="getChangeParent">
          <el-option v-for="(option,index) in moduleoptions" :key="index" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型名称:" prop="name" required>
        <el-select v-model="formmodule.name">
          <el-option v-for="(item, index) in moduleLists"
                    :label="item.dictCode" :key="index" :value="item.dictCode">
          </el-option>
        </el-select>
        <!--<el-input v-model="formmodule.name" placeholder="请输入类型名称（中、英文）"></el-input>-->
      </el-form-item>
      <el-form-item label="类型编号:" prop="code" required>
        <el-input style="width: 178px" v-model="formmodule.code" :disabled="parentForm.state==='edit'" placeholder="请输入类型编号（数字、字母、下划线）"></el-input>
      </el-form-item>
      <!--<el-form-item label="采集周期:" prop="collectCycle" :rules="[{min: 1, max: 3, message: '不超过3位数', trigger: 'blur'},{ pattern: /^[1-9][0-9]*$/, message: '请输入大于1正整数', trigger: 'blur' }]">-->
        <!--<el-input style="width: 30%" v-model="formmodule.collectCycle" placeholder="采集周期"></el-input>&nbsp;天-->
      <!--</el-form-item>-->
      <el-form-item label="模型标签:">
        <el-tag v-for="(tag,index) in formmodule.tags" :key="index" :closable="true" :close-transition="false"
                @close="handleCloseTag(tag)">{{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
                  @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 点击新增</el-button>
      </el-form-item>
      <el-form-item label="模型图标:" prop="iconUrl" required>
        <div class="btnIcon" @click="selectIcon">
          <span :class="{dis:icondisplay}">选择图标</span>
          <div :class="{dis:!icondisplay}" style="background:#1d6aa7;border-radius:3px;">
            <img width="30" height="30" :src="formmodule.iconUrl"/>
            <div style="position: absolute;padding: 0 7px;height:20px;line-height:20px;top:43px;">修改图标</div>
          </div>
        </div>
      </el-form-item>
      <div style="text-align: center;">
        <el-button @click="cancel">取消</el-button>
        <el-button  @click="resetForm('formmodule')">重置</el-button>
        <el-button type="primary" @click="onSubmit('formmodule')">提交</el-button>
        <el-button @click="next(undefined)" v-if="parentForm.state !== 'add' && parentForm.state !== 'copy'" type="primary" >下一步</el-button>
      </div>
    </el-form>
    <el-dialog v-loading="loading" :visible.sync="iconDialog" v-if="iconDialog" class="iconDialog" @close="iconDialogClose">
      <el-tabs v-model="activeName">
        <el-tab-pane label="系统图标库" name="sysicon">
          <div class="sysicon">
            <li v-for="(item,index) in sysicons" :key="index" :class="{liactive:activeIcon==item.id}" class="iconlist"
                v-on:click="iconClick(item)">
              <img width="30" height="30" :src="item.iconUrl"/>
              <i :class="{active:activeIcon==item.id,nactive:activeIcon!=item.id}" class="fa fa-check-circle"></i></li>
            <!--解决浮动之后无法撑开外层div的问题-->
            <div style="clear:both;"></div>
          </div>
          <el-pagination style="clear:both;margin-top:20px;"
                         :page-size="cuspage.pageSize"
                         @current-change="getSysIcons"
                         :current-page.sync="syspage.currPage"
                         layout="prev, pager, next, jumper"
                         :total="syspage.total">
          </el-pagination>
          <div style="text-align:center;margin-top:20px;">
            <el-button type="primary" @click="iconcommit" :disabled="!btn_active">确定</el-button>
            <el-button @click="iconCancel">取消</el-button>
          </div>
        </el-tab-pane>
        <!--<el-tab-pane label="自定义图标库" name="cusicon">-->
          <!--<div class="uploadicon">-->
            <!--<el-upload class="upload-demo" action="/v1/cmdb/icon/uploadIcon" :on-error="uploadError"-->
                       <!--:on-success="uploadSuccess" accept="image/jpeg,image/png" :headers="headers">-->
              <!--<el-button size="small" type="primary">上传图标</el-button>-->
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过200kb</div>-->
            <!--</el-upload>-->
          <!--</div>-->
          <!--<div class="sysicon" v-model="customicons">-->
            <!--<li v-for="item in customicons" :key="item.id" :class="{liactive:activeIcon==item.id}" class="iconlist"-->
                <!--v-on:click="iconClick(item)">-->
              <!--<img width="30" height="30" :src="item.iconUrl"/>-->
              <!--<i :class="{active:activeIcon==item.id,nactive:activeIcon!=item.id}" class="fa fa-check-circle"></i></li>-->
            <!--&lt;!&ndash;解决浮动之后无法撑开外层div的问题&ndash;&gt;-->
            <!--<div style="clear:both;"></div>-->
          <!--</div>-->


          <!--<el-pagination style="clear:both;margin-top:20px"-->
                         <!--:page-size="cuspage.pageSize"-->
                         <!--@current-change="getCustomIcons"-->
                         <!--:current-page.sync="cuspage.currPage"-->
                         <!--layout="prev, pager, next, jumper"-->
                         <!--:total="cuspage.total">-->
          <!--</el-pagination>-->
          <!--<div style="text-align:center;margin-top:20px;">-->
            <!--<el-button type="primary" @click="iconcommit" :disabled="!btn_active">确定</el-button>-->
            <!--<el-button @click="iconCancel">取消</el-button>-->
          <!--</div>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
  import $ from 'jquery'
  import rbCmdbModuleServiceFactory from 'src/services/cmdb/rb-cmdb-module-service.factory.js'
  import rbCmdbConfigDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'

  export default {
    name: 'baseField',
    props: ['parentForm'],
    data () {
      var checkName = (rule, val, callback) => {
        let reg = /^[\u4e00-\u9fa5\sa-zA-Z]+$/
        if (!reg.test($.trim(val))) {
          return callback(new Error('输入有误，名称为中文、英文'))
        }
        rbCmdbModuleServiceFactory.getModuleSelective({'name': $.trim(val)}).then((data) => {
          if (data.length > 0) {
            return callback(new Error('抱歉，该类型名称已被占用!'))
          }
          callback()
        })
      }
      var checkCode = (rule, val, callback) => {
        var reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
        if (!reg.test($.trim(val))) {
          return callback(new Error('编号首字符必须为字母(数字，字母，下划线)'))
        }
        rbCmdbModuleServiceFactory.getModuleSelective({'code': $.trim(val)}).then((data) => {
          if (data.length > 0) {
            return callback(new Error('抱歉，该类型编号已被占用!'))
          }
          callback()
        })
      }
      var checkiconUrl = (rule, val, callback) => {
        if (this.formmodule.iconUrl === '') {
          return callback(new Error('请选择图标！'))
        }
        callback()
      }
      return {
        formmodule: {
          id: '',
          parentId: '',
          name: '',
          code: '',
          iconUrl: '',
          collectCycle: null,
          collectUnit: '天',
          tags: []
        },
        defaultformmodule: {
          parentId: '',
          name: '',
          code: '',
          iconUrl: ''
        },
        moduleoptions: [],
        activeName: 'sysicon',
        iconDialog: false,
        syspage: {
          currPage: 1,
          pageSize: 27,
          total: 0
        },
        cuspage: {
          currPage: 1,
          pageSize: 27,
          total: 0
        },
        moduletags: [],
        inputVisible: false,
        loading: false,
        inputValue: '', // 标签域输入值
        beforeValue: '', // 记录标签域上次输入值，以便校验
        sysicons: [], // 系统图标库
        customicons: [], // 自定义图标库
        currSelectIcon: '', // 当前选中的图标
        moduleLists: [],
        moduleMap: {},
        icondisplay: false,
        formRules: {
          parentId: [{
            required: true,
            message: '请选择模型所属分组',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入类型名称',
            trigger: 'blur'
          }, {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'blur'
          }, {
            validator: this.parentForm.state === 'edit' ? '' : checkName,
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '请输入类型编号',
            trigger: 'blur'
          }, {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'blur'
          }, {
            validator: this.parentForm.state === 'edit' ? '' : checkCode,
            trigger: 'blur'
          }],
          iconUrl: [{
            validator: checkiconUrl,
            trigger: 'change'
          }]
        },
        activeIcon: '',
        btn_active: false,
        headers: {
        }
      }
    },
    watch: {
    },
    mounted: function () {
      this.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
      this.formmodule = this.parentForm.baseFields
      if (this.parentForm.state === 'edit') {
        let baseFields = this.parentForm.baseFields
        this.icondisplay = true
        this.btn_active = true
        this.getModuleTags(baseFields.id)
      }
      this.getParentModule()
    },
    methods: {
      getChangeParent () {
        this.formmodule.name = ''
        this.getDictModuleList()
      },
      getDictModuleList () {
        let obj = {
          'pageNum': 1,
          'startPageNum': 0,
          'pageSize': 999999,
          'dictCode': null,
          'dictNote': null,
          'colName': 'device_type',
          'pcode': this.moduleMap[this.formmodule.parentId].name
        }
        rbCmdbConfigDictServiceFactory.listDictByPage(obj).then((res) => {
          this.moduleLists = res.data
          // this.formmodule.name = ''
        })
      },
      next (val) {
        if (!val) {
          val = 2
        }
        this.$emit('next', val)
      },
      showFullScreenLoading (state) {
        this.loading = this.$loading({
          lock: true,
          text: state === 'loading' ? '正在拼命加载数据...' : '提交数据中请稍候...',
          spinner: 'el-icon-loading'
        })
      },
      cancel () {
        this.resetForm('formmodule')
        this.$emit('setShow', false)
      },
      getModuleTags (moduleId) {
        rbCmdbModuleServiceFactory.getModuleTags(moduleId).then((data) => {
          data.forEach(item => {
            this.formmodule.tags.push(item.tag)
          })
        })
      },
      getParentModule () {
        this.showFullScreenLoading('loading')
        rbCmdbModuleServiceFactory.getModuleTree().then((data) => {
          data.forEach(item => {
            this.moduleoptions.push(item)
            this.$set(this.moduleMap, item.id, item)
          })
          if (this.parentForm.state === 'edit' || this.parentForm.state === 'copy') {
            this.getDictModuleList()
          }
          this.loading.close()
        }).catch(() => {
          this.loading.close()
        })
      },
      selectIcon () {
        this.iconDialog = true
        this.getSysIcons()
        this.getCustomIcons()
      },
      // 获取系统图标
      getSysIcons () {
        this.loading = true
        let params = {
          'pageNumber': this.syspage.currPage,
          'pageSize': this.syspage.pageSize
        }
        let body = {
          'iconcategory': 0 // 获取系统图标
        }
        rbCmdbModuleServiceFactory.getIcons(params, body).then((data) => {
          if (data && data.dataList.length > 0) {
            this.sysicons = data.dataList
            if (this.formmodule.iconUrl !== '') {
              this.sysicons.forEach((item, index) => {
                if (item.iconUrl === this.formmodule.iconUrl) {
                  this.activeIcon = item.id
                }
              })
            }
            this.syspage.currPage = data.pageNo
            this.syspage.total = data.total
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
          this.$notify({
            title: '提示',
            message: '加载图标失败',
            type: 'error',
            duration: 3000
          })
        })
      },
      sysCurrentChange (val) {
        this.syspage.currPage = val
        this.getSysIcons()
      },
      cusCurrentChange (val) {
        this.cuspage.currPage = val
        this.getCustomIcons()
      },
      // 获取自定义图标
      getCustomIcons () {
        let params = {
          'pageNumber': this.syspage.currPage,
          'pageSize': this.syspage.pageSize
        }
        let body = {
          'iconcategory': 0 // 获取系统图标
        }
        rbCmdbModuleServiceFactory.getIcons(params, body).then((data) => {
          if (data && data.dataList.length > 0) {
            this.customicons = data.dataList
            this.cuspage.currPage = data.pageNo
            this.cuspage.total = data.total
          }
        })
      },
      handleCloseTag (tag) {
        this.formmodule.tags.splice(this.formmodule.tags.indexOf(tag), 1)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (this.formmodule.tags.length > 0 && this.formmodule.tags.indexOf(inputValue) !== -1) {
          this.$notify({
            title: '提示',
            message: '标签名称已经存在',
            type: 'warning',
            duration: 3000
          })
          return
        }
        if ($.trim(inputValue).length > 20) {
          this.$notify({
            title: '提示',
            message: '标签名称必须小于20个字符',
            type: 'warning',
            duration: 3000
          })
          return
        }
        if (inputValue) {
          this.formmodule.tags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      uploadError () {
        this.$notify({
          title: '提示',
          message: '图标上传失败',
          type: 'error',
          duration: 3000
        })
      },
      uploadSuccess (response, file, fileList) {
        if (response.success) {
          this.getCustomIcons()
          this.$notify({
            title: '提示',
            message: '图标上传成功',
            type: 'success',
            duration: 3000
          })
        } else {
          this.$notify({
            title: '提示',
            message: '图标上传失败',
            type: 'error',
            duration: 3000
          })
        }
      },
      iconClick (item) {
        this.activeIcon = item.id
        this.currSelectIcon = item.iconUrl
        this.btn_active = true
      },
      // 确定选择的图标
      iconcommit () {
        this.formmodule.iconUrl = this.currSelectIcon
        this.iconDialog = false
        this.icondisplay = true
      },
      // 图标选择Dialog 取消按钮
      iconCancel () {
        this.iconDialog = false
      },
      // iconDialog关闭时的
      iconDialogClose () {
        this.currSelectIcon = ''
        this.syspage.currPage = 1
        this.cuspage.currPage = 1
        this.activeIcon = null
        this.btn_active = false
      },
      validForm () {
        let flag = false
        this.$refs['formmodule'].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
      // 提交表单数据
      onSubmit (formName) {
        if (!formName) {
          formName = 'formmodule'
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let title = ''
            switch (this.parentForm.state) {
              case 'add': title = '添加模型？'
                break
              case 'edit': title = '更新模型？'
                break
              case 'copy': title = '克隆模型？'
            }
            this.$confirm('确认' + title).then(() => {
              this.showFullScreenLoading('submit')
              if (this.parentForm.state === 'edit') {
                let data = {
                  'id': this.formmodule.id,
                  'name': this.formmodule.name,
                  'iconUrl': this.formmodule.iconUrl,
                  'tags': this.formmodule.tags
                }
                rbCmdbModuleServiceFactory.updateModule(data).then((data) => {
                  if (data.success) {
                    this.$notify({
                      title: '提示',
                      message: '更新成功',
                      type: 'success',
                      duration: 3000
                    })
                    this.next()
                  } else {
                    this.$notify({
                      title: '提示',
                      message: '更新失败',
                      type: 'error',
                      duration: 3000
                    })
                  }
                  this.loading.close()
                }).catch((e) => {
                  this.loading.close()
                  this.$notify({
                    title: '提示',
                    message: '更新失败',
                    type: 'error',
                    duration: 3000
                  })
                })
              } else if (this.parentForm.state === 'add' || this.parentForm.state === 'copy') {
                let data = {
                  'name': this.formmodule.name,
                  'code': this.formmodule.code,
                  'id': this.formmodule.id,
                  'parentId': this.formmodule.parentId,
                  'iconUrl': this.formmodule.iconUrl,
                  'tags': this.formmodule.tags
                }
                rbCmdbModuleServiceFactory.addModule(data).then((data) => {
                  this.formmodule.id = data.module.id
                  this.loading.close()
                  if (data.success) {
                    this.$notify({
                      title: '提示',
                      message: '创建成功',
                      type: 'success',
                      duration: 3000
                    })
                    // 重置表单
                    this.resetForm('formmodule')
                    // // 向父组件传递参数
                    if (this.parentForm.state === 'copy') {
                      this.next(1)
                    } else {
                      this.next(2)
                    }

                    // this.$emit('addModuleData', [data.module])
                  } else {
                    this.$notify({
                      title: '提示',
                      message: data.message,
                      type: 'error',
                      duration: 3000
                    })
                  }
                }).catch((e) => {
                  this.loading.close()
                  this.$notify({
                    title: '提示',
                    message: '添加失败',
                    type: 'error',
                    duration: 3000
                  })
                })
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        if (!formName) {
          formName = 'formmodule'
        }
        this.$refs[formName].resetFields()
        this.icondisplay = false
        this.currSelectIcon = ''
        this.moduletags = []
      }
    }
  }
</script>
<style scoped>
  #addmodule {
    width: 400px;
    margin: 0 auto;
  }

  #addmodule .el-tag {
    margin-left: 10px;
  }

  .input-new-tag {
    width: 78px;
    margin-left: 10px;
    vertical-align: bottom;

  }

  .button-new-tag {
    margin-left: 10px;
    height: 24px;
    line-height: 22px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .dis {
    display: none;
  }

  .btnIcon {
    width: 60px;
    height: 60px;
    border: 1px dashed #d1dbe5;
    font-size: 12px;
    color: #48576a;
    line-height: 60px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
  }

  .sysicon .active {
    display: block;
    color: #6adc71;
    float: right;
  }

  .sysicon .liactive {
    background: #1681c4;
    border-radius: 10px;
  }

  .sysicon .nactive {
    display: none;
  }

  .iconDialog .el-dialog__body {
  }

  .iconDialog .el-tabs {
  }

  .sysicon {
    background-color: #1d6aa7;
    border-radius: 5px;
    cursor: pointer;
    padding: 0px 0px 10px 0px;
  }

  .sysicon li:hover {
    border-radius: 10px;
    background: #1681c4;;
  }

  .sysicon .iconlist {
    padding: 10px;
    float: left;
    width: 40px;
    height: 40px;
    list-style-type: none;
    margin: 10px 0px 0px 10px;
  }
</style>
