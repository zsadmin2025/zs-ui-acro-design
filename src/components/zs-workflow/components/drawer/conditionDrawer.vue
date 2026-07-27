<template>
  <a-drawer
    :visible="visible"
    title="条件设置"
    class="condition_copyer"
    width="35%"
  >
    <template #header="{ titleId, titleClass }">
      <h3 :id="titleId" :class="titleClass">条件设置</h3>
      <select v-model="conditionConfig.priorityLevel" class="priority_level">
        <option
          v-for="item in conditionsConfig.conditionNodes.length"
          :key="item"
          :value="item"
          >优先级{{ item }}</option
        >
      </select>
    </template>
    <div class="demo-drawer__content">
      <a-form
        ref="conditionFormRef"
        :model="conditionConfig"
        class="condition_content drawer_content"
        layout="vertical"
      >
        <!-- 配置方式切换 -->
        <div class="config-mode-section">
          <a-form-item label="配置方式" required>
            <a-radio-group
              v-model="conditionConfig.configMode"
              @change="onConfigModeChange"
            >
              <a-radio :value="'expression'">条件表达式</a-radio>
              <a-radio :value="'group'">条件组关系</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>

        <!-- 条件表达式模式 -->
        <div
          v-if="conditionConfig.configMode === 'expression'"
          class="expression-section"
        >
          <a-form-item
            label="条件表达式"
            field="expression"
            :rules="[{ required: true, message: '请输入条件表达式' }]"
            :validate-trigger="['change', 'blur']"
          >
            <a-textarea
              v-model="conditionConfig.expression"
              :rows="4"
              placeholder="请输入条件表达式，如：leaveDays > 3 && applyType == 'annual'"
            />
          </a-form-item>
        </div>

        <!-- 条件组关系模式 -->
        <div v-else class="condition-group-section">
          <!-- 条件组关系开关 -->
          <div class="group-relation-row">
            <span class="relation-label">条件组关系</span>
            <a-switch
              v-model="conditionConfig.groupRelation"
              :checked-children="'且'"
              :unchecked-children="'或'"
            />
          </div>

          <!-- 条件规则列表 -->
          <div class="rules-container">
            <div
              v-for="(rule, ruleIndex) in conditionConfig.conditionRules"
              :key="ruleIndex"
              class="rule-row"
            >
              <!-- 删除按钮 -->
              <a-button
                v-if="conditionConfig.conditionRules.length > 1"
                type="text"
                class="rule-delete-btn"
                @click="removeRule(ruleIndex)"
              >
                <template #icon><icon-delete /></template>
              </a-button>

              <!-- 规则内容 -->
              <div class="rule-content">
                <!-- 字段选择 -->
                <a-form-item
                  :field="`conditionRules[${ruleIndex}].columnId`"
                  :rules="[{ required: true, message: '请选择表单字段' }]"
                  :validate-trigger="['change']"
                  hide-label
                  class="rule-form-item"
                >
                  <a-select
                    v-model="rule.columnId"
                    :placeholder="
                      '请选择表单字段' +
                      (conditionConfig.conditionRules.length > 1
                        ? ` (${ruleIndex + 1})`
                        : '')
                    "
                    class="field-select"
                    allow-clear
                    @change="onFieldChange(ruleIndex)"
                  >
                    <a-option
                      v-for="item in availableFields"
                      :key="item.field"
                      :value="item.field"
                      :label="item.title"
                    />
                  </a-select>
                </a-form-item>

                <!-- 运算符 -->
                <a-select
                  v-model="rule.optType"
                  :placeholder="getOptPlaceholder(rule)"
                  class="opt-select"
                  :disabled="!rule.columnId"
                  :options="getOptTypes(rule)"
                />

                <!-- 值输入 -->
                <template v-if="rule.showType === '3'">
                  <!-- 复选框类型 -->
                  <a-form-item
                    :field="`conditionRules[${ruleIndex}].zdy1`"
                    :rules="[
                      {
                        validator: (_v, cb) =>
                          rule.zdy1 ? cb() : cb('请至少选择一项'),
                      },
                    ]"
                    :validate-trigger="['change']"
                    hide-label
                    class="rule-form-item"
                  >
                    <p class="check_box">
                      <a
                        v-for="(item1, index1) in JSON.parse(
                          rule.fixedDownBoxValue,
                        )"
                        :key="index1"
                        :class="
                          $func.toggleStrClass(rule, item1.key) && 'active'
                        "
                        @click="toStrChecked(rule, item1.key)"
                        >{{ item1.value }}</a
                      >
                    </p>
                  </a-form-item>
                </template>
                <template v-else>
                  <a-form-item
                    :field="`conditionRules[${ruleIndex}].zdy1`"
                    :rules="[{ required: true, message: '请输入条件值' }]"
                    :validate-trigger="['change', 'blur']"
                    hide-label
                    class="rule-form-item"
                  >
                    <a-input
                      v-model="rule.zdy1"
                      placeholder="请输入条件值"
                      class="value-input"
                      :disabled="!rule.columnId"
                    />
                  </a-form-item>
                </template>
              </div>
            </div>
          </div>

          <!-- 添加规则按钮 -->
          <a-button type="primary" @click="addRule">
            <template #icon><icon-plus /></template>
            添加条件规则
          </a-button>
        </div>
      </a-form>
    </div>
    <template #footer>
      <a-button @click="closeDrawer">取 消</a-button>
      <a-button type="primary" @click="saveCondition">确 定</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { IconDelete, IconPlus } from '@arco-design/web-vue/es/icon';
  import $func from '../../utils/index';
  import { useStore } from '../../stores/index';
  import { optTypes } from '../../utils/const';

  const conditionsConfig = ref({
    conditionNodes: [],
  });
  const conditionConfig = ref({
    configMode: 'expression',
    expression: '',
    groupRelation: true,
    conditionRules: [],
  });
  const conditionFormRef = ref(null);
  const PriorityLevel = ref(1);

  const store = useStore();
  const { setCondition, setConditionsConfig } = store;
  const formFields = computed(() => store.formFields ?? []);
  const conditionsConfig1 = computed(() => store.conditionsConfig1);
  const conditionDrawer = computed(() => store.conditionDrawer);

  // 可用字段列表（动态表单字段）
  const availableFields = computed(() => {
    return formFields.value;
  });

  const closeDrawer = () => {
    setCondition(false);
  };
  const visible = computed({
    get() {
      return conditionDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  /** 创建空规则 */
  function createEmptyRule() {
    return {
      columnId: '',
      showName: '',
      columnName: '',
      showType: '',
      columnType: '',
      fixedDownBoxValue: '',
      optType: '',
      zdy1: '',
      opt1: '<',
      zdy2: '',
      opt2: '<',
      nodeUserList: [],
    };
  }

  /** 获取运算符列表 */
  function getOptTypes(rule) {
    if (!rule.columnId) {
      return [];
    }
    return optTypes;
  }

  /** 获取运算符占位符文本 */
  function getOptPlaceholder(rule) {
    if (!rule.columnId) {
      return '请先选择字段';
    }
    if (rule.optType) {
      const found = optTypes.find((t) => t.value === rule.optType);
      return found ? found.label : '请选择运算符';
    }
    return '请选择运算符';
  }

  /** 配置方式切换 */
  function onConfigModeChange(mode) {
    if (mode === 'expression') {
      conditionConfig.value.conditionRules = [];
    } else if (mode === 'group') {
      conditionConfig.value.expression = '';
      if (
        !conditionConfig.value.conditionRules ||
        conditionConfig.value.conditionRules.length === 0
      ) {
        conditionConfig.value.conditionRules = [createEmptyRule()];
      }
    }
    // 清除校验状态
    conditionFormRef.value?.clearValidate();
  }

  /** 添加规则 */
  function addRule() {
    conditionConfig.value.conditionRules.push(createEmptyRule());
  }

  /** 删除规则 */
  function removeRule(index) {
    conditionConfig.value.conditionRules.splice(index, 1);
  }

  /** 根据表单字段推断 columnType */
  function inferColumnType(field) {
    const showType = String(field?.showType ?? field?.type ?? '').toLowerCase();
    if (['inputnumber', 'number', 'slider', 'rate'].includes(showType)) {
      return 'Number';
    }
    return 'String';
  }

  /** 字段变化时同步字段信息 */
  function onFieldChange(index) {
    const rule = conditionConfig.value.conditionRules[index];
    if (!rule.columnId) {
      rule.showName = '';
      rule.columnName = '';
      rule.showType = '';
      rule.columnType = '';
      rule.fixedDownBoxValue = '';
      return;
    }
    const field = formFields.value.find((f) => f.field === rule.columnId);
    if (field) {
      rule.showName = field.title;
      rule.columnName = field.field;
      rule.showType = field.showType ?? '';
      rule.columnType = field.columnType || inferColumnType(field);
      rule.fixedDownBoxValue = field.fixedDownBoxValue ?? '';
      if (!rule.optType) {
        rule.optType = '4';
      }
    }
  }

  /** 字符串多选处理 */
  const removeStrEle = (item, key) => {
    const a = item.zdy1 ? item.zdy1.split(',') : [];
    let includesIndex;
    a.forEach((v, index) => {
      if (v === key) {
        includesIndex = index;
      }
    });
    a.splice(includesIndex, 1);
    item.zdy1 = a.toString();
  };

  const toStrChecked = (item, key) => {
    const a = item.zdy1 ? item.zdy1.split(',') : [];
    const isIncludes = $func.toggleStrClass(item, key);
    if (!isIncludes) {
      a.push(key);
      item.zdy1 = a.toString();
    } else {
      removeStrEle(item, key);
    }
  };

  /** 保存条件 */
  async function saveCondition() {
    // 表单校验
    if (conditionFormRef.value) {
      const errors = await conditionFormRef.value.validate();
      if (errors) return;
    }

    closeDrawer();
    const a = conditionsConfig.value.conditionNodes.splice(
      PriorityLevel.value - 1,
      1,
    );
    conditionsConfig.value.conditionNodes.splice(
      conditionConfig.value.priorityLevel - 1,
      0,
      a[0],
    );
    conditionsConfig.value.conditionNodes.forEach((item, index) => {
      item.priorityLevel = index + 1;
    });

    // 将新配置同步到条件节点
    const currentNode =
      conditionsConfig.value.conditionNodes[
        conditionConfig.value.priorityLevel - 1
      ];
    // 同步 opt1 与 optType（后端 FlowToBpmnConverter 使用 opt1 字段生成条件表达式）
    conditionConfig.value.conditionRules.forEach((rule) => {
      const optTypeToOpt1 = {
        1: '<',
        2: '>',
        3: '≤',
        4: '=',
        5: '≥',
      };
      if (rule.optType && optTypeToOpt1[rule.optType]) {
        rule.opt1 = optTypeToOpt1[rule.optType];
      }
    });

    currentNode.configMode = conditionConfig.value.configMode;
    if (conditionConfig.value.configMode === 'expression') {
      currentNode.expression = conditionConfig.value.expression;
      currentNode.groupRelation = null;
      currentNode.conditionRules = null;
      currentNode.conditionList = [];
    } else {
      currentNode.expression = null;
      currentNode.groupRelation = conditionConfig.value.groupRelation;
      currentNode.conditionRules = conditionConfig.value.conditionRules;
      // 兼容旧结构：同步到 conditionList
      currentNode.conditionList = conditionConfig.value.conditionRules.map(
        (rule) => ({
          ...rule,
          type: 2,
        }),
      );
    }

    for (let i = 0; i < conditionsConfig.value.conditionNodes.length; i += 1) {
      conditionsConfig.value.conditionNodes[i].error =
        $func.isConditionNodeError(conditionsConfig.value, i);
    }
    setConditionsConfig({
      value: conditionsConfig.value,
      flag: true,
      id: conditionsConfig1.value.id,
    });
  }

  /** 监听配置变化，回显数据 */
  watch(conditionsConfig1, (val) => {
    if (!val.value) return;
    conditionsConfig.value = val.value;
    const activePriorityLevel = val.value?.priorityLevel ?? 1;
    PriorityLevel.value = activePriorityLevel;
    // 清除校验状态
    conditionFormRef.value?.clearValidate();

    // 从条件节点数组中取出对应节点，确保响应式
    const sourceNode = activePriorityLevel
      ? conditionsConfig.value.conditionNodes[activePriorityLevel - 1]
      : null;
    if (sourceNode) {
      // 直接使用源节点引用，保持响应式
      conditionConfig.value = sourceNode;
      // 设置优先级下拉框默认值为当前点击的条件节点优先级
      sourceNode.priorityLevel = activePriorityLevel;
    } else {
      conditionConfig.value = {
        configMode: 'expression',
        expression: '',
        groupRelation: true,
        conditionRules: [createEmptyRule()],
        priorityLevel: 1,
      };
    }

    // 初始化配置模式
    const node = conditionConfig.value;
    if (!node.configMode) {
      if (node.expression) {
        node.configMode = 'expression';
      } else if (node.conditionRules && node.conditionRules.length > 0) {
        node.configMode = 'group';
      } else if (node.conditionList && node.conditionList.length > 0) {
        node.configMode = 'group';
        node.conditionRules = node.conditionList.map((c) => ({
          ...c,
          columnId: c.columnId ?? '',
          showName: c.showName ?? '',
          columnName: c.columnDbname ?? c.columnName ?? '',
          showType: c.showType ?? '',
          columnType: c.columnType ?? '',
          fixedDownBoxValue: c.fixedDownBoxValue ?? '',
          optType: c.optType ?? '4',
          zdy1: c.zdy1 ?? '',
          opt1: c.opt1 ?? '<',
          zdy2: c.zdy2 ?? '',
          opt2: c.opt2 ?? '<',
          nodeUserList: c.nodeUserList ?? [],
        }));
      } else {
        node.configMode = 'expression';
      }
    }
    if (node.groupRelation === null || node.groupRelation === undefined) {
      node.groupRelation = true;
    }
    if (!node.conditionRules) {
      node.conditionRules = [];
    }
    if (!node.expression) {
      node.expression = '';
    }
  });
</script>

<style lang="less">
  .condition_copyer {
    .priority_level {
      position: absolute;
      top: 11px;
      right: 30px;
      width: 100px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(217, 217, 217, 1);
      font-size: 12px;
    }

    .condition_content {
      padding: 20px 20px 0;

      // 配置方式区域
      .config-mode-section {
        margin-bottom: 20px;
      }

      // 表达式区域
      .expression-section {
        margin-bottom: 20px;
      }

      // 条件组区域
      .condition-group-section {
        .group-relation-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-bottom: 16px;

          .relation-label {
            margin-right: 12px;
            font-size: 14px;
            color: #4e5969;
          }
        }

        // 规则行内的表单项样式
        .rule-form-item {
          margin-bottom: 0;

          .arco-form-item-content {
            flex: 1;
          }

          // 校验消息样式 - 保持布局稳定
          .arco-form-item-message {
            position: absolute;
            bottom: -18px;
            left: 0;
            white-space: nowrap;
            font-size: 12px;
          }
        }

        .rules-container {
          margin-bottom: 16px;

          .rule-row {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 4px;

            .rule-delete-btn {
              margin-right: 8px;
              margin-top: 4px;
            }

            .rule-content {
              flex: 1;
              display: flex;
              flex-wrap: nowrap;
              align-items: flex-start;
              gap: 8px;

              .opt-select {
                width: 300px;
              }

              .value-input {
                flex: 1;
                min-width: 150px;
              }

              .selected_list {
                padding-left: 10px;
                border-radius: 4px;
                min-height: 32px;
                border: 1px solid rgba(217, 217, 217, 1);
                word-break: break-word;
                flex: 1;
                min-width: 150px;
              }

              .check_box {
                line-height: 32px;
                flex: 1;
                min-width: 150px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;

                a {
                  padding: 4px 12px;
                  border: 1px solid #e5e6eb;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 12px;
                  color: #4e5969;
                  text-decoration: none;
                  transition: all 0.2s;
                  white-space: nowrap;

                  &:hover {
                    border-color: #165dff;
                    color: #165dff;
                  }

                  &.active {
                    background-color: #e8f3ff;
                    border-color: #165dff;
                    color: #165dff;
                  }
                }
              }
            }
          }
        }
      }

      p.tip {
        margin: 20px 0;
        width: 510px;
        text-indent: 17px;
        line-height: 45px;
        background: rgba(241, 249, 255, 1);
        border: 1px solid rgba(64, 163, 247, 1);
        color: #46a6fe;
        font-size: 14px;
      }

      ul {
        max-height: 500px;
        overflow-y: scroll;
        margin-bottom: 20px;

        li {
          & > span {
            float: left;
            margin-right: 8px;
            width: 70px;
            line-height: 32px;
            text-align: right;
          }

          & > div {
            display: inline-block;
            width: 370px;

            & > p:not(:last-child) {
              margin-bottom: 10px;
            }
          }

          &:not(:last-child) > div > p {
            margin-bottom: 20px;
          }

          & > a {
            float: right;
            margin-right: 10px;
            margin-top: 7px;
          }

          select,
          input {
            width: 100%;
            height: 32px;
            background: rgba(255, 255, 255, 1);
            border-radius: 4px;
            border: 1px solid rgba(217, 217, 217, 1);
          }

          select + input {
            width: 260px;
          }

          select {
            margin-right: 10px;
            width: 100px;
          }

          p.selected_list {
            padding-left: 10px;
            border-radius: 4px;
            min-height: 32px;
            border: 1px solid rgba(217, 217, 217, 1);
            word-break: break-word;
          }

          p.check_box {
            line-height: 32px;
          }
        }
      }

      .el-button {
        margin-bottom: 20px;
      }
    }
  }

  .condition_list {
    .el-dialog__body {
      padding: 16px 26px;
    }

    p {
      color: #666666;
      margin-bottom: 10px;

      & > .check_box {
        margin-bottom: 0;
        line-height: 36px;
      }
    }
  }
</style>
