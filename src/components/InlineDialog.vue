<script setup lang="ts">
import {useModel} from "@/hooks";
import Main from "@/components/Main.vue";
import InlineHead from "@/components/InlineHead.vue";

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(["update:modelValue"]);

const {modelValue} = props

const isExpanded = useModel(modelValue, props, "modelValue", emits, "update:modelValue")
</script>

<template>
  <div class="inline-dialog">
    <InlineHead v-model="isExpanded"/>
    <Main/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/InlineDialog.module";
</style>