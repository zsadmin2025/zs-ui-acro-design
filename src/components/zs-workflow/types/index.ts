/**
 * 工作流设计器类型定义
 */

// 节点类型枚举
export enum NodeType {
  /** 发起人 */
  INITIATOR = 0,
  /** 审批人 */
  APPROVER = 1,
  /** 抄送人 */
  CC = 2,
  /** 条件分支 */
  CONDITION = 3,
  /** 路由 */
  ROUTER = 4,
}

// 审批人设置类型
export enum SetType {
  /** 指定成员 */
  SPECIFIED_MEMBER = 1,
  /** 指定角色 */
  SPECIFIED_ROLE = 2,
  /** 指定岗位 */
  SPECIFIED_POST = 3,
  /** 部门负责人 */
  DEPT_MANAGER = 4,
  /** 发起人自选 */
  INITIATOR_SELECT = 5,
  /** 发起人自己 */
  INITIATOR_SELF = 6,
  /** 直属上级 */
  DIRECT_SUPERIOR = 7,
  /** 表单内人员 */
  FORM_PERSON = 8,
  /** 流程表达式 */
  EXPRESSION = 9,
}

// 条件规则
export interface ConditionRule {
  columnId: string | number;
  type: number;
  showType?: string;
  showName?: string;
  optType?: string;
  zdy1?: string;
  zdy2?: string;
  opt1?: string;
  opt2?: string;
  columnDbname?: string;
  columnType?: string;
  fixedDownBoxValue?: string;
  conditionEn?: string;
  conditionCn?: string;
}

// 用户对象
export interface NodeUser {
  id: number;
  name: string;
}

// 节点配置基础接口
export interface BaseNodeConfig {
  nodeName: string;
  type: NodeType;
  error?: boolean;
  // eslint-disable-next-line no-use-before-define
  childNode?: NodeConfig | null;
}

// 发起人节点
export interface InitiatorNode extends BaseNodeConfig {
  type: NodeType.INITIATOR;
  priorityLevel?: string;
  settype?: string;
  directorLevel?: string;
  examineMode?: string;
  noHanderAction?: string;
  examineEndDirectorLevel?: string;
  ccSelfSelectFlag?: string;
  conditionList?: ConditionRule[];
  nodeUserList?: NodeUser[];
}

// 审批人节点
export interface ApproverNode extends BaseNodeConfig {
  type: NodeType.APPROVER;
  settype: SetType | number;
  examineMode: number;
  signPct?: number;
  noHanderAction: number;
  nodeUserList?: NodeUser[];
  nodeRoleList?: NodeUser[];
  nodePostList?: NodeUser[];
  nodeDeptHeadList?: NodeUser[];
  conditionExpression?: string;
  conditionList?: ConditionRule[];
}

// 抄送人节点
export interface CCNode extends BaseNodeConfig {
  type: NodeType.CC;
  ccSelfSelectFlag: number;
  nodeUserList?: NodeUser[];
  nodeRoleList?: NodeUser[];
  nodePostList?: NodeUser[];
  nodeDeptHeadList?: NodeUser[];
  settype?: SetType | number;
}

// 条件节点
export interface ConditionNode extends BaseNodeConfig {
  type: NodeType.CONDITION;
  priorityLevel: number;
  conditionList?: ConditionRule[];
  conditionRules?: ConditionRule[];
  conditionExpression?: string;
  expression?: string;
  nodeUserList?: NodeUser[];
  groupRelation?: boolean;
  settype?: number;
  examineMode?: number;
  noHanderAction?: number;
  isOther?: boolean;
}

// 路由节点
export interface RouterNode extends BaseNodeConfig {
  type: NodeType.ROUTER;
  conditionNodes: ConditionNode[];
  priorityLevel?: number;
  settype?: number;
  examineMode?: number;
  noHanderAction?: number;
}

// 节点配置联合类型（在所有具体类型定义之后）
export type NodeConfig =
  | InitiatorNode
  | ApproverNode
  | CCNode
  | ConditionNode
  | RouterNode;

// 流程配置
export interface ProcessConfig {
  tableId?: number;
  workFlowDef?: {
    name?: string;
    [key: string]: any;
  };
  directExecutorTypes?: any[];
  nodeConfig?: NodeConfig;
  flowPermission?: NodeUser[];
  directorMaxLevel?: number;
}

// 表单字段
export interface FormField {
  field: string;
  title: string;
}

// 抽屉状态
export interface DrawerState<T = any> {
  flag: boolean;
  id: number | null;
  value: T | null;
}
