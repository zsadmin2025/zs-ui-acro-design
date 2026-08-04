import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { GoodsAddOrEditState } from '@/types/business/goods/goods/goodsTypes';
import { businessDrugGoodsApi } from '@/api/business/goods/goods/goods';

export const useGoodsAddOrEditStore = defineStore(
  'businessDrugGoodsAddOrEdit',
  {
    state: (): GoodsAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          drugGoodsId: '',
          goodsCategoryId: '',
          specialGoodsType: 0,
          goodsSn: '',
          dosageFormId: '',
          commonName: '',
          goodsName: '',
          unit: '',
          traceCode: '',
          manufacturerId: '',
          originPlace: '',
          storeLocationId: '',
          spec: '',
          goodsPinyin: '',
          barcode: '',
          commonNamePinyin: '',
          marketingAuthorizationHolder: '',
          isMedicalInsurance: undefined,
          isChineseMedicine: 0,
          goodsClassifyId: '',
          prescriptionFlag: undefined,
          approvalNo: '',
          chargeLevel: undefined,
          expireWarnDays: undefined,
          latestPurchasePrice: undefined,
          drugValidDate: undefined,
          fileNo: '',
          latestSupplierId: '',
          approvalValidEnd: undefined,
          salePackageType: undefined,
          bigPackageNum: undefined,
          bigPackageUnit: '',
          midPackageNum: undefined,
          midPackageUnit: '',
          smallPackageNum: undefined,
          smallPackageUnit: '',
          nationalCode: '',
          provinceCode: '',
          standardPrice: undefined,
          supplyPrice: undefined,
          saleUnit: '',
          splitFlag: undefined,
          splitPrice: undefined,
          splitUnit: '',
          splitRatio: undefined,
          taxRate: undefined,
          isSpecialPrice: undefined,
          suggestRetailPrice: undefined,
          priceCoefficient: undefined,
          firstSupplierId: '',
          maxRetailPrice: undefined,
          wholesalePrice: undefined,
          factoryPrice: undefined,
          collectPrice: undefined,
          mainCategoryAttr: '',
          funcAttr: '',
          adminRouteAttr: undefined,
          chineseWesternAttr: undefined,
          baseDrugAttr: undefined,
          abcAttr: '',
          businessAttr: '',
          goodsDetailClassify: '',
          drugAttr3: '',
          drugAttr4: '',
          drugAttr5: '',
          drugAttr6: '',
          drugAttr7: '',
          drugAttr8: '',
          drugAttr9: '',
          drugAttr10: '',
          stimulantAttr: undefined,
          englishName: '',
          chemicalName: '',
          latinName: '',
          dosage: '',
          doseUnit: '',
          frequency: '',
          cycleDays: undefined,
          cycleTimes: undefined,
          effectStartDate: undefined,
          effectEndDate: undefined,
          extendType: '',
          usageDosage: '',
          processingMethod: '',
          efficacy: '',
          herbFamilySource: '',
          herbSpeciesSource: '',
          medicinalPart: '',
          propertyDescription: '',
          mainIngredients: '',
          mainFunction: '',
          indications: '',
          status: 1,
          certs: [],
        },
      };
    },
    getters: {
      rules() {
        return {
          drugGoodsId: [
            { required: true, message: '请选择主键ID', trigger: 'blur' },
          ],
          goodsCategoryId: [
            { required: true, message: '请选择商品类别id', trigger: 'blur' },
          ],
          specialGoodsType: [
            {
              required: true,
              message: '请选择特殊商品管理',
              trigger: 'blur',
            },
          ],
          goodsSn: [
            { required: true, message: '请选择商品货号', trigger: 'blur' },
          ],
          dosageFormId: [
            {
              required: true,
              message: '请选择剂型（对应数据字典）',
              trigger: 'blur',
            },
          ],
          commonName: [
            { required: true, message: '请选择通用名', trigger: 'blur' },
          ],
          goodsName: [
            { required: true, message: '请选择商品名称', trigger: 'blur' },
          ],
          unit: [
            {
              required: true,
              message: '请选择单位（对应数据字典）',
              trigger: 'blur',
            },
          ],
          traceCode: [
            { required: true, message: '请选择追溯码', trigger: 'blur' },
          ],
          manufacturerId: [
            {
              required: true,
              message: '请选择生产厂家(编码/名称)',
              trigger: 'blur',
            },
          ],
          isChineseMedicine: [
            {
              required: true,
              message: '请选择是否中药：0否 1是',
              trigger: 'blur',
            },
          ],
          goodsClassifyId: [
            { required: true, message: '请选择商品分类id', trigger: 'blur' },
          ],
          prescriptionFlag: [
            {
              required: true,
              message: '请选择处方标志：1-处方 2-非处方',
              trigger: 'blur',
            },
          ],
          standardPrice: [
            { required: true, message: '请选择标准价', trigger: 'blur' },
          ],
          supplyPrice: [
            { required: true, message: '请选择供货价', trigger: 'blur' },
          ],
        };
      },
    },
    actions: {
      init() {
        this.dialogFormVisible = true;
        if (this.form.drugGoodsId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await businessDrugGoodsApi.getById(this.form.drugGoodsId);
        Object.assign(this.form, data?.data);
      },
      close() {
        this.formRef.resetFields();
        this.dialogFormVisible = false;
        this.form.certs = [];
      },
      addCert() {
        this.form.certs.push({
          drugGoodsCertId: '',
          drugGoodsId: '',
          certName: '',
          certNo: '',
          validEndDate: undefined,
          fileUrl: '',
        });
      },
      removeCert(index: number) {
        this.form.certs.splice(index, 1);
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
          const action = this.form.drugGoodsId
            ? businessDrugGoodsApi.edit
            : businessDrugGoodsApi.save;
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
