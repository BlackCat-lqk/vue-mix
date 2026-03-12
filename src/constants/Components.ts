const animations = {
  "flow-border": () => import("../demo/Animations/FlowBorderDemo.vue"),
  "liquid-glass": () => import("../demo/Animations/LiquidGlassDemo.vue"),
};
export const componentMap = {
  ...animations,
};
