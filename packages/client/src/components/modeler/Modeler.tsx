import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "./modeler.css";

import { BpmnStore } from "@/bpmn/store";
import { BpmnContext } from "@/bpmn/type";
import { defineComponent, onMounted } from "vue";
import translate from "../../bpmn/i18n";
import activitiModdel from "../../bpmn/resources/activiti-moddel.json";

export default defineComponent({
    name: "Modeler",
    props: {
        bpmnXml: {
            type: String,
            required: true,
        },
    },
    emits: ["elementChanged"],
    setup(props, { emit }) {
        const bpmnContext: BpmnContext = BpmnStore;
        onMounted(() => {
            bpmnContext.initModeler({
                container: "#modeler-container",
                additionalModules: [
                    //添加翻译
                    { translate: ["value", translate("zh")] },
                ],
                moddleExtensions: {
                    activiti: activitiModdel,
                },
            });

            bpmnContext
                .importXML(props.bpmnXml)
                .then((result: Array<string>) => {
                    if (result.length) {
                        console.warn("importSuccess warnings", result);
                    }
                })
                .catch((err: any) => {
                    console.warn("importFail errors ", err);
                });

            bpmnContext.addEventListener("element.changed", async (evt) => {
                const { xml } = await bpmnContext.getXML();
                emit("elementChanged", xml);
            });
        });

        return () => <div id="modeler-container" />;
    },
});
