<template>
  <a-space wrap>
    <a-tag
      v-for="item in selectedUser"
      :key="item.sysUserId"
      type="primary"
      effect="light"
      closable
      :disable-transitions="false"
      @close="useUserSelectStore.handleRemove(item)"
    >
      <template #icon>
        <icon-user />
      </template>
      {{ item.realName }}
    </a-tag>
    <a-button type="primary" size="mini" shape="circle" @click="onAddClick">
      <icon-plus />
    </a-button>
  </a-space>
  <a-modal
    v-model:visible="dialogVisible"
    title="选择用户"
    title-align="start"
    width="1180px"
    :draggable="true"
    body-class="modal-body-style"
    body-style="height: 70vh;"
  >
    <div class="user-select">
      <a-row justify="space-between" :gutter="20">
        <a-col :span="6">
          <a-tabs v-model="activeName">
            <a-tab-pane key="first" title="部门">
              <ZsDept @node-click="useUserSelectStore.handleNodeClick" />
            </a-tab-pane>
            <a-tab-pane key="second" title="岗位">
              <a-tree
                :data="postList"
                :field-names="postProps"
                :show-line="true"
                @select="useUserSelectStore.handlePostNodeClick"
              >
                <template #default="{ node }">
                  <ZsIcon icon="post-colour" style="margin-right: 8px" />
                  <span>{{ node.label }}</span>
                </template>
              </a-tree>
            </a-tab-pane>
            <a-tab-pane key="third" title="角色">
              <a-tree
                :data="roleData"
                :field-names="roleProps"
                :show-line="true"
                @select="useUserSelectStore.handleRoleNodeClick"
              >
                <template #default="{ node }">
                  <ZsIcon icon="role-colour" style="margin-right: 8px" />
                  <span>{{ node.label }}</span>
                </template>
              </a-tree>
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col :span="12">
          <UserList :multiple="multiple" />
        </a-col>
        <a-col :span="6">
          <UserSelected />
        </a-col>
      </a-row>
    </div>
    <template #footer>
      <a-space>
        <a-button @click="dialogVisible = false">取消</a-button>
        <a-button type="primary" @click="handleConfirm"> 确认 </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { usePostStore } from '@/store/modules/sys/position/postStore';
  import { useRoleStore } from '@/store/modules/sys/role/roleStore';
  import { userSelectStore } from '@/store/modules/sys/user/userSelectStore';
  import UserSelected from './components/user-selected.vue';
  import UserList from './components/user-list.vue';

  const useUserSelectStore = userSelectStore();
  const { tableAddUserData, selectedUser } = storeToRefs(useUserSelectStore);

  // 岗位
  const postStore = usePostStore();
  const { postList } = storeToRefs(postStore);

  // 角色
  const roleStore = useRoleStore();
  const { roleData } = storeToRefs(roleStore);

  const dialogVisible = ref(false);
  const activeName = ref('first');

  const postProps = {
    children: 'children',
    title: 'postName',
    value: 'sysPostId',
  };

  const roleProps = {
    children: 'children',
    title: 'roleName',
    key: 'sysRoleId',
  };

  const props = defineProps({
    modelValue: {
      type: [Array, String],
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      useUserSelectStore.initSelectedData(newValue);
    },
    { deep: true },
  );

  const emits = defineEmits(['update:modelValue', 'onSelect']);

  const handleConfirm = () => {
    dialogVisible.value = false;
    selectedUser.value = [...tableAddUserData.value];
    emits(
      'update:modelValue',
      props.multiple
        ? selectedUser.value.map((item: any) => item.sysUserId)
        : selectedUser.value[0]?.sysUserId,
    );
    emits(
      'onSelect',
      props.multiple ? selectedUser.value : selectedUser.value[0],
    );
  };

  const onAddClick = () => {
    dialogVisible.value = true;
  };
  onMounted(() => {
    postStore.loadPostList();
    roleStore.loadRoleList();
    useUserSelectStore.queryData();
  });
</script>

<style scoped lang="less">
  .append-button {
    background-color: #409eff !important;
    color: #fff !important;
  }

  .user-select {
    height: 100%;
    display: flex;
    justify-content: space-between;

    :deep(.arco-tabs) {
      height: 100%;
      border: 1px solid #ebeef5;

      .arco-tabs-nav {
        height: 40px;
        padding: 0 10px;
      }
      .arco-tabs-content {
        height: calc(100% - 55px);
        overflow: auto;
        padding: 10px;

        .zs-tab-pane {
          height: 100%;
        }
      }
    }

    .arco-row {
      width: 100%;

      .arco-col {
        height: 100%;
        .user-select-left {
          height: 100%;

          .arco-tree {
            padding: 4px;
          }
        }

        .arco-scrollbar {
          width: 100%;
        }
      }
    }
  }
</style>
