# vscode-vue-activiti-designer

A vue based vscode activiti designer extension.

## Notes

This extension should support up to Activiti 7. However, I am using Activiti 5 at the moment (for old projects), therefore other versions are untested. Please test the extension by yourself. If you see any issue, please feel free to contact me.

## Commands

    activiti-designer.editBpmn

### Install dependencies

```bash
yarn
```

For running project in development mode use

```bash
yarn watch
```

## How it works

The project is built with monorepo structure containing two packages. The first one being the client, and the second being the visual studio code extension program.

when you start developing on the `/packages/client/` vue application directory, your changes will be watched using nodemon, then rebuilt and be opened inside vscode extension host ready to be used with vscode command pallet!

Here you can see your vue project already built and injected using vscode webview API. you can utilize the full functionality of vue such as its amazing reactivity and its available additions (like `vue-router`) out of the box!

Inside the vue application code, the `vscode` object is globally accessible and can be used to send messages to the vscode runtime and perform tasks such as read/writing files, etc.

## Contribution

If you have any questions or recommendations please create a new issue for it, and if you've hacked together any feature or enhancement, a pull request is more than welcome here! 🙏

## Thanks

-   [vscode-webvue](https://github.com/Mhdi-kr/vscode-webvue)
-   [bpmn-vue-activiti](https://github.com/Yiuman/bpmn-vue-activiti)

## LICENSE

GNU General Public License v3.0
