function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.filter((d) => d.name === day);
  const dayAppointments = filteredDay[0];
  if (dayAppointments === undefined || dayAppointments.length === 0) {
    return [];
  } else {
    const detailedAppointments = dayAppointments.appointments.map(
      (id) => state.appointments[id]
    );
    return detailedAppointments;
  }
}

function getInterview(state, interview) {
  if (!interview) return null;
  return {
    ...interview,
    interviewer: state.interviewers[interview.interviewer]
  };
}
export { getAppointmentsForDay, getInterview };
