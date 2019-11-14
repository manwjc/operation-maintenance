 /* eslint-disable */
function check(rows, that) {
	// var resourceBuuldId = aspire.osa.resourceBuildManage.build.importWin.count
	// if (resourceBuuldId != rows.length) {
	// 	$.messager.alert('提示',"设备数量与资源建设数量不符,请重试!")
	// 	return
	// }
	// 验证数字
	var expMath = /^\d+$/
	 // 验证IP
	var exp = /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/
	// var expMoreIp =/^(?:(?:^|,)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3})+$/
	// 验证日期
	var expDate = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/
	var erroMessage = ''
	// 一共24个校验字段
	var checkYes = true
	for(var i = 0, l = rows.length; i < l; i++) {
        var row = rows[i]
        var hostBackup = row.host_backup
        var deviceIp = row.device_ip
        var id = row.id

        // 判断ip是否为空   若为空则不走下面的
        if (deviceIp == null || deviceIp == '') {
            erroMessage = (erroMessage + '第' + (i + 1) + '行 主IP 不能为空.') + ' '
            checkYes = false
        } else {
            if (deviceIp == '已存在') {
                erroMessage = (erroMessage + '第' + (i + 1) + '行 主IP 已存在数据库中，请重新输入IP或者更改主备关系') + ' '
                checkYes = false
            } else {
                var reg = deviceIp.match(exp)
                if (reg == null) {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 主IP地址 不合法！' + ' '
                    checkYes = false
                }
                var count = 0
                for (var j = 0, l = rows.length; j < l; j++) {
                    var deviceIpC = rows[j].device_ip
                    var idC = rows[j].id
                    if (deviceIp === deviceIpC) {
                        if (id === idC) {
                            count++
                        }
                    }
                }
                if (count >= 2) {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 主IP地址和主备关系 不存在数据库中，但是与将要录入的某一行重复！' + ' '
                    checkYes = false
                }
            var businessId = row.businessId
            var business_level1 = row.business_level1
            if (business_level1 == null || business_level1 == '') {
//                 erroMessage = (erroMessage + '第' + (i + 1) + '行 一级业务 不能为空.') + ' '
//                 checkYes = false
            } else {
                if (businessId == null || businessId == '') {
                    erroMessage = (erroMessage + '第' + (i + 1) + '行 业务 填写不规范，请填参照字段') + ' '
                    checkYes = false
                }
            }
            var idc = row.idc
            if (idc == null || idc == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 IDC 不能为空' + ' '
                checkYes = false
            }
            var idc_label = row.idc_label
            if (idc_label == null || idc_label == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 所属位置 不能为空' + ' '
                checkYes = false
            }
            var idcCheck = row.idc_check
            if (idc != '' && idc_label != '') {
                if (idcCheck == 'Flase') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 IDC或者所属位置 填写有误，请填参考字段' + ' '
                    checkYes = false
                }
            }						

            var box_mgd_ip = row.box_mgd_ip
            var exsi_ip = row.exsi_ip
            var vm_ip = row.vm_ip
            var consoleIp = row.console_ip// ip格式校验
			
            var dis_storage = row.dis_storage ? row.dis_storage : '' // 只能是数字
            var reg = dis_storage.match(expMath)
            if (reg == null && dis_storage != '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 分布式存储 只能输入数字！' + ' '
                checkYes = false
            }

            var blockSize = row.block_size ? row.block_size : ''  // 只能是数字，不能为空
            if (blockSize == null || blockSize == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 块存储  不能为空！' + ' '
                checkYes = false
            }
            var reg = blockSize.match(expMath)
            if (blockSize != '' && reg == null) {
                erroMessage = erroMessage + '第' + (i + 1) + '行 块存储  只能输入数字！' + ' '
                checkYes = false
            }
            if (blockSize.length > 8) {
                erroMessage = erroMessage + '第' + (i + 1) + '行 块存储  数据过大！' + ' '
                checkYes = false
            }

            var mgd_by_pool = row.mgd_by_pool // 不能为空
            if (mgd_by_pool == null || mgd_by_pool == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 资源池管理设备信息 不能为空.' + ' '
                checkYes = false
            }

            var device_class_id = row.device_class_id
            var device_type_id = row.device_type_id
            var device_model_id = row.device_model_id
            var device_os_type_id = row.device_os_type_id
            var device_class = row.device_class
            var device_type = row.device_type
            var device_model = row.device_model
            var device_os_type = row.device_os_type
            var device_status = row.device_status // 不能为空
            if (device_class == null || device_class == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 设备分类 不能为空.' + ' '
                checkYes = false
            } else {
                if (device_class_id == null || device_class_id == '') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 设备分类 填写不规范，请填参照字段' + ' '
                    checkYes = false
                }
            }
            if (device_type == null || device_type == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 设备类型 不能为空.' + ' '
                checkYes = false
            } else {
                if (device_type_id == null || device_type_id == '') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 设备类型 填写不规范，请填参照字段' + ' '
                    checkYes = false
                }
            }
            if (device_model == null || device_model == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 设备型号 不能为空.' + ' '
                checkYes = false
            } else {
                if (device_model_id == null || device_model_id == '') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 设备型号 填写不规范，请填参照字段' + ' '
                    checkYes = false
                }
            }
            if (device_os_type == null || device_os_type == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 设备系统类型 不能为空.' + ' '
                checkYes = false
            } else {
                if (device_os_type_id == null || device_os_type_id == '') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 设备系统类型 填写不规范，请填参照字段' + ' '
                    checkYes = false
                }
            }
            if (device_status == null || device_status == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 设备状态 不能为空.' + ' '
                checkYes = false
            } else {
                if (device_status != '上电' && device_status != '下电') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 设备状态 填写不规范，请填上电或下电' + ' '
                    checkYes = false
                }
            }
            var device_maintenance = row.device_maintenance
            var device_maintenance_vender = row.device_maintenance_vender
            var device_maintenance_id = row.device_maintenance_id
            if (device_maintenance != null && device_maintenance != '' || device_maintenance_vender != null && device_maintenance_vender != '') {
                if (device_maintenance_id == null || device_maintenance_id == '') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 维保型号或者维保厂家 填写不规范，请填参照字段' + ' '
                    checkYes = false
                }
            }
            var maintenance_time = row.maintenance_time ? row.maintenance_time : '' // 时间格式校验
            var reg = maintenance_time.match(expDate)
            if (reg == null && maintenance_time != '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 维保时间 日期格式不合法！' + ' '
                checkYes = false
            }
            var online_time = row.online_time ? row.online_time : '' // 时间格式校验
            var reg = online_time.match(expDate)
            if (reg == null && online_time != '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 上线时间 日期格式不合法！' + ' '
                checkYes = false
            }
            var resource_plan = row.resource_plan// 资源计划性
            if (resource_plan != null && resource_plan != '') {
                if (resource_plan != '计划内' && resource_plan != '计划外') {
                    erroMessage = erroMessage + '第' + (i + 1) + '行 资源计划性 内容不合法！' + ' '
                    checkYes = false
                }
            }
            var local_disk = row.local_disk ? row.local_disk : '' // 数字
            var reg = local_disk.match(expMath)
            if (reg == null && local_disk != '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 本地磁盘大小 只能输入数字！' + ' '
                checkYes = false
            }
            var mount_disk = row.mount_disk ? row.mount_disk : '' // 数字
            var reg = mount_disk.match(expMath)
            if (reg == null && mount_disk != '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 初始外挂磁盘  只能输入数字！' + ' '
                checkYes = false
            }

            var managed_by_ansiblertable = row.managed_by_ansiblertable  // 不能为空
            if (managed_by_ansiblertable == null || managed_by_ansiblertable == '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 Ansible管理信息 不能为空.' + ' '
                checkYes = false
            }
            
            var prorate_date = row.prorate_date ? row.prorate_date : '' // 时间格式校验
            var reg = prorate_date.match(expDate)
            if (reg == null && prorate_date != '') {
                erroMessage = erroMessage + '第' + (i + 1) + '行 按比例分摊日期 日期格式不合法！' + ' '
                checkYes = false
            }
            
         }
       }

	}
	
		if (!checkYes) {
			//  $('#dd').dialog({ 
			// 		 title: '温馨提示',    
			// 		 width: 400,    
			// 	     height: 200,
			// 	     cache: true,
			// 	     closed: false,    
			// 	     modal: true,
			// 	     content:erroMessage
			//  })
			//  $.messager.alert('提示',erroMessage)
            // that.$message.error(`${erroMessage}`)
            that.$alert(`${erroMessage}`, '提示', {
                confirmButtonText: '确定'
            })
			return false
        }
        else{
			// checkYes=true
            // $.messager.alert('提示',"excel文件数据已校验,可提交!")
            return true
		}	
}

export {check}