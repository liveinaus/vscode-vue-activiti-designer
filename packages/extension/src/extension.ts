import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let kindDisposable = vscode.commands.registerCommand(
        `activiti-designer.loadBpmn`,
        () => {
            //Get current editor text content
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("No active text editor found.");
                return;
            }
            const panel = prepareWebView(context);

            panel.webview.postMessage({
                command: "loadXml",
                data: editor.document.getText(),
            });

            panel.webview.onDidReceiveMessage(
                async ({ message, xml }) => {
                    //save bpmn file
                    if (message === "updateXml") {
                        vscode.workspace.fs
                            .writeFile(
                                editor.document.uri,
                                Buffer.from(xml, "utf8")
                            )
                            .then(() => {
                                vscode.window.showInformationMessage(
                                    "Changes saved to file."
                                );
                            });
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    );
    context.subscriptions.push(kindDisposable);
}

export function prepareWebView(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        "vueWebview",
        "vue webview",
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(
                    path.join(context.extensionPath, "vue-dist", "assets")
                ),
            ],
            retainContextWhenHidden: true,
        }
    );

    const dependencyNameList: string[] = [
        "index.css",
        "index.js",
        "vendor.js",
        "logo.png",
    ];
    const dependencyList: vscode.Uri[] = dependencyNameList.map((item) =>
        panel.webview.asWebviewUri(
            vscode.Uri.file(
                path.join(context.extensionPath, "vue-dist", "assets", item)
            )
        )
    );
    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script>
          const vscode = acquireVsCodeApi();
    </script>
    <script type="module" crossorigin src="${dependencyList[1]}"></script>
    <link rel="modulepreload" href="${dependencyList[2]}">
    <link rel="stylesheet" href="${dependencyList[0]}">
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
  `;
    panel.webview.html = html;
    return panel;
}
// this method is called when your extension is deactivated
export function deactivate() {}
