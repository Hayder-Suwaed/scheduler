import "components/Application.scss";
import React, { useEffect, useState } from "react";
import Appointment from "components/Appointment";
import DayList from "./DayList";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selectors";
import axios from "axios";

export default function Application(props) {
  const [state, setState] = useState({
    day: "",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    console.log(id, interview);
  }

  const ap = getAppointmentsForDay(state, state.day).map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);

    const bookInterview = (id, interview) => {
      const appointment = {
        ...state.appointments[id],
        interview
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      return axios
        .put(`http://localhost:4000/api/appointments/${id}`, appointment)
        .then(() => setState((prev) => ({ ...prev, appointments })));
    };
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
      />
    );
  });
  // const [days, setDays] = useState([])
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get(`http://localhost:4000/api/days`)),
      Promise.resolve(axios.get(`http://localhost:4000/api/appointments`)),
      Promise.resolve(axios.get(`http://localhost:4000/api/interviewers`))
    ])
      .then((all) => {
        const days = all[0].data;
        const appointments = all[1].data;
        const interviewers = all[2].data;
        setState((prev) => ({
          days: days,
          appointments: appointments,
          interviewers: interviewers
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="LHL"
        />
      </section>
      <section className="schedule">{ap}</section>
    </main>
  );
}
