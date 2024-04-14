import PrefixLabelSelect from "@/components/prefix-label-select";
import { ElInput, ElOption } from "element-plus";
import { BpmnStore } from "../../store";
import { ModdleElement } from "../../type";
import {
    CommonGroupProperties,
    DocumentGroupProperties,
    ExtensionGroupProperties,
    FormGroupProperties,
    getElementTypeListenerProperties,
} from "../common";
import { GroupProperties } from "../index";

const TASK_EVENT_OPTIONS = [
    { label: "Create", value: "create" },
    { label: "Assignment", value: "assignment" },
    { label: "Complete", value: "complete" },
    { label: "Delete", value: "delete" },
    { label: "All", value: "all" },
];

const TaskListenerProperties = getElementTypeListenerProperties({
    name: "Listeners",
    eventOptions: TASK_EVENT_OPTIONS,
});

const USER_OPTIONS = [
    { label: "User A", value: "1" },
    { label: "User B", value: "2" },
    { label: "User C", value: "3" },
];

const UserOption: JSX.Element = (
    <>
        {USER_OPTIONS.map((item) => {
            return <ElOption {...item} />;
        })}
    </>
);

/**
 * 用户任务属性配置
 */
export const BpmnUserGroupProperties: GroupProperties = {
    name: "User Assignment",
    icon: "el-icon-user-solid",
    properties: {
        /**
         * 处理人属性
         */
        assignee: {
            component: ElInput,
            vSlots: {
                prepend: (): JSX.Element => <div>Assignee</div>,
            },
        },
        /**
         * 候选人属性
         */
        candidateGroups: {
            component: ElInput,
            vSlots: {
                prepend: (): JSX.Element => <div>Candidate Groups</div>,
            },
        },
        /**
         * 循环基数
         */
        loopCardinality: {
            component: ElInput,
            placeholder: "Loop Cardinality",
            type: "number",
            vSlots: {
                prepend: (): JSX.Element => <div>Loop Cardinality</div>,
            },
            predicate(businessObject: ModdleElement): boolean {
                return businessObject.loopCharacteristics;
            },
            getValue(businessObject: ModdleElement): string {
                const loopCharacteristics = businessObject.loopCharacteristics;
                if (!loopCharacteristics) {
                    return "";
                }
                return loopCharacteristics.loopCardinality?.body;
            },
            setValue(
                businessObject: ModdleElement,
                key: string,
                value: string
            ): void {
                const moddle = BpmnStore.getModeler().get("moddle");
                const loopCharacteristics = businessObject.loopCharacteristics;
                loopCharacteristics.loopCardinality = moddle.create(
                    "bpmn:FormalExpression",
                    {
                        body: value,
                    }
                );
                BpmnStore.updateProperties(BpmnStore.getShape(), {
                    loopCharacteristics: loopCharacteristics,
                });
            },
        },
        /**
         * 多实例完成条件
         * nr是number单词缩写
         * 1.nrOfInstances  实例总数。
         * 2.nrOfCompletedInstances  已经完成的实例个数
         * 3.loopCounter 已经循环的次数。
         * 4.nrOfActiveInstances 当前还没有完成的实例
         */
        completionCondition: {
            component: ElInput,
            placeholder:
                "For example: ${nrOfCompletedInstances/nrOfInstances >= 0.25}",
            vSlots: {
                prepend: (): JSX.Element => <div>Finish Condition</div>,
            },
            predicate(businessObject: ModdleElement): boolean {
                return businessObject.loopCharacteristics;
            },
            getValue(businessObject: ModdleElement): string {
                const loopCharacteristics = businessObject.loopCharacteristics;
                if (!loopCharacteristics) {
                    return "";
                }
                return loopCharacteristics.completionCondition?.body;
            },
            setValue(
                businessObject: ModdleElement,
                key: string,
                value: string
            ): void {
                const bpmnContext = BpmnStore;
                const moddle = bpmnContext.getModeler().get("moddle");
                const loopCharacteristics = businessObject.loopCharacteristics;
                loopCharacteristics.completionCondition = moddle.create(
                    "bpmn:FormalExpression",
                    {
                        body: value,
                    }
                );
                bpmnContext.updateProperties(bpmnContext.getShape(), {
                    loopCharacteristics: loopCharacteristics,
                });
            },
        },
    },
};

const LOOP_OPTIONS = [
    { label: "Null", value: "Null" },
    { label: "Parallel", value: "Parallel" },
    { label: "Sequential", value: "Sequential" },
    { label: "StandardLoop", value: "StandardLoop" },
];

const LoopOptions: JSX.Element = (
    <>
        {LOOP_OPTIONS.map((item) => {
            return <ElOption {...item} />;
        })}
    </>
);
/**
 * 任务的基本属性配置
 */
const BaseTaskProperties = {
    ...CommonGroupProperties,
    properties: {
        ...CommonGroupProperties.properties,
        loopCharacteristics: {
            component: PrefixLabelSelect,
            prefixTitle: "Loop Characteristics",
            vSlots: {
                default: (): JSX.Element => LoopOptions,
            },
            getValue(businessObject: ModdleElement): string {
                const loopCharacteristics = businessObject.loopCharacteristics;
                if (!loopCharacteristics) {
                    return "Null";
                }

                if (
                    loopCharacteristics.$type ===
                    "bpmn:MultiInstanceLoopCharacteristics"
                ) {
                    return loopCharacteristics.isSequential
                        ? "Sequential"
                        : "Parallel";
                } else {
                    return "StandardLoop";
                }
            },
            setValue(
                businessObject: ModdleElement,
                key: string,
                value: string
            ): () => void {
                const shape = BpmnStore.getShape();
                switch (value) {
                    case "Null":
                        BpmnStore.updateProperties(shape, {
                            loopCharacteristics: null,
                        });
                        // delete businessObject.loopCharacteristics;
                        break;
                    case "StandardLoop":
                        BpmnStore.createElement(
                            "bpmn:StandardLoopCharacteristics",
                            "loopCharacteristics"
                        );
                        break;
                    default:
                        BpmnStore.createElement(
                            "bpmn:MultiInstanceLoopCharacteristics",
                            "loopCharacteristics",
                            {
                                isSequential: value === "Sequential",
                            }
                        );
                }
                return () => BpmnStore.refresh();
            },
        },
    },
};

const ServiceTaskBasicProperties = {
    ...BaseTaskProperties,
    properties: {
        ...BaseTaskProperties.properties,
        delegateExpression: {
            component: ElInput,
            prefixTitle: "Delegate Expression",
            vSlots: {
                prepend: (): JSX.Element => <div>Delegate Expression</div>,
            },
        },
    },
};

const CommonGroupPropertiesArray = [
    BaseTaskProperties,
    TaskListenerProperties,
    ExtensionGroupProperties,
    DocumentGroupProperties,
];

export default {
    //普通任务
    "bpmn:Task": CommonGroupPropertiesArray,
    //用户任务
    "bpmn:UserTask": [
        BaseTaskProperties,
        BpmnUserGroupProperties,
        TaskListenerProperties,
        FormGroupProperties,
        ExtensionGroupProperties,
        DocumentGroupProperties,
    ],
    //接收任务
    "bpmn:ReceiveTask": CommonGroupPropertiesArray,
    //发送任务
    "bpmn:SendTask": CommonGroupPropertiesArray,
    //手工任务
    "bpmn:ManualTask": CommonGroupPropertiesArray,
    //业务规则任务
    "bpmn:BusinessRuleTask": CommonGroupPropertiesArray,
    //服务任务
    "bpmn:ServiceTask": [
        ServiceTaskBasicProperties,
        TaskListenerProperties,
        ExtensionGroupProperties,
        DocumentGroupProperties,
    ],
    //脚本任务
    "bpmn:ScriptTask": CommonGroupPropertiesArray,
    //调用任务
    "bpmn:CallActivity": CommonGroupPropertiesArray,
};
