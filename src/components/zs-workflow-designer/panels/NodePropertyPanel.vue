<template>
  <div class="node-property-panel">
    <!-- 发起人节点 -->
    <template v-if="node.type === 'start'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="发起人范围">
          <a-radio-group
            v-model="formData.initiatorSource"
            direction="vertical"
          >
            <a-radio value="all">所有人</a-radio>
            <a-radio value="dept">指定部门</a-radio>
            <a-radio value="role">指定角色</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="formData.initiatorSource !== 'all'" label="选择范围">
          <a-select
            v-model="formData.initiatorValues"
            multiple
            placeholder="请选择"
            allow-search
            :options="initiatorOptions"
          />
        </a-form-item>
      </a-form>
    </template>

    <!-- 审批人节点 -->
    <template v-if="node.type === 'approver'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="审批人设置" required>
          <a-radio-group v-model="formData.approverSource" direction="vertical">
            <a-radio value="leader">上级主管</a-radio>
            <a-radio value="user">指定成员</a-radio>
            <a-radio value="role">指定角色</a-radio>
            <a-radio value="self">发起人自己</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="formData.approverSource === 'leader'"
          label="主管层级"
        >
          <a-select v-model="formData.approverLevel" placeholder="请选择">
            <a-option :value="1">直属上级</a-option>
            <a-option :value="2">第2级上级</a-option>
            <a-option :value="3">第3级上级</a-option>
            <a-option :value="4">第4级上级</a-option>
            <a-option :value="5">第5级上级</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="['user', 'role'].includes(formData.approverSource)"
          label="选择人员"
          required
        >
          <a-select
            v-model="formData.approverValues"
            multiple
            placeholder="请选择"
            allow-search
            :options="userOptions"
          />
        </a-form-item>
        <a-divider />
        <a-form-item label="审批方式">
          <a-radio-group v-model="formData.approvalMode" direction="vertical">
            <a-radio value="or">或签（任意一人审批通过）</a-radio>
            <a-radio value="and">会签（所有人审批通过）</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审批时限">
          <a-space>
            <a-input-number
              v-model="formData.timeout"
              :min="0"
              :max="168"
              placeholder="请输入"
              style="width: 120px"
            >
              <template #suffix>小时</template>
            </a-input-number>
            <a-checkbox v-model="formData.autoPass"> 超时自动通过 </a-checkbox>
          </a-space>
        </a-form-item>
        <a-form-item label="表单权限">
          <a-select
            v-model="formData.formFields"
            multiple
            placeholder="选择可编辑的表单字段"
            allow-search
            :options="formFieldOptions"
          />
        </a-form-item>
      </a-form>
    </template>

    <!-- 办理人节点 -->
    <template v-if="node.type === 'handler'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="办理人设置" required>
          <a-radio-group v-model="formData.handlerSource" direction="vertical">
            <a-radio value="leader">上级主管</a-radio>
            <a-radio value="user">指定成员</a-radio>
            <a-radio value="role">指定角色</a-radio>
            <a-radio value="self">发起人自己</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="formData.handlerSource === 'leader'"
          label="主管层级"
        >
          <a-select v-model="formData.handlerLevel" placeholder="请选择">
            <a-option :value="1">直属上级</a-option>
            <a-option :value="2">第2级上级</a-option>
            <a-option :value="3">第3级上级</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="['user', 'role'].includes(formData.handlerSource)"
          label="选择人员"
          required
        >
          <a-select
            v-model="formData.handlerValues"
            multiple
            placeholder="请选择"
            allow-search
            :options="userOptions"
          />
        </a-form-item>
        <a-divider />
        <a-form-item label="办理时限">
          <a-input-number
            v-model="formData.timeout"
            :min="0"
            :max="168"
            placeholder="请输入"
            style="width: 120px"
          >
            <template #suffix>小时</template>
          </a-input-number>
        </a-form-item>
      </a-form>
    </template>

    <!-- 抄送人节点 -->
    <template v-if="node.type === 'cc'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="抄送人设置" required>
          <a-radio-group v-model="formData.ccSource" direction="vertical">
            <a-radio value="user">指定成员</a-radio>
            <a-radio value="role">指定角色</a-radio>
            <a-radio value="leader">上级主管</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="formData.ccSource === 'leader'" label="主管层级">
          <a-select v-model="formData.ccLevel" placeholder="请选择">
            <a-option :value="1">直属上级</a-option>
            <a-option :value="2">第2级上级</a-option>
            <a-option :value="3">第3级上级</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="['user', 'role'].includes(formData.ccSource)"
          label="选择人员"
          required
        >
          <a-select
            v-model="formData.ccValues"
            multiple
            placeholder="请选择"
            allow-search
            :options="userOptions"
          />
        </a-form-item>
      </a-form>
    </template>

    <!-- 条件分支节点 -->
    <template v-if="node.type === 'condition'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
      </a-form>
      <div class="branch-list">
        <div
          v-for="(branch, index) in formData.branches"
          :key="branch.id"
          class="branch-item"
        >
          <div class="branch-header">
            <span class="branch-title">
              {{
                index === formData.branches.length - 1
                  ? '默认分支'
                  : `分支 ${index + 1}`
              }}
            </span>
            <a-button
              v-if="index > 0 && index < formData.branches.length - 1"
              type="text"
              status="danger"
              size="mini"
              @click="removeBranch(index)"
            >
              <icon-delete />
            </a-button>
          </div>
          <a-form-item
            :label="
              index === formData.branches.length - 1 ? '分支名称' : '条件名称'
            "
          >
            <a-input v-model="branch.name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item
            v-if="index < formData.branches.length - 1"
            label="条件设置"
          >
            <div class="condition-list">
              <div
                v-for="(condition, cIndex) in branch.conditions"
                :key="cIndex"
                class="condition-item"
              >
                <a-select
                  v-model="condition.field"
                  placeholder="表单字段"
                  style="width: 100px"
                  :options="formFieldOptions"
                />
                <a-select
                  v-model="condition.operator"
                  placeholder="条件"
                  style="width: 80px; margin-left: 8px"
                >
                  <a-option value="eq">等于</a-option>
                  <a-option value="ne">不等于</a-option>
                  <a-option value="gt">大于</a-option>
                  <a-option value="lt">小于</a-option>
                  <a-option value="ge">大于等于</a-option>
                  <a-option value="le">小于等于</a-option>
                  <a-option value="contains">包含</a-option>
                  <a-option value="not_contains">不包含</a-option>
                </a-select>
                <a-input
                  v-model="condition.value"
                  placeholder="值"
                  style="width: 100px; margin-left: 8px"
                />
                <icon-delete
                  class="delete-icon"
                  @click="removeCondition(branch, cIndex)"
                />
              </div>
              <a-button
                type="dashed"
                long
                size="small"
                @click="addCondition(branch)"
              >
                <icon-plus /> 添加条件
              </a-button>
            </div>
          </a-form-item>
        </div>
        <a-button type="dashed" long @click="addBranch">
          <icon-plus /> 添加分支
        </a-button>
      </div>
    </template>

    <!-- 并行分支节点 -->
    <template v-if="node.type === 'parallel'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="合并方式">
          <a-radio-group v-model="formData.mergeMode" direction="vertical">
            <a-radio value="all">全部完成（所有分支完成才继续）</a-radio>
            <a-radio value="any">任意完成（任一分支完成就继续）</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <div class="branch-list">
        <div
          v-for="(branch, index) in formData.branches"
          :key="branch.id"
          class="branch-item"
        >
          <div class="branch-header">
            <span class="branch-title">分支 {{ index + 1 }}</span>
            <a-button
              v-if="formData.branches.length > 2"
              type="text"
              status="danger"
              size="mini"
              @click="removeParallelBranch(index)"
            >
              <icon-delete />
            </a-button>
          </div>
          <a-form-item label="分支名称">
            <a-input v-model="branch.name" placeholder="请输入分支名称" />
          </a-form-item>
        </div>
        <a-button type="dashed" long @click="addParallelBranch">
          <icon-plus /> 添加分支
        </a-button>
      </div>
    </template>

    <!-- 延迟器节点 -->
    <template v-if="node.type === 'delay'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="延迟类型">
          <a-radio-group v-model="formData.delayType" direction="vertical">
            <a-radio value="fixed">固定时长</a-radio>
            <a-radio value="field">表单字段</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="formData.delayType === 'fixed'"
          label="延迟时长"
          required
        >
          <a-space>
            <a-input-number
              v-model="formData.delayValue"
              :min="1"
              style="width: 120px"
            />
            <a-select v-model="formData.delayUnit" style="width: 100px">
              <a-option value="minute">分钟</a-option>
              <a-option value="hour">小时</a-option>
              <a-option value="day">天</a-option>
            </a-select>
          </a-space>
        </a-form-item>
        <a-form-item v-else label="表单字段" required>
          <a-select
            v-model="formData.delayField"
            placeholder="请选择日期字段"
            :options="dateFieldOptions"
          />
        </a-form-item>
      </a-form>
    </template>

    <!-- 触发器节点 -->
    <template v-if="node.type === 'trigger'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="触发类型">
          <a-radio-group v-model="formData.triggerType" direction="vertical">
            <a-radio value="webhook">Webhook</a-radio>
            <a-radio value="script">自定义脚本</a-radio>
            <a-radio value="service">内部服务</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="formData.triggerType === 'webhook'"
          label="Webhook URL"
          required
        >
          <a-input
            v-model="formData.config.url"
            placeholder="请输入Webhook地址"
          />
        </a-form-item>
        <a-form-item v-if="formData.triggerType === 'webhook'" label="请求方法">
          <a-radio-group v-model="formData.config.method">
            <a-radio value="POST">POST</a-radio>
            <a-radio value="GET">GET</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="formData.triggerType === 'script'"
          label="脚本内容"
          required
        >
          <a-textarea
            v-model="formData.config.script"
            placeholder="请输入JavaScript脚本"
            :auto-size="{ minRows: 6, maxRows: 10 }"
          />
        </a-form-item>
        <a-form-item
          v-if="formData.triggerType === 'service'"
          label="服务名称"
          required
        >
          <a-select
            v-model="formData.config.service"
            placeholder="请选择服务"
            :options="serviceOptions"
          />
        </a-form-item>
      </a-form>
    </template>

    <!-- 结束节点 -->
    <template v-if="node.type === 'end'">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="节点名称">
          <a-input v-model="formData.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="结束类型">
          <a-radio-group v-model="formData.endType" direction="vertical">
            <a-radio value="pass">正常结束</a-radio>
            <a-radio value="reject">拒绝结束</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import type { WorkflowNode } from '../types';
  import { generateId } from '../utils';

  const props = defineProps<{
    node: WorkflowNode;
  }>();

  const emit = defineEmits<{
    (e: 'update', node: WorkflowNode): void;
  }>();

  // 模拟选项数据（实际项目中应该从API获取）
  const userOptions = [
    { label: '张三', value: 'user_1' },
    { label: '李四', value: 'user_2' },
    { label: '王五', value: 'user_3' },
    { label: '赵六', value: 'user_4' },
  ];

  const initiatorOptions = [
    { label: '技术部', value: 'dept_1' },
    { label: '产品部', value: 'dept_2' },
    { label: '运营部', value: 'dept_3' },
    { label: '管理员', value: 'role_1' },
    { label: '普通用户', value: 'role_2' },
  ];

  const formFieldOptions = [
    { label: '申请人', value: 'applicant' },
    { label: '申请金额', value: 'amount' },
    { label: '申请类型', value: 'type' },
    { label: '申请日期', value: 'date' },
    { label: '备注', value: 'remark' },
  ];

  const dateFieldOptions = [
    { label: '申请日期', value: 'date' },
    { label: '期望完成日期', value: 'expected_date' },
  ];

  const serviceOptions = [
    { label: '发送邮件服务', value: 'email_service' },
    { label: '发送短信服务', value: 'sms_service' },
    { label: '数据同步服务', value: 'sync_service' },
  ];

  // 根据节点类型初始化表单数据
  const formData = reactive<any>({});

  function initFormData() {
    const { node } = props;
    formData.name = node.name;

    switch (node.type) {
      case 'start': {
        formData.initiatorSource = node.initiator?.source || 'all';
        formData.initiatorValues = node.initiator?.values || [];
        break;
      }

      case 'approver': {
        const approverNode = node as Extract<
          WorkflowNode,
          { type: 'approver' }
        >;
        formData.approverSource = approverNode.approvers?.source || 'leader';
        formData.approverValues = approverNode.approvers?.values || [];
        formData.approverLevel = approverNode.approvers?.level || 1;
        formData.approvalMode = approverNode.mode || 'or';
        formData.timeout = approverNode.timeout || 0;
        formData.autoPass = approverNode.autoPass || false;
        formData.formFields = approverNode.formFields || [];
        break;
      }

      case 'handler': {
        const handlerNode = node as Extract<WorkflowNode, { type: 'handler' }>;
        formData.handlerSource = handlerNode.handlers?.source || 'user';
        formData.handlerValues = handlerNode.handlers?.values || [];
        formData.handlerLevel = handlerNode.handlers?.level || 1;
        formData.timeout = handlerNode.timeout || 0;
        break;
      }

      case 'cc': {
        const ccNode = node as Extract<WorkflowNode, { type: 'cc' }>;
        formData.ccSource = ccNode.ccList?.source || 'user';
        formData.ccValues = ccNode.ccList?.values || [];
        formData.ccLevel = ccNode.ccList?.level || 1;
        break;
      }

      case 'condition': {
        const conditionNode = node as Extract<
          WorkflowNode,
          { type: 'condition' }
        >;
        formData.branches = conditionNode.branches?.map((b) => ({
          ...b,
          conditions: b.conditions?.length ? [...b.conditions] : [],
        })) || [
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
        ];
        break;
      }

      case 'parallel': {
        const parallelNode = node as Extract<
          WorkflowNode,
          { type: 'parallel' }
        >;
        formData.mergeMode = parallelNode.mergeMode || 'all';
        formData.branches = parallelNode.branches?.map((b) => ({ ...b })) || [
          { id: generateId('branch_'), name: '分支1', nodes: [] },
          { id: generateId('branch_'), name: '分支2', nodes: [] },
        ];
        break;
      }

      case 'delay': {
        const delayNode = node as Extract<WorkflowNode, { type: 'delay' }>;
        formData.delayType = delayNode.delayType || 'fixed';
        formData.delayValue =
          typeof delayNode.value === 'number' ? delayNode.value : 1;
        formData.delayUnit = delayNode.unit || 'hour';
        formData.delayField =
          typeof delayNode.value === 'string' ? delayNode.value : '';
        break;
      }

      case 'trigger': {
        const triggerNode = node as Extract<WorkflowNode, { type: 'trigger' }>;
        formData.triggerType = triggerNode.triggerType || 'webhook';
        formData.config = triggerNode.config || {};
        break;
      }

      case 'end': {
        const endNode = node as Extract<WorkflowNode, { type: 'end' }>;
        formData.endType = endNode.endType || 'pass';
        break;
      }

      default:
        break;
    }
  }

  // 监听节点变化，初始化表单
  watch(() => props.node, initFormData, { immediate: true });

  // 监听表单变化，更新节点
  watch(
    formData,
    () => {
      const updatedNode = { ...props.node } as WorkflowNode;

      // 基础属性
      (updatedNode as any).name = formData.name;

      switch (updatedNode.type) {
        case 'start': {
          (updatedNode as any).initiator = {
            source: formData.initiatorSource,
            values: formData.initiatorValues,
          };
          break;
        }

        case 'approver': {
          (updatedNode as any).approvers = {
            source: formData.approverSource,
            values: formData.approverValues,
            level: formData.approverLevel,
          };
          (updatedNode as any).mode = formData.approvalMode;
          (updatedNode as any).timeout = formData.timeout;
          (updatedNode as any).autoPass = formData.autoPass;
          (updatedNode as any).formFields = formData.formFields;
          break;
        }

        case 'handler': {
          (updatedNode as any).handlers = {
            source: formData.handlerSource,
            values: formData.handlerValues,
            level: formData.handlerLevel,
          };
          (updatedNode as any).timeout = formData.timeout;
          break;
        }

        case 'cc': {
          (updatedNode as any).ccList = {
            source: formData.ccSource,
            values: formData.ccValues,
            level: formData.ccLevel,
          };
          break;
        }

        case 'condition': {
          (updatedNode as any).branches = formData.branches;
          break;
        }

        case 'parallel': {
          (updatedNode as any).mergeMode = formData.mergeMode;
          (updatedNode as any).branches = formData.branches;
          break;
        }

        case 'delay': {
          (updatedNode as any).delayType = formData.delayType;
          (updatedNode as any).value =
            formData.delayType === 'fixed'
              ? formData.delayValue
              : formData.delayField;
          (updatedNode as any).unit = formData.delayUnit;
          break;
        }

        case 'trigger': {
          (updatedNode as any).triggerType = formData.triggerType;
          (updatedNode as any).config = formData.config;
          break;
        }

        case 'end': {
          (updatedNode as any).endType = formData.endType;
          break;
        }

        default:
          break;
      }

      emit('update', updatedNode);
    },
    { deep: true },
  );

  // 条件分支操作
  function addBranch() {
    formData.branches.push({
      id: generateId('branch_'),
      name: `条件${formData.branches.length}`,
      conditions: [],
      nodes: [],
    });
  }

  function removeBranch(index: number) {
    formData.branches.splice(index, 1);
  }

  function addCondition(branch: any) {
    if (!branch.conditions) branch.conditions = [];
    branch.conditions.push({ field: '', operator: 'eq', value: '' });
  }

  function removeCondition(branch: any, index: number) {
    branch.conditions.splice(index, 1);
  }

  // 并行分支操作
  function addParallelBranch() {
    formData.branches.push({
      id: generateId('branch_'),
      name: `分支${formData.branches.length + 1}`,
      nodes: [],
    });
  }

  function removeParallelBranch(index: number) {
    formData.branches.splice(index, 1);
  }
</script>

<style lang="less" scoped>
  .node-property-panel {
    :deep(.arco-form-item) {
      margin-bottom: 20px;
    }

    :deep(.arco-radio-group) {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    :deep(.arco-divider) {
      margin: 16px 0;
    }

    .branch-list {
      .branch-item {
        padding: 16px;
        background: #f7f8fa;
        border-radius: 8px;
        margin-bottom: 12px;

        .branch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;

          .branch-title {
            font-weight: 500;
            color: #1f2329;
          }
        }
      }
    }

    .condition-list {
      .condition-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .delete-icon {
          margin-left: 8px;
          color: #8f959e;
          cursor: pointer;

          &:hover {
            color: #f54a45;
          }
        }
      }
    }
  }
</style>
