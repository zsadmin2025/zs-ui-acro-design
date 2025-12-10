<template>
  <a-drawer
    width="80%"
    :visible="visible"
    :footer="false"
    unmount-on-close
    @cancel="close"
  >
    <template #title>{{ '代码预览' }}</template>
    <ZsContainer layout="left-right" :left-box-width="'auto'">
      <template #left>
        <a-tree
          ref="genPreviewRef"
          v-model:expanded-keys="expandedKeys"
          :default-selected-keys="['0-0-0-0']"
          :data="previewData"
          :show-line="true"
          @select="handleNodeClick"
        />
      </template>
      <template #right-main-body>
        <!-- 把数据绑定到 `code` 属性-->
        <a-link :underline="false" @click="copy">复制</a-link>
        <pre
          style="
            margin: 0;
            padding: 12px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            max-height: 100%;
            overflow-y: auto;
            width: 100%;
            white-space: pre-wrap;
          "
          >{{ valueCode }}
        </pre>
      </template>
    </ZsContainer>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { TreeNodeData, Message } from '@arco-design/web-vue';
  import useClipboard from 'vue-clipboard3';
  import { genApi } from '@/api/tool/gen';

  const { toClipboard } = useClipboard();
  // 添加 expandedKeys 响应式数据
  const expandedKeys = ref<string[]>([]);
  const genPreviewRef = ref();

  const genTable = reactive({
    tableId: '',
    tableName: '',
    tableComment: '',
    className: '',
    tplCategory: '',
    packageName: '',
    moduleName: '',
    businessName: '',
    functionName: '',
    functionAuthor: '',
    genType: '0',
    genPath: '',
    options: '{}',
    createBy: '',
    createTime: '',
    updateBy: '',
    updateTime: '',
    remark: '',
  });

  const visible = ref(false);
  const previewData = ref<any>(null);
  const valueCode = ref('');

  // 递归获取所有节点的 key 值
  const getAllKeys = (data: any[]): string[] => {
    const keys: string[] = [];
    const traverse = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.key) {
          keys.push(node.key);
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(data);

    return keys;
  };

  const init = async () => {
    visible.value = true;
    const { data } = await genApi.previewCode(genTable.tableId);
    previewData.value = data;
    // 设置所有节点默认展开
    nextTick(() => {
      if (previewData.value) {
        expandedKeys.value = getAllKeys(previewData.value);
        // 默认选中第一个节点
        const selectedNode = genPreviewRef.value.getSelectedNodes()[0];
        valueCode.value = selectedNode?.value || '';
      }
    });
  };

  const handleNodeClick = (
    selectedKeys: Array<string | number>,
    data: {
      selected?: boolean;
      selectedNodes: TreeNodeData[];
      node?: TreeNodeData;
      e?: Event;
    },
  ) => {
    valueCode.value = data.node?.value || '';
    console.log('valueCode', valueCode.value);
  };
  const close = () => {
    visible.value = false;
  };

  const copy = async () => {
    try {
      await toClipboard(valueCode.value);
      Message.success('复制成功！');
    } catch (e) {
      Message.error('复制失败！');
    }
  };
  defineExpose({
    genTable,
    init,
  });
</script>

<style lang="less" scoped>
  .zs-container {
    height: 100%;

    :deep(.layout-left-right) {
      .left-sidebar {
        overflow-y: auto;
        // 自定义滚动条样式
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: var(--color-fill-2);
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
          background: var(--color-fill-4);
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: var(--color-fill-5);
        }
      }
      .right-content {
        .right-main {
          .right-main-body {
            height: 100% !important;
            position: relative;
            padding: 0 !important;

            // 自定义滚动条样式
            &::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }

            &::-webkit-scrollbar-track {
              background: var(--color-fill-2);
              border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb {
              background: var(--color-fill-4);
              border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb:hover {
              background: var(--color-fill-5);
            }
            pre {
              background: var(--color-fill-3);
              border-radius: 4px;
              overflow: auto;
            }
            .arco-link {
              position: absolute;
              right: 16px;
              top: 16px;
              z-index: 1;
            }
          }
        }
      }
    }
  }
  // 全局滚动条样式
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-fill-2);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-fill-4);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-fill-5);
  }
</style>
