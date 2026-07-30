import { basicApprovalConfigurationApi } from '@/api/lawyer/basic/approval';
import { defineStore } from 'pinia';
import { ApprovalState } from '@/types/lawyer/basic/approval/approvalTypes';

export const useApprovalStore = defineStore('approval', {
  state: (): ApprovalState => ({
    loading: false,
    form: {
      isApproval: 1, // 是否启用审批
      registrationApprovalRoles: [],
      closingApprovalRoles: [],
      usingChapterApprovalRoles: [],
    },
  }),
  // persist: {
  //   key: 'isApproval',
  //   storage: localStorage,
  //   pick: ['form.isApproval'],
  //   serializer: {
  //     serialize: JSON.stringify,
  //     deserialize: JSON.parse,
  //   },
  // },
  actions: {
    async loadInfo() {
      const data = await basicApprovalConfigurationApi.getInfo();
      Object.assign(this.form, data?.data);
    },

    async submit() {
      await basicApprovalConfigurationApi.save(this.form);
    },
  },
});
