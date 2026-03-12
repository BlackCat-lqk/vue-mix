<template>
  <div
    ref="containerRef"
    class="liquid-glass-container"
    :style="containerStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <canvas ref="canvasRef" class="glass-canvas"></canvas>
    <div class="glass-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

// 扩展 CanvasRenderingContext2D 类型
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r: number): CanvasRenderingContext2D
  }
}

// Props 定义
interface Props {
  /** 宽度 (默认 400px) */
  width?: string | number
  /** 高度 (默认 300px) */
  height?: string | number
  /** 圆角大小 (默认 24px) */
  radius?: string | number
  /** 模糊强度 (默认 10px) */
  blurStrength?: number
  /** 折射强度 (默认 50) */
  refractionStrength?: number
  /** 边缘光晕强度 (默认 0.8) */
  edgeGlow?: number
  /** 色差强度 (默认 2) */
  chromaticStrength?: number
  /** 玻璃透明度 (默认 0.3) */
  glassOpacity?: number
  /** 背景颜色 (默认渐变) */
  background?: string
  /** 是否启用动态波纹 */
  enableRipples?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '400px',
  height: '300px',
  radius: '24px',
  blurStrength: 10,
  refractionStrength: 50,
  edgeGlow: 0.8,
  chromaticStrength: 2,
  glassOpacity: 0.3,
  background: '',
  enableRipples: true
})

// 容器样式
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  borderRadius: typeof props.radius === 'number' ? `${props.radius}px` : props.radius
}))

// 内容区域样式
const contentStyle = computed(() => ({
  borderRadius: typeof props.radius === 'number' ? `${props.radius}px` : props.radius
}))

// DOM 元素引用
const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

// 画布尺寸
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// 鼠标位置状态
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)

// 波纹数组
interface Ripple {
  x: number
  y: number
  radius: number
  strength: number
  life: number
}

const ripples = ref<Ripple[]>([])

// 动画帧
let animationFrame: number
let lastTime = 0

// 工具函数：解析圆角值
const parseRadius = (): number => {
  if (typeof props.radius === 'number') return props.radius
  if (typeof props.radius === 'string') {
    const match = props.radius.match(/^(\d+)(?:px)?$/)
    return match ? parseInt(match[1]) : 24
  }
  return 24
}

// 工具函数：限制数值范围
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

// 初始化 Canvas
const initCanvas = () => {
  if (!canvasRef.value || !containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  canvasWidth.value = rect.width
  canvasHeight.value = rect.height

  canvasRef.value.width = rect.width
  canvasRef.value.height = rect.height
}

// 处理鼠标移动
const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((e.clientY - rect.top) / rect.height) * 2 - 1

  mouseX.value = clamp(x, -1, 1)
  mouseY.value = clamp(y, -1, 1)
  isHovering.value = true

  // 随机添加波纹
  if (props.enableRipples && Math.random() > 0.8) {
    const rippleX = e.clientX - rect.left
    const rippleY = e.clientY - rect.top
    addRipple(rippleX, rippleY)
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
  mouseX.value = 0
  mouseY.value = 0
}

// 添加波纹
const addRipple = (x: number, y: number) => {
  ripples.value.push({
    x,
    y,
    radius: 5,
    strength: 0.8,
    life: 1.0
  })
}

// 更新波纹
const updateRipples = () => {
  ripples.value = ripples.value.filter(ripple => {
    ripple.radius += 2
    ripple.life -= 0.015
    ripple.strength *= 0.99
    return ripple.life > 0.1
  })
}

// 绘制背景
const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.save()

  if (props.background) {
    // 使用自定义背景
    ctx.fillStyle = props.background
  } else {
    // 创建默认渐变背景
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#4158D0')
    gradient.addColorStop(0.3, '#C850C0')
    gradient.addColorStop(0.6, '#FFCC70')
    gradient.addColorStop(1, '#45b7d1')
    ctx.fillStyle = gradient
  }

  // 应用背景模糊
  ctx.filter = `blur(${props.blurStrength}px)`

  const radius = parseRadius()
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, radius)
  ctx.fill()

  ctx.restore()
}

// 绘制玻璃层
const drawGlassLayer = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.save()

  const radius = parseRadius()
  const centerX = w / 2
  const centerY = h / 2

  // 根据鼠标位置计算光源偏移
  const offsetX = mouseX.value * props.refractionStrength
  const offsetY = mouseY.value * props.refractionStrength

  // 主光源（高光）
  const lightX = centerX + offsetX
  const lightY = centerY + offsetY

  // 创建径向渐变模拟玻璃折射
  const gradient = ctx.createRadialGradient(
    lightX, lightY, 0,
    centerX, centerY, Math.max(w, h)
  )

  // 多层玻璃渐变
  gradient.addColorStop(0, `rgba(255, 255, 255, ${props.glassOpacity * 1.5})`)
  gradient.addColorStop(0.3, `rgba(255, 255, 255, ${props.glassOpacity * 0.8})`)
  gradient.addColorStop(0.6, `rgba(255, 255, 255, ${props.glassOpacity * 0.4})`)
  gradient.addColorStop(1, `rgba(255, 255, 255, ${props.glassOpacity * 0.1})`)

  ctx.fillStyle = gradient

  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, radius)
  ctx.fill()

  ctx.restore()
}

// 绘制边缘高光
const drawEdgeHighlights = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.save()

  const radius = parseRadius()
  const strength = props.edgeGlow * (0.8 + 0.2 * Math.sin(Date.now() * 0.002))

  // 边缘渐变 - 根据鼠标位置调整
  const edgeGradient = ctx.createLinearGradient(
    w * (0.5 + mouseX.value * 0.2),
    h * (0.5 + mouseY.value * 0.2),
    w * (0.5 - mouseX.value * 0.2),
    h * (0.5 - mouseY.value * 0.2)
  )

  edgeGradient.addColorStop(0, `rgba(255, 255, 255, ${strength * 0.8})`)
  edgeGradient.addColorStop(0.3, `rgba(255, 255, 255, ${strength * 0.2})`)
  edgeGradient.addColorStop(0.7, `rgba(255, 255, 255, ${strength * 0.2})`)
  edgeGradient.addColorStop(1, `rgba(255, 255, 255, ${strength * 0.8})`)

  ctx.strokeStyle = edgeGradient
  ctx.lineWidth = 2 + Math.abs(mouseX.value) * 1.5

  ctx.beginPath()
  ctx.roundRect(2, 2, w - 4, h - 4, radius - 2)
  ctx.stroke()

  // 绘制角部高光
  drawCornerHighlights(ctx, w, h, strength)

  ctx.restore()
}

// 绘制角部高光
const drawCornerHighlights = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  strength: number
) => {
  const corners = [
    [0, 0, 1, 1],     // 左上
    [w, 0, -1, 1],    // 右上
    [0, h, 1, -1],    // 左下
    [w, h, -1, -1]    // 右下
  ]

  corners.forEach(([x, y, dirX, dirY]) => {
    // 根据鼠标位置调整角部高光强度
    const cornerFactor = 0.5 + 0.5 * (
      (dirX * mouseX.value + dirY * mouseY.value) / 2
    )

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 60)
    gradient.addColorStop(0, `rgba(255, 255, 255, ${strength * cornerFactor * 0.4})`)
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${strength * cornerFactor * 0.1})`)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, 60, 0, Math.PI * 2)
    ctx.fill()
  })
}

// 绘制色差效果
const drawChromaticAberration = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  if (props.chromaticStrength <= 0) return

  ctx.save()

  const radius = parseRadius()
  const strength = props.chromaticStrength * (0.5 + 0.5 * Math.abs(mouseX.value + mouseY.value) / 2)

  // 创建剪切蒙版
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, radius)
  ctx.clip()

  // 红色通道偏移
  ctx.shadowColor = 'rgba(255, 50, 50, 0.5)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 3 + mouseX.value * 3
  ctx.shadowOffsetY = 3 + mouseY.value * 3

  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)'
  ctx.fillRect(0, 0, w, h)

  // 蓝色通道偏移
  ctx.shadowColor = 'rgba(50, 100, 255, 0.5)'
  ctx.shadowOffsetX = -3 - mouseX.value * 3
  ctx.shadowOffsetY = -3 - mouseY.value * 3

  ctx.fillRect(0, 0, w, h)

  ctx.restore()
}

// 绘制波纹
const drawRipples = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  if (!props.enableRipples || ripples.value.length === 0) return

  ctx.save()

  const radius = parseRadius()
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, radius)
  ctx.clip()

  ripples.value.forEach(ripple => {
    const opacity = ripple.strength * ripple.life * 0.5

    // 波纹内圈
    const innerGradient = ctx.createRadialGradient(
      ripple.x, ripple.y, 0,
      ripple.x, ripple.y, ripple.radius * 0.5
    )
    innerGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`)
    innerGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

    ctx.fillStyle = innerGradient
    ctx.beginPath()
    ctx.arc(ripple.x, ripple.y, ripple.radius * 0.5, 0, Math.PI * 2)
    ctx.fill()

    // 波纹外圈
    const outerGradient = ctx.createRadialGradient(
      ripple.x, ripple.y, ripple.radius * 0.3,
      ripple.x, ripple.y, ripple.radius
    )
    outerGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`)
    outerGradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.1})`)
    outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = outerGradient
    ctx.beginPath()
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.restore()
}

// 绘制玻璃质感纹理
const drawGlassTexture = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.save()

  const radius = parseRadius()
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, radius)
  ctx.clip()

  // 添加细微的噪点纹理
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // 只在特定像素添加噪点
    if (Math.random() > 0.99) {
      data[i] = Math.min(255, data[i] + 20)     // R
      data[i + 1] = Math.min(255, data[i + 1] + 20) // G
      data[i + 2] = Math.min(255, data[i + 2] + 20) // B
    }
  }

  ctx.putImageData(imageData, 0, 0)
  ctx.restore()
}

// 主渲染函数
const render = () => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d', { alpha: true })
  if (!ctx || !canvas || canvasWidth.value === 0 || canvasHeight.value === 0) return

  const w = canvasWidth.value
  const h = canvasHeight.value

  // 清除画布
  ctx.clearRect(0, 0, w, h)

  // 按顺序绘制各个层
  drawBackground(ctx, w, h)
  drawGlassLayer(ctx, w, h)

  if (props.enableRipples) {
    updateRipples()
    drawRipples(ctx, w, h)
  }

  drawEdgeHighlights(ctx, w, h)
  drawChromaticAberration(ctx, w, h)
  drawGlassTexture(ctx, w, h)
}

// 动画循环
const animate = (timestamp: number) => {
  // 限制帧率到 60fps
  if (timestamp - lastTime > 16) {
    render()
    lastTime = timestamp
  }

  animationFrame = requestAnimationFrame(animate)
}

// 窗口大小变化处理
const handleResize = () => {
  initCanvas()
  render()
}

// 生命周期钩子
onMounted(() => {
  initCanvas()
  animate(0)

  window.addEventListener('resize', handleResize)

  // 监听容器大小变化
  if (containerRef.value) {
    const resizeObserver = new ResizeObserver(() => {
      initCanvas()
      render()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', handleResize)
})

// 监听属性变化重新渲染
watch(() => [
  props.blurStrength,
  props.refractionStrength,
  props.edgeGlow,
  props.chromaticStrength,
  props.glassOpacity,
  props.background,
  props.enableRipples
], () => {
  render()
})
</script>

<style scoped>
.liquid-glass-container {
  position: relative;
  overflow: hidden;
  background: transparent;
  isolation: isolate;
}

.glass-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 0;
}

.glass-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  pointer-events: none;
  backdrop-filter: blur(0px); /* 用于硬件加速 */
  transform: translateZ(0); /* 启用 GPU 加速 */
}

/* 确保内容区域也有圆角 */
.glass-content {
  border-radius: inherit;
}

/* 添加过渡效果 */
.liquid-glass-container * {
  transition: text-shadow 0.3s ease;
}
</style>
