import { defineStore } from 'pinia';
import { businessWarehouseInfoApi } from '@/api/business/warehouse/info/info';
import { InfoAddOrEditState } from '@/types/business/warehouse/info/infoTypes';
import { Message } from '@arco-design/web-vue';

export const useInfoAddOrEditStore = defineStore(
  'businessWarehouseInfoAddOrEdit',
  {
    state: (): InfoAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          warehouseInfoId: '',
          warehouseCode: '',
          warehouseName: '',
          warehouseAddress: '',
          institutionId: '',
          warehouseArea: undefined,
          warehouseType: '',
          locationCount: undefined,
          shelfCount: undefined,
          managerUserId: '',
          contactInfo: '',
          status: 1,
          remark: '',
        },
      };
    },
    getters: {
      rules() {
        return {
          warehouseInfoId: [
            { required: true, message: '请选择主键', trigger: 'blur' },
          ],
        };
      },
    },
    actions: {
      init() {
        this.dialogFormVisible = true;
        if (this.form.warehouseInfoId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await businessWarehouseInfoApi.getById(
          this.form.warehouseInfoId,
        );
        Object.assign(this.form, data?.data);
      },
      close() {
        this.formRef.resetFields();
        this.dialogFormVisible = false;
      },
      async submit(emits: (event: 'refresh') => void) {
        // 防止重复提交
        if (this.loading) return;

        try {
          if (!this.formRef) return;

          if (await this.formRef.validate()) {
            return;
          }
          this.loading = true;
          const action = this.form.warehouseInfoId
            ? businessWarehouseInfoApi.edit
            : businessWarehouseInfoApi.save;
          await action(this.form);
          this.close();
          this.dialogFormVisible = false;
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
