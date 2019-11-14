<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="95px">
      <el-form-item label="过滤器名称">
        <el-input v-model="filterName"
                  placeholder="请输入内容"
                  class="input-tem-name1"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="最后修改时间">
        <el-date-picker v-model="time_range"
                        size="mini"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="time-range"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="create()">新增过滤器</el-button>
      </section>
    </el-form>

    <el-form class="yw-form"
             >
      <div class="table-operate-wrap clearfix">
        <!-- <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-setting"
                   @click="addLogBookConfig=true">值班设置</el-button> -->
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  :data="tableData"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 245px)">
          <el-table-column label="序号"
                           width="50">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>

          <el-table-column prop="name"
                           label="告警过滤器名称">
          </el-table-column>
          <el-table-column prop="creater"
                           label="创建人">
          </el-table-column>
          <el-table-column prop="editer"
                           label="最后修改人">
          </el-table-column>
          <el-table-column prop="updated_at"
                           label="最后修改时间">
          </el-table-column>
          <el-table-column prop="scene_num"
                           label="场景个数">
            <template slot-scope="scope">
              <a href="#"
                 @click="gotoScene(scope.row.name, scope.row.id)">{{scope.row.scene_num}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="note"
                           label="备注">
          </el-table-column>
          <el-table-column prop="region"
                           label="操作">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           title="查看"
                           @click="detail(scope.row.id)"
                           icon="el-icon-tickets"></el-button>
                <el-button type="text"
                           title="编辑"
                           @click="openUpdate(scope.row.id)"
                           icon="el-icon-edit"></el-button>
                <el-button type="text"
                           title="复制"
                           @click="copy(scope.row.id)"
                           icon="fa fa-clone">
                </el-button>
                <el-button type="text"
                           title="删除"
                           @click="deleteFilter(scope.row.id, scope.row.name)"
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
               title="编辑"
               width="500px"
               :visible.sync="editFlag">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 ref="form"
                 :model="form"
                 :rules="rules"
                 v-if="editFlag"
                 label-width="100px">
          <el-form-item label="告警过滤名称"
                        prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note"
                      type="textarea"
                      rows="4"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="submitForm()">确定</el-button>
        <el-button size="small"
                   @click="resetFields()">取消</el-button>
      </section>
    </el-dialog>
    <el-dialog :visible.sync="detailFlag"
               class="yw-dialog"
               title="查看"
               width="400px">
      <el-form class="yw-form"
               ref="form1"
               :model="form"
               label-width="120px">
        <el-form-item label="告警过滤名称">
          <span>{{form.name}}</span>
        </el-form-item>
        <el-form-item label="备注">
          <p>{{form.note}}</p>
        </el-form-item>
      </el-form>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="detailFlag = false">返回</el-button>
      </section>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import rbAlertFilterServicesFactory from 'src/services/alert/rb-alertFilter-services.factory.js'
export default {
  name: '/mirror_alert/filter/list',
  data () {
    return {
      detailFlag: false,
      editFlag: false,
      edit: false,
      form: {},
      filterName: '',
      time_range: [],
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [30, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据,
      editName: '',
      rules: {
        name: [
          { required: true, message: '必填项' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符' },
          { pattern: /^[A-Za-z\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5\\-]*[A-Za-z0-9\u4e00-\u9fa5]$/, message: '格式错误' }
        ]
      }
    }
  },
  methods: {
    resetFields () {
      this.editFlag = false
      this.$refs['form'].resetFields()
    },
    gotoScene (name, id) {
      this.$router.push({ path: '/mirror_alert/filter/scene/list/', query: { filterNameParam: name, filterId: id } })
    },
    openUpdate (id) {
      this.form = {}
      rbAlertFilterServicesFactory.getByKey(id).then((res) => {
        this.form = res
        this.editName = res.name
        this.editFlag = true
        this.edit = true
      })
    },
    copy (id) {
      this.edit = false
      this.form = {}
      rbAlertFilterServicesFactory.getByKey(id).then((res) => {
        this.form = res
        this.form.editer = ''
        this.editFlag = true
      })
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
        order: 'DESC',
        page_no: this.currentPage,
        page_size: this.pageSize,
        sort_name: 'updated_at',
        name: this.filterName
      }
      if (this.time_range !== null && this.time_range.length > 1) {
        page.timeStart = this.time_range[0]
        page.timeEnd = this.time_range[1]
      }

      rbAlertFilterServicesFactory.getList(page).then((res) => {
        this.tableData = res.result
        this.total = res.count
      }).catch(() => {
        this.$message.error('查询失败')
      })
    },
    update () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.editName !== this.form.name) {
            rbAlertFilterServicesFactory.getByName(this.form.name).then((res) => {
              if (res != null && res !== '') {
                this.$message.info('告警过滤器名称已经存在，请重新命名')
                return
              }
              rbAlertFilterServicesFactory.update(this.form.id, this.form).then((res) => {
                this.resetFields()
                this.currentPage = 1
                this.$message.success('修改成功')
                this.$nextTick(() => {
                  this.search()
                })
              }).catch(() => {
                this.$message.error('修改失败')
              })
            })
          } else {
            rbAlertFilterServicesFactory.update(this.form.id, this.form).then((res) => {
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
        }
      })
    },
    deleteFilter (id, name) {
      this.$confirm('删除告警过滤器 ' + name + '?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rbAlertFilterServicesFactory.querySceneByFilterId(id).then((res) => {
          if (res.length > 0) {
            this.$message.warning('请先删除关联的场景！')
          } else {
            rbAlertFilterServicesFactory.delete(id).then((res) => {
              this.total--
              if (this.total === this.pageSize) {
                this.currentPage = 1
              }
              this.$message.success('删除成功')
              this.search()
            }).catch(() => {
              this.$message.error('删除失败')
            })
          }
        })
      })
    },
    detail (id) {
      rbAlertFilterServicesFactory.getByKey(id).then((res) => {
        this.form = res
        this.detailFlag = true
      })
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.edit) {
            this.update()
            return
          } else if (this.form.id) {
            this.copyPost()
            return
          }
          rbAlertFilterServicesFactory.getByName(this.form.name).then((res) => {
            if (res != null && res !== '') {
              this.$message.info('告警过滤器名称已经存在，请重新命名')
              return
            }
            rbAlertFilterServicesFactory.create(this.form).then((res) => {
              this.resetFields()
              this.currentPage = 1
              this.$message.success('新增成功')
              this.$nextTick(() => {
                this.search()
              })
            }).catch((e) => {
              this.$message.error('新增失败')
            })
          })
        }
      })
    },
    copyPost () {
      rbAlertFilterServicesFactory.getByName(this.form.name).then((res) => {
        if (res != null && res !== '') {
          this.$message.info('告警过滤器名称已经存在，请重新命名')
          return
        }
        rbAlertFilterServicesFactory.copy(this.form).then((res) => {
          this.resetFields()
          this.currentPage = 1
          this.$message.success('新增成功')
          this.$nextTick(() => {
            this.search()
          })
        }).catch((e) => {
          this.$message.error('新增失败')
        })
      })
    },
    create () {
      this.edit = false
      this.form = {}
      this.editFlag = true
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .components-condition {
  padding-right: 180px;
}
</style>
