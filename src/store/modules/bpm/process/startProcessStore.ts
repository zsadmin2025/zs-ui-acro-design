import { ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { bpmProcessApi } from '@/api/bpm/process';
import type { ProcessDefinition, FormSchema } from '@/types/bpm/bpmTypes';

export interface StartProcessState {
  definitions: ProcessDefinition[];
  loading: boolean;
  searchForm: { name: string };
  currentDefinition: ProcessDefinition | null;
  formLoading: boolean;
  formType: 'DYNAMIC' | 'BUSINESS' | null;
  formSchema: FormSchema | null;
  businessFormPath: string;
  businessComponent: any;
  formData: Record<string, any>;
  ccUserIds: string[];
  submitting: boolean;
  dynamicFormRef: any;
}

export const useStartProcessStore = defineStore('startProcess', {
  state: (): StartProcessState => ({
    definitions: [],
    loading: false,
    searchForm: { name: '' },
    currentDefinition: null,
    formLoading: false,
    formType: null,
    formSchema: null,
    businessFormPath: '',
    businessComponent: shallowRef(null),
    formData: {},
    ccUserIds: [],
    submitting: false,
    dynamicFormRef: ref(null),
  }),
  actions: {
    async loadDefinitions() {
      this.loading = true;
      try {
        const { data } = await bpmProcessApi.getDefinitions(this.searchForm);
        this.definitions = data?.data ?? data ?? [];
      } finally {
        this.loading = false;
      }
    },
    resetSearch() {
      this.searchForm = { name: '' };
      this.loadDefinitions();
    },
    async selectProcess(item: ProcessDefinition) {
      this.currentDefinition = item;
      this.formLoading = true;
      this.formData = {};
      this.businessComponent = shallowRef(null);
      try {
        const { data } = await bpmProcessApi.getDefinitionByKey(item.key);
        const detail = data?.data ?? data;
        const startForm = detail?.formConfig?.startForm;
        if (startForm) {
          this.formType = startForm.type;
          if (startForm.type === 'DYNAMIC') {
            this.formSchema = startForm.formSchema ?? null;
          } else if (startForm.type === 'BUSINESS') {
            this.businessFormPath = startForm.businessFormPath ?? '';
          }
        } else {
          this.formType = null;
        }
      } finally {
        this.formLoading = false;
      }
    },
    handleCcSelect(val: any) {
      if (val) {
        const arr = Array.isArray(val) ? val : [val];
        this.ccUserIds = arr.map((u: any) => u.userId);
      }
    },
    async handleStart() {
      if (!this.currentDefinition) return;
      if (this.formType === 'DYNAMIC' && this.dynamicFormRef) {
        const errors = await this.dynamicFormRef.validate();
        if (errors) {
          Message.warning('请完善表单信息');
          return;
        }
      }
      this.submitting = true;
      try {
        await bpmProcessApi.startProcess(this.currentDefinition.key, {
          formData: this.formData,
          ccUserIds: this.ccUserIds,
        });
        Message.success('流程发起成功');
        this.currentDefinition = null;
        this.formData = {};
        this.ccUserIds = [];
      } finally {
        this.submitting = false;
      }
    },
    goBack() {
      this.currentDefinition = null;
    },
    resetState() {
      this.$reset();
    },
  },
});
