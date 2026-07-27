<template>
  <div class="form-designer-page">
    <a-spin :loading="pageLoading" style="width: 100%; height: 100%">
      <fc-designer
        ref="designerRef"
        :config="config"
        :option="designerOption"
        :rule="designerRule"
        @save="handleDesignerSave"
      />
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { bpmSettingFormApi } from '@/api/bpm/setting/form';

  const route = useRoute();

  const config = {
    showSaveBtn: true, // 控制字段ID输入框能否输入
    fieldReadonly: false,
  };

  const designerRef = ref<any>(null);
  const formId = ref('');
  const pageLoading = ref(false);
  const designerRule = ref<any[]>([]);
  const designerOption = ref<any>({});

  const loadFormDetail = async () => {
    if (!formId.value) return;
    pageLoading.value = true;
    try {
      const res = await bpmSettingFormApi.getFormById(formId.value);
      const detail = res.data?.data ?? res.data;
      if (!detail) return;

      // 尝试多种可能的数据结构
      let formRule: any[] = [];
      let formOption: any = {};

      // 情况1: detail.formSchema 是字符串
      if (typeof detail.formSchema === 'string') {
        try {
          const schema = JSON.parse(detail.formSchema);
          formRule = schema.formRule ?? schema.rules ?? [];
          formOption = schema.formOption ?? schema.formConfig ?? {};
        } catch {
          /* ignore */
        }
      }
      // 情况2: detail.formSchema 是对象
      else if (detail.formSchema && typeof detail.formSchema === 'object') {
        formRule = detail.formSchema.formRule ?? detail.formSchema.rules ?? [];
        formOption =
          detail.formSchema.formOption ?? detail.formSchema.formConfig ?? {};
      }
      // 情况3: formRule/formOption 直接在 detail 上（updateFormSchema 保存的格式）
      else if (detail.formRule || detail.formOption) {
        formRule = detail.formRule ?? [];
        formOption = detail.formOption ?? {};
      }

      // 使用设计器方法加载数据，确保组件已初始化
      await nextTick();
      if (designerRef.value) {
        designerRef.value.setRule(formRule);
        designerRef.value.setOption(formOption);
      } else {
        designerRule.value = formRule;
        designerOption.value = formOption;
      }
    } catch {
      Message.error('加载表单详情失败');
    } finally {
      pageLoading.value = false;
    }
  };

  const handleDesignerSave = async (formData: { rule: any[]; option: any }) => {
    const { rule: formRule, option: formOption } = formData;

    if (!formRule || formRule.length === 0) {
      Message.warning('请先设计表单');
      return;
    }

    pageLoading.value = true;
    try {
      if (formId.value) {
        // 编辑模式 - 更新表单 schema
        await bpmSettingFormApi.updateForm({
          formSchema: JSON.stringify({ formRule, formOption }),
        });
        Message.success('保存成功');
      } else {
        // 新增模式 - 创建表单
        const res = await bpmSettingFormApi.saveForm({
          formSchema: JSON.stringify({ formRule, formOption }),
        });
        const newId = res.data?.data?.id ?? res.data?.id;
        Message.success('创建成功');
        if (newId) {
          formId.value = String(newId);
        }
      }
    } catch (error: any) {
      Message.error(error?.message || '保存失败');
    } finally {
      pageLoading.value = false;
    }
  };

  onMounted(async () => {
    if (route.query.id) {
      formId.value = String(route.query.id);
      await loadFormDetail();
    }
  });
</script>

<style lang="less" scoped>
  .form-designer-page {
    height: 100%;
    background: var(--color-bg-white);
  }
</style>
