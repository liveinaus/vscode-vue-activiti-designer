import { BpmnStore } from "@/bpmn/store";
import CodeMirror from "codemirror";
import "codemirror/addon/hint/xml-hint.js";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml.js";
import "codemirror/theme/material.css";
import { defineComponent, nextTick, ref } from "vue";
import ButtonRender, {
    ButtonRenderProps,
} from "../../components/button-render";

import { ModdleElement } from "@/bpmn/type";
import "./bpmn-actions.css";

export default defineComponent({
    name: "BpmnActions",
    setup() {
        //放大缩小
        const zoom = ref(1);
        //预览xml的抽屉控制器
        const previewActive = ref(false);
        //取到的xml
        const xml = ref("");

        return {
            zoom,
            previewActive,
            xml,
        };
    },
    render() {
        const bpmnContext = BpmnStore;
        //codemirror编辑器
        let coder: CodeMirror.EditorFromTextArea;

        const importFile = function (event: Event) {
            const eventTarget = event.target as HTMLInputElement;
            if (eventTarget.files) {
                const file = eventTarget.files[0];
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function () {
                    if (this.result) {
                        bpmnContext.importXML(this.result as string);
                    }
                };
            }
        };

        const postVscodeMessage = function (message: string) {
            vscode.postMessage({
                message,
            });
        };

        const buttonRenderProps: ButtonRenderProps = {
            buttons: [
                {
                    label: "Import BPMN",
                    icon: "icon-shangchuan",
                    action: () => {
                        document.getElementById("bpmn-upload-element")?.click();
                    },
                },
                {
                    label: "Export SVG",
                    icon: "icon-zu920",
                    action: () => {
                        const rootElement: ModdleElement = bpmnContext
                            .getModeler()
                            .get("canvas")
                            .getRootElement();
                        bpmnContext
                            .getSVG()
                            .then((response) => {
                                download(
                                    response.svg,
                                    rootElement.id || "process",
                                    "svg"
                                );
                            })
                            .catch((err: unknown) => {
                                console.warn(err);
                            });
                    },
                },
                {
                    label: "Export XML",
                    icon: "icon-zu1359",
                    action: () => {
                        const rootElement: ModdleElement = bpmnContext
                            .getModeler()
                            .get("canvas")
                            .getRootElement();
                        bpmnContext
                            .getXML()
                            .then((response: { xml: string }) => {
                                download(
                                    response.xml,
                                    rootElement.id || "process",
                                    "bpmn"
                                );
                            })
                            .catch((err: unknown) => {
                                console.warn(err);
                            });
                    },
                },
                {
                    label: "Zoom In",
                    icon: "icon-fangda",
                    action: () => {
                        this.zoom =
                            Math.floor(this.zoom * 100 + 0.1 * 100) / 100;
                        bpmnContext.getModeler().get("canvas").zoom(this.zoom);
                    },
                },
                {
                    label: "Zoom out",
                    icon: "icon-suoxiao",
                    action: () => {
                        this.zoom =
                            Math.floor(this.zoom * 100 - 0.1 * 100) / 100;
                        bpmnContext.getModeler().get("canvas").zoom(this.zoom);
                    },
                },
                {
                    label: "Reset Zoom & Recenter",
                    icon: "icon-quxiaoquanping",
                    action: () => {
                        this.zoom = 1;
                        bpmnContext
                            .getModeler()
                            .get("canvas")
                            .zoom("fit-viewport", "auto");
                    },
                },
                {
                    label: "Preview XML",
                    icon: "icon-xianshi",
                    action: () => {
                        bpmnContext
                            .getXML()
                            .then((response) => {
                                this.xml = response.xml;
                                this.previewActive = true;

                                nextTick(() => {
                                    if (!coder) {
                                        coder = CodeMirror.fromTextArea(
                                            document.getElementById(
                                                "xml-highlight-container"
                                            ) as HTMLTextAreaElement,
                                            {
                                                lineWrapping: true,
                                                mode: "application/xml", // HMTL混合模式
                                                theme: "material",
                                                lineNumbers: true,
                                                lint: true,
                                                // theme: 'monokai', // 使用monokai模版
                                            }
                                        );
                                        coder.setSize("100%", "100%");
                                    } else {
                                        coder.setValue(this.xml);
                                    }
                                });
                            })
                            .catch((err: unknown) => {
                                console.warn(err);
                            });
                    },
                },
                {
                    label: "Undo",
                    icon: "icon-weibiaoti545",
                    action: () => {
                        postVscodeMessage("goBack");
                    },
                },
                {
                    label: "Redo",
                    icon: "icon-weibiaoti546",
                    action: () => {
                        postVscodeMessage("goForward");
                    },
                },
                {
                    label: "save XML",
                    icon: "icon-baocun",
                    action: () => {
                        postVscodeMessage("saveXml");
                    },
                },
                // {
                //   label: '撤销',
                //   icon: 'icon-weibiaoti545',
                //   action: () => {
                //     bpmnContext.getModeler().get('commandStack').undo();
                //   },
                // },
                // {
                //   label: '恢复',
                //   icon: 'icon-weibiaoti546',
                //   action: () => {
                //     bpmnContext.getModeler().get('commandStack').redo();
                //   },
                // },
            ],
        };
        return (
            <div class="bpmn-actions">
                <ButtonRender {...buttonRenderProps} />
                <el-drawer
                    size="35%"
                    direction="ltr"
                    withHeader={false}
                    v-model={this.previewActive}
                >
                    <textarea id="xml-highlight-container" v-model={this.xml} />
                </el-drawer>
                <input
                    type="file"
                    id="bpmn-upload-element"
                    ref="refFile"
                    style="display: none"
                    accept=".xml, .bpmn"
                    onChange={importFile}
                />
            </div>
        );
    },
});

//文本下载
const download = (data: string, filename: string, type: string): void => {
    const blob = new Blob([data]);
    const tempLink = document.createElement("a"); // 创建a标签
    const href = window.URL.createObjectURL(blob); // 创建下载的链接
    //filename
    const fileName = `${filename}.${type}`;
    tempLink.href = href;
    tempLink.target = "_blank";
    tempLink.download = fileName;
    document.body.appendChild(tempLink);
    tempLink.click(); // 点击下载
    document.body.removeChild(tempLink); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
};
