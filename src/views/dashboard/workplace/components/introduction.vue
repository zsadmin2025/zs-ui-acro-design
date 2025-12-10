<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      title="系统介绍"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '20px' }"
    >
      <!-- 简介 -->
      <p class="intro">
        ZS-Admin 是一套基于前沿技术栈构建的前后端分离快速开发脚手架。后端采用
        Spring Boot
        框架，依托其强大的生态和自动配置能力，实现服务的高可用性与快速集成；前端基于
        Vue 3 重构核心架构，结合 Pinia 进行高效状态管理，并采用 Vite
        作为构建引擎，显著提升开发环境的启动速度与生产环境的打包性能。系统整体设计遵循标准化、模块化原则，内置权限管理、代码生成、日志监控等常用企业级功能模块，致力于为开发者提供一个功能完善、结构清晰、稳定可靠且易于扩展的开发基础平台，助力项目快速落地，全面提升开发效率与代码质量。
      </p>

      <!-- 信息列表 -->
      <div class="info-list">
        <div class="item"
          ><span class="label">当前版本：</span><span>v1.0.0</span></div
        >
        <div class="item">
          <span class="label">官方网站：</span>
          <a href="https://www.zsadmin.top" target="_blank">www.zsadmin.top</a>
        </div>
        <div class="item">
          <span class="label">GitHub：</span>
          <a href="https://github.com/zs-admin-team/zsadmin" target="_blank"
            >zs-admin-team/zsadmin</a
          >
        </div>
        <div class="item">
          <span class="label">Gitee：</span>
          <a href="https://gitee.com/zs-admin-team/zsadmin" target="_blank"
            >zs-admin-team/zsadmin</a
          >
        </div>
        <div class="item">
          <span class="label">文档中心：</span>
          <a href="https://www.zsadmin.vip/docs" target="_blank">官方文档</a>
          <!-- <span class="separator">|</span>
          <a href="https://zsadmin.cn" target="_blank">备用文档</a> -->
        </div>
        <!-- <div class="item">
          <span class="label">技术博客：</span>
          <a href="https://blog.zsadmin.cn" target="_blank">blog.zsadmin.cn</a>
        </div> -->

        <!-- <div class="item">
          <span class="label">捐赠支持：</span>
          <a href="https://zsadmin.vip/donate" target="_blank">赞助项目发展</a>
        </div> -->
        <div class="item">
          <span class="label">开源协议：</span>
          <a
            href="https://github.com/zs-admin-team/zsadmin/blob/main/LICENSE"
            target="_blank"
            >MIT License</a
          >
        </div>
        <div class="item">
          <span class="label">项目作者：</span>
          <a target="_blank">zs</a>
        </div>
        <div class="item">
          <span class="label">技术支持：</span>
          <a href="https://jq.qq.com/?_wv=1027&k=5XZj0Zw" target="_blank"
            >QQ群加入</a
          >
          <span class="separator">|</span>
          <a href="mailto:support@867406308@qq.com">support@867406308.vip</a>
          <span class="separator">|</span>
          <a
            href="https://wpa.qq.com/msgrd?v=3&uin=3794037832&site=qq&menu=yes"
            target="_blank"
            >QQ: 3794037832</a
          >
          <span class="separator">|</span>
          微信: zsadminvip
        </div>
      </div>

      <!-- 感谢语 -->
      <div class="thanks">感谢所有贡献者与支持者的信赖与陪伴！</div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const loading = ref(false);
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
  }

  .intro {
    color: #555;
    line-height: 1.6;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .info-list {
    display: grid;
    gap: 10px 0;
    font-size: 14px;
    color: #333;

    .item {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px 8px;

      .label {
        font-weight: 600;
        color: #1d2129;
        min-width: 70px;
      }

      a {
        color: #165dff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      .separator {
        color: #ccc;
        margin: 0 6px;
      }
    }
  }

  .tech-stack {
    margin-top: 14px;
    padding: 10px 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    font-size: 13px;
    color: #555;
    display: flex;
    align-items: center;
    gap: 4px;

    .label {
      font-weight: 600;
      color: #1d2129;
      min-width: 56px;
    }
  }

  .repo-links {
    margin-top: 12px;
    font-size: 13px;
    color: #555;

    div {
      margin-bottom: 6px;
    }

    .label {
      font-weight: 600;
      color: #1d2129;
      min-width: 56px;
      display: inline-block;
    }

    a {
      color: #165dff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .thanks {
    margin-top: 16px;
    font-style: italic;
    color: #888;
    font-size: 13px;
    text-align: right;
  }
</style>
