import { defineStore } from 'pinia';
import { getLoginCode, getTenantSelect } from '@/api/login/login';

const useLoginStore = defineStore('loginStore', {
  state: () => {
    return {
      codeForm: {
        img: '',
        uuid: '',
      },
      tenantList: [] as any[],
    };
  },
  getters: {},
  actions: {
    async refreshCaptcha() {
      const { data } = await getLoginCode();
      this.codeForm.img = data?.img;
      this.codeForm.uuid = data?.uuid;
    },
    async getTenantList() {
      const { data } = await getTenantSelect();
      this.tenantList = data;
    },
  },
});
export default useLoginStore;
