/*
 * @Author: yangmiaomiao
 * @Date: 2024-07-19 13:26:56
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-22 09:49:48
 * @Description: bpmn-js自定义之Modeler以及相关引用
 */
import inherits from 'inherits';
import Modeler from 'bpmn-js/lib/Modeler';
import CustomModule from './custom';

function CustomModeler(options) {
  Modeler.call(this, options);

  this._customElements = [];
}

inherits(CustomModeler, Modeler);

//pmn.js提供的默认扩展包名称，可以在this.bpmnModeler.proto._modules内找到，一共开放了32个扩展包。
//扩展包名称可以在this.bpmnModeler.injector._providers内，包名即键名
CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [CustomModule]);

export { CustomModeler };
