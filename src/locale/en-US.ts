import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeSuccess from '@/views/result/success/locale/en-US';
import localeError from '@/views/result/error/locale/en-US';

import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeUserInfo from '@/views/user/info/locale/en-US';
import localeUserSetting from '@/views/user/setting/locale/en-US';
import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
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
  'menu.list.searchTable': 'Search Table',
  'searchTable.form.number': 'Set Number',
  'searchTable.form.number.placeholder': 'Please enter Set Number',
  'searchTable.form.name': 'Set Name',
  'searchTable.form.name.placeholder': 'Please enter Set Name',
  'searchTable.form.contentType': 'Content Type',
  'searchTable.form.contentType.img': 'image-text',
  'searchTable.form.contentType.horizontalVideo': 'Horizontal short video',
  'searchTable.form.contentType.verticalVideo': 'Vertical short video',
  'searchTable.form.filterType': 'Filter Type',
  'searchTable.form.filterType.artificial': 'artificial',
  'searchTable.form.filterType.rules': 'Rules',
  'searchTable.form.createdTime': 'Create Date',
  'searchTable.form.status': 'Status',
  'searchTable.form.status.online': 'Online',
  'searchTable.form.status.offline': 'Offline',
  'searchTable.form.search': 'Search',
  'searchTable.form.reset': 'Reset',
  'searchTable.form.selectDefault': 'All',
  'searchTable.operation.create': 'Create',
  'searchTable.operation.import': 'Import',
  'searchTable.operation.download': 'Download',
  'searchTable.operation.export': 'Export',

  // columns
  'searchTable.columns.index': '#',
  'searchTable.columns.number': 'Set Number',
  'searchTable.columns.name': 'Set Name',
  'searchTable.columns.contentType': 'Content Type',
  'searchTable.columns.filterType': 'Filter Type',
  'searchTable.columns.count': 'Count',
  'searchTable.columns.createdTime': 'CreatedTime',
  'searchTable.columns.status': 'Status',
  'searchTable.columns.operations': 'Operations',
  'searchTable.columns.operations.view': 'View',
  // size
  'searchTable.size.mini': 'mini',
  'searchTable.size.small': 'small',
  'searchTable.size.medium': 'middle',
  'searchTable.size.large': 'large',
  // actions
  'searchTable.actions.refresh': 'refresh',
  'searchTable.actions.density': 'density',
  'searchTable.actions.columnSetting': 'columnSetting',
};
