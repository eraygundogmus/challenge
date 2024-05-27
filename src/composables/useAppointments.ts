import { ref } from "vue";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

export interface AppointmentFields {
  appointment_id: number;
  appointment_date: string;
  appointment_address: string;
  contact_email: string[];
  contact_phone: number[];
  contact_surname: string[];
  is_cancelled: boolean;
}

export interface Appointment {
  id: string;
  createdTime: string;
  fields: AppointmentFields;
}

const appointments = ref<Appointment[]>([]);
const isLoading = ref(true);

const fetchAppointments = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${
        import.meta.env.VITE_AIRTABLE_BASE_ID
      }/Appointments`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    appointments.value = data.records;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const getStatus = (appointment: Appointment) => {
  if (appointment.fields.is_cancelled) {
    return "Cancelled";
  }
  const appointmentDate = new Date(appointment.fields.appointment_date);
  const now = new Date();
  return appointmentDate >= now ? "Upcoming" : "Completed";
};

const filteredAppointments = (
  appointments: Appointment[],
  searchQuery: string,
  selectedStatus: string,
  dateRange: { start: CalendarDate | null; end: CalendarDate | null }
) => {
  let filtered = appointments;

  if (searchQuery) {
    filtered = filtered.filter((appointment) =>
      Object.values(appointment.fields).some((field) =>
        String(field).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  if (selectedStatus) {
    filtered = filtered.filter(
      (appointment) => getStatus(appointment) === selectedStatus
    );
  }

  if (dateRange?.start && dateRange?.end) {
    filtered = filtered.filter((appointment) => {
      const appointmentDate = new Date(appointment.fields.appointment_date);
      return (
        // @ts-ignore
        appointmentDate >= dateRange.start.toDate(getLocalTimeZone()) &&
        // @ts-ignore
        appointmentDate <= dateRange.end.toDate(getLocalTimeZone())
      );
    });
  }

  return filtered;
};

const updateAppointment = async (
  updatedData: Partial<AppointmentFields>,
  appointmentId: string
) => {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${
        import.meta.env.VITE_AIRTABLE_BASE_ID
      }/Appointments`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
        },
        body: JSON.stringify({
          records: [
            {
              id: appointmentId,
              fields: updatedData,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating appointment:", errorData);
      throw new Error(errorData.error.message || "Network response was not ok");
    }

    // Refresh appointments after update
    await fetchAppointments();
  } catch (error) {
    console.error("Error updating appointment:", error);
    alert(`Error updating appointment: ${(error as Error).message}`);
  }
};

export default function useAppointments() {
  return {
    appointments,
    isLoading,
    fetchAppointments,
    getStatus,
    filteredAppointments,
    updateAppointment,
  };
}
