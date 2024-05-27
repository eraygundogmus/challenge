<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import AppointmentList from "@/components/AppointmentList.vue";
import CreateAppointmentDrawer from "@/components/CreateAppointmentDrawer.vue";

const isCreateDrawerOpen = ref(false);

const openCreateDrawer = () => {
  isCreateDrawerOpen.value = true;
};

const closeCreateDrawer = () => {
  isCreateDrawerOpen.value = false;
};

const refreshAppointments = () => {
  // Logic to refresh appointments list
};
</script>

<template>
  <div class="mx-auto p-4">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-4">Appointment Management System</h1>
      <Button @click="openCreateDrawer" class="btn-primary"
        >Create Appointment</Button
      >
    </div>

    <CreateAppointmentDrawer
      :isOpen="isCreateDrawerOpen"
      @update:isOpen="isCreateDrawerOpen = $event"
      @close="closeCreateDrawer"
      @refreshAppointments="refreshAppointments"
    />
    <AppointmentList />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.btn-primary {
  @apply bg-blue-500 text-white py-2 px-4 rounded;
}
</style>
