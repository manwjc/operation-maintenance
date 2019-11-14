 /* eslint-disable */
function check(rows, that) {
	// 验证数字
	var expMath=/^\d+$/;
	
	var expSmallMath = /^[0-9]+\.?[0-9]+?$/;
	 // 验证IP
	var exp =/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/; 
	// var expMoreIp
	// =/^(?:(?:^|,)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3})+$/;
	// 验证日期
	var expDate=/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
	var erroMessage='';
	
//	for(var i=0;i<pool.length;i++){
//		var jsonstr = pool[i];
//		// var eValue=eval('jsonstr.'+'LABEL'); 
//		for(var item in jsonstr){  
//			if(item=='LABEL')
//			pool1.push(jsonstr[item]);
//			
//		}  
//		
//	}
	
	
	function getValue(key){
        var rolevalue={};
        rolevalue=ROLE[key];
        return dv;
    }
	
	
	// 一共校验字段
	var checkYes=true;
	for(var i=0,l=rows.length;i<l;i++) {
        var row = rows[i]
        var id = row.id;
        // 判断ip是否为空 若为空则不走下面的
        
       
    	
   	 var vm_model1 = row.vm_model1 ? row.vm_model1 : '';
   	 var reg = vm_model1.match(expMath);
   	 if (vm_model1 != '' && reg == null) {
   	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机16核、128G、200G系统磁盘只能输入数字！' + '<br/>';
   	 checkYes = false;
   	 }
   	 
   	 var vm_model2 = row.vm_model2 ? row.vm_model2 : '';
   	 var reg = vm_model2.match(expMath);
   	 if (vm_model2 != '' && reg == null) {
   	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机8核、64G、200G系统磁盘只能输入数字！' + '<br/>';
   	 checkYes = false;
   	 }
     var vm_model3 = row.vm_model3 ? row.vm_model3 : '';
  	 var reg = vm_model3.match(expMath);
  	 if (vm_model3 != '' && reg == null) {
  	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机8核、32G、200G系统磁盘只能输入数字！' + '<br/>';
  	 checkYes = false;
  	 }
  	 
  	 var vm_model4 = row.vm_model4 ? row.vm_model4 : '';
  	 var reg = vm_model4.match(expMath);
  	 if (vm_model4 != '' && reg == null) {
  	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机8核、16G、200G系统磁盘只能输入数字！' + '<br/>';
  	 checkYes = false;
  	 }  
  	 
  	var vm_model5 = row.vm_model5 ? row.vm_model5 : '';
 	 var reg = vm_model5.match(expMath);
 	 if (vm_model5 != '' && reg == null) {
 	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机4核、32G、200G系统磁盘只能输入数字！' + '<br/>';
 	 checkYes = false;
 	 }  
 	 
 	var vm_model6 = row.vm_model6 ? row.vm_model6 : '';
	 var reg = vm_model6.match(expMath);
	 if (vm_model6 != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机 4核、16G、200G系统磁盘只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var vm_model7 = row.vm_model7 ? row.vm_model7 : '';
	 var reg = vm_model7.match(expMath);
	 if (vm_model7 != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机4核、8G、200G系统磁盘只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var vm_model8 = row.vm_model8 ? row.vm_model8 : '';
	 var reg = vm_model8.match(expMath);
	 if (vm_model8 != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机2核、4G、200G系统磁盘只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var pm_low_app_server = row.pm_low_app_server ? row.pm_low_app_server : '';
	 var reg = pm_low_app_server.match(expMath);
	 if (pm_low_app_server != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行虚拟机宿主机低端应用服务器(台)只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var pm_analytical_server = row.pm_analytical_server ? row.pm_analytical_server : '';
	 var reg = pm_analytical_server.match(expMath);
	 if (pm_analytical_server != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行分析型服务器(MPP服务器)(台)只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var pm_distributed_server = row.pm_distributed_server ? row.pm_distributed_server : '';
	 var reg = pm_distributed_server.match(expMath);
	 if (pm_distributed_server != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行分布式服务器(Hadoop服务器)(台)只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 
	 var pm_cache_server = row.pm_cache_server ? row.pm_cache_server : '';
	 var reg = pm_cache_server.match(expMath);
	 if (pm_cache_server != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行缓存型服务器(台)只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
 	 
	 var pm_high_app_server = row.pm_high_app_server ? row.pm_high_app_server : '';
	 var reg = pm_high_app_server.match(expMath);
	 if (pm_high_app_server != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行高端应用服务器(台)只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 
	 var pm_high_app_server = row.pm_high_app_server ? row.pm_high_app_server : '';
	 var reg = pm_high_app_server.match(expMath);
	 if (pm_high_app_server != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行高端应用服务器(台)只能输入数字！' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var storage_distributd_file_capacity = row.storage_distributd_file_capacity ? row.storage_distributd_file_capacity : '';
	 var reg = storage_distributd_file_capacity.match(expSmallMath);
	// var reg1 = storage_distributd_file_capacity.match(expMath);
	 if (storage_distributd_file_capacity != '' && reg == null  ) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行分布式文件存储(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var storage_distributd_block_performance = row.storage_distributd_block_performance ? row.storage_distributd_block_performance : '';
	 var reg = storage_distributd_block_performance.match(expSmallMath);
	 if (storage_distributd_block_performance != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行分布式块存储(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var storage_object_capacity = row.storage_object_capacity ? row.storage_object_capacity : '';
	 var reg = storage_object_capacity.match(expSmallMath);
	 if (storage_object_capacity != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行对象存储(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var storage_fc_san_capacity = row.storage_fc_san_capacity ? row.storage_fc_san_capacity : '';
	 var reg = storage_fc_san_capacity.match(expSmallMath);
	 if (storage_fc_san_capacity != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行FC-SAN存储(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 
	 var storage_ip_san_capacity = row.storage_ip_san_capacity ? row.storage_ip_san_capacity : '';
	 var reg = storage_ip_san_capacity.match(expSmallMath);
	 if (storage_ip_san_capacity != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行IP-SAN存储(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var storage_fc_san_naked = row.storage_fc_san_naked ? row.storage_fc_san_naked : '';
	 var reg = storage_fc_san_naked.match(expSmallMath);
	 if (storage_fc_san_naked != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + 'FC-SAN裸盘(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var storage_ip_san_naked = row.storage_ip_san_naked ? row.storage_ip_san_naked : '';
	 var reg = storage_ip_san_naked.match(expSmallMath);
	 if (storage_ip_san_naked != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + 'IP-SAN裸盘(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var storage_back_up = row.storage_back_up ? row.storage_back_up : '';
	 var reg = storage_back_up.match(expSmallMath);
	 if (storage_back_up != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '备份存储(TB)只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var cmnet_address = row.cmnet_address ? row.cmnet_address : '';
	 var reg = cmnet_address.match(expMath);
	 if (cmnet_address != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + 'CMNET地址需求只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 
	 var bandwidth_gbps_cmnet = row.bandwidth_gbps_cmnet ? row.bandwidth_gbps_cmnet : '';
	 var reg = bandwidth_gbps_cmnet.match(expSmallMath);
	 if (bandwidth_gbps_cmnet != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行至CMNET带宽只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var ip_address = row.ip_address ? row.ip_address : '';
	 var reg = ip_address.match(expMath);
	 if (ip_address != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行IP地址需求只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var bandwidth_gbps_ip = row.bandwidth_gbps_ip ? row.bandwidth_gbps_ip : '';
	 var reg = bandwidth_gbps_ip.match(expSmallMath);
	 if (bandwidth_gbps_ip != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行至IP专网带宽只能输入数字' + '<br/>';
	 checkYes = false;
	 }  
	 
	 var db_mysql = row.db_mysql ? row.db_mysql : '';
	 var reg = db_mysql.match(expMath);
	 if (db_mysql != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行db_mysql只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var db_mongodb = row.db_mongodb ? row.db_mongodb : '';
	 var reg = db_mongodb.match(expMath);
	 if (db_mongodb != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行db_mongodb只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var db_postgresql = row.db_postgresql ? row.db_postgresql : '';
	 var reg = db_postgresql.match(expMath);
	 if (db_postgresql != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行db_postgresql只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var db_memory = row.db_memory ? row.db_memory : '';
	 var reg = db_memory.match(expMath);
	 if (db_memory != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行db_memory只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var db_other = row.db_other ? row.db_other : '';
	 var reg = db_other.match(expMath);
	 if (db_other != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行其它数据库只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var cache_redis = row.cache_redis ? row.cache_redis : '';
	 var reg = cache_redis.match(expMath);
	 if (cache_redis != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '缓存Redis只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var cache_memcached = row.cache_memcached ? row.cache_memcached : '';
	 var reg = cache_memcached.match(expMath);
	 if (cache_memcached != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '缓存memcached只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var info_middleware_activemq = row.info_middleware_activemq ? row.info_middleware_activemq : '';
	 var reg = info_middleware_activemq.match(expMath);
	 if (info_middleware_activemq != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '消息中间件activemq只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var info_middleware_kafka = row.info_middleware_kafka ? row.info_middleware_kafka : '';
	 var reg = info_middleware_kafka.match(expMath);
	 if (info_middleware_kafka != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '消息中间件kafka只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var info_middleware_rocketmq = row.info_middleware_rocketmq ? row.info_middleware_rocketmq : '';
	 var reg = info_middleware_rocketmq.match(expMath);
	 if (info_middleware_rocketmq != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行消息中间件rocketmq只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var app_middleware_apache = row.app_middleware_apache ? row.app_middleware_apache : '';
	 var reg = app_middleware_apache.match(expMath);
	 if (app_middleware_apache != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行应用中间件apache只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 
	 var app_middleware_jboos = row.app_middleware_jboos ? row.app_middleware_jboos : '';
	 var reg = app_middleware_jboos.match(expMath);
	 if (app_middleware_jboos != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行应用中间件jboos只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 
	 var app_middleware_tomcat = row.app_middleware_tomcat ? row.app_middleware_tomcat : '';
	 var reg = app_middleware_tomcat.match(expMath);
	 if (app_middleware_tomcat != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行应用中间件tomcat只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var balancer_nginx = row.balancer_nginx ? row.balancer_nginx : '';
	 var reg = balancer_nginx.match(expMath);
	 if (balancer_nginx != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行负载均衡nginx只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var balancer_haproxy = row.balancer_haproxy ? row.balancer_haproxy : '';
	 var reg = balancer_haproxy.match(expMath);
	 if (balancer_haproxy != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行负载均衡haproxy只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var server_zookeeper = row.server_zookeeper ? row.server_zookeeper : '';
	 var reg = server_zookeeper.match(expMath);
	 if (server_zookeeper != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行分布式协调服务zookeeper只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var server_etcd = row.server_etcd ? row.server_etcd : '';
	 var reg = server_etcd.match(expMath);
	 if (server_etcd != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行分布式协调服务etcd只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 
	 var search_middleware_es = row.search_middleware_es ? row.search_middleware_es : '';
	 var reg = search_middleware_es.match(expMath);
	 if (search_middleware_es != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行搜索中间件ES只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 
	 var server_docker_registry = row.server_docker_registry ? row.server_docker_registry : '';
	 var reg = server_docker_registry.match(expMath);
	 if (server_docker_registry != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像仓库docker只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var stream_jbpm = row.stream_jbpm ? row.stream_jbpm : '';
	 var reg = stream_jbpm.match(expMath);
	 if (stream_jbpm != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行工作流jbpm只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var stream_activity = row.stream_activity ? row.stream_activity : '';
	 var reg = stream_activity.match(expMath);
	 if (stream_activity != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行工作流activity只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var image_openjdk = row.image_openjdk ? row.image_openjdk : '';
	 var reg = image_openjdk.match(expMath);
	 if (image_openjdk != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像openjdk只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var image_python = row.image_python ? row.image_python : '';
	 var reg = image_python.match(expMath);
	 if (image_python != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像python只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var image_go = row.image_go ? row.image_go : '';
	 var reg = image_go.match(expMath);
	 if (image_go != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像go只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var image_nodejs = row.image_nodejs ? row.image_nodejs : '';
	 var reg = image_nodejs.match(expMath);
	 if (image_nodejs != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像node.js只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var image_ruby = row.image_ruby ? row.image_ruby : '';
	 var reg = image_ruby.match(expMath);
	 if (image_ruby != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像ruby只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var image_net = row.image_net ? row.image_net : '';
	 var reg = image_net.match(expMath);
	 if (image_net != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像net只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var cicd_jenkins = row.cicd_jenkins ? row.cicd_jenkins : '';
	 var reg = cicd_jenkins.match(expMath);
	 if (cicd_jenkins != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行镜像cicd_jenkins只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 
	 var framework_springcloud = row.framework_springcloud ? row.framework_springcloud : '';
	 var reg = framework_springcloud.match(expMath);
	 if (framework_springcloud != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行开发框架springcloud只能输入数字' + '<br/>';
	 checkYes = false;
	 }
	 
	 var framework_other = row.framework_other ? row.framework_other : '';
	 var reg = framework_other.match(expMath);
	 if (framework_other != '' && reg == null) {
	 erroMessage = erroMessage + '第' + (i + 3) + '行其它开发框架只能输入数字' + '<br/>';
	 checkYes = false;
	 }



	
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 

	 }

            
         
      

	
	
		// if (!checkYes) {
		// 	 $('#dd').dialog({ 
		// 			 title: '温馨提示',    
		// 			 width: 400,    
		// 		     height: 200,
		// 		     cache: true,
		// 		     closed: false,    
		// 		     modal: true,
		// 		     content:erroMessage
		// 	 });
		// 	 $.messager.alert('提示',erroMessage);
		// 	 return;
		// }else{
		// 	checkYes=true;
		// 	$.messager.alert('提示',"excel文件数据已校验,可提交!");
        // }
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
