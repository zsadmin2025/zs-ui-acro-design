<template>
  <a-card
    class="general-card"
    title="联系我们"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '15px 20px 13px 20px' }"
  >
    <div class="contact-us">
      <div class="contact-us-item">
        <div class="icon">
          <icon-font name="phone" />
        </div>
        <div class="text">+86 123456789</div>
      </div>
      <div class="contact-us-item">
        <div class="icon">
          <icon-font name="email" />
        </div>
      </div>
    </div>
    <div class="contact-us-item">
      <div class="icon">
        <icon-font name="wechat" />
      </div>
      <div class="text">WeChatID</div>
    </div>
    <div class="contact-us-item">
      <div class="icon">
        <icon-font name="qq" />
      </div>
      <div class="text">QQ</div>
    </div>
  </a-card>
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
</style>
