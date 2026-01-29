<template>
  <a-card
    class="general-card"
    title="系统介绍"
    :header-style="{ paddingBottom: '16px' }"
    :body-style="{ padding: '24px' }"
    :bordered="false"
  >
    <a-row :gutter="24">
      <!-- 左侧主要信息 -->
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="15">
        <div class="intro-header">
          <span class="intro-title">ZS-Admin</span>
          <a-tag color="arcoblue" class="version-tag">
            <template #icon><icon-tag /></template>
            v1.0.0
          </a-tag>
        </div>
        
        <p class="intro-desc">
          ZS-Admin 是一套面向中大型企业场景的现代化管理后台快速开发平台。基于主流技术栈构建，深度融合
          RBAC 权限体系、多租户（SaaS）架构与低代码开发能力，帮助团队以最小成本快速交付高可用、高安全性的业务系统。
        </p>

        <div class="info-grid">
          <div class="info-item">
            <div class="label"><icon-global class="icon"/> 官方网站</div>
            <div class="value">
              <a-link href="https://www.zsadmin.top" target="_blank" :hoverable="false">
                https://www.zsadmin.top
              </a-link>
            </div>
          </div>
          
          <div class="info-item">
            <div class="label"><icon-github class="icon"/> GitHub</div>
            <div class="value">
              <a-link href="https://github.com/zsadmin2025/zs-ui-acro-design" target="_blank" :hoverable="false">
                zsadmin/zs-ui-acro-design
              </a-link>
            </div>
          </div>
          
          <div class="info-item">
            <div class="label"><icon-code class="icon"/> Gitee</div>
            <div class="value">
              <a-link href="https://gitee.com/zs-admin/zs-ui-acro-design" target="_blank" :hoverable="false">
                zsadmin/zs-ui-acro-design
              </a-link>
            </div>
          </div>

           <div class="info-item">
            <div class="label"><icon-code class="icon"/>GitCode</div>
            <div class="value">
              <a-link href="https://gitcode.com/zsadmin2025/zs-ui-acro-design" target="_blank" :hoverable="false">
                zsadmin/zs-ui-acro-design
              </a-link>
            </div>
          </div>
          
          <div class="info-item">
            <div class="label"><icon-book class="icon"/> 文档中心</div>
            <div class="value">
              <a-link href="https://www.zsadmin.top" target="_blank" :hoverable="false">官方文档</a-link>
            </div>
          </div>
          
          <div class="info-item">
            <div class="label"><icon-copyright class="icon"/> 开源协议</div>
            <div class="value">MIT License</div>
          </div>
          
          <div class="info-item">
            <div class="label"><icon-user class="icon"/> 项目作者</div>
            <div class="value">zs</div>
          </div>
          
          <div class="info-item full-width">
            <div class="label"><icon-message class="icon"/> 技术支持</div>
            <div class="value contact-links">
              <a-link href="https://qm.qq.com/q/a30CgmgHgQ" target="_blank" :hoverable="false">
                <ZsIcon icon="icon-filled-qq-circle" :size="16" class="link-icon" /> QQ群: 678804408
              </a-link>
              <a-divider direction="vertical" />
              <a-link href="mailto:support@3794037832@qq.com" :hoverable="false">
                <icon-email class="link-icon" /> 3794037832@qq.com
              </a-link>
              <a-divider direction="vertical" />
              <a-link href="https://wpa.qq.com/msgrd?v=3&uin=3794037832&site=qq&menu=yes" target="_blank" :hoverable="false">
                <ZsIcon icon="icon-filled-qq-circle" :size="16" class="link-icon" /> QQ: 3794037832
              </a-link>
              <a-divider direction="vertical" />
              <span class="wechat-text"><ZsIcon icon="icon-filled-wechat" :size="16" class="link-icon" /> 微信: zsadmin2024</span>
            </div>
          </div>
        </div>

        <div class="thanks-note">
          <icon-heart-fill style="color: #f53f3f; margin-right: 6px;" />
          感谢所有贡献者与支持者的信赖与陪伴！
        </div>
      </a-col>

      <!-- 右侧二维码 -->
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="9">
        <div class="qr-section">
          <div class="qr-card">
            <div class="qr-image-wrapper">
              <a-image :src="qqQrCode" width="100%" />
            </div>
            <div class="qr-info">
              <div class="qr-title">加入 QQ 交流群</div>
            </div>
          </div>
          <div class="qr-card">
            <div class="qr-image-wrapper">
              <a-image :src="wxQrCode" width="100%" />
            </div>
            <div class="qr-info">
              <div class="qr-title">微信群</div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import qqQrCode from '@/assets/qq.jpg';
  import wxQrCode from '@/assets/wx.png';
</script>

<style scoped lang="less">
  .general-card {
    min-height: 380px;
    border-radius: 4px;
    transition: all 0.3s;
    
    :deep(.arco-card-header) {
      border-bottom: 1px solid var(--color-neutral-3);
    }
  }

  .intro-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .intro-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--color-text-1);
      margin-right: 12px;
    }
    
    .version-tag {
      border-radius: 12px;
      padding: 0 10px;
    }
  }

  .intro-desc {
    color: var(--color-text-2);
    line-height: 1.8;
    margin-bottom: 24px;
    font-size: 14px;
    max-width: 800px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 24px;
    margin-bottom: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .info-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      
      &.full-width {
        grid-column: 1 / -1;
      }

      .label {
        color: var(--color-text-1);
        font-weight: 500;
        min-width: 90px;
        display: flex;
        align-items: center;
        
        .icon {
          margin-right: 8px;
          color: var(--color-text-3);
          font-size: 16px;
        }
      }

      .value {
        color: var(--color-text-2);
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
        .disabled-text {
          color: var(--color-text-4);
          cursor: not-allowed;
        }
      }
    }
  }
  
  .contact-links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    .arco-link {
      display: inline-flex;
    }
    
    .link-icon {
      margin-right: 4px;
    }
    
    .wechat-text {
      display: flex;
      align-items: center;
      cursor: default;
    }
  }

  .thanks-note {
    margin-top: 12px;
    padding-top: 16px;
    border-top: 1px dashed var(--color-neutral-3);
    color: var(--color-text-3);
    font-size: 13px;
    display: flex;
    align-items: center;
  }

  .qr-section {
    display: flex;
    gap: 16px;
    height: 100%;
    align-items: center;
    padding-left: 24px;
    border-left: 1px solid var(--color-neutral-3);
    
    @media (max-width: 1199px) {
      border-left: none;
      padding-left: 0;
      margin-top: 24px;
      justify-content: flex-start;
    }
    
    @media (max-width: 576px) {
      flex-direction: column;
    }
  }

  .qr-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--color-bg-2);
    padding: 16px;
    border-radius: 12px;
    transition: all 0.3s;
    cursor: pointer;
    flex: 1;
    min-width: 0;
    
    &:hover {
      background: var(--color-fill-2);
      transform: translateY(-4px);
      
      .qr-title {
        color: rgb(var(--arcoblue-6));
      }
    }
    
    .qr-image-wrapper {
      width: 150px;
      height: 240px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      :deep(.arco-image) {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        overflow: hidden;
      }
      
      :deep(.arco-image-img) {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.3s;
        display: block;
      }
    }
    
    .qr-info {
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .qr-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-1);
        margin-bottom: 8px;
        transition: color 0.3s;
        white-space: nowrap;
      }
      
      .qr-sub {
        font-size: 13px;
        color: var(--color-text-3);
        font-family: monospace;
        background: var(--color-fill-2);
        padding: 4px 8px;
        border-radius: 4px;
        width: fit-content;
      }
    }
  }
</style>
