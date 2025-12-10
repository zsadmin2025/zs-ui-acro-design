<template>
  <a-card :bordered="false">
    <a-space :size="54" direction="vertical" fill align="center">
      <ZsAvatar :avatar-url="avatar" @change-success="handleChangeSuccess" />
      <a-descriptions :data="renderData" :column="1">
        <template #label="{ label }">{{ $t(label) }} :</template>
        <template #value="{ value, data }">
          <div v-if="data.label === '在职状态'">
            <a-tag v-if="value === 1" color="green" size="small"> 在职 </a-tag>
            <a-tag v-else-if="value === 0" color="red" size="small">
              离职
            </a-tag>
          </div>
          <div v-else>{{ value }}</div>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
  import ZsAvatar from '@/components/zs-avatar/index.vue';

  const userStore = useUserStore();
  const user = computed(() => userStore.user);
  const avatar = computed(() => userStore.user.avatar);

  const renderData = computed<DescData[]>(() => [
    {
      label: '真实姓名',
      value: user.value.realName ?? '--',
    },
    {
      label: '手机号',
      value: user.value.phone ?? '--',
    },
    {
      label: '邮箱',
      value: user.value.email ?? '--',
    },
    {
      label: '部门',
      value: user.value.deptName ?? '--',
    },
    {
      label: '职务',
      value: user.value.postName ?? '--',
    },
    {
      label: '在职状态',
      value: user.value.status ?? '--',
    },
    {
      label: '创建时间',
      value: user.value.createTime ?? '--',
    },
  ]);

  const handleChangeSuccess = (url: string) => {
    // 更新用户头像
    userStore.updateAvatar(url);
  };

  onBeforeMount(() => {
    userStore.getUserInfo();
  });
</script>

<style scoped lang="less">
  .arco-card {
    padding: 14px 0 4px 4px;
    border-radius: 4px;
  }
</style>
