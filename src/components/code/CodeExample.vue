<template>
  <div class="code-example">
    <div v-for="[name, snippet] in codeEntries" :key="name" class="code-section">
      <h2 class="demo-title">{{ getDisplayName(name) }}</h2>

      <div v-if="snippet" class="code-container">
        <div class="code-wrapper" :class="{ collapsed: shouldCollapse(snippet) && !isExpanded(name) }">
          <VCodeBlock :code="snippet" highlightjs :lang="getLanguage(name)" theme="nord" :copy-button="true"
            :persistent-copy-button="true" class="code-block" />

          <div v-if="shouldCollapse(snippet) && !isExpanded(name)" class="fade-overlay" />

          <button v-if="shouldCollapse(snippet)" class="expand-button" :class="{ expanded: isExpanded(name) }"
            @click="toggleExpanded(name)">
            {{ isExpanded(name) ? "Collapse Snippet" : "See Full Snippet" }}
          </button>
        </div>
      </div>

      <div v-else class="no-code">
        <span>Nothing here yet!</span>
        <i class="pi pi-face-sad" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VCodeBlock } from "@wdns/vue-code-block";
import type { CodeObject } from "@/types/code";

const props = defineProps<{
  codeObject: CodeObject;
}>();

const skipKeys = ["cli"];
const expandedSections = ref<Set<string>>(new Set());

const codeEntries = computed(() => {
  return Object.entries(props.codeObject).filter(([name]) => !skipKeys.includes(name));
});

const shouldCollapse = (snippet: string) => {
  const codeLines = snippet?.split("\n").length || 0;
  return codeLines > 35;
};

const isExpanded = (name: string) => {
  return expandedSections.value.has(name);
};

const toggleExpanded = (name: string) => {
  if (expandedSections.value.has(name)) {
    expandedSections.value.delete(name);
  } else {
    expandedSections.value.add(name);
  }
};

const getDisplayName = (name: string) => {
  const displayNames: Record<string, string> = {
    code: "Code",
    cli: "CLI Command",
    utility: "Utility",
    usage: "Usage",
    installation: "Installation",
  };
  return displayNames[name] || name.charAt(0).toUpperCase() + name.slice(1);
};

const getLanguage = (name: string) => {
  const languageMap: Record<string, string> = {
    cli: "bash",
    code: "html",
    utility: "typescript",
    usage: "html",
    installation: "bash",
  };
  return languageMap[name] || "typescript";
};
</script>

<style scoped>
:deep(.v-code-block) {
  background: #0b0b0b;
  border-radius: 15px;
  font-size: 14px;
}

:deep(.v-code-block pre) {
  background: #0b0b0b;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
}

:deep(.v-code-block--tab-highlightjs-github-dark-icon) {
  color: #999 !important;
  fill: #999 !important;
}

:deep(.v-code-block--me-1) {
  margin-right: 0 !important;
}

:deep(.v-code-block .hljs) {
  background: #0b0b0b;
  color: #fff;
  font-size: 14px;
}
</style>
