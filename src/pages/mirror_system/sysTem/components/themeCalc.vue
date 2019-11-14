<template>
  <div class="component-container">
    <div class="body-container">
      <div>
        <div class="add-table">
          <div style="" class="add-button">
            <div class="add-table-tit">指标设置：</div>
            <el-button class="item-add" type="primary" @click="addIndex">新增</el-button>
            <el-button class="item-related" type="primary" @click="updateIndex">修改</el-button>
            <el-button class="item-del" type="primary" @click="deleteIndex">删除</el-button>
          </div>
          <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top:15px"
            @selection-change="changeIndex">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="指标名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="key"
              label="key值"
              align="center">
            </el-table-column>
            <el-table-column
              prop="theme_name"
              label="主题数据"
              align="center">
            </el-table-column>
            <el-table-column
              prop="calc_type1"
              label="计算时间点"
              align="center">
            </el-table-column>
            <!-- <el-table-column
              prop="time_interval"
              label="时间间隔"
              align="center">
            </el-table-column> -->
            <!-- <el-table-column
              prop="biz_calc_exp"
              label="计算表达式"
              align="center">
            </el-table-column> -->
          </el-table>
          <footer>
            <el-button class="prevStep" type="primary" @click="prev">上一步</el-button>
            <el-button class="nextStep" type="primary" @click="next">完 成</el-button>
          </footer>
        </div>
      </div>


      <el-dialog title="新增业务指标" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="90%" class="addBiz" :before-close="handleClose">
        <div class="maddid-toThematic">
            <el-row>
              <el-col :span="7">
                 <el-tooltip placement="bottom" effect="light" popper-class="thematicData-debug-help">
                    <div slot="content" >接入主题数据</div>
                    <div style="cursor:pointer;" @click="toThematicClick()">
                      <span class="maddid-step-icon" style="background: #F5F5F5;border: 1px solid #999999;color:#333333;">1</span>
                      <span class="maddid-step-content" style="color:#333333;">主题数据接入</span>
                    </div>
                  </el-tooltip>
              </el-col>
              <el-col :span="10" class="maddid-step-segmenting">
                <div class="maddid-step-segmenting-line"></div>
              </el-col>
              <el-col :span="7">
                <span class="maddid-step-icon">2</span>
                <span class="maddid-step-content">新增业务指标</span>
              </el-col>
            </el-row>
        </div>
        <div style="height:1px;margin:10px 0;padding:0px;background-color:#EEEEEE;"></div>
        <div class="con">
          <el-form ref="business" label-width="100px" label-position="right" :rules="rules" :model="form" style="padding-left:20px;padding-right:20px;">
            <el-row>
              <el-form-item label="指标名称" prop="name" style="padding-left:5px;">
                <el-col :span="24">
                    <el-input v-model="form.name" ></el-input>
                </el-col>
              </el-form-item>
            </el-row>

            <el-row>
                <el-col :span="7">
                    <el-form-item label="Key值" prop="key" style="padding-left:5px;">
                        <el-col :span="24">
                            <el-input v-model="form.key" style="width:89%"></el-input>
                            <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                              <div slot="content">Key值可用于填写触发器表达式</div>
                              <i class='el-icon-question' style="color: #93D0F7;font-size:20px;position: relative;top: 2px;"></i>
                            </el-tooltip>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="17">
                    <el-form-item label="主题数据" prop="biz_theme_id" style="padding-left:5px;">
                        <el-select filterable style="width:326px;"
                            placeholder="请选择主题数据"
                            v-model="form.biz_theme_id"
                            :clearable="true"
                            @change="themeChange()">
                              <el-option
                                v-for="item in theme_data_options"
                                :key="item.theme_id"
                                :label="item.theme_name"
                                :value="item.theme_id">
                              </el-option>
                        </el-select>
                        <span v-if="theme_data_options.length > 0" style="cursor:pointer;margin-left:20px;font-size: 12px;color: #46BAFE;">主题来自：{{theme_data_options[0].biz_name}}业务系统</span>
                        <span v-else style="cursor:pointer;margin-left:20px;font-size: 12px;color: #46BAFE;">该业务系统暂无主题数据,需接入主题数据</span>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
               <el-col :span="7">
                  <el-form-item label="计算时间点"  style="padding-left:5px;">
                    <el-radio  v-model="form.calc_type" label="1" @change="calcTypeChange()">数据到达时</el-radio>
                    <el-radio  v-model="form.calc_type" label="2" @change="calcTypeChange()">周期性</el-radio>
                    <el-radio  v-model="form.calc_type" label="3" @change="calcTypeChange()">第三方调用</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="2" v-show="form.calc_type === '1' || form.calc_type === '3' ? false : true">
                    <el-form-item label="每" prop="cycle_value" style="float:left;" class="mei">
                      <el-input placeholder="请输入" v-model="form.cycle_value" style="width: 80px;margin:0 5px;" ref="time_input">
                      </el-input>
                    </el-form-item>
                </el-col>
                <el-col style="width:auto" v-show="form.calc_type === '1' || form.calc_type === '3' ? false : true">
                  <el-form-item  prop="cycle_type">
                    <el-select style="width:222px;height: 30px;"
                      placeholder="分/小时/天"
                      v-model="form.cycle_type"
                      :clearable="true" class="inputClass" @change="timeChange()">
                        <el-option key="1" label="分" value="1"></el-option>
                        <el-option key="2" label="小时" value="2"></el-option>
                        <el-option key="3" label="天" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-checkbox v-model="form.biz_is_zero" class="checkbox" true-label="0" false-label="1">
                      <span >空值监控</span>
                      <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                        <div slot="content" >在周期扫描范围内，统计该范围内无业务方上报数据时，勾选代表需要监控，会以0值代替，不勾选则为空值不做监控处理 </div>
                        <i class='el-icon-question' style="color: #93D0F7;font-size:16px;vertical-align: text-top;"></i>
                      </el-tooltip>
                    </el-checkbox>
                </el-col>
            </el-row>

            <el-row>
              <el-col :span="8" >
                  <el-form-item label="统计分组" prop="biz_group" style="float:left;margin-bottom: 2px !important;" class="mei">
                    <el-select filterable style="width:326px;"
                      placeholder="请选择主题维度"
                      v-model="form.biz_group"
                      :clearable="true"
                      multiple
                      collapse-tags
                      @change="bizGroupChange">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>

            <el-row style="font-size:12px;background:#f2f8ff;border:1px solid #D6E1E5;border-radius:3px;display: flex;align-items:center;margin-top:20px;" v-for="(item1, index1) in biz_calc_obj" :key="item1.staticsName">
              <el-col :span="2" style="color:#999;text-align:center;">
                <span style="display:block;width:100%;line-height:32px;">指标项</span>
                <span style="display:block;width:100%">{{item1.staticsName}}</span>
              </el-col>
              <el-col :span="22" style="background:#fff;border-left:1px solid #D6E1E5;">
                <el-row style="padding:15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计方法</span>
                   <el-radio-group v-model="item1.staticsType">
                      <el-radio :label="0">求和</el-radio>
                      <el-radio :label="1">计数</el-radio>
                      <el-radio :label="2">最大</el-radio>
                      <el-radio :label="3">最小</el-radio>
                      <el-radio :label="4">平均</el-radio>
                  </el-radio-group>
                  <span style="position:absolute;right:20%;bottom:10px;width: 520px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align:center;" v-if="index1 === 0">
                    <span v-for="item in item1.bizGroup" :key="item" class="bizGroup">{{bizGroupFormatter(item)[0].dim_name}}</span>
                  </span>
                  <span style="position:absolute;right:20%;bottom:10px;width: 520px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align:center;" v-else>
                    <span v-for="item in item1.bizGroup" :key="item" class="bizGroup">{{bizGroupFormatter(item)[0].dim_name}}<i class="tag el-icon-close" @click="delBizGroup(item1, item)"></i></span>
                  </span>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(item1)" v-if="!item1.dataShow">
                    数据筛选
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/more_products.png" height="16" width="16">
                  </span>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(item1)" v-else>
                    收起
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/less_products.png" height="16" width="16">
                  </span>
                </el-row>
                
                <el-row style="padding:0 15px 15px 15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计字段</span>
                   <el-select size="small"
                        placeholder="请选择"
                        v-model="item1.staticsField"
                        :clearable="true">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                </el-row>

                <div v-show="item1.dataShow">
                  <el-row style="padding:5px 15px;">
                    <span>数据筛选设定</span>
                  </el-row>
                  <el-row style="padding:2px 15px;margin: 10px 0;" v-for="(item, index) in item1.field" :key="index">
                      <el-col :span="3">
                          <el-select size="small" :value="item.field"
                              placeholder="请选择"
                              v-model="item.field"
                              :clearable="true" >
                              <el-option
                                v-for="item in weidu_other_list"
                                :key="item.dim_code"
                                :label="item.dim_name"
                                :value="item.dim_code">
                              </el-option>
                          </el-select>
                      </el-col>
                      <span align="center">
                        <el-col :span="5">
                            <el-select filterable size="small"
                             :value="item.fieldComparor"
                             v-model="item.fieldComparor"
                                placeholder="请选择"
                                :clearable="true" >
                                <el-option
                                  v-for="item in dim_options.fieldComparor"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  class="sel_small">
                                </el-option>
                            </el-select>
                        </el-col>
                      </span>
                      <el-col :span="3">
                          <el-input :value="item.fieldValue" v-model="item.fieldValue" placeholder="请输入数值"></el-input>
                      </el-col>
                      <span align="center">
                        <el-col :span="3">
                            <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('field', item1)">
                              <i class="el-icon-plus"></i>
                            </span>
                            <span class="buttonControl" @click="dataDel('field', item1, index)">
                              <i class="el-icon-minus"></i>
                            </span>
                        </el-col>
                      </span>
                  </el-row>
                
                  <el-row style="padding:2px 15px;margin:10px 0;" v-for="(item, index) in item1.date" :key="index">
                      <el-col :span="3">
                          <el-select filterable size="small"
                              placeholder="请选择"
                              v-model="item.field"
                              :clearable="true" >
                              <el-option
                                v-for="item in weidu_time_list"
                                :key="item.dim_code"
                                :label="item.dim_name"
                                :value="item.dim_code">
                              </el-option>
                          </el-select>
                      </el-col>
                       <span align="center">
                          <el-col :span="5">
                              <el-select filterable
                                  placeholder="请选择"
                                  v-model="item.dateComparor"
                                  :value="item.dateComparor"
                                  :clearable="true" >
                                  <el-option
                                    v-for="item in dim_options.DimDateOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    class="sel_small">
                                  </el-option>
                              </el-select>
                          </el-col>
                       </span>
                      <el-col :span="4" style="padding: 0 8px 0 0;">
                          <el-select filterable size="small"
                              placeholder="请选择"
                              v-model="item.dateStaticsType"
                              :value="item.dateStaticsType"
                              :clearable="true" >
                              <el-option
                                v-for="item in dim_options.dateTypeOpiton"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                class="sel_small">
                              </el-option>
                          </el-select>
                      </el-col>
                      <span align="center">
                      <el-col :span="2" style="padding: 0 8px 0 0;">
                          <el-select filterable size="small"
                              placeholder="请选择"
                              v-model="item.dateOptionType"
                              :value="item.dateOptionType"
                              :clearable="true" >
                              <el-option
                                v-for="item in dim_options.numTypeOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                class="sel_small">
                              </el-option>
                          </el-select>
                      </el-col>
                      </span>
                      <el-col :span="2" style="padding: 0 8px 0 0;">
                          <el-input :value="item.dateValue" v-model="item.dateValue"></el-input>
                      </el-col>
                      <el-col :span="3">
                          <el-select filterable size="small"
                              placeholder="请选择"
                              v-model="item.dateInterval"
                              :value="item.dateInterval"
                              :clearable="true">
                              <el-option
                                v-for="item in dim_options.timeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                class="sel_small">
                              </el-option>
                          </el-select>
                      </el-col>
                       <span align="center">
                      <el-col :span="3">
                           <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('date', item1)">
                             <i class="el-icon-plus"></i>
                            </span>
                          <span class="buttonControl" @click="dataDel('date', item1, index)">
                            <i class="el-icon-minus"></i>
                          </span>
                      </el-col>
                      </span>
                  </el-row>
                </div>
                <el-row style="margin-bottom:10px" v-if="item1.staticsName !== 'A'">
                    <div align="right">
                        <span  class="scheduleDel"  @click="delIndexNum(item1)">
                          删除
                        </span>
                    </div>
                </el-row>
              </el-col>
            </el-row>

            <div align="right">
                <el-button type="primary" class="schedule-add el-icon-plus" @click="addIndexNum()" style="width:auto"> 添加监控项</el-button>
            </div>

            <el-row v-for="(item, index) in form.biz_theme_exp" :key="index">
              <el-col :span="4">
                <el-form-item label="监控项名称" :prop="'biz_theme_exp.' + index + '.name'" :rules="{required: true, message: '不能为空', trigger: 'blur'}" label-width="100px"  style="padding-left:5px;margin-bottom:0px;">
                    <el-col>
                      <el-input v-model="item.name" placeholder="" :title="item.name" class="itemCode"></el-input>
                    </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="监控项编码" :prop="'biz_theme_exp.' + index + '.code'" :rules="{required: true, message: '不能为空', trigger: 'blur'}" label-width="100px"  style="padding-left:5px;margin-bottom:0px;">
                    <el-col>
                      <el-input v-model="item.code" placeholder="" :title="item.code" class="itemCode"></el-input>
                    </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="监控项类型" :prop="'biz_theme_exp.' + index + '.type'" :rules="{required: true, message: '不能为空', trigger: 'change'}" label-width="100px"  style="padding-left:5px;margin-bottom:0px;">
                    <el-col>
                      <el-select filterable size="small"
                          placeholder="请选择"
                          v-model="item.type"
                          :clearable="true" >
                          <el-option key="0" label="数字" value="0"></el-option>
                          <el-option key="1" label="字符串" value="1"></el-option>
                      </el-select>
                    </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="监控项计算" :prop="'biz_theme_exp.' + index + '.exp'" :rules="[{validator: biz_calc_exp, trigger: 'blur'}]" label-width="100px"  style="padding-left:5px;margin-bottom:0px;">
                    <el-col :span="12">
                      <el-input v-model="item.exp" placeholder="A" :title="item.exp" class="itemCode"></el-input>
                    </el-col>
                    <el-col :span="1">
                      <i class="el-icon-circle-plus-outline" style="color: #409EFF;font-size:20px;position: relative; left: 8px; top: 2px;cursor:pointer;" @click="addExp(item, index)"></i>
                    </el-col>
                    <el-col :span="1">
                      <i class="el-icon-remove" style="color: #409EFF;font-size:20px;position: relative; left: 8px; top: 2px;cursor:pointer;" @click="delExp(item, index)"></i>
                    </el-col>
                    <!-- <el-col :span="6">
                      <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                        <div slot="content">
                          <div>
                            指标项的值由子项计算而来。计算公式如:A+B+C
                          </div>
                        </div>
                        <i class='el-icon-question' style="color: #93D0F7;font-size:20px;position: relative; left: 8px; top: 2px;"></i>
                      </el-tooltip>
                    </el-col> -->
                </el-form-item>
              </el-col>
              <!-- <div style="padding-left:105px;font-size:8px !important;color:#ccc;">指标项的值由子项计算而来</div> -->
            </el-row>
            <el-row>
                <el-form-item align="right" style="margin-top:8px;">
                    <el-button type="primary"  @click="dialogY()" class="schedule-add">确定提交</el-button>
                    <el-button @click="dialogN()" class="schedule-add">取消</el-button>
                </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import {dimOptions} from '../config/options.js'
  export default {
    data () {
      var validateKey = (rule, value, callback) => {
        let bool = true
        this.tableData.forEach((item) => {
          if (item.key === value && value !== this.key2) {
            bool = false
          }
        })
        if (!bool) {
          callback(new Error('监控项key值重复'))
        } else {
          callback()
        }
      }
      var validateMoniName = (rule, value, callback) => {
        let bool = true
        this.tableData.forEach((item) => {
          if (item) {
            if (item.name === value && value !== this.name2) {
              bool = false
            }
          }
        })
        if (!bool) {
          callback(new Error('监控项名称重复'))
        } else {
          callback()
        }
      }
      var validateTime = (rule, value, callback) => {
        if (this.form.cycle_type === '1') {
          if (value <= 60) {
            callback()
          } else {
            callback(new Error('分钟只能60以内'))
          }
        } else if (this.form.cycle_type === '2') {
          if (value < 24) {
            callback()
          } else {
            callback(new Error('小时只能24以内'))
          }
        } else if (this.form.cycle_type === '3') {
          if (value < 365) {
            callback()
          } else {
            callback(new Error('天只能365以内'))
          }
        } else {
          let reg = /^[0-9]*$/
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入整数'))
          }
        }
      }
      return {
        biz_calc_exp: (rule, value, callback) => {
          // let reg = /[`~@#$%_<>"{},;'~@#￥%……&——{}《》？：“”【】、；‘’，。、 ]/im
          if (value === '') {
            callback(new Error('不能为空'))
          } else {
            callback()
          }
          // else if (reg.test(value)) {
          //   callback(new Error('请不要输入不合法的符号'))
          // }
        },
        // 指标项名称修改
        name2: '',
        // 指标项key修改
        key2: '',
        // 维度总列表
        weidu_all_list: [],
        // 时间维度列表
        weidu_time_list: [],
        // 其他维度列表
        weidu_other_list: [],
        // 新增指标项列表对象
        dim_options: {},
        // 主题数据列表
        // theme_data_options: [],
        // 保存newTem的旧值方便监听者监听业务
        old_value: '',
        // 第一次新增
        state: false,
        // blur触发新增的对象
        // template: {},
        // 第一页的三个值用于表单校验与修改不一样
        // newTemplate: {
        //   name: '',
        //   description: '',
        //   type: '4',
        //   fun_type: '1',
        //   mon_type: '2',
        //   sys_type: '',
        //   object_ids: ''
        // },
        // 已有的指标列表
        tableData: [],
        // 选择的指标项
        indexItems: [],
        // 新增dialog
        dialogFormVisible: false,
        form: {
          name: '',
          key: '',
          biz_theme_id: '',
          calc_type: '2',
          cycle_value: '',
          cycle_type: '',
          exp: '',
          biz_is_zero: '1',
          biz_group: [],
          biz_theme_exp: [{
            code: '',
            name: '',
            type: '',
            exp: ''
          }]
        },
        biz_calc_obj: [{
          'dataShow': false,
          'bizGroup': [],
          'staticsName': 'A',
          'staticsType': 0,
          'staticsField': '',
          'field': [{
            'field': '',
            'fieldComparor': '',
            'fieldValue': ''
          }],
          'date': [{
            'field': '',
            'dateComparor': '',
            'dateStaticsType': '',
            'dateOptionType': '',
            'dateValue': '',
            'dateInterval': ''
          }]
        }],
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
          biz_theme_id: [
            {required: true, message: '请选择主题数据', trigger: 'change'}
          ],
          cycle_value: [
            {required: true, message: '请输入整数', trigger: 'blur'},
            {validator: validateTime, trigger: 'blur'}
          ],
          cycle_type: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ]
        }
      }
    },
    props: ['themeOptions', 'template1', 'newTemplate1'],
    methods: {
      // 1 element 相关方法
      changeIndex (val) {
        this.indexItems = val
      },
      timeChange () {
        let dom = this.$refs.time_input.$el.children[0]
        dom.focus()
        dom.blur()
      },
      calcTypeChange () {
        if (this.form.calc_type === '1') {
          this.form.cycle_value = ''
          this.form.cycle_type = ''
          let arr = []
          arr.push(this.biz_calc_obj[0])
          this.biz_calc_obj = arr
          if (this.dim_options.dateTypeOpiton.length === 4) {
            this.dim_options.dateTypeOpiton.splice(3, 1)
          }
          this.rules.cycle_value[0].required = false
          this.rules.cycle_type[0].required = false
        } else if (this.form.calc_type === '3') {
          this.form.cycle_value = ''
          this.form.cycle_type = ''
          this.dim_options.dateTypeOpiton.push({
            value: '3',
            label: '分组时间'
          })
          this.rules.cycle_value[0].required = false
          this.rules.cycle_type[0].required = false
        } else {
          if (this.dim_options.dateTypeOpiton.length === 4) {
            this.dim_options.dateTypeOpiton.splice(3, 1)
          }
          this.rules.cycle_value[0].required = true
          this.rules.cycle_type[0].required = true
        }
      },
      themeChange () {
        this.weidu_all_list = []
        this.weidu_time_list = []
        this.weidu_other_list = []
        this.theme_data_options.forEach((res) => {
          if (res.theme_id === this.form.biz_theme_id) {
            // if (res.value_type === '0') {
            //   this.form.value_type = '3'
            // } else if (res.value_type === '3') {
            //   this.form.value_type = '0'
            // } else {
            //   this.form.value_type = res.value_type
            // }
            rbProjectDataServiceFactory.getThemeDetail(res.theme_id).then((res1) => {
              this.weidu_time_list.push({
                dim_name: '时间',
                dim_code: '@timestamp'
              })
              this.weidu_all_list.push({
                dim_name: '时间',
                dim_code: '@timestamp'
              })
              for (let i = 0; i < res1.dim_list.length; i++) {
                if (res1.dim_list[i].dim_name) {
                  this.weidu_all_list.push(res1.dim_list[i])
                  if (res1.dim_list[i].dim_type === '3') {
                    this.weidu_time_list.push(res1.dim_list[i])
                  } else {
                    this.weidu_other_list.push(res1.dim_list[i])
                  }
                }
              }
            })
          }
        })
        this.biz_calc_obj = [{
          'dataShow': false,
          'bizGroup': [],
          'staticsName': 'A',
          'staticsType': 0,
          'staticsField': '',
          'field': [{
            'field': '',
            'fieldComparor': '',
            'fieldValue': ''
          }],
          'date': [{
            'field': '',
            'dateComparor': '',
            'dateStaticsType': '',
            'dateOptionType': '',
            'dateValue': '',
            'dateInterval': ''
          }]
        }]
        this.form.biz_group = []
      },
      bizGroupChange (value) {
        for (let item of this.biz_calc_obj) {
          let arr = JSON.parse(JSON.stringify(this.form.biz_group))
          item.bizGroup = arr
        }
      },
      // 2 业务相关方法
      // 跳转接入主题数据
      toThematicClick () {
        this.dialogFormVisible = false
        this.$router.push('../theme/add')
      },
      // zbx 数据显示
      dataShow (item) {
        if (item.dataShow) {
          item.dataShow = false
        } else {
          item.dataShow = true
        }
      },
      // 输入信息增加
      dataAdd (str, item) {
        // str: field date str1: zbxA num: 第几项
        if (str === 'field') {
          item.field.push({
            field: '',
            fieldComparor: '',
            fieldValue: ''
          })
        } else if (str === 'date') {
          item.date.push({
            field: '',
            dateComparor: '',
            dateStaticsType: '',
            dateOptionType: '',
            dateValue: '',
            dateInterval: ''
          })
        }
      },
      // 输入信息减少
      dataDel (str, item, index) {
        // str: yeild date obj: 对象 index: filed的第几项
        if (item[str].length <= 1) {
          this.$alert('必须保留一条数据筛选-字段数据！', '通知', {
            confirmButtonText: '确定'
          })
        } else {
          item[str].splice(index, 1)
        }
      },
      addExp (item, index) {
        let index1 = index + 1
        this.form.biz_theme_exp.splice(index1, 0, {
          code: '',
          name: '',
          type: '',
          exp: ''
        })
      },
      delExp (item, index) {
        this.form.biz_theme_exp.splice(index, 1)
      },
      addIndexNum () {
        if (this.form.calc_type === '1') {
          this.$alert('数据到达时不能再添加', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          let obj = JSON.parse(JSON.stringify(this.biz_calc_obj[this.biz_calc_obj.length - 1]))
          let staticsName = String.fromCharCode(obj.staticsName.charCodeAt() + 1)
          let arr = JSON.parse(JSON.stringify(this.form.biz_group))
          this.biz_calc_obj.push({
            'dataShow': false,
            'bizGroup': arr,
            'staticsName': staticsName,
            'staticsType': 0,
            'staticsField': '',
            'field': [{
              'field': '',
              'fieldComparor': '',
              'fieldValue': ''
            }],
            'date': [{
              'field': '',
              'dateComparor': '',
              'dateStaticsType': '',
              'dateOptionType': '',
              'dateValue': '',
              'dateInterval': ''
            }]
          })
        }
      },
      delIndexNum (item) {
        if (this.biz_calc_obj.length <= 1) {
          this.$alert('必须保留一条数据筛选-字段数据！', '通知', {
            confirmButtonText: '确定'
          })
        } else {
          let num = this.biz_calc_obj.indexOf(item)
          this.biz_calc_obj.splice(num, 1)
        }
      },
      next () {
        let obj = JSON.parse(JSON.stringify(this.template))
        Object.assign(obj, this.newTemplate)
        obj.type = '4'
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
      },
      prev () {
        this.$emit('stepChange', 0, this.tableData)
      },
      // 删除分组中的一项
      delBizGroup (item1, item) {
        let index = item1.bizGroup.indexOf(item)
        item1.bizGroup.splice(index, 1)
      },
      // 确定指标新增 dialog
      dialogY () {
        this.$refs.business.validate((valid) => {
          if (valid) {
            //  为指标项的新增
            if (this.name2 === '') {
              rbProjectDataServiceFactory.creatBizItem(this.packSend()).then((res) => {
                if (res) {
                  this.pageList()
                  this.initDim()
                }
              }).catch(() => {
                this.initDim()
              })
            } else {
              let arr = [this.packSend(), this.form.item_id]
              rbProjectDataServiceFactory.updateItem(arr).then((res) => {
                if (res) {
                  this.pageList()
                  this.initDim()
                }
              }).catch(() => {
                this.initDim()
              })
            }
          } else {
            this.$alert('请正确填写相关选项', '警告', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      dialogN () {
        this.initDim()
      },
      handleClose () {
        this.initDim()
      },
      initDim () {
        this.dim_options.dateTypeOpiton = JSON.parse(JSON.stringify(dimOptions)).dateTypeOpiton
        this.form = {
          name: '',
          key: '',
          biz_theme_id: '',
          calc_type: '2',
          cycle_value: '',
          cycle_type: '',
          exp: '',
          biz_is_zero: '1',
          biz_group: [],
          biz_theme_exp: [{
            code: '',
            name: '',
            type: '',
            exp: ''
          }]
        }
        this.name2 = ''
        this.key2 = ''
        this.weidu_all_list = []
        this.weidu_time_list = []
        this.weidu_other_list = []
        this.dialogFormVisible = false
        this.biz_calc_obj = [{
          'dataShow': false,
          'bizGroup': [],
          'staticsName': 'A',
          'staticsType': 0,
          'staticsField': '',
          'field': [{
            'field': '',
            'fieldComparor': '',
            'fieldValue': ''
          }],
          'date': [{
            'field': '',
            'dateComparor': '',
            'dateStaticsType': '',
            'dateOptionType': '',
            'dateValue': '',
            'dateInterval': ''
          }]
        }]
      },
      // 新增指标
      addIndex () {
        this.dialogFormVisible = true
      },
      // 修改指标列表
      updateIndex () {
        if (this.indexItems.length > 1) {
          this.$alert('一次只能修改一个指标', '警告', {
            confirmButtonText: '确定'
          })
        } else if (this.indexItems.length < 1) {
          this.$alert('请选择需要修改的指标', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          rbProjectDataServiceFactory.getItemDetail(this.indexItems[0].item_id).then((res) => {
            rbProjectDataServiceFactory.getThemeDetail(res.biz_theme_id).then((res1) => {
              this.form = res
              this.form.biz_theme_exp = JSON.parse(res.biz_theme_exp)
              let arr = JSON.parse(res.biz_group)
              this.form.biz_group = []
              for (let item of arr) {
                this.form.biz_group.push(item.code)
              }
              this.weidu_time_list.push({
                dim_name: '时间',
                dim_code: '@timestamp'
              })
              this.weidu_all_list.push({
                dim_name: '时间',
                dim_code: '@timestamp'
              })
              for (let i = 0; i < res1.dim_list.length; i++) {
                if (res1.dim_list[i].dim_name) {
                  this.weidu_all_list.push(res1.dim_list[i])
                  if (res1.dim_list[i].dim_type === '3') {
                    this.weidu_time_list.push(res1.dim_list[i])
                  } else {
                    this.weidu_other_list.push(res1.dim_list[i])
                  }
                }
              }
              this.name2 = res.name
              this.key2 = res.key
              if (this.form.calc_type === '3') {
                this.dim_options.dateTypeOpiton.push({
                  value: '3',
                  label: '分组时间'
                })
                this.rules.cycle_value[0].required = false
                this.rules.cycle_type[0].required = false
              }
              if (res.delay) {
                if (res.delay / 1440 >= 1) {
                  this.$set(this.form, 'cycle_type', '3')
                  this.form.cycle_value = res.delay / 1440
                } else if (res.delay / 60 >= 1) {
                  this.$set(this.form, 'cycle_type', '2')
                  this.form.cycle_value = res.delay / 60
                } else {
                  this.$set(this.form, 'cycle_type', '1')
                  this.form.cycle_value = res.delay
                }
              } else {
                this.$set(this.form, 'cycle_type', '')
                this.form.cycle_value = ''
              }
              this.biz_calc_obj = JSON.parse(this.form.biz_calc_obj)
              // 增加dataShows
              for (let item of this.biz_calc_obj) {
                this.$set(item, 'dataShow', false)
              }
              this.dialogFormVisible = true
            })
          })
        }
      },
      // 删除指标
      deleteIndex () {
        let str = ''
        this.indexItems.forEach((res) => {
          str += res.item_id + ','
        })
        str = str.slice(0, -1)
        rbProjectDataServiceFactory.deleteItem(str).then(() => {
          this.pageList()
        })
      },
      // 3 封装的方法
      bizGroupFormatter (str) {
        return this.weidu_all_list.filter((item) => { return item.dim_code === str })
      },
      packSend () {
        let obj = JSON.parse(JSON.stringify(this.form))
        obj.template_id = this.template.template_id
        if (obj.cycle_type === '1') {
          obj.delay = Number(obj.cycle_value)
        } else if (obj.cycle_type === '2') {
          obj.delay = obj.cycle_value * 60
        } else if (obj.cycle_type === '3') {
          obj.delay = obj.cycle_value * 60 * 24
        }
        obj.biz_index = 'mirror-theme-*'
        obj.value_type = '0'
        obj.sys_type = 'THEME_CALC'
        obj.units = ''
        obj.biz_calc_obj = JSON.stringify(this.biz_calc_obj)
        obj.biz_theme_exp = JSON.stringify(obj.biz_theme_exp)
        let arr = []
        for (let str of obj.biz_group) {
          let arr1 = this.weidu_all_list.filter((item) => { return item.dim_code === str })
          arr.push({
            name: arr1[0].dim_name,
            code: arr1[0].dim_code
          })
        }
        obj.biz_group = JSON.stringify(arr)
        return obj
      },
      syncFunc (item) {
        return rbProjectDataServiceFactory.getThemeDetail(item.biz_theme_id).then((obj) => {
          item.theme_name = obj.theme_name
          if (item.calc_type === '1') {
            item.calc_type1 = '数据到达时'
          } else if (item.calc_type === '2') {
            item.calc_type1 = '周期性'
          } else {
            item.calc_type1 = '第三方调用'
          }
          if (item.delay / 1440 >= 1) {
            item.time_interval = `每${item.delay / 1440}天`
          } else if (item.delay / 60 >= 1) {
            item.time_interval = `每${item.delay / 60}小时`
          } else {
            item.time_interval = `每${item.delay}分钟`
          }
          let arr = JSON.parse(item.biz_theme_exp)
          item.biz_calc_exp = arr[0] ? arr[0].exp : ''
        }).catch()
      },
      syncExec (arr) {
        let qb = null
        if (arr.length === 1) {
          this.syncFunc(arr[0]).then(() => {
            this.tableData = arr
          })
        } else {
          qb = this.syncFunc(arr[0])
        }
        for (let i = 1; i < arr.length; i++) {
          if (i === arr.length - 1) {
            qb.then(() => {
              this.syncFunc(arr[i]).then(() => {
                this.tableData = arr
              })
            })
          } else {
            qb.then(() => {
              qb = this.syncFunc(arr[i])
            })
          }
        }
      },
      // 4 数据相关方法
      initData () {
        this.dim_options = JSON.parse(JSON.stringify(dimOptions))
      },
      pageList () {
        this.tableData = []
        rbProjectDataServiceFactory.detail(`${this.template.template_id}`).then((res) => {
          let arr = JSON.parse(JSON.stringify(res.item_list))
          this.syncExec(arr)
        })
      }
    },
    mounted () {
      this.initData()
      // this.packSend()
    },
    computed: {
      theme_data_options () {
        return this.themeOptions
      },
      template () {
        return this.template1
      },
      newTemplate () {
        return this.newTemplate1
      }
    },
    watch: {
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
        /deep/ .moreCon{
          input{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
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
      /deep/ .add-device {
        margin-top: 20px;
        padding: 10px;
        .add-device-tit {
          display: inline-block;
        }
        .el-table{
          .el-input{
            width:auto;
          }
          .cell{
            text-align:center;
          }
        }
        .el-button {
          height: 30px;
          width: 80px;
          padding: 8px 15px;
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
    /deep/ .addBiz {
      .el-dialog__header{
        font-size:16px;
        .el-dialog__title{
          line-height: 1;
          font-weight: 700;
          color: #1f2d3d;
          font-size:16px;
        }
        button{
          font-size: 22px;
          line-height: 22px;
          i{
            color: #bfcbd9;
          }
        }
      }
      .el-dialog__body{
        padding: 20px 20px;
        color: #48576a;
        font-size: 13px;
        .maddid-toThematic{
          position: absolute;
          top: 16px;
          left: 35%;
          width: 35%;
          .maddid-step-icon{
            display: inline-block;
            width: 24px;
            height: 24px;
            margin-top:5px;
            font-size: 10px;
            color: #FFFFFF;
            border-radius: 24px;
            background: #FFBF55;
            text-align: center;
            line-height: 24px;
          }
          .maddid-step-content{
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #333333;
          }
          .maddid-step-segmenting{
            line-height: 29px;
            position: relative;
            top: 16px;
            right: 7%;
          }
          .maddid-step-segmenting-line{
            background: #F4F4F4;
            border-radius: 3px;
            height:1px;
          }
        }
        .con{
          .el-form{
            .itemCode{
              input{
                width: 100%;
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .checkbox{
              margin-left: 25px;
              .el-checkbox__label{
                font-size:13px;
                padding-left: 4px;
              }
            }
            .el-input__inner{
              height:30px;
              font-size: 13px;
            }
            .el-form-item__label{
              font-size: 12px;
              color: #666;
            }
            .el-radio__label{
              font-size:12px;
              padding-left:5px;
            }
            .el-radio+.el-radio{
              margin-left:15px;
            }
            .el-radio{
              margin-bottom:0;
            }
            .buttonControl{
              display:block;
              float:left;
              border-radius:50%;
              background:#d6e1e5;
              width:18px;
              height:18px;
              color:#fff;
              margin:5px 4px;cursor: pointer
            }
            .buttonControl i{
              font-style: normal;
              font-size:6px;
              font-weight: 500
            }
            .buttonControl:hover{
              display:block;
              float:left;
              border-radius:50%;
              background:#46bafe;
              width:18px;
              height:18px;
              color:#fff;
              margin:5px 4px;
              cursor: pointer
            }
            .schedule-add{
              margin-top:20px;
              height: 30px;
              padding: 0 15px;
              font-size: 12px;
              border-radius: 3px!important;
            }
            .scheduleDel{
              display:block;
              width:40px;
              height:24px;
              line-height:24px;
              background:#d6e1e5;
              text-align: center;
              border-radius:4px;
              margin-right:15px;
              cursor: pointer
            }
          }
          .mei{
            .el-form-item__content{
              height: 40px;
              .el-form-item__error{
                left: 4px;
              }
            }
          }
          .bizGroup {
            box-sizing: border-box;
            border-color: transparent;
            margin: 2px 0 2px 6px;
            background-color: #f0f2f5;
            padding: 0 8px;
            color: #909399;
            border-radius: 4px;
            height: 24px;
            display: inline-block;
            line-height: 24px;
            i.tag {
              background-color: #c0c4cc;
              right: -4px;
              top: 0;
              color: #fff;
              border-radius: 50%;
              text-align: center;
              position: relative;
              cursor: pointer;
              font-size: 12px;
              height: 12.8px;
              width: 12.8px;
              line-height: 13.8px;
            }
          }
        }
      }
    }
  }


</style>
