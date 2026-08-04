<template>
  <a-drawer
    :visible="dialogFormVisible"
    :title="!form.drugGoodsId ? '新增商品信息' : '修改商品信息'"
    width="55%"
    @cancel="goodsAddOrEditStore.close"
    @ok="goodsAddOrEditStore.submit(emits)"
  >
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-tabs>
        <!-- ==================== 基本信息 ==================== -->
        <a-tab-pane key="basic" title="基本信息">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="商品类别" field="goodsCategoryId">
                <a-select
                  v-model="form.goodsCategoryId"
                  placeholder="请选择商品类别"
                  allow-clear
                  allow-search
                >
                  <a-option
                    v-for="item in goodsCategoryList"
                    :key="item.categoryId"
                    :value="item.categoryId"
                    >{{ item.categoryName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="特殊商品管理" field="specialGoodsType">
                <a-radio-group v-model="form.specialGoodsType">
                  <a-radio :value="0">否</a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="商品货号" field="goodsSn">
                <a-input
                  v-model="form.goodsSn"
                  placeholder="请输入商品货号"
                  :max-length="32"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="剂型" field="dosageFormId">
                <a-select
                  v-model="form.dosageFormId"
                  placeholder="请选择剂型"
                  allow-clear
                >
                  <a-option
                    v-for="item in dosageType"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="通用名" field="commonName">
                <a-input
                  v-model="form.commonName"
                  placeholder="请输入通用名"
                  :max-length="100"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="商品名称" field="goodsName">
                <a-input
                  v-model="form.goodsName"
                  placeholder="请输入商品名称"
                  :max-length="100"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="单位" field="unit">
                <a-select
                  v-model="form.unit"
                  placeholder="请选择单位"
                  allow-clear
                >
                  <a-option
                    v-for="item in unit"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="生产厂家" field="manufacturerId">
                <a-select
                  v-model="form.manufacturerId"
                  placeholder="请选择生产厂家"
                  allow-clear
                >
                  <a-option
                    v-for="item in partnerList"
                    :key="item.partnerId"
                    :value="item.partnerId"
                    >{{ item.companyName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="产地" field="originPlace">
                <a-input
                  v-model="form.originPlace"
                  placeholder="请输入产地"
                  :max-length="200"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="货区/货位" field="storeLocationId">
                <a-input
                  v-model="form.storeLocationId"
                  placeholder="请输入货区/货位"
                  :max-length="32"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="规格" field="spec">
                <a-input
                  v-model="form.spec"
                  placeholder="请输入规格"
                  :max-length="100"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="商品拼音码" field="goodsPinyin">
                <a-input
                  v-model="form.goodsPinyin"
                  placeholder="请输入商品拼音码"
                  :max-length="100"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="条形码" field="barcode">
                <a-input
                  v-model="form.barcode"
                  placeholder="请输入条形码"
                  :max-length="100"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="通用名拼音码" field="commonNamePinyin">
                <a-input
                  v-model="form.commonNamePinyin"
                  placeholder="请输入通用名拼音码"
                  :max-length="100"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item
                label="上市许可人"
                field="marketingAuthorizationHolder"
              >
                <a-input
                  v-model="form.marketingAuthorizationHolder"
                  placeholder="请输入上市许可人"
                  :max-length="256"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="是否医保用药" field="isMedicalInsurance">
                <a-select
                  v-model="form.isMedicalInsurance"
                  placeholder="请选择是否医保用药"
                  allow-clear
                >
                  <a-option :value="0">否</a-option>
                  <a-option :value="1">是</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="追溯码" field="traceCode">
                <a-input
                  v-model="form.traceCode"
                  placeholder="请输入追溯码"
                  :max-length="200"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="状态" field="status">
                <a-switch
                  v-model="form.status"
                  :checked-value="1"
                  :unchecked-value="0"
                  type="round"
                >
                  <template #checked> 正常 </template>
                  <template #unchecked> 停用 </template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="extend" title="扩展信息">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="是否中药" field="isChineseMedicine">
                <a-radio-group v-model="form.isChineseMedicine">
                  <a-radio :value="0">否</a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="商品分类" field="goodsClassifyId">
                <a-select
                  v-model="form.goodsClassifyId"
                  placeholder="请选择商品分类"
                  allow-clear
                >
                  <a-option
                    v-for="item in productCategory"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="处方标志" field="prescriptionFlag">
                <a-select
                  v-model="form.prescriptionFlag"
                  placeholder="请选择处方标志"
                  allow-clear
                >
                  <a-option :value="1">处方</a-option>
                  <a-option :value="2">非处方</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="批准文号" field="approvalNo">
                <a-input
                  v-model="form.approvalNo"
                  placeholder="请输入批准文号"
                  :max-length="128"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="收费等级" field="chargeLevel">
                <a-select
                  v-model="form.chargeLevel"
                  placeholder="请选择收费等级"
                  allow-clear
                >
                  <a-option
                    v-for="item in pricingTier"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="近效期预警天数" field="expireWarnDays">
                <a-input-number
                  v-model="form.expireWarnDays"
                  placeholder="请输入近效期预警天数"
                  :min="0"
                  :max="999"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="最近进价" field="latestPurchasePrice">
                <a-input-number
                  v-model="form.latestPurchasePrice"
                  placeholder="请输入最近进价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品有效期" field="drugValidDate">
                <a-date-picker
                  v-model="form.drugValidDate"
                  placeholder="请选择药品有效期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="档案号" field="fileNo">
                <a-input
                  v-model="form.fileNo"
                  placeholder="请输入档案号"
                  :max-length="64"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="最近供应商" field="latestSupplierId">
                <a-select
                  v-model="form.latestSupplierId"
                  placeholder="请选择最近供应商"
                  allow-clear
                >
                  <a-option
                    v-for="item in supplierList"
                    :key="item.partnerId"
                    :value="item.partnerId"
                    >{{ item.companyName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="批准文号有效期" field="approvalValidEnd">
                <a-date-picker
                  v-model="form.approvalValidEnd"
                  placeholder="请选择批准文号有效期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="商品出售包装形式" field="salePackageType">
                <a-select
                  v-model="form.salePackageType"
                  placeholder="请选择商品出售包装形式"
                  allow-clear
                >
                  <a-option :value="1">整合出售</a-option>
                  <a-option :value="2">散装出售</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="大包装数量" field="bigPackageNum">
                <a-input-number
                  v-model="form.bigPackageNum"
                  placeholder="请输入大包装数量"
                  :min="0"
                  :max="999"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="大包装单位" field="bigPackageUnit">
                <a-select
                  v-model="form.bigPackageUnit"
                  placeholder="请选择大包装单位"
                  allow-clear
                >
                  <a-option
                    v-for="item in unit"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="中包装数量" field="midPackageNum">
                <a-input-number
                  v-model="form.midPackageNum"
                  placeholder="请输入中包装数量"
                  :min="0"
                  :max="999"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="中包装单位" field="midPackageUnit">
                <a-select
                  v-model="form.midPackageUnit"
                  placeholder="请选择中包装单位"
                  allow-clear
                >
                  <a-option
                    v-for="item in unit"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="小包装数量" field="smallPackageNum">
                <a-input-number
                  v-model="form.smallPackageNum"
                  placeholder="请输入小包装数量"
                  :min="0"
                  :max="999"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="小包装单位" field="smallPackageUnit">
                <a-select
                  v-model="form.smallPackageUnit"
                  placeholder="请选择小包装单位"
                  allow-clear
                >
                  <a-option
                    v-for="item in unit"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="国家编码" field="nationalCode">
                <a-input
                  v-model="form.nationalCode"
                  placeholder="请输入国家编码"
                  :max-length="64"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="省级编码" field="provinceCode">
                <a-input
                  v-model="form.provinceCode"
                  placeholder="请输入省级编码"
                  :max-length="64"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="price" title="价格信息">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="标准价" field="standardPrice">
                <a-input-number
                  v-model="form.standardPrice"
                  placeholder="请输入标准价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="供货价" field="supplyPrice">
                <a-input-number
                  v-model="form.supplyPrice"
                  placeholder="请输入供货价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="销售单位" field="saleUnit">
                <a-select
                  v-model="form.saleUnit"
                  placeholder="请选择销售单位"
                  allow-clear
                >
                  <a-option
                    v-for="item in unit"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="拆零标志" field="splitFlag">
                <a-select
                  v-model="form.splitFlag"
                  placeholder="请选择拆零标志：0否 1是"
                  allow-clear
                >
                  <a-option :value="0">否</a-option>
                  <a-option :value="1">是</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="标准拆零价" field="splitPrice">
                <a-input-number
                  v-model="form.splitPrice"
                  placeholder="请输入标准拆零价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="拆零单位" field="splitUnit">
                <a-select
                  v-model="form.splitUnit"
                  placeholder="请选择拆零单位"
                  allow-clear
                >
                  <a-option
                    v-for="item in unit"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="拆零比" field="splitRatio">
                <a-input-number
                  v-model="form.splitRatio"
                  placeholder="请输入拆零比"
                  :min="0"
                  :max="999"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="税率(%)" field="taxRate">
                <a-input-number
                  v-model="form.taxRate"
                  placeholder="请输入税率(%)"
                  :min="0"
                  :max="999"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="是否特价" field="isSpecialPrice">
                <a-select
                  v-model="form.isSpecialPrice"
                  placeholder="请选择是否特价"
                  allow-clear
                >
                  <a-option :value="0">否</a-option>
                  <a-option :value="1">是</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="建议零售价" field="suggestRetailPrice">
                <a-input-number
                  v-model="form.suggestRetailPrice"
                  placeholder="请输入建议零售价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="单价加价系数" field="priceCoefficient">
                <a-input-number
                  v-model="form.priceCoefficient"
                  placeholder="请输入单价加价系数,进货单价*系数，系数大于 1"
                  :min="1"
                  :max="999"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="首营供应商" field="firstSupplierId">
                <a-input
                  v-model="form.firstSupplierId"
                  placeholder="请输入首营供应商"
                  :max-length="32"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="最高零售价" field="maxRetailPrice">
                <a-input-number
                  v-model="form.maxRetailPrice"
                  placeholder="请输入最高零售价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="批发价" field="wholesalePrice">
                <a-input-number
                  v-model="form.wholesalePrice"
                  placeholder="请输入批发价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="出厂价" field="factoryPrice">
                <a-input-number
                  v-model="form.factoryPrice"
                  placeholder="请输入出厂价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="集采价" field="collectPrice">
                <a-input-number
                  v-model="form.collectPrice"
                  placeholder="请输入集采价"
                  :precision="2"
                  :min="0"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- ==================== 商品属性 ==================== -->
        <a-tab-pane key="goodsAttribute" title="商品属性">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="大分类属性" field="mainCategoryAttr">
                <a-select
                  v-model="form.mainCategoryAttr"
                  placeholder="请选择大分类属性"
                  allow-clear
                >
                  <a-option
                    v-for="item in majorCategoryAttributes"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="功能属性分类" field="funcAttr">
                <a-select
                  v-model="form.funcAttr"
                  placeholder="请选择功能属性分类"
                  allow-clear
                >
                  <a-option
                    v-for="item in funcAttributeCategory"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="给药途径属性" field="adminRouteAttr">
                <a-select
                  v-model="form.adminRouteAttr"
                  placeholder="请选择给药途径属性"
                  allow-clear
                >
                  <a-option :value="1">内服</a-option>
                  <a-option :value="2">外服</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="中西药属性" field="chineseWesternAttr">
                <a-select
                  v-model="form.chineseWesternAttr"
                  placeholder="请选择中西药属性"
                  allow-clear
                >
                  <a-option :value="1">中药</a-option>
                  <a-option :value="2">西药</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="基药属性" field="baseDrugAttr">
                <a-select
                  v-model="form.baseDrugAttr"
                  placeholder="请选择基药属性"
                  allow-clear
                >
                  <a-option :value="1">基药</a-option>
                  <a-option :value="2">非基药</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="ABC属性" field="abcAttr">
                <a-select
                  v-model="form.abcAttr"
                  placeholder="请选择ABC属性"
                  allow-clear
                >
                  <a-option
                    v-for="item in ABCattributes"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="经营关注属性" field="businessAttr">
                <a-select
                  v-model="form.businessAttr"
                  placeholder="请选择经营关注属性"
                  allow-clear
                >
                  <a-option
                    v-for="item in businessFocusAttribute"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="商品详细分类" field="goodsDetailClassify">
                <a-select
                  v-model="form.goodsDetailClassify"
                  placeholder="请选择商品详细分类"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性3" field="drugAttr3">
                <a-select
                  v-model="form.drugAttr3"
                  placeholder="请选择药品其他属性3"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性4" field="drugAttr4">
                <a-select
                  v-model="form.drugAttr4"
                  placeholder="请选择药品其他属性4"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性5" field="drugAttr5">
                <a-select
                  v-model="form.drugAttr5"
                  placeholder="请选择药品其他属性5"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性6" field="drugAttr6">
                <a-select
                  v-model="form.drugAttr6"
                  placeholder="请选择药品其他属性6"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性7" field="drugAttr7">
                <a-select
                  v-model="form.drugAttr7"
                  placeholder="请选择药品其他属性7"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性8" field="drugAttr8">
                <a-select
                  v-model="form.drugAttr8"
                  placeholder="请选择药品其他属性8"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性9" field="drugAttr9">
                <a-select
                  v-model="form.drugAttr9"
                  placeholder="请选择药品其他属性9"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="药品其他属性10" field="drugAttr10">
                <a-select
                  v-model="form.drugAttr10"
                  placeholder="请选择药品其他属性10"
                  allow-clear
                >
                  <a-option
                    v-for="item in productDetailedClass"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="兴奋剂成分" field="stimulantAttr">
                <a-select
                  v-model="form.stimulantAttr"
                  placeholder="请选择兴奋剂成分"
                  allow-clear
                >
                  <a-option value="0">不包含</a-option>
                  <a-option value="1">包含</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="certs" title="证照信息">
          <div style="margin-bottom: 12px">
            <a-button type="primary" size="small" @click="openAddCertModal">
              <template #icon><icon-plus /></template>
              添加证照
            </a-button>
          </div>
          <a-table
            :columns="certColumns"
            :data="form.certs"
            :pagination="false"
            bordered
          >
            <template #validEndDate="{ record }">
              {{ record.validEndDate || '-' }}
            </template>
            <template #fileUrl="{ record }">
              <a-link
                v-if="record.fileUrl"
                :href="record.fileUrl"
                target="_blank"
              >
                {{ getFileNameFromUrl(record.fileUrl) }}
              </a-link>
              <span v-else>-</span>
            </template>
            <template #operation="{ rowIndex }">
              <a-space>
                <a-button
                  type="text"
                  size="small"
                  @click="openEditCertModal(rowIndex)"
                >
                  <template #icon><icon-edit /></template>
                  编辑
                </a-button>
                <a-popconfirm
                  content="确认删除该证照？"
                  @ok="removeCert(rowIndex)"
                >
                  <a-button type="text" status="danger" size="small">
                    <template #icon><icon-delete /></template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>

          <!-- 证照添加/编辑弹窗 -->
          <a-modal
            v-model:visible="certModalVisible"
            :title="editingCertIndex === -1 ? '添加证照' : '编辑证照'"
            width="520px"
            @before-ok="handleCertModalOk"
            @cancel="handleCertModalCancel"
          >
            <a-form
              ref="certFormRef"
              :model="certForm"
              :rules="certFormRules"
              auto-label-width
            >
              <a-form-item label="证件名称" field="certName">
                <a-input
                  v-model="certForm.certName"
                  placeholder="请输入证件名称"
                />
              </a-form-item>
              <a-form-item label="证件编号" field="certNo">
                <a-input
                  v-model="certForm.certNo"
                  placeholder="请输入证件编号"
                />
              </a-form-item>
              <a-form-item label="有效期" field="validEndDate">
                <a-date-picker
                  v-model="certForm.validEndDate"
                  placeholder="请选择有效期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </a-form-item>
              <a-form-item label="上传文件" field="fileUrl">
                <div class="cert-upload">
                  <a-upload
                    v-if="!certForm.fileUrl"
                    :custom-request="(options: any) => handleCertUpload(options)"
                    :show-file-list="false"
                    :limit="1"
                  >
                    <a-button type="outline">上传文件</a-button>
                  </a-upload>
                  <div v-else class="cert-file-item">
                    <span class="cert-file-name" :title="certForm.fileUrl">
                      {{ getFileNameFromUrl(certForm.fileUrl) }}
                    </span>
                    <a-button
                      type="text"
                      size="mini"
                      title="预览文件"
                      @click="previewFile(certForm.fileUrl)"
                    >
                      <template #icon><icon-eye /></template>
                    </a-button>
                    <a-button
                      type="text"
                      status="danger"
                      size="mini"
                      @click="certForm.fileUrl = ''"
                    >
                      <template #icon><icon-delete /></template>
                    </a-button>
                  </div>
                </div>
              </a-form-item>
            </a-form>
          </a-modal>
        </a-tab-pane>

        <a-tab-pane key="otherInfo" title="其他信息">
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="英文名" field="englishName">
                <a-input
                  v-model="form.englishName"
                  placeholder="请输入英文名"
                  :max-length="256"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="化学名" field="chemicalName">
                <a-input
                  v-model="form.chemicalName"
                  placeholder="请输入化学名"
                  :max-length="256"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="拉丁名" field="latinName">
                <a-input
                  v-model="form.latinName"
                  placeholder="请输入拉丁名"
                  :max-length="256"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="剂量" field="dosage">
                <a-input
                  v-model="form.dosage"
                  placeholder="请输入剂量"
                  :max-length="128"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="用量单位" field="doseUnit">
                <a-select
                  v-model="form.doseUnit"
                  placeholder="请选择用量单位"
                  allow-clear
                >
                  <a-option
                    v-for="item in usageUnit"
                    :key="item.dictValue"
                    :value="item.dictValue"
                  >
                    {{ item.dictLabel }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="频次" field="frequency">
                <a-input
                  v-model="form.frequency"
                  placeholder="请输入频次"
                  :max-length="64"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="单周期天数" field="cycleDays">
                <a-input-number
                  v-model="form.cycleDays"
                  placeholder="请输入单周期天数"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="单周期用药次数" field="cycleTimes">
                <a-input-number
                  v-model="form.cycleTimes"
                  placeholder="请输入单周期用药次数"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="生效开始时间" field="effectStartDate">
                <a-date-picker
                  v-model="form.effectStartDate"
                  placeholder="请选择生效开始时间"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="生效结束时间" field="effectEndDate">
                <a-date-picker
                  v-model="form.effectEndDate"
                  placeholder="请选择生效结束时间"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="扩展类型" field="extendType">
                <a-select
                  v-model="form.extendType"
                  placeholder="请选择扩展类型"
                >
                  <a-option
                    v-for="item in extensionType"
                    :key="item.dictValue"
                    :value="item.dictValue"
                  >
                    {{ item.dictLabel }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
              <a-form-item label="用法用量" field="usageDosage">
                <a-input
                  v-model="form.usageDosage"
                  placeholder="请输入用法用量"
                  :max-length="256"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="炮制方法" field="processingMethod">
                <a-textarea
                  v-model="form.processingMethod"
                  placeholder="请输入炮制方法"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="功效" field="efficacy">
                <a-textarea
                  v-model="form.efficacy"
                  placeholder="请输入功效"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="药材科 (族) 来源" field="herbFamilySource">
                <a-textarea
                  v-model="form.herbFamilySource"
                  placeholder="请输入药材科 (族) 来源"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="药材种来源" field="herbSpeciesSource">
                <a-textarea
                  v-model="form.herbSpeciesSource"
                  placeholder="请输入药材种来源"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="药用部位" field="medicinalPart">
                <a-textarea
                  v-model="form.medicinalPart"
                  placeholder="请输入药用部位"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="性状" field="propertyDescription">
                <a-textarea
                  v-model="form.propertyDescription"
                  placeholder="请输入性状"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="主要成分" field="mainIngredients">
                <a-textarea
                  v-model="form.mainIngredients"
                  placeholder="请输入主要成分"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="主治功能" field="mainFunction">
                <a-textarea
                  v-model="form.mainFunction"
                  placeholder="请输入主治功能"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item label="适应症" field="indications">
                <a-textarea
                  v-model="form.indications"
                  placeholder="请输入适应症"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="goodsAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="goodsAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { RequestOption } from '@arco-design/web-vue/es/upload/interfaces';
  import { useGoodsAddOrEditStore } from '@/store/modules/business/goods/goods/goodsAddOrEditStore';
  import { useCategoryStore } from '@/store/modules/business/goods/category/categoryStore';
  import { useDicts } from '@/hooks/dict';
  import { sysFilesApi } from '@/api/sys/files';
  import { usePartnerStore } from '@/store/modules/business/partner/partner/partnerStore';

  const goodsAddOrEditStore = useGoodsAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } =
    storeToRefs(goodsAddOrEditStore);

  const { goodsCategoryList } = storeToRefs(useCategoryStore());

  const { partnerList, supplierList } = storeToRefs(usePartnerStore());

  // dosageType-剂型, unit-单位, productCategory-商品分类, pricingTier-收费等级，majorCategoryAttributes-大分类属性， funcAttributeCategory-功能属性分类
  // ABCattributes-ABC属性，businessFocusAttribute-经营关注属性，productDetailedClass-商品详细分类, usageUnit-用量单位，extensionType-扩展类型
  const {
    dosageType,
    unit,
    productCategory,
    pricingTier,
    majorCategoryAttributes,
    funcAttributeCategory,
    ABCattributes,
    businessFocusAttribute,
    productDetailedClass,
    usageUnit,
    extensionType,
  } = useDicts(
    'dosageType',
    'unit',
    'productCategory',
    'pricingTier',
    'majorCategoryAttributes',
    'funcAttributeCategory',
    'ABCattributes',
    'businessFocusAttribute',
    'productDetailedClass',
    'usageUnit',
    'extensionType',
  );

  const certColumns: TableColumnData[] = [
    { title: '证件名称', dataIndex: 'certName', width: 180 },
    { title: '证件编号', dataIndex: 'certNo', width: 180 },
    { title: '有效期', slotName: 'validEndDate', width: 200 },
    { title: '上传文件', slotName: 'fileUrl' },
    {
      title: '操作',
      slotName: 'operation',
      width: 160,
      fixed: 'right' as const,
    },
  ];

  const removeCert = (index: number) => {
    goodsAddOrEditStore.removeCert(index);
  };

  // ==================== 证照弹窗 ====================
  const certModalVisible = ref(false);
  const editingCertIndex = ref(-1);
  const certFormRef = ref<any>(null);

  const certForm = reactive({
    certName: '',
    certNo: '',
    validEndDate: undefined as string | undefined,
    fileUrl: '',
  });

  const certFormRules = {
    certName: [{ required: true, message: '请输入证件名称' }],
    certNo: [{ required: true, message: '请输入证件编号' }],
    validEndDate: [{ required: true, message: '请选择有效期' }],
    fileUrl: [{ required: true, message: '请上传文件' }],
  };

  const resetCertForm = () => {
    certForm.certName = '';
    certForm.certNo = '';
    certForm.validEndDate = undefined;
    certForm.fileUrl = '';
    certFormRef.value?.resetFields();
  };

  const openAddCertModal = () => {
    resetCertForm();
    editingCertIndex.value = -1;
    certModalVisible.value = true;
  };

  const openEditCertModal = (index: number) => {
    const cert = form.value.certs[index];
    if (!cert) return;
    certForm.certName = cert.certName;
    certForm.certNo = cert.certNo;
    certForm.validEndDate = cert.validEndDate;
    certForm.fileUrl = cert.fileUrl;
    certFormRef.value?.clearValidate();
    editingCertIndex.value = index;
    certModalVisible.value = true;
  };

  const handleCertModalOk = async (): Promise<boolean> => {
    const errors = await certFormRef.value?.validate();
    if (errors) return false;

    if (editingCertIndex.value === -1) {
      goodsAddOrEditStore.addCert();
      const newIndex = form.value.certs.length - 1;
      const newCert = form.value.certs[newIndex];
      newCert.certName = certForm.certName;
      newCert.certNo = certForm.certNo;
      newCert.validEndDate = certForm.validEndDate;
      newCert.fileUrl = certForm.fileUrl;
    } else {
      const cert = form.value.certs[editingCertIndex.value];
      cert.certName = certForm.certName;
      cert.certNo = certForm.certNo;
      cert.validEndDate = certForm.validEndDate;
      cert.fileUrl = certForm.fileUrl;
    }

    certModalVisible.value = false;
    resetCertForm();
    return true;
  };

  const handleCertModalCancel = () => {
    certModalVisible.value = false;
    resetCertForm();
  };

  const handleCertUpload = (options: RequestOption): { abort: () => void } => {
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options;
    const formData = new FormData();
    formData.append(name as string, fileItem.file as Blob);
    onProgress(20);
    sysFilesApi
      .upload(formData)
      .then((res) => {
        if (res?.data?.fileUrl) {
          certForm.fileUrl = res.data.fileUrl;
        }
        onSuccess(res);
      })
      .catch((error) => {
        onError(error);
      });
    return { abort: () => {} };
  };

  const getFileNameFromUrl = (url: string): string => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1] || url;
  };

  const previewFile = (url: string) => {
    window.open(url, '_blank');
  };

  const emits = defineEmits(['refresh']);

  onMounted(() => {
    useCategoryStore().fetchGoodsCategoryList();
    usePartnerStore().getpartnerList();
    usePartnerStore().getSupplierList();
  });

  defineExpose({
    init: goodsAddOrEditStore.init,
    form,
  });
</script>
