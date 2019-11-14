<template>
  <div class="component-container">
    <el-form ref="sumbitForm" :model="values" class="demo-form-inline" :inline="true" label-position="right"
             label-width="180px">
      <el-row>
        <el-form-item v-if="prop.type!=='textarea'" :prop="prop.prop" :label="prop.label" v-for="prop in this.props" :key="prop" :rules="prop.rules">
          <el-col :span=11>
            <!-- select选择框 -->
            <el-select v-if="prop.type==='select'" :label="prop.label" v-model="values[prop.prop]" style="width:150px">
              <el-option v-for="item in prop.option" :key="item.key" :label="item.key" :value="item.value"></el-option>
            </el-select>
            <!-- 日期选择框 -->
            <el-date-picker style="width:150px" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd" size="mini" v-if="prop.type==='datetime'"
                            v-model="values[prop.prop]" :editable="false">
            </el-date-picker>
            <!-- 文本输入框 -->
            <el-input style="width:150px" v-if="prop.type===undefined" v-model="values[prop.prop]"></el-input>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row v-if="prop.type==='textarea'" v-for="prop in this.props" :key="prop">
        <el-col :span=24>
          <el-form-item :prop="prop.prop" :label="prop.label" :rules="prop.rules">
            <!-- 富文本框 -->
            <el-input type="textarea" :rows="4" v-model="values[prop.prop]" style="width: calc(100vmin)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()" class="tem-search1">保存</el-button>
      <el-button type="primary" @click="cancle()" class="tem-search1">取 消</el-button>
    </span>
  </div>
</template>

<script>
  import rbProjectDataServiceFactory from 'src/services/resource/rb-resource-services.factory.js'
  import { isEmptyOrPhone, isEmptyOrInteger, isEmptyOrFloat, isEmptyOrEmail } from '../config/validate.js'
  const token = sessionStorage.getItem('token')
  export default {
    data () {
      return {
        // headers token
        myHeaders: {Authorization: 'Bearer ' + token},
        props: [],
        values: {}
      }
    },
    methods: {
      save () {
        this.$refs['sumbitForm'].validate((valid) => {
          if (valid) {
            rbProjectDataServiceFactory.saveCollect(this.values).then((res) => {
              this.$message.success(`保存成功`)
              this.$router.push({path: 'list', query: {id: '1'}})
            }).catch(() => {
              this.$message.error(`保存失败`)
            })
          } else {
            this.$message.error(`数据格式错误,请修改后提交`)
            return false
          }
        })
      },
      initProps () {
        return [
          {
            prop: 'primary_department',
            label: '一级部门'
          },
          {
            prop: 'secondary_department',
            label: '二级部门'
          },
          {
            prop: 'app_system',
            label: '业务系统'
          },
          {
            prop: 'is_project',
            label: '是否立项',
            placeholder: '请选择',
            type: 'select',
            option: [{key: '已立项', value: '已立项'}, {key: '未立项', value: '未立项'}]
          },
          {
            prop: 'project_time',
            label: '立项时间',
            type: 'datetime'
          },
          {
            prop: 'resource_put_date',
            label: '资源提出时间',
            type: 'datetime'
          },
          {
            prop: 'resource_produce_date',
            label: '资源预期投资时间',
            type: 'datetime'
          },
          {
            prop: 'system_description',
            label: '系统描述'
          },
          {
            prop: 'address_requirement',
            label: '物理局址要求'
          },
          {
            prop: 'vm_model1',
            label: '16核、128G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'vm_model2',
            label: '8核、64G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'vm_model3',
            label: '8核、32G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'vm_model4',
            label: '8核、16G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'vm_model5',
            label: '4核、32G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'vm_model6',
            label: '4核、16G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'vm_model7',
            label: '4核、8G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'vm_model8',
            label: '2核、4G、200G系统',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'pm_low_app_server',
            label: '虚拟机宿主机低端应用服务',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'pm_analytical_server',
            label: '分析型服务器(MPP服务器)(台)',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'pm_distributed_server',
            label: '分布式服务器(Hadoo)',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'pm_cache_server',
            label: '缓存型服务器(台)',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'pm_high_app_server',
            label: '高端应用服务器(台)',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'storage_distributd_file_capacity',
            label: '分布式文件存储(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'storage_distributd_block_performance',
            label: '分布式块存储(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'storage_object_capacity',
            label: '对象存储(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'storage_fc_san_capacity',
            label: 'FC-SAN存储(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'storage_ip_san_capacity',
            label: 'IP-SAN存储(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'storage_fc_san_naked',
            label: 'FC-SAN裸盘(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'storage_ip_san_naked',
            label: 'IP-SAN裸盘(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'storage_back_up',
            label: '备份存储(TB)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'cmnet_address',
            label: 'CMNET地址需求(个)',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'bandwidth_gbps_cmnet',
            label: '至CMNET带宽(Gbps)',
            rules: [{validator: isEmptyOrFloat, trigger: 'blur'}]
          },
          {
            prop: 'ip_address',
            label: 'IP地址需求(个)',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'bandwidth_gbps_ip',
            label: '至IP专网带宽(Gbps)',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'db_mysql',
            label: 'mysql数据库',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'db_mongodb',
            label: 'mongodb数据库',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'db_postgresql',
            label: 'postgresql数据库',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'db_memory',
            label: '内存数据库',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'db_other',
            label: '其它数据库',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'cache_redis',
            label: '分布式缓存redis',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'cache_memcached',
            label: '分布式缓存Memcached',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'info_middleware_activemq',
            label: '消息中间件activemq',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'info_middleware_kafka',
            label: '消息中间件kafka',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'info_middleware_rocketmq',
            label: '消息中间件rockermq',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'app_middleware_apache',
            label: '应用中间件apache',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'app_middleware_jboos',
            label: '应用中间件jboos',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'app_middleware_tomcat',
            label: '应用中间件tomcat',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'balancer_nginx',
            label: 'nginx',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'balancer_haproxy',
            label: 'haproxy',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'server_zookeeper',
            label: '分布式协调服务zookeeper',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'server_etcd',
            label: '分布式协调服务etcd',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'search_middleware_es',
            label: '搜索中间件ES',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'server_docker_registry',
            label: '镜像仓库DockerRegistry',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'stream_jbpm',
            label: '工作流JBPM',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'stream_activity',
            label: '工作流activity',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'image_openjdk',
            label: '镜像openjdk',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'image_python',
            label: '镜像python',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'image_go',
            label: '镜像go',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'image_nodejs',
            label: '镜像nodejs',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'image_ruby',
            label: '镜像ruby',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'image_net',
            label: '镜像net',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'cicd_jenkins',
            label: 'CICDjenkins',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'framework_springcloud',
            label: '开发框架springcloud人',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'framework_other',
            label: '其它开发框架',
            rules: [{validator: isEmptyOrInteger, trigger: 'blur'}]
          },
          {
            prop: 'department_head',
            label: '部门负责人'
          },
          {
            prop: 'inter_contact',
            label: '接口联系人'
          },
          {
            prop: 'phone',
            label: '电话',
            rules: [{validator: isEmptyOrPhone, trigger: 'blur'}]
          },
          {
            prop: 'email',
            label: '邮箱',
            rules: [{validator: isEmptyOrEmail, trigger: 'blur'}]
          },
          {
            prop: 'create_time',
            label: '创建时间',
            type: 'datetime'
          },
          {
            prop: 'special_requirement',
            label: '与前期上报需求有无变化,如有,请说明原因',
            type: 'textarea'
          }
        ]
      }
    },
    mounted () {
      this.props = this.initProps()
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 0px !important;
  }
  .el-form-item {
    margin-bottom: 12px !important;
  }
</style>
