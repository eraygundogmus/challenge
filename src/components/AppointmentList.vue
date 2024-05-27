<template>
  <div>
    <div class="flex justify-between items-center my-4">
      <Input
        v-model="searchQuery"
        placeholder="Search..."
        class="w-full mr-2"
      />
      <Select v-model="selectedStatus" class="w-full mr-2">
        <SelectTrigger>
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          <SelectItem value="Upcoming">Upcoming</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Popover class="w-full ml-2">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="
              cn(
                'w-full justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )
            "
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            <template v-if="dateRange.start">
              <template v-if="dateRange.end">
                {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }} -
                {{ df.format(dateRange.end.toDate(getLocalTimeZone())) }}
              </template>
              <template v-else>
                {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }}
              </template>
            </template>
            <template v-else>Pick a date</template>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <RangeCalendar
            v-model="dateRange"
            initial-focus
            :number-of-months="2"
          />
        </PopoverContent>
      </Popover>
    </div>

    <Table v-if="!isLoading && paginatedAppointments.length > 0">
      <TableCaption>A list of appointments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[200px]">Address</TableHead>
          <TableHead>Appointment ID</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Surname</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="appointment in paginatedAppointments"
          :key="appointment.id"
          @click="openDrawer(appointment)"
          class="cursor-pointer"
        >
          <TableCell>{{ appointment.fields.appointment_address }}</TableCell>
          <TableCell>{{ appointment.fields.appointment_id }}</TableCell>
          <TableCell>{{ appointment.fields.contact_phone[0] }}</TableCell>
          <TableCell>{{ appointment.fields.contact_email[0] }}</TableCell>
          <TableCell>{{
            formatDate(appointment.fields.appointment_date)
          }}</TableCell>
          <TableCell>{{ appointment.fields.contact_surname[0] }}</TableCell>
          <TableCell>
            <span
              :class="{
                'bg-green-100 text-green-800':
                  getStatus(appointment) === 'Upcoming',
                'bg-red-100 text-red-800':
                  getStatus(appointment) === 'Cancelled',
                'bg-blue-100 text-blue-800':
                  getStatus(appointment) === 'Completed',
              }"
              class="px-2 py-1 rounded-full"
            >
              {{ getStatus(appointment) }}
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-else-if="!isLoading && paginatedAppointments.length === 0">
      <p>No appointments found.</p>
    </div>
    <div v-else>
      <div v-for="n in 10" :key="n" class="flex justify-between p-4 border-b">
        <Skeleton class="w-[200px] h-[20px] rounded-full" />
        <Skeleton class="w-[100px] h-[20px] rounded-full" />
        <Skeleton class="w-[100px] h-[20px] rounded-full" />
        <Skeleton class="w-[200px] h-[20px] rounded-full" />
        <Skeleton class="w-[100px] h-[20px] rounded-full" />
        <Skeleton class="w-[100px] h-[20px] rounded-full" />
      </div>
    </div>

    <div class="pagination flex justify-between items-center mt-4">
      <Button @click="prevPage" :disabled="currentPage === 1">Previous</Button>
      <span>Page {{ currentPage }}</span>
      <Button @click="nextPage" :disabled="currentPage === totalPages"
        >Next</Button
      >
    </div>

    <!-- Drawer Component for Editing Appointments -->
    <EditAppointmentDrawer
      :isOpen="isDrawerOpen"
      :appointment="editAppointmentData"
      @update:isOpen="isDrawerOpen = $event"
      @refreshAppointments="fetchAppointments"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import useAppointments, {
  Appointment,
  AppointmentFields,
} from "@/composables/useAppointments";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import EditAppointmentDrawer from "./EditAppointmentDrawer.vue";

const {
  appointments,
  isLoading,
  fetchAppointments,
  getStatus,
  filteredAppointments,
} = useAppointments();

const currentPage = ref(1);
const itemsPerPage = 10;
const searchQuery = ref("");
const selectedStatus = ref("");
const dateRange = ref<{ start: CalendarDate | null; end: CalendarDate | null }>(
  {
    start: null,
    end: null,
  }
);
const isDrawerOpen = ref(false);
const editAppointmentData = ref<Partial<AppointmentFields>>({});
const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const paginatedAppointments = computed(() => {
  return filteredAppointments(
    appointments.value,
    searchQuery.value,
    selectedStatus.value,
    dateRange.value as any
  ).slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  );
});

const totalPages = computed(() => {
  return Math.ceil(
    filteredAppointments(
      appointments.value,
      searchQuery.value,
      selectedStatus.value,
      dateRange.value as any
    ).length / itemsPerPage
  );
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const openDrawer = (appointment: Appointment) => {
  editAppointmentData.value = { ...appointment.fields };
  isDrawerOpen.value = true;
};

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchAppointments();
});

watch(filteredAppointments, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});
</script>
