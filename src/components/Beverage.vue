<template>
  <Mug>
    <Cold v-if="isIced" />
    <Hot v-else />
    <Contents>
      <!-- Task 3: only show creamer if one is selected -->
      <template v-slot:top>
        <Creamer v-if="currentCreamer.id !== 'c1'" />
      </template>

      <!-- Task 3: only show syrup if one is selected -->
      <template v-slot:mid>
        <Syrup v-if="currentSyrup.id !== 's1'" />
      </template>

      <template v-slot:bottom>
        <Base />
      </template>
    </Contents>
  </Mug>
</template>

<script setup lang="ts">
import Contents from "./Contents.vue";
import Mug from "./Mug.vue";
import Syrup from "./Syrup.vue";
import Base from "./Base.vue";
import Creamer from "./Creamer.vue";
import Hot from "./Hot.vue";
import Cold from "./Cold.vue";
import { useBeverageStore } from "../stores/beverageStore";
import { storeToRefs } from "pinia";

const store = useBeverageStore();
const { currentCreamer, currentSyrup } = storeToRefs(store);

type Props = {
  isIced: boolean;
};
defineProps<Props>();
</script>
