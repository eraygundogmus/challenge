<template>
  <Drawer :open="isOpen" @update:open="updateOpen">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Create Appointment</DrawerTitle>
        <DrawerDescription
          >Fill in the details to create a new appointment.</DrawerDescription
        >
      </DrawerHeader>
      <div class="p-4 space-y-4">
        <Input
          v-model="newAppointment.appointment_address"
          placeholder="Appointment Address"
        />
        <Input
          v-model="newAppointment.appointment_date"
          placeholder="Appointment Date"
        />
        <Input
          v-model="newAppointment.contact_email[0]"
          placeholder="Contact Email"
        />
        <Input
          v-model="newAppointment.contact_phone[0]"
          placeholder="Contact Phone"
        />
        <Input
          v-model="newAppointment.contact_surname[0]"
          placeholder="Contact Surname"
        />
      </div>
      <DrawerFooter>
        <Button @click="createAppointment">Submit</Button>
        <DrawerClose @click="closeDrawer">
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";
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

interface AppointmentFields {
  appointment_address: string;
  appointment_date: string;
  contact_email: string[];
  contact_phone: number[];
  contact_surname: string[];
}

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["update:isOpen", "close", "refreshAppointments"]);

const newAppointment = ref<AppointmentFields>({
  appointment_address: "",
  appointment_date: "",
  contact_email: [""],
  contact_phone: [0],
  contact_surname: [""],
});

const createAppointment = async () => {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${
        import.meta.env.VITE_AIRTABLE_BASE_ID
      }/Appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
        },
        body: JSON.stringify({
          records: [
            {
              fields: newAppointment.value,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating appointment:", errorData);
      throw new Error(errorData.error.message || "Network response was not ok");
    }

    // Clear form after successful creation
    newAppointment.value = {
      appointment_address: "",
      appointment_date: "",
      contact_email: [""],
      contact_phone: [0],
      contact_surname: [""],
    };

    // Emit events to close the drawer and refresh appointments list
    emit("close");
    emit("refreshAppointments");
  } catch (error) {
    console.error("Error creating appointment:", error);
    alert(`Error creating appointment: ${(error as Error).message}`);
  }
};

const closeDrawer = () => {
  emit("update:isOpen", false);
  emit("close");
};

const updateOpen = (value: boolean) => {
  emit("update:isOpen", value);
};
</script>
