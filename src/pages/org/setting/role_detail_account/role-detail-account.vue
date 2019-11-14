<template>
  <div class="component-container">
    角色关联成员信息
    <div>
      <el-row>
        <el-col :span="5">
          <el-input placeholder="关键字" style="width: 340px;" id="search">
            <el-button slot="append" icon="el-input__icon el-icon-search" type="primary" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="19">
          <el-button type="primary" class="pull-right">添加用户</el-button>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="用户名">
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="添加时间">
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作">
              <template slot-scope="scope">
                <el-tooltip content="更改密码" placement="top">
                  <i class="el-icon-edit" @click="delete(scope.$index, scope.row.name)"></i>
                </el-tooltip>
                <el-tooltip content="添加角色" placement="top">
                  <i class="el-icon-circle-plus" @click="delete(scope.$index, scope.row.name)"></i>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <i class="el-icon-delete" @click="delete(scope.$index, scope.row.name)"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pull-right"
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
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
