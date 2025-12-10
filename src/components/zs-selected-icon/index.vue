<template>
  <div class="icon-selected-container">
    <a-popover
      v-model:popup-visible="visible"
      position="top"
      trigger="click"
      content-class="custom-popover"
    >
      <a-input
        v-model="searchText"
        placeholder="请选择图标"
        search-button
        style="width: 100%"
        readonly
        :allow-clear="true"
      >
        <template #prefix>
          <ZsIcon
            :icon="searchText == '' ? 'icon-outlined-file-text' : searchText"
          />
        </template>
      </a-input>
      <template #content>
        <div class="selected-icon-list-container">
          <a-input-search
            v-model="filterText"
            placeholder="筛选图标"
            search-button
            style="width: 100%"
            class="selected-icon-list-search-button"
          >
          </a-input-search>
          <a-scrollbar
            type="track"
            style="height: 328px; overflow: auto"
            outer-class="selected-icon-list-scrollbar"
          >
            <ul class="selected-icon-list">
              <li
                v-for="(item, index) in filteredIcons"
                :key="index"
                class="selected-icon-item"
                @click="selectIcon(item)"
              >
                <div class="selected-icon-item-component">
                  <ZsIcon :icon="item" size="20" />
                </div>
              </li>
            </ul>
          </a-scrollbar>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script lang="ts" setup>
  // eslint-disable-next-line import/no-unresolved
  import ids from 'virtual:svg-icons-names';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });

  const visible = ref(false);
  const searchText = ref(props.modelValue); // 初始化 searchText 为 modelValue 的值
  const filterText = ref('');

  const filteredIcons = computed(() => {
    return ids.filter((icon) => icon.includes(filterText.value));
  });

  const emit = defineEmits(['update:modelValue']);

  watch(
    () => props.modelValue,
    (newValue) => {
      searchText.value = newValue; // 当外部的 modelValue 变化时，更新 searchText
    },
  );
  const selectIcon = (icon: string) => {
    // 在这里可以添加你想要执行的选中图标的逻辑
    searchText.value = icon;
    emit('update:modelValue', icon);
    filterText.value = '';
    visible.value = false;
  };
</script>

<style lang="less" scoped>
  .selected-icon-list-scrollbar {
    padding-right: 0px !important;
  }
  ::v-deep .arco-scrollbar-track-direction-vertical {
    width: 4px !important;

    .arco-scrollbar-thumb {
      .arco-scrollbar-thumb-bar {
        width: 4px !important;
        margin: 0 !important;
      }
    }
  }
</style>

<style lang="less">
  .icon-selected-container {
    width: 100%;
  }
  .custom-popover {
    height: 400px !important;
    width: 395px !important;
  }

  .selected-icon-list-search-button {
    height: 32px;
    margin-bottom: 8px;
  }

  .selected-icon-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .selected-icon-item {
    position: relative;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all 0.2s ease;
    margin-right: 4px;
    margin-bottom: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: rgb(var(--primary-5));
    }
  }
  .selected-icon-item-component {
    font-size: 32px;
    line-height: 10px;
    text-align: center;
  }
</style>
