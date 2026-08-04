import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';
import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,

  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,

  'menu.list.searchTable': '查询表格',
  'searchTable.form.number': '集合编号',
  'searchTable.form.number.placeholder': '请输入集合编号',
  'searchTable.form.name': '集合名称',
  'searchTable.form.name.placeholder': '请输入集合名称',
  'searchTable.form.contentType': '内容体裁',
  'searchTable.form.contentType.img': '图文',
  'searchTable.form.contentType.horizontalVideo': '横版短视频',
  'searchTable.form.contentType.verticalVideo': '竖版小视频',
  'searchTable.form.filterType': '筛选方式',
  'searchTable.form.filterType.artificial': '人工筛选',
  'searchTable.form.filterType.rules': '规则筛选',
  'searchTable.form.createdTime': '创建时间',
  'searchTable.form.status': '状态',
  'searchTable.form.status.online': '已上线',
  'searchTable.form.status.offline': '已下线',
  'searchTable.form.search': '查询',
  'searchTable.form.reset': '重置',
  'searchTable.form.selectDefault': '全部',
  'searchTable.operation.create': '新建',
  'searchTable.operation.import': '批量导入',
  'searchTable.operation.download': '下载',
  'searchTable.operation.export': '导出',
  // columns
  'searchTable.columns.index': '#',
  'searchTable.columns.number': '集合编号',
  'searchTable.columns.name': '集合名称',
  'searchTable.columns.contentType': '内容体裁',
  'searchTable.columns.filterType': '筛选方式',
  'searchTable.columns.count': '内容量',
  'searchTable.columns.createdTime': '创建时间',
  'searchTable.columns.status': '状态',
  'searchTable.columns.operations': '操作',
  'searchTable.columns.operations.view': '查看',

  // size
  'searchTable.size.mini': '迷你',
  'searchTable.size.small': '偏小',
  'searchTable.size.medium': '中等',
  'searchTable.size.large': '偏大',
  // actions
  'searchTable.actions.refresh': '刷新',
  'searchTable.actions.density': '密度',
  'searchTable.actions.columnSetting': '列设置',
};
