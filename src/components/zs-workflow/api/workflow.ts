/**
 * 工作流设计器 API 接口 - 复用项目已有的 API
 */
import { bpmSettingModelApi } from '@/api/bpm/setting/model';

// 导出项目已有的模型 API
export const workflowApi = {
  /**
   * 获取流程模型
   * @param id 流程模型 ID
   */
  getModelById: bpmSettingModelApi.getModelById,

  /**
   * 保存流程模型
   * @param data 流程模型数据
   */
  saveModel: bpmSettingModelApi.saveModel,

  /**
   * 更新流程模型
   * @param data 流程模型数据
   */
  updateModel: bpmSettingModelApi.updateModel,

  /**
   * 发布流程模型
   * @param id 流程模型 ID
   */
  deployModel: bpmSettingModelApi.deployModel,
};

// 导出默认对象
export default workflowApi;
