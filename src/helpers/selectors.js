export function getAppointmentsForDay(state, day) {
    const filteredDays = state.days.filter((days) => days.name === day);
    const dayAppts = filteredDays[0];

    if (!dayAppts || dayAppts.length === 0) {
        return [];
    } else {
        const appt = dayAppts.appointments.map((id) => state.appointments[id]);
        return appt;
    }
}
