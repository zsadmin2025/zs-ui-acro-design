import type { Pagination } from '@/types/global';

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
  type: 'DYNAMIC' | 'BUSINESS';
  formSchema?: FormSchema;
  businessFormPath?: string;
}

export interface ProcessFormConfig {
  startForm?: FormInfo;
  taskForms?: Record<string, FormInfo>;
}

// ==================== 流程定义 ====================
export interface ProcessDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: number;
  category?: string;
  formConfig?: ProcessFormConfig;
  status?: number;
  createTime?: string;
}

export interface FieldPermission {
  fieldName: string;
  permission: 'EDITABLE' | 'READONLY' | 'HIDDEN';
}

// ==================== 我的流程 ====================
export interface MyProcessItem {
  processInstanceId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  businessKey?: string;
  startUserId?: string;
  startUserName?: string;
  startTime?: string;
  endTime?: string;
  status?: string; // RUNNING, COMPLETED, TERMINATED
  ccUserIds?: string[];
}

// ==================== 任务相关 ====================
export interface TaskItem {
  taskId: string;
  taskName?: string;
  processInstanceId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  businessKey?: string;
  assignee?: string;
  assigneeName?: string;
  owner?: string;
  ownerName?: string;
  createTime?: string;
  claimTime?: string;
  dueDate?: string;
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
  title?: string;
  senderName?: string;
  readStatus?: number; // 0-未读 1-已读
  createTime?: string;
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
  assignee?: string; // 转办/委派/加签的目标用户
  ccUserIds?: string[]; // 抄送用户
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
  processDefinitionName: string;
  assigneeName?: string;
  ownerName?: string;
  createTime?: string;
  endTime?: string;
  status?: string;
}

// ==================== 分页查询参数 ====================
export interface BpmPageParams extends Pagination {
  [key: string]: any;
}
