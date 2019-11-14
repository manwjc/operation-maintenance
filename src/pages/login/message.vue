<template>
  <div class="container-wrap">
    <div class="dialog-wrap">
      <div class="dialog-box">
        <header class="dialog-header">短信登录验证</header>
        <section class="dialog-body">
          <p class="phone-wrap">当前用户手机号码：<span class="phone">{{mobile}}</span></p>
          <div class="sms-wrap">
            <input class="sms-input" type="text" name="sms" v-model="smsCode" placeholder="请输入短信验证码"/>
            <!-- <i class="sms-btn">获取验证码</i> -->
            <i class="sms-btn disabled" v-show="getCodeVisiable">{{count}}s</i>
            <i class="sms-btn" v-show="!getCodeVisiable" @click="getMassageCode">获取验证码</i>
          </div>
          <p class="error-tip" v-if="errorTip">验证码错误，请重新获取</p>
          <div class="btn-wrap">
            <a class="btn" type="button" @click="login">登 录</a>
            <a class="btn btn-gray" type="button" @click="concel">关 闭</a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>


<script>
  import messageService from 'src/services/login/message-service.js'
  export default {
    data () {
      return {
        mobile: sessionStorage.getItem('mobile'),
        getCodeVisiable: false,
        timer: null,
        count: '',
        smsCode: '',
        errorTip: false
      }
    },
    computed: {
      // loginValid () {
      //   return this.$store.state.homeStore.loginValid
      // }
    },
    // watch: {
    //   loginValid: function (newValue) {
    //     debugger
    //     if (newValue) {
    //       this.$router.push({ path: 'home' })
    //     }
    //   }
    // },
    methods: {
      getMassageCode () {
        let param = {}
        param.namespace = sessionStorage.getItem('namespace')
        param.username = sessionStorage.getItem('username')
        param.mobile = sessionStorage.getItem('mobile')
        messageService.sendSmsCaptcha(param).then((res) => {
          this.errorTip = false
          this.getCode()
        }).catch((res) => {
          this.errorTip = true
        })
      },
      getCode () {
         // 处理验证码再次获取倒计时
        const TIME_COUNT = 60
        if (!this.timer) {
          this.getCodeVisiable = true
          this.count = TIME_COUNT
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.getCodeVisiable = false
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
      },
      login () {
        let param = {}
        param.mobile = this.mobile
        if (!this.smsCode || this.smsCode === '') {
          this.$message({
            message: '请输入验证码',
            type: 'error'
          })
          return
        }
        param.validCode = this.smsCode
        messageService.validSmsCaptcha(param).then((res) => {
          this.$message({
            type: 'success',
            message: '登录成功'
          })
          // this.$store.commit('modifyLogValid', true)
          sessionStorage.setItem('logValid', true)
          this.$router.push({ path: 'home' })
        }).catch((res) => {
          this.errorTip = true
        })
      },
      concel () {
        sessionStorage.setItem('logValid', false)
        const redirectUri = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
        const logoutUrl = this.keycloak.createLogoutUrl({
          redirectUri: redirectUri
        })
        window.location.href = logoutUrl
      }
    }
  }
</script>
<style scoped>
  * {
    box-sizing: border-box;
  }

  html,
  body,
  div {
    margin: 0;
    padding: 0;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: 'MicrosoftYaHei'
  }

  .container-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: #02164A url(../../assets/img/bg.png) no-repeat center center;
    background-size: cover;
    z-index: 9999;
  }

  .dialog-box {
    position: absolute;
    width: 600px;
    height: 400px;
    top: 50%;
    left: 50%;
    margin: -200px 0 0 -300px;
    background: #F4F4F4;
    border-radius: 20px;
    overflow: hidden;
  }

  .dialog-header {
    height: 84px;
    background: #46BAFE;
    font-size: 24px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 84px;
    text-align: center;
  }

  .phone-wrap {
    margin: 30px 0;
    font-size: 20px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    text-align: center;
  }

  .phone {
    font-size: 26px;
    font-weight: bold;
    color: rgba(234, 46, 81, 1);
  }

  .sms-wrap {
    position: relative;
    width: 400px;
    height: 40px;
    margin: 0 auto;
    overflow: hidden;
  }

  .sms-input {
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 20px;
    background: transparent;
    width: 100%;
    line-height: 38px;
    padding: 0 150px 0 20px;
  }

  .sms-input:focus {
    outline: none;
    border-color: #46BAFE;
  }

  .sms-btn {
    position: absolute;
    top: 0;
    right: 0px;
    width: 150px;
    height: 40px;
    line-height: 38px;
    text-align: center;
    background: #E5E5E5;
    font-size: 16px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    font-style: normal;
    cursor: pointer;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    border: 1px solid rgba(221, 221, 221, 1);
  }

  .sms-btn:hover {
    background: #C6C6C6;
  }

  .sms-btn.disabled {
    cursor: not-allowed;
  }

  .sms-btn.disabled:hover {
    background: #E5E5E5;
  }

  .btn-wrap {
    margin-top: 60px;
    text-align: center;
  }

  .btn-wrap .btn {
    display: inline-block;
    width: 140px;
    height: 40px;
    /*line-height: 40px;*/
    background: #46BAFE;
    font-size: 16px;
    font-weight: 400;
    color: #fff;
    text-align: center;
    border-radius: 20px;
    cursor: pointer;
  }

  .btn-wrap .btn-gray {
    margin-left: 30px;
    background: #fff;
    border: 1px solid rgba(221, 221, 221, 1);
    color: rgba(153, 153, 153, 1);
  }

  .btn-wrap .btn:hover {
    background: #0895ED;
  }

  .btn-wrap .btn-gray:hover {
    background: #fff;
    border-color: #C6C6C6;
  }

  .error-tip {
    text-align: center;
    font-size: 14px;
    color: red;
  }
</style>
