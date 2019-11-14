<template>
  <div class="component-container">
    父角色
    <div>
      <el-row>
        <el-col :span="5">
          <el-input v-model="filterKey" placeholder="关键字" style="width: 340px;" id="search">
            <el-button slot="append" icon="el-input__icon el-icon-search" type="primary" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="19">
          <el-button type="primary" class="pull-right" @click="create">创建角色</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="名称" width="500px">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="roleDetail(scope.row.name)"
                  type="text"
                  size="small">
                  {{scope.row.name}}
                  <i class="fa fa-users" aria-hidden="true"></i>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目"width="250px"/>
            <el-table-column prop="created_at" label="创建时间" width="250px"/>
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <el-tooltip content="删除" placement="top">
                  <i class="el-icon-delete" @click="roleDelete(scope.$index, scope.row.name)"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pull-right"
            @size-change="sizeChange"
            @current-change="pageChange"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="page.page_size"
            :current-page="page.current_page"
            :total="page.total"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import rbRoleService from 'src/services/rb-role-service.factory'
  export default {
    data () {
      return {
        tableData: [],
        originTableData: [],
        spaces: [],
        filterKey: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        page: {
          page_size: 20,
          current_page: 1
        },
        form: {
          name: '',
          space: '',
          description: ''
        },
        rules: {
          name: [
            {required: true, message: '必填项'},
            {min: 1, max: 64, message: '长度在 1 到 64 个字符'},
            {pattern: /^[A-Za-z0-9\-_]+$/, message: '只接受A-Za-z0-9-_'}
          ]
        }
      }
    },
    mounted: function () {
      this.loadData()
      this.loadSpaces()
    },
    computed: {
    },
    methods: {
      create: function () {
        this.$router.push('/org/setting/create_role')
      },
      loadData () {
        rbRoleService.roleList({
          page: this.page.current_page,
          page_size: this.page.page_size
        }).then((data) => {
          this.tableData = this.originTableData = data.results
          this.page.total = data.count
        })
      },
      roleDelete ($index, name) {
        this.$confirm('删除角色' + name, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          try {
            rbRoleService.deleteRoles(name).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loadData()
            })
          } catch (e) {
            console.error('Failed to load role_Delete_url', e)
          }
        })
      },
      roleDetail (name) {
        this.$router.push({path: '/org/setting/role_detail', query: {name: this.name}})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-select{
    display: block;
  }
</style>
