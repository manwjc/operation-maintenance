<template>
  <div class="component-container">
    <!-- 检索条件 -->
    <div>
      <el-row>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">设备IP</span>
            <span><el-input style="width:200px" v-model="device_device"></el-input></span>
          </div>
        </el-col>
        <el-col :span="6">
          <div  style="width: 350px">
            <span style="padding-right: 5px;">告警级别</span>
            <span><el-select  v-model="alert_level_value" placeholder="请选择" class="list-sel" clearable filterable style="width: 200px">
              <el-option
                v-for="item in alert_level"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select></span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">设备分类</span>
            <span>
              <el-select v-model="search.device_type" placeholder="请选择" class="list-sel" clearable filterable style="width: 200px">
                <el-option v-for="item in device_types" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px;">
            <el-button type="primary"  size="mini" plain @click="search.searchDialog=true">高级检索</el-button>
            <el-button type="primary"  size="mini" plain @click="searchData">查询</el-button>
            <el-button type="primary"  size="mini" plain @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">资源池</span>
            <span>
              <el-select v-model="search.resource_pool" placeholder="请选择" class="list-sel" clearable filterable style="width: 200px"
                         @change="changePool()" @clear="cleanPool()">
               <el-option v-for="item in resourcePoors" :key="item.value" :label="item.name" :value="item.value"> </el-option>
              </el-select>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">业务系统</span>
            <span>
              <!--
              <el-select v-model="search.system" placeholder="请选择" class="list-sel" filterable  clearable style="width: 200px">
                 <el-option v-for="item in bizSysList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              -->
              <treeselect class="yw-treeselect"
                v-model="bizSysDepChecked"
                :multiple="true"
                    :limit="1"
                :options="bizDepTreeSelOpts"
                placeholder="请选择"
              />
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">告警来源</span>
            <span><el-select v-model="search.alert_from" placeholder="请选择" class="list-sel" multiple collapse-tags clearable filterable style="width: 200px">
              <el-option v-for="item in alert_froms" :key="item.value" :label="item.label":value="item.value"></el-option>
            </el-select></span>
          </div>
        </el-col>
      </el-row>
      <hr style="color: #ebe9e9;margin: 0px; margin-top: 5px;margin-bottom: 5px; width: calc(100% - 10px);" />
      <el-row>
        <el-col :span="6">
          <div style="width: 350px">
            <span style="padding-right: 5px;">过滤器</span>
            <span>
              <el-select  v-model="filterId" @change="filterChange" clearable filterable style="width:200px;" >
            <el-option :key="val.id" :label="val.name" :value="val.id" v-for="(val, valIndex) in filterData" ></el-option>
          </el-select>
              <img src="/static/img/alert/filter-add.png" class="" @click="goFilter()" style="margin-left: 5px;height: 25px;"/>
            </span>
          </div>
        </el-col>
        <el-col :span="18">
          <div style="width: 100%;overflow-x: hidden;overflow-y: auto;height: 25px;">
            <a href="#" style="margin-right: 20px;height: 25px;line-height: 25px;" @click="getFilterData(scene.condition, scene.sceneId)" v-for="(scene, sIndex) in filterSceneData">{{scene.sceneName}}({{scene.count}})</a>
          </div>
        </el-col>
      </el-row>
      <hr style="color: #ebe9e9;margin: 0px; margin-top: 5px; width: calc(100% - 10px);" v-if="filterSceneData.length > 0"/>
    </div>
    <!-- 数据展示 -->
    <div class="body-container">
      <el-row>
        <el-col :span="24">
          <div style="padding-left: 0px;">
            <div style="float: left">
              <el-button style="font-size: 16px;" type="text" @click="transferDialog"><span class="fa fa-external-link"></span> 转派</el-button>
              <el-button style="font-size: 16px;" type="text" icon="el-icon-circle-check-outline" @click="confirmDialog">确认</el-button>
              <el-button style="font-size: 16px;" type="text" @click="sendDialog"><span class="fa fa-location-arrow" ></span> 派单</el-button>
              <el-button style="font-size: 16px;" type="text" icon="el-icon-delete" @click="cleanDialog">清除</el-button>
              <el-button style="font-size: 16px" type="text" @click="noticeDialog"><span class="fa fa-commenting-o"></span> 通知</el-button>
            </div>
            <div class="alertNum">
              <div class="alertNumContent">已确认:&nbsp;&nbsp;{{alertNum.confirmCount}}</div>
              <div class="alertNumContent">
                <span><rb-mirror-alert-num :status="1"></rb-mirror-alert-num></span>
                <span class="total">{{alertNum.tip}}</span>
              </div>
              <div class="alertNumContent">
                <span><rb-mirror-alert-num :status="2"></rb-mirror-alert-num></span>
                <span class="total">{{alertNum.low}}</span>
              </div>
              <div class="alertNumContent">
                <span><rb-mirror-alert-num :status="3"></rb-mirror-alert-num></span>
                <span class="total">{{alertNum.medium}}</span>
              </div>
              <div class="alertNumContent">
                <span><rb-mirror-alert-num :status="4"></rb-mirror-alert-num></span>
                <span class="total">{{alertNum.high}}</span>
              </div>
              <div class="alertNumContent">
                <span><rb-mirror-alert-num :status="5"></rb-mirror-alert-num></span>
                <span class="total">{{alertNum.serious}}</span>
              </div>
              <div class="alertNumContent">告警总数:&nbsp;&nbsp;{{alertNum.sum}}</div>
            </div>
            <div style="float: right">
              <span class="fa fa-unlock-alt" style="color:#C4C4C4;padding-left: 10px" v-show="lockScgreen"></span>
              <el-button style="font-size: 16px;" type="text"  @click="lock" v-show="lockScgreen">锁屏</el-button>
              <span class="fa fa-lock" style="color:#C4C4C4;padding-left: 10px" v-show="goScgreen"></span>
              <el-button style="font-size: 16px;" type="text"  @click="go" v-show="goScgreen">刷屏</el-button>
              <el-button style="font-size: 16px;" type="text" icon="el-icon-upload2"@click="resourceExport" >导出</el-button>
              <el-button style="font-size: 16px;" v-popover:popover  size="mini"type="text" icon="el-icon-d-caret">选择列
              </el-button>
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
      <el-table :data="activityAlertData" style="width: 100%;margin-top:5px;cursor: pointer;overflow: auto;height: calc(100vh - 315px)" stripe tooltip-effect="dark" border
                @selection-change="handleSelectionChange" size="samll" @row-dblclick="dblhandleCurrentChange($event)" >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="级别" width="100px" align="center" :sortable="true" :sort-method="sortByAlertLevel">
          <template slot-scope="scope" >
            <rb-mirror-alert-status :mode="'list'" :status="scope.row.alert_level" ></rb-mirror-alert-status>
          </template>
        </el-table-column>
        <el-table-column prop="device_ip" label="设备IP" align="center" width="150px" sortable></el-table-column>
        <el-table-column prop="idc_type" label="资源池" align="center" width="150px" :show-overflow-tooltip="true" sortable> </el-table-column>
        <!--<el-table-column prop="source_room" label="机房" align="center" width="150px" :show-overflow-tooltip="true" sortable> </el-table-column>-->
        <el-table-column prop="biz_sys" label="业务线" align="center" width="150px" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column prop="device_type" label="设备分类" align="center" width="150px" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column prop="moni_index" label="告警内容" align="center" width="300px" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column prop="alert_start_time" label="告警开始时间" align="center" width="180px"  sortable :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cur_moni_time" label="当前告警时间" align="center"  width="180px" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column v-for="itemData in checkColumns" :key="itemData.keyName" v-if="itemData.keyIsSelected" :prop="itemData.keyCode" :label="itemData.keyName"
                         align="center" width="180px" sortable :show-overflow-tooltip="true" :width="flexColumnWidth(itemData.keyCode)"></el-table-column>
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

    <!-- 告警确认 -->
    <el-dialog :visible.sync="confirm.confirmDialog" width="35%" center :show-close="false" :close-on-click-modal="false">
      <div style="padding-left: 10px">
        <el-row>
          <el-col :span="5"><div><span><label style="font-size:16px">告警确认</label></span></div></el-col>
          <!--<el-col :span="6"><span style="font-size: 14px">告警确认</span></el-col>-->
          <el-col :span="10"><span style="font-size: 14px"><i class="el-icon-info"></i>告警数据将移至已确认看板</span></el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row>
          <el-col :span="5"><div><span style="font-size: 14px">确认操作</span></div></el-col>
          <el-col :span="10"><span style="font-size: 14px"></span>直接确认</el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row>
          <el-col :span="5"><div><span style="font-size: 14px">告警确认内容</span></div></el-col>
          <el-col :span="10"><div>
            <el-input type="textarea" style="width: 300px" :rows="5" v-model="confirm.confirmDialogTextArea" ></el-input>
          </div></el-col>
        </el-row>
      </div>
      <div style="padding-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="5">
            <el-button type="primary" size="small"  @click="confirmElert">确 定</el-button>
            <el-button size="small" @click="cancel('confirm')">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <div class="alertNotice">
      <el-dialog v-if="notice.noticeDialog" title="告警通知" :visible.sync="notice.noticeDialog" width="45%" :before-close="handleClose">
         <!--<span>这是一段信息</span>-->
        <el-transfer
          filterable
          filter-placeholder="请输入用户名称"
          :titles="['用户列表', '已选用户']"
          v-model="userResult"
          :data="userList">
        </el-transfer>
        <!--<div>-->
          <!--<rb-mirror-alert-use-list ref="rbMirrorAlertUseList"></rb-mirror-alert-use-list>-->
        <!--</div>-->
        <div style="text-align: center;padding-top: 20px;">
          <el-button type="primary" @click="sendSMS()" class="tem-search" style="width:auto">发送短信</el-button>
          <el-button type="primary" @click="sendEmail()" class="tem-search" style="width:auto">发送邮件</el-button>
          <el-button type="primary" @click="cancel('notice')" class='tem-search'>返回</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 告警转派 -->
    <el-dialog :visible.sync="transfer.transferDialog"  width="45%" center :show-close="false" :close-on-click-modal="false">
      <div style="padding-left: 10px">
        <el-row>
          <el-col :span="5"><div><span><label style="font-size:16px">告警转派</label></span></div></el-col>
          <!--<el-col :span="6"><span style="font-size: 14px">告警转派</span></el-col>-->
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
          <el-col :span="19">
            <div style="float: left">
              <el-checkbox v-model="transfer.transferTeamChecked">个人</el-checkbox>
              <el-input v-model="transfer.transferPersonalInput" style="width: 150px"></el-input>
              <el-button type="text" @click="transfer.dialogChoose=true">个人选择器</el-button>
              <!--<i class="el-icon-circle-plus" style="padding-left: 10px" @click="addUser"></i>-->
            </div>
          </el-col>
        </el-row>
        <!-- <el-row >
           <el-col :span="19" :offset="5">
             <div style="float: left">
               <el-checkbox v-model="transfer.transferPersonalChecked">团队</el-checkbox>
               <el-input v-model="transfer.transferTeamInput" style="width: 150px"></el-input>
               <el-button type="text">团队选择器</el-button><i class="el-icon-circle-plus" style="padding-left: 10px"></i>
             </div>
           </el-col>
         </el-row>-->
        <el-row >
          <el-col :span="19" :offset="5">
            <div>
              <el-table :data="transfer.transferTableData" style="width: 100%;margin-top:15px" stripe tooltip-effect="dark">
                <!--<el-table-column prop="transfer_obj_type" label="转派对象类型" align="left" ></el-table-column>-->
                <el-table-column prop="transfer_info" label="转派对象信息" align="left"></el-table-column>
                <el-table-column prop="operation" label="操作" align="left">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
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
            <el-button type="primary" size="small" @click="turnSend">转派</el-button>
            <el-button size="small" @click="cancel('transfer')">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <div class="alertNotice">
      <el-dialog title="选择用户" :visible.sync="transfer.dialogChoose" width="50%"
                 center :show-close="false" :close-on-click-modal="false">
         <!--<span>这是一段信息</span>-->
        <el-transfer
          filterable
          filter-placeholder="请输入用户名称"
          :titles="['用户列表', '已选用户']"
          v-model="userResult"
          :data="userList">
        </el-transfer>
        <!--<div>-->
          <!--<rb-mirror-alert-use-list ref="rbMirrorAlertUseList"></rb-mirror-alert-use-list>-->
        <!--</div>-->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="choose" class="tem-search" style="width:auto">确认选择</el-button>
          <el-button type="primary" @click="cancel('choose')" class='tem-search'>返回</el-button>
        </span>
      </el-dialog>
    </div>
    <!--派单-->
    <el-dialog :visible.sync="send.sendDialog" width="46%" center :show-close="false" :close-on-click-modal="false">
      <div style="padding-left: 10px">
        <el-row>
          <el-col :span="5"><div><span><label>告警派单</label></span></div></el-col>
          <!--<el-col :span="6"><span>告警派单</span></el-col>-->
          <el-col :span="10"><span ><i class="el-icon-info"></i>告警数据派单到对应工单，进行工单处理</span></el-col>
        </el-row>
      </div>
      <div style="padding: 10px">
        <el-row>
          <el-col :span="5"><div><span style="font-size: 14px">派单操作</span></div></el-col>
          <el-col :span="10"><span style="font-size: 14px"></span>直接后台派单</el-col>
        </el-row>
      </div>
      <div style="padding-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="5">
            <el-button type="primary" size="small" @click="sendbpm">确 定</el-button>
            <el-button size="small" @click="cancel('send')">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--告警清除-->
    <el-dialog :visible.sync="clean.cleanDialog" width="35%" center :show-close="false" :close-on-click-modal="false">
            <div style="padding-left: 10px">
              <el-row>
                <el-col :span="5"><div><span><label>告警清除</label></span></div></el-col>
                <!--<el-col :span="9"><span>告警确认</span></el-col>-->
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
                <el-col :span="18">
                  <div><el-input type="textarea" :rows="5" v-model="clean.cleanDialogTextArea"></el-input></div>
                </el-col>
              </el-row>
            </div>
            <div style="padding-top: 20px">
              <el-row :gutter="20">
                <el-col :span="12" :offset="5">
                  <el-button type="primary" size="small" @click="goRemove">确 定</el-button>
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
          <div><el-select v-model="search.alert_type" placeholder="请选择" class="list-sel" clearable filterable style="width: 150px">
            <el-option v-for="item in search.alert_types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select></div>
          <div>监控对象</div>
          <div>
              <el-select v-model="monitor_value" placeholder="请选择" multiple filterable collapse-tags style="width:150px" size="mini">
               <el-option v-for="item in monitor_values" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </div>
        </div>
        <div class="confirm-alert-row">
          <div>机房</div>
          <div><el-select v-model="search.device_room" placeholder="请选择" class="list-sel" clearable filterable style="width: 150px">
            <el-option
              v-for="item in idc_locations"
              :key="item.value"
              :label="item.name"
              :value="item.value">
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
          <div>确认状态</div>
          <div>
              <el-select v-model="queryType" placeholder="请选择" clearable style="width:150px">
                <el-option label="活动告警" :value="0"> </el-option>
                <el-option label="确认告警" :value="1"> </el-option>
              </el-select>
            </div>
        </div>
      </div>
      <div style="padding-top: 20px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="5">
            <el-button type="primary" size="small" @click="searchData">查 询</el-button>
            <el-button size="small" @click="cancelHighSearch()">取 消</el-button>
          </el-col>
        </el-row>
      </div>
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
  import rbConfigDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
  import rbMirrorAlertUseList from 'src/pages/mirror_alert/common/rb-mirror-alert-use-list.vue'
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
  import rbMirrorAlertNum from 'src/pages/mirror_alert/common/rb-mirror-alert-num.vue'
  import rbAlertFilterServicesFactory from 'src/services/alert/rb-alertFilter-services.factory.js'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    components: {
      rbMirrorAlertStatus, rbMirrorAlertNum, rbMirrorAlertUseList, Treeselect
    },
//    props: [
//      'activity', 'alertType', 'operationStatus', 'alert_Level', 'requestData'
//    ],
    data () {
      return {
        bizSysDepChecked: [],
        bizDepTreeSelOpts: [],
        sceneId: '',
        filterFlag: false,
        filterCondition: '',
        filterData: [],
        filterId: '',
        filterSceneData: [],
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
//          {'keyCode': 'biz_sys', 'keyName': '业务线', 'keyIsSelected': false},
           {'keyCode': 'moni_object', 'keyName': '监控对象', 'keyIsSelected': false},
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
          'moni_object': false,
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
          'deliver_time': false
        },
        classA: 'classA',
        classB: 'classB',
        alertList: [],
        // 选择列存放的值
        filterForm: {},
        columnInfo: '',
        checkedcolumns: [],
        moduleId: '12345XYUEFKSLDDLDKFJAL',
        column_data: {},
        columnList: [],
        detailObjId: '',
        detailOrderStatus: '',
        // 多选框模板存放的值
        multipleSelection: [],
        activityAlertData: [], // 活动告警数据数组
        currentPage: 1, // 当前页
        pageSize: 20, // 分页每页多少行数据
        pageSizes: [20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        deviceList: [], // 查询出的设备
        lockScgreen: true,
        goScgreen: false,
//        device_relation_value: '',
//        monitor_relation_value: '',
        device_device: '', // 包含的设备
        monitor_device: '', // 监控项的设备
        monitor_value: [],
        monitor_values: [],
        // 告警级别
        alert_level_value: '',
        alert_level: '',
        // 告警类型
        object_type: '',
        queryType: '',
        // 设备关系
        relation: '',
        // 业务系统
        bizSysList: [],
        // 资源池
        resourcePoors: [],
        // 机房
        idc_locations: [],
        // 设备类型
        device_types: [],
        alert_froms: [],
        // 告警派单
        send: {
          send_type: '', // 派单类型
          sendDialog: false
        },
        // 用户列表
        userList: [],
        userResult: [],
        // 告警清除
        clean: {
          cleanDialog: false,
          cleanDialogTextArea: ''
        },
        // 告警确认
        confirm: {
          confirmDialog: false, // 弹出框
          confirmDialogTextArea: '' // 告警确认弹出框文本域
        },
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
          dialogChoose: false,
          transferDialog: false,
          transferTeamChecked: false, // 团队
          transferTeamInput: '',
          choose_user: '', // 已选择的用户
          transferPersonalChecked: false, // 个人
          transferPersonalInput: '',
          transferTableData: []
        },
        // 高级检索
        search: {
          searchDialog: false,
          alert_date_from: '', // 告警开始时间
          alert_date_to: '', // 告警结束时间
          alert_type: '', // 告警分类
          alert_types: [],
          device_type: '', // 设备类型
          system: '', // 业务系统
          alert_description: '', // 告警描述
          resource_pool: '', // 资源池
          device_room: '', // 机房
          notice_date_from: '', // 通知开始时间
          notice_date_to: '', // 通知结束时间
          noticeType: [], // 通知方式
          notice_status: '', // 通知状态
//          confirm_date_from: '', // 确认开始时间
//          confirm_date_to: '', // 确认结束时间
          transfer_date_from: '', // 转派开始时间
          transfer_date_to: '', // 转派结束时间
//          work_date_from: '', // 派单开始时间
//          work_date_to: '', // 派单结束时间
          transfer_operator: '', // 转派操作人
          confirm_operator: '', // 待确认人
          operate_status: '', // 操作状态
          alert_from: [] // 告警来源
        },
        activityName: false,
        dicts: {},
        alertNum: {
          sum: 0,
          serious: 0,
          high: 0,
          medium: 0,
          low: 0,
          tip: 0,
          confirmCount: 0
        },
        timer_frequency: 60000
      }
    },
    watch: {
      filterFlag: function (val) {
        clearInterval(this.timer)
        this.go()
      }
    },
    mounted () {
      this.initAlertSum()
      this.init()
      this.initFilter()
    },
    destroyed () {
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      getBizSysTreeData () {
        let _this = this
        rbAlertKanBanServiceFactory.bizSysTreeOptions().then(res => {
          _this.bizDepTreeSelOpts = res
        })
      },
      goFilter () {
        this.$router.push({path: '/mirror_alert/filter/list/'})
      },
      getFilterData (condition, sceneId) {
        this.sceneId = sceneId
        this.filterFlag = true
        this.filterCondition = condition
        this.searchFilterData()
      },
      searchFilterData () {
        let page = {
          page_no: this.currentPage,
          page_size: this.pageSize,
          condition: this.filterCondition
        }
        rbAlertFilterServicesFactory.getFilterData(page).then((res) => {
          this.activityAlertData = this.packData(res.result)
          this.total = res.count
          let sceneId = this.sceneId
          if (this.filterSceneData.length > 0) {
            let currentScene = this.filterSceneData.find(function (o) {
              return o.sceneId === sceneId
            })
            if (currentScene !== undefined && currentScene !== null) {
              currentScene.count = this.total
              this.$forceUpdate()
            }
          }
        }).catch(() => {
          this.$message.error('查询失败')
        })
      },
      initFilter () {
        rbAlertFilterServicesFactory.getAll().then((res) => {
          this.filterData = res
        })
      },
      filterChange (val) {
        if (val === '' || val === null) {
          this.filterSceneData = []
        } else {
          rbAlertFilterServicesFactory.getFilterScene(val, true).then((res) => {
            this.filterSceneData = res
          })
        }
      },
      initAlertSum () {
        this.activityName = this.activity
        if (this.$route.query.alertType === 'main') {
          this.alertType = this.$route.query.alertType === 'main' ? 'main' : 'detail'
          this.queryType = this.$route.query.operation_status === 2 ? 0 : this.$route.query.operation_status
          this.activity_alert_level = this.$route.query.alert_level
        } else if (this.$route.query.alertType === 'detail') {
          this.requestData = this.$route.query.requestData
          this.queryType = this.requestData.queryType
          this.currentPage = this.requestData.page_no
          this.pageSize = this.requestData.page_size
          this.device_device = this.requestData.deviceIp
          this.monitor_value = this.requestData.monitItems
          this.alert_level_value = this.requestData.alertLevel
          this.search.alert_date_from = this.requestData.alertCreateTimeRangeStart
          this.search.alert_date_to = this.requestData.alertCreateTimeRangeEnd
          this.search.alert_type = this.requestData.objectType
          this.search.device_type = this.requestData.deviceType
          this.search.system = this.requestData.bizSys
          this.search.alert_description = this.requestData.monitDesc
          this.search.resource_pool = this.requestData.idcType
          this.search.device_room = this.requestData.sourceRoom
          this.search.noticeType = this.requestData.notifyType
          this.search.notice_status = this.requestData.notifyStatus
          this.search.notice_date_from = this.requestData.notifyTimeRangeStart
          this.search.notice_date_to = this.requestData.notifyTimeRangeEnd
          this.search.transfer_date_from = this.requestData.transferTimeRangeStart
          this.search.transfer_date_to = this.requestData.transferTimeRangeEnd
          this.search.transfer_operator = this.requestData.transferStaff
          this.search.confirm_operator = this.requestData.toConfirmStaff
          this.search.operate_status = this.requestData.operateStatus
          this.search.alert_from = this.requestData.source
        }
        this.getAlertSum()
      },
      getAlertSum () {
        let code = '0,1'
        rbAlertServicesFactory.getAlertCount(code).then((res) => {
          this.alertNum.sum = res.summary
          this.alertNum.serious = res.serious
          this.alertNum.high = res.high
          this.alertNum.medium = res.medium
          this.alertNum.low = res.low
          this.alertNum.tip = res.tip
          this.alertNum.confirmCount = res.confirmed
        })
      },
      // 1 element相关方法 多选框
      handleSelectionChange (val) {
        this.alertList = []
        this.multipleSelection = val
        val.forEach(item => {
          this.alertList.push({alertId: item.alertId})
        })
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.searchDataGo()
      },
      searchDataGo () {
        if (this.filterFlag) {
          this.searchFilterData()
        } else {
          this.searchData(1)
        }
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.searchDataGo()
      },
      // 对话框
      handleClose (done) {
        done()
      },
      // 获取业务系统
      getBizSysList () {
        let obj = {
          'type': 'bizSystem',
          'pid': '',
          'pValue': '',
          'pType': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.bizSysList = res
          }
        })
      },
      changePool () {
        this.bizSysList = []
        let obj = {
          'type': 'bizSystem',
          'pid': '',
          'pValue': this.search.resource_pool ? this.search.resource_pool : '',
          'pType': 'idcType'
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.bizSysList = res
          }
        })
      },
      cleanPool () {
        this.bizSysList = []
        this.search.system = ''
        this.getBizSysList()
      },
      // 获取用户列表
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
              label: item.name,
              key: item.username
            }
            arr.push(obj)
          })
          this.userList = arr
        })
      },
      // 获取资源池
      getResourcePoor (type) {
        // if (this.dicts) {
        //  rbCmdbServiceFactory.getDictValue({
        //    formId: this.dicts[type]
        //  }).then((data) => {
        //    data.formOptions.forEach(item => {
        //      let obj = {
        //        'name': item.name,
        //        'id': item.value
        //      }
        //      this.resourcePoors.push(obj)
        //    })
        //  })
        // }
        let obj = {
          'type': 'idcType',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.resourcePoors = res
          }
        })
      },
      // 获取机房
      getIdcLocation (type) {
        /* if (this.dicts) {
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
        } */
        let obj = {
          'type': 'roomId',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.idc_locations = res
          }
        })
      },
      // 获取设备类型
      getDeviceType (type) {
        /* if (this.dicts) {
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
        } */
        let obj = {
          'type': type,
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.device_types = res
          }
        })
      },
      getDict () {
//        rbCmdbServiceFactory.getDicts().then((data) => {
//          data.forEach(item => {
//            this.dicts[item.code] = item.id
//          })
//        })
        this.getResourcePoor('idcType')
        this.getIdcLocation('roomId')
        this.getDeviceType('device_class')
      },
      // 获取设备
      querySearchDevice () {
      },

      // 获取列表数据相关方法
      getTableData (obj) {
        rbAlertKanBanServiceFactory.getSearchAlertList(obj).then((res) => {
          this.activityAlertData = this.packData(res.result)
          this.total = res.count
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
            item.report_status = rbMirrorCommonService.common('REPORTSTATUS', '1', item.report_status + '')
            item.trans_status = rbMirrorCommonService.common('TRANSSTATUS', '1', item.trans_status)
            item.report_type = rbMirrorCommonService.common('REPORTTYPE', '1', item.report_type + '')
            item.cur_moni_time = formatDate(item.cur_moni_time)
            item.alert_start_time = formatDate(item.alert_start_time)
            item.alert_end_time = formatDate(item.alert_end_time)
            item.deliver_time = formatDate(item.deliver_time)
            item.confirmed_time = formatDate(item.confirmed_time)
            item.report_time = formatDate(item.report_time)
            item.trans_time = formatDate(item.trans_time)
          })
          return arr
        } else {
          // 详情数据封装
          arr.order_type = arr.order_status === '1' ? '' : '告警工单'
          arr.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', arr.order_status)
          arr.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', arr.object_type)
          arr.report_status = rbMirrorCommonService.common('REPORTSTATUS', '1', arr.report_status + '')
          arr.trans_status = rbMirrorCommonService.common('TRANSSTATUS', '1', arr.trans_status)
          arr.report_type = rbMirrorCommonService.common('REPORTTYPE', '1', arr.report_type + '')
          arr.cur_moni_time = formatDate(arr.cur_moni_time)
          arr.alert_start_time = formatDate(arr.alert_start_time)
          arr.deliver_time = formatDate(arr.deliver_time)
          arr.confirmed_time = formatDate(arr.confirmed_time)
          arr.report_time = formatDate(arr.report_time)
          arr.trans_time = formatDate(arr.trans_time)
          return arr
        }
      },
      // 封装请求数据的对象
      packInit () {
        let obj = {
          'queryType': this.queryType,
          'order': 'DESC',
          'page_no': this.currentPage,
          'page_size': this.pageSize,
          'sort_name': '',
//          'deviceOp': this.device_relation_value ? this.device_relation_value : '',
//          'monitOp': this.monitor_relation_value ? this.monitor_relation_value : '',
          'deviceIp': this.device_device ? this.device_device : '',
          'monitItems': this.monitor_value ? this.monitor_value.toString() : '',
          'alertLevel': this.alert_level_value ? this.alert_level_value : '',
          'alertCreateTimeRangeStart': this.search.alert_date_from ? this.search.alert_date_from : '',
          'alertCreateTimeRangeEnd': this.search.alert_date_to ? this.search.alert_date_to : '',
          'objectType': this.search.alert_type ? this.search.alert_type : '',
          'deviceType': this.search.device_type ? this.search.device_type : '',
          'bizSys': (this.bizSysDepChecked && this.bizSysDepChecked.length > 0) ? _.join(this.bizSysDepChecked, ',') : '',
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
          'source': this.search.alert_from ? this.search.alert_from.toString() : ''
        }
        return obj
      },
      // 封装时间戳
      packTime (str) {
        return formatDate(str)
      },
      // 告警时长
      packTimePoint (num) {
        let date = new Date().getTime()
        var total = (date - num) / 1000
        var day = parseInt(total / (24 * 60 * 60))  //  计算整数天数
        var afterDay = total - day * 24 * 60 * 60  //  取得算出天数后剩余的秒数
        var hour = parseInt(afterDay / (60 * 60))  //  计算整数小时数
        var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60  //  取得算出小时数后剩余的秒数
        var min = parseInt(afterHour / 60)  //  计算整数分
        var second = parseInt(total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60)  //  取得算出分后剩余的秒数
        return `${day}d ${hour}h ${min}m ${second}s`
      },
      // 查询
      searchData (num) {
        this.filterFlag = false
        if (num !== 1) {
          // 搜索前将当前页置为1
          this.currentPage = 1
        }
        this.getTableData(this.packInit())
        if (this.search.searchDialog === true) {
          this.search.searchDialog = false
        }
      },
      cancelSearch () {
        this.search.searchDialog = false
        this.search.alert_date_from = ''
        this.search.alert_date_to = ''
        this.search.alert_type = ''
        this.monitor_value = []
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
//        this.search.alert_from = ''
        this.queryType = ''
        this.bizSysDepChecked = []
      },
      // 重置
      reset () {
//        this.device_relation_value = ''
//        this.monitor_relation_value = ''
        this.device_device = ''
        this.search.device_type = ''
        this.alert_level_value = ''
        this.search.system = ''
        this.search.resource_pool = ''
//        this.queryType = ''
        this.search.alert_from = []
        this.bizSysDepChecked = []
        this.cancelSearch()
      },
      // 转派
      choose () {
        this.transfer.transferTableData = []
        this.transfer.dialogChoose = false
//        let userResult = this.$refs.rbMirrorAlertUseList.userResult
//        let userList = this.$refs.rbMirrorAlertUseList.userList
        let userResult = this.userResult
        let userList = this.userList
        let i = 0
        let username = []
        userResult.forEach(item => {
          for (let j in userList) {
            let user = userList[j]
            if (item === user.key) {
              let obj = {
                'id': i,
                'transfer_obj_type': '个人',
                'transfer_info': user.label,
                'key': item
              }
              i++
              this.transfer.transferTableData.push(obj)
              username.push(user.label)
              break
            }
          }
        })
        this.transfer.transferPersonalInput = username.toString()
      },
      // addUser () {
      //   this.$alert('请选择告警进行转派', '警告', {
      //     confirmButtonText: '确定'
      //   })
      // },
      deleteUser (id) {
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
      transferDialog () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行转派', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.transfer.transferDialog = true
        }
      },
      turnSend () {
        if (this.multipleSelection.length < 1) {
          this.$alert('告警列表已刷新，请重新选择告警', '警告', {
            confirmButtonText: '确定'
          })
          this.transfer.transferDialog = false
          return
        }
        const namespace = sessionStorage.getItem('namespace')
        let str = ''
        //  let str1 = ''
        let str2 = ''
        this.multipleSelection.forEach((item) => {
          str += item.alert_id + ','
        })
        str = str.slice(0, -1)
        // if (this.transferTableData.length < 1) {
        //   this.$alert('请选择通知用户', '警告', {
        //     confirmButtonText: '确定'
        //   })
        // }
        this.transfer.transferTableData.forEach((item) => {
          //  str1 += item.transfer_id + ','
          str2 += item.key + ','
        })
        //   str1 = str1.slice(0, -1)
        str2 = str2.slice(0, -1)
        let obj = {
          'namespace': namespace,
          'alert_ids': str,
          // 'user_ids': str1,
          'user_names': str2
        }
        rbAlertKanBanServiceFactory.alertTransfer(obj).then((res) => {
          this.$message({
            message: '转派成功',
            type: 'success'
          })
          this.userList = []
          this.userResult = []
        }).catch(() => {
          this.$message.error('转派失败')
        })
        this.transfer.transferDialog = false
      },
      // 确认
      confirmDialog () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行确认', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.confirm.confirmDialog = true
        }
      },
      confirmElert () {
        if (this.multipleSelection.length < 1) {
          this.$alert('告警列表已刷新，请重新选择告警', '警告', {
            confirmButtonText: '确定'
          })
          this.confirm.confirmDialog = false
          return
        }
        const namespace = sessionStorage.getItem('namespace')
        let str = ''
        if (this.detailObjId) {
          str = this.detailObjId
        } else {
          this.multipleSelection.forEach((item) => {
            str += item.alert_id + ','
          })
          str = str.slice(0, -1)
        }
        if (!this.confirm.confirmDialogTextArea) {
          this.$alert('告警确认原因不能为空,请填写!', '警告', {
            confirmButtonText: '确定'
          })
          this.confirm.confirmDialog = false
          return
        }
        let obj = {
          namespace: namespace,
          alert_ids: str,
          content: this.confirm.confirmDialogTextArea
        }
        rbAlertKanBanServiceFactory.alertConfirm(obj).then((res) => {
          this.$message({
            message: '确认成功',
            type: 'success'
          })
          this.detailObjId = ''
        }).catch(() => {
          this.$message.error('确认失败')
        })
        this.confirm.confirmDialog = false
        this.getTableData(this.packInit())
      },
      // 派单
      sendDialog () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行派单', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.send.sendDialog = true
        }
      },
      sendbpm () {
        let bool = true
        if (this.detailOrderStatus) {
          if (this.detailOrderStatus !== '未派单') {
            bool = false
          }
        } else {
          this.multipleSelection.forEach((item) => {
            if (item.order_status !== '未派单') {
              bool = false
            }
          })
        }
        if (bool) {
          const namespace = sessionStorage.getItem('namespace')
          let str = ''
          if (this.detailObjId) {
            str = this.detailObjId
          } else {
            this.multipleSelection.forEach((item) => {
              str += item.alert_id + ','
            })
            str = str.slice(0, -1)
          }
          let obj = {
            'namespace': namespace,
            'alert_ids': str
          }
          rbAlertKanBanServiceFactory.alertHandle(obj).then(() => {
            this.$message({
              message: '派单成功',
              type: 'success'
            })
            this.detailObjId = ''
            this.detailOrderStatus = ''
          }).catch(() => {
            this.$message.error('派单失败')
          })
        } else {
          this.$alert('只有未派单的告警才能派单', '警告', {
            confirmButtonText: '确定'
          })
        }
        this.send.sendDialog = false
        this.getTableData(this.packInit())
      },
      // 删除告警
      cleanDialog () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行清除', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.clean.cleanDialog = true
        }
      },
      goRemove () {
        let bool = true
        if (this.detailOrderStatus) {
          if (this.detailOrderStatus !== '未派单') {
            bool = false
          }
        } else {
          this.multipleSelection.forEach((item) => {
            if (item.order_status !== '未派单') {
              bool = false
            }
          })
        }
        if (bool) {
          if (this.multipleSelection.length < 1) {
            this.$alert('告警列表已刷新，请重新选择告警', '警告', {
              confirmButtonText: '确定'
            })
            this.clean.cleanDialog = false
            return
          }
          const namespace = sessionStorage.getItem('namespace')
          let str = ''
          if (this.detailObjId) {
            str = this.detailObjId
          } else {
            this.multipleSelection.forEach((item) => {
              str += item.alert_id + ','
            })
            str = str.slice(0, -1)
          }
          if (!this.clean.cleanDialogTextArea) {
            this.$alert('告警清除原因不能为空,请填写!', '警告', {
              confirmButtonText: '确定'
            })
            this.clean.cleanDialog = false
            return
          }
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
            this.detailObjId = ''
            this.detailOrderStatus = ''
          }).catch(() => {
            this.$message.error('删除失败')
          })
        } else {
          this.$alert('工单状态中的告警不能清除', '警告', {
            confirmButtonText: '确定'
          })
        }
        this.clean.cleanDialog = false
        this.getTableData(this.packInit())
      },
      // 告警通知
      noticeDialog () {
        if (this.multipleSelection.length < 1) {
          this.$alert('请选择告警进行清除', '警告', {
            confirmButtonText: '确定'
          })
        } else {
          this.notice.noticeDialog = true
          this.getUserList()
        }
      },
      // 发送短信
      sendSMS () {
//        let userList = this.$refs.rbMirrorAlertUseList.userResult
        let userList = this.userResult
        if (userList.length < 1) {
          this.$alert('请选择通知用户', '警告', {
            confirmButtonText: '确定'
          })
        } else if (this.multipleSelection.length < 1) {
          this.$alert('告警列表已刷新，请重新选择告警', '警告', {
            confirmButtonText: '确定'
          })
          this.notice.noticeDialog = false
        } else {
          this.$confirm('确认发送？').then(() => {
            this.notice.noticeDialog = false
            let str = ''
            userList.forEach((item) => {
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
            this.userResult = []
            this.userList = []
            this.getUserList()
            this.sms(obj)
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
      // 发送邮件
      sendEmail () {
//        let userList = this.$refs.rbMirrorAlertUseList.userResult
        let userList = this.userResult
        if (userList.length < 1) {
          this.$alert('请选择通知用户', '警告', {
            confirmButtonText: '确定'
          })
        } else if (this.multipleSelection.length < 1) {
          this.$alert('告警列表已刷新，请重新选择告警', '警告', {
            confirmButtonText: '确定'
          })
          this.notice.noticeDialog = false
        } else {
          this.$confirm('确认发送？').then(() => {
            this.notice.noticeDialog = false
            let str = ''
            userList.forEach((item) => {
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
            this.userResult = []
            this.userList = []
            this.getUserList()
            this.email(obj)
          })
        }
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
      // 锁屏
      lock () {
        clearInterval(this.timer)
        this.lockScgreen = false
        this.goScgreen = true
      },
      // 刷屏
      go () {
        this.timer = setInterval(() => {
          if (this.filterFlag) {
            this.searchFilterData()
          } else {
            this.getTableData(this.packInit())
          }
          this.getAlertSum()
        }, this.timer_frequency)
        this.goScgreen = false
        this.lockScgreen = true
      },
      // 导出
      resourceExport () {
        rbAlertKanBanServiceFactory.ExportGridData(this.packInit()).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '当前告警数据列表.xlsx'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      // exportTable () {
      //   if (this.alertList.length > 0) {
      //     let data = []
      //     this.multipleSelection.forEach(item => {
      //       let log = {}
      //       log['等级'] = item.alert_level
      //       this.checkColumns.forEach(field => {
      //         if (field.keyIsSelected === true) {
      //           log[field.keyName] = item[field.keyCode]
      //         }
      //       })
      //       data.push(log)
      //     })
      //     rbAlertKanBanServiceFactory.changeLogExport(data).then((data) => {
      //       let blob = new Blob([data], {type: 'application/vnd.ms-excel'})
      //       let objectUrl = URL.createObjectURL(blob)
      //       // window.location.href = objectUrl
      //       let downLoadElement = document.createElement('a')
      //       downLoadElement.href = objectUrl
      //       downLoadElement.download = '异常变更列表.xls'
      //       document.body.appendChild(downLoadElement)
      //       downLoadElement.click()
      //       document.body.removeChild(downLoadElement)
      //       URL.revokeObjectURL(objectUrl)
      //     })
      //   } else {
      //     this.$message.info('请至少选择一条需要导出的异常变更数据')
      //   }
      // },
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
//          this.getTableData(this.packInit())
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
        rbCmdbServiceFactory.updateColumnFilter(data).then().then((data) => {
          this.getColumnFilter()
          this.getTableData(this.packInit())
        })
      },
      // 操作
      // 查看告警详情
      goDetail (alert_id) {
        this.$router.push({
          path: '/mirror_alert/alert_his/detail',
          query: {
            alert_id: alert_id
          }
        })
      },
      // 派单单条告警
      sendOne (alert_id, order_status) {
        this.send.sendDialog = true
        this.detailObjId = alert_id
        this.detailOrderStatus = order_status
      },
      // 确认单条告警
      confirmElertOne (obj) {
        this.confirm.confirmDialog = true
        this.detailObjId = obj
        // const namespace = sessionStorage.getItem('namespace')
        // let obj = {
        //   namespace: namespace,
        //   alert_ids: alert_id,
        //   content: this.confirm.confirmDialogTextArea
        // }
        // rbAlertKanBanServiceFactory.alertConfirm(obj).then((res) => {
        //   this.$message({
        //     message: '确认成功',
        //     type: 'success'
        //   })
        // }).catch(() => {
        //   this.$message.error('确认失败')
        // })
        // this.confirm.confirmDialog = false
        // this.getTableData(this.packInit())
      },
      // 删除单条告警
      goRemoveOne (alert_id, order_status) {
        this.clean.cleanDialog = true
        this.detailObjId = alert_id
        this.detailOrderStatus = order_status
      },
      cancel (obj) {
        if (obj === 'transfer') {
          this.transfer.transferDialog = false
          this.transfer.transferPersonalChecked = false
          this.transfer.transferPersonalInput = ''
          this.userList = []
          this.userResult = []
          this.transfer.transferTableData = []
          this.getUserList()
        } else if (obj === 'send') {
          this.send.sendDialog = false
          this.send.send_type = '0'
        } else if (obj === 'clean') {
          this.clean.cleanDialog = false
          this.clean.cleanDialogTextArea = ''
        } else if (obj === 'notice') {
          this.notice.noticeDialog = false
          this.userList = []
          this.userResult = []
        } else if (obj === 'choose') {
          this.transfer.dialogChoose = false
          this.userList = []
          this.userResult = []
          this.getUserList()
        } else if (obj === 'confirm') {
          this.confirm.confirmDialog = false
          this.confirm.confirmDialogTextArea = ''
        }
      },
      cancelHighSearch () {
        this.search.searchDialog = false
        this.search.alert_date_from = ''
        this.search.alert_date_to = ''
        this.search.alert_type = ''
//        this.search.device_type = ''
        this.monitor_value = []
        this.search.system = ''
        this.search.alert_description = ''
        this.search.resource_pool = ''
        this.search.device_room = ''
        this.search.noticeType = []
        this.search.notice_status = ''
        this.search.notice_date_from = ''
        this.search.notice_date_to = ''
        this.search.transfer_date_from = ''
        this.search.transfer_date_to = ''
        this.search.transfer_operator = ''
        this.search.confirm_operator = ''
        this.queryType = ''
      },
      getTimerFrequency () {
        let obj = {
          'type': 'timer_frequency'
        }
        rbConfigDictServiceFactory.getDictsByType(obj).then((res) => {
          this.timer_frequency = res[0].value
        })
      },
      init () {
        this.alert_level = alert_level
        this.search.alert_types = alert_type
        this.relation = relation
        this.alert_froms = alert_from
        this.getColumnFilter()
        let obj = {}
        if (this.alertType === 'main') {
          this.alert_level_value = this.$route.query.alert_level ? this.$route.query.alert_level.toString() : ''
//          this.search.operate_status = this.operationStatus
          obj = this.packInit()
          let span = this.$route.query.span
          let device_type = this.$route.query.device_name
          this.$route.query.device_type = this.$route.query.device_type
          if (span) {
            obj.span = span
          }
          obj.deviceType = device_type
          if (device_type) {
            this.search.device_type = device_type
          }
          let idc_type = this.$route.query.idcType
          let source_room = this.$route.query.sourceRoom
          let device_room = this.$route.query.deviceRoom
          if (idc_type) {
            obj.idcType = idc_type
            this.search.resource_pool = idc_type
          }
          if (source_room) {
            obj.sourceRoom = source_room
          }
          if (device_room) {
            this.search.device_room = device_room
          }
        } else if (this.alertType === 'detail') {
          obj = this.requestData
        } else {
          obj = this.packInit()
        }
        this.getTableData(obj)
        this.getTimerFrequency()
        if (this.timer) {
          clearInterval(this.timer)
        } else {
          this.timer = setInterval(() => {
            this.getAlertSum()
            this.getTableData(this.packInit())
            this.getTimerFrequency()
          }, this.timer_frequency)
        }
        this.getMonitorValue()
        this.getDict()
        this.getBizSysList()
        this.getUserList()
        this.getBizSysTreeData()
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
    }
  }
</script>

<style lang="scss" scoped>
 .classA {
   width: 220px
 }
 .classB{
   width: 120px
 }
  /deep/ .el-table {
    .el-table__body-wrapper {
      overflow-x: auto !important;
    }
  }
 * ::-webkit-scrollbar {
   height: 12px !important;
 }

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
      .alertNotice {
        /deep/ .el-dialog {
          min-width:540px;
          .el-dialog__body{
            text-align:center;
            .el-transfer-panel{
              text-align:left;
            }
          }
        }
      }
    }
  }
 /deep/ .el-row {
   margin-bottom: 5px;
 }
 /deep/ .el-row:last-child {
   margin-bottom: 0px;
 }
 /deep/ .el-table td,/deep/ .el-table th {
   padding: 1px 0;
 }
 /deep/ .el-col {
   .el-input__inner {
     height: 25px !important;
   }
 }
 /deep/ .el-button--mini,/deep/ .el-button--mini.is-round {
   padding: 6px 15px;
 }
  .body-container {
    /deep/ .el-col {
      padding: 5px 0px 0px 0px;
      .el-button {
        margin-left: 0px;
        padding: 0px 15px 0px 0px;
      }
    }
  }
 .alertNum {
   position: relative ;
   top: 3px;
   float: right;
   z-index: 50;
   .alertNumContent {
     float: right;
     padding-left: 20px;
     /*border-bottom: 2px solid #E5E6E8;*/
     /*height: 25px;*/
     .total {
       margin-left: 4px;
     }
   }
 }
</style>
