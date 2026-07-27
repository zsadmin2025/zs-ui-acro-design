<template>
  <a-drawer
    v-model:visible="visible"
    title="抄送人设置"
    class="set_copyer"
    :width="550"
  >
    <div class="demo-drawer__content">
      <a-form ref="copyerFormRef" :model="copyerConfig" class="copyer-panel">
        <div class="setting-section">
          <div class="section-title">抄送人设置</div>
          <div class="drawer_content">
            <div class="copyer_content">
              <a-radio-group
                v-model="copyerConfig.settype"
                @change="changeType"
              >
                <a-grid :cols="3" :col-gap="24" :row-gap="16">
                  <a-grid-item
                    v-for="{ value, label } in copyerSetTypes"
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
          <div v-if="copyerConfig.settype == 1">
            <div class="section-title">指定成员</div>
            <div class="drawer_content">
              <a-form-item
                field="nodeUserList"
                :rules="[
                  {
                    validator: (v, cb) =>
                      nodeUserIds.length > 0
                        ? cb()
                        : cb('请选择至少一名抄送人'),
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
          <div v-if="copyerConfig.settype == 2">
            <div class="section-title">指定角色</div>
            <div class="drawer_content">
              <a-form-item
                field="nodeRoleList"
                :rules="[
                  {
                    validator: (v, cb) =>
                      nodeRoleIds.length > 0 ? cb() : cb('请选择至少一个角色'),
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
          <div v-if="copyerConfig.settype == 3">
            <div class="section-title">指定岗位</div>
            <div class="drawer_content">
              <a-form-item
                field="nodePostList"
                :rules="[
                  {
                    validator: (v, cb) =>
                      nodePostIds.length > 0 ? cb() : cb('请选择至少一个岗位'),
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
          <div v-if="copyerConfig.settype == 4">
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
          <div v-if="copyerConfig.settype == 5">
            <div class="section-title">发起人自选</div>
            <div class="drawer_content">
              <div class="cc-self-select">
                <span>发起时，由发起人选择抄送人</span>
              </div>
            </div>
          </div>
          <!--发起人自己-->
          <div v-if="copyerConfig.settype == 6">
            <div class="section-title">发起人自己</div>
            <div class="drawer_content">
              <div class="cc-self">
                <span>抄送给发起人自己</span>
              </div>
            </div>
          </div>
          <!--直属上级-->
          <div v-if="copyerConfig.settype == 7">
            <div class="section-title">直属上级</div>
            <div class="drawer_content">
              <div class="cc-direct-superior">
                <span>抄送给发起人的直属上级</span>
              </div>
            </div>
          </div>
          <!--表单内人员-->
          <div v-if="copyerConfig.settype == 8">
            <div class="section-title">表单内人员</div>
            <div class="drawer_content">
              <div class="cc-form-person">
                <span>抄送给表单内指定人员</span>
              </div>
            </div>
          </div>
          <!--流程表达式-->
          <div v-if="copyerConfig.settype == 9">
            <div class="section-title">流程表达式</div>
            <div class="drawer_content">
              <a-form-item
                field="conditionExpression"
                :rules="[{ required: true, message: '请输入流程表达式' }]"
                :validate-trigger="['change', 'blur']"
                hide-label
              >
                <a-textarea
                  v-model="copyerConfig.conditionExpression"
                  placeholder="请输入流程表达式"
                  allow-clear
                />
              </a-form-item>
            </div>
          </div>
        </div>
      </a-form>
    </div>
    <template #footer>
      <a-button @click="closeDrawer">取 消</a-button>
      <a-button type="primary" @click="saveCopyer">确 定</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import { sysRoleApi } from '@/api/sys/role';
  import $func from '../../utils/index';
  import { setTypes } from '../../utils/const';
  import { useStore } from '../../stores/index';

  const copyerSetTypes = setTypes;

  const copyerConfig = ref({});
  const copyerFormRef = ref(null);
  const ccSelfSelectFlag = ref([]);
  const nodeUserIds = ref([]);
  const nodeRoleIds = ref([]);
  const nodePostIds = ref([]);
  const nodeDeptHeadIds = ref([]);
  const roleList = ref([]);
  const store = useStore();
  const { setCopyerConfig, setCopyer } = store;
  const copyerDrawer = computed(() => store.copyerDrawer);
  const copyerConfig1 = computed(() => store.copyerConfig1);
  const closeDrawer = () => {
    setCopyer(false);
  };
  const visible = computed({
    get() {
      return copyerDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  const getRoleList = async () => {
    const data = await sysRoleApi.getList();
    roleList.value = data?.data ?? [];
  };

  onMounted(() => {
    getRoleList();
  });

  watch(copyerConfig1, (val) => {
    const configValue = val.value || {};
    copyerConfig.value = {
      ...configValue,
      settype: configValue.settype ?? 1,
    };
    // 清除校验状态
    copyerFormRef.value?.clearValidate();
    ccSelfSelectFlag.value =
      copyerConfig.value.ccSelfSelectFlag === 0
        ? []
        : [copyerConfig.value.ccSelfSelectFlag];
    // 指定成员回显
    if (
      configValue.settype === 1 &&
      configValue.nodeUserList &&
      configValue.nodeUserList.length > 0
    ) {
      nodeUserIds.value = configValue.nodeUserList.map((item) => item.id);
    } else {
      nodeUserIds.value = [];
    }
    // 指定角色回显
    if (
      configValue.settype === 2 &&
      configValue.nodeRoleList &&
      configValue.nodeRoleList.length > 0
    ) {
      nodeRoleIds.value = configValue.nodeRoleList.map((item) => item.id);
    } else {
      nodeRoleIds.value = [];
    }
    // 指定岗位回显
    if (
      configValue.settype === 3 &&
      configValue.nodePostList &&
      configValue.nodePostList.length > 0
    ) {
      nodePostIds.value = configValue.nodePostList.map((item) => item.id);
    } else {
      nodePostIds.value = [];
    }
    // 部门负责人回显
    if (
      configValue.settype === 4 &&
      configValue.nodeDeptHeadList &&
      configValue.nodeDeptHeadList.length > 0
    ) {
      nodeDeptHeadIds.value = configValue.nodeDeptHeadList.map(
        (item) => item.id,
      );
    } else {
      nodeDeptHeadIds.value = [];
    }
  });

  const changeType = () => {
    copyerConfig.value.nodeUserList = [];
    copyerConfig.value.nodeRoleList = [];
    copyerConfig.value.nodePostList = [];
    copyerConfig.value.nodeDeptHeadList = [];
    copyerConfig.value.candidateParam = undefined;
    copyerConfig.value.conditionExpression = undefined;
    nodeUserIds.value = [];
    nodeRoleIds.value = [];
    nodePostIds.value = [];
    nodeDeptHeadIds.value = [];
    // 清除校验状态
    copyerFormRef.value?.clearValidate();
  };

  // 人员选择器
  const handleSelect = (val) => {
    nodeUserIds.value = [];
    copyerConfig.value.nodeUserList = [];
    if (val && val.length > 0) {
      val.forEach((item) => {
        copyerConfig.value.nodeUserList.push({
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
    copyerConfig.value.nodeRoleList = [];
    if (val && val.length > 0) {
      val.forEach((roleId) => {
        const role = roleList.value.find((item) => item.sysRoleId === roleId);
        if (role) {
          copyerConfig.value.nodeRoleList.push({
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
    copyerConfig.value.nodePostList = [];
    if (val && val.length > 0) {
      val.forEach((item) => {
        copyerConfig.value.nodePostList.push({
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
    copyerConfig.value.nodeDeptHeadList = [];
    if (val && val.length > 0) {
      val.forEach((item) => {
        copyerConfig.value.nodeDeptHeadList.push({
          id: item.sysDeptId,
          name: item.deptName,
        });
        nodeDeptHeadIds.value.push(item.sysDeptId);
      });
    }
  };

  const saveCopyer = async () => {
    // 先校验表单（校验基于 nodeUserIds/nodeRoleIds 等实际数据）
    if (copyerFormRef.value) {
      const errors = await copyerFormRef.value.validate();
      if (errors) return;
    }

    // 校验通过后，同步 candidateParam
    const { settype } = copyerConfig.value;
    if (settype === 1) {
      copyerConfig.value.candidateParam = nodeUserIds.value;
    } else if (settype === 2) {
      copyerConfig.value.candidateParam = [...nodeRoleIds.value];
    } else if (settype === 3) {
      copyerConfig.value.candidateParam = [...nodePostIds.value];
    } else if (settype === 4) {
      copyerConfig.value.candidateParam = [...nodeDeptHeadIds.value];
    }

    copyerConfig.value.ccSelfSelectFlag =
      ccSelfSelectFlag.value.length === 0 ? 0 : 1;
    copyerConfig.value.error = $func.isCopyerNodeError(copyerConfig.value);
    setCopyerConfig({
      value: copyerConfig.value,
      flag: true,
      id: copyerConfig1.value.id,
    });
    closeDrawer();
  };
</script>

<style lang="less">
  .set_copyer {
    .demo-drawer__content {
      padding: 0;
    }

    .copyer-panel {
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

    .copyer_content {
      padding-bottom: 8px;
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
  }
</style>
