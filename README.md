# vscode-vue-activiti-designer

A Vue based vscode Activiti designer extension.

## Screenshot

![0.2.0 screenshot](https://github.com/liveinaus/vscode-vue-activiti-designer/raw/main/screenshots/0.2.0.png)

## Features

<!-- add checkboxes for features -->

-   [x] Diagram editing
-   [x] History support
-   [ ] Show/Hide property panel
-   [ ] Multiple languages support
-   [ ] IDs prefix
-   [ ] Multiple Activiti version support

## Usage

Open the BPMN file you want to edit.

Trigger editBpmn command.

You should then see the diagram.

Do you editing and click save button (at the bottom) to save the change.

## Commands

-   `activiti-designer.editBpmn`: toggle BPMN designer for current BPMN file

## Settings

N/A

## Development (for the extension)

### Extension side

```bash
yarn
```

For running project in development mode use

```bash
yarn watch
```

### Client side

```bash
yarn
```

```bash
yarn build
```

### How the development works

The project is built with monorepo structure containing two packages. The first one being the client, and the second being the visual studio code extension program.

when you start developing on the `/packages/client/` vue application directory, your changes will be watched using nodemon, then rebuilt and be opened inside vscode extension host ready to be used with vscode command pallet!

Here you can see your vue project already built and injected using vscode webview API. you can utilize the full functionality of vue such as its amazing reactivity and its available additions (like `vue-router`) out of the box!

Inside the vue application code, the `vscode` object is globally accessible and can be used to send messages to the vscode runtime and perform tasks such as read/writing files, etc.

### Contribution

If you have any questions or recommendations please create a new issue for it, and if you've hacked together any feature or enhancement, a pull request is more than welcome here! 🙏

## Thanks

-   [vscode-webvue](https://github.com/Mhdi-kr/vscode-webvue)
-   [bpmn-vue-activiti](https://github.com/Yiuman/bpmn-vue-activiti)

## LICENSE

GNU General Public License v3.0
