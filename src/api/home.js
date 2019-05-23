import fetch from 'common/js/request'
// import { createUuid } from 'common/js/utils'
// import { setUserUuid,getUserUuid } from 'common/js/auth'
// import Router from 'vue-router'
// import Vue from 'vue'
// import qs from 'qs'
// Vue.use(Router)
export function login(params) {
  return fetch('/call/account/login', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 退出登录
export function logout(params) {
  return fetch('/call/account/logout', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 修改密码
export function changePassword(params) {
  return fetch('/call/account/password/modify', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户基础信息
export function getAccountBaseInfo(params) {
  return fetch('/call/account/baseinfo', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托活动列表
export function getAccountDelegateList(params) {
  return fetch('/call/account/delegate/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托提成详情
export function getAccountDelegateRoyaltyDetails(params) {
  return fetch('/call/account/delegate/royalty/details', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户拨打详情列表
export function getAccountDelegateCallDetailsList(params) {
  return fetch('/call/account/delegate/calldetails/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托已预约名单列表
export function getAccountDelegateFinishCustomerList(params) {
  return fetch('/call/account/delegate/customer/finish/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	删除用户分配到的委托已预约名单
export function deleteAccountDelegateFinishCustomer(params) {
  return fetch('/call/account/delegate/customer/finish/delete', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托活动详情
export function getAccountDelegateDetails(params) {
  return fetch('/call/account/delegate/details', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托活动话术列表
export function getAccountDelegateTalkingskillList(params) {
  return fetch('/call/account/delegate/talkingskill/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	修改用户分配到的委托预约名单备注
export function modifyAccountDelegateHangCustomerRemark(params) {
  return fetch('/call/account/delegate/customer/hang/remark/modify', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托未预约名单列表
export function getAccountDelegateHangCustomerList(params) {
  return fetch('/call/account/delegate/customer/hang/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托名单拨打记录
export function getAccountDelegateCallRecordList(params) {
  return fetch('/call/account/delegate/customer/callrecord/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户分配到的委托名单拨打记录跟踪信息
export function getAccountDelegateCallRecordTrack(params) {
  return fetch('/call/account/delegate/customer/callrecord/track', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	导出用户分配到的委托预约名单
export function exportAccountDelegateHangCustomer(params) {
  return fetch('/call/account/delegate/customer/hang/export', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户电销指定时间段内拨打情况统计
export function getStatisticCallTime(params) {
  return fetch('/call/account/statistic/call/time', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}
// 	获取用户电销统计
export function getAccountStatistic(params) {
  return fetch('/call/account/statistic', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 	获取用户电销拨打（邀约）人数统计
export function getAccountCallStatistic(params) {
  return fetch('/call/account/statistic/call', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 上传用户分配到的委托预约名单拨打记录跟踪信息
export function addTrack(params) {
  return fetch('/call/account/delegate/customer/callrecord/track/add', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户分配到的委托跟进名单列表
export function getAccountDelegateTraceCustomerList(params) {
  return fetch('/call/account/delegate/customer/trace/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 删除用户分配到的委托跟进名单列表
export function deleteAccountDelegateTraceCustomer(params) {
  return fetch('/call/account/delegate/customer/trace/delete', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 跟进用户分配到的委托名单
export function traceAccountDelegateCustomer(params) {
  return fetch('/call/account/delegate/customer/trace', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取委托导出名单回退记录列表
export function getAccountDelegateExportBackList(params) {
  return fetch('/call/account/delegate/customer/exportback/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 修改用户分配到的委托已预约名单推送状态
export function modifyAccountDelegateFinishCustomerPushStatus(params) {
  return fetch('/call/account/delegate/customer/finish/delete/pushstatus/modify', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取公共池数据列表
export function getAccountDelegateCommonList(params) {
  return fetch('/call/account/delegate/common/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 跟进公共池数据
export function traceAccountDelegateCommon(params) {
  return fetch('/call/account/delegate/common/trace', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 查询关联门店委托列表
export function getAccountDelegateRelList(params) {
  return fetch('/call/account/delegate/rel/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取跟踪记录原始数据
export function getAccountDelegateTraceInitList(params) {
  return fetch('/call/account/delegate/trace/init/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取跟踪记录电话摘要配置
export function getAccountDelegateTraceAbstractList(params) {
  return fetch('/call/account/delegate/trace/abstract/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}

// 获取跟踪记录所有标签列表
export function getAccountDelegateTraceAlltagList(params) {
  return fetch('/call/account/delegate/trace/alltag/list', 'post', params).then(res => {
    return Promise.resolve(res)
  })
}