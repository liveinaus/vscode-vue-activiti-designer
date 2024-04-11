import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "./modeler.css";

import { BpmnStore } from "@/bpmn/store";
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
    setup(props) {
        const bpmnContext = BpmnStore;
        console.log("====xml=====", props);
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
        });

        return () => <div id="modeler-container" />;
    },
});
