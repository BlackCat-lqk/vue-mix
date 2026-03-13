<template>
  <div class="rubber-band-container">
    <!-- 橡皮筋线条 -->
    <div class="rubber-band-line" ref="lineRef" :style="{ backgroundColor: color }"></div>

    <!-- 固定锚点 -->
    <div class="rubber-band-anchor" ref="anchorRef" :style="{ backgroundColor: color }"></div>

    <!-- 拖拽点（透明交互区域） -->
    <div class="rubber-band-dragger" ref="draggerRef" @mousedown="handleMouseDown"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'

// ---------- Props 定义 ----------
const props = defineProps({
  // 橡皮筋颜色
  color: {
    type: String,
    default: '#ff6b6b'
  },
  // 锚点大小
  anchorSize: {
    type: Number,
    default: 20
  },
  // 线条粗细
  lineThickness: {
    type: Number,
    default: 4
  },
  // 弹性强度 (1 = 标准, 越大回弹越猛)
  elasticity: {
    type: Number,
    default: 1
  },
  // 是否默认激活
  active: {
    type: Boolean,
    default: true
  }
})

// ---------- 事件发射 ----------
const emit = defineEmits(['drag-start', 'drag-move', 'drag-end', 'reset'])

// ---------- DOM 元素引用 ----------
const lineRef = ref(null)
const anchorRef = ref(null)
const draggerRef = ref(null)

// ---------- 状态管理 ----------
const anchorPosition = ref({ x: 0, y: 0 }) // 锚点中心坐标
const isDragging = ref(false)
let gsapContext // 用于批量清理GSAP动画
let mouseMoveHandler = null
let mouseUpHandler = null

// ---------- 初始化位置 ----------
const updateAnchorPosition = () => {
  if (!anchorRef.value) return

  const rect = anchorRef.value.getBoundingClientRect()
  anchorPosition.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }

  // 同步拖拽点和线条的起始位置
  if (!isDragging.value) {
    gsap.set(draggerRef.value, {
      x: anchorPosition.value.x,
      y: anchorPosition.value.y
    })
    gsap.set(lineRef.value, {
      x: anchorPosition.value.x,
      y: anchorPosition.value.y,
      width: 0,
      rotation: 0
    })
  }
}

// ---------- 更新线条（基于当前拖拽点位置）----------
const updateLine = (draggerX, draggerY) => {
  if (!lineRef.value) return

  const dx = draggerX - anchorPosition.value.x
  const dy = draggerY - anchorPosition.value.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI

  gsap.set(lineRef.value, {
    width: distance,
    rotation: angle
  })
}

// ---------- 事件处理 ----------
const handleMouseDown = (e) => {
  if (!props.active) return

  isDragging.value = true
  e.preventDefault()
  emit('drag-start', e)

  // 创建GSAP上下文以便后续清理
  gsapContext = gsap.context(() => { }, draggerRef.value)

  // 添加全局事件监听
  mouseMoveHandler = (e) => {
    if (!isDragging.value) return

    // 更新拖拽点位置
    gsap.set(draggerRef.value, {
      x: e.clientX,
      y: e.clientY
    })

    // 更新线条
    updateLine(e.clientX, e.clientY)

    emit('drag-move', { x: e.clientX, y: e.clientY })
  }

  mouseUpHandler = () => {
    if (!isDragging.value) return
    handleMouseUp()
  }

  window.addEventListener('mousemove', mouseMoveHandler)
  window.addEventListener('mouseup', mouseUpHandler)
}

const handleMouseUp = () => {
  if (!isDragging.value) return

  isDragging.value = false
  emit('drag-end')

  // 弹性回弹动画
  gsap.to(draggerRef.value, {
    x: anchorPosition.value.x,
    y: anchorPosition.value.y,
    duration: 1.2,
    ease: `elastic.out(${props.elasticity}, 0.3)`,
    onUpdate: function () {
      // 在动画每一帧更新线条
      if (draggerRef.value) {
        const x = draggerRef.value._gsap?.x || anchorPosition.value.x
        const y = draggerRef.value._gsap?.y || anchorPosition.value.y
        updateLine(x, y)
      }
    },
    onComplete: () => {
      emit('reset')
    }
  })

  // 线条颜色脉冲效果
  gsap.to(lineRef.value, {
    backgroundColor: '#ff4757',
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    overwrite: true
  })

  // 清理GSAP上下文
  if (gsapContext) {
    gsapContext.revert()
    gsapContext = null
  }
}

// ---------- 清理事件监听 ----------
const cleanupListeners = () => {
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler)
    mouseMoveHandler = null
  }
  if (mouseUpHandler) {
    window.removeEventListener('mouseup', mouseUpHandler)
    mouseUpHandler = null
  }
}

// ---------- 重置组件状态 ----------
const reset = () => {
  isDragging.value = false
  cleanupListeners()

  gsap.to([draggerRef.value, lineRef.value], {
    x: anchorPosition.value.x,
    y: anchorPosition.value.y,
    width: 0,
    rotation: 0,
    duration: 0.5,
    overwrite: true
  })

  if (gsapContext) {
    gsapContext.revert()
    gsapContext = null
  }
}

// 暴露方法给父组件
defineExpose({
  reset,
  updateAnchorPosition
})

// ---------- 生命周期钩子 ----------
onMounted(() => {
  // 初始化样式
  gsap.set(lineRef.value, {
    height: props.lineThickness,
    transformOrigin: 'left center',
    backgroundColor: props.color
  })

  gsap.set([anchorRef.value, draggerRef.value], {
    width: props.anchorSize,
    height: props.anchorSize,
    borderRadius: '50%'
  })

  gsap.set(draggerRef.value, {
    backgroundColor: 'transparent',
    cursor: props.active ? 'grab' : 'default'
  })

  // 计算初始位置
  nextTick(() => {
    updateAnchorPosition()
  })

  // 监听窗口大小变化
  window.addEventListener('resize', updateAnchorPosition)
})

onUnmounted(() => {
  // 清理所有GSAP动画
  gsap.killTweensOf([lineRef.value, anchorRef.value, draggerRef.value])

  // 清理事件监听
  cleanupListeners()
  window.removeEventListener('resize', updateAnchorPosition)

  // 清理GSAP上下文
  if (gsapContext) {
    gsapContext.revert()
  }
})

// 监听active状态变化
watch(() => props.active, (newVal) => {
  gsap.set(draggerRef.value, {
    cursor: newVal ? 'grab' : 'default'
  })

  if (!newVal && isDragging.value) {
    handleMouseUp()
  }
})

// 监听颜色变化
watch(() => props.color, (newColor) => {
  gsap.set([lineRef.value, anchorRef.value], {
    backgroundColor: newColor
  })
})
</script>

<style scoped>
.rubber-band-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  pointer-events: none;
  /* 容器不拦截事件 */
}

.rubber-band-line,
.rubber-band-anchor,
.rubber-band-dragger {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  /* 子元素可以接收事件 */
}

.rubber-band-anchor {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.rubber-band-dragger {
  z-index: 3;
}

.rubber-band-line {
  z-index: 1;
  transform-origin: left center;
  will-change: width, transform;
}
</style>
