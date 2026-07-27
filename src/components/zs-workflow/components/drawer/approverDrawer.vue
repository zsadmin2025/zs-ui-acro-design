<template>
  <a-drawer
    v-model:visible="visible"
    title="审批人设置"
    class="set_promoter"
    :width="550"
  >
    <div class="demo-drawer__content">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="审批人">
          <a-form
            ref="approverFormRef"
            :model="approverConfig"
            class="approver-panel"
          >
            <div class="setting-section">
              <div class="section-title">审批人设置</div>
              <div class="drawer_content">
                <div class="approver_content">
                  <a-radio-group
                    v-model="approverConfig.settype"
                    @change="changeType"
                  >
                    <a-grid :cols="3" :col-gap="24" :row-gap="16">
                      <a-grid-item
                        v-for="{ value, label } in setTypes"
                        :key="value"
                        :value="value"
                      >
                        <a-radio :value="value">{{ label }}</a-radio>
                      </a-grid-item>
                    </a-grid>
                  </a-radio-group>
                </div>
              </div>
            </div>
            <div class="setting-section">
              <!-- 指定成员 -->
              <div v-if="approverConfig.settype == 1">
                <div class="section-title">指定成员</div>
                <div class="drawer_content">
                  <a-form-item
                    field="nodeUserList"
                    :rules="[
                      {
                        validator: (v, cb) =>
                          nodeUserIds.length > 0
                            ? cb()
                            : cb('请选择至少一名审批人'),
                      },
                    ]"
                    :validate-trigger="['change']"
                    hide-label
                  >
                    <ZsSelectUser
                      v-model="nodeUserIds"
                      :multiple="true"
                      @on-select="handleSelect"
                    />
                  </a-form-item>
                </div>
              </div>
              <!-- 指定角色 -->
              <div v-if="approverConfig.settype == 2">
                <div class="section-title">指定角色</div>
                <div class="drawer_content">
                  <a-form-item
                    field="nodeRoleList"
                    :rules="[
                      {
                        validator: (v, cb) =>
                          nodeRoleIds.length > 0
                            ? cb()
                            : cb('请选择至少一个角色'),
                      },
                    ]"
                    :validate-trigger="['change']"
                    hide-label
                  >
                    <a-select
                      v-model="nodeRoleIds"
                      :multiple="true"
                      @change="handleChangeRole"
                    >
                      <a-option
                        v-for="item in roleList"
                        :key="item.sysRoleId"
                        :value="item.sysRoleId"
                      >
                        {{ item.roleName }}
                      </a-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
              <!-- 指定岗位 -->
              <div v-if="approverConfig.settype == 3">
                <div class="section-title">指定岗位</div>
                <div class="drawer_content">
                  <a-form-item
                    field="nodePostList"
                    :rules="[
                      {
                        validator: (v, cb) =>
                          nodePostIds.length > 0
                            ? cb()
                            : cb('请选择至少一个岗位'),
                      },
                    ]"
                    :validate-trigger="['change']"
                    hide-label
                  >
                    <zs-select-post
                      v-model="nodePostIds"
                      :multiple="true"
                      @change="handleChangePost"
                    />
                  </a-form-item>
                </div>
              </div>
              <!-- 部门负责人 -->
              <div v-if="approverConfig.settype == 4">
                <div class="section-title">部门负责人</div>
                <div class="drawer_content">
                  <a-form-item
                    field="nodeDeptHeadList"
                    :rules="[
                      {
                        validator: (v, cb) =>
                          nodeDeptHeadIds.length > 0
                            ? cb()
                            : cb('请选择至少一个部门负责人'),
                      },
                    ]"
                    :validate-trigger="['change']"
                    hide-label
                  >
                    <zs-select-dept
                      v-model="nodeDeptHeadIds"
                      :multiple="true"
                      @change="handleChangeDept"
                    />
                  </a-form-item>
                </div>
              </div>
              <!--发起人自选-->
              <div v-if="approverConfig.settype == 5">
                <div class="section-title">发起人自选</div>
                <div class="drawer_content">
                  <div class="cc-self-select">
                    <span>发起时，由发起人选择抄送人</span>
                  </div>
                </div>
              </div>
              <!--发起人自己-->
              <div v-if="approverConfig.settype == 6">
                <div class="section-title">发起人自己</div>
                <div class="drawer_content">
                  <div class="cc-self">
                    <span>抄送给发起人自己</span>
                  </div>
                </div>
              </div>
              <!--直属上级-->
              <div v-if="approverConfig.settype == 7">
                <div class="section-title">直属上级</div>
                <div class="drawer_content">
                  <div class="cc-direct-superior">
                    <span>抄送给发起人的直属上级</span>
                  </div>
                </div>
              </div>
              <!--表单内人员-->
              <div v-if="approverConfig.settype == 8">
                <div class="section-title">表单内人员</div>
                <div class="drawer_content">
                  <div class="cc-form-person">
                    <span>抄送给表单内指定人员</span>
                  </div>
                </div>
              </div>
              <!--流程表达式-->
              <div v-if="approverConfig.settype == 9">
                <div class="section-title">流程表达式</div>
                <div class="drawer_content">
                  <a-form-item
                    field="conditionExpression"
                    :rules="[{ required: true, message: '请输入流程表达式' }]"
                    :validate-trigger="['change', 'blur']"
                    hide-label
                  >
                    <a-textarea
                      v-model="approverConfig.conditionExpression"
                      placeholder="请输入流程表达式"
                      allow-clear
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
            <div class="setting-section">
              <div class="section-title">多人审批方式</div>
              <div class="section-content">
                <a-radio-group
                  v-model="approverConfig.examineMode"
                  direction="vertical"
                >
                  <a-radio :value="1">按顺序依次审批</a-radio>
                  <a-radio :value="2">
                    会签（可同时审批，至少
                    <a-input-number
                      v-if="approverConfig.examineMode === 2"
                      v-model="approverConfig.signPct"
                      :min="1"
                      :max="100"
                      size="small"
                      style="width: 80px; margin: 0 4px"
                    />
                    % 人必须审批通过）
                  </a-radio>
                  <a-radio :value="3">或签(可同时审批，有一人通过即可)</a-radio>
                </a-radio-group>
                <a-form-item
                  v-if="approverConfig.examineMode === 2"
                  field="signPct"
                  :rules="[
                    {
                      validator: (_v, cb) => {
                        const pct = approverConfig.signPct;
                        if (
                          pct === undefined ||
                          pct === null ||
                          pct < 1 ||
                          pct > 100
                        ) {
                          cb('会签百分比需在 1-100 之间');
                        } else {
                          cb();
                        }
                      },
                    },
                  ]"
                  :validate-trigger="['change', 'blur']"
                  hide-label
                  class="sign-pct-form-item"
                />
              </div>
            </div>
            <div class="setting-section">
              <div class="section-title">审批人为空时</div>
              <div class="section-content">
                <a-radio-group
                  v-model="approverConfig.noHanderAction"
                  direction="vertical"
                >
                  <a-radio :value="1">自动通过</a-radio>
                  <a-radio :value="2">自动拒绝</a-radio>
                  <a-radio :value="3">指定人员</a-radio>
                  <a-radio :value="4">转交给审核管理员</a-radio>
                </a-radio-group>
              </div>
            </div>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" title="表单权限">
          <div class="form-permission-panel">
            <div class="permission-header">
              <span class="field-name">字段</span>
              <a-checkbox
                :model-value="allReadOnly"
                @change="(v) => toggleAll('1', v)"
              >
                只读
              </a-checkbox>
              <a-checkbox
                :model-value="allEditable"
                @change="(v) => toggleAll('2', v)"
              >
                可编辑
              </a-checkbox>
              <a-checkbox
                :model-value="allRequired"
                @change="(v) => toggleAll('3', v)"
              >
                必填
              </a-checkbox>
              <a-checkbox
                :model-value="allHidden"
                @change="(v) => toggleAll('4', v)"
              >
                隐藏
              </a-checkbox>
            </div>
            <div
              v-for="item in formFieldPermissions"
              :key="item.field"
              class="permission-row"
            >
              <span class="field-name">{{ item.title }}</span>
              <a-checkbox
                :model-value="item.permission === '1'"
                @change="() => onPermissionChange(item, '1')"
              />
              <a-checkbox
                :model-value="item.permission === '2'"
                @change="() => onPermissionChange(item, '2')"
              />
              <a-checkbox
                :model-value="item.permission === '3'"
                @change="() => onPermissionChange(item, '3')"
              />
              <a-checkbox
                :model-value="item.permission === '4'"
                @change="() => onPermissionChange(item, '4')"
              />
            </div>
            <div v-if="formFieldPermissions.length === 0" class="empty-tip">
              未配置动态表单字段
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" title="操作权限">
          <div class="permission-list">
            <div
              v-for="item in approverConfig.buttonsSetting"
              :key="item.id"
              class="permission-item"
            >
              <div class="permission-left">
                <a-avatar
                  shape="square"
                  :size="40"
                  class="permission-icon"
                  :class="getIconClass(item.id)"
                >
                  <component :is="getIcon(item.id)" />
                </a-avatar>
                <div class="permission-info">
                  <div class="permission-title">{{ item.displayName }}</div>
                  <div class="permission-desc">{{ getDesc(item.id) }}</div>
                </div>
              </div>
              <a-switch
                v-model="item.enable"
                :checked-children="'开'"
                :unchecked-children="'关'"
              />
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template #footer>
      <a-button @click="closeDrawer">取 消</a-button>
      <a-button type="primary" @click="saveApprover">确 定</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
  import { ref, watch, computed, markRaw, onMounted } from 'vue';
  import {
    IconCheckCircle,
    IconCloseCircle,
    IconArrowLeft,
    IconForward,
    IconUser,
    IconUserAdd,
  } from '@arco-design/web-vue/es/icon';
  import { sysRoleApi } from '@/api/sys/role';
  import $func from '../../utils/index';
  import { setTypes } from '../../utils/const';
  import { useStore } from '../../stores/index';

  defineProps({
    directorMaxLevel: {
      type: Number,
      default: 0,
    },
  });
  const approverConfig = ref({});
  const approverFormRef = ref(null);
  const store = useStore();
  const { setApproverConfig, setApprover } = store;
  const approverConfig1 = computed(() => store.approverConfig1);
  const approverDrawer = computed(() => store.approverDrawer);
  const formFields = computed(() => store.formFields ?? []);
  const closeDrawer = () => {
    setApprover(false);
  };

  // ---- 表单权限配置 ----
  // permission: '1'=只读 '2'=可编辑 '3'=必填 '4'=隐藏 ''=无
  /**
   * @type {import('vue').Ref<Array<{field:string,title:string,permission:string}>>}
   */
  const formFieldPermissions = ref([]);

  const allReadOnly = computed(() => {
    if (formFieldPermissions.value.length === 0) return false;
    return formFieldPermissions.value.every((i) => i.permission === '1');
  });
  const allEditable = computed(() => {
    if (formFieldPermissions.value.length === 0) return false;
    return formFieldPermissions.value.every((i) => i.permission === '2');
  });
  const allRequired = computed(() => {
    if (formFieldPermissions.value.length === 0) return false;
    return formFieldPermissions.value.every((i) => i.permission === '3');
  });
  const allHidden = computed(() => {
    if (formFieldPermissions.value.length === 0) return false;
    return formFieldPermissions.value.every((i) => i.permission === '4');
  });

  /** 同步字段列表与权限配置 */
  function syncFieldPermissions(saved) {
    const fields = formFields.value;
    const map = new Map((saved ?? []).map((i) => [i.field, i]));
    formFieldPermissions.value = fields.map((f) => {
      const old = map.get(f.field);
      return {
        field: f.field,
        title: f.title,
        permission: old?.permission ?? '1',
      };
    });
  }

  /** 权限互斥处理 */
  function onPermissionChange(item, permVal) {
    if (item.permission === permVal) {
      item.permission = '';
    } else {
      item.permission = permVal;
    }
  }

  /** 全选/全不选 */
  function toggleAll(permVal, checked) {
    formFieldPermissions.value.forEach((item) => {
      item.permission = checked ? permVal : '';
    });
  }

  const roleList = ref([]);

  const getRoleList = async () => {
    const data = await sysRoleApi.getList();
    roleList.value = data?.data ?? [];
  };

  onMounted(() => {
    getRoleList();
  });

  const nodeUserIds = ref([]);
  const nodeRoleIds = ref([]);
  const nodePostIds = ref([]);
  const nodeDeptHeadIds = ref([]);

  const visible = computed({
    get() {
      return approverDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });
  watch(formFields, () => {
    syncFieldPermissions(approverConfig.value.fieldsPermission);
  });

  watch(approverConfig1, (val) => {
    approverConfig.value = {
      ...val.value,
      examineMode: val.value.examineMode ?? 1,
      signPct: val.value.signPct ?? 100,
      noHanderAction: val.value.noHanderAction ?? 1,
      buttonsSetting: val.value.buttonsSetting ?? [
        { id: 1, displayName: '通过', enable: true },
        { id: 2, displayName: '拒绝', enable: true },
        { id: 3, displayName: '转办', enable: true },
        { id: 4, displayName: '委派', enable: true },
        { id: 5, displayName: '加签', enable: true },
        { id: 6, displayName: '退回', enable: true },
      ],
    };
    // 清除校验状态
    approverFormRef.value?.clearValidate();
    // 同步表单字段权限
    syncFieldPermissions(val.value.fieldsPermission);
    // 指定成员回显
    if (
      val.value.settype === 1 &&
      val.value.nodeUserList &&
      val.value.nodeUserList.length > 0
    ) {
      nodeUserIds.value = val.value.nodeUserList.map((item) => item.id);
    } else {
      nodeUserIds.value = [];
    }
    // 指定角色回显
    if (
      val.value.settype === 2 &&
      val.value.nodeRoleList &&
      val.value.nodeRoleList.length > 0
    ) {
      nodeRoleIds.value = val.value.nodeRoleList.map((item) => item.id);
    } else {
      nodeRoleIds.value = [];
    }
    // 指定岗位回显
    if (
      val.value.settype === 3 &&
      val.value.nodePostList &&
      val.value.nodePostList.length > 0
    ) {
      nodePostIds.value = val.value.nodePostList.map((item) => item.id);
    } else {
      nodePostIds.value = [];
    }
    // 部门负责人回显
    if (
      val.value.settype === 4 &&
      val.value.nodeDeptHeadList &&
      val.value.nodeDeptHeadList.length > 0
    ) {
      nodeDeptHeadIds.value = val.value.nodeDeptHeadList.map((item) => item.id);
    } else {
      nodeDeptHeadIds.value = [];
    }
  });

  // 人员选择器
  const handleSelect = (val) => {
    nodeUserIds.value = [];
    approverConfig.value.nodeUserList = [];
    if (val && val.length > 0) {
      val.forEach((item) => {
        approverConfig.value.nodeUserList.push({
          id: item.sysUserId,
          name: item.realName,
        });
        nodeUserIds.value.push(item.sysUserId);
      });
    }
  };
  // 角色选择器
  const handleChangeRole = (val) => {
    nodeRoleIds.value = [];
    approverConfig.value.nodeRoleList = [];
    if (val && val.length > 0) {
      val.forEach((roleId) => {
        const role = roleList.value.find((item) => item.sysRoleId === roleId);
        if (role) {
          approverConfig.value.nodeRoleList.push({
            id: role.sysRoleId,
            name: role.roleName,
          });
          nodeRoleIds.value.push(role.sysRoleId);
        }
      });
    }
  };
  // 岗位选择器
  const handleChangePost = (val) => {
    nodePostIds.value = [];
    approverConfig.value.nodePostList = [];
    if (val && val.length > 0) {
      val.forEach((item) => {
        approverConfig.value.nodePostList.push({
          id: item.sysPostId,
          name: item.postName,
        });
        nodePostIds.value.push(item.sysPostId);
      });
    }
  };
  // 部门负责人选择器
  const handleChangeDept = (val) => {
    nodeDeptHeadIds.value = [];
    approverConfig.value.nodeDeptHeadList = [];

    if (val && val.length > 0) {
      val.forEach((item) => {
        approverConfig.value.nodeDeptHeadList.push({
          id: item.sysDeptId,
          name: item.deptName,
        });
        nodeDeptHeadIds.value.push(item.sysDeptId);
      });
    }
  };
  const changeType = () => {
    approverConfig.value.nodeUserList = [];
    approverConfig.value.examineMode = 1;
    approverConfig.value.signPct = 100;
    approverConfig.value.noHanderAction = 1;
    // 切换类型时清空所有选择器数据
    nodeUserIds.value = [];
    nodeRoleIds.value = [];
    nodePostIds.value = [];
    nodeDeptHeadIds.value = [];
    approverConfig.value.candidateParam = undefined;
    approverConfig.value.conditionExpression = '';
    // 清除校验状态
    approverFormRef.value?.clearValidate();
  };

  const saveApprover = async () => {
    // 先校验表单（校验基于 nodeUserIds/nodeRoleIds 等实际数据）
    if (approverFormRef.value) {
      const errors = await approverFormRef.value.validate();
      if (errors) return;
    }

    // 校验通过后，同步 candidateParam
    const { settype } = approverConfig.value;
    if (settype === 1) {
      approverConfig.value.candidateParam = nodeUserIds.value;
    } else if (settype === 2) {
      approverConfig.value.candidateParam = [...nodeRoleIds.value];
    } else if (settype === 3) {
      approverConfig.value.candidateParam = [...nodePostIds.value];
    } else if (settype === 4) {
      approverConfig.value.candidateParam = [...nodeDeptHeadIds.value];
    }

    // 保存表单字段权限
    approverConfig.value.fieldsPermission = formFieldPermissions.value.map(
      (i) => ({
        field: i.field,
        title: i.title,
        permission: i.permission,
      }),
    );
    approverConfig.value.error = $func.isApproverNodeError(
      approverConfig.value,
    );
    setApproverConfig({
      value: approverConfig.value,
      flag: true,
      id: approverConfig1.value.id,
    });
    closeDrawer();
  };
  const getIcon = (id) => {
    const icons = {
      1: markRaw(IconCheckCircle),
      2: markRaw(IconCloseCircle),
      3: markRaw(IconForward),
      4: markRaw(IconUser),
      5: markRaw(IconUserAdd),
      6: markRaw(IconArrowLeft),
    };
    return icons[id];
  };
  const getIconClass = (id) => {
    const classes = {
      1: 'icon-pass',
      2: 'icon-reject',
      3: 'icon-transfer',
      4: 'icon-delegate',
      5: 'icon-add-sign',
      6: 'icon-return',
    };
    return classes[id];
  };
  const getDesc = (id) => {
    const descs = {
      1: '审批通过，流转到下一个节点',
      2: '当拒绝任务时，当前任务被终止，并结束整个流程',
      3: '将当前任务移交给其他人处理，以便他们继续执行所需的操作',
      4: '将当前任务暂时交由他人处理，待其完成后再交回自己处理',
      5: '在当前任务上额外添加新人员，以处理相关事项或提供必要的审批或意见',
      6: '若审批内容存在问题，当前任务将中止并回退至特定历史任务节点',
    };
    return descs[id];
  };
</script>

<style lang="less">
  .set_promoter {
    .demo-drawer__content {
      padding: 0;
    }

    .approver-panel {
      padding: 4px 0;
    }

    .setting-section {
      margin-bottom: 16px;
      padding-bottom: 14px;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
    }

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: #1d2129;
      margin-bottom: 10px;
      line-height: 20px;
    }

    .section-content {
      padding-left: 4px;
    }

    .drawer_content {
      margin-top: 8px;
    }
    .cc-self-select,
    .cc-self,
    .cc-direct-superior,
    .cc-form-person {
      padding: 12px;
      background-color: #f7f8fa;
      border-radius: 4px;
      font-size: 14px;
      color: #4e5969;
    }
    .approver_content {
      padding-bottom: 8px;
    }

    .approver_self_select,
    .approver_content {
      .arco-btn {
        margin-bottom: 10px;
      }
    }

    .approver_content,
    .approver_some,
    .approver_self_select {
      .radio-group-flex {
        width: 100%;

        .acro-radio {
          flex: 1;
          text-align: center;
        }
      }
    }

    .section-content {
      .arco-radio-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .arco-radio {
        width: 100%;
        margin-bottom: 0;
        height: auto;
        padding: 6px 10px;
        border-radius: 4px;
        transition: all 0.2s;
        line-height: 20px;

        &:hover {
          background-color: #f7f8fa;
        }
      }
    }

    .approver_manager p {
      line-height: 24px;
      margin: 0;
    }

    .approver_manager select {
      width: 100%;
      max-width: 420px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e5e6eb;
      padding: 0 12px;
      font-size: 14px;
      color: #1d2129;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #165dff;
      }

      &:focus {
        outline: none;
        border-color: #165dff;
        box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
      }
    }

    .approver_manager p.tip {
      margin: 8px 0 16px 0;
      font-size: 12px;
      line-height: 18px;
      color: #ff7d00;
    }

    .approver_self {
      padding: 24px 20px;
    }

    .approver_self_select,
    .approver_manager,
    .approver_content,
    .approver_some {
      padding: 16px 20px 0;
    }

    .approver_manager p:first-of-type,
    .approver_some p {
      line-height: 22px;
      font-size: 14px;
      margin-bottom: 12px;
      color: #4e5969;
    }

    .approver_self_select h3 {
      margin: 4px 0 16px;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      color: #1d2129;
    }

    // 优化输入框样式
    .section-content {
      .arco-input-number {
        border-radius: 4px;

        .arco-input {
          text-align: center;
        }
      }
    }

    // 优化抽屉底部按钮
    .arco-drawer-footer {
      padding: 16px 20px;
      border-top: 1px solid #f0f0f0;

      .arco-btn {
        min-width: 80px;
        height: 32px;
        border-radius: 4px;
        font-size: 14px;

        &:first-child {
          margin-right: 12px;
        }
      }
    }

    // 优化 Tab 样式
    .arco-tabs {
      .arco-tabs-header {
        padding: 0 20px;
        border-bottom: 1px solid #f0f0f0;
      }

      .arco-tabs-tab {
        padding: 12px 16px;
        font-size: 14px;

        &.arco-tabs-tab-active {
          font-weight: 500;
        }
      }

      .arco-tabs-content {
        padding: 10px;
      }
    }

    .permission-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .permission-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }
    }

    .permission-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .permission-icon {
      font-size: 20px;

      &.icon-pass {
        background-color: #e8f5ff;
        color: #165dff;
      }

      &.icon-reject {
        background-color: #fff2f0;
        color: #f53f3f;
      }

      &.icon-transfer {
        background-color: #f0f5ff;
        color: #165dff;
      }

      &.icon-delegate {
        background-color: #fff7e6;
        color: #ff7d00;
      }

      &.icon-add-sign {
        background-color: #f6ffed;
        color: #52c41a;
      }

      &.icon-return {
        background-color: #e8f5ff;
        color: #165dff;
      }
    }

    .permission-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .permission-title {
      font-size: 14px;
      font-weight: 500;
      color: #1d2129;
      line-height: 20px;
    }

    .permission-desc {
      font-size: 12px;
      color: #86909c;
      line-height: 18px;
    }

    // 表单权限面板
    .form-permission-panel {
      padding: 0 20px;
    }

    .permission-header,
    .permission-row {
      display: grid;
      grid-template-columns: 1fr 80px 80px 80px 80px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      color: #1d2129;

      .field-name {
        font-weight: 500;
      }
    }

    .permission-header {
      font-weight: 500;
      border-bottom: 1px solid #e5e6eb;

      .arco-checkbox {
        font-weight: 500;
      }
    }

    .permission-row {
      color: #4e5969;

      &:last-child {
        border-bottom: none;
      }
    }

    .empty-tip {
      padding: 40px 0;
      text-align: center;
      color: #86909c;
      font-size: 14px;
    }
  }
</style>
