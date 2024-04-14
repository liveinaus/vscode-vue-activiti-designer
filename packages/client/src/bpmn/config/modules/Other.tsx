import { getTranslatorFn } from "@/bpmn/i18n/translate";
import { ElInput } from "element-plus";
import {
    CommonGroupProperties,
    DocumentGroupProperties,
    ExtensionGroupProperties,
} from "../common";
const translatorFn = getTranslatorFn("en");

const CommonGroupPropertiesArray = [
    CommonGroupProperties,
    ExtensionGroupProperties,
    DocumentGroupProperties,
];

interface CategoryValueRef {
    value: string;
}

const BpmnGroupBaseProperties = {
    name: translatorFn("Information"),
    icon: "el-icon-info",
    properties: {
        id: {
            component: ElInput,
            placeholder: translatorFn("Element ID"),
            vSlots: {
                prepend: (): JSX.Element => <div>节点ID</div>,
            },
        },
        name: {
            component: ElInput,
            // prefix: '节点名称',
            placeholder: "节点名称",
            vSlots: {
                prepend: (): JSX.Element => <div>节点名称</div>,
            },
            getValue: (obj: { categoryValueRef: CategoryValueRef }): string => {
                return obj?.categoryValueRef?.value;
            },
        },
    },
};

export default {
    //池
    "bpmn:Participant": CommonGroupPropertiesArray,
    //分组
    "bpmn:Group": [
        BpmnGroupBaseProperties,
        ExtensionGroupProperties,
        DocumentGroupProperties,
    ],
    //数据存储
    "bpmn:DataStoreReference": CommonGroupPropertiesArray,
    //数据对象
    "bpmn:DataObjectReference": CommonGroupPropertiesArray,
};
