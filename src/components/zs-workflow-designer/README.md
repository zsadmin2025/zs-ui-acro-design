# 钉钉风格工作流设计器 (zs-workflow-designer)

仿钉钉审批流程设计器组件，支持拖拽设计、条件分支、并行分支等高级功能。

## 功能特性

- **可视化设计**：拖拽式流程设计，仿钉钉风格界面
- **丰富节点类型**：发起人、审批人、办理人、抄送人、条件分支、并行分支、延迟器、触发器、结束
- **分支支持**：支持条件分支（if/else）和并行分支（并行处理）
- **属性配置**：右侧属性面板，支持详细的节点配置
- **撤销重做**：支持操作历史，可撤销和重做
- **数据校验**：自动校验流程配置，提示错误信息
- **导入导出**：支持流程数据的导入和导出

## 安装使用

```vue
<template>
  <WorkflowDesigner
    v-model="workflowData"
    workflow-name="请假审批流程"
    @change="handleChange"
    @save="handleSave"
  />
</template>

<script setup>
import { ref } from 'vue';
import WorkflowDesigner from '@/components/zs-workflow-designer/index.vue';

const workflowData = ref({
  id: 'wf_001',
  name: '请假审批流程',
  version: 1,
  nodes: []
});

function handleChange(nodes) {
  console.log('流程变化:', nodes);
}

function handleSave(data) {
  console.log('保存流程:', data);
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 流程数据 | WorkflowDefinition | - |
| workflowName | 流程名称 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 流程数据更新 | WorkflowDefinition |
| change | 节点变化 | WorkflowNode[] |
| save | 保存流程 | WorkflowDefinition |

### Methods

| 方法名 | 说明 | 返回值 |
|--------|------|--------|
| getWorkflowData | 获取流程数据 | WorkflowNode[] |
| validate | 校验流程 | { valid: boolean, errors: string[] } |

## 节点类型

### 基础节点

- **start** - 发起人：流程开始节点
- **end** - 结束：流程结束节点

### 审批节点

- **approver** - 审批人：需要审批的节点，支持或签/会签
- **handler** - 办理人：执行任务的节点
- **cc** - 抄送人：抄送通知，无需审批

### 分支节点

- **condition** - 条件分支：根据条件进入不同分支
- **parallel** - 并行分支：多个分支同时执行

### 特殊节点

- **delay** - 延迟器：延迟一段时间后继续
- **trigger** - 触发器：触发外部服务

## 数据结构

### WorkflowDefinition

```typescript
interface WorkflowDefinition {
  id: string;           // 流程ID
  name: string;         // 流程名称
  version: number;      // 版本号
  nodes: WorkflowNode[]; // 节点列表
  formId?: string;      // 关联表单ID
  createTime?: string;  // 创建时间
  updateTime?: string;  // 更新时间
}
```

### WorkflowNode

```typescript
// 审批人节点
interface ApproverNode {
  id: string;
  type: 'approver';
  name: string;
  approvers: {
    source: 'user' | 'role' | 'dept' | 'leader' | 'self';
    values: string[];
    level?: number;     // 上级层级
  };
  mode: 'or' | 'and';   // 或签/会签
  timeout?: number;     // 审批时限（小时）
  autoPass?: boolean;   // 超时自动通过
  formFields?: string[]; // 可编辑字段
}

// 条件分支节点
interface ConditionNode {
  id: string;
  type: 'condition';
  name: string;
  branches: {
    id: string;
    name: string;
    conditions: {
      field: string;
      operator: string;
      value: any;
    }[];
    nodes: WorkflowNode[];
  }[];
}
```

## 使用示例

### 基础用法

```vue
<template>
  <div style="height: 600px;">
    <WorkflowDesigner
      v-model="workflowData"
      workflow-name="请假审批流程"
    />
  </div>
</template>
```

### 带操作按钮

```vue
<template>
  <div>
    <a-button @click="handleSave">保存</a-button>
    <a-button @click="handleValidate">校验</a-button>
    
    <WorkflowDesigner
      ref="designerRef"
      v-model="workflowData"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const designerRef = ref();

function handleSave() {
  const result = designerRef.value.validate();
  if (result.valid) {
    const data = designerRef.value.getWorkflowData();
    console.log('保存:', data);
  } else {
    console.error('校验失败:', result.errors);
  }
}

function handleValidate() {
  const result = designerRef.value.validate();
  console.log('校验结果:', result);
}
</script>
```

### 加载预设流程

```vue
<script setup>
const workflowData = ref({
  id: 'wf_leave',
  name: '请假审批流程',
  version: 1,
  nodes: [
    { id: 'start_1', type: 'start', name: '发起人' },
    { 
      id: 'approver_1', 
      type: 'approver', 
      name: '直属领导审批',
      approvers: { source: 'leader', values: [], level: 1 },
      mode: 'or'
    },
    { id: 'end_1', type: 'end', name: '结束' }
  ]
});
</script>
```

## 注意事项

1. 组件需要设置固定高度，建议使用 `height: 100%` 或具体像素值
2. 依赖 `@arco-design/web-vue` 组件库，请确保已安装
3. 图标使用 Arco Design 的图标组件

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
