import type { NodeTypeConfig, AddNodeMenuItem } from '../types';

/**
 * 节点类型配置
 */
export const nodeTypeConfigs: NodeTypeConfig[] = [
  {
    type: 'start',
    name: '发起人',
    icon: 'icon-user',
    color: '#3370FF',
    description: '流程发起人',
    allowAdd: false,
    allowDelete: false,
    maxCount: 1,
  },
  {
    type: 'approver',
    name: '审批人',
    icon: 'icon-check-circle',
    color: '#FF9F00',
    description: '审批节点，支持或签、会签',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'handler',
    name: '办理人',
    icon: 'icon-edit',
    color: '#00B96B',
    description: '办理节点，执行任务',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'cc',
    name: '抄送人',
    icon: 'icon-send',
    color: '#8F959E',
    description: '抄送通知，无需审批',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'condition',
    name: '条件分支',
    icon: 'icon-branch',
    color: '#FF6A00',
    description: '根据条件进入不同分支',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'parallel',
    name: '并行分支',
    icon: 'icon-layers',
    color: '#00B96B',
    description: '多个分支同时执行',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'inclusive',
    name: '包容分支',
    icon: 'icon-mind-mapping',
    color: '#00B96B',
    description: '满足条件的分支都执行',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'subprocess',
    name: '子流程',
    icon: 'icon-subscribe',
    color: '#3370FF',
    description: '嵌套子流程',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'delay',
    name: '延迟器',
    icon: 'icon-clock-circle',
    color: '#8F959E',
    description: '延迟一段时间后继续',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'trigger',
    name: '触发器',
    icon: 'icon-thunderbolt',
    color: '#8F959E',
    description: '触发外部服务',
    allowAdd: true,
    allowDelete: true,
  },
  {
    type: 'end',
    name: '结束',
    icon: 'icon-stop',
    color: '#F54A45',
    description: '流程结束',
    allowAdd: false,
    allowDelete: false,
    maxCount: 1,
  },
];

/**
 * 添加节点菜单配置
 */
export const addNodeMenuItems: AddNodeMenuItem[] = [
  { type: 'approver', name: '审批人', icon: 'icon-check-circle' },
  { type: 'handler', name: '办理人', icon: 'icon-edit' },
  { type: 'cc', name: '抄送人', icon: 'icon-send' },
  { type: 'condition', name: '条件分支', icon: 'icon-branch' },
  { type: 'parallel', name: '并行分支', icon: 'icon-layers' },
  { type: 'delay', name: '延迟器', icon: 'icon-clock-circle' },
  { type: 'trigger', name: '触发器', icon: 'icon-thunderbolt' },
];

/**
 * 获取节点类型配置
 */
export function getNodeTypeConfig(type: string): NodeTypeConfig | undefined {
  return nodeTypeConfigs.find((config) => config.type === type);
}

/**
 * 获取节点图标
 */
export function getNodeIcon(type: string): string {
  const config = getNodeTypeConfig(type);
  return config?.icon || 'icon-question-circle';
}

/**
 * 获取节点颜色
 */
export function getNodeColor(type: string): string {
  const config = getNodeTypeConfig(type);
  return config?.color || '#3370FF';
}

/**
 * 获取节点名称
 */
export function getNodeName(type: string): string {
  const config = getNodeTypeConfig(type);
  return config?.name || type;
}
