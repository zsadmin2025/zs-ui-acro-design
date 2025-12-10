import { defineStore } from 'pinia';
import { sysMenuApi } from '@/api/sys/menu';
import { MenuBtnPermissionAddOrEditState } from '@/types/sys/menu/menuBtnPermissionTypes';
import { Message } from '@arco-design/web-vue';

export const useMenuBtnPermissionAddOrEditStore = defineStore(
  'menuBtnPermissionAddOrEdit',
  {
    state: (): MenuBtnPermissionAddOrEditState => {
      return {
        formRef: ref(null),
        visible: false,
        loading: false,
        form: {
          sysMenuId: '',
          pid: '',
          title: '',
          permissions: '',
          type: 3,
          sort: 0,
          status: 1,
        },
      };
    },
    getters: {
      rules() {
        return {
          title: [
            { required: true, message: '请输入按钮名称', trigger: 'blur' },
          ],
          permissions: [
            { required: true, message: '请输入权限字符', trigger: 'blur' },
          ],
        };
      },
    },
    actions: {
      init() {
        this.visible = true;
        if (this.form.sysMenuId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await sysMenuApi.getBtnPermissionsById(
          this.form?.sysMenuId ?? '',
        );
        Object.assign(this.form, data?.data);
      },
      close() {
        this.visible = false;
        this.formRef.resetFields();
      },

      async submit(emits: (event: 'refresh') => void) {
        // 防止重复提交
        if (this.loading) return;

        try {
          if (!this.formRef) return;

          if (await this.formRef.validate()) {
            return;
          }
          const action = this.form.sysMenuId
            ? sysMenuApi.editBtnPermissions
            : sysMenuApi.saveBtnPermissions;
          await action(this.form);
          this.close();
          this.visible = false;
          this.loading = false;
          emits('refresh');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '未知错误';
          Message.error(errorMessage);
        } finally {
          this.loading = false;
        }
      },
    },
  },
);
