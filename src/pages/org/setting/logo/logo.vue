<template>
  <div class="component-container">
    <div>
      <img class="org-user-logo"
           :src="this.base64"
           style="margin-bottom:5px; width:80px ; height: 80px">
    </div>
    <input type="file"
           name="logo_file"
           class="ui button rb-btn-default hidden org-logo-choose-file"/>
    <div v-show="!this.preview" class="text-center">
      <a class="org-edit-logo" href="javascript:void(0)" v-show="isAdmin"
      style="font-size:12px">
      更新头像
      </a>
    </div>
    <div v-if="this.preview"
         class="text-center">
      <button class="ui button tiny rb-btn-default"
              @click="cancelUpdate()"
              :disabled="this.submitting">取消
      </button>
      <button class="ui button tiny rb-btn-primary"
              @click="update()"
              :disabled="this.submitting">保存
      </button>
    </div>
  </div>
</template>

<script>
    import orgService from 'src/services/org.js'
    import rbRoleService from 'src/services/rb-role-service.factory'
    import permissionService from 'src/services/rb-permission-data-service.factory.js'
    export default {
      data () {
        return {
          base64: '',
          preview: false,
          submitting: false,
          fileObj: null,
          dataLogo: {},
          organizationSync_users: false,
          organizationUpdate: false,
          organizationView: false,
          isAdmin: false
        }
      },
      mounted: function () {
        this.initPermission()
        this.init()
        this.link()
      },
      methods: {
        initPermission () {
          this.namespace = sessionStorage.getItem('namespace')
          this.username = sessionStorage.getItem('username')
          if (this.namespace === this.username) {
            this.isAdmin = true
          } else {
            this.isAdmin = false
          }
          permissionService.getPermission({
            resource_type: 'organization'
          }).then((data) => {
            for (let item of data) {
              if (item === 'organization:sync_users') {
                this.organizationSync_users = true
              } else if (item === 'organization:update') {
                this.organizationUpdate = true
              } else if (item === 'organization:view') {
                this.organizationView = true
              }
            }
          })
        },
        init () {
          orgService.getCompanyInformation().then((data) => {
            this.base64 = data.logo_file
          })
        },
        cancelUpdate () {
          orgService.getCompanyInformation().then((data) => {
            this.base64 = data.logo_file
          })
          this.preview = false
          this.fileObj = null
        },
        update () {
          if (this.fileObj) {
            this.submitting = true
            this.dataLogo = {
              files: {
                logo_file: this.base64
              }
            }
            rbRoleService.updateLogo(this.dataLogo).then(() => {
              this.$message({
                type: 'success',
                message: '头像修改成功'
              })
              const headLogo = document.getElementById('rb-user-logo')
              headLogo.attr('src', this.base64)
              this.preview = false
              this.fileOjb = null
            }).catch(() => {
            }).then(() => {
              this.submitting = false
              this.preview = false
            })
          }
        },
        link () {
          const fileInput = document.getElementsByClassName('org-logo-choose-file')[0]
          document.getElementsByClassName('org-edit-logo')[0].addEventListener('click', () => {
            fileInput.click()
          })
          let getBase64Image = (img) => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, img.width, img.height)

            const dataURL = canvas.toDataURL('image/png')
            return dataURL
          }
          let fileChoosed = () => {
            const files = fileInput.files
            if (files && files.length) {
              const file = files[0]
              const reader = new window.FileReader()
              // 为文件读取成功设置事件
              reader.onload = (e) => {
                this.preview = true
                this.filePath = e.target.result
                this.fileObj = file
                const img = document.createElement('img')
                img.src = this.filePath
                img.onload = () => {
                  const data = getBase64Image(img)
                  this.base64 = data
                }
              }
              reader.readAsDataURL(file)
            }
          }
          fileInput.addEventListener('change', fileChoosed)
        }
      }
    }
</script>

<style scoped>

</style>
