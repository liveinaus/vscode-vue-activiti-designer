import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { defineConfig } from "vite";

//直接获取文件的text
function rawTransform(fileRegex: Array<RegExp>): {
    name: string;
    transform: (src: string, id: string) => string | void;
} {
    return {
        name: "get-file-raw",
        transform(src, id): string | void {
            if (fileRegex.filter((re) => re.test(id)).length > 0) {
                return `export default ${JSON.stringify(src)}`;
            }
        },
    };
}

export default defineConfig({
    base: "./",
    optimizeDeps: {
        //声明深度路径模块
        include: [
            "bpmn-js/lib/Modeler",
            "highlight.js",
            "codemirror",
            "codemirror/mode/xml/xml.js",
            "codemirror/addon/hint/xml-hint.js",
            "bpmn-js/lib/features/label-editing/LabelUtil.js",
        ],
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    plugins: [vue(), rawTransform([/\.bpmn$/]), vueJsx()],
    build: {
        outDir: "../extension/vue-dist",
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
});
