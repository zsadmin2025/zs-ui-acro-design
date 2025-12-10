<template>
  <a-drawer
    :visible="menuPermission"
    width="50%"
    title="功能权限"
    unmount-on-close
    @cancel="roleAddOrEditStore.closeMenuPermission"
    @ok="roleAddOrEditStore.submitMenuPermission"
  >
    <a-tabs default-active-key="1" type="line">
      <a-tab-pane key="1" title="功能权限">
        <a-button-group style="margin-bottom: 20px">
          <a-button type="primary" @click="toggleChecked">
            {{ checkedKeys?.length ? '取消选中' : '全部选中' }}
          </a-button>
          <a-button type="primary" @click="toggleExpanded">
            {{ expandedKeys?.length ? '全部折叠' : '全部展开' }}
          </a-button>
        </a-button-group>
        <a-tree
          ref="treeRef"
          v-model:checked-keys="form.menuList"
          v-model:selected-keys="selectedKeys"
          v-model:expanded-keys="expandedKeys"
          block-node
          :checkable="true"
          :check-strictly="false"
          :data="menuData"
        >
        </a-tree>
      </a-tab-pane>
      <a-tab-pane key="2" title="数据范围">
        <a-form
          ref="dataScopeFormRef"
          auto-label-width
          :model="form"
          :rules="rules"
        >
          <a-form-item label="数据范围" field="dataScope">
            <a-select v-model="form.dataScope">
              <a-option label="全部数据权限" :value="1"></a-option>
              <a-option label="自定义数据权限" :value="2"></a-option>
              <a-option label="本部门数据权限" :value="3"></a-option>
              <a-option label="本部门及以下数据权限" :value="4"></a-option>
              <a-option label="仅本人数据权限" :value="5"></a-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-if="form.dataScope == 2"
            label="数据权限"
            field="deptList"
          >
            <a-tree-select
              ref="deptRef"
              v-model="form.deptList"
              :data="deptTree"
              :field-names="{
                key: 'id',
                title: 'deptName',
                children: 'children',
              }"
              placeholder="请选择部门"
              :max-tag-count="5"
              :tree-checkable="true"
              :allow-search="true"
              :allow-clear="true"
            />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useRoleAddOrEditStore } from '@/store/modules/sys/role/roleAddOrEditStore';

  const roleAddOrEditStore = useRoleAddOrEditStore();
  const { menuPermission, form, menuData, deptTree, dataScopeFormRef } =
    storeToRefs(roleAddOrEditStore);

  const rules = {
    deptList: [
      { required: true, message: '请选择数据权限', trigger: 'change' },
    ],
  };

  const selectedKeys = ref([]);
  const checkedKeys = ref<string[]>([]);
  const expandedKeys = ref<string[]>([]);

  const toggleChecked = () => {
    if (checkedKeys.value.length) {
      checkedKeys.value = [];
      form.value.menuList = [];
    } else {
      const allKeys: any[] = [];
      const traverse = (nodes: any[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.key);
          if (node.children) {
            traverse(node.children);
          }
        });
      };
      traverse(menuData.value);
      checkedKeys.value = allKeys;
      form.value.menuList = allKeys;
    }
  };

  const toggleExpanded = () => {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      const allKeys: any[] = [];
      const traverse = (nodes: any[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.key);
          if (node.children) {
            traverse(node.children);
          }
        });
      };
      traverse(menuData.value);
      expandedKeys.value = allKeys;
    }
  };

  defineExpose({
    initMenuPermission: roleAddOrEditStore.initMenuPermission,
    form,
  });
</script>
