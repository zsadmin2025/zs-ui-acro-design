/**
 * 钉钉风格工作流设计器 - 类型定义
 */

export type NodeType =
  | 'start'
  | 'approver'
  | 'handler'
  | 'cc'
  | 'condition'
  | 'parallel'
  | 'inclusive'
  | 'subprocess'
  | 'delay'
  | 'trigger'
  | 'end';

export type ApprovalMode = 'or' | 'and';

export type ApproverSource =
  | 'user'
  | 'role'
  | 'dept'
  | 'leader'
  | 'self'
  | 'form';

export interface ApproverConfig {
  source: ApproverSource;
  values: string[];
  level?: number;
}

export interface ConditionConfig {
  field: string;
  operator: string;
  value: any;
}

export interface BaseNodeProps {
  id: string;
  type: NodeType;
  name: string;
}

export interface StartNode extends BaseNodeProps {
  type: 'start';
  initiator?: ApproverConfig;
}

export interface ApproverNode extends BaseNodeProps {
  type: 'approver';
  approvers: ApproverConfig;
  mode: ApprovalMode;
  timeout?: number;
  autoPass?: boolean;
  formFields?: string[];
}

export interface HandlerNode extends BaseNodeProps {
  type: 'handler';
  handlers: ApproverConfig;
  timeout?: number;
}

export interface CcNode extends BaseNodeProps {
  type: 'cc';
  ccList: ApproverConfig;
}

export interface DelayNode extends BaseNodeProps {
  type: 'delay';
  delayType: 'fixed' | 'field';
  value: number | string;
  unit: 'minute' | 'hour' | 'day';
}

export interface TriggerNode extends BaseNodeProps {
  type: 'trigger';
  triggerType: 'webhook' | 'script' | 'service';
  config: Record<string, any>;
}

export interface EndNode extends BaseNodeProps {
  type: 'end';
  endType?: 'pass' | 'reject' | 'terminate';
}

/* eslint-disable no-use-before-define */
export interface ConditionBranch {
  id: string;
  name: string;
  conditions: ConditionConfig[];
  nodes: WorkflowNode[];
}

export interface ParallelBranch {
  id: string;
  name: string;
  nodes: WorkflowNode[];
}
/* eslint-enable no-use-before-define */

export interface ConditionNode extends BaseNodeProps {
  type: 'condition';
  branches: ConditionBranch[];
  defaultBranchId?: string;
}

export interface ParallelNode extends BaseNodeProps {
  type: 'parallel';
  branches: ParallelBranch[];
  mergeMode: 'all' | 'any';
}

export interface InclusiveNode extends BaseNodeProps {
  type: 'inclusive';
  branches: ConditionBranch[];
  mergeMode: 'all' | 'any';
}

export interface SubprocessNode extends BaseNodeProps {
  type: 'subprocess';
  processId: string;
  processName: string;
}

export type WorkflowNode =
  | StartNode
  | ApproverNode
  | HandlerNode
  | CcNode
  | ConditionNode
  | ParallelNode
  | InclusiveNode
  | SubprocessNode
  | DelayNode
  | TriggerNode
  | EndNode;

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: number;
  nodes: WorkflowNode[];
  formId?: string;
  createTime?: string;
  updateTime?: string;
}

export interface NodeTypeConfig {
  type: NodeType;
  name: string;
  icon: string;
  color: string;
  description: string;
  allowAdd: boolean;
  allowDelete: boolean;
  maxCount?: number;
}

export interface DesignerState {
  selectedNodeId: string | null;
  zoom: number;
  readonly: boolean;
}

export interface AddNodeMenuItem {
  type: NodeType;
  name: string;
  icon: string;
  disabled?: boolean;
}
