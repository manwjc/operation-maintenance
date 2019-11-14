<template>
  <div class="component-container">
    <div class="rb-detail-container clearfix rb-org-detail-header" aria-hidden="false">
      <div class="pull-left">
        <div v-show="organizationView" class="pull-left" style="margin-right:10px;">
          <!--头像区域-->
          <company-logo></company-logo>
        </div>

        <div class="pull-left">
          <div>
            <h3 v-if="this.notIsAdmin"  v-show="organizationView">{{this.username}}@{{this.namespace}}</h3>
            <h3 v-if="this.isAdmin" class="account-name pull-left" style="width: 250px">
              {{this.namespace}}
            </h3>
          </div>
          <div>
            <div v-show="organizationView">
              <span style="float: left" class="ng-binding">{{this.companyInfo.company}}</span>
            </div>
            <div style="float: left; margin-left: 10px" v-show="organizationView">
              <a v-show="isAdmin"><i class="fa fa-edit" @click="companyInfoView=true"></i></a>
            </div>
          </div>
        </div>
      </div>

      <!--创建时间-->
      <div class="pull-right" style="">
        <div class="ng-binding">
          创建时间
          <span class="ng-binding">{{this.orgnizationInfo.created_at | formatDate}}</span>
        </div>
      </div>
    </div>

    <!--角色、用户、账号信息等组件-->
    <div style="margin-top:20px;">
      <el-row>
        <div class="">
          <el-row>
            <el-tabs v-model="activeName">
              <el-tab-pane label="角色" name="role"><role-list></role-list></el-tab-pane>
              <el-tab-pane label="成员" name="account"><account-list></account-list></el-tab-pane>
              <el-tab-pane label="账号信息" name="information"><account-information></account-information></el-tab-pane>
              <el-tab-pane label="事件" name="event"><event-list v-show="eventView" :type="eventData" :noMassage="true"></event-list></el-tab-pane>
            </el-tabs>
          </el-row>
        </div>
      </el-row>
    </div>

    <el-dialog title="修改公司名称" :visible.sync="companyInfoView" :close-on-click-modal="false">
      <el-form :model="formCompany" ref="formCompany" :label-width="'120px'">
        <el-form-item label="原公司名称" prop="companyName">
          <span>{{this.companyInfo.company}}</span>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName" :rules="[{ required: true,message: '公司名不能为空'},
        {min: 2, max: 64, message: '名称在 2 到 64 个字符'},
        {pattern: /^[\u4e00-\u9fa5a-z0-9\(\)\（\）\_]+$/, message: '公司名称只接受汉字、a-z和0-9_及括号，最小长度2，最大长度64',}]">
          <el-input type="text" v-model="formCompany.companyName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="companyInfoView = false">取 消</el-button>
        <el-button type="primary" @click="updateCompanyName('formCompany')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import roleList from 'src/pages/rbac/role/list/role-list.vue'
  import accountList from 'src/pages/org/setting/list/account-list.vue'
  import accountInformation from 'src/pages/org/setting/information/account-information.vue'
  import orgService from 'src/services/org.js'
  import companyLogo from 'src/pages/org/setting/logo/logo.vue'
  import eventList from 'src/pages/event/list/event-list.vue'
  import permissionService from 'src/services/rb-permission-data-service.factory.js'
  export default {
    components: {
      roleList,
      accountList,
      accountInformation,
      companyLogo,
      eventList
    },
    data () {
      return {
        namespace: '',
        username: '',
        isAdmin: false,
        notIsAdmin: false,
        logoUrl: '',
        activeName: 'role',
        formCompany: {
          companyName: ''
        },
        companyInfo: {
          logo_file: ''
        },
        orgnizationInfo: {},
        companyInfoView: false,
        eventData: 'organization,ldap_sync,ldap_config,project,project_template,role,permission',
        organizationSync_users: false,
        organizationUpdate: false,
        organizationView: false,
        eventView: false
      }
    },
    mounted: function () {
      this.getCompanyInformation()
      this.initPermission()
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
        permissionService.getPermission({
          resource_type: 'event'
        }).then((data) => {
          for (let item of data) {
            if (item === 'event:view') {
              this.eventView = true
            }
          }
        })
      },
      update () {
        this.$router.push({
          path: '/org/setting/logo'
        })
      },
      getCompanyInformation () {
        // 控制显示根账号还是子账号信息
        this.namespace = sessionStorage.getItem('namespace')
        this.username = sessionStorage.getItem('username')
        if (this.namespace === this.username) {
          this.isAdmin = true
          this.notIsAdmin = false
        } else {
          this.notIsAdmin = true
          this.isAdmin = false
        }
        orgService.getCompanyInformation().then((data) => {
          this.companyInfo = data
        })
        orgService.getOrganizationInfo().then((data) => {
          this.orgnizationInfo = data
        })
      },
      updateCompanyName (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              company: this.formCompany.companyName
            }
            orgService.updateCompanyNameEmailPassword(data).then(() => {
              this.$message({
                type: 'success',
                message: '公司名称修改成功'
              })
              this.getCompanyInformation()
            }, (data) => {
              this.$message({
                type: 'error',
                message: data.response.data.errors[0].message
              })
            })
            this.companyInfoView = false
          } else {
            console.log('error update!!')
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
