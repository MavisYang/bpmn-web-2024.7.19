/*
 * @Author: yangmiaomiao
 * @Date: 2024-07-19 13:26:56
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-19 17:17:55
 * @Description:
 */
/// <reference types="vite/client" />

interface Window {
  readonly PKG: Record<string, string>;
}
declare module 'inherits';

declare module 'bpmn-js/lib/Modeler';

declare module 'bpmn-js-properties-panel';

declare module '*.js';

declare module 'bpmn-js-properties-panel/lib/provider/camunda';
