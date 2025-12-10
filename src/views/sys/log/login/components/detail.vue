<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="60%"
    title-align="start"
    :draggable="true"
    @cancel="close"
  >
    <template #title>
      <h4>登录日志详情</h4>
    </template>

    <!-- 只有当 form 存在时才渲染 -->
    <a-descriptions
      :column="2"
      :layout="isMobile ? 'vertical' : 'horizontal'"
      bordered
      size="middle"
    >
      <a-descriptions-item label="登录用户">
        {{ form?.username }}
      </a-descriptions-item>

      <a-descriptions-item label="登录时间" :span="1">
        {{ form?.loginTime }}
      </a-descriptions-item>

      <a-descriptions-item label="登录状态">
        <a-tag :color="getLoginStatusColor(form?.loginStatus)">
          {{ formatLoginStatus(form?.loginStatus) }}
        </a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="失败原因" :span="1">
        {{ form?.failureReason || '-' }}
      </a-descriptions-item>

      <a-descriptions-item label="IP 地址">
        {{ form?.ipAddress }}
      </a-descriptions-item>

      <a-descriptions-item label="地理位置">
        {{ form?.city || '未知' }}
      </a-descriptions-item>

      <a-descriptions-item label="登录方式">
        <a-tag>{{ formatLoginMethod(form?.loginMethod) }}</a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="登录来源" :span="1">
        {{ formatLoginSource(form?.loginSource) }}
      </a-descriptions-item>

      <a-descriptions-item label="操作系统">
        {{ form?.os || '未知' }}
      </a-descriptions-item>

      <a-descriptions-item label="浏览器">
        {{ form?.browser || '未知' }}
      </a-descriptions-item>

      <!-- User Agent 全宽度展示 -->
      <a-descriptions-item label="User Agent" :span="2">
        <code
          style="
            display: block;
            padding: 8px 12px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.5;
            max-height: 150px;
            overflow-y: auto;
            word-break: break-all;
          "
        >
          {{ form?.userAgent }}
        </code>
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  // 表单数据响应式
  const dialogFormVisible = ref(false);
  const form = ref<any>(null);

  // 判断是否移动端
  const isMobile = window.innerWidth < 768;

  // 打开弹窗并赋值
  const open = (data: any) => {
    dialogFormVisible.value = true;
    form.value = null; // 清空旧数据
    // 延迟赋值，避免闪现旧内容
    setTimeout(() => {
      form.value = { ...data }; // 深拷贝防污染
    }, 50);
  };

  // 关闭弹窗
  const close = () => {
    dialogFormVisible.value = false;
    form.value = null;
  };

  // 格式化登录状态
  const formatLoginStatus = (status: number): string => {
    const map: Record<number, string> = {
      0: '登录失败',
      1: '登录成功',
    };
    return map[status] || '未知';
  };

  // 登录状态颜色
  const getLoginStatusColor = (status: number): string => {
    return status === 1 ? 'green' : 'red';
  };

  // 登录方式
  const formatLoginMethod = (method: number): string => {
    const map: Record<number, string> = {
      1: '账号密码',
      2: '短信验证码',
      3: '第三方登录',
    };
    return map[method] || '未知';
  };

  // 登录来源
  const formatLoginSource = (source: string | null): string => {
    if (!source) return '未知';
    const map: Record<string, string> = {
      PC: 'PC端',
      APP: '移动端',
      WX: '微信小程序',
    };
    return map[source] || source;
  };

  // 暴露方法给父组件
  defineExpose({
    open,
  });
</script>

<style scoped></style>
