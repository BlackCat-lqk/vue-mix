const animations = {
  "flow-border": () => import("../demo/Animations/FlowBorderDemo.vue"),
  "liquid-glass": () => import("../demo/Animations/LiquidGlassDemo.vue"),
};
const components = {
  "rubber-band": () => import("../demo/Components/RubberBandDemo.vue"),
  "skeleton-loader": () => import("../demo/Components/SkeletonLoaderDemo.vue"),
};
export const componentMap = {
  ...animations,
  ...components,
};
