import Container from './Container';

type ExtendsAppConfigOptions = { appConfig: any };
type ExtendsPageConfigOptions = { pageConfig: any };
type GetSyntheticEventIdOptions = { nativeEvent: any };
type IsNewSyntheticEventOptions = { nativeEvent: any };
type OnUpdateActionOptions = { container: Container };
type OnUnloadOptions = { container: Container };

export interface RemaxRuntimePluginConfig {
  /**
   * 扩展原生 app 实例
   * @param options
   * @param options.appConfig 原生 app 实例
   * @return 返回扩展后的 app 实例
   *
   */
  extendsAppConfig?: (options: ExtendsAppConfigOptions) => any;
  /**
   * 扩展原生 page 实例
   * @param options
   * @param options.pageConfig 原生 page 实例
   * @return 返回扩展后的 page 实例
   *
   */
  extendsPageConfig?: (options: ExtendsPageConfigOptions) => any;
  /**
   * 根据原生事件生成对应合成事件ID
   * @param options
   * @param options.nativeEvent 原生事件
   * @return 合成事件唯一 ID
   */
  getSyntheticEventId?: (options: GetSyntheticEventIdOptions) => string;
  /**
   * 根据原生事件判断是不是新的合成事件流
   * @param options
   * @param options.nativeEvent 原生事件
   * @return boolean
   */
  isNewSyntheticEvent?: (options: IsNewSyntheticEventOptions) => boolean;
  /**
   * 自定义执行 setData 时发起的 update action
   * @param options
   * @param options.container 发起 setData 操作的 Container
   * @return 返回创建的 action
   *
   */
  onUpdateAction?: (options: OnUpdateActionOptions) => any;
  /**
   * Container 卸载时生命周期
   * @param options
   * @param options.container 被卸载的 Container
   */
  onUnload?: (options: OnUnloadOptions) => void;
}
