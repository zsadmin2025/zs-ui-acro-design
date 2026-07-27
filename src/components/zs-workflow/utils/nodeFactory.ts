/**
 * 节点工厂 - 用于创建各种类型的工作流节点
 */
import { NodeType, SetType } from '../types';
import type {
  NodeConfig,
  ApproverNode,
  CCNode,
  RouterNode,
  ConditionNode,
  InitiatorNode,
} from '../types';

/**
 * 深拷贝工具（替代 JSON.parse(JSON.stringify())）
 * 优先使用原生 structuredClone，降级使用 JSON 方案
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  // 优先使用 JSON 方案，避免 structuredClone 遇到非可克隆属性时报错
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    // JSON 方案失败时尝试 structuredClone
    if (typeof structuredClone === 'function') {
      return structuredClone(obj);
    }
    return obj;
  }
}

/**
 * 创建审批人节点
 */
export function createApproverNode(
  childNode?: NodeConfig | null,
): ApproverNode {
  return {
    nodeName: '审批人',
    error: true,
    type: NodeType.APPROVER,
    settype: SetType.SPECIFIED_MEMBER,
    examineMode: 1,
    signPct: 100,
    noHanderAction: 1,
    childNode: childNode ?? null,
    nodeUserList: [],
  };
}

/**
 * 创建抄送人节点
 */
export function createCCNode(childNode?: NodeConfig | null): CCNode {
  return {
    nodeName: '抄送人',
    error: true,
    type: NodeType.CC,
    settype: SetType.SPECIFIED_MEMBER,
    ccSelfSelectFlag: 1,
    childNode: childNode ?? null,
    nodeUserList: [],
  };
}

/**
 * 创建条件节点
 */
export function createConditionNode(
  priorityLevel: number,
  childNode?: NodeConfig | null,
): ConditionNode {
  return {
    nodeName: `条件${priorityLevel}`,
    error: true,
    type: NodeType.CONDITION,
    priorityLevel,
    conditionList: [],
    conditionRules: [],
    nodeUserList: [],
    childNode: childNode ?? null,
  };
}

/**
 * 创建"其他情况"节点（else分支，不可设置条件）
 */
export function createOtherCaseNode(
  priorityLevel: number,
  childNode?: NodeConfig | null,
): ConditionNode {
  return {
    nodeName: '其他情况',
    error: false,
    type: NodeType.CONDITION,
    priorityLevel,
    conditionList: [],
    conditionRules: [],
    nodeUserList: [],
    childNode: childNode ?? null,
    isOther: true,
  };
}

/**
 * 创建路由节点（包含一个默认条件分支和一个"其他情况"分支）
 */
export function createRouterNode(childNode?: NodeConfig | null): RouterNode {
  return {
    nodeName: '路由',
    type: NodeType.ROUTER,
    childNode: null,
    conditionNodes: [
      createConditionNode(1, childNode),
      createOtherCaseNode(2, null),
    ],
  };
}

/**
 * 创建发起人节点
 */
export function createInitiatorNode(): InitiatorNode {
  return {
    nodeName: '发起人',
    type: NodeType.INITIATOR,
    childNode: null,
    conditionList: [],
    nodeUserList: [],
  };
}

/**
 * 根据类型创建节点
 */
export function createNodeByType(
  type: number,
  childNode?: NodeConfig | null,
): NodeConfig | null {
  switch (type) {
    case NodeType.APPROVER:
      return createApproverNode(childNode);
    case NodeType.CC:
      return createCCNode(childNode);
    case NodeType.ROUTER:
      return createRouterNode(childNode);
    default:
      return null;
  }
}

/**
 * 附加节点到链表末尾
 */
export function appendToLastChild(
  node: NodeConfig,
  appendNode: NodeConfig | null,
): void {
  let current: NodeConfig | null | undefined = node;
  while (current && current.childNode) {
    current = current.childNode;
  }
  if (current) {
    current.childNode = appendNode;
  }
}
