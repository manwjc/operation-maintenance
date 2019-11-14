<template>
  <div class="component-container1">
    <el-form
      ref="form"
      :inline="true"
      :model="form" :rules="formRule" id="elFormId">
      <div class="c1">
        <el-row class="title"><el-col :span="24">基础信息</el-col></el-row>
        <el-row class="con0">
          <el-col :span="24" class="content">
            <!-- <span style="color: #ff0332;line-height: 42px;display:inline-block;">*</span> -->
            <el-form-item class="item-name"
              label="主题数据名称" size="medium" label-width="95px" prop="theme_name">
              <el-input id="name" :maxlength="100" v-model.trim="form.theme_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="con">
          <el-col :span="8" class="content">
            <!-- <span style="color: #ff0332;line-height: 42px;display:inline-block;">*</span> -->
            <el-form-item class="item-name"
              label="关联类型" size="medium" label-width="95px" prop="object_type">
              <el-select
                class="select"
                placeholder="请选择"
                v-model.trim="form.object_type"
                disabled>
                <el-option key="1" label="设备" value="1"></el-option>
                <el-option key="2" label="业务系统" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8" class="content">
            <!-- <span style="color: #ff0332;line-height: 42px;display:inline-block;">*</span> -->
            <el-form-item class="item-name"
              label="接入类型" size="medium" prop="up_type">
              <el-radio-group v-model="form.up_type" class="radio">
                <el-radio :label="'0'">HTTP数据接入</el-radio>
                <el-radio :label="'1'">日志接入</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8" class="content">
            <!-- <span style="color: #ff0332;line-height: 42px;display:inline-block;">*</span> -->
            <el-form-item class="item-name"
              label="关联对象" size="medium" label-width="95px" prop="object_id">
              <el-select
                class="select"
                filterable
                placeholder="请选择"
                v-model.trim="form.object_id"
                @change="bizChange()">
                <el-option v-for="item in bizSysList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="con1">
          <el-col :span="24" class="content">
            <!-- <span style="color: #ff0332;line-height: 39px;display:inline-block;">*</span> -->
            <el-form-item class="item-name"
              label="指定主题编码" size="medium" label-width="95px">
              <el-switch
                v-model="themeBut"
                active-color="#46BAFE"
                active-text="开"
                inactive-color="#D3EFFF"
                inactive-text="关"
                :width="50"
                class="theCode">
              </el-switch>
              <el-input v-show="themeBut" id="name" :maxlength="100" v-model.trim="theme_code1" class="butInp"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="c2">
        <el-row class="title"><el-col :span="24">数据定义</el-col></el-row>
        <el-row class="con2">
          <el-col :span="24" class="content">
            <el-form-item class="item-name"
              label="日志内容：" size="medium">
              <el-input
                type="textarea"
                :autosize="{ maxRows: 6}"
                placeholder="请输入日志校验内容"
                v-model="form.log_content"
                style="width:380%"
                :disabled="ThemeDataTimer1 !== null">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="con0">
          <span>维度设置：</span>
          <el-button type="primary" class="tem-search" style="margin-left:0" @click="addDim()">新增</el-button>
          <el-button type="primary" class="tem-search" @click="ruleDimList()">校验</el-button>
          <el-button type="primary" class="tem-search1" @click="dialogVisible = true">校验结果</el-button>
        </el-row>
        <el-row class="con1">
          <el-table
            :data="form.dim_list"
            border
            style="margin-top:15px">
            <el-table-column
              label="序号"
              align="center"
              width="120">
              <template slot-scope="scope">
                <span>{{Number(scope.$index) + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="match_flag"
              label="表达式类型"
              align="center">
              <template slot-scope="scope">
                <el-select
                  class="select"
                  filterable
                  placeholder="请选择"
                  v-model.trim="form.dim_list[scope.$index].match_flag"
                  @change="matchFlagChange(form.dim_list[scope.$index])">
                  <el-option key="1" label="内置" value="1"></el-option>
                  <el-option key="2" label="自定义" value="2"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="dim_reg"
              label="表达式"
              align="center">
              <template slot-scope="scope">
                <el-input  v-model.trim="form.dim_list[scope.$index].dim_reg" class="" v-if="form.dim_list[scope.$index].match_flag === '2'"></el-input>
                <el-select
                  class="select"
                  filterable
                  placeholder="请选择"
                  v-model.trim="form.dim_list[scope.$index].dim_reg" v-else :disabled="form.dim_list[scope.$index].match_flag !== '1'"
                  @change="dimRegChange(form.dim_list[scope.$index])">
                  <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="dim_code"
              label="维度编码"
              align="center">
              <template slot-scope="scope">
                <el-input  v-model.trim="form.dim_list[scope.$index].dim_code" :disabled="form.dim_list[scope.$index].match_flag !== '1'" :title="form.dim_list[scope.$index].dim_code" class="itemCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="dim_name"
              label="名称"
              align="center">
              <template slot-scope="scope">
                <el-input  v-model.trim="form.dim_list[scope.$index].dim_name" :disabled="form.dim_list[scope.$index].match_flag !== '1'" :title="form.dim_list[scope.$index].dim_name" class="itemCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="dim_type"
              label="字段类型"
              align="center">
              <template slot-scope="scope">
                <el-select
                  class="select"
                  filterable
                  placeholder="请选择"
                  v-model.trim="form.dim_list[scope.$index].dim_type" 
                  :disabled="form.dim_list[scope.$index].match_flag !== '1' || form.dim_list[scope.$index].dim_reg === 'CUSTOMWORD' || form.dim_list[scope.$index].dim_reg === 'NUMBER'">
                  <el-option v-for="item in dimOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <a href="javascript:;" @click="deleteDim(scope.$index)" class="delete">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
<!--         <el-row class="con0" v-for="(dimItem,dimIndex) in form.dim_list" :key="dimIndex">
          <el-col :span="1" class="sz">
            <el-row>
              <el-col>
                <span class="host-step-icon">{{dimIndex+1}}</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="23" class="content">
            <span style="color: #ff0332;line-height: 39px;display:inline-block;">*</span>
            <el-form-item class="item-name"
              label="维度名称" size="medium" label-width="75px" :prop="'dim_list.' + dimIndex + '.dim_name'" :rules="[{validator: validateName, trigger: 'blur'}]">
              <el-input id="name" :disabled="dimIndex==0" :maxlength="100" v-model.trim="dimItem.dim_name" class="inp" placeholder="请选择"></el-input>

              <el-select
                class="select"
                placeholder="请选择"
                v-model.trim="dimItem.dim_type"
                :disabled="dimIndex==0"
                @change="dimChange(dimIndex)">
                <el-option v-for="item in dimOptions" :key="item.code" :label="item.name" :value="item.code" class="select1" :id="dimIndex"></el-option>
              </el-select>
              <span v-if="dimIndex===0" class='host-step-icon-opt' @click="addDim()">+</span>
              <span v-if="dimIndex!==0" class='host-step-icon-opt' @click="deleteDim(dimIndex)">-</span>
            </el-form-item>
          </el-col>
        </el-row> -->
      </div>

      <div class="c3" v-if="form.up_type === '0'">
        <div class="title">
          <span>在线接入调试</span>
          <el-tooltip v-if="!validate" effect="light" content="请先正确完成上方参数录入及维度校验" popper-class="startBut">
              <el-button type="primary" class="but1">开始调试</el-button>
          </el-tooltip>
          <el-button v-else type="primary" class="but2"  @click="validForm()">开始调试</el-button>
        </div>

        <div class="con" v-show="showTest">
          <el-row style="margin-top:40px;display: flex;" class="con1">
            <el-col :span="5" class="head-left">
              <img style="float: left;width: 40px;height: 40px;margin-right:5px;" src="../../../../assets/img/thematicData_jrzj1.png"/>
              <div>
                <div class="thematicData-jszj-jrzj">接入主机
                </div>
                <div v-if="receiveHost" class="head-left-text">{{receiveHost}}</div>
                <div v-else class="head-left-text">接收中...</div>
              </div>
            </el-col>

            <el-col :span="12" class="head-center">
              <el-row>
                <el-col :span="24">
                  <div style="text-align: center;">
                    <div class="thematicData-json-post">JSON格式(UTF-8)</div>
                    <div class="thematicData-json-post-border">&nbsp;</div>
                    <div class="thematicData-json-post">HTTP(POST)</div>
                  </div>
                  <div class="thematicData-json-post-arrow">
                    >
                  </div>
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="7" class="head-right">
              <img style="float: left;width: 45px;height: 40px;margin-right:5px;" src="../../../../assets/img/thematicData.vue_jszj1.png"/>
              <div style="width:276px">
                <div class="thematicData-jszj-jrzj">
                  <el-radio-group v-model="upInterfaceName" size="small">
                    <el-radio-button label="专网地址"></el-radio-button>
                    <el-radio-button label="公网地址"></el-radio-button>
                  </el-radio-group>
                </div>
                <div v-if="upInterfaceName==='专网地址'" class="thematicData-jszj-jrzj">{{upInterfaceObj[0]}}</div>
                <div v-else class="thematicData-jszj-jrzj">{{upInterfaceObj[1]}}</div>
              </div>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px;" class="con2">
            <el-col :span="12" class="schedule-content-left-modify" style="margin-top: 10px;">
              <span class="thematicData-debug-title">发送格式模板</span>

              <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                <div slot="content">
                  <div>
                    SysCode：3001，系统自动给各个业务系统分配了自己的系统编码，根据自己的业务系统传递即可<br/>
                    Time：20180124140000（取值为请求发送方的系统时间即可，此处要求要秒）<br/>
                    SerialNumber：001（0-999即可，可写死或递增）<br/>
                    JCZB_Code：3001010001（前4位是系统编码，后6位系统自动分配，每个业务系统指标编码唯一）<br/>
                    Aggregate_Flag：0（固定传0即可）<br/>
                    Log_Time：201801241400（取值为请求发送方的系统时间即可）<br/>
                    JCZB_Dim_Value；10:201801241400（10为业务指标的字段编码，系统自动分配。201801241400代表业务真实产生的时间，时间长度应该与业务侧定义的监测发送周期匹配上，如业务侧每5分钟发送一次数据，该处的时间长度即为分钟。维度名称类型选择日期，支持格式:yyyyMMddHHmmss、yyyyMMddHHmm、yyyyMMddHH、yyyyMMdd）<br/>
                    JCZB_Value：10（监测指标的值）
                  </div>
                </div>
                <i class='el-icon-question' style="color: #93D0F7;font-size:20px;"></i>
              </el-tooltip>
            </el-col>
            
            <el-col :span="12" class="schedule-content-right-modify">
              <el-row>
                <el-col :span="9">

                  <span class="thematicData-debug-title">在线接收日志</span>
                  <span v-if="isContinue" style="color: #666666;">
                    <img class="thematicData-debug-pause-continue" @click="isContinue=false;" src="../../../../assets/img/pause.png"/>
                    暂停接收
                  </span>
                  <span v-else style="color: #666666;">
                    <img class="thematicData-debug-pause-continue" @click="isContinue=true;" src="../../../../assets/img/continue.png"/>
                    继续接收
                  </span>

                  <div v-if="receiveTime" style="color: #B8CCD3;" class="thematicData-debug-title">{{receiveTime}}</div>
                  <div v-else style="color: #B8CCD3;" class="thematicData-jszj-jrzj">接收中...</div>

                </el-col>

                <el-col :span="5" style="text-align: right;margin-right: 0px;" class="thematicData-debug-title">
                  <span class="thematicData-debug-title">&nbsp;</span>
                  <span v-if="isIpLock">
                    <img class="thematicData-debug-pause-continue"  @click="lockTheme('isIpLock1')" src="../../../../assets/img/lockup.png"/>
                    解锁主机
                  </span>
                  <span v-else>
                    <img class="thematicData-debug-pause-continue" @click="lockTheme('isIpLock0')" src="../../../../assets/img/unlock.png"/>
                    锁定主机
                  </span>

                  <div v-if="receiveHost" style="color: #B8CCD3;" class="thematicData-jszj-jrzj">{{receiveHost}}</div>
                </el-col>

                <el-col :span="5" style="text-align: right;margin-right: 0px;" class="thematicData-debug-title">
                  <span v-if="isYwLock">
                    <img class="thematicData-debug-pause-continue" @click="lockTheme('isYwLock1')" src="../../../../assets/img/lockup.png"/>
                    解锁业务
                  </span>
                  <span v-else>
                    <img class="thematicData-debug-pause-continue" @click="lockTheme('isYwLock0')" src="../../../../assets/img/unlock.png"/>
                    锁定业务
                  </span>

                  <div v-if="receiveBizCode" style="color: #B8CCD3;" class="thematicData-jszj-jrzj">{{receiveBizCode}}</div>
                </el-col>

                <el-col :span="5" style="text-align: right;margin-right: 0px;padding-left: 3%;" class="thematicData-debug-title">
                  <span v-if="isZbLock">
                    <img class="thematicData-debug-pause-continue" @click="lockTheme('isZbLock1')" src="../../../../assets/img/lockup.png"/>
                    解锁指标
                  </span>
                  <span v-else>
                    <img class="thematicData-debug-pause-continue" @click="lockTheme('isZbLock0')" src="../../../../assets/img/unlock.png"/>
                    锁定指标
                  </span>

                  <div v-if="receiveJkzbCode" style="color:#B8CCD3;overflow:hidden;text-overflow: ellipsis;white-space:nowrap;" class="thematicData-jszj-jrzj" :title="receiveJkzbCode">{{receiveJkzbCode}}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row class="con3">
            <el-col :span="12" class="schedule-content-left-modify">
              <div id="gsmbDivId">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 14, maxRows: 14}"
                  placeholder="请输入内容"
                  v-model="thematicDataJson">
                </el-input>
              </div>
            </el-col>
            <el-col :span="12" class="schedule-content-right-modify">
              <div id="rizhi">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 14, maxRows: 14}"
                  placeholder="在线接收日志"
                  v-model="messageJsonStr">
                </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px;" class="con4">
            <el-col :span="12" class="schedule-content-left-modify">
              <span class="thematicData-debug-title">日志解析结果</span>
            </el-col>
            <el-col :span="12" class="schedule-content-right-modify">
              <span class="thematicData-debug-title">日志结果校验</span>
            </el-col>
          </el-row>

          <el-row class="con5">
            <el-col :span="12" class="schedule-content-left-modify">
              <el-table :data="dimList" style="border:1px solid #D6E1E5;">
                <el-table-column prop="dimName" label="字段" align="left">
                </el-table-column>
                <el-table-column prop="dimNameValue" label="数据" align="left">
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12" class="schedule-content-right-modify">
              <div id="jiaoyan">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 14, maxRows: 14}"
                  placeholder="日志结果校验"
                  v-model="resInfoIsSucc">
                </el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="hostChart" style="background-color: #f4f4f4;margin-top:20px;">
        <el-button type="primary" @click="submitTheme()" :disabled="!submitBool">提交</el-button>
        <el-button @click="returnList()">返回</el-button>
      </div>
    </el-form>

    <el-dialog :visible.sync="addSuccessDialog" width="30%" :before-close="handleClose" class="dialogsuc">
      <div style="text-align:center">
        <img style="" src="../../../../assets/img/migupic.png"/>
        <div style="margin-top:20px;margin-bottom:35px;font-family: PingFangSC-Regular;font-size: 14px;color: #3B3A3F;line-height: 16px;">恭喜完成主题数据的接入</div>
      </div>
      <div style="text-align:center">
        <el-button @click="continueTheme()" style="color:#46BAFE;border-color:#46BAFE;">继续接入数据</el-button>
        <el-button type="primary" @click="goBack()">返回列表</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="日志校验结果"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose1">
      <el-table :data="dim_result" style="border:1px solid #D6E1E5;">
        <el-table-column prop="dim_cname" label="名称" align="left">
        </el-table-column>
        <el-table-column prop="dim_name" label="维度编码" align="left">
        </el-table-column>
        <el-table-column prop="dim_value" label="数值" align="left">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="tem-search1">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" class="tem-search1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import {dimOptions, dataTypeOptions, upInterfaceObj} from '../config/options.js'
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'

  export default {
    data () {
      var validateTheName = (rule, value, callback) => {
        if (value === this.oldThemeName) {
          callback()
        } else {
          if (value.indexOf(' ') >= 0) {
            callback(new Error('不能填写空格'))
          } else {
            rbProjectDataServiceFactory.getThemeName(value).then((res) => {
              if (res) {
                callback()
              }
            }).catch((error) => {
              if (error.data.errors) {
                callback(new Error('此主题名已存在'))
              } else {
                callback(new Error('网络连接失败'))
              }
            })
          }
        }
      }
      return {
        validateName: function (rule, value, callback) {
          // 得到当前input框是第几个
          let index = rule.field[9]
          // 取到当前options
          let opt = document.getElementsByClassName('select1')
          // arr 指的是当前输入框对应的options
          let arr = []
          Object.keys(opt).forEach(function (key) {
            if (opt[key].id === index) {
              arr.push(opt[key])
            }
          })
          if (value.length <= 0) {
            callback(new Error('不能为空'))
          } else {
            if (arr.length > 0) {
              if (arr[0].className.indexOf('selected') >= 0) {
                callback()
                // let reg = /^[0-9]*$/
                // if (reg.test(value)) {
                //   callback()
                // } else {
                //   callback(new Error('请输入数字'))
                // }
              } else if (arr[1].className.indexOf('selected') >= 0) {
                callback()
              } else if (arr[2].className.indexOf('selected') >= 0) {
                callback()
              } else {
                callback(new Error('请选择类型'))
              }
            }
          }
        },
        // 页面展示的code非真正提交的
        theme_code1: '',
        // 校验结果
        dim_result: [],
        form: {
          theme_name: '',
          object_type: '2',
          index_name: 'ums-ywjd-*',
          object_id: '',
          up_type: '0',
          theme_code: '',
          dim_list: [
            {
              dim_order: 0,
              match_flag: '1',
              dim_reg: '',
              dim_code: '',
              dim_name: '',
              data_type: ''
            }
          ],
          log_content: ''
        },
        // 老名字避免校验重复名冲突
        oldThemeName: '',
        // 在线调试
        showTest: false,
        // 是否显示校验按钮
        validate: false,
        // 业务系统下拉框
        bizSysList: [],
        // 数据类型下拉框
        dataTypeOptions: [],
        // 维度类型下拉框
        dimOptions: [],
        // 公网、专网
        upInterfaceObj: [],
        upInterfaceName: '专网地址',
        // 主题编码按钮
        themeBut: false,
        // 继续接收
        isContinue: true,
        // 锁定主机
        isIpLock: false,
        // 锁定业务
        isYwLock: false,
        // 锁定指标
        isZbLock: false,
        // 第一次才新增
        addBool: true,
        // 新增成功
        addSuccessDialog: false,
        // 查看校验结果
        dialogVisible: false,
        // 避免重复提交
        submitBool: true,
        // 接收主机
        receiveHost: '',
        // 接收时间
        receiveTime: '',
        // 接收业务
        receiveBizCode: '',
        // 接收指标
        receiveJkzbCode: '',
        // 输入内容
        thematicDataJson: '',
        // 在线接收日志
        messageJsonStr: '',
        // 日志解析结果
        dimList: [],
        // 日志校验结果
        resInfoIsSucc: '',
        ThemeDataTimer: null,
        // 开始调试按钮
        ThemeDataTimer1: null,
        // 当前页
        currentPage: 1,
        // 分页每页多少行数据
        pageSize: 5,
        // 每页多少行数组
        pageSizes: [5, 10, 20],
        // 总共多少行数据
        total: 0,
        // 用于在调试时修改维度后取消掉调试
        // ruleFlag: false,
        formRule: {
          theme_name: [
            {required: true, message: '请输入主题名称', trigger: 'blur'},
            {min: 1, max: 33, message: '长度在 1 到 33 个字符', trigger: 'blur'},
            {validator: validateTheName, trigger: 'blur'}
          ],
          object_id: [
            {required: true, message: '请选择关联对象', trigger: 'change'}
          ],
          object_type: [
            {required: true, message: '请选择对象类型', trigger: 'change'}
          ],
          up_type: [
            {required: true, message: '请选择接入方式', trigger: 'click'}
          ]
        }
      }
    },
    methods: {
      // element
      matchFlagChange (item) {
        item.dim_reg = ''
      },
      dimRegChange (item) {
        if (item.dim_reg === 'CUSTOMWORD') {
          this.$set(item, 'dim_type', '2')
        } else if (item.dim_reg === 'NUMBER') {
          this.$set(item, 'dim_type', '1')
        } else {
          this.$set(item, 'dim_type', '')
        }
      },
      bizChange () {
        if (!this.addBool && this.showTest) {
          if (this.theme_code1) {
            this.form.theme_code = this.theme_code1
          } else {
            this.form.theme_code = null
          }
          let str = this.form.theme_id
          let arr = [this.form, str]
          // 当之前点过开始调试新增过一次后，修改，让得到的详情模板数据正确
          rbProjectDataServiceFactory.updateTheme(arr).then((res) => {
            this.oldThemeName = res.theme_name
            this.formateData(res.theme_id)
          })
        }
      },
      dimChange (index) {
        // 当选择维度类型后再触发一次判断
        this.$nextTick(function () {
          let input = document.getElementsByClassName('inp')[index].children[0]
          input.focus()
          input.blur()
        })
      },
      handleClose (done) {
        done()
        this.$router.push('list')
      },
      handleClose1 (done) {
        done()
      },
      // 2 业务逻辑
      addDim () {
        // 新增维度
        let obj = {
          dim_order: 0,
          match_flag: '',
          dim_reg: '',
          dim_code: '',
          dim_name: '',
          data_type: ''
        }
        this.$set(this.form.dim_list, this.form.dim_list.length, obj)
      },
      deleteDim (index) {
        // 删除维度
        this.form.dim_list.splice(index, 1)
      },
      ruleDimList () {
        if (this.form.log_content === '') {
          this.$alert('请输入日志校验内容', '提示', {
            confirmButtonText: '确定'
          })
        } else if (!this.ruleDim()) {
          return false
        } else {
          this.ruleDim1().then((res) => {
            if (res) {
              this.$notify({
                title: '成功',
                message: '日志校验成功',
                type: 'success',
                duration: 2000
              })
              this.timingValidateParam()
            } else {
              this.$notify.error({
                title: '失败',
                message: '日志校验失败',
                duration: 2000
              })
            }
          })
        }
      },
      validForm () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.showTest = true
            if (this.theme_code1) {
              this.form.theme_code = this.theme_code1
            } else {
              this.form.theme_code = null
            }
            for (let i = 0; i < this.form.dim_list.length; i++) {
              this.form.dim_list[i].dim_order = i
              this.form.dim_list[i].dim_order += 1
            }
            if (this.addBool) {
              rbProjectDataServiceFactory.creatTheme(this.form).then((res) => {
                // 判断是否是第一次的新增还是修改
                this.addBool = false
                this.oldThemeName = res.theme_name
                this.formateData(res.theme_id)
              }).catch((error) => {
                this.$message({
                  message: `${error.message ? error.message : '内部服务器失败'}`,
                  type: 'error'
                })
              })
            } else {
              for (let i = 0; i < this.form.dim_list.length; i++) {
                this.form.dim_list[i].dim_order = i
                this.form.dim_list[i].dim_order += 1
              }
              let str = this.form.theme_id
              let arr = [this.form, str]
              rbProjectDataServiceFactory.updateTheme(arr).then((res) => {
                this.oldThemeName = res.theme_name
                this.formateData(res.theme_id)
              })
            }
          } else {
            this.$alert('请正确填写输入信息', '警告', {
              confirmButtonText: '确定'
            })
            return false
          }
        })
      },
      submitTheme () {
        if (this.form.up_type === '0') {
          let str = this.form.theme_id
          this.form.status = '0'
          let arr = [this.form, str]
          // 必须调试过第一次后才可以提交
          if (str) {
            if (this.ThemeDataTimer1) {
              this.submitBool = false
              rbProjectDataServiceFactory.updateTheme(arr).then((res) => {
                this.addSuccessDialog = true
                this.submitBool = true
              }).catch(() => {
                this.submitBool = true
              })
            } else {
              this.$alert('请先完成维度校验', '警告', {
                confirmButtonText: '确定'
              })
            }
          } else {
            this.$alert('请先调试主题', '警告', {
              confirmButtonText: '确定'
            })
          }
        } else {
          // 必须校验通过后才可以提交
          if (this.ThemeDataTimer1) {
            this.submitBool = false
            this.form.status = '0'
            rbProjectDataServiceFactory.creatTheme(this.form).then((res) => {
              if (this.ThemeDataTimer) {
                clearInterval(this.ThemeDataTimer)
              }
              this.addSuccessDialog = true
              this.submitBool = true
            }).catch(() => {
              this.submitBool = true
            })
          } else {
            this.$alert('请先完成维度校验', '警告', {
              confirmButtonText: '确定'
            })
          }
        }
      },
      formateData (str) {
        // 点击完开始调试后 新增主题然后获取详情封装成发送模板
        rbProjectDataServiceFactory.getThemeDetail(str).then((res) => {
          this.form = res
          let timestamp = formatDate(res.create_time).replace(/-/g, '').replace(/:/g, '').replace(/ /g, '')
          // let value = `10:${timestamp.slice(0, -2)};`
          // for (let i = 1; i < res.dim_list.length; i++) {
          //   value += res.dim_list[i].id + ':'
          //   value += 'XX' + res.dim_list[i].dim_name + ';'
          // }
          // value = value.slice(0, -1)
          let jsonStr = `{
      "SysCode":"${res.object_id}",
      "Time":"${timestamp}",
      "ThemeCode":"${res.theme_code}",
      "Datas":["${res.log_content}"]
  }`
          this.thematicDataJson = jsonStr
          // rbProjectDataServiceFactory.creatThemeData(JSON.parse(jsonStr)).then(() => {
          if (!this.isContinue) {
            this.isContinue = true
          }
          // 持续接收主题数据
          this.lockOperator()
          this.$nextTick(() => {
            // this.ruleFlag = true
            this.showTest = true
            this.timingValidateParam()
          })
          // })
        })
      },
      lockTheme (str) {
        let str0 = str.slice(0, -1)
        let str1 = str[str.length - 1]
        if (this.isContinue) {
          if (str0 === 'isIpLock') {
            if (str1 === '0') {
              this.isIpLock = true
              this.lockOperator()
            } else if (str1 === '1') {
              this.isIpLock = false
              this.lockOperator()
            }
          } else if (str0 === 'isYwLock') {
            if (str1 === '0') {
              this.isYwLock = true
              this.lockOperator()
            } else if (str1 === '1') {
              this.isYwLock = false
              this.lockOperator()
            }
          } else if (str0 === 'isZbLock') {
            if (str1 === '0') {
              this.isZbLock = true
              this.lockOperator()
            } else if (str1 === '1') {
              this.isZbLock = false
              this.lockOperator()
            }
          }
        }
      },
      // 封装请求主题数据的方法所需的对象
      lockOperator () {
        let obj = {}
        if (this.isIpLock) {
          if (this.receiveHost) {
            obj.host = this.receiveHost
          }
        }
        if (this.isYwLock) {
          if (this.receiveBizCode) {
            obj.biz_code = this.receiveBizCode
          }
        }
        if (this.isZbLock) {
          if (this.receiveJkzbCode) {
            obj.theme_code = this.receiveJkzbCode
          }
        }
        clearInterval(this.ThemeDataTimer)
        this.getThemeData(obj)
      },
      returnList () {
        this.$router.push('list')
      },
      continueTheme () {
        this.$root.$children[0].$children[0].reload()
      },
      goBack () {
        this.$router.push('list')
      },
      timingValidateParam () {
        // 定时检查相关参数
        this.ThemeDataTimer1 = setInterval(function () {
          var jkzbNameFlag = false
          if (this.form.theme_name !== '' && this.form.theme_name.length >= 1 && this.form.theme_name.length <= 33 && this.form.theme_name.indexOf(' ') < 0) {
            jkzbNameFlag = true
          }

          var bizSystemIdFlag = false
          if ((this.form.object_id + '') !== '') {
            bizSystemIdFlag = true
          }

          var upTypeFlag = false
          if ((this.form.up_type + '') !== '') {
            upTypeFlag = true
          }

          var objectTypeFlag = false
          if ((this.form.object_type + '') !== '') {
            objectTypeFlag = true
          }

          var codeBut = true
          if (this.themeBut && !this.theme_code1) {
            codeBut = false
          }

          if (jkzbNameFlag && bizSystemIdFlag && upTypeFlag && objectTypeFlag && codeBut) {
            this.validate = true
          } else {
            this.showTest = false
            this.validate = false
          }
        }.bind(this), 800)
      },
      // 3 封装的方法
      ruleDim () {
        if (this.form.dim_list.length <= 0) {
          this.$alert('请输入至少一行维度内容', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        var bool = true
        let arr = []
        for (let i = 0; i < this.form.dim_list.length; i++) {
          let item = this.form.dim_list[i]
          if (item.match_flag === '1') {
            if (item.dim_reg === '' || item.dim_code === '' || item.dim_name === '' || item.dim_type === '') {
              this.$alert('请填写完整信息', '提示', {
                confirmButtonText: '确定'
              })
              bool = false
              break
            } else {
              if (arr.indexOf(item.dim_code) < 0) {
                arr.push(item.dim_code)
              } else {
                this.$alert('名称不能重复', '提示', {
                  confirmButtonText: '确定'
                })
                bool = false
                break
              }
            }
          } else if (item.match_flag === '2') {
            if (item.dim_reg === '') {
              this.$alert('请填写完整信息', '提示', {
                confirmButtonText: '确定'
              })
              bool = false
              break
            }
          } else {
            this.$alert('请填写完整信息', '提示', {
              confirmButtonText: '确定'
            })
            bool = false
            break
          }
        }
        return bool
      },
      ruleDim1 () {
        // let str = ''
        let arr = []
        let arr1 = []
        this.form.dim_list.forEach((item) => {
          if (item.match_flag === '1') {
            arr.push(item.dim_code)
          }
        })
        let dim = JSON.parse(JSON.stringify(this.form.dim_list))
        for (let i = 0; i < dim.length; i++) {
          dim[i].dim_order = i
          dim[i].dim_order += 1
        }
        let obj = {
          log_content: this.form.log_content,
          dim_list: JSON.stringify(dim)
        }
        return rbProjectDataServiceFactory.ruleDimList(obj).then((res) => {
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < res.length; j++) {
              if (res[j][arr[i]]) {
                arr1.push(1)
                break
              }
            }
          }
          if (arr.length === arr1.length && arr.length !== 0) {
            // 校验成功填充校验数据
            this.dim_result = []
            res.forEach((item) => {
              this.packResult(item)
            })
            return true
          } else {
            this.dim_result = []
            res.forEach((item) => {
              this.packResult(item)
            })
            return false
          }
        }).catch(() => {
          return false
        })
      },
      packResult (item) {
        for (let j in item) {
          for (let i = 0; i < this.form.dim_list.length; i++) {
            if (this.form.dim_list[i].dim_code === j) {
              let obj = {
                dim_name: j,
                dim_value: item[j],
                dim_cname: this.form.dim_list[i].dim_name
              }
              this.dim_result.push(obj)
              break
            }
          }
        }
      },
      // 4 数据相关方法
      getBizSysList () {
        rbProjectDataServiceFactory.getBizSysList().then((res) => {
          if (res) {
            this.bizSysList = res
          }
        })
      },
      getThemeData (obj1) {
        let obj = {}
        let str = this.form.theme_id
        if (obj1) {
          obj = Object.assign(obj, obj1)
        }
        let arr = [obj, str]
        if (this.ThemeDataTimer) {
          clearInterval(this.ThemeDataTimer)
        }
        this.ThemeDataTimer = setInterval(function () {
          rbProjectDataServiceFactory.getThemeData(arr).then((res) => {
            if (res.resMap) {
              let obj = res.resMap
              let msg = JSON.parse(obj.message)
              this.receiveTime = obj.receive_time
              this.receiveHost = obj.host
              this.receiveBizCode = obj.biz_code
              this.receiveJkzbCode = obj.jkzb_code
              this.messageJsonStr = `{
      "SysCode":"${msg.sysCode}",
      "Time":"${msg.time}",
      "ThemeCode":"${msg.themeCode}",
      "Datas":["${msg.datas}"]
  }`
              if (obj.success === '1') {
                this.resInfoIsSucc = '校验结果:\r\n' + '日志校验失败(' + obj.desc + ')'
              } else if (obj.success === '0') {
                this.resInfoIsSucc = '校验结果:\r\n' + '日志校验成功。'
              }
              this.dimList = []
              if (obj.dim_list) {
                for (let i = 0; i < obj.dim_list.length; i++) {
                  let obj1 = {
                    dimName: obj.dim_list[i].dimName,
                    dimNameValue: obj.dim_list[i].dimValue
                  }
                  this.dimList.push(obj1)
                }
              }
              if (obj.biz_code != null) {
                let dimSysCodeObj = {}
                dimSysCodeObj.dimName = '业务系统编码'
                dimSysCodeObj.dimNameValue = obj.biz_code
                this.dimList.push(dimSysCodeObj)
              }
              if (obj.jkzb_code != null) {
                let dimYwzbObj = {}
                dimYwzbObj.dimName = '业务指标编码'
                dimYwzbObj.dimNameValue = obj.jkzb_code
                this.dimList.push(dimYwzbObj)
              }
              if (obj.jkzb_value != null) {
                let dimValueObj = {}
                dimValueObj.dimName = '值'
                dimValueObj.dimNameValue = obj.jkzb_value
                this.dimList.push(dimValueObj)
              }
            }
          })
        }.bind(this), 3000)
      },
      initData () {
        this.getBizSysList()
        this.dimOptions = dimOptions
        this.dataTypeOptions = dataTypeOptions
        this.upInterfaceObj = upInterfaceObj
      }
    },
    watch: {
      isContinue (newValue) {
        if (newValue) {
          this.lockOperator()
        } else {
          clearInterval(this.ThemeDataTimer)
        }
      },
      themeBut (newValue) {
        if (!newValue && this.showTest) {
          this.theme_code1 = ''
          this.form.theme_code = null
          if (!this.addBool) {
            let str = this.form.theme_id
            let arr = [this.form, str]
            rbProjectDataServiceFactory.updateTheme(arr).then((res) => {
              this.oldThemeName = res.theme_name
              this.formateData(res.theme_id)
            })
          }
        }
      },
      'form.dim_list': {
        handler (value) {
          if (this.showTest) {
            if (this.ThemeDataTimer) {
              clearInterval(this.ThemeDataTimer)
            }
            if (this.ThemeDataTimer1) {
              clearInterval(this.ThemeDataTimer1)
              this.ThemeDataTimer1 = null
            }
            this.validate = false
            this.showTest = false
            // this.ruleFlag = false
          } else {
            this.validate = false
            if (this.ThemeDataTimer1) {
              clearInterval(this.ThemeDataTimer1)
              this.ThemeDataTimer1 = null
            }
          }
        },
        deep: true
      }
    },
    mounted () {
      this.initData()
    },
    destroyed () {
      if (this.ThemeDataTimer) {
        clearInterval(this.ThemeDataTimer)
      }
      if (this.ThemeDataTimer1) {
        clearInterval(this.ThemeDataTimer1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .component-container1{
    #elFormId{
      .c1{
        background-color:#fff;
        margin-bottom:15px;
        .title{
          width:100%;
          font-family: PingFangHK-Medium;
          font-size: 14px;
          color: #333333;
          padding: 15px;
          display: inline-block;
          font-weight: bold;
          border-bottom: 1.2px solid #EEEEEE;
          margin-bottom:22px;
        }
        .con0{
          padding:0 10px 0 30px;
          .content{
            /deep/ .el-form-item__label{
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #999999;
              text-align: left;
              box-sizing: border-box;
              vertical-align: middle;
            }
            /deep/ .el-input__inner{
              height: 30px;
              width: 464%;
            }
          }
        }
        .con{
          padding:0 10px 0 30px;
          .content{
            /deep/ .el-form-item__label{
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #999999;
              text-align: left;
              box-sizing: border-box;
              vertical-align: middle;
            }
            /deep/ .el-input__inner{
              height: 30px;
            }
            /deep/ .el-radio__label{
              font-size:12px;
            }
            .radio{
              /deep/ .el-radio{
                margin-left:0;
              }
            }
          }
        }
        .con1{
          padding:0 10px 0 30px;
          .content{
            /deep/ .el-form-item__label{
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #999999;
              text-align: left;
              box-sizing: border-box;
              vertical-align: middle;
            }
            /deep/ .el-input__inner{
              height: 30px;
              width: 360%;
            }
            .theCode{
              position: relative;
              /deep/ .el-switch__label--left{
                position: absolute;
                left: 29px;
                z-index: 2;
                color:#fff;
                display:none;
              }
              /deep/ .el-switch__label--right{
                position: absolute;
                right: 29px;
                z-index: 2;
                color:#fff;
                display:none;
              }
              /deep/ .is-active{
                display:block;
              }
            }
            .butInp{
              width:auto;
            }
          }
        }
      }
      .c2{
        background-color:#fff;
        margin-bottom:15px;
        padding-bottom:15px;
        .title{
          width:100%;
          font-family: PingFangHK-Medium;
          font-size: 14px;
          color: #333333;
          padding: 15px;
          display: inline-block;
          font-weight: bold;
          border-bottom: 1.2px solid #EEEEEE;
          margin-bottom:22px;
        }
        .con2{
          padding:0 10px 0 30px;
          .content{
            /deep/ .el-form-item__label{
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #999999;
              text-align: left;
              box-sizing: border-box;
              vertical-align: middle;
            }
          }
        }
        .con0{
          padding:0 10px 0 30px;
          span {
            font-family: MicrosoftYaHei;
            font-size: 12px;
            color: #999999;
            font-weight: 700;
            padding-right:9px;
          }
        }
        .con1{
          padding:0 10px 0 30px;
          .content{
            /deep/ .el-form-item__label{
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #999999;
              text-align: left;
              box-sizing: border-box;
              vertical-align: middle;
            }
          }
          /deep/ tbody{
            .delete{
              text-decoration: none;
              color: #46BAFE;
            }
            .itemCode{
              input{
                width: 100%;
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      .c3{
        background-color:#fff;
        padding: 10px 0 20px 0;
        margin-bottom:15px;
        .title{
          span{
            font-family: PingFangHK-Medium;
            font-size: 14px;
            color: #333333;
            padding: 15px;
            display: inline-block;
            font-weight: bold;
          }
          .but1{
            cursor: default;
            background: rgb(248, 251, 255);
            color: rgb(214, 239, 255);
            padding: 0 30px;
            border: 1px solid #C8EBFF;
            height: 30px;
          }
          .but2{
            cursor: pointer;
            padding: 0 30px;
            height: 30px;
          }
        }
        .con{
          font-size:12px;
          color:#666666;
          .con1{
            .head-left{
              display:flex;
              justify-content:center;
              align-items:center;
            }
            .head-center{
              .thematicData-json-post-arrow{
                float: left;
                position: absolute;
                right: -1%;
                top: 26%;
                font-size: 20px;
                color: #F4F4F4;
              }
              .thematicData-json-post{
                font-family: MicrosoftYaHei;
                font-size: 12px;
                color: #999999;
                line-height: 29px;
              }
              .thematicData-json-post-border{
                border: 1px solid #F4F4F4;
                height: 0px;
              }
            }
            .head-right{
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .con2{
            display:flex;
            .schedule-content-left-modify{
              padding:0 10px 0 30px;
            }
            .schedule-content-right-modify{
              padding:0 30px 0 10px;
              .thematicData-debug-pause-continue{
                top: 2px;
                position: relative;
                cursor: pointer;
                vertical-align: baseline;
              }
            }
          }
          .con3{
            .schedule-content-left-modify{
              padding:0 10px 0 30px;
              #gsmbDivId {
                /deep/ textarea{
                  font-family: MicrosoftYaHei;
                  font-size: 12px;
                  color: #666;
                }
              }
            }
            .schedule-content-right-modify{
              padding:0 30px 0 10px;
              #rizhi{
                /deep/ textarea{
                  font-family: MicrosoftYaHei;
                  font-size: 12px;
                  color: #D9E3E7;
                  background:#00446C;
                }
              } 
            }
          }
          .con4{
            .schedule-content-left-modify{
              padding:0 10px 0 30px;
            }
            .schedule-content-right-modify{
              padding:0 30px 0 10px; 
            }
          }
          .con5{
            .schedule-content-left-modify{
              padding:0 10px 0 30px;
            }
            .schedule-content-right-modify{
              padding:0 30px 0 10px; 
              #jiaoyan{
                /deep/ textarea{
                  font-family: MicrosoftYaHei;
                  font-size: 12px;
                  color: #999;
                }
              } 
            }
          }
        }
      }
      .hostChart{
        margin: 15px 0;
        background-color: #FFF;
        font-size: 12px;
        border-radius: 3px;
        .el-button{
          height:30px;
          width:75px;
          padding:8px 15px;
        }
      }
    }
  }
</style>
