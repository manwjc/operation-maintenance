<template>
  <div class="component-container">
    <div class="rb-event-list">
      <div class="rb-event-header">
        <div class="rb-legend-list">
          <div class="rb-legend-item success">
            信息
          </div>
          <div class="rb-legend-item pending">
            告警
          </div>
          <div class="rb-legend-item error">
            错误
          </div>
        </div>
        <div class="rb-form">
          <div class="margin-right-2">
            <img src="../../../../static/img/event/icon_xinxi.png" />首页事件支持轮询刷新
          </div>
          <div style="display: flex">
            <el-input size="small" v-model="queryString" @keyup.enter.native="queryEvents">
              <el-button slot="append" icon="el-icon-search" @click="queryEvents"></el-button>
            </el-input>
          </div>
        </div>
      </div>

      <div class="rb-event-content">
        <ul v-if="events.length > 0" class="rb-event-list">
          <li :class="{'rb-popover-success': item.log_level === 0, 'rb-popover-warnning': item.log_level === 1, 'rb-popover-error': item.log_level === 2}" v-for="(item,index) in events" :key="index">
            <div @click="itemClickEvent(index)" style="cursor: pointer">
              <span class="margin-right-2">{{item.time * 1000 | formatDate}}&nbsp;&nbsp;</span>
              <template v-if="['generic','node'].includes(item.template_id)">
                <span v-html="item.title.massages[0]"></span>
                <a v-if="item.title.routers[0]" @click.self.prevent="redirect(item.title.routers[0])">{{item.title.routers[0].name}}</a>
              </template>
              <template v-if="['sub_resource','build_result','build_v2'].includes(item.template_id)">
                <span v-html="item.title.massages[0]"></span>
                <a v-if="item.title.routers[0]" @click.self.prevent="redirect(item.title.routers[0])">{{item.title.routers[0].name}}</a>
                <span v-html="item.title.massages[1]"></span>
                <a v-if="item.title.routers[1]" @click.self.prevent="redirect(item.title.routers[1])">{{item.title.routers[1].name}}</a>
              </template>
              <template v-if="['build','repo_tag','result','region_status','app_task_result','permission-change','team-update','generic-svoa'].includes(item.template_id)">
                <span v-html="item.title.massages[0]"></span>
                <a v-if="item.title.routers[0]" @click.self.prevent="redirect(item.title.routers[0])">{{item.title.routers[0].name}}</a>
                <span v-html="item.title.massages[1]"></span>
              </template>
              <el-popover
                v-if="item.detail.message"
                placement="top-start"
                trigger="hover">
                <span class="fa fa-commenting item-message-icon" slot="reference">
                </span>
                <span style="color: red">
                  {{item.detail.message}}
                </span>
              </el-popover>
              <span class="item-detail-icon fa"
                    :class="{'fa-caret-right':!item.showDetail, 'fa-caret-down':item.showDetail}"></span>
            </div>
            <div v-show="item.showDetail">
              <pre>{{ item.json }}</pre>
            </div>
          </li>
        </ul>
        <div v-if="events.length === 0 && !noMassage" class="rb-event-not-found">
          <div>
            <h2>找不到事件</h2>
            <hr>
            <ul>
              <li>您可以尝试加*,进行模糊查询;</li>
              <li>当您根据操作类型查询时，可以搜索
                <strong>create</strong>、
                <strong>update</strong>、
                <strong>destroy</strong>、
                <strong>start</strong>、
                <strong>stop</strong>、
                <strong>status_change</strong>等，资源类型可以搜索
                <strong>service</strong>、
                <strong>application</strong>、
                <strong>alarm</strong>、
                <strong>notification</strong>、
                <strong>job_config</strong>、
                <strong>repository</strong>、
                <strong>cluster</strong>等;</li>
              <li>搜索内容仅限于事件数据，展开后可查看其事件数据:</li>
            </ul>
            <ul>
              <li>
                <p>{{ 'event_data_example' | translate }}</p>
                <pre>{
      "resource_name": "EHEtest",
      "resource_id": "ac16c87b-1e14-44a9-b489-5a5f1319bac4",
      "namespace": "claasv1",
      "detail": {
          "operator": "vipertest",
          "operation": "destroy"
      },
      "time": 1466241014.316031,
      "template_id": "generic",
      "resource_type": "service"
  }</pre>
              </li>
            </ul>
          </div>
        </div>
        <div style="display: flex;flex-direction: row-reverse">
          <el-pagination v-if="pagination.total_items" @current-change="currentChange"
                         :current-page.sync="pagination.pageno" :page-size="20" layout="prev, pager, next, jumper"
                         :total="pagination.total_items">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import eventService from 'src/services/event/rb-event-service.factory.js'
//  import orgService from 'src/services/org.js'
import moment from 'moment'
import _ from 'lodash'
import EVENT_MAP from 'src/assets/js/constant/rb_zh_cn.i18n.constant.js'
let eventPolling
export default {
  props: [
    'type', // resource_type: service, multiple resource_types: service,region,node
    'primaryKey', // resource_id
    'noMassage'
  ],
  data () {
    return {
      queryString: '',
      pagination: {
        pageno: 1,
        total_items: 0
      },
      events: []
    }
  },
  mounted: function () {
    // 轮询
    clearInterval(eventPolling)
    this.loadEvents()
    eventPolling = setInterval(() => {
      this.loadEvents()
    }, 30 * 1000)
  },
  destroyed: function () {
    clearInterval(eventPolling)
  },
  methods: {
    currentChange (page) {
      this.loadEvents(page)
    },
    itemClickEvent (index) {
      this.events[index].showDetail = !this.events[index].showDetail
      this.$forceUpdate()
    },
    redirect (router) {
      let link = {}
      if (router.path) {
        link.path = router.path
        if (router.query) {
          link.query = router.query
        }
        this.$router.push(link)
      }
    },
    loadEvents (page = 1, size = 20) {
      this.pagination.pageno = page // watch pageno to support event polling
      const _now = moment()
      const _start = _now.clone().startOf('day').subtract(29, 'days')
      const params = {
        end_time: _now.valueOf(),
        start_time: _start.valueOf(),
        pageno: page,
        size: size
      }
      if (this.primaryKey) {
        params['event_pk'] = this.primaryKey
      }
      if (this.type) {
        const types = this.type.split(',')
        if (types.length > 1) {
          params['event_types'] = this.type
        } else {
          params['event_type'] = this.type
        }
      }
      if (!_.isEmpty(this.queryString)) {
        params['query_string'] = this.queryString
      }

      // 缓存上一次展开的event，下一次轮询扔需要展开
      const showDetailItems = this.events.filter(event => event.showDetail)

      eventService.eventList(params).then((data) => {
        // 在刷新events list前把已经弹出的提示给隐藏
        //          $('.rb-popover-error.popover, .rb-popover-warnning.popover, .rb-popover-success.popover').popover('destroy');
        this.events = data.results
        this.pagination.total_items = data.total_items
        if (this.events.length === 0) {
          return
        }
        _.forEach(this.events, (item) => {
          item.json = this._stringifyDetail(item)
          item.showDetail = !!showDetailItems.find(showDetailItem =>
            showDetailItem.resource_id === item.resource_id && showDetailItem.time === item.time &&
            showDetailItem.detail.attribute === item.detail.attribute)
          item.title = this.generateEventMessage(item)
        })
      })
    },
    _stringifyDetail (detail) {
      return JSON.stringify(detail, null, 4)
    },
    generateEventMessage (item) {
      let link = ''
      let sublink = ''
      const messageTooltip = this._generateMessageTooltip(item)
      const state = this._resourceDetailUrl(item)
      let resource = ''
      let parentResource = ''
      let message
      let title = {
        massages: [],
        routers: []
      }
      let messageAfter
      let messageThird
      const detail = item.detail
      switch (item.template_id) {
        case 'generic':
          if (['project', 'project_template', 'role', 'log_filter'].includes(item.resource_type)) {
            link = item.resource_name
            message = this._generateSubMessage(
              item.detail.operator,
              'event_' + item.detail.operation,
              item.resource_type,
              link
            )
            title.massages.push(message)
          } else {
            message = this._generateSubMessage(
              item.detail.operator,
              'event_' + item.detail.operation,
              item.resource_type
            )
            title.massages.push(message)
            state.name = item.resource_name
            title.routers.push(state)
          }
          break
        case 'sub_resource':
          if (item.detail.parent) {
            resource = this._getResourceLink(item)
            parentResource = this._getParentResourceLink(item.detail.parent)
            message = this._generateSubMessage(
              item.detail.operator,
              `event_${item.detail.operation}`,
              item.detail.parent.resource_type
            )
            messageAfter = this._generateSubMessage(
              '的',
              item.resource_type
            )
            title.massages.push(message)
            title.massages.push(messageAfter)
            title.routers.push(parentResource)
            title.routers.push(resource)
          }
          break
        case 'build':
          state.name = item.resource_id
          message = this._generateSubMessage(
            item.detail.operator,
            'event_' + item.detail.operation,
            item.resource_type
          )
          messageAfter = this._generateSubMessage(
            '的构建',
            item.resource_name
          )
          title.massages.push(message)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        case 'build_result':
          state.name = item.resource_name
          sublink = this._subLinkUrl(item.detail)
          sublink.name = item.detail.sub_resource_name
          messageAfter = this._generateSubMessage(
            '的',
            'build'
          )
          messageThird = this._generateSubMessage(
            'event_' + item.detail.operation,
            item.detail.status
          )
          title.massages.push(item.resource_type)
          title.massages.push(messageAfter)
          title.massages.push(messageThird)
          title.routers.push(state)
          title.routers.push(sublink)
          break
        case 'build_v2':
          state.name = item.resource_name
          sublink = this._subLinkUrl(item.detail)
          sublink.name = item.detail.sub_resource_name
          message = this._generateSubMessage(
            item.detail.operator,
            'event_' + item.detail.operation,
            item.resource_type
          )
          messageAfter = this._generateSubMessage(
            '的',
            'build'
          )
          title.massages.push(message)
          title.massages.push(messageAfter)
          title.routers.push(state)
          title.routers.push(sublink)
          break
        case 'repo_tag':
          state.name = item.resource_name
          message = this._generateSubMessage(
            item.detail.operator,
            'event_' + item.detail.operation,
            item.resource_type
          )
          messageAfter += this._generateSubMessage(
            '的',
            item.detail.sub_resource_type,
            `<span>${item.detail.sub_resource_name}</span>`
          )
          title.massages.push(message)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        case 'node':
          state.name = item.resource_name
          message = this._generateSubMessage(
            item.detail.operator,
            'event_' + item.detail.operation,
            item.resource_type,
            item.namespace + '/' + item.detail.region_display_name + '的'
          )
          title.massages.push(message)
          title.routers.push(state)
          break
        case 'result':
          state.name = item.resource_name
          messageAfter = this._generateSubMessage(
            item.detail.operation,
            item.detail.status
          )
          title.massages.push(item.resource_type)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        case 'service_status':
        case 'region_status':
          state.name = item.resource_name
          messageAfter = this._generateSubMessage(
            item.resource_type,
            link,
            'entered',
            `status_${item.detail.status}`,
            'status'
          )
          title.massages.push(item.resource_type)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        case 'app_task_result':
          state.name = item.resource_name
          item.links = []
          item.flag = false
          item.detail[`sub_resource_${item.flag ? 'id' : 'name'}`]
            .split(',')
            .forEach((e, i) => {
              // if there's not any service
              (item.detail.operation === 'create' && item.detail.status === 'failure')
                ? item.links.push(e)
                : item.links.push(
                  `<a>${item.flag ? item.detail.sub_resource_name.split(',')[i] : e}</a>`)
            })
          item.links = item.links.join(',&nbsp;')
          message = this._generateSubMessage(
            `event_${item.resource_type}`
          )
          messageAfter = this._generateSubMessage(
            'event_of',
            item.detail.sub_resource_type,
            item.links,
            `event_result_${item.detail.operation}`,
            `status_${item.detail.status}`
          )
          title.massages.push(message)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        case 'permission-change':
          state.name = item.resource_name
          message = this._generateSubMessage(
            detail.operator,
            'event_' + detail.operation,
            detail.object_type,
            detail['object'],
            '对',
            item.resource_type
          )
          messageAfter = this._generateSubMessage(
            '的',
            detail.sub_attr_type
          )
          title.massages.push(message)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        case 'team-update':
          state.name = item.resource_name
          message = this._generateSubMessage(
            detail.operator,
            'event_' + detail.operation,
            item.resource_type
          )
          messageAfter = this._generateSubMessage(
            '的',
            detail.sub_attr_type,
            '为'
          )
          title.massages.push(message)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        case 'generic-svoa':
          state.name = item.resource_name
          message = this._generateSubMessage(
            detail.operator,
            'event_' + detail.operation,
            item.resource_type
          )
          messageAfter = this._generateSubMessage(
            '的',
            detail.attribute_type,
            detail.attribute
          )
          title.massages.push(message)
          title.massages.push(messageAfter)
          title.routers.push(state)
          break
        default:
          break
      }
      if (messageTooltip !== '') {
        title.messageTooltip = messageTooltip
      }
      return title
    },
    _generateMessageTooltip (item) {
      if (!item.detail.message) {
        return ''
      } else {
        let popoverClass = ''
        switch (item.log_level) {
          case 0:
            popoverClass = 'rb-popover-success'
            break
          case 1:
            popoverClass = 'rb-popover-warnning'
            break
          case 2:
            popoverClass = 'rb-popover-error'
            break
          default:
            popoverClass = ''
            break
        }
        return `<i class="fa fa-commenting item-message-icon"
                     data-message="${item.detail.message}"
                     data-class="${popoverClass}"/>`
      }
    },
    _resourceDetailUrl (item) {
      let state = {path: '/app_service/app_app/list'}
      if (typeof item === 'undefined') {
        return
      }
      if (!item.resource_type) {
        return
      }
      switch (item.resource_type.toLowerCase()) {
        case 'service':
          state = {
            path: '/app_service/app_service/detail',
            query: {
              service_name: `${item.resource_name || ''}`,
              application: `${item.detail.application || ''}`
            }
          }
          break
        case 'application':
          state = {
            path: '/app_service/app_app/detail',
            query: {
              app_name: `${item.resource_name || ''}`
            }
          }
          break
        case 'node':
          state = {
            path: '/region/node_detail',
            query: {
              regionName: `${item.detail.region_name || ''}`,
              privateIp: `${item.resource_name || ''}`
            }
          }
          break
        case 'notification':
          state = {
            path: '/notification/detail',
            query: {
              name: `${item.resource_name || ''}`
            }
          }
          break
        case 'alarm':
          state = {
            path: '/alert/detail',
            query: {
              alarm_uuid: `${item.resource_id || ''}`
            }
          }
          break
        case 'log_alarm':
          state = {
            path: '/monitor/alarmv2/log_alarm_detail',
            query: {
              uuid: `${item.resource_id || ''}`
            }
          }
          break
        case 'repository':
        case 'repo':
          state = {
            path: '/image/repository/detail',
            query: {
              registryName: `${item.namespace || ''}`,
              repoName: `${item.resource_name || ''}`
            }
          }
          break
        case 'priv_registry':
          state = {
            path: '/image/repository/list',
            query: {
              registry_name: `${item.resource_name || ''}`
            }
          }
          break
        case 'sync_regis_conf':
          state = {
            path: '/image/sync/detail/',
            query: {
              configName: `${item.resource_name}'}`
            }
          }
          break
        case 'sync_regis_history':
          state = {
            path: '/image/sync-his/detail',
            query: {
              historyId: `${item.resource_id}'}`
            }
          }
          break
        case 'build':
          state = {
            path: '/image/build/detail',
            query: {
              build_id: `${item.resource_id || ''}`
            }
          }
          break
        case 'env_file':
          state = {
            path: '/app_service/envfile/detail',
            query: {
              name: `${item.resource_name || ''}`
            }
          }
          break
        case 'application_temp':
          state = {
            path: '/app_service/app_template/detail',
            query: {
              name: `${item.resource_name || ''}`
            }
          }
          break
        case 'config':
          state = {
            path: '/app_service/configuration/detail',
            query: {
              name: `${item.resource_name || ''}`
            }
          }
          break
        case 'team':
          state = {
            path: '/org/team',
            query: {
              orgName: `${item.namespace || ''}`,
              teamName: `${item.resource_name || ''}`
            }
          }
          break
        case 'organization':
        case 'ldap_config':
        case 'ldap_sync':
          state = {
            path: '/org/setting/detail',
            query: {
              orgName: `${item.namespace || ''}`
            }
          }
          break
        case 'pipeline':
        case 'pipeline_config':
          state = {
            path: '/pipeline/config/detail',
            query: {
              name: `${item.resource_name || ''}`
            }
          }
          break
        case 'pipeline_history':
          state = {
            path: '/pipeline/history/detail',
            query: {
              pipelineName: `${item.resource_name || ''}`,
              historyId: `${item.resource_id || ''}`
            }
          }
          break
        case 'builds_config':
          state = {
            path: '/build/build_project/detail',
            query: {
              name: `${item.resource_name || ''}`
            }
          }
          break
        case 'cloud_account':
        case 'cmp':
          state = 'cloud.account.list'
          break
        case 'volume':
          state = {
            path: '/storage/volume/detail',
            query: {
              uuid: `${item.resource_id || ''}`
            }
          }
          break
        case 'snapshot':
          state = {
            path: '/storage/snapshot/list'
          }
          break
        case 'region':
          state = {
            path: '/region/detail',
            query: {
              regionName: `${item.resource_name || ''}`
            }
          }
          break
        case 'feature':
          state = {
            path: '/region/detail',
            query: {
              regionName: `${item.detail.region_name || ''}`
            }
          }
          break
        case 'dashboard':
          state = {
            path: '/monitor/dashboard/state_dashboard_detail',
            query: {
              uuid: `${item.resource_id || ''}`
            }
          }
          break
        case 'space':
        case 'quota':
          state = {
            path: '/resource/quota_space/detail',
            query: {
              name: `${item.resource_name}`
            }
          }
          break
        case 'role':
          state = {
            path: '/org/setting/role_detail',
            query: {
              name: `${item.resource_name}`
            }
          }
          break
        case 'lb':
        case 'load_balancer':
          state = {
            path: '/network/load_balancer/detail',
            query: {
              name: `${item.resource_name}`
            }
          }
          break
        case 'job_config':
          state = {
            path: '/app_service/job/config/detail/',
            query: {
              configName: `${item.resource_name}`
            }
          }
          break
        case 'job_history':
          state = {
            path: '/job/history/detail',
            query: {
              name: `${item.resource_id}`
            }
          }
          break
        case 'integration':
          state = {
            path: '/integration_center/detail',
            query: {
              name: `${item.resource_id}`
            }
          }
          break
      }
      return state
    },
    _generateSubMessage () {
      return _.map(arguments, term => {
        if (term && !term.match(/<a/)) {
          const text = EVENT_MAP[term.toLowerCase()]
          return text || term
        } else {
          return term
        }
      }).join('')
    },
    // using 'sub_accounts' template
    _getResourceLink (event) {
      let state = ''
      switch (event.resource_type) {
        case 'priv_build':
          state = {
            path: '/build/history/detail',
            query: {
              id: `${event.resource_id}`
            },
            name: `${event.resource_id}`
          }
          return state
        case 'pipeline_history':
          state = {
            path: '/pipeline/history/detail',
            query: {
              pipelineName: `${event.detail.parent.resource_name}`,
              historyId: `${event.resource_id}`
            },
            name: `${event.resource_id}`
          }
          return state
        case 'sync_regis_conf':
          state = {
            path: '/image/sync_center/detail',
            query: {
              name: `${event.resource_name}`
            },
            name: `${event.resource_name}`
          }
          return state
        case 'sync_regis_history':
          state = {
            path: '/image/sync_history/detail',
            query: {
              historyId: `${event.resource_id}`
            },
            name: `${event.resource_id}`
          }
          return state
        case 'job_history':
          state = {
            path: '/job/history/detail',
            query: {
              uuid: `${event.resource_id}`
            },
            name: `${event.resource_id}`
          }
          return state
        case 'node':
          state = {
            path: '/cloud/instance/list',
            name: `${event.resource_name}`
          }
          return state
        case 'permission':
          return ''
        case 'parent_role':
          return {name: `${event.resource_name}`}
        default:
          return {name: `${event.resource_id}`}
      }
    },
    // using 'sub_accounts' template
    _getParentResourceLink (parent) {
      if (!parent) {
        return ''
      }
      let state = ''
      switch (parent.resource_type) {
        case 'builds_config':
          state = {
            path: '/build/config/detail',
            query: {
              name: `${parent.resource_name}`
            },
            name: `${parent.resource_name}`
          }
          return state
        case 'pipeline_config':
          state = {
            path: '/pipeline/config/detail',
            query: {
              name: `${parent.resource_name}`
            },
            name: `${parent.resource_name}`
          }
          return state
        case 'sync_regis_conf':
          state = {
            path: '/image/sync_center/detail',
            query: {
              name: `${parent.resource_name}`
            },
            name: `${parent.resource_name}`
          }
          return state
        case 'job_config':
          state = {
            path: '/job/config/detail',
            query: {
              name: `${parent.resource_name}`
            },
            name: `${parent.resource_name}`
          }
          return state
        case 'cloud_account':
          state = {
            path: '/cloud/account/list',
            name: `${parent.resource_name}`
          }
          return state
        case 'role':
          return {name: `${parent.resource_name}`}
        default:
          return {name: `${parent.resource_name}`}
      }
    },
    _subLinkUrl (item) {
      switch (item.sub_resource_type) {
        case 'build':
          const state = {
            path: '/image/build/detail',
            query: {
              build_id: `${item.sub_resource_id}`
            }
          }
          return state
      }
    },
    _getPermissionAttrDesc (value) {
      // 不知其作用
      //        const mapping = orgService.getTeamPermissions().concat(orgService.getDefaultResourcePrivileges())
      //        mapping.forEach((item) => {
      //          if (item.value === value) {
      //            value = item.name
      //            return false
      //          }
      //        })
      //        return value
    },
    queryEvents () {
      this.pagination.total_items = 0 // reset rb-pagination
      this.loadEvents()
    }
  },
  watch: {
    type: 'queryEvents',
    primaryKey: 'queryEvents'
  }
}
</script>
<style lang="scss" scoped>
@import './event-list.scss';
</style>
