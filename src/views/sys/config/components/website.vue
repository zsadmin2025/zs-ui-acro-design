<template>
  <div class="website-container">
    <a-form
      ref="formRef"
      :model="website"
      layout="vertical"
      :rules="rules"
      auto-label-width
    >
      <a-form-item label="系统名称" field="websiteName">
        <a-input v-model="website.websiteName" placeholder="请输入系统名称" />
      </a-form-item>
      <a-form-item label="系统描述" field="description">
        <a-textarea
          v-model="website.description"
          placeholder="请输入系统描述"
        />
      </a-form-item>
      <!-- <a-form-item label="系统logo" field="logo">
        <zs-upload-image v-model="website.logo" style="width: 100%" />
      </a-form-item> -->
      <a-form-item label="系统版本" field="version">
        <a-input v-model="website.version" placeholder="请输入系统版本" />
      </a-form-item>
      <a-form-item label="系统版权" field="copyright">
        <a-input v-model="website.copyright" placeholder="请输入系统版权" />
      </a-form-item>
      <a-form-item label="系统备案" field="icp">
        <a-input v-model="website.icp" placeholder="请输入系统备案" />
      </a-form-item>
      <a-form-item label="备案链接" field="icpLink">
        <a-input v-model="website.icpLink" placeholder="请输入备案链接" />
      </a-form-item>
      <a-form-item label="隐私政策" field="privacyPolicy">
        <zs-editor
          key="privacy-policy-editor"
          ref="privacyPolicyRef"
          v-model="website.privacyPolicy"
        />
      </a-form-item>
      <a-form-item label="服务条款" field="termsOfService">
        <zs-editor
          key="terms-of-service-editor"
          ref="termsOfServicerRef"
          v-model="website.termsOfService"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSave()">
          <template #icon>
            <icon-save />
          </template>
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useTitle } from '@vueuse/core';
  import { websiteStore } from '@/store/modules/sys/config/website/websiteStore';
  import { Message } from '@arco-design/web-vue';

  const useWebsiteStore = websiteStore();
  const { website, formRef, rules } = storeToRefs(useWebsiteStore);

  const onSave = async () => {
    await useWebsiteStore.save();

    useTitle(website.value.websiteName);

    // 弹窗提示
    Message.success({
      content: '保存成功',
      duration: 2000,
    });
  };
  onMounted(async () => {
    useWebsiteStore.init();
  });
</script>

<style lang="less" scoped>
  .website-container {
    padding: 0 20px 20px 20px;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-bg-2);
  }
</style>
