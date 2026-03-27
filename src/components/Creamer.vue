<template>
  <div class="froth" :style="{ backgroundColor: '#c6c6c6' }">
    <div v-for="n in 5" :key="n" class="foam" :style="{ backgroundColor: foamColor }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBeverageStore } from "../stores/beverageStore";
import { storeToRefs } from "pinia";
const store = useBeverageStore();
const { currentCreamer } = storeToRefs(store);

// Foam bubbles are slightly lighter/whiter than the creamer base
const foamColor = computed(() => {
  const map: Record<string, string> = {
    c2: "#ffffff",      // Milk -> white foam
    c3: "#F8F4E3",      // Cream -> warm white foam
    c4: "#FFF8DC",      // Half & Half -> light cream foam
  };
  return map[currentCreamer.value.id] ?? "#e4e0d2";
});
</script>

<style lang="scss" scoped>
.froth {
  overflow: visible;
  transform: translateY(400%);
  position: relative;
  height: 20%;
  width: 100%;
  animation: pour-tea 2s 2s forwards;
}
.foam {
  display: block;
  border-radius: 30px;
  height: 40px;
  width: 40px;
  position: absolute;
}

.foam:nth-child(1) { top: 0px;  left: -3px; }
.foam:nth-child(2) { top: 0px;  left: 55px; }
.foam:nth-child(3) { width: 30px; height: 30px; border-radius: 40px; top: 3px; left: 30px; }
.foam:nth-child(4) { width: 30px; height: 30px; border-radius: 45px; top: 5px; right: -2px; }
.foam:nth-child(5) { top: 2px;  right: 10px; }
</style>
