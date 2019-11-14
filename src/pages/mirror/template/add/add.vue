<template>
  <div class="component-container">
    <router-view></router-view>
    <div class="body-container">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写模板信息">
        </el-step>
        <el-step title="设置巡检项">
        </el-step>
        <el-step title="配置对象或触发器">
        </el-step>
      </el-steps>

      <div v-show="active == 0 ? true:false" class="stepOne">
        <el-form :model="newTemplate" :rules="rules1" ref="ruleform1">
          <el-form-item prop="name" label="模板名称：" class="add-tit" label-width="93px">
            <el-input v-model="newTemplate.name" placeholder="请输入内容" class="add-con"></el-input>
          </el-form-item>
          <el-form-item prop="description" label="模板描述：" class="add-tit" label-width="93px">
            <el-input v-model="newTemplate.description" placeholder="请输入内容" class="add-con"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="巡检类型：" class="add-tit" label-width="93px">
            <el-select v-model="newTemplate.type" placeholder="请选择" class="list-sel add-con" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mon_type" label="模板类型：" class="add-tit" label-width="93px">
            <el-select v-model="newTemplate.mon_type" placeholder="请选择" class="list-sel add-con" :disabled="disableTem">
              <el-option key="1" label="系统" value="1"></el-option>
              <el-option key="2" label="业务" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="object_ids" label="关联对象：" class="add-tit" label-width="93px" v-if="newTemplate.mon_type === '2'">
            <el-select v-model="newTemplate.object_ids" placeholder="请选择" class="list-sel add-con" filterable clearable>
              <el-option
                v-for="item in biz_sys_options"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="sys_type" label="系统类型：" class="add-tit" label-width="93px">
            <el-select v-model="newTemplate.sys_type" placeholder="请选择" class="list-sel add-con" clearable>
              <el-option
                v-for="item in sys_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <footer>
          <el-button class="nextStep" type="primary" @click="next">下一步</el-button>
          <!-- <el-button class="reset" type="primary">重置</el-button> -->
        </footer>
      </div>

      <div class="add-table" v-show="active == 1 ? true:false">
        <div style="" class="add-button">
          <div class="add-table-tit">巡检项设置：</div>
          <el-button class="item-related" type="primary" @click="relateItems" style="width:100px">监控项关联</el-button>
          <!-- <el-button class="item-add" type="primary" @click="addItems">新增</el-button> -->
          <el-button class="item-del" type="primary" @click="delteItems">删除</el-button>
        </div>
        <div v-if="newTemplate.mon_type ==='1'">
          <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top:15px"
            @selection-change="changMonitorItems">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="巡检项名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="key"
              label="监控项key"
              align="center">
            </el-table-column>
            <el-table-column
              prop="value_type"
              label="数据类型"
              align="center"
              :formatter="formatterValueType">
            </el-table-column>
            <el-table-column
              prop="units"
              label="数据单位"
              align="center">
            </el-table-column>
            <el-table-column
              prop="expression"
              label="判断符"
              align="center">
              <template slot-scope="scope">
                <el-select v-model="tableData[scope.$index].expression" placeholder="请选择" class="add-exp">
                  <el-option
                    v-for="item in selExpression(tableData[scope.$index].value_type)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="match"
              label="匹配值"
              align="center">
              <template slot-scope="scope">
                <el-input class="add-exp dom" v-model="tableData[scope.$index].match"  @blur="check(scope.$index, tableData[scope.$index])"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else>
          <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top:15px"
            @selection-change="changMonitorItems">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="巡检项名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="key"
              label="监控项key"
              align="center">
            </el-table-column>
            <el-table-column
              prop="value_type"
              label="数据类型"
              align="center"
              :formatter="formatterValueType">
            </el-table-column>
            <el-table-column
              prop="units"
              label="数据单位"
              align="center">
            </el-table-column>
          </el-table>
        </div>
        <footer>
          <el-button class="prevStep" type="primary" @click="prev">上一步</el-button>
          <el-button class="nextStep" type="primary" @click="next">下一步</el-button>
        </footer>
      </div>

			<div class="add-device" v-show="active == 2 ? true:false">
        <div v-if="newTemplate.mon_type === '1'">
          <div style="" class="device">
              <div class="add-device-tit">巡检对象设置：</div>
              <el-button class="device-add" type="primary" @click="addevices">新增</el-button>
              <el-button class="device-del" type="primary" @click="delteDevices">删除</el-button>
          </div>
          <div class="add-table-tit" style="margin-top:15px">已选设备：</div>
          <el-table
              :data="hosts"
              border
              style="margin-top:20px"
              @selection-change="changDevicesItems">
              <el-table-column
                type="selection"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name"
                label="设备ip地址"
                align="center">
              </el-table-column>
          </el-table>
          <footer>
              <el-button class="prevStep" type="primary" @click="prev">上一步</el-button>
              <el-button class="nextStep" type="primary" @click="next">完成</el-button>
          </footer>
        </div>
        <div v-else class="biz-tem">
          <div style="" class="device">
            <div class="add-device-tit">触发器设置：</div>
            <el-button class="device-add" type="primary" @click="addTrigger()">新增</el-button>
            <el-button class="device-del" type="primary" @click="delteTrigger()">删除</el-button>
          </div>
          <el-table
              :data="triggerData"
              border
              style="margin-top:20px;"
              @selection-change="changeTrigger">
              <el-table-column
                type="selection"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name"
                label="触发器名称"
                align="center">
                <template slot-scope="scope">
                  <el-input class="dom" v-model="triggerData[scope.$index].name"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="priority"
                label="触发器等级"
                align="center">
                <template slot-scope="scope">
                  <el-select v-model="triggerData[scope.$index].priority" placeholder="请选择" class="add-exp">
                    <el-option
                      v-for="item in trigger_options.trigger_level"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="item_id"
                label="监控项/表达式"
                align="center">
                <template slot-scope="scope">
                  <el-select v-model="triggerData[scope.$index].item_id" placeholder="请选择" class="add-exp" filterable>
                    <el-option
                      v-for="item in tableData"
                      :key="item.item_id"
                      :label="item.name"
                      :value="item.item_id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="expression"
                label="表达式"
                align="center">
                <template slot-scope="scope">
                  <el-input class="dom" v-model="triggerData[scope.$index].expression"></el-input>
                  <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                    <div slot="content">表达式中可填写指标的key值进行运算。如:指标Key值>1</div>
                    <i class='el-icon-question' style="color: #93D0F7;font-size:20px;position: relative;top: 2px;"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
          </el-table>
          <footer>
              <el-button class="prevStep" type="primary" @click="prev">上一步</el-button>
              <el-button class="nextStep" type="primary" @click="next">完成</el-button>
          </footer>
        </div>
    </div>

      <el-dialog title="新增监控项" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="ruleform" v-if="dialogFormVisible">
          <el-form-item label="监控项名称：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" auto-complete="off" class="input"></el-input>
          </el-form-item>
          <el-form-item label="监控项Key：" :label-width="formLabelWidth" prop="key">
            <el-input v-model="form.key" auto-complete="off" class="input"></el-input>
          </el-form-item>
          <el-form-item label="数据类型：" :label-width="formLabelWidth" prop="value_type">
            <el-select v-model="form.value_type" placeholder="" class="input1">
              <el-option
                v-for="item in data_type_option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据单位：" :label-width="formLabelWidth" prop="units">
            <el-input v-model="form.units" auto-complete="off" class="input1"></el-input>
          </el-form-item>
          <el-form-item label="判断符号：" :label-width="formLabelWidth" prop="expression">
            <el-select v-model="form.expression" placeholder="" class="input2">
              <el-option
                v-for="item in expressionList1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="匹配值：" :label-width="formLabelWidth" prop="match">
            <el-input v-model="form.match" auto-complete="off" class="input2"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogN">取 消</el-button>
          <el-button type="primary" @click="dialogY">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {expressionList, expressionStr, expressionNum, typeOptions, data_type} from '../config/options.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import {bizSysList, triggerOptions, sysTypeOptions} from 'src/pages/mirror_business/bizTem/config/options.js'

  export default {
    data () {
      var validatename = (rule, value, callback) => {
        let reg = /[`~!@#$%^&*()_+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——+={}|《》？：“”【】、；‘’，。、]/im
        if (reg.test(value)) {
          callback(new Error('请输入中文英文数字做模板名'))
        } else {
          if (!this.state) {
            rbProjectDataServiceFactory.findTemName(this.newTemplate.name).then((res) => {
              if (res) {
                callback()
              } else {
                callback(new Error('模板名重复'))
              }
            }).catch(() => {
              callback(new Error('网络错误'))
            })
          } else {
            // 当创建之后修改了输入的模板名字后
            if (this.newTemplate.name !== this.template.name) {
              rbProjectDataServiceFactory.findTemName(this.newTemplate.name).then((res) => {
                if (res) {
                  callback()
                } else {
                  callback(new Error('模板名重复'))
                }
              }).catch(() => {
                callback(new Error('网络错误'))
              })
            } else {
              callback()
            }
          }
        }
      }
      var validateType = (rule, value, callback) => {
        if (value === '字符串') {
          this.expressionList1 = expressionStr
          if (this.form.expression === '>' || this.form.expression === '<') {
            this.form.expression = ''
          }
          callback()
        } else if (value === '整数' || value === '浮点数') {
          this.expressionList1 = expressionNum
          if (this.form.expression === 'In') {
            this.form.expression = ''
          }
          callback()
        }
      }
      var validateKey = (rule, value, callback) => {
        let bool = true
        this.tableData.forEach((item) => {
          if (item.key === value) {
            bool = false
          }
        })
        if (!bool) {
          callback(new Error('监控项名称重复'))
        } else {
          callback()
        }
        // let obj = {
        //   key: value
        // }
        // rbProjectDataServiceFactory.getItemList(obj).then((res) => {
        //   if (res.count > 0) {
        //     callback(new Error('该key已存在'))
        //   } else {
        //     callback()
        //   }
        // })
      }
      var validateMoniName = (rule, value, callback) => {
        let bool = true
        this.tableData.forEach((item) => {
          if (item.name === value) {
            bool = false
          }
        })
        if (!bool) {
          callback(new Error('监控项名称重复'))
        } else {
          callback()
        }
        // let obj = {
        //   name: value
        // }
        // rbProjectDataServiceFactory.getItemList(obj).then((res) => {
        //   if (res.count > 0) {
        //     res.result.forEach((item) => {
        //       if (item.name === value) {
        //         callback(new Error('该巡检项名称已存在'))
        //       }
        //     })
        //     callback()
        //   } else {
        //     callback()
        //   }
        // })
      }
      var validateNumber = (rule, value, callback) => {
        if (this.form.value_type === '') {
          callback()
        } else if (this.form.value_type === '字符串') {
          callback()
        } else if (this.form.value_type === '整数') {
          let reg = /^[0-9]*$/
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入整数'))
          }
        } else if (this.form.value_type === '浮点数') {
          let reg = /^[0-9]*\.?[0-9]+$/
          if (reg.test(value)) {
            if (value.length > 1 && value[0] === '0') {
              callback(new Error('请输入正确的浮点数'))
            } else {
              callback()
            }
          } else {
            callback(new Error('请输入正确的浮点数'))
          }
        }
      }
      return {
        // 业务模板新增
        // 已有的触发器列表
        triggerData: [],
        // 选择的触发器列表
        triggerItems: [],
        trigger_options: {},
        biz_sys_options: [],
        sys_type_options: [],
        // 新增状态
        state: false,
        // blur触发新增的对象
        template: {},
        // 第一页的三个值与修改的不一样
        newTemplate: {
          name: '',
          description: '',
          type: '',
          mon_type: '',
          sys_type: '',
          object_ids: ''
        },
        // 步骤管理
        active: 0,
        // 是否禁止选择模板类型
        disableTem: false,
        // 类型的下拉框结果
        // type: '',
        // 类型的选项,
        typeOptions: [],
        // 数据类型字符串数字的下拉框选项
        data_type_option: '',
        // 表达式的下拉框列表
        expressionList: [],
        // 增加时不同的表达式下拉框列表
        expressionList1: [],
        // 选择的监控项
        monitorItems: [],
        // 已有的监控项列表
        tableData: [],
        // expression保存
        expressionSave: {},
        // 选择的主机设备
        devicesItems: [],
        // 已有的主机设备列表
        hosts: [],
        // 新增dialog
        dialogFormVisible: false,
        form: {
          name: '',
          key: '',
          value_type: '',
          units: '',
          expression: '',
          match: ''
        },
        formLabelWidth: '120px',
        rules: {
          name: [
            {required: true, message: '请输入监控项名称', trigger: 'blur'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur'},
            {validator: validateMoniName, trigger: 'blur'}
          ],
          key: [
            {required: true, message: '请输入监控项Key', trigger: 'blur'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur'},
            {validator: validateKey, trigger: 'blur'}
          ],
          units: [
            // { required: true, message: '请输入数据单位', trigger: 'blur' },
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur'}
          ],
          expression: [
            {required: true, message: '请输入判断符号', trigger: 'change'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change'}
          ],
          match: [
            {required: true, message: '请输入数值', trigger: 'blur'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur'},
            {validator: validateNumber, trigger: 'blur'}
          ],
          value_type: [
            {required: true, message: '请输入判断符号', trigger: 'change'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change'},
            {validator: validateType, trigger: 'change'}
          ]
        },
        rules1: {
          name: [
            {required: true, message: '请输入模板名称', trigger: 'blur'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur'},
            {validator: validatename, trigger: 'blur'}
          ],
          description: [
            // { required: true, message: '请输入监控项Key', trigger: 'blur' },
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请输入巡检类型', trigger: 'change'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'change'}
          ],
          mon_type: [
            {required: true, message: '请输入功能类型', trigger: 'change'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'change'}
          ],
          sys_type: [
            {required: true, message: '请输入系统类型', trigger: 'change'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'change'}
          ],
          object_ids: [
            {required: true, message: '请输入关联对象', trigger: 'change'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'change'}
          ]
        }
      }
    },
    computed: {
      // 新增页面新增的巡检项
      // inspectItems () {
      //   return this.$store.state.homeStore.inspectItems
      // },
      // devices () {
      //   return this.$store.state.homeStore.devices
      // }
      batchState () {
        return this.$store.state.homeStore.batch
      },
      temState () {
        return this.$store.state.homeStore.temState
      }
    },
    methods: {
      changeTrigger (val) {
        this.triggerItems = val
      },
      changMonitorItems (val) {
        this.monitorItems = val
      },
      changDevicesItems (val) {
        this.devicesItems = val
      },
      formatterValueType (row, column) {
        return rbMirrorCommonService.getZbxType(row.value_type)
      },
      next () {
        if (this.active === 0) {
          this.$refs['ruleform1'].validate((valid) => {
            if (valid) {
              if (!this.state) {
                this.newTemplate.fun_type = '2'
                rbProjectDataServiceFactory.creat(this.newTemplate).then((res) => {
                  if (res.template_id) {
                    this.state = true
                    this.template = res
                  }
                }).catch(() => {
                  this.$message({
                    message: '模板创建失败',
                    type: 'error'
                  })
                })
              }
              this.active++
              // this.packDetail()
            } else {
              this.$alert('请正确填写相关选项', '警告', {
                confirmButtonText: '确定'
              })
            }
          })
        } else if (this.active === 1) {
          let result = this.ruleExpression()
          if (result === true) {
            this.active++
          } else if (result === false) {
            this.$alert('请填写所有判断符和匹配值', '警告', {
              confirmButtonText: '确定'
            })
          } else if (result === 1) {
            this.$alert('请按正确格式填写', '警告', {
              confirmButtonText: '确定'
            })
          }
        } else if (this.active === 2) {
          var obj = {}
          if (this.newTemplate.mon_type === '1') {
            obj = {
              'template_id': this.template.template_id,
              'name': this.newTemplate.name,
              'description': this.newTemplate.description,
              'type': this.newTemplate.type,
              'mon_type': this.newTemplate.mon_type,
              'sys_type': this.newTemplate.sys_type,
              'fun_type': '2',
              'trigger_list': this.packSend(this.tableData),
              'object_ids': this.packDev(this.hosts)
            }
          } else {
            if (!this.ruleTrigger()) {
              return
            }
            obj = {
              'template_id': this.template.template_id,
              'name': this.newTemplate.name,
              'description': this.newTemplate.description,
              'type': this.newTemplate.type,
              'mon_type': this.newTemplate.mon_type,
              'sys_type': this.newTemplate.sys_type,
              'object_ids': this.newTemplate.object_ids,
              'fun_type': '2',
              'trigger_list': this.triggerData
            }
          }
          this.$router.push('list')
          rbProjectDataServiceFactory.update(obj).then((res) => {
            if (res.template_id) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
            }
          }).catch(() => {
            this.$message.error('创建失败')
          })
        }
      },
      prev () {
        this.active--
        // this.updateEx()
        // this.active--
      },
      relateItems () {
        this.updateEx()
        this.$store.commit('batchItem', this.template.template_id)
        if (this.newTemplate.mon_type === '1') {
          this.$router.push('add/relateditems')
        } else {
          this.$router.push('add/relateditemsBiz')
        }
      },
      // 模板新增设备
      addevices () {
        this.$store.commit('temDevices', this.hosts)
        this.$router.push('add/addevices')
      },
      delteDevices () {
        this.devicesItems.forEach((item) => {
          let index = this.hosts.indexOf(item)
          this.hosts.splice(index, 1)
        })
      },
      // 巡检项手动新增
      addItems () {
        this.dialogFormVisible = true
        this.expressionList1 = expressionList
      },
      // dialog
      dialogY () {
        this.updateEx()
        // 后台创建时没有expression字段因此用户输入的exp存着
        this.$refs['ruleform'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            // 创建的指标项时没有录进去触发器
            this.creatItem().then((res) => {
              if (res.item_id) {
                // 在本地变量中新增刚才监控项的触发器
                this.$set(this.expressionSave, res.item_id, this.form.expression + ',' + this.form.match)
                this.packDetail()
                this.form = {}
              }
            })
          } else {
            this.$alert('请正确填写相关选项', '警告', {
              confirmButtonText: '确定'
            })
            // this.form = {}
          }
        })
      },
      dialogN () {
        this.dialogFormVisible = false
        this.form = {}
      },
      // 把expression保存进去配合packDe实现表达式本地存储
      updateEx () {
        this.tableData.forEach((item) => {
          for (let i in this.expressionSave) {
            if (i === item.item_id) {
              item.expression = item.expression ? item.expression : ''
              item.match = item.match ? item.match : ''
              this.expressionSave[i] = item.expression + ',' + item.match
            }
          }
        })
      },
      // 每次批量新增进来的巡检项的expression保存进去
      batchEx () {
        this.tableData.forEach((item) => {
          let state = true
          for (let i in this.expressionSave) {
            if (i === item.item_id) {
              state = false
            }
          }
          if (state) {
            this.$set(this.expressionSave, item.item_id, '')
          }
        })
      },
      // 封装接口发送数据
      packCreat (obj) {
        obj.value_type = rbMirrorCommonService.getDaoZbxType(obj.value_type)
        let obj1 = {
          template_id: this.template.template_id
        }
        return Object.assign(obj, obj1)
      },
      // 封装详情每次得到数据后都把保存的表达式渲染出来配合upEX
      packDetail () {
        return this.getDetail().then(() => {
          this.tableData.forEach((item) => {
            // item.value_type = rbMirrorCommonService.getZbxType(item.value_type)
            for (let i in this.expressionSave) {
              if (i === item.item_id) {
                let index = this.expressionSave[i].indexOf(',')
                item.expression = this.expressionSave[i].slice(0, index) ? this.expressionSave[i].slice(0, index) : ''
                item.match = this.expressionSave[i].slice(index + 1) ? this.expressionSave[i].slice(index + 1) : ''
              }
            }
          })
        })
      },
      // 当模板为业务模板时关联监控项
      packDetail1 () {
        this.getDetail().then(() => {
          this.tableData.forEach((item) => {
            item.value_type = rbMirrorCommonService.getZbxType(item.value_type)
          })
        })
      },
      // 封装创建发送数据
      packSend (arr) {
        arr.forEach((item) => {
          // 创建模板时数据封装
          item.expression = item.expression + item.match
        })
        return arr
      },
      // 封装模板创建时设备的发送数据
      packDev (arr) {
        let str = ''
        arr.forEach((item) => {
          str += item.instanceId + ','
        })
        str = str.slice(0, -1)
        return str
      },
      // 巡检项增删改
      creatItem () {
        return rbProjectDataServiceFactory.creatItem(this.packCreat(this.form))
      },

      delteItems () {
        if (this.newTemplate.mon_type === '1') {
          this.monitorItems.forEach((res) => {
            if (this.expressionSave[res.item_id]) {
              delete this.expressionSave[res.item_id]
            }
          })
          this.updateEx()
        }
        let str = ''
        this.monitorItems.forEach((res) => {
          str += res.item_id + ','
        })
        str = str.slice(0, -1)
        rbProjectDataServiceFactory.deleteItem(str).then(() => {
          this.packDetail()
        })
        if (this.newTemplate.mon_type === '2') {
          for (let i = 0; i < this.triggerData.length; i++) {
            if (str.indexOf(this.triggerData[i].item_id) >= 0) {
              this.triggerData.splice(i, 1)
              i--
            }
          }
        }
      },

      // 模板增删改
      getDetail () {
        return rbProjectDataServiceFactory.detail(`${this.template.template_id}`).then((res) => {
          if (res.item_list.length > 0) {
            this.disableTem = true
          } else {
            this.disableTem = false
          }
          this.tableData = res.item_list
        })
      },

      // 封装消除DOMCLASS
      removeClass (index) {
        let match = document.getElementsByClassName('dom')
        if (match[index].getAttribute('class').indexOf('warn') >= 0) {
          let class_name = match[index].getAttribute('class')
          class_name = class_name.replace(' warn', '')
          match[index].setAttribute('class', class_name)
        }
      },
      // 匹配值判断
      check (index, item) {
        if (item.value_type === '整数') {
          let reg = /^[0-9]*$/
          if (reg.test(item.match)) {
            this.removeClass(index)
          }
        } else if (item.value_type === '浮点数') {
          let reg = /^[0-9]*\.?[0-9]+$/
          if (reg.test(item.match)) {
            if (item.match.length > 1 && item.match[0] === '0') {
            } else {
              this.removeClass(index)
            }
          }
        }
      },
      // 校验巡检项阀值输入
      ruleExpression () {
        if (this.newTemplate.mon_type === '2') {
          return true
        }
        let bool = true
        let match = document.getElementsByClassName('dom')
        if (this.tableData.length > 0) {
          this.tableData.forEach((item, index) => {
            if (!item.match || !item.expression) {
              bool = false
            } else {
              if (item.value_type === '整数') {
                let reg = /^[0-9]*$/
                if (reg.test(item.match)) {

                } else {
                  bool = 1
                  if (match[index].getAttribute('class').indexOf('warn') < 0) {
                    match[index].className += ' warn'
                  }
                }
              } else if (item.value_type === '浮点数') {
                let reg = /^[0-9]*\.?[0-9]+$/
                if (reg.test(item.match)) {
                  if (item.match.length > 1 && item.match[0] === '0') {
                    bool = 1
                    if (match[index].getAttribute('class').indexOf('warn') < 0) {
                      match[index].className += ' warn'
                    }
                  }
                } else {
                  bool = 1
                  if (match[index].getAttribute('class').indexOf('warn') < 0) {
                    match[index].className += ' warn'
                  }
                }
              }
            }
          })
          return bool
        } else {
          return bool
        }
      },
      selExpression (str) {
        if (str === '字符串') {
          return expressionStr
        } else {
          return expressionNum
        }
      },
      // 业务模板新增方法
      addTrigger () {
        this.triggerData.push({
          name: '',
          priority: '',
          item_id: '',
          expression: ''
        })
      },
      delteTrigger () {
        this.triggerItems.forEach((res) => {
          let index = this.triggerData.indexOf(res)
          this.triggerData.splice(index, 1)
        })
      },
      // 触发器校验
      ruleTrigger () {
        let state = 0
        this.triggerData.forEach((item) => {
          if (item.name === '' || item.priority === '' || item.item_id === '' || item.expression === '') {
            state = 1
          }
          // else {
          //   let bool = false
          //   this.tableData.forEach((res) => {
          //     if (item.expression.indexOf(res.key) >= 0) {
          //       bool = true
          //     }
          //   })
          //   if (!bool) {
          //     state = 2
          //   }
          // }
        })
        if (state === 1) {
          this.$alert('请将触发器填写完整', '消息', {
            confirmButtonText: '确定'
          })
          return false
        } else {
          return true
        }
        // else if (state === 2) {
        //   this.$alert('表达式需包含指标项key值', '消息', {
        //     confirmButtonText: '确定'
        //   })
        //   return false
        // }
      }
    },
    mounted () {
      this.expressionList = expressionList
      this.expressionList1 = expressionList
      this.typeOptions = typeOptions
      this.data_type_option = data_type
      // 业务模板新增
      this.trigger_options = triggerOptions
      this.biz_sys_options = bizSysList
      this.sys_type_options = sysTypeOptions
    },
    watch: {
      batchState () {
        if (this.$store.state.homeStore.batch) {
          this.getDetail().then(() => {
            if (this.newTemplate.mon_type === '1') {
              this.batchEx()
              this.packDetail()
            }
          })
          this.$store.commit('changeBatch', false)
        }
      },
      temState () {
        if (this.$store.state.homeStore.temState) {
          let arr = this.$store.state.homeStore.temDevi.concat([])
          this.hosts = arr
          this.$store.commit('temDevState', false)
        }
      }
      // 未联调
      // inspectItems () {
      //   var arr = Object.assign(this.$store.state.homeStore.inspectItems, {})
      //   arr.forEach((item) => {
      //     if (this.tableData.indexOf(item) < 0) {
      //       this.tableData.splice(this.tableData.length, 0, item)
      //     }
      //   })
      // },
      // devices () {
      //   var arr = Object.assign(this.$store.state.homeStore.devices, {})
      //   arr.forEach((item) => {
      //     if (this.hosts.indexOf(item) < 0) {
      //       this.hosts.splice(this.hosts.length, 0, item)
      //     }
      //   })
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    header {
      display: flex;
      justify-content: center;
      height: 31px;
      border-bottom: 2px solid #f0f0f0;
    }
    .body-container {
      .stepOne {
        margin-top: 50px;
        text-align: center;
        .add-tit {
          width: 300px;
          margin: 0 auto 22px auto;
        }
        .add-con {
          display: inline-block;
          width: 206px;
          height: 34px;
        }
      }
      .add-table {
        margin-top: 20px;
        padding: 10px;
        .add-table-tit {
          display: inline-block;
        }
        .el-table__body-wrapper {
          .warn {
            border: 1px solid #f56c6c;
            border-radius: 5px;
          }
        }
        .el-button {
          height: 30px;
          width: 80px;
          padding: 8px 15px;
        }
      }
      .add-device {
        margin-top: 20px;
        padding: 10px;
        .add-device-tit {
          display: inline-block;
        }
        .el-button {
          height: 30px;
          width: 80px;
          padding: 8px 15px;
        }
        /deep/ .biz-tem {
          .el-table{
            .el-input{
              width:auto;
            }
          }
        }
      }
    }
    footer {
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-button {
        height: 30px;
        width: 80px;
        padding: 8px 15px;
      }
    }
    .el-dialog {
      .input {
        width: 250px;
      }
      .input1 {
        width: 200px;
      }
      .input2 {
        width: 100px;
      }
    }
  }
</style>
