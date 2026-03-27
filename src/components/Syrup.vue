<template>
  <div class="syrup" :style="syrupStyle"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBeverageStore } from "../stores/beverageStore";
import { storeToRefs } from "pinia";
const store = useBeverageStore();
const { currentSyrup } = storeToRefs(store);

const syrupStyle = computed(() => {
  const color = currentSyrup.value.color;
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
