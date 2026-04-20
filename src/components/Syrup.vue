<template>
  <div class="syrup" :style="syrupStyle"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBeverageStore } from "../stores/beverageStore";

const store = useBeverageStore();

const syrupStyle = computed(() => {
  const color = store.currentSyrup?.color ?? "transparent";
  return {
    background: `repeating-linear-gradient(
      45deg,
      white,
      white 10px,
      ${color} 10px,
      ${color} 20px
    )`,
  };
});
</script>

<style lang="scss" scoped>
.syrup {
  transform: translateY(400%);
  position: relative;
  width: 100%;
  height: 20%;
  animation: pour-tea 2s 1s forwards;
  z-index: 2;
}
</style>
