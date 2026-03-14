<template>
  <div class="rubber-band-container">
    <svg width="100%" height="100%" viewBox="0 0 800 400">
      <line
        id="rubber-band"
        x1="50%"
        y1="0%"
        :x2="pointX"
        :y2="pointY"
        :stroke="lineColor"
        :stroke-width="lineWidth"
        stroke-linecap="round"
      />
      <circle cx="50%" cy="0%" r="4" fill="gray" />
      <foreignObject
        :x="pointX"
        :y="pointY"
        width="50"
        height="50"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div xmlns="http://www.w3.org/1999/xhtml" class="image-container">
          <img
            src="@/assets/logos/vue-mix-logo.svg"
            alt="draggable"
            class="draggable-image"
            @mousedown="startDrag"
            :cursor="isDragging ? 'grabbing' : 'grab'"
            :class="{ dragging: isDragging }"
          />
        </div>
      </foreignObject>
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import gsap from "gsap";

const pointX = ref(400);
const pointY = ref(200);
const isDragging = ref(false);
const lineWidth = ref(10);

let dragAnimation: gsap.core.Tween | null = null;

// 计算线的颜色 - 根据拉伸程度变化
const lineColor = computed(() => {
  const distance = Math.sqrt(Math.pow(pointX.value - 100, 2) + Math.pow(pointY.value - 200, 2));
  // 距离越远颜色越深
  const intensity = Math.min(distance / 200, 1);
  return `rgba(139, 69, 19, ${0.5 + intensity * 0.5})`;
});

const startDrag = (e: MouseEvent) => {
  if (dragAnimation) {
    dragAnimation.kill();
    dragAnimation = null;
  }

  isDragging.value = true;
  e.preventDefault();

  // 拖拽时线变细
  gsap.to(lineWidth, {
    duration: 0.2,
    value: 2,
    ease: "power2.out",
  });

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const svg = document.querySelector("svg");
  if (!svg) return;

  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;

  const ctm = svg.getScreenCTM();
  if (ctm) {
    const svgP = pt.matrixTransform(ctm.inverse());

    // 可以限制拖拽范围（可选）
    // pointX.value = Math.min(700, Math.max(100, svgP.x))
    // pointY.value = Math.min(350, Math.max(50, svgP.y))

    pointX.value = svgP.x;
    pointY.value = svgP.y;
  }
};

const stopDrag = () => {
  if (!isDragging.value) return;

  isDragging.value = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);

  // 恢复线宽
  gsap.to(lineWidth, {
    duration: 1.8,
    value: 10,
    ease: "power2.in",
  });

  // 创建回弹动画
  dragAnimation = gsap.to(
    {
      x: pointX.value,
      y: pointY.value,
    },
    {
      duration: 1.8,
      x: 400,
      y: 200,
      ease: "elastic.out(1.2, 0.1)",
      onUpdate: function (this: gsap.core.Tween) {
        pointX.value = this.targets()[0].x;
        pointY.value = this.targets()[0].y;
      },
      onComplete: () => {
        dragAnimation = null;
      },
    },
  );
};

onUnmounted(() => {
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
  if (dragAnimation) {
    dragAnimation.kill();
  }
});
</script>

<style scoped>
.rubber-band-container {
  user-select: none;
  cursor: default;
  width: 100%;
  height: 100%;
}
</style>
