<template>
  <div class="demo">
    <RubberBand color="#ff6b6b" :anchor-size="24" :elasticity="1.5" @drag-start="handleDragStart"
      @drag-move="handleDragMove" @drag-end="handleDragEnd" />
  </div>
</template>

<script lang="ts" setup>
import RubberBand from '@/content/Components/RubberBand/RubberBand.vue'

const handleDragStart = (e) => {
  console.log('开始拖拽', e)
}

const handleDragMove = (position) => {
  console.log('拖拽中', position)
}

const handleDragEnd = () => {
  console.log('拖拽结束')
}
</script>

<style>
.demo {
  width: 100%;
  height: 100vh;
  background: #1a1a1a;
}
</style>
