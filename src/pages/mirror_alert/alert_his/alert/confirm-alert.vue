<template>
  <div>
    <!-- 检索条件 -->
    <div style="padding: 10px">
      <el-row>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">设备IP</span>
            <span>
              <el-input  style="width:200px" v-model="device_value"></el-input>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">告警级别</span>
            <span style="padding-right: 5px;">
              <el-select  v-model="alert_level_value" placeholder="请选择" class="list-sel" clearable style="width: 200px">
              <el-option
                v-for="item in alert_level"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">业务系统</span>
            <span>
              <el-select v-model="search.system" placeholder="请选择" class="list-sel" clearable style="width: 200px">
              <el-option v-for="item in bizSysList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px;">
            <el-button type="primary"  size="mini" plain @click="search.searchDialog=true">高级检索</el-button>
            <el-button type="primary"  size="mini" plain @click="searchData()">查询</el-button>
            <el-button type="primary"  size="mini" plain @click="cancel('searchHead')">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">资源池</span>
            <span>
              <el-select v-model="search.resource_pool" placeholder="请选择" class="list-sel" clearable style="width: 200px">
                <el-option
                  v-for="item in resourcePoors"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">监控对象</span>
            <span>
              <el-select v-model="monitor_value" placeholder="请选择" multiple collapse-tags style="width:200px">
              <el-option v-for="item in monitor_values" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 数据展示 -->
    <div class="body-container">
      <el-row>
        <el-col :span="24">
          <div style="padding-left: 10px;">
            <div>
              <div style="float: left">
                <el-button style="font-size: 16px;padding-right: 20px;" type="text" @click="startTransfer()"><span class="fa fa-external-link"></span> 转派</el-button>
                <el-button style="font-size: 16px;padding-right: 20px;" type="text" @click="startWork()"><span class="fa fa-location-arrow"></span> 派单</el-button>
                <el-button style="font-size: 16px;padding-right: 20px;" type="text" icon="el-icon-delete" @click="startClean()">清除</el-button>
                <el-button style="font-size: 16px;padding-right: 20px;" type="text" @click="startNotice()"><span class="fa fa-commenting-o"></span> 通知</el-button>
              </div>
            </div>
            <div style="float: right">
              <span class="fa fa-unlock-alt" style="color:#C4C4C4;padding-left: 10px" v-show="lockScgreen"></span>
              <el-button style="font-size: 16px;padding-right: 20px;" type="text"  @click="lock" v-show="lockScgreen">锁屏</el-button>
              <span class="fa fa-lock" style="color:#C4C4C4;padding-left: 10px" v-show="goScgreen"></span>
              <el-button style="font-size: 16px;padding-right: 20px;" type="text"  @click="go" v-show="goScgreen">刷屏</el-button>
              <el-button style="font-size: 16px;padding-right: 20px;" type="text" icon="el-icon-upload2" @click="resourceExport">导出</el-button>
              <el-button style="font-size: 16px;" v-popover:popover  size="mini"type="text" icon="el-icon-d-caret">选择列</el-button>
              <el-popover ref="popover"  placement="top" trigger="click">
                <div id="popover" style="max-height: 300px;overflow-y: auto;">
                  <el-checkbox-group v-model="test"  @change="handleCheckedColumnChange">
                    <div v-for="column in checkColumns">
                      <el-checkbox :label="column.keyCode">{{ column.keyName }}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-table :data="activityAlertData" style="width: 100%;margin-top:10px;cursor: pointer;height:calc(100vh - 400px);" stripe tooltip-effect="dark" border
                @selection-change="handleSelectionChange" @row-dblclick="dblhandleCurrentChange($event)">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="级别" width="100px" align="center" fixed="left" :sortable="true" :sort-method="sortByAlertLevel">
          <template slot-scope="scope">
            <rb-mirror-alert-status :mode="'list'" :status="scope.row.alert_level"></rb-mirror-alert-status>
          </template>
        </el-table-column>
        <el-table-column prop="device_ip" label="设备IP" align="center" width="150px" sortable></el-table-column>
        <el-table-column prop="idc_type" label="资源池" align="center" width="150px" :show-overflow-tooltip="true" sortable> </el-table-column>
        <!--<el-table-column prop="source_room" label="机房" align="center" width="150px" :show-overflow-tooltip="true" sortable> </el-table-column>-->
        <!--<el-table-column prop="biz_sys" label="业务线" align="center" width="150px" :show-overflow-tooltip="true" sortable></el-table-column>-->
        <el-table-column prop="moni_object" label="监控对象" align="center" width="150px" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column prop="moni_index" label="告警内容" align="center" width="300px" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column prop="alert_start_time" label="告警开始时间" align="center" width="180px"  sortable :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cur_moni_time" label="当前告警时间" align="center"  width="180px" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column v-for="itemData in checkColumns" :key="itemData.keyName" v-if="itemData.keyIsSelected" :prop="itemData.keyCode" :label="itemData.keyName"
                         align="center" width="180px" sortable :show-overflow-tooltip="true" :width="flexColumnWidth(itemData.keyCode)"></el-table-column>
        <!--<el-table-column prop="device_ip" label="设备IP" align="center" width="120px" ></el-table-column>-->
        <!--<el-table-column prop="idc_type" label="资源池" align="center" width="120px" > </el-table-column>-->
        <!--<el-table-column prop="source_room" label="机房" align="center" width="100px" :show-overflow-tooltip="true"> </el-table-column>-->
        <!--<el-table-column prop="biz_sys_name" label="业务线" align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>-->
        <!--<el-table-column prop="moni_object" label="监控对象" align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>-->
        <!--<el-table-column prop="cur_moni_value" label="监控值" align="center" width="100px" :show-overflow-tooltip="true"></el-table-column>-->
        <!--<el-table-column prop="moni_index" label="告警内容" align="center" width="200px" :show-overflow-tooltip="true"></el-table-column>-->
        <!--<el-table-column prop="alert_start_time" label="告警开始时间" align="center" width="150px" :show-overflow-tooltip="true"></el-table-column>-->
        <!--<el-table-column prop="alert_end_time" label="告警结束时间" align="center"  width="150px" :show-overflow-tooltip="true"></el-table-column>-->
        <!--<el-table-column prop="object_type" label="告警类型" align="center" width="80px"></el-table-column>-->
        <!--<el-table-column prop="alert_count" label="告警数量" align="center" width="80px"></el-table-column>-->
        <!--<el-table-column prop="order_status" label="派单" align="center"></el-table-column>-->
        <!--<el-table-column label="操作" align="center" fixed="right" width="120px">-->
          <!--<template slot-scope="scope">-->
            <!--<el-tooltip content="删除" placement="top">-->
              <!--<el-button type="text" icon="el-icon-delete" @click="toClean(scope.row)"></el-button>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip content="派单" placement="top">-->
              <!--<el-button type="text"><span class="fa fa-location-arrow" @click="toWork(scope.row)"></span></el-button>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip content="查看详情" placement="top">-->
              <!--<el-button type="text" icon="el-icon-tickets" @click="goDetail(scope.row.alert_id)"></el-button>-->
            <!--</el-tooltip>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <el-row :gutter="20">
        <el-col :span="12" :offset="9">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :total="total"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 告警通知 -->
    <!--<el-dialog :visible.sync="notice.noticeDialog" width="40%" center-->
                <!--:show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">-->
      <!--<div style="padding-left: 10px">-->
        <!--<el-row>-->
          <!--<el-col :span="5"><div><span><label style="font-size:16px">告警通知</label></span></div></el-col>-->
          <!--<el-col :span="6"><span style="font-size: 14px"></span></el-col>-->
          <!--<el-col :span="10"><span style="font-size: 14px"><i class="el-icon-info"></i>以产生的告警通知到相关联系人</span></el-col>-->
        <!--</el-row>-->
      <!--</div>-->
      <!--<div style="padding: 10px">-->
        <!--<el-row>-->
          <!--<el-col :span="5"><div><span style="font-size: 14px">通知操作</span></div></el-col>-->
          <!--<el-col :span="10"><span style="font-size: 14px"></span>直接通知</el-col>-->
        <!--</el-row>-->
      <!--</div>-->
      <!--<div style="padding: 10px">-->
        <!--<el-row >-->
          <!--<el-col :span="5"><div><span style="font-size: 14px">通知配置</span></div></el-col>-->
          <!--&lt;!&ndash;:offset="5"&ndash;&gt;-->
          <!--<el-col :span="19" >-->
            <!--<div style="float: left">-->
              <!--<el-checkbox v-model="notice.noticePersonalChecked">个人</el-checkbox>-->
              <!--<el-input v-model="notice.noticePersonalInput" style="width: 100px"></el-input>-->
              <!--<el-button type="text">个人选择器</el-button><i class="el-icon-circle-plus" style="padding-left: 10px"></i>-->
            <!--</div>-->
            <!--<div style="float: left;padding-top:9px;padding-left: 20px">-->
              <!--<el-checkbox-group v-model="notice.noticePersonalType" >-->
                <!--<el-checkbox v-for="type in notice.noticeTypes" :label="type" :key="type">{{type}}</el-checkbox>-->
              <!--</el-checkbox-group>-->
            <!--</div>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row >-->
          <!--<el-col :span="19" :offset="5">-->
            <!--<div>-->
              <!--<el-table :data="notice.noticeTableData" style="width: 100%;margin-top:15px" stripe tooltip-effect="dark">-->
                <!--<el-table-column prop="notice_obj_type" label="通知对象类型" align="left" ></el-table-column>-->
                <!--<el-table-column prop="notice_info" label="通知对象信息" align="left"></el-table-column>-->
                <!--<el-table-column prop="notice_type" label="通知方式" align="left" ></el-table-column>-->
                <!--<el-table-column prop="operation" label="操作" align="left">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-button type="text" size="small">删除</el-button>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              <!--</el-table>-->
            <!--</div>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</div>-->
      <!--<div style="padding-top: 20px">-->
        <!--<el-row :gutter="20">-->
          <!--<el-col :span="12" :offset="5">-->
            <!--<el-button type="primary" size="small" @click="notice.noticeDialog=false">通 知</el-button>-->
            <!--<el-button size="small" @click="cancel('notice')">取 消</el-button>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</div>-->
    <!--</el-dialog>-->
    <el-dialog :visible.sync="notice.noticeDialog" width="40%" :before-close="handleClose" center
                :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- <span>这是一段信息</span> -->
      <el-transfer filterable filter-placeholder="请输入用户名称" :titles="['用户列表', '已选用户']" :data="notice.userList" v-model="notice.userResult">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sendSMS()" class="tem-search" style="width:auto">发送短信</el-button>
          <el-button type="primary" @click="sendEmail()" class="tem-search" style="width:auto">发送邮件</el-button>
          <el-button type="primary" @click="cancel('notice')" class='tem-search'>返回</el-button>
        </span>
    </el-dialog>
    <!-- 告警转派 -->
    <el-dialog :visible.sync="transfer.transferDialog" width="45%" center
                :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="padding-left: 10px">
        <el-row>
          <el-col :span="5"><div><span><label style="font-size:16px">告警转派</label></span></div></el-col>
          <el-col :span="6"><span style="font-size: 14px"></span></el-col>
          <el-col :span="10"><span style="font-size: 14px"><i class="el-icon-info"></i>告警数据将转派到某个人进行后续处理</span></el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row>
          <el-col :span="5"><div><span style="font-size: 14px">转派操作</span></div></el-col>
          <el-col :span="10"><span style="font-size: 14px"></span>直接转派</el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row >
          <el-col :span="5"><div><span style="font-size: 14px">转派人员</span></div></el-col>
          <!--:offset="5"-->
          <el-col :span="19">
            <div style="float: left">
              <el-checkbox v-model="transfer.transferPersonalChecked">个人</el-checkbox>
              <el-input v-model="transfer.transferPersonalInput" style="width: 150px"></el-input>
              <el-button type="text" @click="selectPersonalM()">个人选择器</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="19" :offset="5">
            <div>
              <el-table :data="transfer.transferTableData" style="width: 100%;margin-top:15px" stripe tooltip-effect="dark">
                <el-table-column prop="transfer_obj_type" label="转派对象类型" align="left" ></el-table-column>
                <el-table-column prop="transfer_info" label="转派对象信息" align="left"></el-table-column>
                <el-table-column label="操作" align="left">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteSelectPersonal(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="padding-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="5">
            <el-button type="primary" size="small" @click="submitTransfer()">转 派</el-button>
            <el-button size="small" @click="cancel('transfer')">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 告警派单 -->
    <el-dialog :visible.sync="work.workDialog" width="38%" center
                :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="padding-left: 10px">
        <el-row>
          <el-col :span="5"><div><span><label>告警派单</label></span></div></el-col>
          <el-col :span="6"><span></span></el-col>
          <el-col :span="13"><span ><i class="el-icon-info"></i>告警数据派单到对应工单，进行工单处理</span></el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row>
          <el-col :span="5"><div><span style="font-size: 14px">派单操作</span></div></el-col>
          <el-col :span="10"><span style="font-size: 14px"></span>直接后台派单(支持批量)</el-col>
        </el-row>
      </div>
      <!--<div style="padding: 10px">-->
        <!--<el-row>-->
          <!--<el-col :span="5"><div><span style="font-size: 14px">工单类型</span></div></el-col>-->
          <!--<el-col :span="10"><div>-->
            <!--<el-radio v-model="work.work_type" label="1">告警工单</el-radio>-->
            <!--<el-radio v-model="work.work_type" label="2">故障工单</el-radio>-->
          <!--</div></el-col>-->
        <!--</el-row>-->
      <!--</div>-->
      <div style="padding-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="5">
            <el-button type="primary" size="small" @click="submitWork()">确 定</el-button>
            <el-button size="small" @click="cancel('work')">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 告警清除 -->
    <el-dialog :visible.sync="clean.cleanDialog" width="35%" center
                :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="padding-left: 10px">
        <el-row>
          <el-col :span="5"><div><span><label>告警清除</label></span></div></el-col>
          <el-col :span="9"><span></span></el-col>
          <el-col :span="10"><span ><i class="el-icon-info"></i>告警数据将移至历史告警看板</span></el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row>
          <el-col :span="5"><div><span style="font-size: 14px">确认清除</span></div></el-col>
          <el-col :span="10"><span style="font-size: 14px"></span>直接清除该告警</el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row>
          <el-col :span="5"><div><span style="font-size: 14px">清除原因</span></div></el-col>
          <el-col :span="18"><div>
            <el-input type="textarea" :rows="5" v-model="clean.cleanDialogTextArea" ></el-input>
          </div></el-col>
        </el-row>
      </div>
      <div style="padding-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="5">
            <el-button type="primary" size="small" @click="submitClean()">确 定</el-button>
            <el-button size="small" @click="cancel('clean')">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 高级检索 -->
    <el-dialog :visible.sync="search.searchDialog" width="40%" center
                :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-alert-content">
        <div class="confirm-alert-row">
          <div>告警生效时间</div>
          <div><el-date-picker v-model="search.alert_date_from" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></div>
          <div>至</div>
          <div><el-date-picker v-model="search.alert_date_to" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></div>
        </div>
        <div class="confirm-alert-row">
          <div>告警分类</div>
          <div><el-select v-model="search.alert_type" placeholder="请选择" class="list-sel" clearable style="width: 150px">
            <el-option v-for="item in alert_types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select></div>
          <div>设备类型</div>
          <div><el-select v-model="search.device_type" placeholder="请选择" class="list-sel" clearable style="width: 150px">
            <el-option v-for="item in device_types" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select></div>
        </div>
        <div class="confirm-alert-row">
          <div>机房</div>
          <div><el-select v-model="search.device_room" placeholder="请选择" class="list-sel" clearable style="width: 150px">
            <el-option
              v-for="item in idc_locations"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select></div>
          <div>告警描述</div>
          <div><el-input v-model="search.alert_description" style="width: 150px"></el-input></div>
        </div>
        <div class="confirm-alert-row">
          <div>通知方式</div>
          <div>
            <el-checkbox-group v-model="search.noticeType" >
              <el-checkbox v-for="type in notice.noticeTypes" :label="type.id" :key="type.id">{{type.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div>通知状态</div>
          <div>
            <el-radio v-model="search.notice_status" label="1">成功</el-radio>
            <el-radio v-model="search.notice_status" label="0">失败</el-radio>
          </div>
        </div>
        <div class="confirm-alert-row">
          <div>通知操作时间</div>
          <div><el-date-picker v-model="search.notice_date_from" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></div>
          <div>至</div>
          <div><el-date-picker v-model="search.notice_date_to" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></div>
        </div>
        <div class="confirm-alert-row">
          <div>转派时间</div>
          <div><el-date-picker v-model="search.transfer_date_from" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></div>
          <div>至</div>
          <div><el-date-picker v-model="search.transfer_date_to" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></div>
        </div>
        <div class="confirm-alert-row">
          <div>转派操作人</div>
          <div><el-input v-model="search.transfer_operator" style="width: 150px"></el-input></div>
          <div>待确认人</div>
          <div><el-input v-model="search.confirm_operator" style="width: 150px"></el-input></div>
        </div>
        <div class="confirm-alert-row">
          <div>告警来源</div>
          <div><el-select v-model="search.a" placeholder="请选择" class="list-sel" clearable filterable style="width: 150px">
            <el-option v-for="item in alert_froms" :key="item.value" :label="item.label":value="item.value"></el-option>
          </el-select></div>
        </div>
      </div>
      <div style="padding-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="5">
            <el-button type="primary" size="small" @click="searchData()">查 询</el-button>
            <el-button size="small" @click="cancel('search')">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 个人选择器 -->
    <el-dialog title="选择用户" :visible.sync="transfer.selectPersonal" width="36%"
               center :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-transfer filterable filter-placeholder="请输入用户名称" :titles="['用户列表', '已选用户']" :data="notice.userList" v-model="notice.userResult" >
      </el-transfer>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="confirmSelectPersonal()">确认</el-button>
          <el-button type="primary" size="small" @click="cancel('selectPersonal')">返回</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import {alert_level, alert_type, relation, alert_from} from '../config/options.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
  import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'
  import rbMirrorAlertStatus from 'src/pages/mirror_alert/common/rb-mirror-alert-status.vue'
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
  export default {
    components: {
      rbMirrorAlertStatus
    },
    props: [
      'confirm', 'alertType', 'operationStatus', 'alert_Level', 'requestData'
    ],
    data () {
      return {
        test: [],
        checkColumns: [
          //   {
          //   'keyCode': 'device_ip',
          //   'keyName': '设备ip',
          //   'keyIsSelected': true
          // }, {'keyCode': 'idc_type',
          //   'keyName': '资源池',
          //   'keyIsSelected': true },
             {'keyCode': 'source_room', 'keyName': '机房位置', 'keyIsSelected': false},
             {'keyCode': 'biz_sys', 'keyName': '业务线', 'keyIsSelected': false},
          //   {'keyCode': 'moni_object', 'keyName': '监控对象', 'keyIsSelected': true},
          //   {'keyCode': 'cur_moni_value', 'keyName': '监控值', 'keyIsSelected': true},
          //   {'keyCode': 'moni_index', 'keyName': '告警内容', 'keyIsSelected': true},
          //   {'keyCode': 'alert_start_time', 'keyName': '告警开始时间', 'keyIsSelected': true},
          //   {'keyCode': 'cur_moni_time', 'keyName': '当前告警时间', 'keyIsSelected': true},
          {'keyCode': 'object_type', 'keyName': '告警类型', 'keyIsSelected': false},
          {'keyCode': 'alert_count', 'keyName': '告警数量', 'keyIsSelected': false},
          {'keyCode': 'report_type', 'keyName': '通知方式', 'keyIsSelected': false},
          {'keyCode': 'report_status', 'keyName': '通知状态', 'keyIsSelected': false},
          {'keyCode': 'report_time', 'keyName': '通知时间', 'keyIsSelected': false},
          {'keyCode': 'trans_status', 'keyName': '转派状态', 'keyIsSelected': false},
          {'keyCode': 'trans_user', 'keyName': '转派人', 'keyIsSelected': false},
          {'keyCode': 'trans_time', 'keyName': '转派时间', 'keyIsSelected': false},
          {'keyCode': 'to_confirm_user', 'keyName': '待确认人', 'keyIsSelected': false},
          {'keyCode': 'order_type', 'keyName': '派单类型', 'keyIsSelected': false},
          {'keyCode': 'order_status', 'keyName': '派单状态', 'keyIsSelected': false},
          {'keyCode': 'order_id', 'keyName': '工单号', 'keyIsSelected': false},
          {'keyCode': 'deliver_time', 'keyName': '派单时间', 'keyIsSelected': false},
          {'keyCode': 'confirmed_user', 'keyName': '确认人', 'keyIsSelected': false},
          {'keyCode': 'confirmed_time', 'keyName': '确认时间', 'keyIsSelected': false},
          {'keyCode': 'confirmed_content', 'keyName': '确认内容', 'keyIsSelected': false}
        ],
        columnFilter: {
          // 'device_ip': false,
          // 'idc_type': false,
          'source_room': false,
          'biz_sys': false,
          // 'moni_object': false,
          // 'cur_moni_value': false,
          // 'moni_index': false,
          // 'alert_start_time': false,
          // 'cur_moni_time': false,
          'object_type': false,
          'alert_count': false,
          'report_type': false,
          'report_status': false,
          'report_time': false,
          'trans_status': false,
          'trans_user': false,
          'trans_time': false,
          'to_confirm_user': false,
          'order_type': false,
          'order_status': false,
          'order_id': false,
          'deliver_time': false,
          'confirmed_user': false,
          'confirmed_time': false,
          'confirmed_content': false
        },
        classA: 'classA',
        classB: 'classB',
        alertList: [],
        // 选择列存放的值
        filterForm: {},
        columnInfo: '',
        checkedcolumns: [],
        moduleId: '54321XYUEFKSLDDLDKFJAL',
        column_data: {},
        columnList: [],
        detailObjId: '',
        detailOrderStatus: '',
        alertObj: {},
        alertObjFlag: false,
        lockScgreen: true,
        goScgreen: false,
        multipleSelection: [], // 多选框模板存放的值
        activityAlertData: [], // 活动告警数据数组
        currentPage: 1, // 当前页
        pageSize: 20, // 分页每页多少行数据
        pageSizes: [20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        alert_level: [], // 告警级别
//        device_relation_value: '', // 设备包含不包含
        device_value: '', // 设备ip
//        monitor_relation_value: '', // 监控项包含不包含
        monitor_value: [], // 监控项
        monitor_values: [], // 监控项值
        alert_level_value: '', // 告警级别
        relation: [],
        alert_types: [],
        // 业务系统
        bizSysList: [],
        // 资源池
        resourcePoors: [],
        // 机房
        idc_locations: [],
        // 设备类型
        device_types: [],
        alert_froms: [],
        // 告警通知
        notice: {
          noticeTypes: [{
            id: '0',
            name: '短信'
          }, {
            id: '1',
            name: '邮件'
          }],
          noticeDialog: false, // 弹出框
          noticeTeamChecked: false, // 团队
          noticeTeamInput: '',
          noticeTeamType: [],
          noticePersonalChecked: false, // 个人
          noticePersonalInput: '',
          noticePersonalType: [],
          noticeTableData: [],
          userList: [],
          userResult: []
        },
        // 告警转派
        transfer: {
          count: 0,
          transferDialog: false,
          transferTeamChecked: false, // 团队
          transferTeamInput: '',
          transferPersonalChecked: false, // 个人
          transferPersonalInput: '',
          transferTableData: [],
          selectPersonal: false
        },
        // 告警派单
        work: {
          workDialog: false,
          work_type: ''
        },
        // 告警清除
        clean: {
          cleanDialog: false,
          cleanDialogTextArea: ''
        },
        // 高级检索
        search: {
          searchDialog: false,
          alert_date_from: '', // 告警开始时间
          alert_date_to: '', // 告警结束时间
          alert_type: '', // 告警分类
          device_type: '', // 设备类型
          system: '', // 业务系统
          alert_description: '', // 告警描述
          resource_pool: '', // 资源池
          device_room: '', // 机房
          notice_date_from: '', // 通知开始时间
          notice_date_to: '', // 通知结束时间
          noticeType: [], // 通知方式
          notice_status: '', // 通知状态
          transfer_date_from: '', // 转派开始时间
          transfer_date_to: '', // 转派结束时间
          transfer_operator: '', // 转派操作人
          confirm_operator: '', // 待确认人
          operate_status: '', // 操作状态
          alert_from: ''
        },
        dicts: {}
      }
    },
    mounted () {
    },
    destroyed () {
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      // 1 element相关方法 多选框
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 对话框
      handleClose (done) {
        done()
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.searchData()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.searchData()
      },
      // 封装请求数据的对象
      packInit () {
        let obj = {
          'queryType': '1',
          'order': 'DESC',
          'page_no': this.currentPage,
          'page_size': this.pageSize,
          'sort_name': '',
//          'deviceOp': this.device_relation_value ? this.device_relation_value : '',
          'deviceIp': this.device_value ? this.device_value : '',
//          'monitOp': this.monitor_relation_value ? this.monitor_relation_value : '',
          'monitItems': this.monitor_value ? this.monitor_value.toString() : '',
          'alertLevel': this.alert_level_value ? this.alert_level_value : '',
          'alertCreateTimeRangeStart': this.search.alert_date_from ? this.search.alert_date_from : '',
          'alertCreateTimeRangeEnd': this.search.alert_date_to ? this.search.alert_date_to : '',
          'objectType': this.search.alert_type ? this.search.alert_type : '',
          'deviceType': this.search.device_type ? this.search.device_type : '',
          'bizSys': this.search.system ? this.search.system : '',
          'monitDesc': this.search.alert_description ? this.search.alert_description : '',
          'idcType': this.search.resource_pool ? this.search.resource_pool : '',
          'sourceRoom': this.search.device_room ? this.search.device_room : '',
          'notifyType': this.search.noticeType ? this.search.noticeType.toString() : '',
          'notifyStatus': this.search.notice_status ? this.search.notice_status : '',
          'notifyTimeRangeStart': this.search.notice_date_from ? this.search.notice_date_from : '',
          'notifyTimeRangeEnd': this.search.notice_date_to ? this.search.notice_date_to : '',
          'transferTimeRangeStart': this.search.transfer_date_from ? this.search.transfer_date_from : '',
          'transferTimeRangeEnd': this.search.transfer_date_to ? this.search.transfer_date_to : '',
          'transferStaff': this.search.transfer_operator ? this.search.transfer_operator : '',
          'toConfirmStaff': this.search.confirm_operator ? this.search.confirm_operator : '',
          'operateStatus': this.search.operate_status ? this.search.operate_status : '',
          'source': this.search.alert_from ? this.search.alert_from : ''
        }
        return obj
      },
      // 获取列表数据相关方法
      getTableData (obj) {
        rbAlertKanBanServiceFactory.getSearchAlertList(obj).then((res) => {
          this.activityAlertData = this.packData(res.result)
          this.total = res.count
        }).catch(() => {
          this.$message.error('查询失败')
        })
      },
      // 封装得到的数据
      packData (arr) {
        // 列表数据封装
        if (arr.forEach) {
          arr.forEach((item) => {
            item.order_type = item.order_status === '1' ? '' : '告警工单'
            item.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', item.order_status)
            item.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', item.object_type)
            item.report_status = rbMirrorCommonService.common('REPORTSTATUS', '1', item.report_status)
            item.trans_status = rbMirrorCommonService.common('TRANSSTATUS', '1', item.trans_status)
//            item.order_type = rbMirrorCommonService.common('ORDERTYPE', '1', item.order_type)
            item.report_type = rbMirrorCommonService.common('REPORTTYPE', '1', item.report_type)
            item.cur_moni_time = formatDate(item.cur_moni_time)
            item.alert_start_time = formatDate(item.alert_start_time)
            item.alert_end_time = formatDate(item.alert_end_time)
            item.deliver_time = formatDate(item.deliver_time)
            item.confirmed_time = formatDate(item.confirmed_time)
          })
          return arr
        } else {
          // 详情数据封装
          arr.order_type = arr.order_status === '1' ? '' : '告警工单'
          arr.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', arr.order_status)
          arr.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', arr.object_type)
          arr.report_status = rbMirrorCommonService.common('REPORTSTATUS', '1', arr.report_status)
          arr.trans_status = rbMirrorCommonService.common('TRANSSTATUS', '1', arr.trans_status)
//          arr.order_type = rbMirrorCommonService.common('ORDERTYPE', '1', arr.order_type)
          arr.report_type = rbMirrorCommonService.common('REPORTTYPE', '1', arr.report_type)
          arr.cur_moni_time = formatDate(arr.cur_moni_time)
          arr.alert_start_time = formatDate(arr.alert_start_time)
          arr.deliver_time = formatDate(arr.deliver_time)
          arr.confirmed_time = formatDate(arr.confirmed_time)
          return arr
        }
      },
      // 查看告警详情
      goDetail (alert_id) {
        this.$router.push({
          path: '/mirror_alert/alert_his/detail',
          query: {
            alert_id: alert_id
          }
        })
      },
      // 锁屏
      lock () {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
          this.confirm = false
        }
        this.goScgreen = true
        this.lockScgreen = false
      },
      // 刷屏
      go () {
        if (this.timer) {
          clearInterval(this.timer)
        } else {
          this.timer = setInterval(() => {
            this.getTableData(this.packInit())
          }, 30000)
        }
        this.goScgreen = false
        this.lockScgreen = true
      },
      // 开始转派
      startTransfer () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行转派', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.getUserList()
          this.transfer.transferDialog = true
        }
      },
      selectPersonalM () {
        this.transfer.selectPersonal = true
        if (this.transfer.transferPersonalInput) {
        } else {
          this.notice.userList = []
          this.notice.userResult = []
          this.getUserList()
        }
      },
      confirmSelectPersonal () {
        this.transfer.transferTableData = []
        this.transfer.selectPersonal = false
        let i = this.transfer.count
        let username = []
        this.notice.userResult.forEach(item => {
          let obj = {
            'id': i + 1,
            'transfer_obj_type': '个人',
            'transfer_info': item
          }
          this.transfer.transferTableData.push(obj)
          username.push(item)
        })
        this.transfer.transferPersonalInput = username.toString()
      },
      deleteSelectPersonal (id) {
        if (this.transfer.transferTableData.length > 0) {
          for (let i = 0; i < this.transfer.transferTableData.length; i++) {
            if (this.transfer.transferTableData[i].id === id) {
              this.transfer.transferTableData.splice(i, 1)
            }
          }
          let user = []
          this.transfer.transferTableData.forEach(item => {
            user.push(item.transfer_info)
          })
          this.transfer.transferPersonalInput = user.toString()
        }
      },
      submitTransfer () {
        if (this.transfer.transferPersonalChecked === true) {
          const namespace = sessionStorage.getItem('namespace')
          let ids = ''
          let userNames = ''
          this.multipleSelection.forEach((item) => {
            ids += item.alert_id + ','
          })
          ids = ids.slice(0, -1)
          this.transfer.transferTableData.forEach((item) => {
            userNames += item.transfer_info + ','
          })
          userNames = userNames.slice(0, -1)
          let obj = {
            'namespace': namespace,
            'alert_ids': ids,
            'user_names': userNames
          }
          rbAlertKanBanServiceFactory.alertTransfer(obj).then((res) => {
            this.$message({
              message: '转派成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message.error('转派失败')
          })
          this.getTableData(this.packInit())
          this.transfer.transferDialog = false
          this.cancel('transfer')
        } else {
          this.$alert('请先进行个人确认!', '警告', {
            confirmButtonText: '确定'
          })
        }
      },
      // 开始派单
      startWork () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行派单', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.work.workDialog = true
        }
      },
      toWork (obj) {
        this.alertObjFlag = true
        this.alertObj = obj
        this.work.workDialog = true
      },
      submitWork () {
        let bool = true
        if (this.alertObjFlag === true) {
          this.multipleSelection.push(this.alertObj)
        }
        this.multipleSelection.forEach((item) => {
          if (item.order_status !== '未派单') {
            bool = false
          }
        })
        if (bool) {
          const namespace = sessionStorage.getItem('namespace')
          let str = ''
          this.multipleSelection.forEach((item) => {
            str += item.alert_id + ','
          })
          str = str.slice(0, -1)
          let obj = {
            'namespace': namespace,
            'alert_ids': str
          }
          rbAlertKanBanServiceFactory.alertHandle(obj).then(() => {
            this.$message({
              message: '派单成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message.error('派单失败')
          })
          this.getTableData(this.packInit())
        } else {
          this.$alert('只有未派单的告警才能派单', '警告', {
            confirmButtonText: '确定'
          })
        }
        this.alertObj = {}
        this.alertObjFlag = false
        this.multipleSelection = []
        this.work.workDialog = false
      },
      // 开始清除
      startClean () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行清除', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.clean.cleanDialog = true
        }
      },
      toClean (obj) {
        this.alertObj = obj
        this.alertObjFlag = true
        this.clean.cleanDialog = true
      },
      submitClean () {
        if (this.alertObjFlag === true) {
          this.multipleSelection.push(this.alertObj)
        }
        let bool = true
        this.multipleSelection.forEach((item) => {
          if (item.order_status === '处理中') {
            bool = false
          }
        })
        if (bool) {
          const namespace = sessionStorage.getItem('namespace')
          let str = ''
          this.multipleSelection.forEach((item) => {
            str += item.alert_id + ','
          })
          str = str.slice(0, -1)
          let obj = {
            'namespace': namespace,
            'alert_ids': str,
            'content': this.clean.cleanDialogTextArea
          }
          rbAlertKanBanServiceFactory.deleteAlert(obj).then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getTableData(this.packInit())
            }
          }).catch(() => {
            this.$message.error('删除失败')
          })
          this.getTableData(this.packInit())
        } else {
          this.$alert('工单状态中的告警不能清除', '警告', {
            confirmButtonText: '确定'
          })
        }
        this.alertObj = {}
        this.alertObjFlag = false
        this.multipleSelection = []
        this.clean.cleanDialog = false
      },
      // 开始通知
      startNotice () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行通知', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.getUserList()
          this.notice.noticeDialog = true
        }
      },
      sendSMS () {
        if (this.notice.userResult.length < 1) {
          this.$alert('请选择通知用户', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.$confirm('确认发送？').then(() => {
            this.notice.noticeDialog = false
            let str = ''
            this.notice.userResult.forEach((item) => {
              str += item + ','
            })
            str = str.slice(0, -1)
            let str1 = ''
            this.multipleSelection.forEach((item) => {
              str1 += item.alert_id + ','
            })
            str1 = str1.slice(0, -1)
            let obj = {
              user_names: str,
              alert_ids: str1
            }
            this.sms(obj)
            this.getTableData(this.packInit())
            this.notice.userResult = []
            this.notice.userList = []
          })
        }
      },
      sms (obj) {
        rbProjectDataServiceFactory.alertSMSNotify(obj).then((res) => {
          this.$message({
            message: '发送成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message.error('发送失败')
        })
      },
      sendEmail () {
        if (this.notice.userResult.length < 1) {
          this.$alert('请选择通知用户', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.$confirm('确认发送？').then(() => {
            this.notice.noticeDialog = false
            let str = ''
            this.notice.userResult.forEach((item) => {
              str += item + ','
            })
            str = str.slice(0, -1)
            let str1 = ''
            this.multipleSelection.forEach((item) => {
              str1 += item.alert_id + ','
            })
            str1 = str1.slice(0, -1)
            let obj = {
              user_names: str,
              alert_ids: str1
            }
            this.email(obj)
            this.getTableData(this.packInit())
            this.notice.userResult = []
            this.notice.userList = []
          })
        }
      },
      getUserList () {
        const namespace = sessionStorage.getItem('namespace')
        let arr = [namespace, {
          order_by: '-createTime',
          page_size: -1
        }]
        rbProjectDataServiceFactory.getUserList(arr).then((res) => {
          let arr = []
          res.result.forEach((item) => {
            let obj = {
              label: item.username,
              key: item.username
            }
            arr.push(obj)
          })
          this.notice.userList = arr
        })
      },
      email (obj) {
        rbProjectDataServiceFactory.alertNotify(obj).then((res) => {
          this.$message({
            message: '发送成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message.error('发送失败')
        })
      },
      searchData () {
        this.getTableData(this.packInit())
        if (this.search.searchDialog === true) {
          this.search.searchDialog = false
        }
      },
      cancel (obj) {
        if (obj === 'transfer') {
          this.transfer.transferDialog = false
          this.transfer.transferPersonalChecked = false
          this.transfer.transferPersonalInput = ''
          this.notice.userList = []
          this.notice.userResult = []
          this.transfer.transferTableData = []
          this.transfer.count = 0
        } else if (obj === 'work') {
          this.work.workDialog = false
          this.work.work_type = '0'
        } else if (obj === 'clean') {
          this.clean.cleanDialog = false
          this.clean.cleanDialogTextArea = ''
        } else if (obj === 'notice') {
          this.notice.noticeDialog = false
          this.notice.userList = []
          this.notice.userResult = []
        } else if (obj === 'selectPersonal') {
          this.transfer.selectPersonal = false
          this.notice.userList = []
          this.notice.userResult = []
        } else if (obj === 'search') {
          this.cancelSearch()
        } else if (obj === 'searchHead') {
//          this.device_relation_value = ''
//          this.monitor_relation_value = ''
          this.monitor_value = []
          this.alert_level_value = ''
          this.search.system = ''
          this.device_value = ''
          this.search.resource_pool = ''
          this.cancelSearch()
//          this.searchData()
        }
      },
      cancelSearch () {
        this.search.searchDialog = false
        this.search.alert_date_from = ''
        this.search.alert_date_to = ''
        this.search.alert_type = ''
        this.search.device_type = ''
        this.search.alert_description = ''
        this.search.device_room = ''
        this.search.noticeType = []
        this.search.notice_status = ''
        this.search.notice_date_from = ''
        this.search.notice_date_to = ''
        this.search.transfer_date_from = ''
        this.search.transfer_date_to = ''
        this.search.transfer_operator = ''
        this.search.confirm_operator = ''
        this.search.alert_from = ''
      },
      // 获取业务系统
      getBizSysList () {
        rbProjectDataServiceFactory.getBizSysList().then((res) => {
          if (res) {
            this.bizSysList = res
          }
        })
      },
      // 获取资源池
      getResourcePoor (type) {
        if (this.dicts) {
          rbCmdbServiceFactory.getDictValue({
            formId: this.dicts[type]
          }).then((data) => {
            data.formOptions.forEach(item => {
              let obj = {
                'name': item.name,
                'id': item.value
              }
              this.resourcePoors.push(obj)
            })
          })
        }
      },
      // 获取机房
      getIdcLocation (type) {
        if (this.dicts) {
          rbCmdbServiceFactory.getDictValue({
            formId: this.dicts[type]
          }).then((data) => {
            data.formOptions.forEach(item => {
              let obj = {
                'name': item.name,
                'id': item.value
              }
              this.idc_locations.push(obj)
            })
          })
        }
      },
      // 获取设备类型
      getDeviceType (type) {
        if (this.dicts) {
          rbCmdbServiceFactory.getDictValue({
            formId: this.dicts[type]
          }).then((data) => {
            data.formOptions.forEach(item => {
              let obj = {
                'name': item.name,
                'id': item.value
              }
              this.device_types.push(obj)
            })
          })
        }
      },
      getDict () {
        rbCmdbServiceFactory.getDicts().then((data) => {
          data.forEach(item => {
            this.dicts[item.code] = item.id
          })
          this.getResourcePoor('idcType')
          this.getIdcLocation('roomId')
          this.getDeviceType('device_type')
        })
      },
      // 导出
      resourceExport () {
        rbAlertKanBanServiceFactory.ExportGridData(this.packInit()).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '确认告警数据列表.xls'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      // 选择列

      // 1.获取选择列表的初始值
      getColumnFilter () {
        rbCmdbServiceFactory.getColumnFilter({menuType: 'alert', moduleId: this.moduleId}).then((data) => {
          this.filterForm = data
          if (data.columnInfo === null) {
            this.checkColumns.forEach(item => {
              this.columnFilter[item.keyCode] = false
            })
          } else {
            this.columnFilter = JSON.parse(data.columnInfo)
          }
          this.queryFields = []
          this.test = []
          this.checkColumns.forEach(item => {
            if (this.columnFilter[item.keyCode]) {
              item.keyIsSelected = true
              this.test.push(item.keyCode)
              this.queryFields.push(item)
            } else {
              item.keyIsSelected = false
            }
          })
          this.getTableData(this.packInit())
        })
      },
      // 2.更新选择的变化
      handleCheckedColumnChange (val) {
        this.checkColumns.forEach(item => {
          this.columnFilter[item.keyCode] = false
        })
        val.forEach(item => {
          this.columnFilter[item] = true
        })
        let data = this.filterForm
        data.columnInfo = JSON.stringify(this.columnFilter)
        data.columnMap = this.columnFilter
        rbCmdbServiceFactory.updateColumnFilter(data).then((data) => {
          this.getColumnFilter()
        })
      },
      // 自定义表头列宽
      flexColumnWidth (str) {
        let flexWidth = 120
        if (str === 'moni_index') {
          flexWidth += 130
        } else if (str === 'alert_start_time') {
          flexWidth += 35
        } else if (str === 'alert_end_time') {
          flexWidth += 35
        }
        return flexWidth + 'px'
      },
      dblhandleCurrentChange (column) {
        this.$router.push({
          path: '/mirror_alert/alert_his/detail',
          query: {
            activeNames: 'second',
            alert_id: column.alert_id,
            requestData: this.packInit()
          }
        })
      },
      getMonitorValue () {
        rbAlertServicesFactory.getMonitorValue().then((res) => {
          for (let i = 0; i < res.length; i++) {
            this.monitor_values.push(res[i])
          }
        })
      },
      sortByAlertLevel (obj1, obj2) {
        let val1 = obj1.alert_level
        let val2 = obj2.alert_level
        return val1 - val2
      }
    },
    watch: {
      confirm: {
        handler: function () {
          if (this.confirm === true) {
            this.alert_level = alert_level
            this.alert_types = alert_type
            this.relation = relation
            this.alert_froms = alert_from
            let obj = {}
            if (this.alertType === 'main') {
              this.alert_level_value = this.alert_Level ? this.alert_Level.toString() : ''
              this.search.operate_status = this.operationStatus
              obj = this.packInit()
            } else if (this.alertType === 'detail') {
              obj = this.requestData
            }
            this.getColumnFilter()
            this.getTableData(obj)
            this.getMonitorValue()
            if (this.timer) {
              clearInterval(this.timer)
            } else {
              this.timer = setInterval(() => {
                this.getTableData(obj)
              }, 30000)
            }
            this.getDict()
            this.getBizSysList()
          } else if (this.confirm === false) {
            clearInterval(this.timer)
            this.timer = null
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .confirm-alert-content {
    padding-left: 10px;
    .confirm-alert-row {
      display: flex;
      line-height: 36px;
      div {
        word-break: break-all;
      }
      > div:nth-child(odd) {
        text-align: left;
        padding-right: 5px;
        color: #666;
        flex: 0 0 100px;
      }
      > div:nth-child(even) {
        color: #666;
        flex: 1;
      }
    }
  }

  /deep/ .el-table {
    .el-table__body-wrapper {
      overflow-x: auto !important;
    }
  }
  * ::-webkit-scrollbar {
    height: 6px !important;
  }
</style>
