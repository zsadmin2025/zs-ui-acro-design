<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    :width="appStore.device === 'mobile' ? '90%' : '50%'"
    title-align="start"
    :draggable="true"
    :mask-closable="false"
    @cancel="menuAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysMenuId ? '新增菜单' : '编辑菜单' }}
      </h4>
    </template>
    <a-form
      ref="formRef"
      :model="form"
      :rules="menuAddOrEditStore.rules"
      auto-label-width
    >
      <a-row :gutter="24">
        <!-- 菜单类型 -->
        <a-col :span="24">
          <a-form-item label="菜单类型" field="type">
            <a-radio-group v-model="form.type" type="button">
              <a-radio :value="1">目录</a-radio>
              <a-radio :value="2">菜单</a-radio>
              <a-radio :value="3">按钮</a-radio>
              <a-radio :value="4">内链</a-radio>
              <a-radio :value="5">外链</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <!-- 上级菜单 -->
        <a-col :span="24">
          <a-form-item label="上级菜单" field="pid">
            <a-tree-select
              v-model="form.pid"
              :data="formattedList"
              placeholder="请选择上级菜单"
              :allow-search="true"
              :allow-clear="true"
            />
          </a-form-item>
        </a-col>

        <!-- 菜单名称 / 按钮名称 -->
        <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="12">
          <a-form-item :label="titleLabel" field="title">
            <a-input v-model="form.title" :placeholder="titlePlaceholder" />
          </a-form-item>
        </a-col>

        <!-- 图标 + 路由地址（按钮类型除外） -->
        <template v-if="form.type !== 3">
          <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="12">
            <a-form-item :label="iconLabel">
              <zs-selected-icon v-model="form.icon" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="12">
            <a-form-item label="路由地址" field="path">
              <a-input v-model="form.path" placeholder="请输入路由路径地址" />
            </a-form-item>
          </a-col>
        </template>

        <!-- 权限标识（按钮专用） -->
        <template v-if="form.type === 3">
          <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="12">
            <a-form-item label="权限标识" field="permissions">
              <a-input
                v-model="form.permissions"
                placeholder="多个用逗号隔开，如: sys:menu:save,sys:menu:list"
              />
            </a-form-item>
          </a-col>
        </template>

        <!-- 组件路径（菜单、内链） -->
        <template v-if="form.type === 2 || form.type === 4">
          <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="12">
            <a-form-item label="组件路径" field="component">
              <a-input
                v-model="form.component"
                placeholder="前端组件路径,如: /sys/role/index"
              />
            </a-form-item>
          </a-col>
        </template>

        <!-- 排序号 -->
        <a-col :span="12">
          <a-form-item label="排序号" field="sort">
            <a-input-number v-model="form.sort" :min="0" mode="button" />
          </a-form-item>
        </a-col>

        <!-- 是否缓存（目录、菜单） -->
        <template v-if="form.type === 1 || form.type === 2">
          <a-col :span="24">
            <a-form-item label="是否缓存" field="ignoreCache">
              <a-switch
                v-model="form.ignoreCache"
                :checked-value="false"
                :unchecked-value="true"
                type="round"
              >
                <template #checked> 是 </template>
                <template #unchecked> 否 </template>
              </a-switch>
            </a-form-item>
          </a-col>
        </template>

        <!-- 隐藏菜单（仅菜单） -->
        <template v-if="form.type === 2">
          <a-col :span="24">
            <a-form-item label="隐藏菜单" field="hideInMenu">
              <a-switch
                v-model="form.hideInMenu"
                :checked-value="true"
                :unchecked-value="false"
                type="round"
              >
                <template #checked> 是 </template>
                <template #unchecked> 否 </template>
              </a-switch>
            </a-form-item>
          </a-col>
        </template>

        <!-- 是否显示 -->
        <a-col :span="24">
          <a-form-item label="是否显示" field="visible">
            <a-switch
              v-model="form.visible"
              :checked-value="1"
              :unchecked-value="0"
              type="round"
            >
              <template #checked> 是 </template>
              <template #unchecked> 否 </template>
            </a-switch>
          </a-form-item>
        </a-col>

        <!-- 菜单状态 -->
        <a-col :span="24">
          <a-form-item label="菜单状态" field="status">
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
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="menuAddOrEditStore.close">取消</a-button>
        <a-button type="primary" @click="menuAddOrEditStore.submit(emits)">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useMenuAddOrEditStore } from '@/store/modules/sys/menu/menuAddOrEditStore';
  import { useAppStore } from '@/store';

  const appStore = useAppStore();

  const menuAddOrEditStore = useMenuAddOrEditStore();
  const { dialogFormVisible, formRef, form, list } =
    storeToRefs(menuAddOrEditStore);

  const convertList = (treeData: any) => {
    return treeData.map((item: any) => ({
      key: item.sysMenuId,
      title: item.title,
      children: item.children ? convertList(item.children) : null,
    }));
  };

  const formattedList = computed(() => convertList(list.value));

  /** 菜单名称的标签随类型变化：按钮 vs 其他 */
  const titleLabel = computed(() =>
    form.value.type === 3 ? '按钮名称' : '菜单名称',
  );
  const titlePlaceholder = computed(() =>
    form.value.type === 3 ? '请输入按钮名称' : '请输入菜单名称',
  );
  /** 图标标签：菜单类型显示"菜单图标"，其他显示"图标" */
  const iconLabel = computed(() =>
    form.value.type === 2 ? '菜单图标' : '图标',
  );

  const emits = defineEmits(['refresh']);
  defineExpose({
    form,
    init: menuAddOrEditStore.init,
  });
</script>
