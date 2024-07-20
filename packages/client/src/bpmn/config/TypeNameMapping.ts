//流程类型名称匹配
import { getTranslatorFn } from "../i18n/translate";
import { ModdleElement } from "../type";

const translatorFn = getTranslatorFn("en");

export const ProcessNameMapping = {
    //流程
    "bpmn:Process": translatorFn("Process"),
    //子流程
    "bpmn:SubProcess": translatorFn("Sub Process"),
};

// 事件名字匹配
export const EventNameMapping = {
    "bpmn:StartEvent": translatorFn("Start Event"),
    "bpmn:EndEvent": translatorFn("End Event"),
    "bpmn:MessageEventDefinition": translatorFn("Message Event"),
    "bpmn:TimerEventDefinition": translatorFn("Timer Event"),
    "bpmn:ConditionalEventDefinition": translatorFn("Conditional Event"),
    "bpmn:SignalEventDefinition": translatorFn("Signal Event"),
};

//流名称匹配
export const FlowNameMapping = {
    "bpmn:SequenceFlow": (businessObject: ModdleElement) => {
        const defaultName = translatorFn("Sequence Flow");
        if (businessObject.conditionExpression) {
            return translatorFn("Condition Expression") + defaultName;
        }

        if (businessObject.sourceRef.default) {
            return translatorFn("Default") + defaultName;
        }

        return defaultName;
    },
};

//网关类型名称匹配
export const GatewayNameMapping = {
    //互斥网关
    "bpmn:ExclusiveGateway": translatorFn("Exclusive Gateway"),
    //并行网关
    "bpmn:ParallelGateway": translatorFn("Parallel Gateway"),
    //复杂网关
    "bpmn:ComplexGateway": translatorFn("Complex Gateway"),
    //事件网关
    "bpmn:EventBasedGateway": translatorFn("Event Based Gateway"),
};

//任务类型名称匹配
export const TaskNameMapping = {
    //普通任务
    "bpmn:Task": translatorFn("Task"),
    //用户任务
    "bpmn:UserTask": translatorFn("User Task"),
    //接收任务
    "bpmn:ReceiveTask": translatorFn("Receive Task"),
    //发送任务
    "bpmn:SendTask": translatorFn("Send Task"),
    //手工任务
    "bpmn:ManualTask": translatorFn("Manual Task"),
    //业务规则任务
    "bpmn:BusinessRuleTask": translatorFn("Business Rule Task"),
    //服务任务
    "bpmn:ServiceTask": translatorFn("Service Task"),
    //脚本任务
    "bpmn:ScriptTask": translatorFn("Script Task"),
    //调用任务
    "bpmn:CallActivity": translatorFn("Call Activity"),
};

//其他类型名称匹配
export const OtherNameMapping = {
    //池
    "bpmn:Participant": translatorFn("Participant"),
    //分组
    "bpmn:Group": translatorFn("Group"),
    //数据存储
    "bpmn:DataStoreReference": translatorFn("Date Store Reference"),
    //数据对象
    "bpmn:DataObjectReference": translatorFn("Date Object Reference"),
};

export const NameMapping: { [key: string]: ((obj: any) => string) | string } = {
    ...ProcessNameMapping,
    ...EventNameMapping,
    ...FlowNameMapping,
    ...GatewayNameMapping,
    ...TaskNameMapping,
    ...OtherNameMapping,
};

/**
 * 根据流程类型节点业务对象解析业务对象节点类型的名称
 * @param businessObject 节点的业务流程对象
 */
export const resolveTypeName = (businessObject: ModdleElement): string => {
    const eventDefinitions = businessObject.eventDefinitions;
    const nameMappingElement = NameMapping[businessObject.$type];
    if (typeof nameMappingElement === "function") {
        return nameMappingElement(businessObject);
    }
    return eventDefinitions
        ? NameMapping[eventDefinitions[0].$type] + nameMappingElement
        : nameMappingElement;
};
