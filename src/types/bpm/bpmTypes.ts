import type { Pagination } from '@/types/common/global';

export interface ValidateRule {
  required?: boolean;
  message?: string;
  pattern?: string;
  min?: number;
  max?: number;
  validator?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: string; // INPUT_TEXT, SELECT_SINGLE, DATE_PICKER, etc.
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  options?: { label: string; value: any }[];
  validateRules?: ValidateRule[];
  props?: Record<string, any>;
  groupKey?: string;
}

export interface FormConfig {
  labelWidth?: number;
  layout?: 'horizontal' | 'vertical' | 'inline';
  disabled?: boolean;
}

export interface FormFieldGroup {
  key: string;
  title: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormSchema {
  fields: FormField[];
  fieldGroups?: FormFieldGroup[];
  formConfig?: FormConfig;
}

export interface FormInfo {
  type: number; // 1=动态表单, 2=业务表单
  formSchema?: FormSchema;
  formRule?: any[];
  formOption?: any;
  businessFormRoute?: string;
  businessFormPath?: string;
}

export interface ProcessFormConfig {
  startForm?: FormInfo;
  taskForms?: Record<string, FormInfo>;
}

// ==================== 流程定义 ====================
export interface ProcessDefinition {
  id: string;
  processDefinitionId?: string;
  deploymentId?: string;
  modelId?: string;
  processKey: string;
  processName: string;
  categoryId?: string;
  categoryName?: string;
  icon?: string;
  description?: string;
  version: number;
  formType?: number;
  formId?: string;
  businessFormRoute?: string;
  businessFormPath?: string;
  formRule?: string;
  formOption?: string;
  modelJson?: string;
  bpmnXml?: string;
  status?: number;
  publishTime?: string;
  deployTime?: string;
  activateTime?: string;
  creator?: string;
  createTime?: string;
}

export interface FieldPermission {
  fieldName: string;
  permission: 'EDITABLE' | 'READONLY' | 'HIDDEN';
}

export interface CurrentTaskItem {
  id: string;
  name: string;
  description?: string | null;
  taskDefinitionKey: string;
  assignee?: string;
  assigneeName?: string;
  owner?: string | null;
  createTime: string;
  dueDate?: string | null;
  priority?: number;
  category?: string | null;
  formKey?: string | null;
  parentTaskId?: string | null;
  processInstanceId: string;
  tenantId?: string;
  claimedBy?: string | null;
  claimTime?: string | null;
  state?: string;
  suspensionState?: number;
  isCanceled?: boolean;
}

// ==================== 我的流程 ====================
export interface StartUserInfo {
  startUserId: string;
  startUserName: string;
  avatar?: string | null;
  deptId?: string | null;
  deptName?: string | null;
  companyId?: string | null;
  companyName?: string | null;
}

export interface TodoTaskItem {
  processInstanceId?: string;
  processDefinitionId?: string;
  processDefinitionKey?: string;
  processDefinitionName?: string;
  processInstanceName?: string | null;
  businessKey?: string | null;
  taskId?: string | null;
  nodeKey?: string;
  nodeName?: string;
  description?: string | null;
  originalAssigneeUser?: any | null;
  assigneeUser?: any | null;
  startTime?: string;
  endTime?: string | null;
  durationInMillis?: number | null;
  status?: string;
  permissionConfig?: any | null;
  approvers?: any | null;
}

export interface MyProcessItem {
  processInstanceId: string;
  processDefinitionId?: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  processInstanceName?: string;
  businessKey?: string;
  startUserId?: string;
  startUserName?: string;
  startDeptId?: string;
  startDeptName?: string;
  startTime?: string;
  endTime?: string | null;
  durationInMillis?: number | null;
  status?: string; // RUNNING, COMPLETED, TERMINATED
  currentTasks?: CurrentTaskItem[];
  ccUserIds?: string[];
}

// ==================== 任务相关 ====================
export interface TaskItem {
  processInstanceId: string;
  processDefinitionId?: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  processInstanceName?: string;
  businessKey?: string;
  startUser?: StartUserInfo;
  startTime?: string;
  endTime?: string | null;
  durationInMillis?: number | null;
  processState?: string;
  todoTask?: TodoTaskItem;
  // 以下为兼容旧字段
  taskId?: string;
  taskName?: string;
  createTime?: string;
  claimTime?: string;
  dueDate?: string;
  assignee?: string;
  assigneeName?: string;
  owner?: string;
  ownerName?: string;
  priority?: number;
  category?: string;
  formKey?: string;
  parentTaskId?: string;
  description?: string;
}

export interface TaskDetail extends TaskItem {
  formType?: 'DYNAMIC' | 'BUSINESS';
  formSchema?: FormSchema;
  businessFormPath?: string;
  formData?: Record<string, any>;
  fieldPermissions?: FieldPermission[];
  processInstance?: ProcessInstanceInfo;
  ccUserIds?: string[];
}

export interface CcTaskItem {
  id: string;
  taskId?: string;
  processInstanceId: string;
  processDefinitionName: string;
  processDefinitionKey?: string;
  processInstanceName?: string;
  title?: string;
  businessKey?: string;
  userId?: string;
  isRead?: number; // 0-未读 1-已读
  readTime?: string;
  startUserId?: string;
  startUserName?: string;
  startTime?: string;
  endTime?: string;
  createTime?: string;
  processState?: string;
}

// ==================== 审批操作 ====================
export interface ApprovalAction {
  type:
    | 'PASS'
    | 'REJECT'
    | 'TRANSFER'
    | 'DELEGATE'
    | 'ADD_SIGN'
    | 'REDUCE_SIGN'
    | 'CC';
  comment?: string;
  assignee?: string;
  ccUserIds?: string[];
}

export type BpmTaskActionEnum =
  | 'COMPLETE'
  | 'REJECT'
  | 'RETURN'
  | 'TRANSFER'
  | 'DELEGATE'
  | 'RESOLVE'
  | 'CLAIM'
  | 'UNCLAIM'
  | 'REVOKE'
  | 'CANCEL';

export type RejectTargetEnum = 'INITIATOR' | 'PREV' | 'ANY';

export type SignPositionEnum = 'BEFORE' | 'AFTER';

export interface TaskApprovalParams {
  [key: string]: any;
}

export interface TaskCompleteParams {
  processInstanceId: string;
  taskId: string;
  action: BpmTaskActionEnum;
  comment?: string;
  formData?: Record<string, any>;
  variables?: TaskApprovalParams;
  rejectTarget?: RejectTargetEnum;
  rejectTargetActivityId?: string;
  targetUserId?: number;
  signUserIds?: number[];
  signPosition?: SignPositionEnum;
  ccUserIds?: number[];
}

export interface ApprovalTraceApprover {
  taskId?: string;
  assigneeName?: string;
  result?: string;
  comment?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export interface ApprovalTraceItem {
  id: string;
  taskId?: string;
  taskName: string;
  assigneeName?: string;
  result?: string; // PASS, REJECT, TRANSFER, etc.
  comment?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  children?: ApprovalTraceItem[];
  approvers?: ApprovalTraceApprover[];
}

export interface ProcessInstanceInfo {
  processInstanceId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  startUserId?: string;
  startUserName?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  businessKey?: string;
}

// ==================== 我的流程详情 ====================
export interface MyProcessDetail {
  processInstance: ProcessInstanceInfo;
  modelJson?: string;
  bpmnXml?: string;
  approvalTraces: ApprovalTraceItem[];
  rejectionRecords?: ApprovalTraceItem[];
  modifyResubmitRecords?: ApprovalTraceItem[];
}

// ==================== 流程模型 ====================
export interface ProcessModelItem {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: number;
  category?: string;
  xmlContent?: string;
  status?: number; // 0-草稿 1-已部署
  createTime?: string;
  updateTime?: string;
}

// ==================== 流程表单 ====================
export interface ProcessFormItem {
  id: string;
  formKey: string;
  formName: string;
  description?: string;
  formSchema?: FormSchema;
  version: number;
  status?: number; // 0-草稿 1-已发布
  createTime?: string;
  updateTime?: string;
}

// ==================== 流程分类 ====================
export interface ProcessCategoryItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  sort?: number;
  status?: number;
  createTime?: string;
}

// ==================== 用户分组 ====================
export interface UserGroupItem {
  id: string;
  groupName: string;
  groupCode?: string;
  description?: string;
  userIds?: string[];
  userNames?: string[];
  status?: number;
  createTime?: string;
}

// ==================== 流程监听器 ====================
export interface ProcessListenerItem {
  id: string;
  name: string;
  eventType?: string; // TASK_CREATE, TASK_COMPLETE, PROCESS_START, PROCESS_END
  handlerType?: string; // JAVA_CLASS, EXPRESSION, DELEGATE_EXPRESSION
  handlerValue?: string;
  description?: string;
  status?: number;
  createTime?: string;
}

// ==================== 流程表达式 ====================
export interface ProcessExpressionItem {
  id: string;
  name: string;
  expression?: string;
  description?: string;
  status?: number;
  createTime?: string;
}

// ==================== 流程实例管理 ====================
export interface ProcessInstanceItem {
  processInstanceId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  businessKey?: string;
  startUserId?: string;
  startUserName?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

// ==================== 流程任务管理 ====================
export interface ProcessTaskAdminItem {
  taskId: string;
  taskName?: string;
  processInstanceId: string;
  processInstanceName?: string;
  processDefinitionName: string;
  startUserName?: string;
  assigneeName?: string;
  taskStartTime?: string;
  taskEndTime?: string;
  approvalStatus?: string;
  comment?: string;
  durationInMillis?: string;
}

// ==================== 分页查询参数 ====================
export interface BpmPageParams extends Pagination {
  [key: string]: any;
}
