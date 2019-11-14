export default {
  // 自定义指令
  directives: {
    rubickStatusIcon: {
      bind: function(el, binding) {
        let status = binding.value.status
        let statusText = binding.value.status_text
        let statusClass = binding.value.status_class
        el.className = statusClass + ' detail-status status-' + status
        if (status === 'in-progress' || status === 'deploying' || status === 'starting' || status === 'stopping' || status === 'blocked' ||
          status === 'deleting' || status === 'Starting' || status === 'inprogress') {
          el.innerHTML = ' <i class="fa fa-refresh fa-spin"></i>' + statusText
        } else {
          el.innerHTML = statusText
        }
      },
      update: function(el, binding) {
        let oldStatus = binding.oldValue.status
        let newStatus = binding.value.status
        let statusClass = binding.value.status_class
        if (oldStatus !== newStatus) {
          el.className = statusClass + ' detail-status status-' + newStatus
          if (newStatus === 'in-progress' || newStatus === 'deploying' || newStatus === 'Starting' || newStatus === 'inprogress' ||
            newStatus === 'stopping' || newStatus === 'deleting' || newStatus === 'starting' || newStatus === 'blocked') {
            el.innerHTML = ' <i class="fa fa-refresh fa-spin"></i>' + binding.value.status_text
          } else {
            el.innerHTML = binding.value.status_text
          }
        } else {
          if (oldStatus === 'in-progress' || oldStatus === 'deploying') {
            el.innerHTML = ' <i class="fa fa-refresh fa-spin"></i>' + binding.oldValue.status_text
          } else {
            el.innerHTML = binding.oldValue.status_text
          }
        }
      }
    }
  }

}
