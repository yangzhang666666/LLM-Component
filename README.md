本项目是一个由 Vue3 + Vite3 + TypeScript、Axios4 和 Coze API 搭建的 LLM 对话框组件。
项目启动命令：
```bash
npm install
npm run dev
```
## 协同开发约定
在开发过程中我们约定如下内容：
1. .vue文件的顺序为 script -> template -> style
1. script使用 setup语法和TS
1. 文件夹 名采用小写，文件 名首字母大写
## 模块拆分
1. **内联对话框容器 (DialogContainer**)
    *   包括 InputBox 和 MessageList
    *   要求实现管理对话框的三种显示状态（收缩、展开、对话）。
        *   收缩形态：表现为一个单一的输入框，点击后展开弹框进入第二形态
        *   展开形态：表现为支持对话的弹框模式，用户输入问题后，立即进入该形态
    *   提供接口供其他组件调用，控制对话框的显示和隐藏。
    *   根据不同的显示状态，渲染不同的子组件。
2. **输入框组件 (InputBox**)
    *   准备用在两个地方，内联对话框和独立对话框。
    *   负责接收用户输入的文本、图片、PDF 等多媒体内容。
    *   支持上传图片、PDF 等文件。
    *   将用户输入的内容传递给父组件进行处理。
3. **对话内容组件 (MessageList**)
    *   包括 MessageItem
    *   负责展示对话历史记录，包括用户输入和 LLM 返回的内容。
    *   支持多种内容格式，例如文本、Markdown、图片、代码等。
    *   实现流式加载 LLM 返回的结果，逐行显示。
4. **消息组件 (MessageItem**)
    *   负责展示单条对话消息。要求解析 Markdown 内容，并支持图片和代码等格式。
    *   根据消息类型（用户输入或 LLM 返回）渲染不同的样式。
    *   支持展示 Markdown 内容、图片、代码等。
    *   代码消息提供“Copy”按钮，方便用户复制。
5. **LLM 交互工具类 (LLMInteraction**)
    *   要求使用 axios 调用 Coze API ，负责与 LLM API 进行交互。
    *   接收 InputBox 用户输入的内容发送给 LLM API，并接收返回的结果。
    *   将 LLM 返回的结果传递给调用方法的组件进行展示。
6. **独立对话框组件 (IndependentDialog**)
    *   包括 InputBox 和 MessageItem
    *   根据用户输入（含文件）使用 Axios 调用 调用大模型 Coze API
    *   这里要求给出总体界面设计，其他组件的样式以 IndependentDialog 为例进行设计。
    *   要求响应式设计
**可选**：
*   **工具栏组件 (Toolbar**): 可以包含一些操作按钮，例如清空对话记录、切换对话模式等。
**加分项**
1. 单测覆盖率超过 80%；（预计使用单元测试框架： Vitest）
2. 有完善的 CI 流水线，并在 CI 中执行构建、自动测试、Lint 检查、ts 检查等检测动作；
3. 有完善的 CD 流水线，实现发布动作自动化；
## 组件之间的关系
*   DialogContainer 是内联对话框组件的父组件
*   InputBox 和 MessageList 是 DialogContainer 的子组件，分别负责用户输入和对话内容的展示。
*   MessageItem 是 MessageList 的子组件，负责展示单条对话消息。
*   LLMInteraction 可以作为一个独立的组件，也可以集成到 InputBox 或 DialogContainer 中。
