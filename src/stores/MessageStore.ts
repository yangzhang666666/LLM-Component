import { ref } from 'vue'
import { defineStore } from "pinia";
import { type Message, ContentType } from "@/types"

export const messageStore = defineStore("messageStore", () => {
    const data = ref<Message[]>([{
        id: "1",
        date: new Date("2025-1-25"),
        name: "新会话",
        content: [{
            id: "1",
            role: ContentType.user,
            value: "这里的 0 表示用户"
        }, {
            id: "2",
            role: ContentType.assistant,
            value: "以下是使用 Python, 实现的解码函数：\n\n```python\ndef decode_sequence(a, d0):\n    data = [d0]\n    for item in a:\n        data.append(data[-1] ^ item)\n    return data \n``` \n 在C语言中，`#include <stdio.h>`是引入标准输入输出头文件，`printf`函数用于输出内容到控制台，`main`函数是程序的入口点，`return 0`表示程序正常结束并返回值0。"
        }]
    }])
    // 会话的 id
    const activeMessageId = ref<Message['id']>("1")
    const mainState = ref<'inline' | 'chat'>('chat')
    const Response = ref<string>("")
    // 切换对话 id
    const changeMessageId = (id: Message["id"]) => activeMessageId.value = id

    // 查找对应会话的 Content
    const findContent = (id: Message["id"]) => data.value.find(item => item.id === id)?.content;

    // 查找对应会话 Content 的长度
    const getContentLength = (id: Message["id"]) => findContent(id)?.length || 0

    // 新增对应会话的 Content
    const addContent = (id: Message["id"], ...args: Message["content"]) => {
        const currentMessageList = findContent(id)
        if (!currentMessageList) return
        currentMessageList.push(...args);
    }
    const updateContent = (response: string) => {
        Response.value = response;
        const currentContent = findContent(activeMessageId.value);
        if (currentContent && currentContent.length > 0) {
            const lastItem = currentContent[currentContent.length - 1];
            if (lastItem && 'value' in lastItem) {
                lastItem.value = Response.value;
            }
        }
    }
    const addMessage = () => {
        // 如果当前会话为空，则不允许创建新会话
        const currentContent = findContent(activeMessageId.value);
        if (currentContent?.length === 0) {
            alert("Don't create more than one empty conversation");
            return;
        }
        if (currentContent && currentContent.length > 0) {
            const id = data.value.length + 1;
            data.value.push({
                id: id.toString(),
                date: new Date(),
                name: `新会话${id}`,
                content: [],
            });
        }
        changeMessageId(data.value[data.value.length - 1].id);
        /*addContent(activeMessageId.value, {//可以初始化对话
            id: "1",
            role: ContentType.assistant,
            value: `这里是会话 ${activeMessageId.value}`
        });*/
    }

    const deleteMessage = (id: Message["id"]) => {
        const index = data.value.findIndex(item => item.id === id);
        if (index !== -1) {
            data.value.splice(index, 1);
        }
    }

    const changeMainState = (value: 'inline' | 'chat') => mainState.value = value;

    return {
        data,
        activeMessageId,
        findContent,
        addMessage,
        changeMessageId,
        addContent,
        getContentLength,
        updateContent,
        Response,
        mainState,
        changeMainState
    }
}, {
    persist: false,//持久化先关闭
})