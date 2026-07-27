<template>
  <div class="workflow-container">
    <div class="fd-nav">
      <div class="fd-nav-left">
        <div class="fd-nav-back" @click="$emit('back')">
          <i class="anticon anticon-left"></i>
        </div>
        <div class="fd-nav-title">合同审批</div>
      </div>
      <div class="fd-nav-right">
        <button
          type="button"
          class="ant-btn button-publish"
          @click="handlePublish"
          >发 布</button
        >
      </div>
    </div>

    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div class="zoom-out" @click="handleZoomOut">-</div>
          <span>{{ zoomPercent }}%</span>
          <div class="zoom-in" @click="handleZoomIn">+</div>
        </div>

        <div id="graph" ref="containerRef" class="viewport"></div>
        <TeleportContainer :flow-id="flowId" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, provide } from 'vue';
  import LogicFlow from '@logicflow/core';
  import { register, getTeleport } from '@logicflow/vue-node-registry';
  import { Control } from '@logicflow/extension';
  import '@logicflow/core/es/index.css';
  import '@logicflow/extension/lib/style/index.css';

  import StartNode from './components/StartNode.vue';
  import ApproverNode from './components/ApproverNode.vue';
  import NotifierNode from './components/NotifierNode.vue';
  import ConditionNode from './components/ConditionNode.vue';

  LogicFlow.use(Control);

  const emit = defineEmits<{
    (e: 'back'): void;
    (e: 'publish', data: any): void;
  }>();

  const lfRef = ref<LogicFlow | null>(null);
  const containerRef = ref<HTMLDivElement | null>(null);
  const TeleportContainer = getTeleport();
  const flowId = ref('');
  const zoomPercent = ref(100);

  const handleZoomIn = () => {
    if (lfRef.value) {
      const newZoom = lfRef.value.zoom(true);
      zoomPercent.value = parseInt(newZoom, 10);
    }
  };

  const handleZoomOut = () => {
    if (lfRef.value) {
      const newZoom = lfRef.value.zoom(false);
      zoomPercent.value = parseInt(newZoom, 10);
    }
  };

  const handlePublish = () => {
    if (lfRef.value) {
      const data = lfRef.value.getGraphData();
      emit('publish', data);
    }
  };

  const getCanvasCenter = () => {
    if (!containerRef.value) return { x: 400, y: 300 };
    const rect = containerRef.value.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  };

  onMounted(() => {
    if (containerRef.value) {
      const center = getCanvasCenter();

      const lf = new LogicFlow({
        container: containerRef.value,
        grid: true,
        edgeType: 'polyline',
      });

      register({ type: 'start-node', component: StartNode }, lf);
      register({ type: 'approver-node', component: ApproverNode }, lf);
      register({ type: 'notifier-node', component: NotifierNode }, lf);
      register({ type: 'condition-node', component: ConditionNode }, lf);

      lf.on('graph:rendered', ({ graphModel }) => {
        flowId.value = graphModel.flowId!;
      });

      (lf.extension.control as Control).addItem({
        key: 'reset-position',
        iconClass: 'lf-control-fit',
        title: '回到初始位置',
        text: '复位',
        onClick: () => {
          lf.resetZoom();
          lf.resetTranslate();
          zoomPercent.value = 100;
        },
      } as any);

      lf.render({
        nodes: [
          {
            id: 'start',
            type: 'start-node',
            x: center.x - 400,
            y: center.y,
            properties: {
              title: '发起人',
              assignee: '所有人',
            },
          },
          {
            id: 'approver-1',
            type: 'approver-node',
            x: center.x - 100,
            y: center.y,
            properties: {
              title: '审核人',
              assignee: '直接主管',
            },
          },
        ],
        edges: [
          {
            sourceNodeId: 'start',
            targetNodeId: 'approver-1',
          },
        ],
      });

      lfRef.value = lf;
      provide('lf', lf);
    }
  });

  onUnmounted(() => {
    if (lfRef.value) {
      lfRef.value.destroy();
    }
  });
</script>

<style lang="less" scoped>
  .workflow-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f5;
  }

  .fd-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .fd-nav-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fd-nav-back {
    cursor: pointer;
    color: #666;
    font-size: 16px;
    padding: 8px;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .fd-nav-back:hover {
    background: #f5f5f5;
  }

  .fd-nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .fd-nav-right {
    display: flex;
    align-items: center;
  }

  .button-publish {
    background: #576a95;
    border-color: #576a95;
    color: #fff;
  }

  .button-publish:hover {
    background: #4a5a85;
    border-color: #4a5a85;
  }

  .fd-nav-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dingflow-design {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
  }

  .zoom {
    position: absolute;
    top: 12px;
    right: 70px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .zoom-out,
  .zoom-in {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: #666;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .zoom-out:hover,
  .zoom-in:hover {
    background: #f5f5f5;
  }

  .zoom span {
    font-size: 12px;
    color: #666;
    min-width: 40px;
    text-align: center;
  }

  .viewport {
    width: 100%;
    height: 100%;
  }
</style>
