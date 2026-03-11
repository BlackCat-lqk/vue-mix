<template>
  <TabbedLayout>
    <template #preview>
      <div
        :class="['gradient-border', bgColor ? '' : 'unsetBg', className]"
        v-bind="$attrs"
        @click="handleSubmit"
      >
        <div :class="['red-glow glow', colorClassNameArry[0]]"></div>
        <div :class="['cyan-glow glow', colorClassNameArry[1]]"></div>
        <div :class="['purple-glow glow', colorClassNameArry[2]]"></div>
        <div :class="['white-glow glow', colorClassNameArry[3]]"></div>
        <slot name="content"> Default Text </slot>
      </div>
    </template>
    <template #code>
      <!-- <CodeExample :code-object="asciiText" /> -->
    </template>
    <template #cli>
      <!-- <CliInstallation :command="asciiText.cli" /> -->
    </template>
  </TabbedLayout>
</template>

<script lang="ts" setup>
import TabbedLayout from "@/components/common/TabbedLayout.vue";
interface GradientFlowProps {
  className?: string;
  disabled?: boolean;
  colorClassNameArry?: string[];
  bgColor?: boolean;
}
const {
  className = "",
  colorClassNameArry = ["", "", "", ""],
  bgColor = false,
} = defineProps<GradientFlowProps>();

defineOptions({ inheritAttrs: false });
const emit = defineEmits(["click"]);
const handleSubmit = () => {
  emit("click");
};
</script>

<style scoped>
.gradient-border {
  position: absolute;
  cursor: pointer;
  border-radius: 100px;
  width: 100%;
  height: 100%;
  --border-width: 4px;
  --radius: 100px;
  border-radius: var(--radius);
  border: var(--border-width) solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gradient-border::before {
  content: " ";
  position: absolute;
  inset: calc(var(--border-width) * -1);
  border: inherit;
  border-radius: inherit;
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    #eeebff 0deg,
    #a193f6 90deg,
    #3dfcff 180deg,
    #ff7dd6 270deg,
    #eeebff 360deg
  );
  background-origin: border-box;
  -webkit-mask: linear-gradient(black, black), linear-gradient(black, black);
  mask: linear-gradient(black, black), linear-gradient(black, black);
  -webkit-mask-clip: content-box, border-box;
  mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: spin 3s linear infinite running;
}
.gradient-border .glow {
  position: absolute;
  inset: calc(var(--border-width) * -1);
  border-radius: inherit;
}
.gradient-border .glow::after {
  content: "";
  position: absolute;
  inset: calc(var(--border-width) * -1);
  border: calc(var(--border-width) * 2) solid transparent;
  border-radius: inherit;
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    #eeebff 0deg,
    transparent 90deg,
    transparent 180deg,
    transparent 270deg,
    #eeebff 360deg
  );
  background-origin: border-box;
  -webkit-mask: linear-gradient(black, black), linear-gradient(black, black);
  mask: linear-gradient(black, black), linear-gradient(black, black);
  -webkit-mask-clip: content-box, border-box;
  mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: spin 4s linear infinite running;
}

.white-glow {
  filter: blur(20px);
}
.gradient-border .purple-glow::after {
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    transparent 0deg,
    #a193f6 90deg,
    transparent 180deg
  );
  border: calc(var(--border-width) * 1) solid transparent;
}
.purple-glow {
  filter: blur(7px);
}
.gradient-border .red-glow::after {
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    transparent 180deg,
    #ff7dd6 270deg,
    transparent 360deg
  );
  border: calc(var(--border-width) * 1) solid transparent;
}
.red-glow {
  filter: blur(8px);
}
.gradient-border .cyan-glow::after {
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    transparent 90deg,
    #3dfcff 180deg,
    transparent 270deg
  );
  border: calc(var(--border-width) * 2) solid transparent;
}
.cyan-glow {
  filter: blur(15px);
}
.unsetBg .cyan-glow::after {
  background-image: unset;
}
.unsetBg .red-glow::after {
  background-image: unset;
}
.unsetBg .purple-glow::after {
  background-image: unset;
}
.unsetBg .glow::after {
  background-image: unset;
}
@property --angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0turn;
}
@keyframes spin {
  to {
    --angle: 1turn;
  }
}
</style>
