本文件为通用工具组件的使用说明文档

过滤器（转换数据格式，如时间格式转换）
使用方法：
  模板内调用：
    <div>{{time | formatDate}}</div>
    <div>{{timeString | formatUtcStr}}</div>
    <div>{{milliseconds | rbDuration}}</div>
  方法内调用：
    this.$options.filters[filter](...args) 如 this.$options.filters[formatDate](time)
说明：time必须为时间戳格式，且为number类型，否则不能使用，转换后格式为2017-10-29 10:49:52形式
     timeString必须为UTC时间字符串，否则不能使用，转换后格式为2017-10-29 10:49:52形式
     milliseconds（持续时间：结束时间-开始时间）
     必须为时间戳格式，且为number类型，否则不能使用，换后格式为1天2小时20分钟12秒

自定义指令
使用方法：(实例详见src/pages/pipleine/history/components/status-components.vue)
  模版内调用：
    <span :class="className">
      <span
       v-rubick-status-icon="{status:statusMap[status],status_text: statusTranslateMap[status],status_class: ClassName}">
      </span>
    </span>

  说明:
        状态和公用颜色可以在src/assets/css/color.scss 中添加
        statusMap为状态转换，
        statusTranslateMap为英文转中文，
        status_class为你自定义的样式名(必需用以下模版)

        .className {                  //此样式名可变
            font-size: 12px;
            height: 18px;
            line-height: 18px;
            border-radius: 9px;
            text-align: center;
            color: white;
            &.detail-status {
              padding: 2px 5px;
              &.status-success {      //&.status-xxxx 样式名保持 xxx必需与转后的status一致
                background-color: $status-color-success;
              }
              &.status-in-progress {
                background-color: $status-color-in-process;
              }
              &.status-deploying {
                background-color: $status-color-deploying;
              }
              &.status-error {
                background-color: $status-color-error;
              }
              &.status-pending {
                background-color: $status-color-pending;
              }
            }
          }

