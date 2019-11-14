<template>
  <div class="components-container">
    <el-form :inline="true" :model="AlertVoiceNotifyForm">
      <!--<el-form-item label="选择语言">-->
        <!--<el-select v-model="AlertVoiceNotifyForm.language" placeholder="播放语言">-->
          <!--<el-option label="中文" value="zh_CN"></el-option>-->
          <!--<el-option label="英文" value="en_US"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="播放内容">
        <el-input v-model="AlertVoiceNotifyForm.voiceContent" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="preListen()">预听</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="AlertVoiceNotifyForm" :model="AlertVoiceNotifyForm" label-width="150px" class="yw-form">
      <el-form-item label="是否启用" prop="isOpen">
        <el-radio-group v-model="AlertVoiceNotifyForm.isOpen">
          <el-radio :label="0">不启用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="告警筛选器"
                    prop="alertFilterId">
        <el-select v-model="AlertVoiceNotifyForm.alertFilterId"
                   style="width: 225px;"
                   placeholder="请选择"
                   filterable
                   clearable
                   @change="getAlertFilterScenes()"
                   @clear="clearAlertFilter()">
          <el-option v-for="(val, valIndex) in filterData"
                     :key="val.id"
                     :label="val.name"
                     :value="val.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警筛选场景"
                    prop="alertFilterSceneId">
        <el-select v-model="AlertVoiceNotifyForm.alertFilterSceneId"
                   style="width: 225px;"
                   placeholder="请选择"
                   filterable
                   clearable>
          <el-option v-for="(val, valIndex) in alertFilterScenes"
                     :key="val.sceneId"
                     :label="val.sceneName"
                     :value="val.sceneId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择内容"
                    prop="content">
        <el-select v-model="AlertVoiceNotifyForm.content"
                   style="width: 225px;"
                   multiple
                   collapse-tags
                   placeholder="请选择"
                   filterable
                   clearable>
          <el-option v-for="(val, valIndex) in alertVoiceContent"
                     :key="val.prop"
                     :label="val.label"
                     :value="val.prop"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警持续时长"
                    prop="alertExistTime">
        <el-input style="width: 60px;text-align: center"
          v-model="AlertVoiceNotifyForm.alertExistTime" ></el-input>
        <span style="padding-left: 10px;">分钟</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import rbAlertFilterServicesFactory from 'src/services/alert/rb-alertFilter-services.factory.js'
  import {alert_voice_content} from 'src/pages/mirror_alert/alert/config/options.js'
export default {
  components: {
  },
  props: [
    'alertVoiceNotifyDetail'
  ],
  data () {
    return {
      AlertVoiceNotifyForm: {
        uuid: '',
        language: '',
        voiceContent: 'IT云运维管理平台',
        isOpen: 0,
        alertFilterId: '',
        alertFilterSceneId: '',
        content: [],
        alertExistTime: ''
      },
      AlertVoiceNotifyRule: {
        alertFilterId: [
          { required: true, message: '请选择告警过滤器', trigger: 'change' }
        ],
        alertFilterSceneId: [
          { required: true, message: '请选择告警过滤场景', trigger: 'change' }
        ]
      },
      filterData: [],
      alertFilterScenes: [],
      alertVoiceContent: alert_voice_content,
      isOpenDisabled: false
    }
  },
  mounted: function () {
    this.initFilter()
  },
  methods: {
    initFilter () {
      rbAlertFilterServicesFactory.getAll(true).then((res) => {
        if (res) {
          this.filterData = res
        }
      })
    },
    getAlertFilterScenes () {
      rbAlertFilterServicesFactory.getFilterScene(this.AlertVoiceNotifyForm.alertFilterId).then((res) => {
        this.alertFilterScenes = res
      })
    },
    clearAlertFilter () {
      if (!this.AlertVoiceNotifyForm.alertFilterId) {
        this.AlertVoiceNotifyForm.alertFilterSceneId = ''
      }
    },
    preListen () {
      let msg = new SpeechSynthesisUtterance()
      msg.lang = this.AlertVoiceNotifyForm.language
      msg.text = this.AlertVoiceNotifyForm.voiceContent
      window.speechSynthesis.speak(msg)
    }
  },
  watch: {
    alertVoiceNotifyDetail: {
      handler: function () {
        if (this.alertVoiceNotifyDetail.uuid) {
          this.AlertVoiceNotifyForm.uuid = this.alertVoiceNotifyDetail.uuid
          this.AlertVoiceNotifyForm.language = this.alertVoiceNotifyDetail.language
          this.AlertVoiceNotifyForm.voiceContent = this.alertVoiceNotifyDetail.voiceContent
          this.AlertVoiceNotifyForm.isOpen = this.alertVoiceNotifyDetail.isOpen
          this.AlertVoiceNotifyForm.alertFilterId = this.alertVoiceNotifyDetail.alertFilterId
          this.getAlertFilterScenes()
          this.AlertVoiceNotifyForm.alertFilterSceneId = this.alertVoiceNotifyDetail.alertFilterSceneId
          if (this.alertVoiceNotifyDetail.content) {
            this.AlertVoiceNotifyForm.content = this.alertVoiceNotifyDetail.content.split(',')
          } else {
            this.AlertVoiceNotifyForm.content = ''
          }
          this.AlertVoiceNotifyForm.alertExistTime = this.alertVoiceNotifyDetail.alertExistTime
        } else {
          this.isOpenDisabled = true
        }
      },
      immediate: true
    }

  }
}
</script>
<style scoped lang="scss">
</style>

