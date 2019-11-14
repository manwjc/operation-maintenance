<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="96px">
      <el-form-item label="收件邮箱服务器">
        <el-input v-model="mail_server"
                  placeholder="请输入内容"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="收件邮箱账号">
        <el-input v-model="receiver"
                  placeholder="请输入内容"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="收件邮箱状态">
        <el-select v-model="active"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option label="启用"
                     value="1"></el-option>
          <el-option label="禁用"
                     value="0"></el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="create">新增</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="deleteFilterBatch">清除</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 275px)">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="receiver"
                           label="收件邮箱账号">
          </el-table-column>
          <el-table-column prop="mail_server"
                           label="邮箱服务器">
          </el-table-column>
          <el-table-column prop="receive_port"
                           label="端口号">
          </el-table-column>
          <el-table-column prop="active"
                           label="状态">
            <template slot-scope="scope">
              {{scope.row.active === 1 ? '启用' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column prop="description"
                           label="描述信息">
          </el-table-column>
          <el-table-column prop="strategy_num"
                           label="采集策略数">
            <template slot-scope="scope">
              <a href="#"
                 @click="gotoScene(scope.row.receiver, scope.row.mail_server)">{{scope.row.strategy_num}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="period"
                           label="周期">
            <template slot-scope="scope">
              {{scope.row.period}}分钟
            </template>
          </el-table-column>
          <el-table-column prop="region"
                           label="操作">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           @click="openUpdate(scope.row.id)"
                           title="编辑"
                           icon="el-icon-edit"></el-button>
                <el-button type="text"
                           @click="deleteFilterScene(scope.row.id, scope.row.receiver)"
                           title="删除"
                           icon="el-icon-delete"></el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-form>

    <!-- dialog -->
    <el-dialog class="yw-dialog"
               :visible.sync="editFlag"
               width="500px"
               title="邮件账号采集设置"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 ref="form"
                 :model="form"
                 :rules="rules"
                 v-if="editFlag"
                 label-width="82px">
          <el-form-item label="邮箱账号"
                        prop="receiver">
            <el-input v-model="form.receiver"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="form.password"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱服务器"
                        prop="mail_server">
            <el-input v-model="form.mail_server"
                      clearable>
              <template slot="append">
                <el-select v-model="form.receive_protocal">
                  <el-option label="pop3"
                             value="0"></el-option>
                  <el-option label="imap"
                             value="1"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="端口号"
                        prop="receive_port">
            <el-input v-model.number="form.receive_port"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="采集状态"
                        prop="active">
            <el-select v-model="form.active"
                       placeholder="请选择"
                       clearable>
              <el-option label="启用"
                         value="1"></el-option>
              <el-option label="禁用"
                         value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集周期"
                        prop="period">
            <el-input v-model.number="form.period">
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="描述信息"
                        prop="description">
            <el-input v-model="form.description"
                      type="textarea"
                      rows="4"
                      clearable></el-input>
          </el-form-item>

        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="submitForm()">创建</el-button>
        <el-button @click="resetFields()">取消</el-button>
      </section>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import rbEmailConfigServicesFactory from 'src/services/alert/rb-emailConfig-services.factory.js'
export default {
  name: '/mirror_alert/emailInfo_receive/list',
  data () {
    return {
      detailFlag: false,
      editFlag: false,
      multipleSelection: [],
      edit: false,
      active: '',
      form: {},
      mail_server: '',
      receiver: '',
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [30, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据,
      rules: {
        receiver: [
          { required: true, message: '请输入邮箱账号' },
          { type: 'email', message: '请输入正确的邮箱账号' }
        ],
        password: [
          { required: true, message: '请输入邮箱密码' }
        ],
        receive_port: [
          { required: true, message: '请输入端口号' },
          { type: 'number', message: '端口号必须为数字值' }
        ],
        period: [
          { required: true, message: '请输入采集周期' },
          { type: 'number', message: '采集周期必须为数字值' }
        ],
        active: [
          { required: true, message: '请选择采集状态' }
        ],
        mail_server: [
          { required: true, message: '请输入邮箱服务器' }
        ]
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    resetFields () {
      this.editFlag = false
      this.$refs['form'].resetFields()
    },
    reset () {
      this.receiver = ''
      this.mail_server = ''
      this.active = ''
    },
    openUpdate (id) {
      this.form = {}
      rbEmailConfigServicesFactory.getByKey(id).then((res) => {
        this.form = res
        this.form.active = this.form.active + ''
        this.form.receive_protocal = this.form.receive_protocal + ''
        this.$forceUpdate()
        this.editName = res.receiver
        this.editFlag = true
        this.edit = true
      })
    },
    copy (id) {
      this.$router.push({ path: '/mirror_alert/filter/scene/add/', query: { sceneId: id, oper: 'copy' } })
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search()
    },
    search () {
      let page = {
        page_no: this.currentPage,
        page_size: this.pageSize,
        receiver: this.receiver,
        mail_server: this.mail_server,
        active: this.active
      }
      if (!this.active) {
        page.active = '-1'
      }
      rbEmailConfigServicesFactory.getList(page).then((res) => {
        this.tableData = res.result
        this.total = res.count
      }).catch(() => {
        this.$message.error('查询失败')
      })
    },
    gotoScene (receiver, mailServer) {
      this.$router.push({ path: '/mirror_alert/emailInfo_receive/receiver-config/list/', query: { receiver: receiver } })
    },
    // 1 element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    deleteFilterBatch (id) {
      if (this.multipleSelection.length < 1) {
        this.$alert('请选择收件邮箱配置进行清除', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('删除收件邮箱配置?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = ''
        this.multipleSelection.forEach(item => {
          if (!ids) {
            ids = item.id
          } else {
            ids += ',' + item.id
          }
        })
        rbEmailConfigServicesFactory.delete(ids).then((res) => {
          this.$message.success('删除成功')
          this.search()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    deleteFilterScene (id, name) {
      this.$confirm('删除收件邮箱 ' + name + '配置?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rbEmailConfigServicesFactory.delete(id).then((res) => {
          this.$message.success('删除成功')
          this.search()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    detail (id) {
      this.$router.push({ path: '/mirror_alert/filter/scene/add/', query: { sceneId: id, detail: 'detail' } })
    },
    create () {
      this.edit = false
      this.form = {
        receive_protocal: '0'
      }
      this.editFlag = true
      this.$forceUpdate()
    },
    update () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          rbEmailConfigServicesFactory.update(this.form).then((res) => {
            if (res.status === -1) {
              this.$message.warning(res.message)
              return
            }
            this.resetFields()
            this.$message.success('修改成功')
            this.currentPage = 1
            this.$nextTick(() => {
              this.search()
            })
          }).catch(() => {
            this.$message.error('修改失败')
          })
        }
      })
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.edit) {
            this.update()
            return
          }
          /* rbEmailConfigServicesFactory.getByName(this.form.name).then((res) => {
            if (res != null && res !== '') {
              this.$message.info('告警过滤器名称已经存在，请重新命名')
              return
            } */
          rbEmailConfigServicesFactory.create(this.form).then((res) => {
            if (res.status === -1) {
              this.$message.warning(res.message)
              return
            }
            this.resetFields()
            this.currentPage = 1
            this.$message.success('新增成功')
            this.$nextTick(() => {
              this.search()
            })
          }).catch((e) => {
            this.$message.error('新增失败')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
