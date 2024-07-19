import { assign } from "min-dash";

export default function PaletteProvider(
  palette,
  create,
  elementFactory,
  handTool,
  lassoTool,
  spaceTool,
  globalConnect,
  translate
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.handTool = handTool;
  this.lassoTool = lassoTool;
  this.spaceTool = spaceTool;
  this.globalConnect = globalConnect;
  this.translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "handTool",
  "lassoTool",
  "spaceTool",
  "globalConnect",
  "translate"
];

PaletteProvider.prototype.getPaletteEntries = function (element) {
  const {
    create,
    elementFactory,
    handTool,
    lassoTool,
    spaceTool,
    globalConnect,
    translate
  } = this;

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, "");

    return {
      group: group,
      className: className,
      title: title || translate("Create {type}", { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  return {
    "lasso-tool": {
      /*
       * https://zhuanlan.zhihu.com/p/428391444
       * group： 定义这个shape属于哪个组，主要有tools、event、gateway和activity可以选择
       * className： 定义这个shape的chass名称，可以通过这个class给shape指定具体的样式
       * title： 定义这个shape的title，也就是鼠标移动到shape上的提示
       * action： 用户操作时触发的事件
       */
      group: "tools",
      className: "bpmn-icon-lasso-tool",
      title: "选中",
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        }
      }
    },

    "tool-separator": {
      group: "tools",
      separator: true
    },

    "create.start-event": createAction(
      "bpmn:StartEvent",
      "event",
      "bpmn-icon-start-event-none",
      "开始"
    ),
    "create.end-event": createAction(
      "bpmn:EndEvent",
      "event",
      "bpmn-icon-end-event-none",
      "结束"
    ),
    "create.user-task": createAction(
      "bpmn:UserTask",
      "activity",
      "bpmn-icon-user-task",
      "用户任务"
    ),
    "create.service-task": createAction(
      "bpmn:ServiceTask",
      "activity",
      "bpmn-icon-service-task",
      "远程服务"
    ),
    "create.exclusive-gateway": createAction(
      "bpmn:ExclusiveGateway",
      "gateway",
      "bpmn-icon-gateway-xor",
      "排他网关"
    )
  };
};