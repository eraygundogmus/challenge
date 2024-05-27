<template>
  <Drawer :open="isOpen" @update:open="updateOpen">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Edit Appointment</DrawerTitle>
        <DrawerDescription
          >Make changes to the appointment below.</DrawerDescription
        >
      </DrawerHeader>
      <div class="p-4 space-y-4">
        <Input
          v-model="editData.appointment_address"
          placeholder="Appointment Address"
        />
        <Input
          v-model="editData.appointment_date"
          placeholder="Appointment Date"
        />
        <Input
          v-model="editData.contact_email[0]"
          placeholder="Contact Email"
        />
        <Input
          v-model="editData.contact_phone[0]"
          placeholder="Contact Phone"
        />
        <Input
          v-model="editData.contact_surname[0]"
          placeholder="Contact Surname"
        />
      </div>
      <DrawerFooter>
        <Button @click="submitEdit">Submit</Button>
        <DrawerClose @click="closeDrawer">
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from "vue";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAppointments from "@/composables/useAppointments";

const props = defineProps<{
  isOpen: boolean;
  appointment: Partial<AppointmentFields>;
}>();
const emit = defineEmits(["update:isOpen", "refreshAppointments"]);

const { updateAppointment } = useAppointments();

const editData = ref<Partial<AppointmentFields>>({});

watch(
  () => props.appointment,
  (newAppointment) => {
    editData.value = { ...newAppointment };
  }
);

const submitEdit = async () => {
  if (!editData.value || !editData.value.appointment_id) return;

  await updateAppointment(editData.value, editData.value.appointment_id);
  emit("refreshAppointments");
  closeDrawer();
};

const closeDrawer = () => {
  emit("update:isOpen", false);
};

const updateOpen = (value: boolean) => {
  emit("update:isOpen", value);
};
</script>
