<template>
  <Mug>
    <Cold v-if="isIced" />
    <Hot v-else />
    <Contents>
      <!-- Only show creamer if one other than "No Cream" is selected -->
      <template v-slot:top>
        <Creamer v-if="store.currentCreamer && store.currentCreamer.id !== 'c1'" />
      </template>

      <!-- Only show syrup if one other than "No Syrup" is selected -->
      <template v-slot:mid>
        <Syrup v-if="store.currentSyrup && store.currentSyrup.id !== 's1'" />
      </template>

      <template v-slot:bottom>
        <Base />
      </template>
    </Contents>
  </Mug>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Contents from "./Contents.vue";
import Mug from "./Mug.vue";
import Syrup from "./Syrup.vue";
import Base from "./Base.vue";
import Creamer from "./Creamer.vue";
import Hot from "./Hot.vue";
import Cold from "./Cold.vue";
import { useBeverageStore } from "../stores/beverageStore";

const store = useBeverageStore();
const isIced = computed(() => store.currentTemp === "Cold");
</script>
