<template>
  <div class="components-container yw-dashboard">
    <router-view></router-view>
    <div class="body-container">
      <el-steps :active="active"
                finish-status="success"
                align-center
                v-if="newTemplate.sys_type !== 'THEME_CALC'">
        <el-step title="填写模板信息">
        </el-step>
        <el-step title="设置指标">
        </el-step>
        <el-step title="配置触发器">
        </el-step>
      </el-steps>

      <el-steps :active="active"
                finish-status="success"
                align-center
                v-else>
        <el-step title="填写模板信息">
        </el-step>
        <el-step title="设置指标">
        </el-step>
      </el-steps>

      <div v-show="active == 0 ? true:false"
           class="stepOne">
        <el-form class="yw-form is-required form-step"
                 :model="newTemplate"
                 :rules="rules1"
                 ref="ruleform1"
                 label-width="82px">
          <el-form-item prop="name"
                        label="模板名称：">
            <el-input v-model="newTemplate.name"
                      placeholder="请输入内容"
                      class="add-con"></el-input>
          </el-form-item>
          <el-form-item prop="description"
                        label="模板描述：">
            <el-input v-model="newTemplate.description"
                      placeholder="请输入内容"
                      class="add-con"></el-input>
          </el-form-item>
          <el-form-item prop="sys_type"
                        label="系统类型：">
            <el-select v-model="newTemplate.sys_type"
                       placeholder="请选择"
                       class="list-sel add-con"
                       disabled>
              <el-option v-for="item in sys_type_options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="object_ids"
                        label="关联对象："
                        v-if="newTemplate.mon_type === '2'">
            <el-select v-model="newTemplate.object_ids"
                       placeholder="请选择"
                       class="list-sel add-con"
                       filterable
                       clearable
                       :disabled="tableData.length > 0">
              <el-option v-for="item in biz_sys_options"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="object_ids"
                        label="关联对象："
                        v-else-if="newTemplate.mon_type === '1'">
            <el-input v-model="newTemplate.object_ips"
                      placeholder="请选择设备"
                      class="add-con moreCon"
                      disabled
                      :title="newTemplate.object_ips"></el-input>
            <el-button type="primary"
                       @click="goDevices()">设备管理</el-button>
          </el-form-item>
          <section class="btn-wrap">
            <el-button type="primary"
                       @click="next">下一步</el-button>
          </section>
        </el-form>
      </div>

      <div class="add-table"
           v-show="active == 1 ? true:false">
        <el-form class="yw-form"
                 v-if="newTemplate.sys_type !== 'THEME_CALC'"
                 >
          <div class="table-operate-wrap clearfix">
            <el-button type="text"
                       icon="el-icon-plus"
                       @click="addIndex()">新增</el-button>
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="updateIndex">修改</el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       @click="deleteIndex">清除</el-button>
          </div>
          <div class="yw-el-table-wrap">
            <el-table :data="tableData"
                      class="yw-el-table"
                      stripe
                      tooltip-effect="dark"
                      border
                      height="calc(100vh - 300px)"
                      @selection-change="changeIndex">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column prop="name"
                               label="指标名称">
              </el-table-column>
              <el-table-column prop="key"
                               label="key值">
              </el-table-column>
              <el-table-column prop="theme_name"
                               label="主题数据">
              </el-table-column>
              <el-table-column prop="calc_type1"
                               label="计算时间点">
              </el-table-column>
              <el-table-column prop="time_interval"
                               label="时间间隔">
              </el-table-column>
              <el-table-column prop="biz_calc_exp"
                               label="计算表达式">
              </el-table-column>
            </el-table>
          </div>
          <section class="btn-wrap">
            <el-button type="primary"
                       @click="prev()">上一步</el-button>
            <el-button @click="next()">完成</el-button>
          </section>
        </el-form>
        <div v-else>
          <theme-calc @stepChange="stepChange(arguments, 'msg')"
                      :themeOptions="theme_data_options"
                      :template1="template"
                      :newTemplate1="newTemplate"></theme-calc>
        </div>
      </div>

      <el-form class="yw-form"
               v-show="active == 2 ? true:false"
               >
        <div class="table-operate-wrap clearfix">
          <el-button type="text"
                     icon="el-icon-plus"
                     @click="addTrigger">新增</el-button>
          <el-button type="text"
                     icon="el-icon-delete"
                     @click="delteTrigger">清除</el-button>
        </div>
        <div class="yw-el-table-wrap">
          <el-table :data="triggerData"
                    class="yw-el-table"
                    stripe
                    tooltip-effect="dark"
                    border
                    height="calc(100vh - 300px)"
                    @selection-change="changeTrigger">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column prop="name"
                             label="触发器名称">
              <template slot-scope="scope">
                <el-input class="dom"
                          v-model="triggerData[scope.$index].name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="priority"
                             label="触发器等级">
              <template slot-scope="scope">
                <el-select v-model="triggerData[scope.$index].priority"
                           placeholder="请选择"
                           class="add-exp">
                  <el-option v-for="item in trigger_options.trigger_level"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="item_id"
                             label="监控项/表达式">
              <template slot-scope="scope">
                <el-select v-model="triggerData[scope.$index].item_id"
                           placeholder="请选择"
                           class="add-exp"
                           filterable>
                  <el-option v-for="item in tableData"
                             :key="item.item_id"
                             :label="item.name"
                             :value="item.item_id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="expression"
                             label="表达式">
              <template slot-scope="scope">
                <el-input class="dom"
                          v-model="triggerData[scope.$index].expression"></el-input>
                <el-tooltip placement="top"
                            effect="light"
                            popper-class="thematicData-debug-help">
                  <div slot="content">表达式中可填写指标的key值进行运算。如:指标Key值>1</div>
                  <i class='el-icon-question'
                     style="color: #93D0F7;font-size:20px;position: relative;top: 2px;"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <section class="btn-wrap">
          <el-button type="primary"
                     @click="prev()">上一步</el-button>
          <el-button @click="next()">完成</el-button>
        </section>
      </el-form>

      <el-dialog class="yw-dialog"
                 title="新增系统指标"
                 v-if="dialogFormVisible"
                 :visible.sync="dialogFormVisible"
                 :close-on-click-modal="false"
                 width="700px"
                 :before-close="handleClose">
        <section class="yw-dialog-main">
          <el-form class="yw-form is-required"
                   ref="business"
                   label-width="90px"
                   :inline="true"
                   :rules="rules"
                   :model="form">
            <el-form-item label="指标名称"
                          prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="Key值"
                          prop="key">
              <el-input v-model="form.key"></el-input>
              <el-tooltip placement="top"
                          effect="light"
                          popper-class="thematicData-debug-help">
                <div slot="content">Key值可用于填写触发器表达式</div>
                <i class='el-icon-question'></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="主题数据"
                          prop="biz_theme_id">
              <el-select filterable
                         placeholder="请选择主题数据"
                         v-model="form.biz_theme_id"
                         :clearable="true"
                         @change="themeChange()">
                <el-option v-for="item in theme_data_options"
                           :key="item.theme_id"
                           :label="item.theme_name"
                           :value="item.theme_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计算时间点">
              <el-radio v-model="form.calc_type"
                        label="1"
                        @change="calcTypeChange()">数据到达时</el-radio>
              <el-radio v-model="form.calc_type"
                        label="2"
                        @change="calcTypeChange()">周期性</el-radio>
            </el-form-item>
            <el-form-item label="每"
                          prop="cycle_value">
              <el-input placeholder="请输入"
                        v-model="form.cycle_value"
                        ref="time_input"
                        :disabled="form.calc_type === '1' ? true : false">
              </el-input>
            </el-form-item>
            <el-form-item prop="cycle_type">
              <el-select placeholder="分/小时/天"
                         v-model="form.cycle_type"
                         :clearable="true"
                         class="inputClass"
                         @change="timeChange()"
                         :disabled="form.calc_type === '1' ? true : false">
                <el-option v-for="item in dim_options.timeOptions1"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <el-checkbox v-model="form.biz_is_zero"
                           class="checkbox"
                           true-label="0"
                           false-label="1">
                <span>空值监控</span>
                <el-tooltip placement="top"
                            effect="light"
                            popper-class="thematicData-debug-help">
                  <div slot="content">在周期扫描范围内，统计该范围内无业务方上报数据时，勾选代表需要监控，会以0值代替，不勾选则为空值不做监控处理 </div>
                  <i class='el-icon-question'></i>
                </el-tooltip>
              </el-checkbox>
            </el-form-item>

             <el-row style="margin-top:10px;font-size:12px;background:#f2f8ff;border:1px solid #D6E1E5;border-radius:3px;display: flex;align-items:center;">
              <el-col :span="2" style="color:#999;text-align:center;">
                <span style="display:block;width:100%;line-height:32px;">指标项</span>
                <span style="display:block;width:100%">A</span>
              </el-col>
              <el-col :span="22" style="background:#fff;border-left:1px solid #D6E1E5;">
                <el-row style="padding:15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 10px; ">统计方法</span>
                   <el-radio-group v-model="biz_calc_obj[0].zbxA.staticsType">
                      <el-radio :label="0">求和</el-radio>
                      <el-radio :label="1">计数</el-radio>
                      <el-radio :label="2">最大</el-radio>
                      <el-radio :label="3">最小</el-radio>
                      <el-radio :label="4">平均</el-radio>
                  </el-radio-group>
                  <span style="margin-left:20px" @click="dataShow(0)" v-if="!biz_calc_state[0].dataShow">
                    数据筛选
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/more_products.png" height="16" width="16">
                  </span>
                  <span style="margin-left:20px" @click="dataShow(0)" v-else>
                    收起
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/less_products.png" height="16" width="16">
                  </span>
                </el-row>

                <el-row style="padding:0 15px 15px 15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 10px; ">统计字段</span>
                   <el-select size="small"
                        placeholder="请选择"
                        v-model="biz_calc_obj[0].zbxA.staticsField"
                        :clearable="true">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                </el-row>

                <div v-show="biz_calc_state[0].dataShow">
                  <el-row style="padding:5px 15px;">
                    <span>数据筛选设定</span>
                  </el-row>
                  <el-row style="padding:2px 15px;margin: 10px 0;" v-for="(item, index) in biz_calc_obj[0].zbxA.field" :key="index">
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
                            <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('field', 'zbxA', 0)">
                              <i class="el-icon-plus"></i>
                            </span>
                            <span class="buttonControl" @click="dataDel('field', 'zbxA', 0, index)">
                              <i class="el-icon-minus"></i>
                            </span>
                        </el-col>
                      </span>
                  </el-row>

                  <el-row style="padding:2px 15px;margin:10px 0;" v-for="(item, index) in biz_calc_obj[0].zbxA.date" :key="index">
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
                           <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('date', 'zbxA', 0)">
                             <i class="el-icon-plus"></i>
                            </span>
                          <span class="buttonControl" @click="dataDel('date', 'zbxA', 0, index)">
                            <i class="el-icon-minus"></i>
                          </span>
                      </el-col>
                      </span>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <el-row style="font-size:12px;background:#f2f8ff;border:1px solid #D6E1E5;border-radius:3px;display: flex;align-items:center;margin-top:20px;" v-if="biz_calc_state[1].show">
              <el-col :span="2" style="color:#999;text-align:center;">
                <span style="display:block;width:100%;line-height:32px;">指标项</span>
                <span style="display:block;width:100%">B</span>
              </el-col>
              <el-col :span="22" style="background:#fff;border-left:1px solid #D6E1E5;">
                <el-row style="padding:15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计方法</span>
                   <el-radio-group v-model="biz_calc_obj[1].zbxB.staticsType">
                      <el-radio :label="0">求和</el-radio>
                      <el-radio :label="1">计数</el-radio>
                      <el-radio :label="2">最大</el-radio>
                      <el-radio :label="3">最小</el-radio>
                      <el-radio :label="4">平均</el-radio>
                  </el-radio-group>
                  <span style="margin-left:20px" @click="dataShow(1)" v-if="!biz_calc_state[1].dataShow">
                    数据筛选
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/more_products.png" height="16" width="16">
                  </span>
                  <span style="margin-left:20px" @click="dataShow(1)" v-else>
                    收起
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/less_products.png" height="16" width="16">
                  </span>
                </el-row>

                <el-row style="padding:0 15px 15px 15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计字段</span>
                   <el-select size="small"
                        placeholder="请选择"
                        v-model="biz_calc_obj[1].zbxB.staticsField"
                        :clearable="true">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                </el-row>

                <div v-show="biz_calc_state[1].dataShow">
                  <el-row style="padding:5px 15px;">
                    <span>数据筛选设定</span>
                  </el-row>
                  <el-row style="padding:2px 15px;margin: 10px 0;" v-for="(item, index) in biz_calc_obj[1].zbxB.field" :key="index">
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
                            <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('field', 'zbxB', 1)">
                              <i class="el-icon-plus"></i>
                            </span>
                            <span class="buttonControl" @click="dataDel('field', 'zbxB', 1, index)">
                              <i class="el-icon-minus"></i>
                            </span>
                        </el-col>
                      </span>
                  </el-row>

                  <el-row style="padding:2px 15px;margin:10px 0;" v-for="(item, index) in biz_calc_obj[1].zbxB.date" :key="index">
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
                              :clearable="true" >
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
                          <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('date', 'zbxB', 1)">
                            <i class="el-icon-plus"></i>
                          </span>
                          <span class="buttonControl" @click="dataDel('date', 'zbxB', 1, index)">
                            <i class="el-icon-minus"></i>
                          </span>
                      </el-col>
                      </span>
                  </el-row>
                </div>
                <el-row style="margin-bottom:10px">
                    <div align="right">
                       <el-button class="dashboard-btn"
                     type="primary"
                    @click="delIndexNum(1)">删除</el-button>
                    </div>
                </el-row>
              </el-col>
            </el-row>

            <el-row style="font-size:12px;background:#f2f8ff;border:1px solid #D6E1E5;border-radius:3px;display: flex;align-items:center;margin-top:20px;" v-if="biz_calc_state[2].show">
              <el-col :span="2" style="color:#999;text-align:center;">
                <span style="display:block;width:100%;line-height:32px;">指标项</span>
                <span style="display:block;width:100%">C</span>
              </el-col>
              <el-col :span="22" style="background:#fff;border-left:1px solid #D6E1E5;">
                <el-row style="padding:15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计方法</span>
                   <el-radio-group v-model="biz_calc_obj[2].zbxC.staticsType">
                      <el-radio :label="0">求和</el-radio>
                      <el-radio :label="1">计数</el-radio>
                      <el-radio :label="2">最大</el-radio>
                      <el-radio :label="3">最小</el-radio>
                      <el-radio :label="4">平均</el-radio>
                  </el-radio-group>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(2)" v-if="!biz_calc_state[2].dataShow">
                    数据筛选
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/more_products.png" height="16" width="16">
                  </span>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(2)" v-else>
                    收起
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/less_products.png" height="16" width="16">
                  </span>
                </el-row>

                <el-row style="padding:0 15px 15px 15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计字段</span>
                   <el-select size="small"
                        placeholder="请选择"
                        v-model="biz_calc_obj[2].zbxC.staticsField"
                        :clearable="true">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                </el-row>

                <div v-show="biz_calc_state[2].dataShow">
                  <el-row style="padding:5px 15px;">
                    <span>数据筛选设定</span>
                  </el-row>
                  <el-row style="padding:2px 15px;margin: 10px 0;" v-for="(item, index) in biz_calc_obj[2].zbxC.field" :key="index">
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
                            <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('field', 'zbxC', 2)">
                              <i class="el-icon-circle-plus"></i>
                            </span>
                            <span class="buttonControl" @click="dataDel('field', 'zbxC', 2, index)">
                              <i class="el-icon-remove"></i>
                            </span>
                        </el-col>
                      </span>
                  </el-row>

                  <el-row style="padding:2px 15px;margin:10px 0;" v-for="(item, index) in biz_calc_obj[2].zbxC.date" :key="index">
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
                              :clearable="true" >
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
                           <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('date', 'zbxC', 2)">
                             <i class="el-icon-plus"></i>
                            </span>
                          <span class="buttonControl" @click="dataDel('date', 'zbxC', 2, index)">
                            <i class="el-icon-minus"></i>
                          </span>
                      </el-col>
                      </span>
                  </el-row>
                </div>
                <el-row style="margin-bottom:10px">
                    <div align="right">
                        <span  class="scheduleDel"  @click="delIndexNum(2)">
                          删除
                        </span>
                    </div>
                </el-row>
              </el-col>
            </el-row>

            <div align="right">
                <el-button type="primary" class="schedule-add el-icon-plus"  @click="addIndexNum()"> 添加监控项</el-button>
            </div>

            <el-form-item label="监控项计算" prop="biz_calc_exp">
                  <el-col :span="18">
                    <el-input v-model="form.biz_calc_exp" placeholder="A"></el-input>
                  </el-col>
                  <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                    <div slot="content">
                      <div>
                        指标项的值由子项计算而来。计算公式如:A+B+C
                      </div>
                    </div>
                    <i class='el-icon-question'></i>
                  </el-tooltip>
              </el-form-item>

          </el-form>
        </section>
        <section class="btn-wrap">
          <el-button type="primary"
                     @click="submitForm()">创建</el-button>
          <el-button @click="resetFields()">取消</el-button>
        </section>
        <!-- <div class="maddid-toThematic">
            <el-row>
              <el-col :span="7">
                 <el-tooltip placement="bottom" effect="light" popper-class="thematicData-debug-help">
                    <div slot="content" >接入主题数据</div>
                    <div style="cursor:pointer;" @click="toThematicClick()">
                      <span class="maddid-step-icon" style="background: #Ff5F5F5;border: 1px solid #999999;color:#333333;">1</span>
                      <span class="maddid-step-content" style="color:#333333;">主题数据接入</span>
                    </div>
                  </el-tooltip>
              </el-col>
              <el-col :span="10" class="maddid-step-segmenting">
                <div class="maddid-step-segmenting-line"></div>
              </el-col>
              <el-col :span="7">
                <span class="maddid-step-icon">2</span>
                <span class="maddid-step-content">新增系统指标</span>
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
                       
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
               <el-col :span="7">
                  <el-form-item label="计算时间点"  style="padding-left:5px;">
                    <el-radio  v-model="form.calc_type" label="1" @change="calcTypeChange()">数据到达时</el-radio>
                    <el-radio  v-model="form.calc_type" label="2" @change="calcTypeChange()">周期性</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="2" >
                    <el-form-item label="每" prop="cycle_value" style="float:left;" class="mei">
                      <el-input placeholder="请输入" v-model="form.cycle_value" style="width: 80px;margin:0 5px;" ref="time_input" :disabled="form.calc_type === '1' ? true : false">
                      </el-input>
                    </el-form-item>
                </el-col>
                <el-col style="width:auto">
                  <el-form-item  prop="cycle_type">
                    <el-select style="width:222px;height: 30px;"
                      placeholder="分/小时/天"
                      v-model="form.cycle_type"
                      :clearable="true" class="inputClass" @change="timeChange()" :disabled="form.calc_type === '1' ? true : false">
                        <el-option
                          v-for="item in dim_options.timeOptions1"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-checkbox v-model="form.biz_is_zero" class="checkbox" true-label="0" false-label="1">
                      <span >空值监控</span>
                      <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                        <div slot="content" >在周期扫描范围内，统计该范围内无业务方上报数据时，勾选代表需要监控，会以0值代替，不勾选则为空值不做监控处理 </div>
                        <i class='el-icon-question' style="color: #93D0F7;font-size:16px;vertical-align: text-top;"></i>
                      </el-tooltip>
                    </el-checkbox>
                </el-col>
                <el-col :span="5" v-show="false">
                    <el-checkbox v-model="form.group_flag" class="checkbox" true-label="0" false-label="1">
                      <span >统计监控</span>
                      <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                        <div slot="content" >在周期扫描范围内，统计模板关联的所有设备做最终一个结果的统计 </div>
                        <i class='el-icon-question' style="color: #93D0F7;font-size:16px;vertical-align: text-top;"></i>
                      </el-tooltip>
                    </el-checkbox>
                </el-col>
            </el-row>

            <el-row style="font-size:12px;background:#f2f8ff;border:1px solid #D6E1E5;border-radius:3px;display: flex;align-items:center;">
              <el-col :span="2" style="color:#999;text-align:center;">
                <span style="display:block;width:100%;line-height:32px;">指标项</span>
                <span style="display:block;width:100%">A</span>
              </el-col>
              <el-col :span="22" style="background:#fff;border-left:1px solid #D6E1E5;">
                <el-row style="padding:15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计方法</span>
                   <el-radio-group v-model="biz_calc_obj[0].zbxA.staticsType">
                      <el-radio :label="0">求和</el-radio>
                      <el-radio :label="1">计数</el-radio>
                      <el-radio :label="2">最大</el-radio>
                      <el-radio :label="3">最小</el-radio>
                      <el-radio :label="4">平均</el-radio>
                  </el-radio-group>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(0)" v-if="!biz_calc_state[0].dataShow">
                    数据筛选
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/more_products.png" height="16" width="16">
                  </span>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(0)" v-else>
                    收起
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/less_products.png" height="16" width="16">
                  </span>
                </el-row>

                <el-row style="padding:0 15px 15px 15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计字段</span>
                   <el-select size="small"
                        placeholder="请选择"
                        v-model="biz_calc_obj[0].zbxA.staticsField"
                        :clearable="true">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                </el-row>

                <div v-show="biz_calc_state[0].dataShow">
                  <el-row style="padding:5px 15px;">
                    <span>数据筛选设定</span>
                  </el-row>
                  <el-row style="padding:2px 15px;margin: 10px 0;" v-for="(item, index) in biz_calc_obj[0].zbxA.field" :key="index">
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
                            <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('field', 'zbxA', 0)">
                              <i class="el-icon-plus"></i>
                            </span>
                            <span class="buttonControl" @click="dataDel('field', 'zbxA', 0, index)">
                              <i class="el-icon-minus"></i>
                            </span>
                        </el-col>
                      </span>
                  </el-row>

                  <el-row style="padding:2px 15px;margin:10px 0;" v-for="(item, index) in biz_calc_obj[0].zbxA.date" :key="index">
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
                           <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('date', 'zbxA', 0)">
                             <i class="el-icon-plus"></i>
                            </span>
                          <span class="buttonControl" @click="dataDel('date', 'zbxA', 0, index)">
                            <i class="el-icon-minus"></i>
                          </span>
                      </el-col>
                      </span>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <el-row style="font-size:12px;background:#f2f8ff;border:1px solid #D6E1E5;border-radius:3px;display: flex;align-items:center;margin-top:20px;" v-if="biz_calc_state[1].show">
              <el-col :span="2" style="color:#999;text-align:center;">
                <span style="display:block;width:100%;line-height:32px;">指标项</span>
                <span style="display:block;width:100%">B</span>
              </el-col>
              <el-col :span="22" style="background:#fff;border-left:1px solid #D6E1E5;">
                <el-row style="padding:15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计方法</span>
                   <el-radio-group v-model="biz_calc_obj[1].zbxB.staticsType">
                      <el-radio :label="0">求和</el-radio>
                      <el-radio :label="1">计数</el-radio>
                      <el-radio :label="2">最大</el-radio>
                      <el-radio :label="3">最小</el-radio>
                      <el-radio :label="4">平均</el-radio>
                  </el-radio-group>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(1)" v-if="!biz_calc_state[1].dataShow">
                    数据筛选
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/more_products.png" height="16" width="16">
                  </span>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(1)" v-else>
                    收起
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/less_products.png" height="16" width="16">
                  </span>
                </el-row>

                <el-row style="padding:0 15px 15px 15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计字段</span>
                   <el-select size="small"
                        placeholder="请选择"
                        v-model="biz_calc_obj[1].zbxB.staticsField"
                        :clearable="true">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                </el-row>

                <div v-show="biz_calc_state[1].dataShow">
                  <el-row style="padding:5px 15px;">
                    <span>数据筛选设定</span>
                  </el-row>
                  <el-row style="padding:2px 15px;margin: 10px 0;" v-for="(item, index) in biz_calc_obj[1].zbxB.field" :key="index">
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
                            <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('field', 'zbxB', 1)">
                              <i class="el-icon-plus"></i>
                            </span>
                            <span class="buttonControl" @click="dataDel('field', 'zbxB', 1, index)">
                              <i class="el-icon-minus"></i>
                            </span>
                        </el-col>
                      </span>
                  </el-row>

                  <el-row style="padding:2px 15px;margin:10px 0;" v-for="(item, index) in biz_calc_obj[1].zbxB.date" :key="index">
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
                              :clearable="true" >
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
                          <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('date', 'zbxB', 1)">
                            <i class="el-icon-plus"></i>
                          </span>
                          <span class="buttonControl" @click="dataDel('date', 'zbxB', 1, index)">
                            <i class="el-icon-minus"></i>
                          </span>
                      </el-col>
                      </span>
                  </el-row>
                </div>
                <el-row style="margin-bottom:10px">
                    <div align="right">
                        <span  class="scheduleDel"  @click="delIndexNum(1)">
                          删除
                        </span>
                    </div>
                </el-row>
              </el-col>
            </el-row>

            <el-row style="font-size:12px;background:#f2f8ff;border:1px solid #D6E1E5;border-radius:3px;display: flex;align-items:center;margin-top:20px;" v-if="biz_calc_state[2].show">
              <el-col :span="2" style="color:#999;text-align:center;">
                <span style="display:block;width:100%;line-height:32px;">指标项</span>
                <span style="display:block;width:100%">C</span>
              </el-col>
              <el-col :span="22" style="background:#fff;border-left:1px solid #D6E1E5;">
                <el-row style="padding:15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计方法</span>
                   <el-radio-group v-model="biz_calc_obj[2].zbxC.staticsType">
                      <el-radio :label="0">求和</el-radio>
                      <el-radio :label="1">计数</el-radio>
                      <el-radio :label="2">最大</el-radio>
                      <el-radio :label="3">最小</el-radio>
                      <el-radio :label="4">平均</el-radio>
                  </el-radio-group>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(2)" v-if="!biz_calc_state[2].dataShow">
                    数据筛选
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/more_products.png" height="16" width="16">
                  </span>
                  <span style="position:absolute;right:10%;cursor: pointer;" @click="dataShow(2)" v-else>
                    收起
                    <img style="margin-left: 10px;position: relative;vertical-align: text-bottom;" src="../../../../assets/img/less_products.png" height="16" width="16">
                  </span>
                </el-row>

                <el-row style="padding:0 15px 15px 15px;position: relative;margin-bottom: 0px;">
                  <span style="padding-right: 50px; ">统计字段</span>
                   <el-select size="small"
                        placeholder="请选择"
                        v-model="biz_calc_obj[2].zbxC.staticsField"
                        :clearable="true">
                        <el-option
                          v-for="item in weidu_all_list"
                          :key="item.dim_code"
                          :label="item.dim_name"
                          :value="item.dim_code">
                        </el-option>
                    </el-select>
                </el-row>

                <div v-show="biz_calc_state[2].dataShow">
                  <el-row style="padding:5px 15px;">
                    <span>数据筛选设定</span>
                  </el-row>
                  <el-row style="padding:2px 15px;margin: 10px 0;" v-for="(item, index) in biz_calc_obj[2].zbxC.field" :key="index">
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
                            <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('field', 'zbxC', 2)">
                              <i class="el-icon-plus"></i>
                            </span>
                            <span class="buttonControl" @click="dataDel('field', 'zbxC', 2, index)">
                              <i class="el-icon-minus"></i>
                            </span>
                        </el-col>
                      </span>
                  </el-row>

                  <el-row style="padding:2px 15px;margin:10px 0;" v-for="(item, index) in biz_calc_obj[2].zbxC.date" :key="index">
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
                              :clearable="true" >
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
                           <span class="buttonControl" style="margin-left:12px;" @click="dataAdd('date', 'zbxC', 2)">
                             <i class="el-icon-plus"></i>
                            </span>
                          <span class="buttonControl" @click="dataDel('date', 'zbxC', 2, index)">
                            <i class="el-icon-minus"></i>
                          </span>
                      </el-col>
                      </span>
                  </el-row>
                </div>
                <el-row style="margin-bottom:10px">
                    <div align="right">
                        <span  class="scheduleDel"  @click="delIndexNum(2)">
                          删除
                        </span>
                    </div>
                </el-row>
              </el-col>
            </el-row>

            <div align="right">
                <el-button type="primary" class="schedule-add el-icon-plus" @click="addIndexNum()"> 添加监控项</el-button>
            </div>

            <el-row>
              <el-form-item label="监控项计算" prop="biz_calc_exp" label-width="100px"  style="padding-left:5px;margin-bottom:0px;">
                  <el-col :span="18">
                    <el-input v-model="form.biz_calc_exp" placeholder="A"></el-input>
                  </el-col>
                  <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                    <div slot="content">
                      <div>
                        指标项的值由子项计算而来。计算公式如:A+B+C
                      </div>
                    </div>
                    <i class='el-icon-question' style="color: #93D0F7;font-size:20px;position: relative; left: 8px; top: 2px;"></i>
                  </el-tooltip>
              </el-form-item>
            </el-row>
            <el-row>
                <el-form-item align="right" style="margin-top:8px;">
                    <el-button type="primary"  @click="dialogY()" class="schedule-add">确定提交</el-button>
                    <el-button @click="dialogN()" class="schedule-add">取消</el-button>
                </el-form-item>
            </el-row>
          </el-form>
        </div> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import { funTypeOptions, monTypeOptions, bizSysList, dimOptions, triggerOptions, sysTypeOptions } from '../config/options.js'
import themeCalc from '../components/themeCalc.vue'
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
    var biz_calc_exp = (rule, value, callback) => {
      if (this.biz_calc_state[1].show && this.biz_calc_state[2].show) {
        if (value.indexOf('A') < 0 || value.indexOf('B') < 0 || value.indexOf('C') < 0) {
          callback(new Error('计算式中必须包含指标项A和B和C'))
        } else {
          if (!(biz_calc_exp1('1', value) === 'true')) {
            callback(new Error(biz_calc_exp1('1', value)))
          } else {
            callback()
          }
        }
      } else if (this.biz_calc_state[1].show && !this.biz_calc_state[2].show) {
        if (value.indexOf('A') < 0 || value.indexOf('B') < 0) {
          callback(new Error('计算式中必须包含指标项A和B'))
        } else {
          if (!(biz_calc_exp1('2', value) === 'true')) {
            callback(new Error(biz_calc_exp1('2', value)))
          } else {
            callback()
          }
        }
      } else if (!this.biz_calc_state[1].show && this.biz_calc_state[2].show) {
        if (value.indexOf('A') < 0 || value.indexOf('C') < 0) {
          callback(new Error('计算式中必须包含指标项A和C'))
        } else {
          if (!(biz_calc_exp1('3', value) === 'true')) {
            callback(new Error(biz_calc_exp1('3', value)))
          } else {
            callback()
          }
        }
      } else {
        if (value.indexOf('A') < 0) {
          callback(new Error('计算式中必须包含指标项A'))
        } else {
          if (!(biz_calc_exp1('4', value) === 'true')) {
            callback(new Error(biz_calc_exp1('4', value)))
          } else {
            callback()
          }
        }
      }
    }
    var biz_calc_exp1 = (str, value) => {
      if (value.indexOf(' ') >= 0) {
        return '不能填写空格'
      }
      if (str === '1') {
        let reg = /^A[ABC+\-*/><=()]*C$/g
        if (!reg.test(value)) {
          return '首填A指标项尾填C指标项中间填计算表达式加减乘除大小等于括号'
        } else {
          return 'true'
        }
      } else if (str === '2') {
        let reg = /^A[AB+\-*/><=()]*B$/g
        if (!reg.test(value)) {
          return '首填A指标项尾填B指标项中间填计算表达式加减乘除大小等于括号'
        } else {
          return 'true'
        }
      } else if (str === '3') {
        let reg = /^A[AC+\-*/><=()]*C$/g
        if (!reg.test(value)) {
          return '首填A指标项尾填C指标项中间填计算表达式加减乘除大小等于括号'
        } else {
          return 'true'
        }
      } else if (str === '4') {
        let reg = /^A[A+\-*/><=()]*/g
        if (!reg.test(value)) {
          return '首填A指标项中间填计算表达式加减乘除大小等于括号'
        } else {
          return 'true'
        }
      }
    }
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
        if (item.name === value && value !== this.name2) {
          bool = false
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
      // 指标项名称修改
      name2: '',
      // 指标项key修改
      key2: '',
      // 巡检类型列表
      fun_type_options: [],
      // 监控类型列表
      mon_type_options: [],
      // 系统类型列表
      sys_type_options: [],
      // 业务系统列表
      biz_sys_options: [],
      // 维度总列表
      weidu_all_list: [],
      // 时间维度列表
      weidu_time_list: [],
      // 其他维度列表
      weidu_other_list: [],
      // 新增指标项列表对象
      dim_options: {},
      // 触发器列表对象
      trigger_options: {},
      // 主题数据列表
      theme_data_options: [],
      // 保存newTem的旧值方便监听者监听业务
      old_value: '',
      // 第一次新增
      state: false,
      // blur触发新增的对象
      template: {},
      // 第一页的三个值用于表单校验与修改不一样
      newTemplate: {
        name: '',
        description: '',
        type: '4',
        fun_type: '1',
        mon_type: '1',
        sys_type: 'THEME',
        object_ids: ''
      },
      // 设备新增的设备
      device_obj: [],
      // 步骤管理
      active: 0,
      // 已有的指标列表
      tableData: [],
      // 已有的触发器列表
      triggerData: [],
      // 选择的指标项
      indexItems: [],
      // 选择的触发器列表
      triggerItems: [],
      // 新增dialog
      dialogFormVisible: false,
      form: {
        name: '',
        key: '',
        biz_theme_id: '',
        calc_type: '2',
        cycle_value: '',
        cycle_type: '',
        biz_calc_exp: '',
        biz_is_zero: '1',
        group_flag: '1'
      },
      biz_calc_obj: [{
        zbxA: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }, {
        zbxB: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }, {
        zbxC: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }],
      biz_calc_state: [
        {
          show: true,
          dataShow: false
        }, {
          show: false,
          dataShow: false
        }, {
          show: false,
          dataShow: false
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入监控项名称', trigger: 'blur' },
          { min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur' },
          { validator: validateMoniName, trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入监控项Key', trigger: 'blur' },
          { min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur' },
          { validator: validateKey, trigger: 'blur' }
        ],
        biz_theme_id: [
          { required: true, message: '请选择主题数据', trigger: 'change' }
        ],
        cycle_value: [
          { required: true, message: '请输入整数', trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        cycle_type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        biz_calc_exp: [
          { required: true, message: '请输入监控项计算公式', trigger: 'blur' },
          { min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur' },
          { validator: biz_calc_exp, trigger: 'blur' }
        ]
      },
      rules1: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur' },
          { validator: validatename, trigger: 'blur' }
        ],
        description: [
          // { required: true, message: '请输入监控项Key', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        fun_type: [
          { required: true, message: '请选择巡检类型', trigger: 'change' }
        ],
        mon_type: [
          { required: true, message: '请选择监控类型', trigger: 'change' }
        ],
        sys_type: [
          { required: true, message: '请选择系统类型', trigger: 'change' }
        ],
        object_ids: [
          { required: true, message: '请选择关联对象', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    temState () {
      return this.$store.state.homeStore.temState
    }
  },
  methods: {
    // 1 element 相关方法
    changeIndex (val) {
      this.indexItems = val
    },
    changeTrigger (val) {
      this.triggerItems = val
    },
    monChange () {
      this.newTemplate.object_ids = ''
      this.newTemplate.object_ips = ''
    },
    timeChange () {
      let dom = this.$refs.time_input.$el.children[0]
      dom.focus()
      dom.blur()
    },
    calcTypeChange () {
      if (this.form.calc_type === '1') {
        this.form.cycle_value = '1'
        this.form.cycle_type = '1'
        this.biz_calc_state = [
          {
            show: true,
            dataShow: false
          }, {
            show: false,
            dataShow: false
          }, {
            show: false,
            dataShow: false
          }
        ]
        let arr = []
        arr.push(this.biz_calc_obj[0])
        this.biz_calc_obj = arr
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
        zbxA: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }, {
        zbxB: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }, {
        zbxC: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }]
      this.biz_calc_state = [
        {
          show: true,
          dataShow: false
        }, {
          show: false,
          dataShow: false
        }, {
          show: false,
          dataShow: false
        }
      ]
    },
    // 2 业务相关方法
    stepChange (msg) {
      this.active = msg[0]
      this.tableData = msg[1]
    },
    // 设备选择
    goDevices () {
      this.$store.commit('bizTemDevi', this.device_obj)
      this.$router.push('add/addevices')
    },
    // 跳转接入主题数据
    toThematicClick () {
      this.dialogFormVisible = false
      this.$router.push('../theme/add')
    },
    // zbx 数据显示
    dataShow (num) {
      if (this.biz_calc_state[num].dataShow) {
        this.biz_calc_state[num].dataShow = false
      } else {
        this.biz_calc_state[num].dataShow = true
      }
    },
    // 输入信息增加
    dataAdd (str, str1, num) {
      // str: field date str1: zbxA num: 第几项
      if (str === 'field') {
        this.biz_calc_obj[num][str1].field.push({
          field: '',
          fieldComparor: '',
          fieldValue: ''
        })
      } else if (str === 'date') {
        this.biz_calc_obj[num][str1].date.push({
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
    dataDel (str, str1, num, num1) {
      // str: yeild date str1: zbxA num: 第几项 num1: 删除的第几项
      if (this.biz_calc_obj[num][str1][str].length <= 1) {
        this.$alert('必须保留一条数据筛选-字段数据！', '通知', {
          confirmButtonText: '确定'
        })
      } else {
        this.biz_calc_obj[num][str1][str].splice(num1, 1)
      }
    },
    addIndexNum () {
      if (this.form.calc_type === '1') {
        this.$alert('数据到达时不能再添加', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        if (!this.biz_calc_state[1].show) {
          this.biz_calc_state[1].show = true
        } else if (!this.biz_calc_state[2].show) {
          this.biz_calc_state[2].show = true
        } else {
          this.$alert('只能增加三条监控项！', '通知', {
            confirmButtonText: '确定'
          })
        }
      }
    },
    delIndexNum (num) {
      this.biz_calc_state[num].show = false
      if (num === 1) {
        this.$set(this.biz_calc_obj, 1, {
          zbxB: {
            staticsType: 0,
            staticsField: '',
            field: [
              {
                field: '',
                fieldComparor: '',
                fieldValue: ''
              }
            ],
            date: [
              {
                field: '',
                dateComparor: '',
                dateStaticsType: '',
                dateOptionType: '',
                dateValue: '',
                dateInterval: ''
              }
            ]
          }
        })
      } else if (num === 2) {
        this.$set(this.biz_calc_obj, 2, {
          zbxC: {
            staticsType: 0,
            staticsField: '',
            field: [
              {
                field: '',
                fieldComparor: '',
                fieldValue: ''
              }
            ],
            date: [
              {
                field: '',
                dateComparor: '',
                dateStaticsType: '',
                dateOptionType: '',
                dateValue: '',
                dateInterval: ''
              }
            ]
          }
        })
      }
      // this.biz_calc_obj.splice(num, 1)
    },
    next () {
      if (this.active === 0) {
        this.$refs['ruleform1'].validate((valid) => {
          if (valid) {
            if (!this.state) {
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
          } else {
            this.$alert('请正确填写相关选项', '警告', {
              confirmButtonText: '确定'
            })
          }
        })
      } else if (this.active === 1) {
        this.active++
      } else if (this.active === 2) {
        if (this.ruleTrigger()) {
          let obj = JSON.parse(JSON.stringify(this.template))
          Object.assign(obj, this.newTemplate)
          obj.trigger_list = this.formateTrigger(this.triggerData)
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
        }
      }
    },
    prev () {
      this.active--
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
      // this.$confirm('是否保存？').then(() => {
      //   this.dialogFormVisible = false
      // }).catch(() => {
      this.initDim()
      // })
    },
    handleClose () {
      this.initDim()
    },
    initDim () {
      this.form = {
        name: '',
        key: '',
        biz_theme_id: '',
        calc_type: '2',
        cycle_value: '',
        cycle_type: '',
        biz_calc_exp: '',
        biz_is_zero: '1'
      }
      this.name2 = ''
      this.key2 = ''
      this.weidu_time_list = []
      this.weidu_other_list = []
      this.dialogFormVisible = false
      this.biz_calc_obj = [{
        zbxA: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }, {
        zbxB: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }, {
        zbxC: {
          staticsType: 0,
          staticsField: '',
          field: [
            {
              field: '',
              fieldComparor: '',
              fieldValue: ''
            }
          ],
          date: [
            {
              field: '',
              dateComparor: '',
              dateStaticsType: '',
              dateOptionType: '',
              dateValue: '',
              dateInterval: ''
            }
          ]
        }
      }]
      this.biz_calc_state = [
        {
          show: true,
          dataShow: false
        }, {
          show: false,
          dataShow: false
        }, {
          show: false,
          dataShow: false
        }
      ]
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
            this.weidu_time_list.push({
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
            this.biz_calc_obj = JSON.parse(this.form.biz_calc_obj)
            if (this.biz_calc_obj.length > 1) {
              if (this.biz_calc_obj.length === 3) {
                this.biz_calc_state[1].show = true
                this.biz_calc_state[2].show = true
              } else {
                if (!this.biz_calc_obj[1].zbxB) {
                  this.biz_calc_obj.splice(1, 0, {
                    zbxB: {
                      staticsType: 0,
                      staticsField: '',
                      field: [
                        {
                          field: '',
                          fieldComparor: '',
                          fieldValue: ''
                        }
                      ],
                      date: [
                        {
                          field: '',
                          dateComparor: '',
                          dateStaticsType: '',
                          dateOptionType: '',
                          dateValue: '',
                          dateInterval: ''
                        }
                      ]
                    }
                  })
                  this.biz_calc_state[1].show = false
                  this.biz_calc_state[2].show = true
                } else {
                  this.biz_calc_obj.splice(2, 0, {
                    zbxC: {
                      staticsType: 0,
                      staticsField: '',
                      field: [
                        {
                          field: '',
                          fieldComparor: '',
                          fieldValue: ''
                        }
                      ],
                      date: [
                        {
                          field: '',
                          dateComparor: '',
                          dateStaticsType: '',
                          dateOptionType: '',
                          dateValue: '',
                          dateInterval: ''
                        }
                      ]
                    }
                  })
                  this.biz_calc_state[1].show = true
                  this.biz_calc_state[2].show = false
                }
              }
            } else {
              this.$set(this.biz_calc_obj, 1, {
                zbxB: {
                  staticsType: 0,
                  staticsField: '',
                  field: [
                    {
                      field: '',
                      fieldComparor: '',
                      fieldValue: ''
                    }
                  ],
                  date: [
                    {
                      field: '',
                      dateComparor: '',
                      dateStaticsType: '',
                      dateOptionType: '',
                      dateValue: '',
                      dateInterval: ''
                    }
                  ]
                }
              })
              this.$set(this.biz_calc_obj, 2, {
                zbxC: {
                  staticsType: 0,
                  staticsField: '',
                  field: [
                    {
                      field: '',
                      fieldComparor: '',
                      fieldValue: ''
                    }
                  ],
                  date: [
                    {
                      field: '',
                      dateComparor: '',
                      dateStaticsType: '',
                      dateOptionType: '',
                      dateValue: '',
                      dateInterval: ''
                    }
                  ]
                }
              })
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
      for (let i = 0; i < this.triggerData.length; i++) {
        if (str.indexOf(this.triggerData[i].item_id) >= 0) {
          this.triggerData.splice(i, 1)
          i--
        }
      }
    },
    // 模板新增触发器
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

      // let bool = true
      // this.triggerData.forEach((item) => {
      //   if (item.name === '' || item.priority === '' || item.item_id === '' || item.expression === '') {
      //     bool = false
      //   }
      // })
      // return bool
    },
    formateTrigger (arr) {
      let arr1 = JSON.parse(JSON.stringify(arr))
      arr1.forEach((item) => {
        // item.expression = item.express + item.match
        item.status = 'ON'
      })
      return arr1
    },
    // 3 封装的方法
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
      obj.sys_type = this.newTemplate.sys_type
      obj.units = ''
      let arr = []
      for (let i = 0; i < this.biz_calc_obj.length; i++) {
        if (this.biz_calc_state[i].show) {
          arr.push(this.biz_calc_obj[i])
        }
      }
      obj.biz_calc_obj = JSON.stringify(arr)
      return obj
    },
    syncFunc (item) {
      return rbProjectDataServiceFactory.getThemeDetail(item.biz_theme_id).then((obj) => {
        item.theme_name = obj.theme_name
        if (item.calc_type === '1') {
          item.calc_type1 = '数据到达时'
        } else {
          item.calc_type1 = '周期性'
        }
        if (item.delay / 1440 >= 1) {
          item.time_interval = `每${item.delay / 1440}天`
        } else if (item.delay / 60 >= 1) {
          item.time_interval = `每${item.delay / 60}小时`
        } else {
          item.time_interval = `每${item.delay}分钟`
        }
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
      this.fun_type_options = funTypeOptions
      this.mon_type_options = monTypeOptions
      this.sys_type_options = sysTypeOptions
      this.biz_sys_options = bizSysList
      this.dim_options = dimOptions
      this.trigger_options = triggerOptions
      // 设备的主题获取一遍即可
      rbProjectDataServiceFactory.getThemeByObjectType('1').then((res) => {
        this.theme_data_options = res
      })
    },
    pageList () {
      this.tableData = []
      rbProjectDataServiceFactory.detail(`${this.template.template_id}`).then((res) => {
        let arr = JSON.parse(JSON.stringify(res.item_list))
        this.syncExec(arr)
        // arr.forEach((item) => {
        //   // console.log(this.syncFunc(item))
        //   rbProjectDataServiceFactory.getThemeDetail(item.biz_theme_id).then((obj) => {
        //     item.theme_name = obj.theme_name
        //     if (item.calc_type === '1') {
        //       item.calc_type1 = '数据到达时'
        //     } else {
        //       item.calc_type1 = '周期性'
        //     }
        //     if (item.delay / 1440 >= 1) {
        //       item.time_interval = `每${item.delay / 1440}天`
        //     } else if (item.delay / 60 >= 1) {
        //       item.time_interval = `每${item.delay / 60}小时`
        //     } else {
        //       item.time_interval = `每${item.delay}分钟`
        //     }
        //     this.tableData.push(item)
        //   })
        // })
      })
    }
  },
  mounted () {
    this.initData()
    // this.packSend()
  },
  watch: {
    // 得到新增的设备
    temState () {
      if (this.$store.state.homeStore.temState) {
        let str = ''
        let deviceIds = ''
        this.device_obj = this.$store.state.homeStore.bizTemDevices
        this.device_obj.forEach((item) => {
          str += item.name + ','
          deviceIds += item.instanceId + ','
        })
        str = str.slice(0, -1)
        deviceIds = deviceIds.slice(0, -1)
        this.newTemplate.object_ids = deviceIds
        this.newTemplate.object_ips = str
        this.$store.commit('temDevState', false)
      }
    }
    // , newTemplate: {
    //   handler (newValue, oldValue) {
    //     if ((newValue.object_ids !== '') && (newValue.object_ids !== this.old_value)) {
    //       this.old_value = JSON.parse(JSON.stringify(newValue)).object_ids
    //       rbProjectDataServiceFactory.getThemeList({object_id: newValue.object_ids, page_no: 1, page_size: 1000}).then((res) => {
    //         this.theme_data_options = res.result
    //       })
    //     }
    //   },
    //   deep: true
    // }
  },
  components: {
    themeCalc
  }
}
</script>

<style lang="scss" scoped>
/deep/ .form-step.yw-form {
  .el-form-item {
    width: 380px;
    margin: 0 auto 20px;
  }
  .btn-wrap {
    text-align: center;
  }
}
.schedule-add {
  margin-top: 15px;
}
.scheduleDel {

}
</style>
