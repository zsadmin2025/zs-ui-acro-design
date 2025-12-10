<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      title="后续项目计划"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '20px' }"
    >
      <a-card-grid
        v-for="(item, index) in projectList"
        :key="index"
        :hoverable="true"
        class="project-card-grid"
      >
        <a-card hoverable :bordered="false" class="project-card">
          <div class="project-header">
            <div class="project-icon">
              <a-image
                width="32"
                height="32"
                :src="item.img"
                :preview="false"
              />
            </div>
            <div class="project-info">
              <div class="project-title">
                <a-typography-text class="project-name">{{
                  item.name
                }}</a-typography-text>
                <a-tag color="blue" size="small" class="project-status">
                  建设中
                </a-tag>
              </div>
            </div>
          </div>
          <div class="project-description">
            <a-typography-text type="secondary">
              {{ item.description }}
            </a-typography-text>
          </div>
        </a-card>
      </a-card-grid>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const logosElementSrc = new URL(
    '@/assets/images/project/LogosElement.svg',
    import.meta.url,
  ).href;

  const logosAntDesignSrc = new URL(
    '@/assets/images/project/LogosAntDesign.svg',
    import.meta.url,
  ).href;

  const logosFlutterSrc = new URL(
    '@/assets/images/project/LogosFlutter.svg',
    import.meta.url,
  ).href;

  const logosSpringIconSrc = new URL(
    '@/assets/images/project/LogosSpringIcon.svg',
    import.meta.url,
  ).href;

  const logosUniappSrc = new URL(
    '@/assets/images/project/LogosUniapp.svg',
    import.meta.url,
  ).href;

  const loading = ref(false);
  const projectList = ref([
    {
      id: 1,
      name: 'zs-ui-element',
      description: '基于Element-Plus的组件库',
      status: 'doing',
      img: logosElementSrc,
    },
    {
      id: 2,
      name: 'zs-ui-ant-design',
      description: '基于 Ant Design Vue 的快速开发后台管理系统',
      status: 'doing',
      img: logosAntDesignSrc,
    },
    {
      id: 3,
      name: 'zs-flutter',
      description: '基于 Flutter 的跨平台移动端应用',
      status: 'doing',
      img: logosFlutterSrc,
    },
    {
      id: 4,
      name: 'zs-admin-cloud',
      description: '基于 Spring Cloud 的微服务后台管理系统',
      status: 'doing',
      img: logosSpringIconSrc,
    },
    {
      id: 5,
      name: 'zs-uni-mini-program',
      description: '基于uniapp的跨平台小程序',
      status: 'doing',
      img: logosUniappSrc,
    },
    {
      id: 6,
      name: 'zs-uni-app',
      description: '基于uniapp的跨平台移动端应用',
      status: 'doing',
      img: logosUniappSrc,
    },
  ]);
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }

  .project-card-grid {
    width: 33.33%;
    padding: 10px;

    @media (max-width: 768px) {
      width: 50%;
    }

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .project-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;

    :deep(.arco-image-img) {
      border-radius: 8px;
    }
  }

  .project-info {
    flex: 1;
    min-width: 0;
  }

  .project-title {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  .project-name {
    font-weight: 500;
    font-size: 14px;
    color: #1d2129;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .project-status {
    margin-left: 8px;
    border-radius: 2px;
  }

  .project-description {
    margin-bottom: 16px;
    min-height: 40px;

    :deep(.arco-typography) {
      font-size: 12px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .project-footer {
    text-align: right;

    :deep(.arco-btn) {
      font-size: 12px;
      padding: 0;
      height: auto;
      color: #3370ff;

      &:hover {
        color: #3370ff;
        text-decoration: underline;
      }
    }
  }
</style>
