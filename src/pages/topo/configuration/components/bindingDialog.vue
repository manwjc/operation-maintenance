<template>
  <div class="component">
    <el-container>
      <el-header>
        <el-steps :active="active" finish-status="success">
          <el-step title="选择设备"></el-step>
          <el-step title="选择指标"></el-step>
          <el-step title="统计配置"></el-step>
        </el-steps>
      </el-header>

      <div class="deviceDiv" v-if="active == 0">
        <el-main>
          <div :is="chooseMore" :deviceList="deviceList" @changeDeviceList="changeDeviceList"></div>
        </el-main>
        <el-footer style="height: 40px;text-align: center;">
          <el-button @click="nextStep()">下一步</el-button>
        </el-footer>
      </div>
      <div class="itemDiv" v-if="active == 1">
        <el-main>
          <choose-item :deviceList="deviceList" :itemList="itemList" @changeItemList="changeItemList"></choose-item>
        </el-main>
        <el-footer style="height: 40px;text-align: center;">
          <el-button @click="upperStep()">上一步</el-button>
          <el-button @click="nextStep()">下一步</el-button>
        </el-footer>
      </div>
      <div class="configDiv" v-if="active == 2">
        <el-main v-if="this.dialogData.bandType == 0">
          <el-form :model="bindData"  class="yw-form yw-select-form" ref="ruleForm" label-width="100px" >
            <el-form-item prop="name" label="名称" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <el-input type="text" v-model="bindData.name"></el-input>
            </el-form-item>
            <el-form-item label="告警显示值设置">
              <el-checkbox-group v-model="bindData.alertLevelList" @change="alertListChangeEvent()">
                <el-checkbox label="2" value="2">低</el-checkbox>
                <el-checkbox label="3" value="3">中</el-checkbox>
                <el-checkbox label="4" value="4">高</el-checkbox>
                <el-checkbox label="5" value="5">重大</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="异常动态显示">
               <el-checkbox v-model="bindData.colorView">
                 是否启动
               <el-tooltip placement="top" effect="light" popper-class="thematicData-debug-help">
                        <div slot="content" >勾选启动颜色配置，告警值大于零时，小图标和线条显示红色</div>
                        <i class='el-icon-question' style="color: #93D0F7;font-size:16px;vertical-align: text-top;"></i>
                      </el-tooltip>
               </el-checkbox>
            </el-form-item>
          </el-form>
        </el-main>
        <el-main v-if="this.dialogData.bandType == 1">
          <el-form :model="bindData" class="yw-form yw-select-form" ref="ruleForm"
              label-width="70px" :inline="true">
            <el-form-item prop="name" label="名称" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <el-input type="text" v-model="bindData.name" placeholder></el-input>
            </el-form-item>
            <el-form-item prop="unit" label="单位" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <el-input type="text" v-model="bindData.unit" placeholder></el-input>
            </el-form-item>
            <el-form-item label="换算">
                <el-select style="width:120px" v-model="bindData.conversionType" placeholder="请选择" >
                  <el-option label="相乘" value="1"></el-option>
                  <el-option label="相除" value="2"></el-option>
                </el-select>
                <el-input type="number" v-model="bindData.conversionVal" style="width:150px;"/>
                <!--<el-select style="width:120px" v-model="transunit" @change="transunitChange" placeholder="请选择" v-if="unitList.length>0">-->
                    <!--<el-option :key="index" :label="item.name" :value="item.val" v-for="(item,index) in unitList">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </el-form-item>
            <el-form-item
              prop="countType"
              label="统计方式"
              :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <el-select v-model="bindData.countType" placeholder="请选择">
                <el-option label="最大" value="max"></el-option>
                <el-option label="最小" value="min"></el-option>
                <el-option label="平均" value="avg"></el-option>
                <el-option label="求和" value="sum"></el-option>
              </el-select>

              <el-checkbox style="padding-left: 20px; width: 400px" v-model="bindData.valueView">是否显示监控值</el-checkbox>
            </el-form-item>
            <el-form-item label="设置阀值">
              <el-button class="device-add" type="primary" @click="addSill()">新增</el-button>
              <el-button class="device-del" type="primary" @click="deleteSill()">删除</el-button>
            </el-form-item>
            <el-table
              :data="sillList"
              border
              style="margin-top:20px;">
              <el-table-column
                prop="name"
                label="表达式定义"
                align="center">
                <template slot-scope="scope">
                  <el-input class="dom" v-model="sillList[scope.$index].expression"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="color"
                label="颜色设置"
                align="center">
                <template slot-scope="scope">
                  <el-color-picker v-model="sillList[scope.$index].color"></el-color-picker>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-main>
        <el-footer style="height: 40px;text-align: center;">
          <el-button @click="upperStep()">上一步</el-button>
          <el-button type="primary" @click="submit()">完成</el-button>
        </el-footer>
      </div>
    </el-container>
  </div>
</template>
<script>
  // import monitorServiceFactory from 'src/services/deploy'
  import treeComplete from './treeComplete.vue' // 全加载的一棵树
  import chooseItem from './choose-item.vue'

  export default {
    props: ['dialogData', 'formData'],
    components: {
      treeComplete,
      chooseItem,
      chooseMore: () => import('./choose-more.vue')
    },
    watch: {
      dialogData: {
        handler(newValue, oldValue) {
          this.active = 0
          this.sillList = this.dialogData.sillList ? JSON.parse(this.dialogData.sillList) : []
          this.bindData.name = this.dialogData.name ? JSON.parse(this.dialogData.name) : null
          this.bindData.unit = this.dialogData.unit ? JSON.parse(this.dialogData.unit) : null
          this.bindData.conversionType = this.dialogData.conversionType ? JSON.parse(this.dialogData.conversionType) : null
          this.bindData.conversionVal = this.dialogData.conversionVal ? JSON.parse(this.dialogData.conversionVal) : null
          this.bindData.valueView = this.dialogData.valueView ? JSON.parse(this.dialogData.valueView) : false
          this.bindData.colorView = this.dialogData.colorView ? JSON.parse(this.dialogData.colorView) : false
          this.bindData.countType = this.dialogData.countType ? JSON.parse(this.dialogData.countType) : null
          this.bindData.alertLevelList = this.dialogData.alertLevelList ? JSON.parse(this.dialogData.alertLevelList) : []
          this.deviceList = this.dialogData.deviceList ? JSON.parse(this.dialogData.deviceList) : []
          this.itemList = this.dialogData.itemList ? JSON.parse(this.dialogData.itemList) : []
          this.$forceUpdate()
        },
        deep: true
      }
    },
    data() {
      return {
        transunit: '',
        unitList: [],
        sillList: this.dialogData.sillList ? JSON.parse(this.dialogData.sillList) : [],
        bindData: {
          name: this.dialogData.name ? JSON.parse(this.dialogData.name) : '',
          unit: this.dialogData.unit ? JSON.parse(this.dialogData.unit) : '',
          conversionType: this.dialogData.conversionType ? JSON.parse(this.dialogData.conversionType) : null,
          conversionVal: this.dialogData.conversionVal ? JSON.parse(this.dialogData.conversionVal) : null,
          valueView: this.dialogData.valueView ? JSON.parse(this.dialogData.valueView) : false,
          colorView: this.dialogData.colorView ? JSON.parse(this.dialogData.colorView) : false,
          countType: this.dialogData.countType ? JSON.parse(this.dialogData.countType) : null,
          alertLevelList: this.dialogData.alertLevelList ? JSON.parse(this.dialogData.alertLevelList) : []
        },
        deviceList: this.dialogData.deviceList ? JSON.parse(this.dialogData.deviceList) : [],
        itemList: this.dialogData.itemList ? JSON.parse(this.dialogData.itemList) : [],
        chooseMore: 'chooseMore',
        currentType: [],
        data: {},
        treeData: '',
        openType: 2,
        boolTree: true,
        loading: false,
        treeList: [],
        search: '',
        active: 0,
        treeParams: {
          deviceId: null,
          openType: null,
          needStationTree: true,
          needDeviceTree: true
        },
        // 树相关
        defaultProps: {
          label: 'name',
          children: 'children',
          isLeaf: 'isParent'
        },
        resourceCheckedKey: [],
        defaultExpanded: [],
        // 修改的对话框
        defaultOptions: {}
      }
    },
    mounted() {
      this.active = 0
    },
    methods: {
      transunitChange(val) {
        if (val) {
          let v = val.split('_')
          this.bindData.conversionType = v[1] + ''
          this.bindData.conversionVal = v[0]
          let o = this.unitList.find(u => {
            return u.val === val
          })
          if (o) {
            this.item.report_unit = o.name
          }
        }
      },
      // loadDialogData(data)
      alertListChangeEvent() {
        if (this.bindData.alertLevelList.length === 0) {
          this.bindData.valueView = false
        } else {
          this.bindData.valueView = true
        }
      },
      submit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) {
            return false
          }
        })
        this.bindData.sillList = this.sillList
        this.bindData.deviceList = this.deviceList
        this.bindData.itemList = this.itemList
        this.bindData.isBind = true
        this.bindData.bandType = this.dialogData.bandType
        this.$emit('backBindData', this.bindData)
        this.$emit('close', true)
      },
      changeDeviceList(data) {
        this.deviceList = data
      },
      changeItemList(data) {
        this.itemList = data
      },
      addSill() {
        if (this.sillList.length >= 5) {
          this.$message.warning('阀值设置不能超过五个')
          return
        }
        this.sillList.push({expression: '', color: ''})
        this.bindData.colorView = true
      },
      deleteSill() {
        if (this.sillList.length > 0) {
          this.sillList.splice(this.sillList.length - 1, 1)
          if (this.sillList.length === 0) {
            this.bindData.colorView = false
          }
        }
      },
      nextStep() {
        // 必须选择设备IP才能选择监控项
        if (this.active === 0) {
          if (this.deviceList.length === 0) {
            this.$message.warning('请选择IP设备后前往下一步')
            return
          }
        } else if (this.active === 1) {
          // 必须选择监控项才可以配置统计
          if (this.itemList.length === 0 && this.dialogData.bandType === 1) {
            this.$message.warning('请选择监控项前往下一步')
            return
          }
        }
        this.active = this.active + 1
      },
      upperStep() {
        this.active = this.active - 1
      },
      // sendData() {
      //   this.dialogData.type === 'node' ? this.data = Object.assign(this.treeData, this.viewFormData) : this.data = this.treeData
      //   this.fetchData()
      //   this.$emit('backBindData', this.data)
      //   this.$emit('close', true)
      // },
      cancel() {
        this.$emit('close', true)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .component {
    display: flex;
    flex-direction: column;
    .search {
      .el-autocomplete {
        width: 90%;
        height: 30px;
        font-size: 12px;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 15px;
        /deep/ input {
          border: 1px solid rgba(220, 223, 230, 1);
          border-radius: 8px;
        }
        /deep/ .el-input__icon {
          color: #46bafe;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }
      }
    }
    .top {
      border-radius: 10px;
      background: #fff;
      padding: 14px 0 20px 0;
      margin: 0 20px;
      /deep/ .el-tree {
        height: 3.5rem;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 6px;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 0.1rem;
          background: #e2e2e2;
          opacity: 0.42;
        }
        background: unset; // 继承
        .el-tree-node__content {
          font-size: 12px;
          position: relative;
          .buss {
            display: none;
          }
          .labelName {
            vertical-align: middle;
          }
          .span-ellipsis {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
          }
          i {
            display: inline-block;
            width: 0.16rem;
            height: 0.16rem;
            vertical-align: middle;
          }
          /*i.devAlert1 {*/
          /*background: url("../../../../assets/img/devAlert1.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.devAlert2 {*/
          /*background: url("../../../../assets/img/devAlert2.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.devAlert3 {*/
          /*background: url("../../../../assets/img/devAlert3.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.devAlert4 {*/
          /*background: url("../../../../assets/img/devAlert4.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.roomAlert1 {*/
          /*background: url("../../../../assets/img/roomAlert1.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.roomAlert2 {*/
          /*background: url("../../../../assets/img/roomAlert2.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.roomAlert3 {*/
          /*background: url("../../../../assets/img/roomAlert3.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.roomAlert4 {*/
          /*background: url("../../../../assets/img/roomAlert4.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.monitor {*/
          /*background: url("../../../../assets/img/monitor.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.zones {*/
          /*background: url("../../../../assets/img/zones.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.site {*/
          /*background: url("../../../../assets/img/site.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.machine {*/
          /*background: url("../../../../assets/img/machine.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.floor {*/
          /*background: url("../../../../assets/img/floor.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.computer {*/
          /*background: url("../../../../assets/img/computer.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.device1 {*/
          /*background: url("../../../../assets/img/device1.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
          /*i.head {*/
          /*background: url("../../../../assets/img/detail.png") no-repeat;*/
          /*background-size: 100%;*/
          /*}*/
        }
        .el-tree-node__children {
          overflow: unset;
        }
      }
    }
    /deep/ .el-form-item__label {
      font-size: 12px;
    }
    .bottom {
      flex: none;
      height: 2rem;
      background: #f6f6f6;
      .title {
        height: 0.4rem;
        line-height: 0.4rem;
        padding-left: 0.2rem;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
      }
      .el-form {
        margin: 0 0.2rem;
        border-radius: 0.1rem;
        background: #fff;
        padding-top: 0.1rem;
      }
      .el-row {
        height: 0.3rem;
        margin-left: 0.8rem;
        display: flex;
        flex-direction: row;
        /deep/ .el-radio__label {
          font-size: 12px;
          font-family: MicrosoftYaHei;
        }
        .box {
          width: 1.4rem;
        }
      }
    }
    .footer {
      margin-top: 0.15rem;
      flex: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 0.4rem;
      // background-color: pink;
      .sureBtn {
        margin-left: 0.15rem;
      }
    }
  }
</style>
