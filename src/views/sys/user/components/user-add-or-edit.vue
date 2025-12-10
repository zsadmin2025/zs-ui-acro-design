<template>
  <a-drawer
    :visible="dialogFormVisible"
    :title="titleType"
    width="40%"
    @cancel="userAddOrEditStore.close"
    @ok="userAddOrEditStore.submit(emits)"
  >
    <zs-scetion title="基本信息">
      <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="头像" field="avatar">
              <ZsAvatar
                :avatar-url="avatar"
                shape="square"
                @change-success="handleChangeSuccess"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="账号" field="username">
              <a-input v-model="form.username" placeholder="请输入账号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="密码"
              :field="!form.sysUserId ? 'password' : ''"
            >
              <a-input-password
                v-model="form.password"
                placeholder="请输入密码"
                :disabled="!form.sysUserId ? false : true"
                :default-visibility="true"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="真实姓名" field="realName">
              <a-input v-model="form.realName" placeholder="请输入真实姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别" field="sex">
              <a-select v-model="form.sex">
                <a-option :value="0" label="男"></a-option>
                <a-option :value="1" label="女"></a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号" field="phone">
              <a-input
                v-model="form.phone"
                placeholder="请输入手机号"
                minlength="11"
                maxlength="11"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱" field="email">
              <a-input v-model="form.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="部门" field="sysDeptId">
              <a-tree-select
                v-model="form.sysDeptId"
                :data="deptTree"
                :field-names="{
                  key: 'id',
                  title: 'deptName',
                  children: 'children',
                }"
                placeholder="请选择部门"
                :allow-search="true"
                :allow-clear="true"
                @change="userAddOrEditStore.handleDeptChange"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="岗位" field="sysPostId">
              <a-select
                v-model="form.sysPostId"
                placeholder="请选择岗位"
                :allow-clear="true"
              >
                <a-option
                  v-for="item in deptPostData"
                  :key="item.sysPostId"
                  :value="item.sysPostId"
                  :label="item.postName"
                >
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="员工编号" field="employeeNumber">
              <a-input
                v-model="form.employeeNumber"
                placeholder="请输入员工编号"
                minlength="1"
                maxlength="20"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色名称" field="roleIdList">
              <a-select
                v-model="form.roleIdList"
                placeholder="请选择角色"
                :allow-clear="true"
                :multiple="true"
                :max-tag-count="2"
              >
                <a-option
                  v-for="item in roleData"
                  :key="item.sysRoleId"
                  :value="item.sysRoleId"
                  :label="item.roleName"
                >
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="状态" field="status">
          <a-switch
            v-model="form.status"
            :checked-value="1"
            :unchecked-value="0"
            type="round"
          >
            <template #checked> 启用 </template>
            <template #unchecked> 禁用 </template>
          </a-switch>
        </a-form-item>
      </a-form>
    </zs-scetion>

    <template #footer>
      <a-space>
        <a-button @click="userAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="userAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useUserAddOrEditStore } from '@/store/modules/sys/user/userAddOrEditStore';

  const userAddOrEditStore = useUserAddOrEditStore();
  const {
    dialogFormVisible,
    loading,
    deptTree,
    roleData,
    form,
    rules,
    deptPostData,
    formRef,
  } = storeToRefs(userAddOrEditStore);

  const avatar = computed(() => form.value?.avatar ?? '');

  const titleType = ref('新增用户');
  const changeTitle = (type: string) => {
    if (type === 'add') {
      titleType.value = '新增用户';
    } else if (type === 'detail') {
      titleType.value = '基本信息';
    } else if (type === 'edit') {
      titleType.value = '编辑用户';
    }
  };

  const handleChangeSuccess = (url: string) => {
    // 更新用户头像
    form.value.avatar = url;
  };

  const emits = defineEmits(['refresh']);

  onMounted(async () => {
    await userAddOrEditStore.getDeptList();
    await userAddOrEditStore.getRoleList();
  });
  defineExpose({
    init: userAddOrEditStore.init,
    form,
    changeTitle,
  });
</script>

<style scoped>
  .arco-btn-group {
    display: flex;
    justify-content: flex-end;
  }
</style>
