import type {
  WorkflowNode,
  NodeType,
  ApprovalMode,
  ApproverSource,
} from '../types';

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random()
    .toString(36)
    .substr(2, 5)}`;
}

/**
 * 创建默认发起人节点
 */
export function createStartNode(): WorkflowNode {
  return {
    id: generateId('start_'),
    type: 'start',
    name: '发起人',
  };
}

/**
 * 创建默认结束节点
 */
export function createEndNode(): WorkflowNode {
  return {
    id: generateId('end_'),
    type: 'end',
    name: '结束',
  };
}

/**
 * 创建审批人节点
 */
export function createApproverNode(): WorkflowNode {
  return {
    id: generateId('approver_'),
    type: 'approver',
    name: '审批人',
    approvers: {
      source: 'leader',
      values: [],
      level: 1,
    },
    mode: 'or',
  };
}

/**
 * 创建办理人节点
 */
export function createHandlerNode(): WorkflowNode {
  return {
    id: generateId('handler_'),
    type: 'handler',
    name: '办理人',
    handlers: {
      source: 'user',
      values: [],
    },
  };
}

/**
 * 创建抄送人节点
 */
export function createCcNode(): WorkflowNode {
  return {
    id: generateId('cc_'),
    type: 'cc',
    name: '抄送人',
    ccList: {
      source: 'user',
      values: [],
    },
  };
}

/**
 * 创建条件分支节点
 */
export function createConditionNode(): WorkflowNode {
  return {
    id: generateId('condition_'),
    type: 'condition',
    name: '条件分支',
    branches: [
      {
        id: generateId('branch_'),
        name: '条件1',
        conditions: [],
        nodes: [],
      },
      {
        id: generateId('branch_'),
        name: '其他条件',
        conditions: [],
        nodes: [],
      },
    ],
  };
}

/**
 * 创建并行分支节点
 */
export function createParallelNode(): WorkflowNode {
  return {
    id: generateId('parallel_'),
    type: 'parallel',
    name: '并行分支',
    branches: [
      {
        id: generateId('branch_'),
        name: '分支1',
        nodes: [],
      },
      {
        id: generateId('branch_'),
        name: '分支2',
        nodes: [],
      },
    ],
    mergeMode: 'all',
  };
}

/**
 * 创建延迟器节点
 */
export function createDelayNode(): WorkflowNode {
  return {
    id: generateId('delay_'),
    type: 'delay',
    name: '延迟器',
    delayType: 'fixed',
    value: 1,
    unit: 'hour',
  };
}

/**
 * 创建触发器节点
 */
export function createTriggerNode(): WorkflowNode {
  return {
    id: generateId('trigger_'),
    type: 'trigger',
    name: '触发器',
    triggerType: 'webhook',
    config: {},
  };
}

/**
 * 根据类型创建节点
 */
export function createNodeByType(type: NodeType): WorkflowNode | null {
  switch (type) {
    case 'start':
      return createStartNode();
    case 'end':
      return createEndNode();
    case 'approver':
      return createApproverNode();
    case 'handler':
      return createHandlerNode();
    case 'cc':
      return createCcNode();
    case 'condition':
      return createConditionNode();
    case 'parallel':
      return createParallelNode();
    case 'delay':
      return createDelayNode();
    case 'trigger':
      return createTriggerNode();
    default:
      return null;
  }
}

/**
 * 审批方式文本
 */
export function getApprovalModeText(mode: ApprovalMode): string {
  const map: Record<ApprovalMode, string> = {
    or: '或签（任意一人审批通过）',
    and: '会签（所有人审批通过）',
  };
  return map[mode] || '或签';
}

/**
 * 审批人来源文本
 */
export function getApproverSourceText(source: ApproverSource): string {
  const map: Record<ApproverSource, string> = {
    user: '指定用户',
    role: '指定角色',
    dept: '指定部门',
    leader: '上级主管',
    self: '发起人自己',
    form: '表单字段',
  };
  return map[source] || '指定用户';
}

/**
 * 获取节点简要描述
 */
export function getNodeBrief(node: WorkflowNode): string {
  switch (node.type) {
    case 'start':
      return '发起人';
    case 'approver':
      return getApproverSourceText(node.approvers.source);
    case 'handler':
      return getApproverSourceText(node.handlers.source);
    case 'cc':
      return getApproverSourceText(node.ccList.source);
    case 'condition':
      return `${node.branches.length}个分支`;
    case 'parallel':
      return `${node.branches.length}个分支`;
    case 'delay': {
      let unitText = '天';
      if (node.unit === 'minute') unitText = '分钟';
      else if (node.unit === 'hour') unitText = '小时';
      return `延迟${node.value}${unitText}`;
    }
    case 'trigger':
      return '触发外部服务';
    case 'end':
      return '流程结束';
    default:
      return '';
  }
}

/**
 * 获取节点错误信息
 */
export function getNodeErrors(node: WorkflowNode): string[] {
  const errors: string[] = [];

  switch (node.type) {
    case 'approver': {
      // 审批人必须配置
      if (
        !node.approvers?.values?.length &&
        node.approvers?.source !== 'leader' &&
        node.approvers?.source !== 'self'
      ) {
        errors.push('请配置审批人');
      }
      break;
    }

    case 'handler': {
      // 办理人必须配置
      if (
        !node.handlers?.values?.length &&
        node.handlers?.source !== 'leader' &&
        node.handlers?.source !== 'self'
      ) {
        errors.push('请配置办理人');
      }
      break;
    }

    case 'cc': {
      // 抄送人必须配置
      if (
        !node.ccList?.values?.length &&
        node.ccList?.source !== 'leader' &&
        node.ccList?.source !== 'self'
      ) {
        errors.push('请配置抄送人');
      }
      break;
    }

    case 'condition': {
      // 条件分支至少要有2个分支
      if (!node.branches || node.branches.length < 2) {
        errors.push('条件分支至少需要2个分支');
      }
      // 检查每个分支的条件配置
      node.branches?.forEach((branch, index) => {
        // 除了最后一个分支（默认分支），其他分支需要有条件
        if (
          index < node.branches.length - 1 &&
          (!branch.conditions || branch.conditions.length === 0)
        ) {
          errors.push(`分支"${branch.name}"未配置条件`);
        }
      });
      break;
    }

    case 'parallel': {
      // 并行分支至少要有2个分支
      if (!node.branches || node.branches.length < 2) {
        errors.push('并行分支至少需要2个分支');
      }
      break;
    }

    case 'delay': {
      // 延迟值必须大于0
      if (!node.value || (typeof node.value === 'number' && node.value <= 0)) {
        errors.push('请配置延迟时间');
      }
      break;
    }

    case 'trigger': {
      // 触发器需要配置
      if (!node.config || Object.keys(node.config).length === 0) {
        errors.push('请配置触发器');
      }
      break;
    }

    default:
      break;
  }

  return errors;
}

/**
 * 深度克隆节点
 */
export function cloneNode(node: WorkflowNode): WorkflowNode {
  return JSON.parse(JSON.stringify(node));
}

/**
 * 查找节点
 */
export function findNode(
  nodes: WorkflowNode[],
  id: string,
): WorkflowNode | null {
  const findInNodes = (nodeList: WorkflowNode[]): WorkflowNode | null => {
    return nodeList.reduce<WorkflowNode | null>((found, node) => {
      if (found) return found;
      if (node.id === id) return node;

      // 递归查找分支中的节点
      if ('branches' in node && node.branches) {
        return node.branches.reduce<WorkflowNode | null>(
          (branchFound, branch) => {
            if (branchFound) return branchFound;
            return findInNodes(branch.nodes);
          },
          null,
        );
      }
      return null;
    }, null);
  };

  return findInNodes(nodes);
}

/**
 * 删除节点
 */
export function removeNode(nodes: WorkflowNode[], id: string): WorkflowNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      // 递归删除分支中的节点
      if ('branches' in node && node.branches) {
        return {
          ...node,
          branches: node.branches.map((branch) => ({
            ...branch,
            nodes: removeNode(branch.nodes, id),
          })),
        };
      }
      return node;
    });
}

/**
 * 在指定位置插入节点
 */
export function insertNodeAt(
  nodes: WorkflowNode[],
  index: number,
  node: WorkflowNode,
): WorkflowNode[] {
  const newNodes = [...nodes];
  newNodes.splice(index, 0, node);
  return newNodes;
}

/**
 * 替换节点
 */
export function replaceNode(
  nodes: WorkflowNode[],
  id: string,
  newNode: WorkflowNode,
): WorkflowNode[] {
  return nodes.map((node) => {
    if (node.id === id) return newNode;

    // 递归替换分支中的节点
    if ('branches' in node && node.branches) {
      return {
        ...node,
        branches: node.branches.map((branch) => ({
          ...branch,
          nodes: replaceNode(branch.nodes, id, newNode),
        })),
      };
    }
    return node;
  });
}

/**
 * 获取流程统计信息
 */
export function getWorkflowStats(nodes: WorkflowNode[]) {
  let totalNodes = 0;
  let approverCount = 0;
  let ccCount = 0;
  let conditionCount = 0;
  let parallelCount = 0;

  const countNodes = (nodeList: WorkflowNode[]) => {
    nodeList.forEach((node) => {
      totalNodes += 1;
      switch (node.type) {
        case 'approver':
          approverCount += 1;
          break;
        case 'cc':
          ccCount += 1;
          break;
        case 'condition':
          conditionCount += 1;
          break;
        case 'parallel':
          parallelCount += 1;
          break;
        default:
          break;
      }

      // 递归统计分支中的节点
      if ('branches' in node && node.branches) {
        node.branches.forEach((branch) => {
          if (branch.nodes) {
            countNodes(branch.nodes);
          }
        });
      }
    });
  };

  countNodes(nodes);

  return {
    totalNodes,
    approverCount,
    ccCount,
    conditionCount,
    parallelCount,
  };
}

/**
 * 导出流程为JSON
 */
export function exportWorkflow(nodes: WorkflowNode[]): string {
  return JSON.stringify(nodes, null, 2);
}

/**
 * 从JSON导入流程
 */
export function importWorkflow(json: string): WorkflowNode[] | null {
  try {
    const nodes = JSON.parse(json);
    if (Array.isArray(nodes)) {
      return nodes;
    }
    return null;
  } catch {
    return null;
  }
}
