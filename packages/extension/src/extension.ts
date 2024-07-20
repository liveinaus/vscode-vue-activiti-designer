import * as path from "path";
import * as vscode from "vscode";

interface History {
    past: string[];
    present: string;
    future: string[];
}

export function activate(context: vscode.ExtensionContext) {
    let kindDisposable = vscode.commands.registerCommand(
        `activiti-designer.editBpmn`,
        async () => {
            //Get current editor text content
            const editor = vscode.window.activeTextEditor;
            const history: History = { past: [], present: "", future: [] };
            if (!editor) {
                vscode.window.showErrorMessage("No active text editor found.");
                return;
            } else {
                //close the current editor
                await vscode.commands.executeCommand(
                    "workbench.action.closeActiveEditor"
                );
            }
            const panel = prepareWebView(context);
            //update webview title from the current editor
            //use file name not the full path
            panel.title = path.basename(editor.document.fileName);
            const initXml = editor.document.getText();
            history.present = initXml;

            panel.webview.postMessage({
                command: "loadXml",
                data: initXml,
            });

            panel.webview.onDidReceiveMessage(
                async ({ message, xml }) => {
                    if (message === "updateXml") {
                        updateXml(editor, history, xml);
                    } else if (message === "saveXml") {
                        saveXml(editor, history);
                    } else if (message === "goBack") {
                        goBack(panel, history);
                    } else if (message === "goForward") {
                        goForward(panel, history);
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    );
    context.subscriptions.push(kindDisposable);
}

function updateXml(editor: vscode.TextEditor, history: History, xml: string) {
    if (xml !== history.present) {
        history.past.push(history.present);
        history.present = xml;
        history.future = [];
    }
}

function goBack(panel: vscode.WebviewPanel, history: History) {
    if (history.past.length > 0) {
        history.future.push(history.present);
        history.present = history.past.pop()!;
        panel.webview.postMessage({
            command: "loadXml",
            data: history.present,
        });
    }
}

function goForward(panel: vscode.WebviewPanel, history: History) {
    if (history.future.length > 0) {
        history.past.push(history.present);
        history.present = history.future.pop()!;
        panel.webview.postMessage({
            command: "loadXml",
            data: history.present,
        });
    }
}

function updateEditorContent(editor: vscode.TextEditor, content: string) {
    const edit = new vscode.WorkspaceEdit();
    const start = new vscode.Position(0, 0);
    const end = new vscode.Position(editor.document.lineCount + 1, 0);
    edit.replace(editor.document.uri, new vscode.Range(start, end), content);
    vscode.workspace.applyEdit(edit);
}

function saveXml(editor: vscode.TextEditor, history: History) {
    vscode.workspace.fs
        .writeFile(editor.document.uri, Buffer.from(history.present, "utf8"))
        .then(() => {
            vscode.window.showInformationMessage("Changes saved to file.");
        });
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
