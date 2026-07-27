<template>
  <div class="definition-edit-page">
    <!-- 步骤条 -->
    <div class="steps-section">
      <a-steps changeable :current="current" line-less @change="onStepChange">
        <a-step :status="stepStatus[1]">基本信息</a-step>
        <a-step :status="stepStatus[2]">表单设计</a-step>
        <a-step :status="stepStatus[3]">流程设计</a-step>
      </a-steps>

      <a-space class="steps-actions">
        <a-button type="primary" :loading="deploying" @click="handleDeploy">
          <template #icon><icon-save /></template>
          发布
        </a-button>
        <a-button type="primary" :loading="saving" @click="handleSave(false)">
          <template #icon><icon-save /></template>
          保存
        </a-button>
      </a-space>
    </div>

    <!-- 外层单表单包裹所有步骤 -->
    <a-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 4 }"
      :wrapper-col-props="{ span: 20 }"
      style="height: 100%; overflow: auto"
    >
      <!-- 第一步：基本信息 -->
      <div v-show="current === 1" class="content-area">
        <div class="step-inner">
          <div class="step-inner-content">
            <a-form-item
              label="流程标识"
              field="processKey"
              :rules="[
                {
                  required: true,
                  message: '请输入流程标识，流程唯一标识，创建后不可修改',
                },
              ]"
            >
              <a-input
                v-model="form.processKey"
                placeholder="例如：leave_process、expense_process"
                :disabled="!!definitionId"
              />
            </a-form-item>
            <a-form-item
              label="流程名称"
              field="processName"
              :rules="[{ required: true, message: '请输入流程名称' }]"
            >
              <a-input
                v-model="form.processName"
                placeholder="例如：请假审批流程、报销审批流程"
              />
            </a-form-item>
            <a-form-item
              label="流程分类"
              field="categoryId"
              :rules="[{ required: true, message: '请选择流程分类' }]"
            >
              <a-select
                v-model="form.categoryId"
                placeholder="请选择流程分类"
                :allow-clear="true"
                :loading="categoryLoading"
              >
                <a-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              label="流程图标"
              field="icon"
              :rules="[{ required: true, message: '请选择流程图标' }]"
            >
              <zs-selected-icon v-model="form.icon" />
            </a-form-item>
            <a-form-item label="流程描述" field="description">
              <a-textarea
                v-model="form.description"
                placeholder="流程描述（选填）"
                :rows="3"
              />
            </a-form-item>
            <a-form-item
              label="谁可以发起"
              field="startRole"
              :rules="[{ validator: startRoleValidator }]"
            >
              <ZsSelectType
                v-model="selectedIds"
                v-model:type="selectedType"
                @change="handleChange"
              />
            </a-form-item>
          </div>
        </div>
      </div>

      <!-- 第二步：表单设计 -->
      <div v-if="current === 2" class="content-area">
        <div class="step-inner">
          <div class="step-inner-content">
            <a-form-item label="表单类型" field="formType">
              <a-radio-group v-model="form.formType" @change="onFormTypeChange">
                <a-radio :value="1">动态表单</a-radio>
                <a-radio :value="2">业务表单</a-radio>
              </a-radio-group>
            </a-form-item>

            <template v-if="form.formType === 1">
              <a-form-item
                label="动态表单"
                field="formId"
                :rules="[{ required: true, message: '请选择动态表单' }]"
              >
                <a-select
                  v-model="form.formId"
                  placeholder="请选择动态表单"
                  :loading="formListLoading"
                  :allow-clear="true"
                >
                  <a-option
                    v-for="item in formList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.formName"
                  />
                </a-select>
              </a-form-item>
            </template>

            <template v-else>
              <a-form-item
                label="表单路由"
                field="businessFormRoute"
                :rules="[
                  { required: true, message: '请输入表单路由' },
                  { match: /^\//, message: '路由需以 / 开头' },
                ]"
              >
                <a-input
                  v-model="form.businessFormRoute"
                  placeholder="例如：/bpm/business/form"
                  :allow-clear="true"
                />
              </a-form-item>
              <a-form-item
                label="表单地址"
                field="businessFormAddress"
                :rules="[
                  { required: true, message: '请输入表单地址' },
                  {
                    match: /^\//,
                    message: '地址需以 / 开头',
                  },
                ]"
              >
                <a-input
                  v-model="form.businessFormAddress"
                  placeholder="例如：/bpm/business/form/index.vue"
                  :allow-clear="true"
                />
              </a-form-item>
            </template>
          </div>
        </div>
      </div>

      <!-- 第三步：流程设计 -->
      <div v-if="current === 3" class="content-area content-area--full">
        <!-- <zs-workflow ref="flowDesigner" workflow-name="请假审批流程" /> -->
        <zs-workflow
          ref="flowDesignerRef"
          :form-fields="formFields"
          :model-json="form.modelJson"
          :workflow-name="form.processName"
          :initiator-text="initiatorText"
        />
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { storeToRefs } from 'pinia';
  import { bpmSettingCategoryApi } from '@/api/bpm/setting/category';
  import { bpmSettingFormApi } from '@/api/bpm/setting/form';
  import { bpmSettingModelApi } from '@/api/bpm/setting/model';
  import { useRoleStore } from '@/store/modules/sys/role/roleStore';
  import { useDeptStore } from '@/store/modules/sys/dept/deptStore';
  import { useUserStore } from '@/store/modules/sys/user/userStore';

  const route = useRoute();

  // 角色、部门、用户 store
  const roleStore = useRoleStore();
  const { roleData } = storeToRefs(roleStore);
  const deptStore = useDeptStore();
  const { deptTreeData } = storeToRefs(deptStore);
  const userStore = useUserStore();
  const { userList } = storeToRefs(userStore);

  const current = ref(1);
  const saving = ref(false);
  const deploying = ref(false);
  const formRef = ref();
  const flowDesignerRef = ref();
  const definitionId = ref('');

  // 分类列表
  const categoryLoading = ref(false);
  const categoryList = ref<{ id: string; name: string }[]>([]);

  // 表单列表
  const formListLoading = ref(false);
  const formList = ref<
    {
      id: string;
      formName: string;
      formKey: string;
      formRule?: string;
      formOption?: string;
    }[]
  >([]);

  const form = reactive({
    processName: '',
    processKey: '',
    categoryId: undefined as string | undefined,
    icon: '',
    description: '',
    status: 0,
    formType: 1, // 1:动态表单 2:业务表单
    formId: undefined as string | undefined,
    businessFormName: '',
    businessFormRoute: '',
    businessFormAddress: '',
    formRule: '',
    formOption: '',
    modelJson: '',
    bpmnXml: '',
  });

  // 当前选中的动态表单
  const currentDynamicForm = computed(
    () => formList.value.find((item) => item.id === form.formId) ?? null,
  );

  // 解析动态表单字段列表（用于流程设计的表单权限配置）
  interface FormField {
    field: string;
    title: string;
    showType?: string;
    columnType?: string;
    fixedDownBoxValue?: string;
  }
  const formFields = computed<FormField[]>(() => {
    const ruleStr = currentDynamicForm.value?.formRule;
    if (!ruleStr) return [];
    try {
      const rules = typeof ruleStr === 'string' ? JSON.parse(ruleStr) : ruleStr;
      if (!Array.isArray(rules)) return [];
      return rules
        .filter((r: any) => r && r.field)
        .map((r: any) => ({
          field: String(r.field),
          title: String(r.title || r.label || r.field),
          showType: r.showType ?? r.type ?? '',
          columnType: r.columnType ?? r.columnDbType ?? '',
          fixedDownBoxValue: r.fixedDownBoxValue ?? r.options ?? '',
        }));
    } catch {
      return [];
    }
  });

  // 切换表单类型时清理对应字段
  function onFormTypeChange(type: number | string | boolean) {
    const t = Number(type);
    if (t === 1) {
      form.businessFormName = '';
      form.businessFormRoute = '';
      form.businessFormAddress = '';
    } else {
      form.formId = undefined;
    }
    formRef.value?.clearValidate();
  }

  // ---- 表单设计器数据 ----
  const formDesignRule = ref<Record<string, unknown>[]>([]);
  const formDesignOption = ref<Record<string, unknown>>({});

  // 加载已有表单设计数据
  watch(
    () => form.formRule,
    (rule) => {
      if (rule) {
        try {
          formDesignRule.value =
            typeof rule === 'string'
              ? JSON.parse(rule)
              : (rule as Record<string, unknown>[]);
        } catch {
          formDesignRule.value = [];
        }
      }
    },
  );

  watch(
    () => form.formOption,
    (opt) => {
      if (opt) {
        try {
          formDesignOption.value =
            typeof opt === 'string'
              ? JSON.parse(opt)
              : (opt as Record<string, unknown>);
        } catch {
          formDesignOption.value = {};
        }
      }
    },
  );

  // 步骤状态:用于在 a-step 上展示校验/访问状态
  type StepStatus = 'wait' | 'process' | 'finish' | 'error';
  const stepStatus = ref<Record<number, StepStatus>>({
    1: 'process',
    2: 'wait',
    3: 'wait',
  });
  // 已访问过的步骤
  const visitedSteps = ref<Set<number>>(new Set([1]));

  // 步骤对应的字段分组，用于单表单分步校验
  const stepFields: Record<number, string[]> = {
    1: [
      'processKey',
      'processName',
      'categoryId',
      'icon',
      'description',
      'startRole',
    ],
    2: [
      'formType',
      'formId',
      'businessFormName',
      'businessFormRoute',
      'businessFormAddress',
    ],
  };

  /** 同步更新步骤状态 */
  function syncStepStatus(active: number) {
    for (let i = 1; i <= 3; i += 1) {
      if (i === active) {
        stepStatus.value[i] = 'process';
      } else if (visitedSteps.value.has(i)) {
        if (stepStatus.value[i] !== 'error') {
          stepStatus.value[i] = 'finish';
        }
      } else {
        stepStatus.value[i] = 'wait';
      }
    }
  }

  // 步骤切换时同步状态与访问记录
  watch(current, (val) => {
    visitedSteps.value.add(val);
    syncStepStatus(val);
  });

  const selectedIds = ref<(number | string)[]>([]);
  const selectedType = ref(1);

  // 发起人类型校验规则
  const startRoleValidator = (
    value: unknown,
    callback: (error?: string) => void,
  ) => {
    // 全体用户不需要校验
    if (selectedType.value === 1) {
      callback();
      return;
    }
    // 指定用户、角色、部门、岗位需要校验是否选择了值
    if (!selectedIds.value || selectedIds.value.length === 0) {
      const typeLabels: Record<number, string> = {
        2: '指定用户',
        3: '指定角色',
        4: '指定部门',
        5: '指定岗位',
      };
      callback(`请选择${typeLabels[selectedType.value] || '发起人'}`);
      return;
    }
    callback();
  };

  function handleChange({
    type,
    ids,
  }: {
    type: number;
    ids: (number | string)[];
  }) {
    // eslint-disable-next-line no-console
    console.log('类型：', type, '选中的ID：', ids);
    // 触发表单校验
    formRef.value?.validateField('startRole');
  }

  // 获取发起人显示文本（用于流程设计中的发起人节点）
  const initiatorText = computed(() => {
    if (selectedType.value === 1) {
      return '所有人可以发起流程';
    }

    const ids = selectedIds.value;
    if (!ids || ids.length === 0) {
      return '请设置发起人';
    }

    if (selectedType.value === 2) {
      // 指定用户
      const names = ids
        .map((id) => {
          const user = userList.value.find((u) => u.sysUserId === id);
          return (
            user?.realName || user?.username || user?.realName || String(id)
          );
        })
        .join('、');
      return `${names}可以发起流程`;
    }

    if (selectedType.value === 3) {
      // 指定角色
      const names = ids
        .map((id) => {
          const role = roleData.value.find((r) => r.sysRoleId === id);
          return role?.roleName || String(id);
        })
        .join('、');
      return `${names}角色可以发起流程`;
    }

    if (selectedType.value === 4) {
      // 指定部门
      const findDeptName = (tree: any[], targetId: any): string => {
        let result = String(targetId);
        tree.some((item) => {
          if (item.sysDeptId === targetId) {
            result = item.deptName;
            return true;
          }
          if (item.children) {
            const found = findDeptName(item.children, targetId);
            if (found !== String(targetId)) {
              result = found;
              return true;
            }
          }
          return false;
        });
        return result;
      };
      const names = ids
        .map((id) => findDeptName(deptTreeData.value, id))
        .join('、');
      return `${names}部门可以发起流程`;
    }

    if (selectedType.value === 5) {
      // 指定岗位
      return '指定岗位可以发起流程';
    }

    return '请设置发起人';
  });

  /** 校验指定步骤的字段 */
  async function validateStep(step: number): Promise<boolean> {
    if (!formRef.value) return true;
    try {
      const fields = stepFields[step];
      const errors = await formRef.value.validate({ fields });
      const ok = !errors;
      stepStatus.value[step] = ok ? 'finish' : 'error';
      return ok;
    } catch {
      stepStatus.value[step] = 'error';
      return false;
    }
  }

  /** 校验所有步骤,失败时跳转至首个失败步骤 */
  async function validateAllSteps(): Promise<boolean> {
    const steps = [1, 2];
    const results = await Promise.all(steps.map((s) => validateStep(s)));
    const firstFailed = results.findIndex((ok) => !ok);
    if (firstFailed >= 0) {
      current.value = firstFailed + 1;
      Message.warning('请完善当前步骤的必填项');
      return false;
    }
    return true;
  }

  /** 构建提交数据 */
  function buildPayload() {
    const isDynamic = form.formType === 1;
    const dynamicForm = currentDynamicForm.value;
    return {
      id: definitionId.value || undefined,
      processName: form.processName,
      processKey: form.processKey,
      categoryId: form.categoryId,
      icon: form.icon,
      description: form.description,
      status: form.status,
      formType: form.formType,
      formId: isDynamic ? form.formId : undefined,
      businessFormName: !isDynamic ? form.businessFormName : undefined,
      businessFormRoute: !isDynamic ? form.businessFormRoute : undefined,
      businessFormAddress: !isDynamic ? form.businessFormAddress : undefined,
      formRule: isDynamic ? dynamicForm?.formRule : form.formRule,
      formOption: isDynamic ? dynamicForm?.formOption : form.formOption,
      modelJson: form.modelJson,
      bpmnXml: form.bpmnXml,
    };
  }

  /** 从流程设计器获取数据并保存 */
  async function collectFlowDesignerData(): Promise<boolean> {
    if (!flowDesignerRef.value) return true;

    const valid = flowDesignerRef.value.validateFlow?.();
    if (valid === false) {
      stepStatus.value[3] = 'error';
      if (current.value !== 3) {
        current.value = 3;
      }
      return false;
    }

    try {
      const modelJson = flowDesignerRef.value.getModelJson();
      form.modelJson = modelJson;
      stepStatus.value[3] = 'finish';
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('获取流程设计器数据失败', e);
      stepStatus.value[3] = 'error';
      return false;
    }
  }

  /** 部署 */
  async function handleDeploy() {
    deploying.value = true;
    try {
      await bpmSettingModelApi.deployModel(definitionId.value);
      Message.success('发布成功');
    } catch (e: any) {
      Message.error(e?.response?.data?.msg ?? e?.message ?? '发布失败');
    } finally {
      deploying.value = false;
    }
  }

  /** 保存(草稿)或发布 */
  async function handleSave(isPublish: boolean) {
    saving.value = true;
    try {
      // 1. 校验当前步骤
      const currentOk = await validateStep(current.value);
      if (!currentOk) {
        Message.warning('请完善当前步骤的必填项');
        return;
      }
      // 2. 发布时校验全部步骤
      if (isPublish) {
        const allOk = await validateAllSteps();
        if (!allOk) return;
      }
      // 3. 收集流程设计器数据（保存/发布均需校验流程配置）
      if (current.value === 3 || isPublish) {
        const flowOk = await collectFlowDesignerData();
        if (!flowOk) {
          Message.warning('请完善流程设计中的节点配置');
          return;
        }
      }
      // 4. 提交保存
      const payload = buildPayload();
      const { data: res } = definitionId.value
        ? await bpmSettingModelApi.updateModel(payload)
        : await bpmSettingModelApi.createModel(payload);
      const newId = res?.data?.id ?? res?.id ?? definitionId.value;
      if (newId) definitionId.value = newId;
      // 5. 发布
      // if (isPublish && definitionId.value) {
      //   await bpmSettingModelApi.deployModel(definitionId.value);
      // }
      Message.success(isPublish ? '发布成功' : '保存成功');
    } catch (e: any) {
      Message.error(e?.response?.data?.msg ?? e?.message ?? '操作失败');
    } finally {
      saving.value = false;
    }
  }

  /** 加载分类列表 */
  async function loadCategories() {
    categoryLoading.value = true;
    try {
      const { data } = await bpmSettingCategoryApi.getCategoryPage({
        current: 1,
        pageSize: 999,
      });
      const result = data?.data ?? data;
      categoryList.value = result?.list ?? result?.records ?? [];
    } finally {
      categoryLoading.value = false;
    }
  }

  /** 加载表单列表 */
  async function loadFormList() {
    formListLoading.value = true;
    try {
      const { data } = await bpmSettingFormApi.getFormPage({
        current: 1,
        pageSize: 999,
      });
      const result = data?.data ?? data;
      formList.value = result?.list ?? result?.records ?? [];
    } finally {
      formListLoading.value = false;
    }
  }

  /** 加载流程定义（编辑模式） */
  async function loadDefinition(id: string) {
    try {
      const { data: res } = await bpmSettingModelApi.getModelById(id);
      const def = res?.data ?? res;
      if (!def) return;

      definitionId.value = def.id ?? id;
      form.processName = def.processName ?? '';
      form.processKey = def.processKey ?? '';
      form.categoryId = def.categoryId ?? undefined;
      form.icon = def.icon ?? '';
      form.description = def.description ?? '';
      form.status = def.status ?? 0;
      form.formType = def.formType ?? (def.formId ? 1 : 2);
      form.formId = def.formId ?? undefined;
      form.businessFormName = def.businessFormName ?? '';
      form.businessFormRoute = def.businessFormRoute ?? '';
      form.businessFormAddress = def.businessFormAddress ?? '';
      form.formRule = def.formRule ?? '';
      form.formOption = def.formOption ?? '';
      form.modelJson = def.modelJson ?? '';
      form.bpmnXml = def.bpmnXml ?? '';
      // 加载到设计器
    } catch (e: any) {
      Message.error(e?.response?.data?.msg ?? e?.message ?? '加载失败');
    }
  }

  /** 步骤切换回调:只能一步步前进,且必须校验通过当前步骤才能进入下一步 */
  async function onStepChange(newStep: number) {
    const target = Math.max(1, Math.min(3, newStep));
    if (target === current.value) return;

    // 向后切换:直接放行
    if (target < current.value) {
      current.value = target;
      return;
    }

    // 向前切换:只能前进1步,且必须校验通过当前步骤
    if (target !== current.value + 1) {
      return;
    }

    const ok = await validateStep(current.value);
    if (ok) {
      current.value = target;
    } else {
      Message.warning('请先完成当前步骤的必填项');
    }
  }

  onMounted(async () => {
    // 并行加载分类、表单和用户列表
    await Promise.all([
      loadCategories(),
      loadFormList(),
      userStore.loadUserList(),
    ]);

    const id = route.query.id as string | undefined;
    if (id) {
      await loadDefinition(id);
    }
  });
</script>

<style lang="less" scoped>
  .definition-edit-page {
    height: var(--app-main-height);
    display: flex;
    flex-direction: column;
    background: var(--color-fill-2);
  }

  /* ===== 步骤条 ===== */
  .steps-section {
    position: relative;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    padding: 12px 0;
    background: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border-1);
  }

  .steps-actions {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  /* ===== 内容区域 ===== */
  .content-area {
    flex: 1;
    min-height: 0;
    overflow: auto;

    &--full {
      padding: 0;
      overflow: hidden;
    }
  }

  .step-inner {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: var(--color-bg-2);
    padding: 24px;
    overflow: auto;
  }

  .step-inner-content {
    width: 50%;
    display: flex;
    flex-direction: column;
  }

  .form-design-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 80px 0;
    color: var(--color-text-4);
    font-size: 14px;
  }

  .form-tip {
    color: var(--color-text-3);
    font-size: 13px;
    line-height: 1.6;
  }
</style>
