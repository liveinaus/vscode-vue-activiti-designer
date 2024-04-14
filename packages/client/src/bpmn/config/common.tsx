import { FieldDefine } from "@/components/dynamic-binder";
import { SubListState } from "@/components/sublist/type";
import { ElFormItem, ElInput, ElOption, ElSelect } from "element-plus";
import SubList from "../../components/sublist/SubList";
import { getTranslatorFn } from "../i18n/translate";
import { BpmnStore } from "../store";
import { ModdleElement } from "../type";
import { GroupProperties, PropertiesMap } from "./index";
const translatorFn = getTranslatorFn("en");

/**
 * 所有通用节点的属性（每个节点都有的）
 */
const commonProperties: PropertiesMap<FieldDefine> = {
    id: {
        component: ElInput,
        placeholder: translatorFn("Element ID"),
        vSlots: {
            prepend: (): JSX.Element => <div>Element ID</div>,
        },
        setValue(sourceObject: ModdleElement, key: string, value: string) {
            const isNotNull = value;
            const latestValue = value || " ";
            const shape = BpmnStore.getShape();
            BpmnStore.updateProperties(shape, {
                [key]: isNotNull ? latestValue.trim() : latestValue,
            });
        },
    },
    name: {
        component: ElInput,
        // prefix: '节点名称',
        placeholder: "Element Name",
        vSlots: {
            prepend: (): JSX.Element => <div>Element Name</div>,
        },
    },
};

/**
 * （基础信息）每个节点都有的
 */
export const CommonGroupProperties: GroupProperties = {
    name: "Information",
    icon: "el-icon-info",
    properties: { ...commonProperties },
};

interface Documentation {
    text: string;
}

export const DocumentGroupProperties: GroupProperties = {
    name: "Element Documentation",
    icon: "el-icon-document",
    properties: {
        "documentation.text": {
            component: ElInput,
            type: "textarea",
            getValue: (obj: {
                documentation: Array<Documentation>;
            }): string => {
                return obj["documentation"]?.[0]?.["text"] ?? "";
            },
            setValue(
                businessObject: ModdleElement,
                key: string,
                value: unknown
            ): void {
                BpmnStore.createElement(
                    "bpmn:Documentation",
                    "documentation",
                    { text: value },
                    true
                );
            },
        },
    },
};

interface PropertyElement {
    $type: string;
    name: string;
    value: unknown;
}

/**
 * 流程事件类型选项
 */
const EVENT_OPTIONS = [
    { label: "Start", value: "start" },
    { label: "End", value: "end" },
];

/**
 * 监听器类型选项
 */
const TYPE_OPTIONS = [
    { label: "Java Expression", value: "class" },
    { label: "Expression", value: "expression" },
    { label: "Delegate Expression", value: "delegateExpression" },
];

/**
 * 获取节点类型的监听器属性配置组
 * @param options 参数
 */
import { TaskNameMapping } from "./TypeNameMapping";

const taskTags = Object.keys(TaskNameMapping);
export const getElementTypeListenerProperties = function (options: {
    name: string;
    icon?: string;
    //时间类型选项
    eventOptions?: Array<{ label: string; value: string }>;
}): GroupProperties {
    const eventOptions = options.eventOptions || EVENT_OPTIONS;
    return {
        name: options.name || "Listeners",
        icon: options.icon || "el-icon-bell",
        properties: {
            "extensionElements.listeners": {
                component: SubList,
                columns: [
                    {
                        type: "index",
                        label: "Index",
                        align: "center",
                    },
                    {
                        prop: "event",
                        label: "Event",
                        align: "center",
                        formatter: (row: any, column: any): string => {
                            return eventOptions.filter(
                                (item) => item.value === row[column.property]
                            )[0].label;
                        },
                        editComponent: function (
                            scope: any,
                            state: SubListState<any>
                        ): JSX.Element {
                            return (
                                <ElFormItem
                                    size="small"
                                    class="sublist-form-item"
                                    label={scope.column.name}
                                    prop={scope.column.property}
                                >
                                    <ElSelect v-model={state.editItem.event}>
                                        {eventOptions.map((option) => {
                                            return (
                                                <ElOption
                                                    key={option.value}
                                                    label={option.label}
                                                    value={option.value}
                                                />
                                            );
                                        })}
                                    </ElSelect>
                                </ElFormItem>
                            );
                        },
                    },
                    {
                        prop: "type",
                        label: "Type",
                        align: "center",
                        formatter: (row: any, column: any) => {
                            return TYPE_OPTIONS.filter(
                                (item) => item.value === row[column.property]
                            )[0].label;
                        },
                        editComponent: function (
                            scope: any,
                            state: SubListState<any>
                        ): JSX.Element {
                            return (
                                <ElFormItem
                                    size="small"
                                    class="sublist-form-item"
                                    label={scope.column.name}
                                    prop={scope.column.property}
                                >
                                    <ElSelect v-model={state.editItem.type}>
                                        {TYPE_OPTIONS.map((option) => {
                                            return (
                                                <ElOption
                                                    key={option.value}
                                                    label={option.label}
                                                    value={option.value}
                                                />
                                            );
                                        })}
                                    </ElSelect>
                                </ElFormItem>
                            );
                        },
                    },
                    {
                        prop: "content",
                        label: "Value",
                        align: "center",
                    },
                ],
                rules: {
                    event: [
                        { required: true, message: "Event cannot be empty" },
                    ],
                    type: [{ required: true, message: "Type cannot be empty" }],
                    content: [
                        { required: true, message: "Value cannot be empty" },
                    ],
                },
                getValue: (businessObject: ModdleElement): Array<any> => {
                    const listenerTagName = taskTags?.includes(
                        businessObject.$type
                    )
                        ? "activiti:TaskListener"
                        : "activiti:ExecutionListener";
                    const listeners =
                        businessObject?.extensionElements?.values?.filter(
                            (item: ModdleElement) =>
                                item.$type === listenerTagName
                        );

                    return listeners
                        ? listeners?.map((item: ModdleElement) => {
                              const type = item.expression
                                  ? "expression"
                                  : item.delegateExpression
                                  ? "delegateExpression"
                                  : "class";
                              return {
                                  event: item.event,
                                  type: type,
                                  content: item[type],
                              };
                          })
                        : [];
                },
                setValue(
                    businessObject: ModdleElement,
                    key: string,
                    value: []
                ): void {
                    const bpmnContext = BpmnStore;
                    const moddle = bpmnContext.getModeler().get("moddle");
                    //判断当前活动的模型类型，使用不同类型的标签监听器
                    const listenerTagName = taskTags.includes(
                        businessObject.$type
                    )
                        ? "activiti:TaskListener"
                        : "activiti:ExecutionListener";
                    bpmnContext.updateExtensionElements(
                        listenerTagName,
                        value.map(
                            (attr: {
                                event: string;
                                type: string;
                                content: string;
                            }) => {
                                return moddle.create(listenerTagName, {
                                    event: attr.event,
                                    [attr.type]: attr.content,
                                });
                            }
                        )
                    );
                },
            },
        },
    };
};

/**
 * 扩展属性组配置
 */
export const ExtensionGroupProperties: GroupProperties = {
    name: "Extension Group Properties",
    icon: "el-icon-document-add",
    properties: {
        "extensionElements.properties": {
            component: SubList,
            columns: [
                {
                    type: "index",
                    label: "Index",
                    align: "center",
                },
                {
                    prop: "name",
                    label: "Name",
                    align: "center",
                },
                {
                    prop: "value",
                    label: "Value",
                    align: "center",
                },
            ],
            rules: {
                name: [{ required: true, message: "name cannot be empty" }],
                value: [{ required: true, message: "value cannot be empty" }],
            },
            getValue: (businessObject: ModdleElement): Array<any> => {
                const extProperties =
                    businessObject?.extensionElements?.values?.filter(
                        (item: PropertyElement) =>
                            item.$type === "activiti:Properties"
                    )[0]?.values;
                return extProperties
                    ? extProperties.map((item: PropertyElement) => ({
                          name: item.name,
                          value: item.value,
                      }))
                    : [];
            },
            setValue(
                businessObject: ModdleElement,
                key: string,
                value: []
            ): void {
                const bpmnContext = BpmnStore;
                const moddle = bpmnContext.getModeler().get("moddle");
                const properties = moddle.create(`activiti:Properties`, {
                    values: value.map(
                        (attr: { name: string; value: unknown }) => {
                            return moddle.create(`activiti:Property`, {
                                name: attr.name,
                                value: attr.value,
                            });
                        }
                    ),
                });
                bpmnContext.updateExtensionElements(
                    "activiti:Properties",
                    properties
                );
            },
        },
    },
};

interface FromPropertyElement {
    $type: string;
    id: string;
    type: string;
    $attrs: FromPropertyAttrsElement;
}

interface FromPropertyAttrsElement {
    name: string;
}

/**
 * （基础信息）表单
 */
export const FormGroupProperties: GroupProperties = {
    name: "Form Information",
    icon: "el-icon-edit",
    properties: {
        formKey: {
            component: ElInput,
            placeholder: "Form Key",
            vSlots: {
                prepend: (): JSX.Element => <div>Form Key</div>,
            },
        },
        "extensionElements.formProperty": {
            component: SubList,
            columns: [
                {
                    prop: "id",
                    label: "ID",
                    align: "center",
                },
                {
                    prop: "type",
                    label: "Type",
                    align: "center",
                },
                {
                    prop: "name",
                    label: "Name",
                    align: "center",
                },
            ],
            rules: {
                id: [{ required: true, message: "ID cannot be empty" }],
                type: [{ required: true, message: "Type cannot be empty" }],
                name: [{ required: true, message: "name cannot be empty" }],
            },
            getValue: (
                businessObject: ModdleElement
            ): Array<FromPropertyElement> => {
                const formProperties =
                    businessObject?.extensionElements?.values?.filter(
                        (item: FromPropertyElement) =>
                            item.$type === "activiti:FormProperty"
                    );
                return formProperties
                    ? formProperties.map((elem: FromPropertyElement) => {
                          return {
                              id: elem?.id,
                              type: elem.type,
                              name: elem?.$attrs?.name,
                          };
                      })
                    : [];
            },
            setValue(
                businessObject: ModdleElement,
                key: string,
                value: []
            ): void {
                const bpmnContext = BpmnStore;
                const moddle = bpmnContext.getModeler().get("moddle");
                //表单数据值对象
                const formProperties = value.map(
                    (attr: { id: string; type: string; name: string }) => {
                        return moddle.create("activiti:FormProperty", {
                            id: attr.id,
                            name: attr.name,
                            type: attr.type,
                        });
                    }
                );

                bpmnContext.updateExtensionElements(
                    "activiti:FormProperty",
                    formProperties
                );
            },
        },
    },
};
