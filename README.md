# LLM 对话框组件 2.0 Coze API

本项目是一个由 `Vue3` + `Vite3` + `TypeScript` + `pinia` + `Coze.js` + `Axios4` 搭建的 LLM 对话框组件。

项目结题文档： [青训营大项目提交文档 —— Coze 对话项目结题报告](https://wqh9xucdd05.feishu.cn/docx/YP8pdLG92oZElYxTalccgWUwnMe) 。

建议改进：

- UI：CSS 可以升级到 TailwindCSS 、为了开发效率可以尝试使用一些 UI 组件库，例如：Vuetify 、AntDesignVue 、ElementPlus 等。
- 后面可以尝试适配多端，通过 Tauri 、Uni-App 等框架移植到手机端，通过 Electron 等框架移植到桌面端。
- 看看能不能和操作系统衔接做一些新的东西，用户在不同环境上的需求很多。
- 然后可以考虑兼容多种 AI ，应该都是兼容 OpenAI Api，所以报文格式差不多。
- 然后可以尝试做 Prompt 配置的界面允许高阶用户自己去配 Prompt。

## 项目启动命令：

- 通过 `npm`：

  ```bash
  git pull
  npm i
  npm run dev
  ```

- 通过 `pnpm`：

  ```bash
  git pull
  pnpm i
  pnpm run dev
  ```

## 开发规范

在开发过程中我们约定如下内容：

1. Vue 文件的结构为 `script → template → style`。
2. `script` 使用 `setup` 语法糖和 TypeScript。
3. 文件夹名采用小写，文件名首字母大写。
4. 建立 `styles` 文件夹，每个组件的样式进行统一管理。
5. 所有模块都要写清楚运行过程原理，注释函数的作用，让其他人能理解整个项目的运行，做好答辩准备。

## 模块拆分 Main 与 SideBar

## 一、 Main部分

### 1. 主体对话框组件 (`Main`)

- 包含两种形态：内联和独立对话框。
- 包括 `InputBox` 和 `MessageList`。
- 通过 `messageStore` 和 `storeToRefs` 来管理应用的状态。
  通过 `mainState` 来控制对话框的显示状态。
  当 `mainState` 为 `inline` 时，显示一个内联收缩形态，点击后为展开形态。
  展开后为对话形态，包含消息列表 (`MessageList`) 和输入框 (`InputBox`)。
  提供关闭按钮 (`Close`) 以收起对话框。

当 `mainState` 不为 `inline` 时，直接显示为独立对话框，展示完整的消息列表和输入框。
独立对话框：

- 这里要求给出总体界面设计，其他组件的样式以 `Main` 为例进行设计。
- 要求响应式设计，除 Web 端外，实现 H5 与小程序界面的屏幕适应。
  内联对话框：
- 要求实现管理对话框的三种显示状态（收缩、展开、对话）。
    - **收缩形态**：表现为一个单一地输入框，点击后展开弹框进入第二形态。
    - **展开形态**：表现为支持对话的弹框模式，用户输入问题后，立即进入该形态。
    - **对话形态**：用户输入问题后，立即进入该形态，形态上既为 LLM 对话信息流。
- 提供接口供其他组件调用，控制对话框的显示和隐藏。

### 2. 对话内容组件 (`MessageList`)

- Props 接收一个 `data` 属性，类型为 `Message["content"]`，用于传递消息列表数据。
- 使用 `v-for` 循环渲染消息列表。
- 根据传入data的 `type` 属性，分发给两个子组件 `MessageChat` 和 `MessageUser` 由子组件进一步渲染。

### 3. AI 与用户 消息组件 (`MessageChat` `MessageUser`)

- 包含 `MessageItem` ，用于展示 AI与用户 的单条对话消息。
- 使用头像组件 `Avatar` 来标识 AI 发送的消息。
- 根据传入的 `value` 和 `type` 属性，渲染对应的消息内容。

### 4. 单条消息组件 (`MessageItem`)

- 负责展示单条对话消息。
- 根据消息类型（用户输入或 LLM 返回）渲染不同的样式。
- 支持展示 Markdown 内容、图片、代码等，这里使用 `markdown-it` 来解析 Markdown 内容。
- 使用 `github-markdown-css` 样式库来美化 Markdown 渲染效果。
- 代码消息提供“**复制**”按钮，整体提供“**复制Markdown**”方便用户复制。

### 5. 输入框组件 (`InputBox`)

- `InputBox` 是组件调用 AI 的地方，实现用户与 AI 对话。
- 将用户输入的内容通过 `chatWithCoze` 实时传递给消息仓库 `MessageStore` 并进行处理。
- 支持通过 `Enter` 键触发发送事件，实现了防抖发送功能，防止频繁触发发送事件。
- **子组件**：
    - `TextArea.vue`: 用于文本输入，支持自动调整高度。
    - `Upload.vue`: 用于上传图片、PDF 等文件。
    - `Send.vue`: 用于发送消息，支持禁用状态。

### 6. 输入功能组件 (`TextArea` + `Upload` + `Send`)

- 接收用户输入的文本内容。
- 支持自动调整高度，根据输入内容动态调整文本域的高度。
- 调用双向绑定钩子 (`UseModel.ts`) 使用 `ref` 和 `watch` 实现双向数据绑定。
- 确保父组件和子组件之间的数据同步。

## 二、SideBar部分

### 1. 侧边栏 (`SideBar`)

- 支持通过流式布局配合状态变量 `isCollapsed` 进行折叠与展开，符合响应式设计
- 提供历史会话、新建会话、配置Coze参数、改变会话模式内联与独立等功能。
- **子组件**：
    - `HistoryMessage`：存储历史会话，并为每一个历史会话赋值 `id` 进行管理，
      每一个 `li` 点击后调用 `store` 中的 `changeMessageId` 方法，将当前`activeMessageId` 修改为该 `id`。
    - `CreateMessage`：创建新会话，调用 `store` 中的 `addMessage` 方法，创建新会话。
    - `MessageMode`：通过 `store` 中的 `changeMainState` 方法，将 `mainState` 值切换为 `inline` 或 `chat`
      ，实现内联与独立切换，同时改变组件icon表现两种对话框。

## 三、重要工具类

### 1. Pinia 数据存储类 (`MessageStore`)

- 负责存储对话记录和持久化，包括用户输入和 LLM 返回的内容。
- 通过控制全局`activeMessageId` 实现不同的会话切换和获取当前会话的所有内容。
- 使用 mainState 来控制对话框的显示模式（内联或独立），并通过 changeMainState 方法进行切换。
- 提供 `addContent`、`updateContent` 等方法来操作会话数据。
- **方法**:
    - `addContent`: 向指定会话中添加新的消息内容。
    - `updateContent`: 更新指定会话中最后一条消息的内容。用于流式接收 AI 回复时实时更新消息。
    - `findContent`: 根据会话 ID 查找并返回该会话的所有消息内容。
    - `getContentLength`: 获取指定会话中消息的数量。
    - `addMessage`: 创建一个新的空会话，并将其设为当前活跃会话。如果当前会话为空，则不允许创建新会话。
    - `deleteMessage`: 删除指定会话。
    - `changeMessageId`: 切换当前活跃会话的 ID，用于在不同会话之间切换。
    - `changeMainState`: 切换对话框的显示模式。

### 2. LLM 交互工具类 (`LLMInteraction`)

- 负责与 LLM API 进行交互，处理用户输入并获取 AI 回复。
- 从 `MessageStore` 获取用户输入的内容发送给 LLM API，并接收返回的结果。
- 将 LLM 返回的结果传递给调用方法的组件进行展示。
- **主要函数**：
    - 初始化 Coze API 客户端。
    - 获取机器人信息。
    - 创建对话消息，分离文本与文件，合并历史消息一并发送给 Coze。
    - 上传文件。
    - 流式聊天调用 API。
    - 设置和打印配置信息。
- **调用流式对话方法示例**：
  ```js
  await LLMInteraction.streamingChat({
    query: query.value, // 这里是用户输入的内容
    onUpdate: (delta: string) => {
      response.value = delta; // response 是 AI 返回的结果
    },
    onSuccess: (delta: string) => {
      response.value = delta;
    },
    onCreated: (data: CreateChatData) => {
      console.log('Chat created:', data);
    },
  });
  ```

### 3. 配置文件 (`Config`)

- 负责三个配置信息的存储和修改，包括：
    - `bot ID`
    - `PAT`
    - `baseUrl`
- 以上三条信息需要通过 Coze 官网创建机器人并开放 API 调用权限获取，详细参考 Coze 文档准备工作。

### 4. 消息类型定义 (`Message`)

- 定义 `ContentType` 枚举。
- 定义 `Message` 和 `Content` 接口。

### 5. hover 提示框组件 (`Tooltip`)

- 使用 `mouseover` 和 `mouseleave` 鼠标事件监听器来控制状态变量 `isVisible` ，然后通过 `isVisible ` 控制提示信息的显示和隐藏。
- 使用slot插槽，`<Tooltip content="上传文件(接受图片、PDF 等文件)">其他组件</Tooltip>` 整个组件能够通过包裹其他组件，在不同的组件上显示提示信息。
- 接收父组件的 `content` 属性，能够自定义提示内容。

### 6. 父子双向绑定钩子 (`useModel`)

- 通过 `props[propsName]` 获取到当前传入的旧变量 `value`。
- `useModel` 检测到 `value` 的变化后，通过 `emit("update:modelValue", newVal)` 触发父组件的更新事件，从而同步更新父组件中的
  `value`。
- `update: modelValue` 是一个约定俗成的事件名称，当子组件需要更新父组件中的 `v-model` 绑定的值时，通常会触发这个事件，并传递新的值。
- 本项目用作 `TextArea` 子组件和 `InputBox` 父组件之间的数据同步。

### 7. 防抖函数钩子 (`debounce`)

- 接收一系列操作函数 `args` 和 一个时间间隔 `delay` （默认 1000），返回一个函数。
- 本项目用作 `MessageItem` 中防抖复制代码，当AI返回结果变化时，每隔一个 `delay` 给代码块添加复制按钮，以避免频繁地重新添加复制按钮。

## 题目要求概述

参考 [【前端项目一】LLM 对话框组件2.0](https://bytedance.larkoffice.com/docx/YP0Md2LwCoelRQxnwiZc5DWUndb?share_token=a0c7986e-45ce-42af-a8c6-431fcd10f3b1) 。

项目整体：

- 除 Web 端外，组件还需兼容 H5、小程序形态。
- 提交相关功能演示材料。
- 支持内联与独立对话两种功能模式吗，其中内联形态要求三种形态：收缩形态、展开形态、对话形态。

用户输入：

- 上传文件，用户端和AI结果都要支持文本、图片、PDF 等多种交流的文件格式。
- 根据用户输入（含文件）调用 Coze API 或其他大模型。
- 实现回车发送消息，用户输入对话回车后，调用 LLM 接口，组件内流式展示大模型返回的结果。

返回结果：

- 需要支持 LLM 流式返回结果，实现逐行打印效果。
- 正确展示 文本、Markdown、图片等 LLM 返回的格式内容。
- 若返回结果包含代码，请提供 `Copy` 按钮，方便用户复制代码。
- **可选模块: 工具栏组件 (`Toolbar`)** : 可以包含一些操作按钮，例如清空对话记录、切换对话模式等。

## 加分项

1. 单测覆盖率超过 80% ，（预计使用单元测试框架：`Vitest`）。
2. 有完善的 `CI` 流水线，并在 `CI` 中执行构建、自动测试、`Lint` 检查、`TypeScript` 检查等检测动作。
3. 有完善的 `CD` 流水线，实现发布动作自动化。

## 项目技术点

1. 从扣子平台的智能体创建到本地代码调用功能。
2. 智能体对话的实现：`streamingChat` 调用 API，本项目通过安装 SDK 调用方法实现。
3. Markdown 解析：`markdown-it + shiki.js`。
4. 文件上传 参考：[扣子平台文件上传文档](https://www.coze.cn/open/playground/upload_file) 。本项目通过 `axios post`
   到对应地址实现。
    - 支持上传的文件格式：
        - 文档：DOC、DOCX、XLS、XLSX、PPT、PPTX、PDF...
        - 图片：JPG、JPG2、PNG、GIF...
5. 代码块添加复制功能： 本项目通过正则表达式匹配 `md.render(value)` 返回的渲染结果，匹配出代码块，然后添加复制按钮。
6. 上下文结合推理：项目将所有消息通过 `createMessage` 方法统一在 `LLMInteraction` 赋值给 `addtionContext`，使用 API
   规定特性实现，如果
   `additional_messages` 中有多条消息，则最后一条会作为本次用户 Query ，其他消息为上下文。
7. 流式打印 AI 返回结果：项目通过 `streamChat` 从 `this.Coze.chat.stream` 获取流式结果，遍历流式结果，在流式更新的过程中不断调用
   `InputBox` 中的 `updateContent` 方法，实现 `MessageStore` 中当前会话的最后一条消息更新，然后 `Main` 通过 `findContent`
   查找当前会话，传入 `MessageList`，`MessageList` 通过 `Content` 属性中的 `role` 分发消息给 `MessageUser` 或
   `MessageChat`，这整个消息流实时更新从而实现流式打印效果。

- 数据流：`LLMInteraction → InputBox → MessageStore → Main → MessageList → MessageChat`

8. 双向绑定钩子：

- 在 `InputBox.vue` 中，`TextArea.vue` 作为子组件被使用，通过 `v-model` 实现了与 `InputBox.vue`
  内部状态的双向绑定，确保用户输入的内容可以在整个组件链中保持一致。
- 在 `TextArea.vue` 中，`useModel` 实现了 `modelValue` 和 `value` 的双向绑定，使得用户输入的内容可以实时同步到父组件。
- 数据流：用户输入 → `TextArea.vue` 更新 `value` → `useModel` 触发 `emit` → 父组件（如 `InputBox.vue`）接收更新 →
  执行相关逻辑（如发送消息、调用 API 等）。

9. 内联与独立对话框模式切换： 本项目通过 `SideBar` 中的 `MessageMode` 组件控制 `MessageStore` 中的 `mainState` 属性，控制
   `Main` 组件的状态实现切换对话框模式。
10. 回车发送消息： 在 `InputBox` 组件中，通过 `@keydown.enter` 事件监听用户输入回车事件，当用户按下回车键时，触发 `send`
    方法，将用户输入的内容发送给仓库 `MessageStore` ，并清空输入框。

## 项目关系图

![LLM关系图](public/images/LLM%20项目结构关系图.png)

# 开发日志

## 发布智能体为 API 服务

发布智能体为 API 服务后，可以通过调用 API 的方式使用智能体，例如查看智能体的基本设置、发起智能体对话等。

## 准备工作

参考 [扣子平台开发者指南](https://www.coze.cn/open/docs/developer_guides/preparation)。

## 操作步骤

1. 登录扣子平台。
2. 在左侧导航栏中选择工作空间，并在页面顶部空间列表中选择个人空间或团队空间。
3. 在项目开发页面，选择智能体。
4. 在页面右上角，单击 **发布**。
5. 在发布页面，选择 **Agent as API** 选项，然后单击 **发布**。

## 获取访问令牌

本文档以生成个人访问令牌为例，演示获取访问令牌的方式。

1. 登录扣子平台。
2. 在左侧菜单栏下方，单击扣子 API 图标。
3. 在扣子 API 页面，进入 **授权** > **个人访问令牌** 页签。
4. 你也可以直接访问个人访问令牌页面。
5. 单击 **添加新令牌**。
6. 在弹出的页面完成以下配置，然后单击 **确定**。
7. 这里的访问令牌就是 `PAT`。
8. 创建机器人获取机器人 `botId`。
9. `baseUrl` 是 Coze API 地址 `https://www.coze.cn`。

## API 鉴权

扣子 API 通过访问令牌进行 API 请求的鉴权。所有的 API 请求都必须在请求头的 `Authorization` 参数中包含你的访问令牌（Access
Token）。

```plaintext
Authorization: Bearer $Access_Token
```

**限额**

当前扣子 API 免费供开发者使用，每个空间的 API 请求限额如下：

- QPS (每秒发送的请求数): 2。
- QPM (每分钟发送的请求数): 60。
- QPD (每天发送的请求数): 3000。

注意：2024 年 8 月 15 日之后，扣子 API 的免费额度为每个账号 100 次 API 调用。一旦累计调用次数超过免费额度，此账号将无法继续使用任何扣子
API。

## 过程中遇到的问题

- 合并冲突解决：
  当两个分支对同一个文件进行了修改，但修改内容不同，则出现合并冲突。
  合并分支的时候，只要打开一次就已经向 `main` 分支发起请求了，这个时候仓库所有者会收到合并消息邮件，如果出现合并冲突，则需要审查者手动调整合并冲突。
  此时需要审查者根据项目需求审查原有代码和传入代码，选择性的合并，然后提交代码。
- Coze 官网写的调用方法是 Shell 脚本，根本看不懂，传参和返回都不知道是什么东西，可能要找一个开源项目来看看是怎么调用 AI 的。
- 不清楚三个配置信息是什么意思，去哪要这三个配置信息。
- 组件导入冲突大部分是因为 `tsconfig` 文件配置问题，`tsconfig` 创建时会全局扫描组件并固定组件路径，导入出错只需要删除其内容再重新写入即可。
- 写文档时，`Item` 的复制代码功能出现 bug 。明明昨天还工作正常，经检查是正则表达式匹配问题。渲染时会将单个符号 `` ` ``
  的中间也渲染成 `<code>`，
  所以原有的正则表达式 `/<\/code>/g` 是用来匹配字符串中所有的 `</code>` 标签，这会将每一个解释用代码也渲染一个复制。更改正则表达式即可解决此问题。
- 之前一直局限在要新建一个内联对话框组件，但是如果这样做就需要在该组件添加重复的功能，而且内联与独立对话的会话 ID
  也难以区分，但是如果将整个 `app` 设定成两个表现形式，在 `Main` 中通过一个状态变量控制就能做到。
- `pat` 是保密信息，如果直接放在组件中会导致组件不加载，所以需要将 `pat` 放在环境变量中并获取